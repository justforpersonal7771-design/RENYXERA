"""Subject/topic tags for a branch, written by Claude as compact TSV files.

data/pyq/<BRANCH>/tags/<paper>.tsv  lines:  qno <TAB> CODE.i <TAB> E|M|H
CODE is the subject's short code below; i is the topic's index in that subject's list in
data/pyq/<BRANCH>/syllabus.json (General Aptitude uses the fixed GA list in tag.py). The build
expands each line into the official section / subject / topic text, so a tag can never leave
the closed syllabus list.

    python scripts/pyq/tagcodes.py EC            # validate every paper's tags, print coverage
    python scripts/pyq/tagcodes.py EC --codes    # print the code table
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import PYQ, read_json  # noqa: E402
from tag import GA  # noqa: E402

DIFFICULTY = {"E": "Easy", "M": "Medium", "H": "Hard"}

# Short code per subject, per branch (GA codes are shared by every branch).
CODES = {
    "GA": {"VA": "Verbal Aptitude", "QA": "Quantitative Aptitude", "AA": "Analytical Aptitude", "SA": "Spatial Aptitude"},
    "EC": {
        "LA": "Linear Algebra", "CA": "Calculus", "DE": "Differential Equations", "VE": "Vector Analysis",
        "CX": "Complex Analysis", "PS": "Probability and Statistics",
        "CI": "Circuit Analysis", "SS": "Sinusoidal steady state analysis",
        "TF": "Time and frequency domain analysis of linear circuits", "LT": "LTI systems",
        "CT": "Continuous-time Signals", "DT": "Discrete-time Signals",
        "SF": "Semiconductor Fundamentals", "TR": "Carrier Transport", "SD": "Semiconductor Devices",
        "DC": "Diode Circuits", "BA": "BJT and MOSFET Amplifiers", "OA": "Op-amp Circuits",
        "NR": "Number Representations", "CC": "Combinatorial circuits", "SQ": "Sequential Circuits",
        "DA": "Data Converters", "SM": "Semiconductor Memories", "CO": "Computer Organization",
        "CS": "Control Systems",
        "RP": "Random Processes", "AC": "Analog Communications", "IT": "Information Theory", "DM": "Digital Communications",
        "MX": "Maxwell's Equations", "PW": "Plane Waves and Properties", "TL": "Transmission Lines",
        "WG": "Waveguides, Optical Fibers and Antennas",
    },
}


def catalogue(code: str) -> dict[str, tuple[str, str, list[str]]]:
    """CODE -> (section, subject, topics) from the official lists."""
    syl = {k: v for k, v in (read_json(PYQ / code / "syllabus.json") or {}).items() if not k.startswith("_")}
    full = {**GA, **syl}
    where = {subj: sec for sec, subs in full.items() for subj in subs}
    out = {}
    for c, subj in {**CODES["GA"], **CODES[code]}.items():
        if subj not in where:
            raise SystemExit(f"{code}: code {c} names '{subj}', which is not in the syllabus")
        out[c] = (where[subj], subj, full[where[subj]][subj])
    missing = set(where) - {s for _, s, _ in out.values()}
    if missing:
        raise SystemExit(f"{code}: syllabus subjects with no code: {sorted(missing)}")
    return out


def load_tags(code: str, pid: str) -> tuple[dict[str, dict], list[str]]:
    """{qno: {section, subject, topic, difficulty}} and a list of problems."""
    cat = catalogue(code)
    path = PYQ / code / "tags" / f"{pid}.tsv"
    tags: dict[str, dict] = {}
    errs: list[str] = []
    if not path.exists():
        return tags, errs
    for ln, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip() or line.startswith("#"):
            continue
        parts = line.split("\t")
        try:
            qno, ref, diff = parts[0].strip(), parts[1].strip(), parts[2].strip()
            c, i = ref.split(".")
            sec, subj, topics = cat[c]
            topic = topics[int(i)]
            tags[qno] = {"section": sec, "subject": subj, "topic": topic, "difficulty": DIFFICULTY[diff]}
        except (IndexError, KeyError, ValueError):
            errs.append(f"{path.name}:{ln}: bad tag line {line!r}")
    return tags, errs


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("branch")
    ap.add_argument("--codes", action="store_true")
    a = ap.parse_args()
    code = a.branch.upper()
    cat = catalogue(code)
    if a.codes:
        for c, (sec, subj, topics) in cat.items():
            print(f"{c}  {subj}  ({sec})")
            for i, t in enumerate(topics):
                print(f"    {c}.{i}  {t}")
        return 0
    bank = read_json(PYQ / code / f"gate_{code.lower()}_pyqs.json") or []
    meta = read_json(PYQ / code / f"gate_{code.lower()}_pyqs.meta.json") or {}
    papers = {ys: p["paper"] for ys, p in (meta.get("papers") or {}).items()}
    bad = 0
    for paper in bank:
        ys = paper["exam_metadata"]["year-shift"]
        pid = papers.get(ys, f"{code}_{ys}")
        tags, errs = load_tags(code, pid)
        qnos = {str(q["question_no"]) for q in paper["questions"]}
        errs += [f"{pid}: Q{n} untagged" for n in sorted(qnos - set(tags), key=int)]
        errs += [f"{pid}: Q{n} tagged but not in the bank" for n in sorted(set(tags) - qnos, key=int)]
        ga_wrong = [str(q["question_no"]) for q in paper["questions"]
                    if str(q["question_no"]) in tags and (q["section"].startswith("GENERAL")) != (tags[str(q["question_no"])]["section"].startswith("GENERAL"))]
        errs += [f"{pid}: Q{n} GA/core mismatch between key and tag" for n in ga_wrong]
        for e in errs:
            print(e)
        bad += len(errs)
        print(f"{pid}: {len(tags)}/{len(qnos)} tagged")
    print("OK" if not bad else f"{bad} problem(s)")
    return 1 if bad else 0


if __name__ == "__main__":
    raise SystemExit(main())
