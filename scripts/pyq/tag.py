"""Step 7: tag every question with section / subject / topic / difficulty from the branch's
OFFICIAL GATE 2027 syllabus, used as a closed list.

1. The syllabus PDF (data/pyq/official_pdfs/<BRANCH>/<BRANCH>_GATE2027_syllabus.pdf) is parsed
   WITHOUT AI into data/pyq/<BRANCH>/syllabus.json  ("Section n: Name" -> "Subject: t1, t2, ...").
   General Aptitude uses the fixed GA syllabus (same for every paper).
2. Questions are tagged in small batches by a model that may only answer from that list; any
   answer outside the list is rejected and the question is flagged "tag" for review.

Output: data/pyq/_work/<BRANCH>/<paper>/tags.json  {qno: {section, subject, topic, difficulty}}

    python scripts/pyq/tag.py EC --paper EC_2026
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
from pathlib import Path

import fitz

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import PYQ, RAW, WORK, load_env, read_json, write_json  # noqa: E402

GA = {"GENERAL APTITUDE (GA)": {
    "Verbal Aptitude": ["Basic English grammar", "Basic vocabulary", "Reading and comprehension", "Narrative sequencing"],
    "Quantitative Aptitude": ["Data interpretation", "Numerical computation and estimation", "Mensuration and geometry", "Elementary statistics and probability"],
    "Analytical Aptitude": ["Logic: deduction and induction", "Analogy", "Numerical relations and reasoning"],
    "Spatial Aptitude": ["Transformation of shapes", "Paper folding, cutting, and patterns in 2 and 3 dimensions"],
}}


def parse_syllabus(pdf: Path) -> dict:
    text = "\n".join(p.get_text() for p in fitz.open(pdf))
    text = re.sub(r"GATE 2027\s+IIT Madras\s*\|\s*Organizing Institute", " ", text)
    out: dict[str, dict[str, list[str]]] = {}
    for sm in re.finditer(r"Section\s+(\d+):\s*(.+?)\n(.*?)(?=Section\s+\d+:|\Z)", text, re.S):
        section = f"SECTION {sm.group(1)}: {' '.join(sm.group(2).split()).upper()}"
        body = " ".join(sm.group(3).split())
        subjects: dict[str, list[str]] = {}
        # "Name: topics ... . Next Name: ..." — a subject starts where a Capitalised phrase ends with ':'
        parts = re.split(r"(?:(?<=\.)|^)\s*([A-Z][A-Za-z ,&/()'-]{2,60}):\s", body)
        if len(parts) < 3:  # a section with no "Subject:" labels — the section itself is the subject
            subjects[" ".join(sm.group(2).split())] = [t.strip(" .") for t in re.split(r",|;", body) if t.strip(" .")]
        else:
            for i in range(1, len(parts) - 1, 2):
                name, topics = parts[i].strip(), parts[i + 1]
                subjects[name] = [t.strip(" .") for t in re.split(r"[,;](?![^()]*\))", topics) if 2 < len(t.strip(" .")) < 160]
        out[section] = subjects
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("branch")
    ap.add_argument("--paper", required=True)
    a = ap.parse_args()
    code, pid = a.branch.upper(), a.paper
    syl_path = PYQ / code / "syllabus.json"
    syl = read_json(syl_path)
    if not syl:
        syl = parse_syllabus(RAW / code / f"{code}_GATE2027_syllabus.pdf")
        write_json(syl_path, syl)
        print(f"syllabus: {sum(len(s) for s in syl.values())} subjects in {len(syl)} sections -> {syl_path}")
    full = {**GA, **syl}
    subj_to_section = {s: sec for sec, subs in full.items() for s in subs}

    ext = read_json(WORK / code / pid / "questions.pass_a.json")
    key = read_json(WORK / code / pid / "key.json")
    if not ext or not key:
        print("Run extract.py and keys.py first.")
        return 1
    ksec = {r["qno"]: r["section"] for r in key["rows"]}
    out_path = WORK / code / pid / "tags.json"
    tags = read_json(out_path, {}) or {}

    load_env()
    from google import genai
    from google.genai import types
    client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
    catalogue = json.dumps({s: t for sec in full.values() for s, t in sec.items()}, ensure_ascii=False)
    todo = [q for q in ext["questions"] if str(q["qno"]) not in tags]
    for i in range(0, len(todo), 8):
        batch = todo[i:i + 8]
        items = [{"qno": q["qno"], "is_general_aptitude": ksec.get(q["qno"]) == "GA", "text": (q["question_text"] + " " + " ".join(o["text"] for o in q["options"]))[:1500]} for q in batch]
        schema = {"type": "array", "items": {"type": "object", "properties": {
            "qno": {"type": "integer"}, "subject": {"type": "string", "enum": list(subj_to_section)},
            "topic": {"type": "string"}, "difficulty": {"type": "string", "enum": ["Easy", "Medium", "Hard"]}},
            "required": ["qno", "subject", "topic", "difficulty"]}}
        prompt = ("Tag each GATE question with its subject and topic from this OFFICIAL syllabus (subject -> topics). "
                  "topic MUST be copied exactly from that subject's list. General-aptitude questions use the GA subjects. "
                  f"Difficulty is for a GATE aspirant.\nSYLLABUS: {catalogue}\nQUESTIONS: {json.dumps(items, ensure_ascii=False)}")
        res = client.models.generate_content(model="gemini-3.5-flash-lite", contents=prompt,
                                             config=types.GenerateContentConfig(response_mime_type="application/json", response_schema=schema, temperature=0))
        for r in json.loads(res.text or "[]"):
            subj = r["subject"]
            ok_topic = r["topic"] in full[subj_to_section[subj]].get(subj, [])
            tags[str(r["qno"])] = {"section": subj_to_section[subj], "subject": subj, "topic": r["topic"], "difficulty": r["difficulty"],
                                   **({} if ok_topic else {"flag": f"topic '{r['topic']}' not in the official list for {subj}"})}
        write_json(out_path, tags)
        time.sleep(4.5)
    bad = sum(1 for t in tags.values() if t.get("flag"))
    print(f"{pid}: {len(tags)} tagged, {bad} with a topic outside the official list")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
