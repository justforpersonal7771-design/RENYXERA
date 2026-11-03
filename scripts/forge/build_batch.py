"""Merge the drafts of a batch and ingest them from scratch: python scripts/forge/build_batch.py CS b008
Files data/forge/<BR>/drafts/<batch>.<part>.json are merged in name order; for the same slot the LAST file wins (so a replacement part can fix a rejected slot).
Then the batch file, its rejects and its report are rebuilt by generate.mjs --ingest (which also runs validate.py)."""
import json, sys, glob, pathlib, subprocess, os
ROOT = pathlib.Path(__file__).resolve().parents[2]
BR, BATCH = sys.argv[1], sys.argv[2]
d = ROOT / "data" / "forge" / BR
parts = sorted(glob.glob(str(d / "drafts" / f"{BATCH}.*.json")), key=lambda f: (len(pathlib.Path(f).name), pathlib.Path(f).name))
parts = [p for p in parts if not p.endswith(f"{BATCH}.merged.json")]
by_slot = {}
for p in parts:
    for x in json.loads(pathlib.Path(p).read_text(encoding="utf-8")):
        by_slot[x["slot"]] = x
merged = [by_slot[k] for k in sorted(by_slot)]
out = d / "drafts" / f"{BATCH}.merged.json"
out.write_text(json.dumps(merged, indent=1, ensure_ascii=False), encoding="utf-8")
for f in (d / "batches" / f"{BATCH}.json", d / "rejects" / f"{BATCH}.jsonl", d / "reports" / f"{BATCH}.txt"):
    if f.exists():
        f.unlink()
print(f"{len(parts)} part files, {len(merged)} drafts (one per slot)")
env = dict(os.environ, PYTHONIOENCODING="utf-8")
r = subprocess.run(["node", "scripts/forge/generate.mjs", f"--branch={BR}", f"--batch={BATCH}", f"--ingest={out}"], cwd=ROOT, capture_output=True, text=True, encoding="utf-8", env=env)
lines = r.stdout.splitlines()
print("\n".join(l for l in lines if l.startswith("  x") or "new items" in l or "problems" in l or l.startswith("  - ")))
rej = d / "rejects" / f"{BATCH}.jsonl"
if rej.exists():
    for l in rej.read_text(encoding="utf-8").splitlines():
        j = json.loads(l)
        print("  REJECT slot", j["slot"]["index"], "|", "; ".join(j["why"])[:150])
