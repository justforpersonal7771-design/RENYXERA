"""Merge Claude's page-by-page transcription batches and cut the figures from the official PDF.

Input  data/pyq/<BRANCH>/transcriptions/<paper>/b*.json   (list of questions, see README)
       data/pyq/_work/<BRANCH>/<paper>/regions.json          (from regions.py)
Output data/pyq/_work/<BRANCH>/<paper>/questions.json        (merged, sorted by qno)
       data/pyq/<BRANCH>/images/<paper>/Q07_1.png ...        (300 dpi crops)

A figure is either the union of region ids (+ pad [l, t, r, b] in points) or an explicit rect.

    python scripts/pyq/crop.py EC --paper EC_2026
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

import fitz

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import PYQ, WORK, pdf_path, read_json, write_json  # noqa: E402

DPI = 300
PH = re.compile(r"IMAGE_Q_(\d{2})_([A-D]|\d+)")


LABEL_GAP = 9  # points: a word this close to a figure is one of its labels (body text lines sit further away)


def grow_labels(page: fitz.Page, rect: fitz.Rect) -> fitz.Rect:
    """Figure labels (R(s), V_o, +V_DD ...) are text, not drawings: pull in words touching the figure."""
    words = [fitz.Rect(w[:4]) for w in page.get_text("words")]
    changed = True
    while changed:
        changed = False
        near = rect + (-LABEL_GAP, -LABEL_GAP, LABEL_GAP, LABEL_GAP)
        for w in words:
            if near.intersects(w) and not rect.contains(w) and w.width < page.rect.width * 0.3:
                rect |= w
                changed = True
    return rect


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("branch")
    ap.add_argument("--paper", required=True)
    a = ap.parse_args()
    code, pid = a.branch.upper(), a.paper
    work = WORK / code / pid
    regions = {r["id"]: r["rect"] for rs in (read_json(work / "regions.json", {}) or {}).values() for r in rs}
    qs: dict[int, dict] = {}
    for f in sorted((PYQ / code / "transcriptions" / pid).glob("b*.json")):
        for q in read_json(f):
            if q["qno"] in qs:
                raise SystemExit(f"Q{q['qno']} appears twice ({f.name})")
            qs[q["qno"]] = q
    doc = fitz.open(pdf_path(code, pid, "qp"))
    img_dir = PYQ / code / "images" / pid
    img_dir.mkdir(parents=True, exist_ok=True)
    n_img = 0
    for q in qs.values():
        for fig in q.get("figures", []):
            m = PH.fullmatch(fig["placeholder"])
            if not m or int(m.group(1)) != q["qno"]:
                raise SystemExit(f"Q{q['qno']}: bad placeholder {fig['placeholder']}")
            page = doc[fig["page"] - 1]
            if "rect" in fig:
                rect = fitz.Rect(fig["rect"])
            elif "table" in fig:  # [y_top, y_bottom] in points: the ruled table's lines inside that band
                y0, y1 = fig["table"]
                rect = fitz.Rect()
                for d in page.get_drawings():
                    r = fitz.Rect(d["rect"])
                    if r.y0 >= y0 and r.y1 <= y1 and r.x0 > page.rect.width * 0.2:
                        rect |= r
                if rect.is_empty:
                    raise SystemExit(f"Q{q['qno']}: no table lines between y={y0} and y={y1}")
            else:
                rect = fitz.Rect()
                for rid in fig["regions"]:
                    if rid not in regions:
                        raise SystemExit(f"Q{q['qno']}: unknown region {rid}")
                    rect |= fitz.Rect(regions[rid])
                if fig.get("grow", True):  # off for raster figures whose labels are inside the image
                    rect = grow_labels(page, rect)
            l, t, r, b = fig.get("pad", [4, 4, 4, 4])
            rect = fitz.Rect(rect.x0 - l, rect.y0 - t, rect.x1 + r, rect.y1 + b) & page.rect
            name = f"{q['qno']:02d}_{m.group(2)}.png"  # app convention: 07_1.png, 07_A.png
            page.get_pixmap(dpi=DPI, clip=rect).save(str(img_dir / name))
            fig["file"] = name
            fig["rect_pt"] = [round(v, 1) for v in rect]
            n_img += 1
    write_json(work / "questions.json", {"paper": pid, "source": "claude-transcription", "questions": [qs[k] for k in sorted(qs)]})
    missing = sorted(set(range(1, 66)) - set(qs))
    print(f"{pid}: {len(qs)} questions merged, {n_img} figures cropped; missing: {missing or 'none'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
