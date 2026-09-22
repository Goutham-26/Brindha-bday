from __future__ import annotations

import base64
import json
import re
from pathlib import Path

import streamlit as st
import streamlit.components.v1 as components


ROOT = Path(__file__).parent
PHOTO_DIR = ROOT / "assets" / "photos"
VIDEO_DIR = ROOT / "assets" / "videos"


def image_data_uri(path: Path) -> str:
    mime = "image/jpeg" if path.suffix.lower() in {".jpg", ".jpeg"} else f"image/{path.suffix.lower().lstrip('.') }"
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{encoded}"


def video_data_uri(path: Path) -> str:
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:video/mp4;base64,{encoded}"


def build_page() -> str:
    photos = sorted(
        [
            path
            for path in PHOTO_DIR.iterdir()
            if path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp", ".gif"}
        ],
        key=lambda path: path.name.lower(),
    )
    photo_items = [
        {"src": image_data_uri(path), "name": path.stem.replace("_", " ")}
        for path in photos
    ]

    html = (ROOT / "index.html").read_text(encoding="utf-8")
    css = (ROOT / "style.css").read_text(encoding="utf-8")
    javascript = (ROOT / "script.js").read_text(encoding="utf-8")
    background = image_data_uri(PHOTO_DIR / "2.jpeg") if (PHOTO_DIR / "2.jpeg").exists() else ""
    videos = sorted(VIDEO_DIR.glob("*.mp4"), key=lambda path: path.name.lower()) if VIDEO_DIR.exists() else []
    video = video_data_uri(videos[0]) if videos else ""
    html = re.sub(r"\{\s*\{\s*STYLES\s*\}\s*\}", css, html)
    html = re.sub(r"\{\s*\{\s*PHOTOS_JSON\s*\}\s*\}", json.dumps(photo_items), html)
    html = re.sub(r"\{\s*\{\s*SCRIPT\s*\}\s*\}", javascript, html)
    html = html.replace("{{BACKGROUND_IMAGE}}", background)
    html = html.replace("{{VIDEO_SOURCE}}", video)
    return html


st.set_page_config(page_title="Brindha's Birthday", page_icon="🎂", layout="wide")
components.html(build_page(), height=1800, scrolling=True)
