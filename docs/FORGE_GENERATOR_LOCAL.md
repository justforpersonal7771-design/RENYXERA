# Forge generator: the local workflow (3 Nov 2026)

**Rule from the owner:** everything that involves Claude runs locally, in a Claude Code session on this PC. The generator never calls Claude through a web service or an API key.

The old generator (free Gemini models only) was correct but gave 1 accepted question in its last run: the free quota ran out. It now has two ways to work, both in `scripts/forge/generate.mjs`.

## A. Local Claude session writes, the generator checks (recommended)
1. **Plan** (no network, no key): `node scripts/forge/generate.mjs --branch=CS --batch=b008 --plan=24`
   writes `data/forge/CS/plans/b008.json`: 24 slots balanced over the whole corpus (topic spread, question-type mix aimed at 52 % MCQ, 36 % NAT, 12 % MSQ, and an assigned correct letter for each MCQ so answers are not biased). Each slot carries its full prompt.
2. **Author**: in a local Claude Code session, ask Claude to write one question per slot into `data/forge/CS/drafts/b008.json` (an array of `{ slot, question_text, options, answer, solution, verify }`). The `verify` Python code must compute the answer on its own.
3. **Ingest and check**: `node scripts/forge/generate.mjs --branch=CS --batch=b008 --ingest=data/forge/CS/drafts/b008.json`
   runs the same gate as the automatic mode: schema, key letter equals the assigned one, no option letters in the solution, banned option wording, TeX renders, close-copy check against earlier Forge questions, `verify` code reproduces the key. It then runs `validate.py`, which also compares against every past-paper question. Rejected drafts go to `rejects/b008.jsonl` with the reason. Add `--blind=1` to also have a free model re-solve each question independently (needs a key; skipped by default).
4. **Seed** (writes to Supabase, run by the owner): `node --env-file=.env.local scripts/forge/seed.mjs data/forge/CS/batches/b008.json --approve`

Proof it works: batch b007 (4 questions) was authored this way and passed. The validator also caught one draft that was too close to an official 2022 question, which was rewritten.

## B. Automatic (free models), unchanged
`node --env-file=.env.local scripts/forge/generate.mjs --branch=CS --n=10 --batch=auto-YYYYMMDD` drafts with OmniRoute, then OpenRouter free models, then Gemini, and vets each draft including the blind re-solve. It stops cleanly when the daily quota is gone. Use it for volume when quota allows; always review the batch and its rejects before seeding.

## What changed in the generator
- Balanced planning over all earlier batches (not just the current one).
- A target question-type mix (the old mix was 60 % NAT).
- An assigned key letter per MCQ, enforced by the check (the old batches never answered D).
- A rule and a check that solutions never mention option letters.
- Subject names are mapped to the past-paper names when an item is saved.
- The Gemini key is only needed when Gemini is really called.

## Review rules (unchanged)
Claude reviews a batch before it is seeded: read each solution, confirm the answer by hand for a sample, read the rejects file. Seeding is always a separate, deliberate step.
