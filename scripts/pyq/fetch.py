"""Step 0: download OFFICIAL question papers + answer keys for a branch.

Reads the official download page (gate2027.iitm.ac.in/download), matches each question paper
to its answer key with explicit per-year naming rules (the site's names change every year),
downloads both, and records source URL + SHA-256 in data/pyq/_raw/<BRANCH>/manifest.json.
Never guesses: a paper without exactly one matching key is reported, not downloaded.

    python scripts/pyq/fetch.py EC            # all available years for EC
    python scripts/pyq/fetch.py EC --year 2026
"""
from __future__ import annotations

import argparse
import re
import sys
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import RAW, paper_id, pdf_path, sha256, write_json, read_json  # noqa: E402

SITE = "https://gate2027.iitm.ac.in/"
PAGE = SITE + "download"
UA = {"User-Agent": "Mozilla/5.0 (RENYXERA PYQ fetcher; official public documents)"}


def get(url: str) -> bytes:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=120) as r:  # noqa: S310 (fixed official host)
        return r.read()


def classify(link: str):
    """Official link -> (year, code, session, kind) or None. kind = 'qp' | 'key'."""
    rel = link.split("static/doc/download/")[-1]
    folder, name = rel.split("/", 1) if "/" in rel else ("", rel)
    name = name.split("/")[-1]
    stem = name[:-4]
    low = stem.lower()
    # 2021-2022: ec_2021.pdf ; keys in Answer_keys2021/ ; merged keys "ce_merged_2021"
    m = re.fullmatch(r"([a-z]{2})(\d?)(?:[_-]merged)?_(\d{4})", low)
    if m:
        year = int(m.group(3))
        kind = "key" if folder.lower().startswith("answer_keys") else "qp"
        return year, m.group(1).upper(), int(m.group(2)) if m.group(2) else None, kind
    # 2023 keys: CE1_ANS_GATE2023
    m = re.fullmatch(r"([A-Z]{2})(\d?)_ANS_GATE(\d{4})", stem)
    if m:
        return int(m.group(3)), m.group(1), int(m.group(2)) if m.group(2) else None, "key"
    # 2024 QPs: CE124S3 / EC24S7  (the S<n> is the exam slot, not the paper session)
    m = re.fullmatch(r"([A-Z]{2})(\d?)24S\d+", stem)
    if m and folder == "2024":
        return 2024, m.group(1), int(m.group(2)) if m.group(2) else None, "qp"
    # 2024 keys: CE1FinalAnswerKey
    m = re.fullmatch(r"([A-Z]{2})(\d?)FinalAnswerKey", stem)
    if m and folder == "2024":
        return 2024, m.group(1), int(m.group(2)) if m.group(2) else None, "key"
    # 2025 QPs: CE12025 / EC2025
    m = re.fullmatch(r"([A-Z]{2})(\d?)2025", stem)
    if m and folder == "2025":
        return 2025, m.group(1), int(m.group(2)) if m.group(2) else None, "qp"
    # 2025_Key / 2026/Keys: CE1_Keys ;  2026/QPs: CE1
    m = re.fullmatch(r"([A-Z]{2})(\d?)_Keys", stem)
    if m:
        year = 2025 if folder == "2025_Key" else int(folder[:4])
        return year, m.group(1), int(m.group(2)) if m.group(2) else None, "key"
    m = re.fullmatch(r"([A-Z]{2})(\d?)", stem)
    if m and folder == "2026":
        return 2026, m.group(1), int(m.group(2)) if m.group(2) else None, "qp"
    return None


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("branch")
    ap.add_argument("--year", type=int)
    a = ap.parse_args()
    code = a.branch.upper()

    html = get(PAGE).decode("utf-8", "replace")
    links = sorted(set(re.findall(r"static/doc/download/[^\"']+?\.pdf", html)))
    papers: dict[tuple, dict] = {}
    for link in links:
        c = classify(link)
        if not c:
            continue
        year, pcode, session, kind = c
        if pcode != code or (a.year and year != a.year):
            continue
        papers.setdefault((year, session), {}).setdefault(kind, []).append(SITE + link)

    out_dir = RAW / code
    manifest = read_json(out_dir / "manifest.json", {}) or {}
    problems = []
    for (year, session), files in sorted(papers.items()):
        pid = paper_id(code, year, session)
        qp, key = files.get("qp", []), files.get("key", [])
        if len(qp) != 1 or len(key) != 1:
            problems.append(f"{pid}: {len(qp)} question paper(s), {len(key)} key(s) — not downloaded")
            continue
        d = out_dir / pid
        d.mkdir(parents=True, exist_ok=True)
        entry = {"paper": pid, "branch": code, "year": year, "session": session}
        for kind, url in (("qp", qp[0]), ("key", key[0])):
            dest = pdf_path(code, pid, kind)
            if not dest.exists():
                dest.write_bytes(get(url))
            entry[f"{kind}_url"] = url
            entry[f"{kind}_sha256"] = sha256(dest)
        manifest[pid] = entry
        print(f"OK  {pid}  qp+key")
    write_json(out_dir / "manifest.json", manifest)
    for p in problems:
        print("SKIP", p)
    print(f"{len(manifest)} paper(s) in {out_dir / 'manifest.json'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
