"""Forge B1: profile a branch's official PYQs — per subject/topic: questions, marks, type mix, difficulty
mix and a 3-year trend weight. The blueprint for every Forge batch is drawn from this.

    python scripts/forge/profile.py CS        -> data/forge/CS/profile.json
"""
import json, sys, collections, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = {"CS": ROOT / "data" / "Aggregated_Output.json"}
for b in ("EC", "EE", "ME", "CE", "DA"):
    SRC[b] = ROOT / "data" / "pyq" / b / f"gate_{b.lower()}_pyqs.json"


def main(branch: str) -> None:
    papers = json.loads(SRC[branch].read_text(encoding="utf-8"))
    years = sorted({int(str(p["exam_metadata"]["year-shift"])[:4]) for p in papers})
    recent = set(years[-3:])
    topics = collections.defaultdict(lambda: {"subject": "", "questions": 0, "marks": 0, "recent_marks": 0,
                                             "types": collections.Counter(), "difficulty": collections.Counter(), "years": set()})
    for p in papers:
        year = int(str(p["exam_metadata"]["year-shift"])[:4])
        for q in p["questions"]:
            if "GENERAL APTITUDE" in str(q.get("section", "")).upper():
                key_subject = "General Aptitude"
            else:
                key_subject = q.get("subject") or "Unknown"
            t = topics[(key_subject, q.get("topic") or "General")]
            t["subject"] = key_subject
            t["questions"] += 1
            t["marks"] += int(q.get("marks") or 0)
            if year in recent:
                t["recent_marks"] += int(q.get("marks") or 0)
            t["types"][q.get("question_type", "MCQ")] += 1
            t["difficulty"][str(q.get("difficulty", "M"))] += 1
            t["years"].add(year)
    n_papers = len(papers)
    n_recent = sum(1 for p in papers if int(str(p["exam_metadata"]["year-shift"])[:4]) in recent) or 1
    out = []
    for (subject, topic), t in topics.items():
        per_paper = t["marks"] / n_papers
        recent_pp = t["recent_marks"] / n_recent
        out.append({
            "subject": subject, "topic": topic, "questions": t["questions"], "marks": t["marks"],
            "marks_per_paper": round(per_paper, 3), "recent_marks_per_paper": round(recent_pp, 3),
            # weight for batch planning: recent papers count double
            "weight": round((per_paper + 2 * recent_pp) / 3, 4),
            "years_asked": len(t["years"]), "types": dict(t["types"]), "difficulty": dict(t["difficulty"]),
        })
    out.sort(key=lambda r: -r["weight"])
    dest = ROOT / "data" / "forge" / branch
    dest.mkdir(parents=True, exist_ok=True)
    (dest / "profile.json").write_text(json.dumps({"branch": branch, "papers": n_papers, "years": years, "recent": sorted(recent), "topics": out}, indent=1), encoding="utf-8")
    print(f"{branch}: {n_papers} papers, {len(out)} topics -> {dest / 'profile.json'}")
    for r in out[:12]:
        print(f"  {r['weight']:.2f}  {r['subject'][:28]:28}  {r['topic'][:60]}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "CS")
