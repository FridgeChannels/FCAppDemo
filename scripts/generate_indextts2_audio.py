"""
Generate a recap audio file using IndexTTS / IndexTTS2 (local).

Why this script exists:
- The frontend app can play a local static audio file (e.g. /public/recap.wav) on refresh.
- You can generate that file with IndexTTS2 locally for higher-quality voice than browser TTS.

Docs (IndexTTS2): https://indextts2.org/

Expected workflow (local machine):
1) pip install indextts
2) Prepare model checkpoints/config per IndexTTS docs
3) Provide a reference voice wav file
4) Run this script to produce public/recap.wav

This repo does NOT auto-download model weights.
"""

from __future__ import annotations

import argparse
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--text-file",
        default="src/data/recapText.zh-CN.txt",
        help="Path to the recap text file",
    )
    parser.add_argument(
        "--out",
        default="public/recap.wav",
        help="Output wav path to be served by the app",
    )
    parser.add_argument(
        "--voice",
        required=True,
        help="Reference voice wav file path (speaker prompt)",
    )
    parser.add_argument(
        "--model-dir",
        required=True,
        help="IndexTTS checkpoints directory",
    )
    parser.add_argument(
        "--cfg-path",
        required=True,
        help="IndexTTS config yaml path",
    )
    args = parser.parse_args()

    text_path = Path(args.text_file)
    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    text = text_path.read_text(encoding="utf-8").strip()
    if not text:
        raise SystemExit(f"Empty text file: {text_path}")

    # Import here so the repo can run without the dependency installed.
    from indextts.infer import IndexTTS  # type: ignore

    tts = IndexTTS(
        model_dir=str(args.model_dir),
        cfg_path=str(args.cfg_path),
    )
    tts.infer(
        voice=str(args.voice),
        text=text,
        output_path=str(out_path),
    )

    print(f"Generated: {out_path}")


if __name__ == "__main__":
    main()


