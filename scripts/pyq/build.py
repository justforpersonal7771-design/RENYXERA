"""Step 8: assemble ONE question-bank file per branch.

    data/pyq/<BRANCH>/gate_<branch>_pyqs.json

A question is included only when it passed every validation check, or a reviewer approved
it in data/pyq/<BRANCH>/reviews/<paper>.json (see review step). Anything else is listed as
pending in the build summary — never shipped half-checked.

Format = EXACTLY the CS bank's format (data/Aggregated_Output.json): a top-level list of
{"exam_metadata": {"year-shift": ...}, "questions": [...]}, same question fields, nothing extra.
Marks-to-all questions mark every option is_correct (as the CS bank does).
Provenance (source URLs + SHA-256, MTA and review status) goes to gate_<branch>_pyqs.meta.json.

    python scripts/pyq/build.py EC
"""
from __future__ import annotations

import argparse
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import BRANCH_NAMES, PYQ, RAW, WORK, question_id, read_json, write_json  # noqa: E402


# Every branch bank has exactly three sections, like CS: General Aptitude, Maths, Core.
# The official syllabus sections stay in data/pyq/<BR>/syllabus.json and the tag files; the bank
# groups them here. Generated ("forged") questions must use the same three names.
DA_MATHS = {"SECTION 1: PROBABILITY AND STATISTICS", "SECTION 2: LINEAR ALGEBRA", "SECTION 3: CALCULUS AND OPTIMIZATION"}


def group_section(code, official):
    if "ENGINEERING MATHEMATICS" in official or (code == "DA" and official in DA_MATHS):
        return "ENGINEERING MATHEMATICS"
    return f"CORE {code}"
from tagcodes import load_tags  # noqa: E402

SHIFT = {None: "", 1: "S1", 2: "S2"}


# A marks-to-all NAT accepts any number (the app shows it as "Any value (marks to all)").
MTA_NAT_RANGE = "-1000000000 to 1000000000"


def nat_range(ans: dict) -> str | None:
    if ans.get("mta"):
        return MTA_NAT_RANGE
    r = ans.get("nat")
    if not r:
        return None
    return " or ".join(f"{lo:.10g} to {hi:.10g}" for lo, hi in r)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("branch")
    a = ap.parse_args()
    code = a.branch.upper()
    manifest = read_json(RAW / code / "manifest.json", {}) or {}
    papers, pending = [], []
    meta_p, meta_q = {}, {}
    total = 0
    for pid in sorted(manifest, key=lambda p: (manifest[p]["year"], manifest[p]["session"] or 0), reverse=True):
        m = manifest[pid]
        val = read_json(WORK / code / pid / "validated.json")
        ext = read_json(WORK / code / pid / "questions.json") or read_json(WORK / code / pid / "questions.pass_a.json")
        tags, tag_errs = load_tags(code, pid)  # Claude's tags (data/pyq/<BRANCH>/tags), expanded from the closed syllabus list
        if tag_errs:
            raise SystemExit("; ".join(tag_errs))
        tags = tags or read_json(WORK / code / pid / "tags.json", {}) or {}
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
            if ans.get("mta"):
                correct = {o["option_id"] for o in q.get("options", [])}
            imgs = sorted({f["placeholder"].strip("[]") for f in q.get("figures", [])})
            t = tags.get(str(n), {})
            qs.append({
                "question_no": n,
                "question_id": question_id(code, m["year"], m["session"], n),
                "question_type": k["type"],
                "marks": k["marks"],
                "section": "GENERAL APTITUDE (GA)" if k["section"] == "GA" else group_section(code, t.get("section", "")),
                "subject": t.get("subject", ""),
                "topic": t.get("topic", ""),
                "difficulty": t.get("difficulty", ""),
                "question_text": q["question_text"],
                "has_image": bool(imgs),
                "images_required": imgs,
                "options": [{"option_id": o["option_id"], "text": o["text"], "is_correct": o["option_id"] in correct,
                             "has_image": "[IMAGE_Q_" in o["text"]} for o in q.get("options", [])],
                "nat_answer_range": nat_range(ans),
            })
            meta_q[f"{pid}:{n}"] = {"marks_to_all": bool(ans.get("mta")), "review": "approved" if v["flags"] else "auto"}
            total += 1
        ys = f"{m['year']}" + (f"-{SHIFT[m['session']]}" if m["session"] else "")
        papers.append({"exam_metadata": {"year-shift": ys}, "questions": sorted(qs, key=lambda x: x["question_no"])})
        meta_p[ys] = {"paper": pid, "question_paper": m["qp_url"], "question_paper_sha256": m["qp_sha256"],
                      "answer_key": m["key_url"], "answer_key_sha256": m["key_sha256"]}
    out = PYQ / code / f"gate_{code.lower()}_pyqs.json"
    write_json(out, papers)
    write_json(PYQ / code / f"gate_{code.lower()}_pyqs.meta.json",
               {"branch": code, "branch_name": BRANCH_NAMES[code], "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
                "papers": meta_p, "questions": meta_q})
    print(f"{out}: {total} questions in {len(papers)} papers; {len(pending)} pending review")
    for p in pending[:40]:
        print("  pending", p)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
