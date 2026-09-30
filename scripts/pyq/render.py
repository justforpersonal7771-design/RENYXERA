"""Render every page of an official question paper for Claude's transcription (no AI involved).

    data/pyq/_work/<BRANCH>/<paper>/pages/p001.png   300 dpi page image (what Claude reads)
    data/pyq/_work/<BRANCH>/<paper>/pages/p001.txt   PDF text layer (ground truth for words/numbers)

    python scripts/pyq/render.py EC --paper EC_2025
"""
from __future__ import annotations

import argparse
import re
import sys
import unicodedata
from pathlib import Path

import fitz  # PyMuPDF

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import WORK, pdf_path  # noqa: E402

DPI = 300


def norm(s: str) -> str:
    """Fold math-italic Unicode (𝑃𝑅 -> PR), spaces and dashes so text layers compare cleanly."""
    s = unicodedata.normalize("NFKC", s)
    return re.sub(r"\s+", " ", s.replace("−", "-").replace("–", "-")).strip()


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("branch")
    ap.add_argument("--paper", required=True)
    a = ap.parse_args()
    code, pid = a.branch.upper(), a.paper
    doc = fitz.open(pdf_path(code, pid, "qp"))
    out = WORK / code / pid / "pages"
    out.mkdir(parents=True, exist_ok=True)
    for i, page in enumerate(doc, start=1):
        png = out / f"p{i:03d}.png"
        if not png.exists():
            page.get_pixmap(dpi=DPI).save(str(png))
        (out / f"p{i:03d}.txt").write_text(norm(page.get_text()), encoding="utf-8")
    markers = []
    for i in range(1, len(doc) + 1):
        t = (out / f"p{i:03d}.txt").read_text(encoding="utf-8")
        t = re.sub(r"Q\.\s?\d{1,2}\s*[-–]\s*Q\.\s?\d{1,2}", " ", t)  # section headers "Q.1 - Q.5 Carry ..."
        markers += [int(m) for m in re.findall(r"(?<![\w.])Q\.\s?(\d{1,2})(?!\d)", t)]
    restarts = sum(1 for x, y in zip(markers, markers[1:]) if y < x)
    print(f"{pid}: {len(doc)} pages rendered; question markers {min(markers or [0])}..{max(markers or [0])}"
          + (f"; WARNING numbering restarts {restarts}x (two shifts or a GA/core split?)" if restarts else ""))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
