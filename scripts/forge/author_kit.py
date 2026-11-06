"""Forge authoring kit for a LOCAL Claude Code session (docs/forge/FORGE_GENERATOR_LOCAL.md).

A session writes questions as short specs; the kit RUNS each spec's code to find the answer, puts the correct option on the key letter the plan
assigned (MCQ), and writes drafts that `generate.mjs --ingest` then checks (TeX, key letter, dedupe, verify, validator).

    import author_kit as K
    K.use("b008")
    K.add(5, r"question text with \\( TeX \\)", code, opts=[correct, wrong1, wrong2, wrong3], steps=[...], trap="...", short="...")   # MCQ with value options
    K.add(6, text, code, stmts=[s1, s2, s3, s4], ...)    # MCQ (exactly one true) or MSQ (1 to 3 true); code sets  truth = [bool x 4]
    K.add(7, text, code, steps=[...])                    # NAT; code sets  answer = number
    K.save("part1")

For value options the code sets `val` and `wrong = [w1, w2, w3]` (or you pass opts=[correct, w1, w2, w3]). Write «name» in any text to insert a value the
code computed. Pass kind="trace" etc. to label the question kind. The code may only use math, itertools, fractions and basic builtins.
"""
import json, math, itertools, fractions, pathlib, sys, re

ROOT = pathlib.Path(__file__).resolve().parents[2]
ALLOWED = {"math": math, "itertools": itertools, "fractions": fractions, "range": range, "len": len, "sum": sum, "min": min, "max": max, "abs": abs,
           "round": round, "sorted": sorted, "set": set, "list": list, "dict": dict, "tuple": tuple, "int": int, "float": float, "str": str,
           "enumerate": enumerate, "zip": zip, "pow": pow, "next": next, "iter": iter, "all": all, "any": any, "map": map, "filter": filter,
           "bin": bin, "divmod": divmod}
_state = {"batch": None, "plan": None, "drafts": [], "branch": "CS"}


def use(batch, branch="CS"):
    _state.update(batch=batch, branch=branch, drafts=[])
    _state["plan"] = json.loads((ROOT / "data" / "forge" / branch / "plans" / f"{batch}.json").read_text(encoding="utf-8"))["slots"]


def slot(i):
    return _state["plan"][i]


def _run(code):
    env = {"__builtins__": ALLOWED}
    exec(code, env)
    return env


def _fmt(v):
    if isinstance(v, bool):
        return str(v)
    if isinstance(v, (int, float)):
        return r"\(" + (str(int(v)) if float(v).is_integer() else str(v)) + r"\)"
    return str(v)


def _show(v):
    if isinstance(v, float):
        return str(int(v)) if v.is_integer() else str(round(v, 4))
    if isinstance(v, (list, tuple)):
        return ", ".join(_show(x) for x in v)
    return str(v)


def _sub(text, env):
    """Replace every «name» with the value the question's code computed, so the explanation can never drift from the answer."""
    return re.sub(r"«(\w+)»", lambda m: _show(env[m.group(1)]), text) if isinstance(text, str) else text


def add(i, q, code, opts=None, stmts=None, steps=(), trap="", short="", given=None, find=None, kind=None):
    s = slot(i)
    t = s["type"]
    env = _run(code)
    q = _sub(q, env)
    steps = [_sub(x, env) for x in steps]
    trap, short, given, find = (_sub(x, env) for x in (trap, short, given, find))
    if stmts is not None:
        stmts = [_sub(x, env) for x in stmts]
    if opts is None and t == "MCQ" and stmts is None and "wrong" in env:
        opts = [env["val"]] + list(env["wrong"])
    if opts is not None:
        opts = [_sub(x, env) for x in opts]
    vcode = code.rstrip("\n")
    if t == "NAT":
        a = env["answer"]
        if float(a).is_integer():
            rng = [int(a), int(a)]
        else:
            rng = [round(a - 0.01, 2), round(a + 0.01, 2)]
        options, answer = [], {"range": rng}
    elif stmts is not None:
        truth = [bool(x) for x in env["truth"]]
        assert len(stmts) == 4 and len(truth) == 4, f"slot {i}: need 4 statements and 4 truth values"
        perm = [0, 1, 2, 3]
        if t == "MCQ":
            assert sum(truth) == 1, f"slot {i}: MCQ needs exactly one true statement, got {truth}"
            ti, ki = truth.index(True), "ABCD".index(s["key"])
            rest = [j for j in range(4) if j != ti]
            perm = [None] * 4
            perm[ki] = ti
            it = iter(rest)
            for p in range(4):
                if perm[p] is None:
                    perm[p] = next(it)
        else:
            assert 1 <= sum(truth) <= 3, f"slot {i}: MSQ needs 1 to 3 true statements, got {truth}"
        tr = [truth[j] for j in perm]
        letters = [k for k, x in zip("ABCD", tr) if x]
        options = [{"option_id": "ABCD"[p], "text": stmts[perm[p]]} for p in range(4)]
        answer = {"options": letters}
        vcode += f"\nperm = {perm}\ntruth = [truth[j] for j in perm]\nanswer = [k for k, x in zip('ABCD', truth) if x]" + ("[0]" if t == "MCQ" else "")
    else:
        assert t == "MCQ" and opts and len(opts) == 4, f"slot {i}: value options need 4 values"
        val = env["val"]
        same = (abs(float(opts[0]) - float(val)) < 1e-9) if isinstance(val, (int, float)) and not isinstance(val, bool) else opts[0] == val
        assert same, f"slot {i}: computed {val!r} but opts[0] is {opts[0]!r}"
        ki = "ABCD".index(s["key"])
        order = [None] * 4
        order[ki] = opts[0]
        it = iter(opts[1:])
        for p in range(4):
            if order[p] is None:
                order[p] = next(it)
        assert len({str(x) for x in order}) == 4, f"slot {i}: duplicate options"
        options = [{"option_id": "ABCD"[p], "text": _fmt(order[p])} for p in range(4)]
        answer = {"options": [s["key"]]}
        vals = {"ABCD"[p]: order[p] for p in range(4)}
        cmp = "abs(float(opts[k]) - float(val)) < 1e-9" if isinstance(val, (int, float)) else "opts[k] == val"
        vcode += f"\nopts = {vals!r}\nanswer = [k for k in 'ABCD' if {cmp}][0]"
    sol = {"given": given or "The data stated in the question.", "find": find or "The quantity or statement asked for.", "steps": list(steps), "shortcut": short, "trap": trap}
    assert sol["steps"], f"slot {i}: give at least one step"
    _state["drafts"].append({"slot": i, **({"kind": kind} if kind else {}), "question_text": q, "options": options, "answer": answer, "solution": sol, "verify": {"lang": "python", "code": vcode}})


def save(part):
    d = ROOT / "data" / _state["branch"].join(["forge/", "/drafts"])
    d.mkdir(parents=True, exist_ok=True)
    out = d / f"{_state['batch']}.{part}.json"
    out.write_text(json.dumps(_state["drafts"], indent=1, ensure_ascii=False), encoding="utf-8")
    print(f"saved {len(_state['drafts'])} drafts -> {out.relative_to(ROOT)}")
    return out
