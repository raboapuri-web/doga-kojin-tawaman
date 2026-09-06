# Knowledge Video Factory

知識系YouTube長尺動画を、台本から完成MP4まで自動生成する専用リポジトリです。

## Production flow

1. 台本を原文のまま小さなチャンクへ分割
2. OpenAIで意味ベースのシーン設計
3. 各シーン専用の画像プロンプトを生成
4. GPT Imageで16:9画像を生成（画像内テキスト禁止）
5. VOICEVOX Nemoでナレーション生成
6. 実際のWAV尺を使ってシーン開始・終了時刻を確定
7. 同じ実音声タイムラインから字幕を生成
8. 背景画像へ滑らかなパン・ズームを付与
9. BGMと合成してH.264/AACのMP4を書き出し

## 最重要設計

画像は「台本全体の何％地点か」では割り当てません。

各シーンは必ず元台本の `chunk_id` を保持し、その `chunk_id` の本文内容から画像プロンプトを作ります。VOICEVOX音声も同じ `chunk_id` から生成するため、説明内容・画像・字幕・音声が同じ意味単位で同期します。

## GitHub Actions secret

画像生成と意味ベースのシーン設計に OpenAI API を使います。

Repository Settings → Secrets and variables → Actions → New repository secret で以下を登録してください。

- `OPENAI_API_KEY`

APIキーをコードやJSONへ直接書かないでください。

## Voice

VOICEVOX NemoをGitHub Actions内のDockerで自動起動します。標準は男性2（speaker 10000）です。

公開動画ではVOICEVOX Nemoの利用条件に従い、概要欄等へ必要なクレジットを記載してください。

## Output

`episodes/<episode>/output/final.mp4`

GitHub Actions実行後は `knowledge-video-<episode>` Artifact としてダウンロードできます。
