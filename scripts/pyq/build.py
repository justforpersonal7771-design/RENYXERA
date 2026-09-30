"""Step 8: assemble ONE question-bank file per branch.

    data/pyq/<BRANCH>/gate_<branch>_pyqs.json

A question is included only when it passed every validation check, or a reviewer approved
it in data/pyq/<BRANCH>/reviews/<paper>.json (see review step). Anything else is listed as
pending in the build summary — never shipped half-checked.

Format = the CS bank's format (exam_metadata + questions[], same field names) plus
provenance: the official source files with SHA-256, and per-question review status.

    python scripts/pyq/build.py EC
"""
from __future__ import annotations

import argparse
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import BRANCH_NAMES, PYQ, RAW, WORK, question_id, read_json, write_json  # noqa: E402

SHIFT = {None: "", 1: "S1", 2: "S2"}


def nat_range(ans: dict) -> str | None:
    r = ans.get("nat")
    if not r:
        return None
    return " or ".join(f"{lo:g} to {hi:g}" for lo, hi in r)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("branch")
    a = ap.parse_args()
    code = a.branch.upper()
    manifest = read_json(RAW / code / "manifest.json", {}) or {}
    papers, pending = [], []
    total = 0
    for pid in sorted(manifest, key=lambda p: (manifest[p]["year"], manifest[p]["session"] or 0), reverse=True):
        m = manifest[pid]
        val = read_json(WORK / code / pid / "validated.json")
        ext = read_json(WORK / code / pid / "questions.json") or read_json(WORK / code / pid / "questions.pass_a.json")
        tags = read_json(WORK / code / pid / "tags.json", {}) or {}
        reviews = read_json(PYQ / code / "reviews" / f"{pid}.json", {}) or {}
        if not val or not ext:
            pending.append(f"{pid}: not extracted/validated yet")
            continue
        A = {q["qno"]: q for q in ext["questions"]}
        qs = []
        for v in val["questions"]:
            n = v["qno"]
            rev = reviews.get(str(n), {})
            if v["flags"] and rev.get("status") != "approved":
                pending.append(f"{pid} Q{n}: " + "; ".join(v["flags"])[:160])
                continue
            q = {**A[n], **(rev.get("edits") or {})}  # reviewer edits win
            k = v["key"]
            ans = k["answer"]
            correct = set(ans.get("options", []))
            imgs = sorted({f["placeholder"].strip("[]") for f in q.get("figures", [])})
            t = tags.get(str(n), {})
            qs.append({
                "question_no": n,
                "question_id": question_id(code, m["year"], m["session"], n),
                "question_type": k["type"],
                "marks": k["marks"],
                "section": "GENERAL APTITUDE (GA)" if k["section"] == "GA" else t.get("section", BRANCH_NAMES[code].upper()),
                "subject": t.get("subject", ""),
                "topic": t.get("topic", ""),
                "difficulty": t.get("difficulty", ""),
                "question_text": q["question_text"],
                "has_image": bool(imgs),
                "images_required": imgs,
                "options": [{"option_id": o["option_id"], "text": o["text"], "is_correct": o["option_id"] in correct,
                             "has_image": "[IMAGE_Q_" in o["text"]} for o in q.get("options", [])],
                "nat_answer_range": nat_range(ans),
                "marks_to_all": bool(ans.get("mta")),
                "review": "approved" if v["flags"] else "auto",
            })
            total += 1
        papers.append({
            "exam_metadata": {"year-shift": f"{m['year']}" + (f"-{SHIFT[m['session']]}" if m["session"] else ""),
                              "branch": code, "paper": pid,
                              "source": {"question_paper": m["qp_url"], "question_paper_sha256": m["qp_sha256"],
                                         "answer_key": m["key_url"], "answer_key_sha256": m["key_sha256"]}},
            "questions": sorted(qs, key=lambda x: x["question_no"]),
        })
    out = PYQ / code / f"gate_{code.lower()}_pyqs.json"
    write_json(out, {"branch": code, "branch_name": BRANCH_NAMES[code], "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
                     "papers": papers})
    print(f"{out}: {total} questions in {len(papers)} papers; {len(pending)} pending review")
    for p in pending[:40]:
        print("  pending", p)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
