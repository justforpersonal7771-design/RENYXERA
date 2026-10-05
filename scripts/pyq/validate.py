"""Step 5: validation gates for one paper. Nothing is fixed silently: every problem becomes a
flag on that question, and a question goes into the bank only when it has no flags or a human
has approved it (review step).

Checks per question (see docs/PYQ_ACQUISITION_STRATEGY.md §2 step 5):
  presence       question 1..65 transcribed (questions.json from crop.py; older runs: pass A)
  key            official key row exists; type/marks/section taken from the key
  options        MCQ/MSQ: exactly A,B,C,D, none empty. NAT: no options
  images         every placeholder has a crop file (>= 40 px each side) and every crop is used
  maths          every maths segment compiles in MathJax (scripts/pyq/tex-check.mjs)
  text layer     words (3+ letters) and numbers of the official PDF text for this question
                 appear in the extracted text (catches dropped lines, wrong numbers)
  double pass    only when a second independent pass exists: numbers, option count, placeholders agree
  model flag     the model itself marked the question uncertain

Output: data/pyq/_work/<BRANCH>/<paper>/validated.json and data/pyq/<BRANCH>/reports/<paper>.md

    python scripts/pyq/validate.py EC --paper EC_2026
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import unicodedata
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import PYQ, ROOT, WORK, read_json, write_json  # noqa: E402

NUM = re.compile(r"(?<![\w.])-?\d+(?:\.\d+)?(?![\w.])")
PH = re.compile(r"\[IMAGE_Q_(\d{2})_([A-D]|\d+)\]")


def fold(s: str) -> str:
    s = unicodedata.normalize("NFKC", s)
    s = re.sub(r"\\(log|ln|det|sin|cos|tan|exp|lim|max|min)(?![a-zA-Z])", r" \1", s)  # function names are printed words
    s = re.sub(r"\\[a-zA-Z]+", " ", s)          # drop LaTeX commands (\frac, \text ...)
    s = re.sub(r"[{}_^$\\()\[\]]", " ", s)
    return re.sub(r"\s+", " ", s).lower().strip()


def words(s: str) -> set[str]:
    return set(re.findall(r"[a-z]{3,}", fold(s)))


def numbers(s: str) -> set[str]:
    out = set()
    for n in NUM.findall(unicodedata.normalize("NFKC", s)):
        try:
            v = float(n)
        except ValueError:
            continue
        out.add(("%g" % v).lstrip("-"))
    return out


def question_regions(work: Path, pages: int) -> dict[int, str]:
    """Official text of each question: from its 'Q.n' marker to the next marker (across pages)."""
    text = ""
    for i in range(1, pages + 1):
        p = work / "pages" / f"p{i:03d}.txt"
        if p.exists():
            text += "\n" + p.read_text(encoding="utf-8")
    # section headers ("Q.11 - Q.35 Carry ONE mark Each") are not question markers
    text = re.sub(r"Q\.\s?\d{1,2}\s*[-\u2013]\s*Q\.\s?\d{1,2}\s*Carry \w+ marks? Each", " ", text, flags=re.I)
    spans = [(int(m.group(1)), m.start(), m.end()) for m in re.finditer(r"(?<![\w.])Q\.\s?(\d{1,2})(?!\d)", text)]
    regions: dict[int, str] = {}
    for idx, (n, _s, e) in enumerate(spans):
        end = spans[idx + 1][1] if idx + 1 < len(spans) else len(text)
        chunk = text[e:end]
        # drop repeated page furniture lines
        chunk = re.split(r"Q\. No\. Session Question Type", chunk)[0]  # answer-key table appended to the paper (2022)
        chunk = re.sub(r"(?i)((gate 20\d\d )?electronics (and|&) communications? engineering \(ec\)|page \d+( of \d+)?|organi[sz]ing institute:? (iit \w+|iisc,? bengaluru|iisc,? bangalore))", " ", chunk)
        regions.setdefault(n, chunk)
    return regions


def figure_words(code: str, pid: str, qs: list[dict]) -> dict[int, tuple[set, set]]:
    """Words and numbers printed inside each question's figures (labels such as '1 kΩ'): they live in
    the image, so the text-layer check must not expect them in the question text."""
    import fitz
    from common import pdf_path
    doc = fitz.open(pdf_path(code, pid, "qp"))
    out: dict[int, tuple[set, set]] = {}
    for q in qs:
        txt = []
        for f in (f for qq in qs if set(qq.get("pages", [])) & set(q.get("pages", [])) for f in qq.get("figures", [])):
            if f.get("rect_pt"):
                r = fitz.Rect(f["rect_pt"])
                txt += [w[4] for w in doc[f["page"] - 1].get_text("words") if fitz.Rect(w[:4]).intersects(r)]
        s = " ".join(txt)
        out[q["qno"]] = (words(s), numbers(s))
    return out


def full_text(q: dict) -> str:
    return q.get("question_text", "") + "\n" + "\n".join(o.get("text", "") for o in q.get("options", []))


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("branch")
    ap.add_argument("--paper", required=True)
    a = ap.parse_args()
    code, pid = a.branch.upper(), a.paper
    work = WORK / code / pid
    key = read_json(work / "key.json")
    qa = read_json(work / "questions.json") or read_json(work / "questions.pass_a.json")
    qb = read_json(work / "questions.pass_b.json") if qa and qa.get("source") != "claude-transcription" else None
    if not key or not qa:
        print("Run keys.py and crop.py first.")
        return 1
    fig_words = figure_words(code, pid, qa["questions"])
    A = {q["qno"]: q for q in qa["questions"]}
    B = {q["qno"]: q for q in qb["questions"]} if qb else None
    pages = len(list((work / "pages").glob("p*.png")))
    regions = question_regions(work, pages)
    img_dir = PYQ / code / "images" / pid

    # Compile all maths once, via the app's MathJax.
    tex_in = {f"{n}": full_text(q) for n, q in A.items()}
    tmp = work / "tex_in.json"
    write_json(tmp, tex_in)
    res = subprocess.run(["node", str(ROOT / "scripts/pyq/tex-check.mjs"), str(tmp)], capture_output=True, text=True, encoding="utf-8")
    tex_errs = json.loads(res.stdout or "{}") if res.returncode == 0 else {"*": [res.stderr[:300]]}

    out = []
    for row in key["rows"]:
        n = row["qno"]
        flags: list[str] = []
        q = A.get(n)
        if not q:
            out.append({"qno": n, "flags": ["missing: question not extracted"], "key": row})
            continue
        opts = q.get("options", [])
        ids = [o.get("option_id") for o in opts]
        if row["type"] in ("MCQ", "MSQ"):
            if ids != ["A", "B", "C", "D"]:
                flags.append(f"options: expected A,B,C,D, got {ids}")
            for o in opts:
                if not (o.get("text") or "").strip():
                    flags.append(f"options: option {o.get('option_id')} is empty")
        elif opts:
            flags.append(f"options: NAT question has {len(opts)} options")
        # images
        placeholders = set(PH.findall(full_text(q)))
        figs = {(m.group(1), m.group(2)) for f in q.get("figures", []) if (m := PH.fullmatch("[" + f.get("placeholder", "").strip("[] ") + "]"))}
        if placeholders != figs:
            flags.append(f"images: placeholders {sorted(placeholders)} vs figures {sorted(figs)}")
        for f in q.get("figures", []):
            if f.get("crop_error") or not f.get("file"):
                flags.append(f"images: {f.get('placeholder')} not cropped ({f.get('crop_error', 'no file')})")
                continue
            try:
                from PIL import Image
                with Image.open(img_dir / f["file"]) as im:
                    if im.width < 40 or im.height < 40:
                        flags.append(f"images: {f['file']} is tiny ({im.width}x{im.height})")
            except Exception as e:  # noqa: BLE001
                flags.append(f"images: {f.get('file')} unreadable ({e})")
        # maths
        for e in tex_errs.get(str(n), []) + tex_errs.get("*", []):
            flags.append(f"maths: {e}")
        # official text layer vs extraction
        official = regions.get(n, "")
        if official:
            fw_words, fw_nums = fig_words.get(n, (set(), set()))
            ow, ew = words(official) - fw_words, words(full_text(q))
            glued = re.sub(r"[^a-z]", "", fold(full_text(q)))  # maths in the text layer is glued: V_{BE} -> "vbe"
            missing_w = sorted(w for w in ow - ew if w not in glued)
            if ow and len(missing_w) / len(ow) > 0.08:
                flags.append(f"text layer: {len(missing_w)}/{len(ow)} official words missing, e.g. {missing_w[:6]}")
            digits = re.sub(r"\D", "", full_text(q))  # superscripts are glued too: 10^{4} -> "104"
            missing_n = sorted(x for x in numbers(official) - fw_nums - numbers(full_text(q)) - {str(n)} if x.replace(".", "") not in digits)
            if missing_n:
                flags.append(f"text layer: numbers in the PDF not in extraction: {missing_n[:8]}")
        else:
            flags.append("text layer: no official text found for this question (image-only page?)")
        # double pass
        b = B.get(n) if B is not None else None
        if B is None:
            pass  # single careful transcription checked against the PDF text layer above
        elif not b:
            flags.append("double pass: pass B missing this question")
        else:
            if numbers(full_text(q)) != numbers(full_text(b)):
                flags.append(f"double pass: numbers differ A∖B {sorted(numbers(full_text(q)) - numbers(full_text(b)))[:6]} B∖A {sorted(numbers(full_text(b)) - numbers(full_text(q)))[:6]}")
            if len(b.get("options", [])) != len(opts):
                flags.append(f"double pass: option count A={len(opts)} B={len(b.get('options', []))}")
            if set(PH.findall(full_text(b))) != placeholders:
                flags.append("double pass: image placeholders differ")
        if q.get("uncertain"):
            flags.append(f"model: uncertain — {q.get('uncertain_reason', '')}")
        if row.get("renumbered"):
            flags.append("key: question numbers renumbered from a GA/core split key — confirm")
        if key.get("source") in ("vision", "manual"):
            flags.append("key: answer key was read from a scanned image — confirm the answer")
        out.append({"qno": n, "flags": flags, "key": row, "pages": q.get("pages")})

    extra = sorted(set(A) - {r["qno"] for r in key["rows"]})
    ok = sum(1 for r in out if not r["flags"])
    write_json(work / "validated.json", {"paper": pid, "passed": ok, "total": len(out), "extra_questions": extra, "questions": out})

    lines = [f"# Validation report — {pid}", "", f"**{ok} of {len(out)} questions pass every check automatically.** "
             f"{len(out) - ok} need review." + (f" Extra question numbers extracted: {extra}." if extra else ""), "",
             "| Q | Type | Key | Status | Flags |", "|---|---|---|---|---|"]
    for r in out:
        k = r["key"]
        lines.append(f"| {r['qno']} | {k['type']} | {k['raw']} | {'✅' if not r['flags'] else '⚠️'} | {'<br>'.join(r['flags']) if r['flags'] else ''} |")
    rep = PYQ / code / "reports" / f"{pid}.md"
    rep.parent.mkdir(parents=True, exist_ok=True)
    rep.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"{pid}: {ok}/{len(out)} pass; report {rep}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
