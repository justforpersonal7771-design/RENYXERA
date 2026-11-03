"""Re-assign the topics of a plan so the finished set follows how often each topic is asked in past papers (profile weight = share of marks).

    python scripts/forge/replan_by_weight.py CS b008 200

Target for each topic = weight share x TOTAL questions (all batches together). Slots are given to the topics with the largest shortfall; a slot's
question type prefers topics that GATE asks in that type. Topics that need a picture or are purely verbal cannot be checked by code and are left out.
"""
import json, sys, glob, pathlib, collections

ROOT = pathlib.Path(__file__).resolve().parents[2]
BR, BATCH, TOTAL = sys.argv[1], sys.argv[2], int(sys.argv[3])
SKIP = ("Pattern Identification", "Structural Morphing", "Paper Folding", "Graphical Representations", "Reading Comprehension", "Analogy and Relationship",
        "Basic Vocabulary", "Vocabulary Mechanics", "Narrative Sequencing", "Basic English Grammar", "Grammar Rules", "Shape Transformation")
profile = json.loads((ROOT / "data/forge" / BR / "profile.json").read_text(encoding="utf-8"))
topics = [t for t in profile["topics"] if not any(k in t["topic"] for k in SKIP)]
used = collections.Counter()
for f in glob.glob(str(ROOT / "data/forge" / BR / "batches/*.json")):
    for q in json.loads(pathlib.Path(f).read_text(encoding="utf-8"))["items"]:
        used[q["topic"]] += 1
planp = ROOT / "data/forge" / BR / "plans" / f"{BATCH}.json"
plan = json.loads(planp.read_text(encoding="utf-8"))
slots = plan["slots"]
wsum = sum(t["weight"] for t in topics)
target = {t["topic"]: t["weight"] / wsum * TOTAL for t in topics}
short = {t["topic"]: target[t["topic"]] - used[t["topic"]] for t in topics}
alloc = collections.Counter()
for _ in range(len(slots)):                      # one slot at a time to the topic with the biggest remaining shortfall
    best = max(topics, key=lambda t: short[t["topic"]] - alloc[t["topic"]] * 1.0)
    alloc[best["topic"]] += 1
by_topic = {t["topic"]: t for t in topics}
free = list(range(len(slots)))
for tp, n in sorted(alloc.items(), key=lambda kv: -kv[1]):
    t = by_topic[tp]
    ty = t.get("types", {})
    for _ in range(n):
        i = max(free, key=lambda j: ty.get(slots[j]["type"], 0) + 0.001 * (j % 7))
        free.remove(i)
        slots[i]["subject"], slots[i]["topic"] = t["subject"], t["topic"]
for sl in slots:
    sl.pop("prompt", None)
planp.write_text(json.dumps(plan, indent=1, ensure_ascii=False), encoding="utf-8")
print("slots", len(slots), "topics used", len(alloc))
final = collections.Counter(used)
for tp, n in alloc.items():
    final[tp] += n
print("expected final counts (top 15):", [(k[:34], v) for k, v in final.most_common(15)])
print("subjects:", collections.Counter(by_topic[tp]["subject"] for tp, n in alloc.items() for _ in range(n)).most_common())
