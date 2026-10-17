"""Verify the CS bank (data/Aggregated_Output.json) against the official papers + keys.

For every official CS paper fetched into data/pyq/official_pdfs/CS (run fetch/keys/render first):
  * key:  bank correct options (MCQ/MSQ) or NAT range vs the official key (exact; MTA noted)
  * text: words and numbers of the official question text missing from the bank text
Writes data/pyq/CS/reports/verify-<paper>.md and prints a summary. Read-only on the bank.

    python scripts/pyq/verify-cs.py            # every paper with a key.json
    python scripts/pyq/verify-cs.py --paper CS_2025_S1
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import PYQ, WORK, read_json  # noqa: E402
from validate import question_regions, words, numbers  # noqa: E402

BANK = Path(__file__).resolve().parents[2] / "data" / "Aggregated_Output.json"
SHIFT = {None: "FN", 1: "FN", 2: "AN"}


def bank_index() -> dict[str, dict]:
    out = {}
    for paper in json.loads(BANK.read_text(encoding="utf-8")):
        for q in paper["questions"]:
            out[q["question_id"]] = q
    return out


def nat_ranges(s: str | None) -> list[tuple[float, float]]:
    rs = []
    for part in re.split(r"\s+OR\s+|;", s or "", flags=re.I):
        m = re.fullmatch(r"\s*(-?\d+(?:\.\d+)?)\s*(?:to|-)\s*(-?\d+(?:\.\d+)?)\s*", part)
        if m:
            a, b = float(m.group(1)), float(m.group(2))
            rs.append((min(a, b), max(a, b)))
        elif re.fullmatch(r"\s*-?\d+(?:\.\d+)?\s*", part):
            rs.append((float(part), float(part)))
    return sorted(rs)


HDR = re.compile(r"(?i)(gate 20\d\d\s*)?computer science (and|&) information technology( \(cs\d?\))?( set \d)?|cs\s?\d?|gate 20\d\d|page \d+ of \d+|organi[sz]ing institute:?\s*(iit \w+|iisc,? \w+)")


def strip_hdr(s: str) -> str:
    return HDR.sub(" ", s)


def bank_text(q: dict) -> str:
    return q.get("question_text", "") + "\n" + "\n".join(o.get("text", "") for o in q.get("options", []))


def check(pid: str, bank: dict, manifest: dict) -> tuple[int, list[str]]:
    m = manifest[pid]
    key = read_json(WORK / "CS" / pid / "key.json")
    pages = len(list((WORK / "CS" / pid / "pages").glob("p*.txt")))
    regions = question_regions(WORK / "CS" / pid, pages) if pages else {}
    # Some PDFs (2023) print each "Q.n" label after its question's text in the text layer. Try the
    # page that holds the label as an alternative region and keep whichever reading matches better.
    _pg = sorted((WORK / "CS" / pid / "pages").glob("p*.txt"))
    _texts = [t.read_text(encoding="utf-8") for t in _pg]
    alt = {}
    for n in range(1, 66):
        hit = [t for t in _texts if re.search(rf"Q\.\s?{n}(?!\d)", t)]
        if hit:
            alt[n] = hit[0]
    _pre = f"GATE_CS_{m['year']}_{SHIFT[m['session']]}"
    def _score(rg):
        tot = 0.0
        for n in range(11, 66):
            q = bank.get(f"{_pre}_Q{n}")
            ow = words(strip_hdr(rg.get(n, "")))
            if q and ow:
                tot += len(ow & words(bank_text(q))) / len(ow)
        return tot
    if _score(alt) > _score(regions) + 5:
        regions = alt
    prefix = f"GATE_CS_{m['year']}_{SHIFT[m['session']]}"
    # Pair official questions with bank questions by wording (the bank's numbering can differ
    # from the official paper, e.g. 2024). Greedy best-first on word overlap within the shift.
    pool = {qid: q for qid, q in bank.items() if qid.startswith(prefix + "_Q")}
    cand = []
    for k in key["rows"]:
        ow = words(strip_hdr(regions.get(k["qno"], "")))
        for qid, q in pool.items():
            if ow:
                cand.append((len(ow & words(bank_text(q))) / len(ow), k["qno"], qid))
    pair, used = {}, set()
    # same number first, when its wording clearly matches
    for sc, n, qid in cand:
        if qid == f"{prefix}_Q{n}" and sc >= 0.6:
            pair[n] = qid; used.add(qid)
    for sc, n, qid in sorted(cand, reverse=True):
        if n not in pair and qid not in used and sc >= 0.5:
            pair[n] = qid; used.add(qid)
    rows, issues = [], 0
    for k in key["rows"]:
        n = k["qno"]
        qid = pair.get(n, f"{prefix}_Q{n}")
        q = bank.get(qid)
        renum = qid != f"{prefix}_Q{n}"
        flags = []
        if not q:
            flags.append("missing from bank")
        else:
            a = k["answer"]
            if a.get("mta"):
                flags.append("note: official key says marks to all")
            elif "nat" in a:
                off = sorted((float(x), float(y)) for x, y in a["nat"])
                mine = nat_ranges(q.get("nat_answer_range"))
                if q.get("question_type") != "NAT":
                    flags.append(f"type: bank {q.get('question_type')} vs official NAT")
                elif [tuple(round(v, 4) for v in r) for r in mine] != [tuple(round(v, 4) for v in r) for r in off]:
                    flags.append(f"KEY: bank '{q.get('nat_answer_range')}' vs official '{k['raw']}'")
            else:
                off = set(a.get("options", []))
                mine = {o["option_id"] for o in q.get("options", []) if o.get("is_correct")}
                if mine != off:
                    flags.append(f"KEY: bank {sorted(mine)} vs official {sorted(off)}")
            if renum:
                flags.append(f"note: matched bank {qid.rsplit('_', 1)[1]} (numbering differs)")
            official = strip_hdr(regions.get(n, ""))
            if official:
                ow, bw = words(official), words(bank_text(q))
                glued = re.sub(r"[^a-z]", "", bank_text(q).lower())
                miss = sorted(w for w in ow - bw if w not in glued)
                if ow and len(miss) / len(ow) > 0.12:
                    flags.append(f"text: {len(miss)}/{len(ow)} official words missing, e.g. {miss[:6]}")
                on, bn = numbers(official), numbers(bank_text(q))
                nmiss = sorted(on - bn)
                if nmiss:
                    flags.append(f"numbers in official text not in bank: {nmiss[:8]}")
        if any(not f.startswith("note") for f in flags):
            issues += 1
        rows.append(f"| {n} | {k['type']} | {k['raw']} | {'⚠️' if flags else '✅'} | {'<br>'.join(flags)} |")
    report = PYQ / "CS" / "reports" / f"verify-{pid}.md"
    report.parent.mkdir(parents=True, exist_ok=True)
    report.write_text(f"# CS bank vs official {pid} ({prefix})\n\n| Q | Type | Official key | | Flags |\n|---|---|---|---|---|\n" + "\n".join(rows) + "\n", encoding="utf-8")
    return issues, [r for r in rows if "⚠️" in r]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--paper")
    a = ap.parse_args()
    manifest = read_json(PYQ.parent / "pyq" / "official_pdfs" / "CS" / "manifest.json", {}) or read_json(Path("data/pyq/official_pdfs/CS/manifest.json"))
    bank = bank_index()
    total = 0
    for pid in sorted(manifest):
        if a.paper and pid != a.paper:
            continue
        if not (WORK / "CS" / pid / "key.json").exists():
            print(f"skip {pid}: no key.json")
            continue
        n, _ = check(pid, bank, manifest)
        total += n
        print(f"{pid}: {n} question(s) flagged")
    print(f"total flagged: {total}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
