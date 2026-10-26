"""Forge B4: validate a batch file before it can be seeded. Fails loudly on any problem.

    python scripts/forge/validate.py data/forge/CS/batches/b001.json

Checks per item: schema; MCQ has exactly one key, MSQ at least one, NAT a range; option ids A-D unique;
the `verify` Python code runs (sandboxed: no imports beyond math/itertools/fractions) and reproduces the
key (NAT within the range); no near-duplicate of an official PYQ (word overlap); balanced TeX delimiters.
"""
import json, sys, re, pathlib, math, itertools, fractions

ROOT = pathlib.Path(__file__).resolve().parents[2]
ALLOWED = {"math": math, "itertools": itertools, "fractions": fractions, "range": range, "len": len, "sum": sum,
           "min": min, "max": max, "abs": abs, "round": round, "sorted": sorted, "set": set, "list": list,
           "dict": dict, "tuple": tuple, "int": int, "float": float, "str": str, "enumerate": enumerate, "zip": zip,
           "pow": pow, "next": next, "iter": iter, "all": all, "any": any, "map": map, "filter": filter, "bin": bin, "divmod": divmod}
ID = re.compile(r"^FORGE_[A-Z]{2,4}_\d{6}$")


def words(t: str) -> set:
    return set(re.findall(r"[a-z0-9]+", t.lower()))


def pyq_texts(branch: str):
    src = ROOT / "data" / "Aggregated_Output.json" if branch in ("CS", "CSE") else ROOT / "data" / "pyq" / branch / f"gate_{branch.lower()}_pyqs.json"
    return [(q["question_id"], words(q.get("question_text", ""))) for p in json.loads(src.read_text(encoding="utf-8")) for q in p["questions"]]


def run_verify(code: str):
    env = {"__builtins__": ALLOWED}
    exec(code, env)  # noqa: S102 — our own authored batch files only
    if "answer" not in env:
        raise ValueError("verify code must set `answer`")
    return env["answer"]


def main(path: str) -> int:
    batch = json.loads(pathlib.Path(path).read_text(encoding="utf-8"))
    branch = batch["branch"]
    corpus = pyq_texts(branch)
    errors = []
    for it in batch["items"]:
        e = lambda m: errors.append(f"{it.get('id', '?')}: {m}")
        if not ID.match(it.get("id", "")): e("bad id")
        for k in ("subject", "topic", "kind", "difficulty", "question_type", "marks", "question_text", "solution", "verify"):
            if k not in it: e(f"missing {k}")
        t = it.get("question_type")
        opts = it.get("options", [])
        if t in ("MCQ", "MSQ"):
            ids = [o.get("option_id") for o in opts]
            if ids != ["A", "B", "C", "D"]: e("options must be A, B, C, D")
            key = it.get("answer", {}).get("options", [])
            if t == "MCQ" and len(key) != 1: e("MCQ needs exactly one correct option")
            if t == "MSQ" and not key: e("MSQ needs at least one correct option")
            if len({o.get('text', '').strip() for o in opts}) != len(opts): e("duplicate option text")
        if t == "NAT":
            r = it.get("answer", {}).get("range")
            if not (isinstance(r, list) and len(r) == 2 and r[0] <= r[1]): e("NAT needs answer.range [lo, hi]")
        try:
            got = run_verify(it.get("verify", {}).get("code", ""))
            if t == "NAT":
                lo, hi = it["answer"]["range"]
                if not (lo <= float(got) <= hi): e(f"verify gives {got}, outside {lo}..{hi}")
            else:
                want = sorted(it["answer"]["options"])
                if sorted(got if isinstance(got, (list, tuple)) else [got]) != want: e(f"verify gives {got}, key is {want}")
        except Exception as ex:  # noqa: BLE001
            e(f"verify failed: {ex}")
        w = words(it.get("question_text", ""))
        for qid, pw in corpus:
            if len(w) > 12 and len(w & pw) / max(1, len(w | pw)) > 0.6:
                e(f"too close to official {qid}")
                break
        text = it.get("question_text", "") + json.dumps(it.get("solution", {}))
        if text.count("\\(") != text.count("\\)"): e("unbalanced \\( \\)")
        if not it.get("solution", {}).get("steps"): e("solution needs steps")
    rep = ROOT / "data" / "forge" / branch / "reports"
    rep.mkdir(parents=True, exist_ok=True)
    name = pathlib.Path(path).stem
    (rep / f"{name}.txt").write_text("\n".join(errors) or "OK", encoding="utf-8")
    print(f"{len(batch['items'])} items, {len(errors)} problems")
    for x in errors[:40]: print("  -", x)
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1]))
