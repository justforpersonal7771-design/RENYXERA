# Forge and solutions pipeline: review, 3 Nov 2026

## Forge (original GATE-level questions)
**Count:** 66 CS questions, all approved and released in Supabase (66 answers stored). Target is 800 for CS, so **8 % done**. Other branches: none yet (CS first, per the plan).
**Batches:** b000 pilot 6, b002 10, b003 12, b004 13, b005 12, b006 12, one automated run 1. All 7 batch files pass `scripts/forge/validate.py` (schema, answer re-computed by its own `verify` code, no near-copy of a past-paper question, TeX balanced).
**Mix:** 40 NAT, 18 MCQ, 8 MSQ; 44 two-mark, 22 one-mark; difficulty 45 medium, 18 hard, 3 easy; kinds: multi-concept 24, trace 19, numeric chain 14, conceptual 5, trap-aware 4.

**Hand check (4 questions worked out independently):** BST delete by successor (answer 40), multi-level page table (4 levels), CPU scheduling average waits for FCFS, SJF, SRTF and round robin (SRTF 6.5), SQL HAVING (A and C). All four answers and every step of the solutions are correct. Solutions are structured (given, find, steps, trap) and each question carries runnable `verify` code.

**Is the generator working?** The automated generator (Gemini, `scripts/forge/generate.mjs`) is gated well: its rejects file shows items turned away for missing verify code and for "key is conspicuously the longest option". But it produced only **1 accepted question** (auto-20261030); 65 of the 66 came from Claude-authored batches. Automation is correct but not yet productive.

**Problems found**
1. **Subject names did not match the past papers** (15 names for 11 subjects, for example "Operating Systems" and "Operating Systems (OS)" side by side). Filters and analytics would split one subject in two. Fixed in the batch files (31 items). **The database still has the old names: run `supabase/forge-subject-names.sql` once in the Supabase SQL editor.**
2. **No MCQ answer is D** (18 MCQs: B 8, A 6, C 4, D 0). Probability of that by chance is under 1 %. Option order should be shuffled when a batch is built. Not fixed yet (changing keys also changes solution text); the generator should shuffle for new batches.
3. **NAT-heavy:** 60 % NAT (40 of 66); real GATE CS is roughly one third. Rebalance in the next batches.
4. **Thin coverage:** Engineering Mathematics (probability and linear algebra) 3, Compiler Design 3, Verbal and Aptitude 0 (General Aptitude is shared across branches and not started in Forge).
5. **Near-repeats of one idea:** 6 pairs share more than half their wording with different numbers (two deadlock safe-sequence questions, two serializability questions). Fine as practice, but vary the topic spread in the next batches.

## Solutions pipeline (AI hints, shortcuts, explanations)
**State (3 Nov 2026, from `ai_pregen_items` and the control row):** the job is **on** and ran today (11:07 UTC); cursor at question 1,997 of 9,750 items, pass 1.
- Done: 1,214 items (hints 507, shortcuts 501, explanations 206). Failed: 390 (24 %).
- Failures: 247 of the failures with a stored message are Gemini 503 "model overloaded" (retried on the next pass); about 10 are broken JSON.
- Progress since 26 Oct: 908 done then, 1,214 now: **about 300 in 8 days**. At that rate the 9,750 items would take months. The cause is Gemini free-tier overload and quota, not a bug.
- The shared answer cache holds 1,230 responses.

**What would speed it up (all free):** run the batch more often at quiet hours; lower per-call size so a 503 wastes less; prefer the cheaper hint and shortcut kinds first and leave explanations for later; for CS, the Claude-authored worked solutions in R20-A (validated by code) are more reliable than Gemini's explanations.

## Decisions for the owner
- Run `supabase/forge-subject-names.sql` (one paste).
- Push Forge to 800 CS with Claude-authored batches (about 12 per session at today's quality), or fix the generator first so it yields more than 1 per run?
- Keep AI explanations as a bonus and treat Claude-authored solutions as the main R20 path?
