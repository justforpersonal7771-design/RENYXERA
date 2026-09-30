"""Find the real figure regions on every page of a question paper, from the PDF itself.

Groups nearby vector drawings and embedded images into figure regions, drops page furniture
(logos / header & footer rules that repeat on most pages), and saves each candidate as a crop:

    data/pyq/_work/<BRANCH>/<paper>/regions/p020_r1.png
    data/pyq/_work/<BRANCH>/<paper>/regions.json   {page: [{"id": "p020_r1", "rect": [x0,y0,x1,y1]}]}

The transcriber (a person, or Claude reading the page) maps each [IMAGE_Q_xx_n] placeholder to a
region id — or to an explicit rectangle when a figure needs a different crop — and crop.py
writes the final images. No AI is involved in finding or cutting the figures.

    python scripts/pyq/regions.py EC --paper EC_2026
"""
from __future__ import annotations

import argparse
import sys
from collections import Counter
from pathlib import Path

import fitz

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import WORK, pdf_path, write_json  # noqa: E402

GAP = 14  # points: graphics closer than this belong to the same figure


def raw_rects(page: fitz.Page) -> list[fitz.Rect]:
    """Graphic objects, minus the question-table grid and page-sized watermarks."""
    pw, ph = page.rect.width, page.rect.height
    rects = []
    for i in page.get_image_info():
        r = fitz.Rect(i["bbox"])
        if r.get_area() > pw * ph * 0.2:  # watermark / full-page background
            continue
        rects.append(r)
    for d in page.get_drawings():
        r = fitz.Rect(d["rect"])
        if r.width < 0.5 and r.height < 0.5:
            continue
        thin = min(r.width, r.height) < 2.5
        # Table grid: long thin rules and big cell boxes spanning the question table.
        if thin and (r.width > pw * 0.5 or r.height > ph * 0.3):
            continue
        if r.width > pw * 0.6 or r.height > ph * 0.45:
            continue
        rects.append(r)
    # The question table: its outer edges are the extreme x of the long vertical rules. Cell
    # borders and the narrow "Q.No" column touch those edges; figures never do.
    verts = [fitz.Rect(d["rect"]) for d in page.get_drawings()]
    verts = [v for v in verts if v.width < 2.5 and v.height > ph * 0.08]
    if len(verts) >= 2:
        left, right = min(v.x0 for v in verts), max(v.x1 for v in verts)
        qcol = sorted({round(v.x0) for v in verts})
        content_left = qcol[1] if len(qcol) > 1 else left  # the Q.No / content divider
        rects = [r for r in rects if r.x0 > content_left + 1.5 and r.x1 < right - 1.5]
    return rects


def cluster(rects: list[fitz.Rect]) -> list[fitz.Rect]:
    groups = [fitz.Rect(r) for r in rects]
    changed = True
    while changed:
        changed = False
        out: list[fitz.Rect] = []
        for r in groups:
            grown = r + (-GAP, -GAP, GAP, GAP)
            for i, g in enumerate(out):
                if grown.intersects(g):
                    out[i] = g | r
                    changed = True
                    break
            else:
                out.append(fitz.Rect(r))
        groups = out
    return groups


def key(r: fitz.Rect) -> tuple:
    return tuple(round(v / 4) for v in r)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("branch")
    ap.add_argument("--paper", required=True)
    a = ap.parse_args()
    code, pid = a.branch.upper(), a.paper
    doc = fitz.open(pdf_path(code, pid, "qp"))
    per_page = [cluster(raw_rects(p)) for p in doc]
    # Furniture: the same rectangle on more than a third of the pages.
    seen = Counter(k for rects in per_page for k in {key(r) for r in rects})
    furniture = {k for k, c in seen.items() if c > max(3, len(doc) / 3)}
    out_dir = WORK / code / pid / "regions"
    out_dir.mkdir(parents=True, exist_ok=True)
    result: dict[str, list] = {}
    total = 0
    for i, (page, rects) in enumerate(zip(doc, per_page), start=1):
        keep = []
        for r in rects:
            if key(r) in furniture or r.width < 20 or r.height < 12:
                continue
            if r.width > page.rect.width * 0.95 and r.height < 4:  # full-width rules
                continue
            keep.append(r)
        keep.sort(key=lambda r: (r.y0, r.x0))
        entries = []
        for n, r in enumerate(keep, start=1):
            rid = f"p{i:03d}_r{n}"
            clip = (r + (-4, -4, 4, 4)) & page.rect
            page.get_pixmap(dpi=200, clip=clip).save(str(out_dir / f"{rid}.png"))
            entries.append({"id": rid, "rect": [round(v, 1) for v in clip]})
        if entries:
            result[str(i)] = entries
            total += len(entries)
    write_json(WORK / code / pid / "regions.json", result)
    print(f"{pid}: {total} figure regions on {len(result)} pages (furniture removed: {len(furniture)} shapes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
