# Release 20 — A worked solution for every question (after Forge)

**Status of AI-generated help (measured 26 Oct 2026 from `ai_pregen_items`):** the background job pre-generates HINT, SHORTCUT and EXPLAIN for each official question with Gemini.

| Branch | Questions | Items needed (×3) | Done | Failed | Done % |
|---|---|---|---|---|---|
| CS | 975 | 2,925 | 321 | 125 | 11 % |
| DA | 195 | 585 | 151 | 44 | 26 % |
| EC | 390 | 1,170 | 143 | 52 | 12 % |
| EE | 390 | 1,170 | 144 | 51 | 12 % |
| ME | 520 | 1,560 | 149 | 43 | 10 % |
| CE | 780 | 2,340 | 0 | 0 | 0 % |

**Failures (360):** about 225 are Gemini "model overloaded" (503/500/524) and are retried on the next pass; about 130 were broken JSON (unescaped LaTeX backslashes) — **fixed 26 Oct** with an automatic repair before marking failed.
**Bug fixed 26 Oct:** the job read only the first 1,000 questions (API row cap), so it thought there were 3,000 items and never reached Civil or older papers. It now pages through all 3,250 questions (9,750 items). Failed items are retried every pass until none remain.
**Known risk:** a single backslash before letters that are valid JSON escapes (`\t`heta, `\f`rac, `\b`eta, `\n`abla) parses "successfully" but turns into a control character. Mitigation in R20-A3.

## R20-A · Solutions pipeline
1. **Format (per question):** given · to find · steps (each names the rule/formula) · answer (equals the official key) · common trap · 1-line shortcut · linked lesson section (R12) · diagram data when needed.
2. **Drafting:** Claude in work sessions (accuracy rule; no paid API), with the AI pre-gen EXPLAIN as optional input; every numeric step recomputed by code; answer must match `question_answers`.
3. **Validation:** schema, LaTeX render check, control-character scan (fixes the risk above), answer match, length limits.
4. **Storage:** `question_solutions` (private until the student submits or opens review), versioned; served via `/api/answers`-style route with caps.
5. **UI:** review screen solution panel with step reveal, "explain this step" (AI), flag an error.
6. **Order:** CS (most users) → EC → EE → ME → CE → DA; GA once (shared across branches).
7. **Tier:** solutions for Plus/Pro; Free sees solutions on public PYQ pages for a few sample questions (SEO) and after Forge Mocks per F2.

## Done when
100 % of CS questions have a validated solution; error reports < 1 %; review screen shows them on desktop/mobile × light/dark.
