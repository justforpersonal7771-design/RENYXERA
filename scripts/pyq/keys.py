"""Step 4: official answer key -> exact keys per question (no AI when the PDF has text).

Output: data/pyq/_work/<BRANCH>/<paper>/key.json
    {"paper": "EC_2026", "source": "text"|"manual", "rows": [
        {"qno": 1, "type": "MCQ", "section": "GA", "marks": 1,
         "answer": {"options": ["B"]} | {"options": ["B","D"]} | {"nat": [[2.5, 2.7]]} | {"mta": true},
         "raw": "B"} ...]}

Every key is checked before it is written: question numbers 1..N with no gaps, total marks
100, GA = Q1-10 worth 15, MCQ has exactly one option, MSQ one or more, NAT a numeric range.
A scanned (image-only) key is transcribed by Claude into data/pyq/<BR>/keys_manual/<paper>.tsv
(source="manual"); the reviewer confirms it against the PDF.

    python scripts/pyq/keys.py EC            # every paper in the EC manifest
    python scripts/pyq/keys.py EC --paper EC_2026
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

import fitz  # PyMuPDF

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import PYQ, RAW, WORK, pdf_path, read_json, write_json  # noqa: E402

ROW = re.compile(
    r"(?<!\S)(\d{1,2})\s+(\d{1,2})\s+(MCQ|MSQ|NAT)\s+([A-Z]{2,4})\s+(.+?)\s+([12])(?=\s+\d{1,2}\s+\d{1,2}\s+(?:MCQ|MSQ|NAT)\b|\s*$)",
    re.S,
)


def parse_answer(qtype: str, raw: str) -> dict:
    s = raw.strip().replace("–", "-").replace("—", "-")
    if re.fullmatch(r"MTA\*?", s, re.I) or "marks to all" in s.lower():
        return {"mta": True}
    if qtype in ("MCQ", "MSQ"):
        letters = re.findall(r"\b([A-D])\b", s.upper())
        if not letters or re.sub(r"[\sA-D;,/&]|OR|AND", "", s.upper()):
            raise ValueError(f"unexpected {qtype} key '{raw}'")
        return {"options": sorted(set(letters))}
    # NAT: "2.5 to 2.7", "2.5 - 2.7", "-1.2 to -1.1", "4" ; several ranges separated by "OR" or ";"
    ranges = []
    for part in re.split(r"\s+OR\s+|;", s, flags=re.I):
        m = re.fullmatch(r"\s*(-?\d+(?:\.\d+)?)\s*(?:to|-)\s*(-?\d+(?:\.\d+)?)\s*", part, re.I)
        if m:
            lo, hi = float(m.group(1)), float(m.group(2))
            ranges.append([min(lo, hi), max(lo, hi)])
            continue
        m = re.fullmatch(r"\s*(-?\d+(?:\.\d+)?)\s*", part)
        if m:
            v = float(m.group(1))
            ranges.append([v, v])
            continue
        raise ValueError(f"unexpected NAT key '{raw}'")
    return {"nat": ranges}


def rows_from_text(doc: fitz.Document) -> list[dict]:
    """Read the table row by row using word positions, so page headers/footers never mix in.
    A table row is a line whose words are: Q.No, Session, MCQ|MSQ|NAT, Section, Key..., Marks."""
    rows = []
    for page in doc:
        lines: dict[int, list] = {}
        for x0, y0, x1, y1, word, *_ in page.get_text("words"):
            yc = round((y0 + y1) / 2 / 3)  # words within ~3pt vertically share a line
            lines.setdefault(yc, []).append((x0, word))
        for yc in sorted(lines):
            toks = [w for _, w in sorted(lines[yc])]
            if len(toks) < 6 or not (toks[0].isdigit() and toks[1].isdigit()) or toks[2] not in ("MCQ", "MSQ", "NAT") or not toks[-1] in ("1", "2"):
                continue
            qno, qtype, section, marks = int(toks[0]), toks[2], toks[3], int(toks[-1])
            raw = " ".join(toks[4:-1])
            rows.append({"qno": qno, "type": qtype, "section": section, "marks": marks, "raw": raw,
                         "answer": parse_answer(qtype, raw)})
    return rows


def renumber_sections(rows: list[dict]) -> list[dict]:
    """Some years (e.g. 2021) number GA 1-10 and then restart the subject at 1. Convert to 1..65."""
    ga = [r for r in rows if r["section"] == "GA"]
    core = [r for r in rows if r["section"] != "GA"]
    if ga and core and min(r["qno"] for r in core) == 1:
        offset = max(r["qno"] for r in ga)
        for r in core:
            r["qno"] += offset
            r["renumbered"] = True
    return rows


def rows_from_manual(code: str, pid: str) -> list[dict]:
    """Scanned (image-only) key: Claude transcribes the key image row by row into
    data/pyq/<BR>/keys_manual/<pid>.tsv (tracked in git): Q.No, Type, Section, Key/Range, Marks,
    tab-separated, exactly as printed. No AI API is involved."""
    f = PYQ / code / "keys_manual" / f"{pid}.tsv"
    if not f.exists():
        raise ValueError(f"scanned key: transcribe it into {f.relative_to(PYQ.parent.parent)} first")
    rows = []
    for line in f.read_text(encoding="utf-8").splitlines():
        if not line.strip() or line.startswith("#"):
            continue
        qno, qtype, section, raw, marks = [c.strip() for c in line.split("\t")]
        rows.append({"qno": int(qno), "type": qtype, "section": section.upper(), "marks": int(marks), "raw": raw,
                     "answer": parse_answer(qtype, raw)})
    return rows


def check(rows: list[dict]) -> list[str]:
    errs = []
    nums = [r["qno"] for r in rows]
    n = max(nums) if nums else 0
    if sorted(nums) != list(range(1, n + 1)):
        missing = sorted(set(range(1, n + 1)) - set(nums))
        dupes = sorted({x for x in nums if nums.count(x) > 1})
        errs.append(f"question numbers not 1..{n} (missing {missing}, duplicate {dupes})")
    if n != 65:
        errs.append(f"expected 65 questions, found {n}")
    total = sum(r["marks"] for r in rows)
    if total != 100:
        errs.append(f"total marks {total}, expected 100")
    ga = [r for r in rows if r["qno"] <= 10]
    if any(r["section"] != "GA" for r in ga) or sum(r["marks"] for r in ga) != 15:
        errs.append("Q1-10 should be GA worth 15 marks")
    for r in rows:
        a = r["answer"]
        if "mta" in a:
            continue
        if r["type"] == "MCQ" and len(a.get("options", [])) != 1:
            errs.append(f"Q{r['qno']}: MCQ must have exactly one key, got '{r['raw']}'")
        if r["type"] == "MSQ" and not a.get("options"):
            errs.append(f"Q{r['qno']}: MSQ has no keys")
        if r["type"] == "NAT" and not a.get("nat"):
            errs.append(f"Q{r['qno']}: NAT has no range")
    return errs


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("branch")
    ap.add_argument("--paper")
    a = ap.parse_args()
    code = a.branch.upper()
    manifest = read_json(RAW / code / "manifest.json", {}) or {}
    bad = 0
    for pid in sorted(manifest):
        if a.paper and pid != a.paper:
            continue
        doc = fitz.open(pdf_path(code, pid, "key"))
        has_text = sum(len(p.get_text().strip()) for p in doc) > 200
        try:
            rows = renumber_sections(rows_from_text(doc) if has_text else rows_from_manual(code, pid))
        except ValueError as e:
            print(f"FAIL {pid}: {e}")
            bad += 1
            continue
        errs = check(rows)
        out = {"paper": pid, "source": "text" if has_text else "manual", "rows": sorted(rows, key=lambda r: r["qno"]), "errors": errs}
        write_json(WORK / code / pid / "key.json", out)
        mta = sum(1 for r in rows if "mta" in r["answer"])
        types_ = {t: sum(1 for r in rows if r["type"] == t) for t in ("MCQ", "MSQ", "NAT")}
        status = "OK  " if not errs else "FAIL"
        bad += bool(errs)
        print(f"{status} {pid}: {len(rows)} keys via {out['source']} · {types_} · MTA {mta}" + ("".join(f"\n       - {e}" for e in errs)))
    return 1 if bad else 0


if __name__ == "__main__":
    raise SystemExit(main())
