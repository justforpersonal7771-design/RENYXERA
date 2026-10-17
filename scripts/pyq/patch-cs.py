"""Apply verbatim text fixes to data/Aggregated_Output.json (the CS bank) without reformatting it.

    python scripts/pyq/patch-cs.py patches.json
patches.json: [{"id": "GATE_CS_2019_FN_Q44", "old": "...", "new": "..."}, ...]   (plain text, not JSON-escaped)
Each fix must match exactly once inside that question's own record or the run aborts (nothing is written).
"""
import json, sys

BANK = "data/Aggregated_Output.json"
enc = lambda s: json.dumps(s, ensure_ascii=False)[1:-1]

raw = open(BANK, encoding="utf-8", newline="").read()
for p in json.load(open(sys.argv[1], encoding="utf-8")):
    key = '"question_id": "%s"' % p["id"]
    i = raw.index(key)
    j = raw.find('"question_id"', i + len(key))
    seg = raw[i:j if j > 0 else len(raw)]
    old, new = enc(p["old"]), enc(p["new"])
    n = seg.count(old)
    if n != 1:
        sys.exit(f'{p["id"]}: "{p["old"][:50]}" matched {n} times')
    raw = raw[:i] + seg.replace(old, new) + (raw[j:] if j > 0 else "")
    print("patched", p["id"], "|", p["old"][:40].replace("\n", " "), "->", p["new"][:40].replace("\n", " "))
json.loads(raw)
open(BANK, "w", encoding="utf-8", newline="").write(raw)
