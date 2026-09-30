"""Shared paths and helpers for the PYQ pipeline (docs/PYQ_ACQUISITION_STRATEGY.md).

Layout (one folder per branch; the finished bank is ONE json per branch):

    data/pyq/<BRANCH>/gate_<branch>_pyqs.json   final question bank for that branch only
    data/pyq/<BRANCH>/images/<YEAR>[_S<n>]/Q07_1.png   question / option images
    data/pyq/<BRANCH>/reports/<paper>.md          validation report per paper
    data/pyq/official_pdfs/<BRANCH>/<paper>/<paper>_question_paper.pdf / _answer_key.pdf
                                                  official GATE PDFs, one folder per branch (git-ignored;
                                                  manifest.json records URL + SHA-256)
    data/pyq/_work/<BRANCH>/<paper>/...           renders, model outputs (git-ignored)
"""
from __future__ import annotations

import hashlib
import json
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PYQ = ROOT / "data" / "pyq"
RAW = PYQ / "official_pdfs"
WORK = PYQ / "_work"

# Branch code in our app (lib/branches.ts) -> official paper code on the GATE site.
BRANCHES = {"EC": "EC", "EE": "EE", "ME": "ME", "CE": "CE", "DA": "DA", "CS": "CS"}
BRANCH_NAMES = {
    "EC": "Electronics and Communication Engineering",
    "EE": "Electrical Engineering",
    "ME": "Mechanical Engineering",
    "CE": "Civil Engineering",
    "DA": "Data Science and Artificial Intelligence",
    "CS": "Computer Science and Information Technology",
}


def load_env() -> None:
    """Read GEMINI_API_KEY etc. from .env.local without printing anything."""
    env = ROOT / ".env.local"
    if not env.exists():
        return
    for line in env.read_text(encoding="utf-8").splitlines():
        m = re.match(r"^([A-Z0-9_]+)=(.*)$", line.strip())
        if m and m.group(1) not in os.environ:
            os.environ[m.group(1)] = m.group(2).strip().strip('"').strip("'")


def paper_id(branch: str, year: int, session: int | None) -> str:
    """Stable paper id, e.g. EC_2026 or CE_2026_S1 (S = shift/session when a year had two)."""
    return f"{branch}_{year}" + (f"_S{session}" if session else "")


def question_id(branch: str, year: int, session: int | None, qno: int) -> str:
    """Same style as the CS bank: GATE_EC_2026_Q7, GATE_CE_2026_S1_Q7."""
    return f"GATE_{branch}_{year}" + (f"_S{session}" if session else "") + f"_Q{qno}"


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def write_json(path: Path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    tmp.replace(path)  # atomic: a crash never leaves a half-written file


def read_json(path: Path, default=None):
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else default


def pdf_path(branch: str, pid: str, kind: str) -> Path:
    """kind: 'qp' -> <pid>_question_paper.pdf, 'key' -> <pid>_answer_key.pdf"""
    return RAW / branch / pid / f"{pid}_{'question_paper' if kind == 'qp' else 'answer_key'}.pdf"
