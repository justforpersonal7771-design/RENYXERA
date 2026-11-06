# Forge generator: the local workflow (3 Nov 2026)

[← Docs index](../README.md) · [Open items](../open-work/OPEN-ITEMS-2026-11-06.md)

**Rule from the owner:** everything that involves Claude runs locally, in a Claude Code session on this PC. The generator never calls Claude through a web service or an API key.

The old generator (free Gemini models only) was correct but gave 1 accepted question in its last run: the free quota ran out. It now has two ways to work, both in [`scripts/forge/generate.mjs`](../../scripts/forge/generate.mjs).

## A. Local Claude session writes, the generator checks (recommended)
1. **Plan** (no network, no key): `node scripts/forge/generate.mjs --branch=CS --batch=b008 --plan=24`
   writes [`data/forge/CS/plans/b008.json`](../../data/forge/CS/plans/b008.json): 24 slots balanced over the whole corpus (topic spread, question-type mix aimed at 52 % MCQ, 36 % NAT, 12 % MSQ, and an assigned correct letter for each MCQ so answers are not biased). Each slot carries its full prompt.
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

## Authoring kit and one-command rebuild (added 3 Nov 2026)
- `scripts/forge/replan_by_weight.py CS b008 200`: gives the planned slots to topics in proportion to how often GATE asks them (profile weight = share of past-paper marks), measured against everything already made, and skips topics that need a picture or are purely verbal (they cannot be checked by code).
- [`scripts/forge/author_kit.py`](../../scripts/forge/author_kit.py): a session writes each question as a short spec (`K.add(slot, text, code, opts / stmts / steps, trap, short)`). The kit RUNS the code to get the answer, puts the correct MCQ option on the assigned key letter, checks that an MCQ has exactly one true statement and an MSQ one to three, and fills `«name» placeholders in the explanation from the code's results so the text cannot drift from the answer.
- `scripts/forge/build_batch.py CS b008`: merges all `drafts/b008.*.json` parts (a later part replaces an earlier one for the same slot) and rebuilds the batch from scratch through ingest and the validator.
- Sandbox: verify code may use only math, itertools, fractions and basic builtins (no `frozenset`, `format`, `hex`, `isinstance`).

## b008 result (3 Nov 2026)
130 questions authored in 8 parts, all accepted: with the earlier 70 the CS Forge set is **200 questions**, 200 unique ids, all batch files pass `validate.py`.
- Types: 102 MCQ, 73 NAT, 25 MSQ (51 %, 36.5 %, 12.5 %). MCQ key letters: A 26, B 30, C 23, D 23.
- Topics follow past-paper weight: 69 of 91 topics covered, all 23 topics with weight of 1.5 or more are covered, and the most-asked topics have 5 to 6 questions each (parsing, cache, DFA and regular languages, virtual memory, K-maps, recursion in C, IP fragmentation, pipelining).
- Subjects: 15, with the past-paper names; General Aptitude 15 (numeric and logic only; verbal and picture items are left for a later, differently verified process).
- Hand audit of the explanations found and fixed one real error (an asymptotics question whose key pointed at the wrong bound because the code's candidate list was ordered differently from the statements) and one ambiguity. The generator's TeX check also had a bug (it tested JSON-escaped text) which is fixed.

## To publish (owner, writes to Supabase)
```
node --env-file=.env.local scripts/forge/seed.mjs data/forge/CS/batches/b007.json --approve
node --env-file=.env.local scripts/forge/seed.mjs data/forge/CS/batches/b008.json --approve
```
Add `--release=<ISO time>` to stagger releases (for example one batch per week) so the Daily Forge does not use all 200 at once.

## b009 (3 Nov 2026): 50 more, total 250
Planned with `replan_by_weight.py CS b009 250`, authored in three parts (`author_b009_p1..p3.py`), 50 of 50 accepted. Nine first drafts overlapped existing questions and were replaced with different content on the same topic. Total CS Forge: 250 questions (131 MCQ, 89 NAT, 30 MSQ; MCQ keys A 35, B 34, C 29, D 33). b007 and b008 are seeded; to publish b009:
```
node --env-file=.env.local scripts/forge/seed.mjs data/forge/CS/batches/b009.json --approve
```

## b010 (6 Nov 2026): designed batch, rated against the Forge rubric
After the audit ([`docs/forge/FORGE_AUDIT_2026-11-06.md`](FORGE_AUDIT_2026-11-06.md): only 8 of 249 were Forge-grade), b010 is written to the Forge design: each question blends topics (for example pipeline + branch prediction + two caches; file system + index-block counting; Dijkstra vs Bellman-Ford vs the weight-shift trick; DMA + interrupt overhead), sits in a scenario, takes 3+ steps and has distractors from named misconceptions. Planned for 60 slots (`plans/b010.json`, weighted to 310 total); part 1 (8 questions, `author_b010_p1.py`) is accepted and validated. Parts 2 onwards continue; do not seed b010 until the full batch is done.

### b010 complete (6 Nov 2026): 60 of 60 accepted, 7 parts
`author_b010_p1.py` to `p7.py`; all 60 pass ingest (TeX, key letter, dedupe, verify code) and `validate.py`. Types: 30 MCQ, 21 NAT, 9 MSQ; marks 25 x 1 and 35 x 2; MCQ keys A 6, B 5, C 10, D 9; 8 General Aptitude (numeric and logic), 52 CS technical across 14 subjects. New checker code written for this batch: LR(1)/LALR/SLR conflict detection, CYK, LL(1) table, Quine-McCluskey with minimal-cover counting, TM simulation, BFS over states, Petersen-graph properties, schedule recoverability.
Honest quality read (my own rating against the audit rubric): about 11 Forge-grade (Dijkstra with a negative edge, schedule classes, two-test Bayes, unit groups, LR(1) vs LALR(1), LU with a zero pivot, divisor lattice, Petersen graph, growth-rate chain, cyclic K-map, minimal pumping length), about 8 borderline, about 30 standard, about 11 basic (including most of the aptitude items). That is much better than the old set (3% Forge-grade) but still short of the design target (55% H, 15% X); there is no X tier yet.
Seed (owner-run): `node --env-file=.env.local scripts/forge/seed.mjs data/forge/CS/batches/b010.json --approve` (add `--release=<ISO>` to stagger).

## b011 (6 Nov 2026): X-tier challenge batch, 20 of 20 accepted
Hand-designed plan (`plans/b011.json`, 12 X + 8 H, all 2 marks, 14 NAT / 5 MCQ / 1 MSQ), authored in `author_b011_p1.py` and `p2.py`, built with `build_batch.py CS b011`; validated. Each question crosses topics: disk scheduling vs the optimal order, LRU as a Markov chain, quickselect expectation, serial orders of a serializable schedule, slotted ALOHA optimum, Booth recoding, LALR-but-not-SLR, pipeline stalls over a loop, exact linear-probing probes, Markov absorption time, Prufer-sequence tree counts, count-to-infinity, AVL shape counting, CRC undetected-error probability, safe-sequence counting, shortest-path counting, serializable interleavings, affine Boolean functions, a joint-distribution MSQ.
Honest caveat: X here means "challenge, harder than GATE", and several answers (exact linear probing, AVL shape count, 70 interleavings, safe-sequence counting) come from enumeration by code; a student needs a clever argument or a very long by-hand count. Read these before releasing them and keep them Pro-only challenge material, never in a timed mock (design limit: X at most 15% of a mock).
Seed (owner-run): `node --env-file=.env.local scripts/forge/seed.mjs data/forge/CS/batches/b011.json --approve`
