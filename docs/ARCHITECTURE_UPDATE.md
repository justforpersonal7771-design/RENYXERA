# RENYXERA architecture, updated 29 Oct 2026

*Written for Adil. Extends `docs/TECHNICAL_REFERENCE.md` (read that for tables and migrations); this file covers what changed and what is planned.*

## 1. System at a glance

```
 Student (phone / laptop)                      Cloudflare Worker (OpenNext)                Supabase                 Google
 ------------------------                      ----------------------------                --------                 ------
 Next.js 16 app (React 19, Tailwind v4)  --->  /api/exam/*  start, grade                   Postgres + RLS           Gemini API
  - IndexedDB: sessions, mistakes,              /api/answers  answer keys after submit      questions (public half)   (free tier)
    bookmarks, notes, AI memory                 /api/ai/generate  AI (cache, quota)         question_answers (private)
  - Zustand stores                              /api/forge/items  Forge questions           forge_items / forge_answers
  - Static question bank (CDN JSON)             /api/billing/*  Razorpay                    ai_response_cache
  - Lenis smooth scroll, #app-scroll            /api/telegram/*  reminders, bot           profiles, device_sessions
                                                /api/rewards, /api/devices ...              exam_attempts / responses
```

Trust zones are unchanged: the browser holds only the public half of questions; answer keys, Forge answers and entitlements are server-side and unlock after submit.

## 2. Front-end layers

| Layer | What it is | Where |
|---|---|---|
| Shell | Floating top bar (per-section colour), bottom tab bar on phones, `#app-scroll` rounded page layer, Ctrl+K palette | `components/layout/*`, `components/exam/command-palette.tsx` |
| Design system | Pastel tokens (`--tint-*`, `-ink`), `.card-pastel / .card-band / .card-well`, `.btn-main / .btn-soft`, folder tabs, scrollbars per card | `app/globals.css` (stacked overrides: append, later rules win), `docs/design/DESIGN-SYSTEM.md` |
| Feature switch | `preview` / `soon` / `live` per feature (Forge, Study, Battles) with sample data | `lib/preview/features.ts`, `lib/preview/sample-data.ts` |
| Exam engine | Setup (four sources: PYQs, Forge, Spark, Blend; views: Build, Questions, Flashcards), session, results, review | `app/(dashboard)/setup`, `exam/*`, `components/exam/*` |
| Data | `QuestionRepository` over the static bank, AST pipeline for question text and images | `lib/repository/*`, `paper-rows.ts` (shared-paper image keys) |
| AI client | Prompt types (EXPLAIN, HINT, SHORTCUT, PRACTICE, REVISION, FOLLOWUP), memory (IndexedDB), study-plan rules | `lib/ai/*`, `lib/ai/memory/*` |

Rules learned this week and now in force:
- A component class must not set `display` in an unlayered rule if pages use Tailwind `hidden` on it. `.btn-main/.btn-soft` display now lives in `@layer components`.
- Never set `scrollbar-width` / `scrollbar-color` on an element whose `::-webkit-scrollbar` styling you rely on (Chrome ignores the latter and shows arrows).
- A filled button must not share its fill with its ink border and shadow.
- Verify CSS from a clean build (`rm -rf .next/cache`) and grep the built chunks.

## 3. Server and AI path

```
client -> /api/ai/generate { type, structured params }      (client never sends instruction text)
   -> origin + rate limit (15/min) + auth + device check
   -> PromptBuilder builds the system + prompt from the fixed template for `type`
   -> shared cache key (type, question, mode, personality) or per-prompt hash -> ai_response_cache
   -> quota: free 5 one-time + earned credits; Plus 75/day; Pro 150/day (IST)
   -> model routing: Flash-Lite for HINT/SHORTCUT, Flash for the rest
   -> Gemini -> JSON -> client parser
```
Pre-generated hints/shortcuts/explanations (`ai_pregen_items`) are served free where they exist.

## 4. Forge (new this week)

```
profile.json (topic weights, type mix)      scripts/forge/generate.mjs  (local or GitHub Actions)
        |                                      1 plan a slot
        v                                      2 Gemini drafts JSON (question, options, key, solution, python verify)
 .github/workflows/forge-nightly.yml           3 reject if fields/options/TeX/similarity fail
   02:00 IST, free tier, secret GEMINI_API_KEY 4 run verify snippet in the sandbox; must equal the key
        |                                      5 blind re-solve by a second Gemini call; must agree
        v                                      6 write data/forge/<BR>/batches/<batch>.json + rejects/*.jsonl
 pushes branch `forge-auto` (never main)       7 scripts/forge/validate.py writes the report
        |
        v   human review (Claude reviews rejects and passes in a session when asked)
 scripts/forge/seed.mjs  --approve --release=...   -> forge_items / forge_answers (RLS)
        |
        v   /api/forge/items (Plus/Pro, by branch, released only)  -> ForgeHub (still "preview" in the UI)
```
State: 6 pilot items are seeded and approved; the UI is still preview and tests still use PYQs for the Forge share until Forge answers are graded server-side. The generator ran end to end and rejected drafts correctly (bad imports, bad TeX). A full accepted batch is not yet proven because the daily free Gemini quota ran out during testing; rerun tomorrow. Not built yet: figure/SVG items, Forge-to-Forge similarity beyond word and number overlap, post-release statistics.

## 5. AI Mentor target architecture (see `docs/roadmap/R21-AI-MENTOR.md`)

```
 Mentor screen (chat first)
   header (focus, personality, plan) | chat + reply cards | Know-me panel | Today / queue
        |                                   ^
        v                                   | structured JSON replies (plan, question, lesson, chart cards)
 /api/ai/generate  type MENTOR_CHAT   (new)  -- one request = one turn; rule-based cards cost nothing
   prompt = system + learner brief (~300 tokens, cached per day) + last N turns + top memories + computed facts
   post-check: any number in the reply must be in the supplied facts, else regenerate or strip
        |
 Memory: profile (Supabase) | learner state (MemoryEngine, recomputed) | mentor_memories (new table, user can forget)
         | threads (IndexedDB now, mentor_threads for sync later)
```
Rule-based engines stay: `StudyPlanEngine`, `MasteryEngine`, `MemoryEngine`. Analytics cards move to Analytics, library cards to Study. Phase order M1 to M7 is in R21.

## 6. Build, test, deploy

- Push to `main` runs CI: typecheck, lint (informational), build, security, goals, grading, calibration, mock order, image guard (`check:images`), end-to-end smoke (phone and desktop, light and dark). Passing pushes deploy to Cloudflare Workers.
- `forge-nightly.yml` is separate, writes only to `forge-auto`, and never deploys or seeds.
- Local audit scripts (git-ignored `scripts/zz-*.mjs`): route audit (contrast, off-theme, overflow) for desktop and phone, exam flow, folder tabs, visibility bug, scrollbar. Server for tests: `npx next start -p 3123` after a clean build.

## 7. Open items

1. Forge: rerun the generator after the quota resets, review an accepted batch, then decide the release time; build server-side Forge grading and the live hub before flipping the preview flag.
2. Add the `GEMINI_API_KEY` secret to the GitHub repo so the nightly job can run (click-by-click steps on request).
3. AI Mentor M1: add `MENTOR_CHAT` to the route, prompt builder and model routing; new Mentor screen; move analytics cards out.
4. AI Tutor workspace panels onto the shared pastel look.
5. "Answers locked" on mixed tests: still unreproduced; need the test type.
