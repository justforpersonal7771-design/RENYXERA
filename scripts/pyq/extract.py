"""Steps 1-3: official question paper PDF -> questions JSON + auto-cropped images.

Per page (resumable; finished pages are never redone):
  1. render the page at 300 dpi and read the PDF text layer (ground truth for words/numbers)
     plus the "Q.<n>" markers on that page (ground truth for which questions it holds);
  2. vision extraction with a strict JSON schema, TWICE with different models:
       pass A = gemini-2.5-flash, pass B = gemini-3.5-flash-lite
     (page image + that page's text layer; verbatim copy, LaTeX for maths, never solve);
  3. figures: the model returns a box for every [IMAGE_Q_xx_n] / option image; the box is
     snapped to the real drawing/image edges on the page and cropped from the 300-dpi render.

Outputs in data/pyq/_work/<BRANCH>/<paper>/ :
    pages/p001.png, pages/p001.txt, pages/p001.pass_a.json, pages/p001.pass_b.json
    questions.pass_a.json, questions.pass_b.json   (merged across pages, by question number)
and cropped images in data/pyq/<BRANCH>/images/<paper>/Q07_1.png, Q07_A.png ...

    python scripts/pyq/extract.py EC --paper EC_2026
When the free AI quota runs out it stops cleanly; run the same command later to resume.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
import unicodedata
from pathlib import Path

import fitz  # PyMuPDF

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import PYQ, RAW, WORK, load_env, pdf_path, read_json, write_json  # noqa: E402

DPI = 300
MODELS = {"a": "gemini-2.5-flash", "b": "gemini-3.5-flash-lite"}
PAUSE = {"a": 7.0, "b": 4.5}  # stay under free-tier requests-per-minute

SCHEMA = {
    "type": "object",
    "properties": {
        "questions": {"type": "array", "items": {"type": "object", "properties": {
            "qno": {"type": "integer"},
            "continues_from_previous_page": {"type": "boolean"},
            "question_text": {"type": "string"},
            "options": {"type": "array", "items": {"type": "object", "properties": {
                "option_id": {"type": "string", "enum": ["A", "B", "C", "D"]},
                "text": {"type": "string"}}, "required": ["option_id", "text"]}},
            "figures": {"type": "array", "items": {"type": "object", "properties": {
                "placeholder": {"type": "string"},
                "box_2d": {"type": "array", "items": {"type": "integer"}}}, "required": ["placeholder", "box_2d"]}},
            "uncertain": {"type": "boolean"},
            "uncertain_reason": {"type": "string"},
        }, "required": ["qno", "question_text", "options", "figures", "uncertain"]}},
    },
    "required": ["questions"],
}

PROMPT = """You are transcribing ONE page of an official GATE question paper into JSON, with perfect accuracy.

Rules:
- Copy the question and option text VERBATIM. Never solve, fix, simplify, summarise or reorder anything.
- Write all mathematics in LaTeX inside \\( ... \\) (inline) or \\[ ... \\] (display). Keep every number, unit, sign and subscript exactly.
- Keep paragraph breaks as \\n. Tables: write them as Markdown tables inside the text.
- Every diagram, circuit, graph, figure or image inside a question -> write a placeholder [IMAGE_Q_{qq}_{n}] at the exact place it appears (qq = 2-digit question number, n = 1, 2, ...) and add it to "figures" with box_2d = [ymin, xmin, ymax, xmax] on a 0-1000 scale of this page, tightly around that figure only.
- If an OPTION is an image, its text is exactly [IMAGE_Q_{qq}_{A|B|C|D}] and it gets its own entry in "figures".
- NAT (numerical answer) questions have NO options: use an empty options list.
- Ignore page headers/footers, the paper title, "Q.6 – Q.10 Carry TWO marks Each" style instructions, and the page number.
- If a question started on the previous page, set continues_from_previous_page=true and include only the part on THIS page.
- If anything is hard to read or ambiguous, still transcribe your best reading and set uncertain=true with a short uncertain_reason.
- Questions on this page, according to the page's text layer: {markers}. Return exactly these question numbers (plus a continuation if one started earlier).

The page's own text layer (use it to get every word and number exactly right; its maths symbols may be garbled, so use the image for layout and maths):
<<<
{text}
>>>"""


def norm(s: str) -> str:
    """Fold math-italic Unicode (𝑃𝑅 -> PR), spaces and dashes so text layers compare cleanly."""
    s = unicodedata.normalize("NFKC", s)
    return re.sub(r"\s+", " ", s.replace("−", "-").replace("–", "-")).strip()


def markers(text: str) -> list[int]:
    return sorted({int(m) for m in re.findall(r"(?<![\w.])Q\.\s?(\d{1,2})(?!\d)", text)})


def figure_rects(page: fitz.Page) -> list[fitz.Rect]:
    """Rectangles of real graphics on the page (embedded images + clusters of vector drawings)."""
    rects = [fitz.Rect(i["bbox"]) for i in page.get_image_info()]
    for d in page.get_drawings():
        r = fitz.Rect(d["rect"])
        if r.width > 2 or r.height > 2:
            rects.append(r)
    return rects


def snap(box: fitz.Rect, rects: list[fitz.Rect], page_rect: fitz.Rect) -> fitz.Rect:
    """Grow the model's box to cover every graphic it overlaps, plus a small margin."""
    out = fitz.Rect(box)
    for r in rects:
        if r.intersects(box) and r.get_area() < page_rect.get_area() * 0.6:  # skip full-page frames
            out |= r
    return (out + (-6, -6, 6, 6)) & page_rect


def call_model(client, model: str, png: bytes, prompt: str) -> dict:
    from google.genai import types
    res = client.models.generate_content(
        model=model,
        contents=[types.Part.from_bytes(data=png, mime_type="image/png"), prompt],
        config=types.GenerateContentConfig(response_mime_type="application/json", response_schema=SCHEMA, temperature=0,
                                           max_output_tokens=8192),
    )
    return json.loads(res.text or "{}")


class QuotaExhausted(Exception):
    pass


def run_pass(client, name: str, doc: fitz.Document, work: Path) -> bool:
    """Returns True when every page is done for this pass."""
    for i, page in enumerate(doc, start=1):
        out = work / "pages" / f"p{i:03d}.pass_{name}.json"
        if out.exists():
            continue
        png = (work / "pages" / f"p{i:03d}.png").read_bytes()
        text = (work / "pages" / f"p{i:03d}.txt").read_text(encoding="utf-8")
        mk = markers(text)
        if not mk and len(norm(text)) < 40:
            write_json(out, {"questions": [], "skipped": "no content"})
            continue
        prompt = PROMPT.replace("{markers}", ", ".join(f"Q.{m}" for m in mk) or "none (instructions or continuation page)").replace("{text}", text[:6000])
        for attempt in range(3):
            try:
                data = call_model(client, MODELS[name], png, prompt)
                write_json(out, data)
                print(f"  pass {name} p{i:03d}: {[q.get('qno') for q in data.get('questions', [])]} (text layer {mk})")
                break
            except Exception as e:  # noqa: BLE001
                msg = str(e)
                if re.search(r"429|RESOURCE_EXHAUSTED|quota", msg, re.I):
                    if "PerDay" in msg or "per day" in msg.lower() or attempt == 2:
                        raise QuotaExhausted(f"pass {name} page {i}: {msg[:200]}") from e
                    time.sleep(60)  # per-minute limit: wait and retry
                    continue
                if attempt == 2:
                    write_json(out, {"questions": [], "error": msg[:500]})
                    print(f"  pass {name} p{i:03d}: ERROR {msg[:120]}")
                time.sleep(5)
        time.sleep(PAUSE[name])
    return True


def merge_pages(doc_pages: int, work: Path, name: str) -> dict[int, dict]:
    """Join per-page results into one record per question (continuations appended)."""
    qs: dict[int, dict] = {}
    for i in range(1, doc_pages + 1):
        data = read_json(work / "pages" / f"p{i:03d}.pass_{name}.json", {}) or {}
        for q in data.get("questions", []):
            n = q.get("qno")
            if not isinstance(n, int):
                continue
            q = {**q, "pages": [i], "figures": [{**f, "page": i} for f in q.get("figures", [])]}
            if n in qs and q.get("continues_from_previous_page"):
                base = qs[n]
                base["question_text"] = (base["question_text"].rstrip() + "\n" + q["question_text"].lstrip()).strip()
                have = {o["option_id"] for o in base["options"]}
                base["options"] += [o for o in q["options"] if o["option_id"] not in have]
                base["figures"] += q["figures"]
                base["pages"].append(i)
                base["uncertain"] = base.get("uncertain") or q.get("uncertain")
            elif n not in qs:
                qs[n] = q
    return qs


def crop_figures(doc: fitz.Document, work: Path, qs: dict[int, dict], img_dir: Path) -> None:
    img_dir.mkdir(parents=True, exist_ok=True)
    for n, q in qs.items():
        for f in q["figures"]:
            box = f.get("box_2d") or []
            ph = f.get("placeholder", "")
            m = re.fullmatch(r"\[?IMAGE_Q_(\d{1,2})_([A-D]|\d+)\]?", ph.strip())
            if len(box) != 4 or not m:
                f["crop_error"] = "bad box or placeholder"
                continue
            page = doc[f["page"] - 1]
            pr = page.rect
            ymin, xmin, ymax, xmax = box
            rect = fitz.Rect(xmin / 1000 * pr.width, ymin / 1000 * pr.height, xmax / 1000 * pr.width, ymax / 1000 * pr.height)
            rect = snap(rect, figure_rects(page), pr)
            name = f"Q{int(m.group(1)):02d}_{m.group(2)}.png"
            page.get_pixmap(dpi=DPI, clip=rect).save(str(img_dir / name))
            f["file"] = name
            f["rect_pt"] = [round(v, 1) for v in rect]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("branch")
    ap.add_argument("--paper", required=True)
    ap.add_argument("--passes", default="ab")
    a = ap.parse_args()
    code, pid = a.branch.upper(), a.paper
    load_env()
    from google import genai
    client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

    doc = fitz.open(pdf_path(code, pid, "qp"))
    work = WORK / code / pid
    (work / "pages").mkdir(parents=True, exist_ok=True)
    for i, page in enumerate(doc, start=1):  # step 1: render + text layer (free, local)
        png = work / "pages" / f"p{i:03d}.png"
        if not png.exists():
            page.get_pixmap(dpi=DPI).save(str(png))
            (work / "pages" / f"p{i:03d}.txt").write_text(norm(page.get_text()), encoding="utf-8")
    print(f"{pid}: {len(doc)} pages rendered")

    try:
        for name in a.passes:
            run_pass(client, name, doc, work)
    except QuotaExhausted as e:
        print(f"PAUSED — AI quota exhausted ({e}). Run the same command later to resume.")
        return 2

    for name in a.passes:
        qs = merge_pages(len(doc), work, name)
        if name == "a":  # images are cropped from pass A (pass B only cross-checks)
            crop_figures(doc, work, qs, PYQ / code / "images" / pid)
        write_json(work / f"questions.pass_{name}.json", {"paper": pid, "model": MODELS[name], "questions": [qs[k] for k in sorted(qs)]})
        print(f"  pass {name}: {len(qs)} questions merged")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
