from __future__ import annotations

import base64
import io
import json
import os
import subprocess
from pathlib import Path

import requests
from openai import OpenAI
from PIL import Image, ImageDraw, ImageFilter
from pydub import AudioSegment

ROOT = Path(__file__).resolve().parents[2]
EP = ROOT / "episodes" / "minato_60s_budget_test"
WORK = EP / "work"
IMG_DIR = EP / "assets" / "images"
AUDIO_DIR = EP / "assets" / "audio"
OUT = EP / "output"
FPS = 30
W, H = 1920, 1080
MODEL = os.getenv("BUDGET_TEST_IMAGE_MODEL", "gpt-image-1")
SIZE = "1536x1024"

CHARACTERS = (
    "Keep the same two Japanese adults across every human scene. "
    "Woman: 26 years old, shoulder-length dark brown hair, oval face, understated makeup, beige wool coat, intelligent calm expression. "
    "Man: 27 years old, short black hair, navy casual jacket, ordinary office-worker appearance, slightly reserved expression. "
    "Natural proportions, realistic skin texture, no glamour retouching. "
)

BASE_STYLE = (
    "Photorealistic cinematic still from a quiet contemporary Japanese relationship drama, Tokyo at night, "
    "subtle 35mm film grain, restrained contrast, realistic practical lighting, shallow depth of field, muted colors, "
    "observational camera, slightly imperfect composition, no text, no logo, no watermark, 16:9 framing. "
)

SCENES = [
    {
        "scene_id": "s001",
        "quality": "low",
        "narration": "僕たちが付き合い始めたのは、恵比寿だった。ガーデンプレイスではない。",
        "prompt": BASE_STYLE + "Winter evening near Ebisu west exit, a narrow local shopping street beyond the polished main avenues, wet asphalt reflecting shop lights, commuters passing, no identifiable faces, slightly gritty everyday Tokyo rather than luxury Tokyo.",
        "motions": ["push", "pan_right"],
    },
    {
        "scene_id": "s002",
        "quality": "low",
        "narration": "西口から恵比寿銀座を少し歩いて、恵比寿神社の裏手に入ったところにある、小汚い焼き鳥屋だった。",
        "prompt": BASE_STYLE + "Exterior of a tiny old yakitori bar in a back alley near Ebisu Shrine, stacked red beer crates by the entrance, clear vinyl winter curtain, warm tungsten light leaking to the alley, smoke from the grill, cramped and unpretentious.",
        "motions": ["push", "pan_left"],
    },
    {
        "scene_id": "s003",
        "quality": "medium",
        "narration": "入口には赤いビールケース。冬は透明のビニールカーテン。テーブルは少しベタついていて、二人で座ると膝がぶつかった。",
        "prompt": BASE_STYLE + CHARACTERS + "Inside the cramped yakitori bar, the couple sit across a tiny sticky wooden table, knees almost touching under the table, two draft beers and grilled chicken skewers, other customers close behind them, grill smoke in the warm light, candid medium-wide shot.",
        "motions": ["push", "detail"],
    },
    {
        "scene_id": "s004",
        "quality": "medium",
        "narration": "彼女は二十六歳。僕は二十七歳。彼女は広告代理店、僕はネットマーケの会社にいた。",
        "prompt": BASE_STYLE + CHARACTERS + "Same yakitori table. The woman is slightly more polished and self-assured, the man more modestly dressed; both are young Tokyo office workers after work. Capture subtle class difference only through clothing and posture, no obvious luxury props, candid two-shot.",
        "motions": ["pan_right", "push"],
    },
    {
        "scene_id": "s005",
        "quality": "low",
        "narration": "僕は中野の、家賃八万五千円のワンルームに住んでいた。築二十三年。ユニットバス。ベランダから見えるのは、向かいのアパートの給湯器だった。",
        "prompt": BASE_STYLE + "A modest aging one-room apartment in Nakano at night, built in the early 2000s, narrow balcony, view blocked by the neighboring apartment wall and an outdoor gas water heater, fluorescent interior light, ordinary rental housing, no people.",
        "motions": ["pan_left", "push"],
    },
    {
        "scene_id": "s006",
        "quality": "medium",
        "narration": "初めて彼女を家に連れて行った夜、ユニットバスを見た彼女が、『懐かしい』と言った。",
        "prompt": BASE_STYLE + CHARACTERS + "Inside the man's cramped Nakano one-room apartment. The woman stands at the doorway of a tiny Japanese unit bath, looking at it with a small nostalgic half-smile; the man is partly visible behind her. Quiet intimate realism, not comedic, practical fluorescent light mixed with warm room light.",
        "motions": ["push", "detail"],
    },
    {
        "scene_id": "s007",
        "quality": "medium",
        "narration": "彼女の実家は世田谷で、中学から私立、大学は青学。僕の実家は栃木だった。二人とも、自分の家が普通だと思っていた。東京には、普通が何種類もある。",
        "prompt": BASE_STYLE + CHARACTERS + "The couple walking side by side through an ordinary Tokyo residential street at night after dinner. Visually imply two different ideas of what 'normal' means through subtle details: refined coat and composure versus simpler clothes and posture. No caricature, no split screen, reflective melancholy.",
        "motions": ["pan_right", "pull"],
    },
    {
        "scene_id": "s008",
        "quality": "medium",
        "narration": "その焼き鳥屋で、生ビールを二杯飲んだ頃だった。彼女が突然、『私、三十までには結婚したいんだよね』と言った。",
        "prompt": BASE_STYLE + CHARACTERS + "Back inside the same cramped yakitori bar after two beers. Close medium shot of the woman looking directly at the man and calmly saying something important, serious but with a faint smile; the man's shoulder and a chicken-skin skewer blurred in foreground, smoke and old television glow behind her.",
        "motions": ["push", "push"],
    },
]


def run(cmd: list[str]) -> None:
    print("+", " ".join(cmd), flush=True)
    subprocess.run(cmd, check=True)


def save_image_result(result, out: Path) -> None:
    item = result.data[0]
    raw = None
    if getattr(item, "b64_json", None):
        raw = base64.b64decode(item.b64_json)
    elif getattr(item, "url", None):
        r = requests.get(item.url, timeout=180)
        r.raise_for_status()
        raw = r.content
    if not raw:
        raise RuntimeError("Image API returned no bytes")
    im = Image.open(io.BytesIO(raw)).convert("RGB")
    ratio = im.width / im.height
    target = 16 / 9
    if ratio > target:
        nw = int(im.height * target)
        left = (im.width - nw) // 2
        im = im.crop((left, 0, left + nw, im.height))
    else:
        nh = int(im.width / target)
        top = (im.height - nh) // 2
        im = im.crop((0, top, im.width, top + nh))
    out.parent.mkdir(parents=True, exist_ok=True)
    im.save(out, "PNG", optimize=True)


def fallback_image(out: Path, label: str) -> None:
    im = Image.new("RGB", (1536, 864), (26, 29, 34))
    d = ImageDraw.Draw(im)
    for y in range(im.height):
        v = int(20 + 35 * y / im.height)
        d.line((0, y, im.width, y), fill=(v, v, v + 5))
    im = im.filter(ImageFilter.GaussianBlur(2))
    d = ImageDraw.Draw(im)
    d.text((60, 760), label, fill=(190, 190, 190))
    out.parent.mkdir(parents=True, exist_ok=True)
    im.save(out, "PNG")


def generate_images() -> None:
    key = os.getenv("OPENAI_API_KEY", "").strip()
    if not key:
        raise RuntimeError("OPENAI_API_KEY is required")
    if len(SCENES) > 8:
        raise RuntimeError("Budget guard: maximum 8 image generations")
    medium = sum(s["quality"] == "medium" for s in SCENES)
    low = sum(s["quality"] == "low" for s in SCENES)
    if medium > 5 or low > 3:
        raise RuntimeError(f"Budget guard failed: medium={medium}, low={low}")

    client = OpenAI(api_key=key)
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    for i, scene in enumerate(SCENES, 1):
        out = IMG_DIR / f"{scene['scene_id']}.png"
        if out.exists():
            print(f"[{i}/8] cached {out.name}", flush=True)
            continue
        print(f"[{i}/8] generate {scene['scene_id']} quality={scene['quality']} model={MODEL}", flush=True)
        try:
            # Exactly one billable generation attempt per scene. No automatic retry.
            result = client.images.generate(
                model=MODEL,
                prompt=scene["prompt"],
                size=SIZE,
                quality=scene["quality"],
                n=1,
            )
            save_image_result(result, out)
        except Exception as exc:
            print(f"IMAGE_GENERATION_FAILED {scene['scene_id']}: {exc}", flush=True)
            fallback_image(out, f"{scene['scene_id']} fallback")


def synth_one(text: str, speaker: int = 10000, speed: float = 1.05) -> AudioSegment:
    base = os.getenv("VOICEVOX_URL", "http://127.0.0.1:50021").rstrip("/")
    q = requests.post(base + "/audio_query", params={"text": text, "speaker": speaker}, timeout=90)
    q.raise_for_status()
    query = q.json()
    query["speedScale"] = speed
    query["intonationScale"] = 0.92
    query["volumeScale"] = 1.0
    s = requests.post(base + "/synthesis", params={"speaker": speaker}, json=query, timeout=180)
    s.raise_for_status()
    return AudioSegment.from_file(io.BytesIO(s.content), format="wav")


def synthesize_narration() -> tuple[AudioSegment, list[dict]]:
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    combined = AudioSegment.silent(duration=0, frame_rate=48000)
    rows = []
    cursor = 0.0
    for i, scene in enumerate(SCENES, 1):
        audio = synth_one(scene["narration"])
        wav = AUDIO_DIR / f"{scene['scene_id']}.wav"
        audio.export(wav, format="wav")
        start = cursor
        end = start + len(audio) / 1000.0
        pause = 160 if i < len(SCENES) else 0
        combined += audio
        if pause:
            combined += AudioSegment.silent(duration=pause, frame_rate=48000)
        cursor = end + pause / 1000.0
        rows.append({"scene_id": scene["scene_id"], "start": start, "end": end, "after": cursor, "duration": cursor - start})
    narration = AUDIO_DIR / "narration.wav"
    combined.export(narration, format="wav")
    return combined, rows


def srt_time(sec: float) -> str:
    ms = int(round(sec * 1000))
    h, rem = divmod(ms, 3600000)
    m, rem = divmod(rem, 60000)
    s, ms = divmod(rem, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


def wrap_ja(text: str, n: int = 24) -> str:
    if len(text) <= n:
        return text
    chunks = [text[i:i+n] for i in range(0, len(text), n)]
    return "\n".join(chunks[:2])


def write_metadata(rows: list[dict], total: float) -> None:
    WORK.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)
    plan = {
        "budget_policy": {"max_images": 8, "medium": 5, "low": 3, "automatic_retries": 0},
        "scenes": [
            {
                "scene_id": s["scene_id"],
                "narration_text": s["narration"],
                "visual": {"quality": s["quality"], "image_prompt": s["prompt"], "motions": s["motions"]},
            }
            for s in SCENES
        ],
    }
    (WORK / "scene_plan.json").write_text(json.dumps(plan, ensure_ascii=False, indent=2), encoding="utf-8")
    timeline = {"total_duration": total, "scenes": rows}
    (OUT / "timeline.json").write_text(json.dumps(timeline, ensure_ascii=False, indent=2), encoding="utf-8")
    with (OUT / "subtitles.srt").open("w", encoding="utf-8") as f:
        for i, (scene, row) in enumerate(zip(SCENES, rows), 1):
            f.write(f"{i}\n{srt_time(row['start'])} --> {srt_time(row['end'])}\n{wrap_ja(scene['narration'])}\n\n")


def motion_filter(kind: str, frames: int) -> str:
    n = max(frames - 1, 1)
    p = f"on/{n}"
    if kind == "push":
        z = f"1.035+0.105*{p}"
        x = "(iw-iw/zoom)/2"
        y = "(ih-ih/zoom)/2"
    elif kind == "pull":
        z = f"1.14-0.10*{p}"
        x = "(iw-iw/zoom)/2"
        y = "(ih-ih/zoom)/2"
    elif kind == "pan_left":
        z = "1.10"
        x = f"(iw-iw/zoom)*(0.78-0.56*{p})"
        y = "(ih-ih/zoom)/2"
    elif kind == "pan_right":
        z = "1.10"
        x = f"(iw-iw/zoom)*(0.22+0.56*{p})"
        y = "(ih-ih/zoom)/2"
    else:  # detail crop
        z = f"1.16+0.08*{p}"
        x = "(iw-iw/zoom)*0.58"
        y = "(ih-ih/zoom)*0.46"
    return ",".join([
        "scale=2560:1440:force_original_aspect_ratio=increase:flags=lanczos",
        "crop=2560:1440",
        f"zoompan=z='{z}':x='{x}':y='{y}':d={frames}:s={W}x{H}:fps={FPS}",
        "eq=contrast=1.035:saturation=0.90:brightness=-0.015",
        "vignette=PI/5",
        "noise=alls=2.2:allf=t+u",
        "format=yuv420p",
    ])


def render_visuals(rows: list[dict]) -> Path:
    render_dir = WORK / "render"
    render_dir.mkdir(parents=True, exist_ok=True)
    parts = []
    cut_no = 0
    for scene, row in zip(SCENES, rows):
        image = IMG_DIR / f"{scene['scene_id']}.png"
        scene_duration = max(1.0, float(row["duration"]))
        first = scene_duration * 0.54
        durations = [first, scene_duration - first]
        for motion, dur in zip(scene["motions"], durations):
            cut_no += 1
            frames = max(2, int(round(dur * FPS)))
            part = render_dir / f"cut-{cut_no:02d}.mp4"
            run([
                "ffmpeg", "-y", "-loglevel", "error", "-i", str(image),
                "-vf", motion_filter(motion, frames), "-frames:v", str(frames), "-an",
                "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", str(part),
            ])
            parts.append(part)
    concat = render_dir / "concat.txt"
    concat.write_text("".join(f"file '{p.resolve()}'\n" for p in parts), encoding="utf-8")
    base = render_dir / "video-only.mp4"
    run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(concat), "-c", "copy", str(base)])
    return base


def make_ambient(total: float) -> Path:
    out = WORK / "ambient.wav"
    run([
        "ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i",
        "aevalsrc=0.010*sin(2*PI*55*t)+0.006*sin(2*PI*82.41*t)+0.003*sin(2*PI*110*t):s=48000",
        "-t", f"{total + 2:.3f}", "-af", "lowpass=f=650,afade=t=in:st=0:d=2", str(out),
    ])
    return out


def finalize(base: Path, total: float) -> Path:
    OUT.mkdir(parents=True, exist_ok=True)
    narration = AUDIO_DIR / "narration.wav"
    ambient = make_ambient(total)
    srt = str((OUT / "subtitles.srt").resolve()).replace("\\", "/").replace(":", "\\:").replace("'", "\\'")
    vf = (
        f"subtitles='{srt}':force_style='FontName=Noto Sans CJK JP,FontSize=28,"
        "PrimaryColour=&H00F3F0E9,OutlineColour=&H00111111,Outline=2.0,Shadow=0.5,Alignment=2,MarginV=48'"
    )
    final = OUT / "final.mp4"
    run([
        "ffmpeg", "-y", "-loglevel", "error", "-i", str(base), "-i", str(narration), "-i", str(ambient),
        "-vf", vf,
        "-filter_complex", "[1:a]volume=1.0[n];[2:a]volume=0.06[b];[n][b]amix=inputs=2:duration=first:dropout_transition=2[a]",
        "-map", "0:v:0", "-map", "[a]", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
        "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", "-shortest", str(final),
    ])
    return final


def main() -> None:
    WORK.mkdir(parents=True, exist_ok=True)
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    OUT.mkdir(parents=True, exist_ok=True)
    print("BUDGET_TEST: 5 medium human images + 3 low scenery images; 8 billable image calls max; no retries", flush=True)
    generate_images()
    narration, rows = synthesize_narration()
    total = len(narration) / 1000.0
    write_metadata(rows, total)
    base = render_visuals(rows)
    final = finalize(base, total)
    (OUT / "CREDITS.txt").write_text(
        "Narration: VOICEVOX Nemo\nImages: OpenAI image API (5 medium + 3 low)\nBudget test: one generation attempt per asset, no automatic retries.\n",
        encoding="utf-8",
    )
    print(f"FINAL {final} duration={total:.2f}s", flush=True)


if __name__ == "__main__":
    main()
