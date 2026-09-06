from __future__ import annotations

import argparse
import base64
import io
import json
import math
import os
import re
import subprocess
import sys
import time
from pathlib import Path
from typing import Any

import requests
from openai import OpenAI
from PIL import Image
from pydub import AudioSegment

ROOT = Path(__file__).resolve().parent
CONFIG = ROOT / "config"
EPISODES = ROOT / "episodes"


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def run(cmd: list[Any]) -> None:
    pretty = " ".join(str(x) for x in cmd)
    print("+", pretty, flush=True)
    subprocess.run([str(x) for x in cmd], check=True)


def episode_dir(slug: str) -> Path:
    ep = EPISODES / slug
    if not ep.exists():
        raise FileNotFoundError(f"Episode not found: {ep}")
    return ep


def load_episode(slug: str) -> dict:
    ep = episode_dir(slug)
    meta = read_json(ep / "episode.json") if (ep / "episode.json").exists() else {}
    meta.setdefault("slug", slug)
    meta.setdefault("title", slug)
    return meta


def split_sentences(text: str) -> list[str]:
    text = text.strip()
    if not text:
        return []
    return [x.strip() for x in re.findall(r".+?[。！？!?](?:[」』】])?|.+$", text, flags=re.S) if x.strip()]


def split_for_tts(text: str, max_chars: int) -> list[str]:
    text = text.strip()
    if not text:
        return []
    if len(text) <= max_chars:
        return [text]

    out: list[str] = []
    rest = text
    punctuation = "、，,；;：:。！？!?"
    while len(rest) > max_chars:
        window = rest[: max_chars + 1]
        cuts = [i + 1 for i, c in enumerate(window) if c in punctuation]
        good = [c for c in cuts if c >= max(14, int(max_chars * 0.52))]
        cut = good[-1] if good else max_chars
        out.append(rest[:cut].strip())
        rest = rest[cut:].strip()
    if rest:
        out.append(rest)
    return out


def segment_script(slug: str, force: bool = False) -> dict:
    ep = episode_dir(slug)
    out = ep / "work" / "segments.json"
    if out.exists() and not force:
        return read_json(out)

    pipe = read_json(CONFIG / "pipeline.json")
    script = (ep / "script.txt").read_text(encoding="utf-8").strip()
    if not script:
        raise RuntimeError("script.txt is empty")

    max_tts = int(pipe.get("tts_segment_max_chars", 38))
    target = int(pipe.get("scene_target_chars", 125))
    max_scene = int(pipe.get("scene_max_chars", 170))

    paragraphs = [p.strip() for p in re.split(r"\n\s*\n", script) if p.strip()]
    units: list[dict] = []
    unit_no = 1
    for p_index, paragraph in enumerate(paragraphs):
        sentence_list = split_sentences(paragraph)
        paragraph_units: list[dict] = []
        for sentence in sentence_list:
            for piece in split_for_tts(sentence, max_tts):
                row = {
                    "unit_id": f"u{unit_no:04d}",
                    "text": piece,
                    "paragraph_index": p_index,
                    "paragraph_end": False,
                }
                units.append(row)
                paragraph_units.append(row)
                unit_no += 1
        if paragraph_units:
            paragraph_units[-1]["paragraph_end"] = True

    scenes: list[dict] = []
    current: list[dict] = []
    current_chars = 0

    def flush() -> None:
        nonlocal current, current_chars
        if not current:
            return
        idx = len(scenes) + 1
        scenes.append({
            "scene_id": f"s{idx:03d}",
            "unit_ids": [u["unit_id"] for u in current],
            "narration_text": "".join(u["text"] for u in current),
            "visual": None,
        })
        current = []
        current_chars = 0

    for unit in units:
        n = len(unit["text"])
        if current and current_chars + n > max_scene:
            flush()
        current.append(unit)
        current_chars += n
        if unit["paragraph_end"] and current_chars >= int(target * 0.65):
            flush()
        elif current_chars >= target:
            flush()
    flush()

    result = {
        "script_chars": len(script),
        "units": units,
        "scenes": scenes,
    }
    write_json(out, result)
    print(f"Segmented {len(units)} TTS units into {len(scenes)} visual scenes", flush=True)
    return result


def _json_from_text(text: str) -> dict:
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        start = text.find("{")
        end = text.rfind("}")
        if start >= 0 and end > start:
            return json.loads(text[start : end + 1])
        raise


def openai_client() -> OpenAI:
    key = os.getenv("OPENAI_API_KEY", "").strip()
    if not key:
        raise RuntimeError(
            "OPENAI_API_KEY is not set. Add it as a GitHub Actions repository secret."
        )
    return OpenAI(api_key=key)


def fallback_visual(scene: dict) -> dict:
    narration = scene["narration_text"]
    return {
        "scene_id": scene["scene_id"],
        "visual_summary": narration[:90],
        "image_prompt": (
            "Create a concrete cinematic scene that directly illustrates the following Japanese narration: "
            + narration
        ),
        "motion_hint": "drift",
    }


def plan_visuals(slug: str, force: bool = False) -> dict:
    ep = episode_dir(slug)
    seg = segment_script(slug)
    out = ep / "work" / "scene_plan.json"
    if out.exists() and not force:
        return read_json(out)

    client = openai_client()
    pipe = read_json(CONFIG / "pipeline.json")
    style = read_json(CONFIG / "style.json")
    meta = load_episode(slug)
    model = os.getenv("PLANNER_MODEL", pipe.get("planner_model", "gpt-5.6-luna"))
    batch_size = int(pipe.get("planner_batch_size", 18))
    all_plans: list[dict] = []
    scenes = seg["scenes"]

    for offset in range(0, len(scenes), batch_size):
        batch = scenes[offset : offset + batch_size]
        scene_payload = [
            {"scene_id": s["scene_id"], "narration": s["narration_text"]}
            for s in batch
        ]
        prompt = f"""
You are the visual director for a Japanese long-form intellectual YouTube essay.
Episode title: {meta.get('title', slug)}

For EVERY scene below, design one still image that directly matches the exact narration of that scene.
The previous failure mode was using generic images based on position in the script. Do NOT do that.

Rules:
- Keep every scene_id exactly unchanged and return every scene exactly once.
- Read the narration semantically. Depict the specific experiment, historical setting, social situation, object, or concept currently being explained.
- If the narration names an experiment, depict the experimental setup rather than a generic portrait.
- If it explains an economic/game-theory concept, prefer a grounded visual situation or object that embodies that concept.
- If historical, use historically plausible clothing, rooms, technology and lighting.
- If modern Japan is implied, use a realistic Japanese setting and adult Japanese people where relevant.
- Do not put any text, subtitles, labels, numbers, charts, UI, logos or watermarks inside the image.
- Avoid repeating the same office/portrait composition for unrelated concepts.
- Image should be cinematic, quiet, intelligent and suitable for nighttime viewing.
- motion_hint must be one of: zoom_in, zoom_out, pan_left, pan_right, pan_up, pan_down, diagonal_up_right, drift.

Channel style:
{style['channel_style']}

Return JSON only in this exact shape:
{{"scenes":[{{"scene_id":"s001","visual_summary":"...","image_prompt":"...","motion_hint":"drift"}}]}}

Scenes:
{json.dumps(scene_payload, ensure_ascii=False)}
""".strip()
        try:
            response = client.responses.create(model=model, input=prompt)
            parsed = _json_from_text(response.output_text)
            returned = {x.get("scene_id"): x for x in parsed.get("scenes", [])}
        except Exception as exc:
            print(f"Planner batch failed: {exc}", file=sys.stderr, flush=True)
            returned = {}

        for scene in batch:
            item = returned.get(scene["scene_id"]) or fallback_visual(scene)
            item["scene_id"] = scene["scene_id"]
            all_plans.append(item)

    by_id = {x["scene_id"]: x for x in all_plans}
    negatives = "; ".join(style.get("negative_rules", []))
    final_scenes = []
    for i, scene in enumerate(scenes):
        visual = by_id[scene["scene_id"]]
        prompt = (
            f"{style['channel_style']}. "
            f"{style['composition_rule']} "
            f"Narration context: {scene['narration_text']} "
            f"Visual direction: {visual.get('image_prompt', visual.get('visual_summary', ''))}. "
            f"{style['aspect_rule']}. Negative rules: {negatives}."
        )
        final_scenes.append({
            **scene,
            "visual": {
                "visual_summary": visual.get("visual_summary", ""),
                "image_prompt": prompt,
                "motion_hint": visual.get("motion_hint", "drift"),
            },
        })

    plan = {"units": seg["units"], "scenes": final_scenes}
    write_json(out, plan)
    print(f"Planned visuals for {len(final_scenes)} scenes", flush=True)
    return plan


def _save_image_result(result: Any, out: Path) -> None:
    item = result.data[0]
    raw: bytes | None = None
    b64 = getattr(item, "b64_json", None)
    if b64:
        raw = base64.b64decode(b64)
    else:
        url = getattr(item, "url", None)
        if url:
            r = requests.get(url, timeout=180)
            r.raise_for_status()
            raw = r.content
    if not raw:
        raise RuntimeError("Image API returned no image bytes")

    image = Image.open(io.BytesIO(raw)).convert("RGB")
    target_ratio = 16 / 9
    ratio = image.width / image.height
    if ratio > target_ratio:
        new_w = int(image.height * target_ratio)
        left = (image.width - new_w) // 2
        image = image.crop((left, 0, left + new_w, image.height))
    else:
        new_h = int(image.width / target_ratio)
        top = (image.height - new_h) // 2
        image = image.crop((0, top, image.width, top + new_h))
    out.parent.mkdir(parents=True, exist_ok=True)
    image.save(out, "PNG", optimize=True)


def generate_images(slug: str, force: bool = False) -> None:
    ep = episode_dir(slug)
    plan = plan_visuals(slug)
    pipe = read_json(CONFIG / "pipeline.json")
    client = openai_client()
    model = os.getenv("IMAGE_MODEL", pipe.get("image_model", "gpt-image-2"))
    quality = os.getenv("IMAGE_QUALITY", pipe.get("image_quality", "high"))
    size = pipe.get("image_size", "1536x1024")
    interval = float(pipe.get("image_min_interval_sec", 13))
    max_retries = int(pipe.get("image_max_retries", 8))
    reuse = bool(pipe.get("reuse_existing_images", True))
    image_dir = ep / "assets" / "images"
    image_dir.mkdir(parents=True, exist_ok=True)

    last_call = 0.0
    for idx, scene in enumerate(plan["scenes"], 1):
        out = image_dir / f"{scene['scene_id']}.png"
        if out.exists() and reuse and not force:
            print(f"[{idx}/{len(plan['scenes'])}] cache {out.name}", flush=True)
            continue

        for attempt in range(1, max_retries + 1):
            wait = interval - (time.monotonic() - last_call)
            if wait > 0:
                time.sleep(wait)
            try:
                print(f"[{idx}/{len(plan['scenes'])}] image {scene['scene_id']} attempt {attempt}", flush=True)
                last_call = time.monotonic()
                result = client.images.generate(
                    model=model,
                    prompt=scene["visual"]["image_prompt"],
                    size=size,
                    quality=quality,
                )
                _save_image_result(result, out)
                break
            except Exception as exc:
                if attempt >= max_retries:
                    raise
                delay = min(90, 8 * attempt)
                print(f"Image generation retry after {delay}s: {exc}", file=sys.stderr, flush=True)
                time.sleep(delay)


def apply_tts_replacements(text: str, ep: Path) -> str:
    common_path = CONFIG / "tts_replacements.json"
    episode_path = ep / "tts_replacements.json"
    replacements: dict[str, str] = {}
    if common_path.exists():
        replacements.update(read_json(common_path))
    if episode_path.exists():
        replacements.update(read_json(episode_path))
    for src, dst in replacements.items():
        text = text.replace(src, dst)
    return text


def voicevox_health(url: str) -> str:
    r = requests.get(url.rstrip("/") + "/version", timeout=20)
    r.raise_for_status()
    return r.text.strip()


def synthesize_voice(slug: str, force: bool = False) -> dict:
    ep = episode_dir(slug)
    plan = plan_visuals(slug)
    cfg = read_json(CONFIG / "tts.json")
    url = os.getenv("VOICEVOX_URL", "http://127.0.0.1:50021").rstrip("/")
    speaker = int(os.getenv("VOICEVOX_SPEAKER_ID", cfg.get("speaker_id", 10000)))
    print("VOICEVOX Nemo", voicevox_health(url), "speaker", speaker, flush=True)

    audio_dir = ep / "assets" / "audio"
    audio_dir.mkdir(parents=True, exist_ok=True)
    output_dir = ep / "output"
    output_dir.mkdir(parents=True, exist_ok=True)

    unit_map = {u["unit_id"]: u for u in plan["units"]}
    ordered_units = plan["units"]
    combined = AudioSegment.silent(duration=0, frame_rate=48000)
    timeline_units: list[dict] = []
    cursor = 0.0

    for idx, unit in enumerate(ordered_units, 1):
        unit_id = unit["unit_id"]
        wav = audio_dir / f"{unit_id}.wav"
        tts_text = apply_tts_replacements(unit["text"], ep)
        if force or not wav.exists():
            print(f"[{idx}/{len(ordered_units)}] voice {unit_id}", flush=True)
            q = requests.post(
                url + "/audio_query",
                params={"text": tts_text, "speaker": speaker},
                timeout=90,
            )
            q.raise_for_status()
            query = q.json()
            for key in [
                "speedScale", "pitchScale", "intonationScale", "volumeScale",
                "prePhonemeLength", "postPhonemeLength", "outputSamplingRate", "outputStereo",
            ]:
                if key in cfg:
                    query[key] = cfg[key]
            s = requests.post(
                url + "/synthesis",
                params={"speaker": speaker},
                json=query,
                timeout=180,
            )
            s.raise_for_status()
            wav.write_bytes(s.content)

        audio = AudioSegment.from_wav(wav)
        start = cursor
        end = start + len(audio) / 1000.0
        combined += audio
        pause_ms = int(cfg.get("paragraph_pause_ms", 220) if unit.get("paragraph_end") else cfg.get("segment_pause_ms", 130))
        if pause_ms:
            combined += AudioSegment.silent(duration=pause_ms, frame_rate=48000)
        after = end + pause_ms / 1000.0
        timeline_units.append({
            "unit_id": unit_id,
            "text": unit["text"],
            "start": start,
            "end": end,
            "after": after,
        })
        cursor = after

    narration = audio_dir / "narration.wav"
    combined.export(narration, format="wav")

    unit_times = {x["unit_id"]: x for x in timeline_units}
    scene_times = []
    for scene in plan["scenes"]:
        rows = [unit_times[u] for u in scene["unit_ids"]]
        scene_times.append({
            "scene_id": scene["scene_id"],
            "unit_ids": scene["unit_ids"],
            "start": rows[0]["start"],
            "end": rows[-1]["after"],
            "duration": rows[-1]["after"] - rows[0]["start"],
            "motion": scene["visual"].get("motion_hint", "drift"),
        })

    timeline = {
        "total_duration": len(combined) / 1000.0,
        "units": timeline_units,
        "scenes": scene_times,
    }
    write_json(output_dir / "timeline.json", timeline)
    return timeline


def srt_time(sec: float) -> str:
    ms_total = max(0, int(round(sec * 1000)))
    h, rem = divmod(ms_total, 3_600_000)
    m, rem = divmod(rem, 60_000)
    s, ms = divmod(rem, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


def wrap_subtitle(text: str, line_chars: int) -> str:
    text = "".join(text.split())
    if len(text) <= line_chars:
        return text
    if len(text) <= line_chars * 2:
        mid = len(text) // 2
        candidates = [
            i + 1 for i, c in enumerate(text)
            if c in "、，,。！？!?；;：:" and abs((i + 1) - mid) <= 7
        ]
        cut = min(candidates, key=lambda x: abs(x - mid)) if candidates else mid
        return text[:cut] + "\n" + text[cut:]
    # TTS segmentation normally prevents this path.
    return text[:line_chars] + "\n" + text[line_chars : line_chars * 2]


def build_subtitles(slug: str, timeline: dict | None = None) -> Path:
    ep = episode_dir(slug)
    if timeline is None:
        timeline = read_json(ep / "output" / "timeline.json")
    cfg = read_json(CONFIG / "render.json")
    line_chars = int(cfg.get("subtitle_line_chars", 19))
    out = ep / "output" / "subtitles.srt"
    with out.open("w", encoding="utf-8") as f:
        for idx, unit in enumerate(timeline["units"], 1):
            f.write(
                f"{idx}\n{srt_time(unit['start'])} --> {srt_time(unit['end'])}\n"
                f"{wrap_subtitle(unit['text'], line_chars)}\n\n"
            )
    return out


def motion_filter(motion: str, frames: int, cfg: dict) -> str:
    w, h, fps = int(cfg["width"]), int(cfg["height"]), int(cfg["fps"])
    scale = float(cfg.get("motion_source_scale", 5.5))
    z0 = float(cfg.get("motion_zoom_min", 1.04))
    z1 = float(cfg.get("motion_zoom_max", 1.18))
    span = float(cfg.get("motion_pan_span", 0.90))
    src_w = max(w + 512, int(round(w * scale)))
    src_h = max(h + 288, int(round(h * scale)))
    n = max(frames - 1, 1)
    p = f"on/{n}"
    e = f"(({p})*({p})*({p})*((({p})*(6*({p})-15))+10))"
    avail_x = "(iw-iw/zoom)"
    avail_y = "(ih-ih/zoom)"
    cx = f"{avail_x}/2"
    cy = f"{avail_y}/2"
    edge = (1.0 - span) / 2.0
    zm = (z0 + z1) / 2.0

    if motion == "zoom_out":
        z = f"{z1}-({z1-z0})*{e}"; x, y = cx, cy
    elif motion == "pan_left":
        z = f"{zm:.5f}"; x = f"{avail_x}*({1-edge:.5f}-{span:.5f}*{e})"; y = cy
    elif motion == "pan_right":
        z = f"{zm:.5f}"; x = f"{avail_x}*({edge:.5f}+{span:.5f}*{e})"; y = cy
    elif motion == "pan_up":
        z = f"{zm:.5f}"; x = cx; y = f"{avail_y}*({1-edge:.5f}-{span:.5f}*{e})"
    elif motion == "pan_down":
        z = f"{zm:.5f}"; x = cx; y = f"{avail_y}*({edge:.5f}+{span:.5f}*{e})"
    elif motion == "diagonal_up_right":
        z = f"{zm:.5f}"; x = f"{avail_x}*({edge:.5f}+{span:.5f}*{e})"; y = f"{avail_y}*({1-edge:.5f}-{span:.5f}*{e})"
    elif motion == "drift":
        z = f"{z0}+({z1-z0})*0.70*{e}"; x = f"{avail_x}*(0.32+0.36*{e})"; y = f"{avail_y}*(0.58-0.16*{e})"
    else:
        z = f"{z0}+({z1-z0})*{e}"; x, y = cx, cy

    return ",".join([
        f"scale={src_w}:{src_h}:force_original_aspect_ratio=increase:flags=lanczos",
        f"crop={src_w}:{src_h}",
        f"zoompan=z='{z}':x='{x}':y='{y}':d={frames}:s={w}x{h}:fps={fps}",
        "format=yuv420p",
    ])


def ensure_bgm(slug: str, duration: float) -> Path | None:
    ep = episode_dir(slug)
    for name in ["bgm.mp3", "bgm.wav", "bgm.m4a"]:
        p = ep / "assets" / name
        if p.exists():
            return p
    # A very quiet neutral ambient bed. Users can replace it with assets/bgm.mp3.
    out = ep / "work" / "ambient.wav"
    if not out.exists():
        out.parent.mkdir(parents=True, exist_ok=True)
        run([
            "ffmpeg", "-y", "-f", "lavfi", "-i",
            "aevalsrc=0.014*sin(2*PI*55*t)+0.008*sin(2*PI*82.41*t)+0.005*sin(2*PI*110*t):s=48000",
            "-t", "90", "-af", "lowpass=f=700,afade=t=in:st=0:d=3,afade=t=out:st=87:d=3",
            out,
        ])
    return out


def render_video(slug: str) -> Path:
    ep = episode_dir(slug)
    cfg = read_json(CONFIG / "render.json")
    plan = plan_visuals(slug)
    timeline_path = ep / "output" / "timeline.json"
    timeline = read_json(timeline_path) if timeline_path.exists() else synthesize_voice(slug)
    subtitles = build_subtitles(slug, timeline)
    image_dir = ep / "assets" / "images"
    narration = ep / "assets" / "audio" / "narration.wav"
    work = ep / "work" / "render"
    work.mkdir(parents=True, exist_ok=True)
    output = ep / "output"
    output.mkdir(parents=True, exist_ok=True)
    scene_by_id = {s["scene_id"]: s for s in plan["scenes"]}
    cycle = cfg.get("motion_cycle", ["zoom_in", "pan_left", "pan_right", "zoom_out"])
    fps = int(cfg["fps"])

    segments = []
    for idx, row in enumerate(timeline["scenes"]):
        scene_id = row["scene_id"]
        image = image_dir / f"{scene_id}.png"
        if not image.exists():
            raise FileNotFoundError(f"Missing image for {scene_id}: {image}")
        duration = max(0.5, float(row["duration"]))
        frames = max(2, int(round(duration * fps)))
        motion = row.get("motion")
        if motion not in set(cfg.get("motion_cycle", [])) and motion not in {"zoom_in","zoom_out","pan_left","pan_right","pan_up","pan_down","diagonal_up_right","drift"}:
            motion = cycle[idx % len(cycle)]
        vf = motion_filter(motion or cycle[idx % len(cycle)], frames, cfg)
        seg = work / f"{idx:03}_{scene_id}.mp4"
        run([
            "ffmpeg", "-y", "-i", image,
            "-vf", vf, "-frames:v", str(frames), "-an",
            "-c:v", "libx264", "-preset", cfg.get("preset", "veryfast"),
            "-crf", str(cfg.get("crf", 20)), seg,
        ])
        segments.append(seg)

    concat = work / "concat.txt"
    concat.write_text("".join(f"file '{p}'\n" for p in segments), encoding="utf-8")
    base_video = work / "base.mp4"
    run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", concat, "-c", "copy", base_video])

    sub = str(subtitles).replace("\\", "/").replace(":", "\\:").replace("'", "\\'")
    font_size = int(cfg.get("subtitle_font_size", 30))
    margin_v = int(cfg.get("subtitle_margin_v", 42))
    subtitle_filter = (
        f"subtitles='{sub}':force_style='FontName=Noto Sans CJK JP,FontSize={font_size},"
        "PrimaryColour=&H00F4F2EC,OutlineColour=&H00101010,"
        f"Outline=2.2,Shadow=0.8,Alignment=2,MarginV={margin_v}'"
    )

    bgm = ensure_bgm(slug, float(timeline["total_duration"]))
    final = output / "final.mp4"
    if bgm:
        fc = (
            f"[1:a]volume={cfg.get('narration_volume',1.0)}[n];"
            f"[2:a]volume={cfg.get('bgm_volume',0.07)}[b];"
            "[n][b]amix=inputs=2:duration=first:dropout_transition=2[a]"
        )
        run([
            "ffmpeg", "-y", "-i", base_video, "-i", narration,
            "-stream_loop", "-1", "-i", bgm,
            "-vf", subtitle_filter, "-filter_complex", fc,
            "-map", "0:v", "-map", "[a]",
            "-c:v", "libx264", "-preset", cfg.get("preset", "veryfast"),
            "-crf", str(cfg.get("crf", 20)), "-c:a", "aac", "-b:a", "160k",
            "-movflags", "+faststart", "-shortest", final,
        ])
    else:
        run([
            "ffmpeg", "-y", "-i", base_video, "-i", narration,
            "-vf", subtitle_filter, "-map", "0:v", "-map", "1:a",
            "-c:v", "libx264", "-preset", cfg.get("preset", "veryfast"),
            "-crf", str(cfg.get("crf", 20)), "-c:a", "aac", "-b:a", "160k",
            "-movflags", "+faststart", "-shortest", final,
        ])

    (output / "CREDITS.txt").write_text("Narration: VOICEVOX Nemo\n", encoding="utf-8")
    print("FINAL", final, flush=True)
    return final


def preflight(slug: str) -> None:
    ep = episode_dir(slug)
    for required in [ep / "script.txt", ep / "episode.json"]:
        if not required.exists():
            raise FileNotFoundError(required)
    segment_script(slug)
    print("Preflight OK", slug, flush=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=["segment", "plan", "images", "voice", "render", "build", "preflight"])
    parser.add_argument("--episode", required=True)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    if args.command == "segment":
        segment_script(args.episode, args.force)
    elif args.command == "plan":
        plan_visuals(args.episode, args.force)
    elif args.command == "images":
        generate_images(args.episode, args.force)
    elif args.command == "voice":
        synthesize_voice(args.episode, args.force)
        build_subtitles(args.episode)
    elif args.command == "render":
        render_video(args.episode)
    elif args.command == "preflight":
        preflight(args.episode)
    elif args.command == "build":
        preflight(args.episode)
        plan_visuals(args.episode, args.force)
        generate_images(args.episode, args.force)
        synthesize_voice(args.episode, args.force)
        build_subtitles(args.episode)
        render_video(args.episode)


if __name__ == "__main__":
    main()
