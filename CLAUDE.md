# CLAUDE.md — RENYXERA (GATE OS)

Loaded automatically every session. Full context: `HANDOFF.md`. Live task list: `checklist.md` (the owner reads only this; update it every turn). Full brief: `handover/MASTER_PROMPT.md`.

## 1. Project overview
RENYXERA is a GATE exam-prep web app (live at https://gate.renyxera.workers.dev; repo `D:\0-UI\r2ma-stable`, GitHub `justforpersonal7771-design/RENYXERA`, branch `main`; pushing to `main` deploys).
Core loop: practise official PYQs in an exam-identical interface → server-graded with GATE rules → review → mistakes/revision → analytics/goals → AI Mentor/Tutor → weekly All-India mock.
Branches live: CS, EC, EE, ME, CE, DA (no more for now). Plans: Free, Plus (₹29/mo, ₹249/yr), Pro (₹99/mo, ₹799/yr), season pass; Razorpay live.
Priorities now: **Forge** original GATE-level questions (Plus/Pro only; Free gets Forge Mocks only), **study materials** (separate paid product), **monetisation**, **marketing**.
Stack: Next.js 15 App Router + React 19 + TypeScript, Tailwind v4, motion, Zustand, IndexedDB (`idb`, local-first), Supabase (Postgres + RLS, auth), Gemini (server only), Cloudflare Workers via OpenNext, Turnstile, Sentry, GitHub Actions, Remotion (`video/`), Python PYQ pipeline (`scripts/pyq/`).
Architecture: browser (UI, IndexedDB, answer-free static bank) · Worker (`/api/*`, service role, grading, AI) · Postgres (accounts, private answer keys, attempts, mocks, billing). Details: `docs/TECHNICAL_REFERENCE.md`.

## 4. Conventions
- Work in `D:\0-UI\r2ma-stable` with absolute paths (the session dir may be a stale copy).
- TypeScript strict; `@/` imports; Zod on every API body; server-only secrets (`lib/supabase/service-role.ts`).
- API routes: origin check → rate limit → JWT → tier/branch check on the server → JSON errors.
- Tiers, prices, limits only in `lib/billing/plans.ts`; entitlements enforced server-side.
- Migrations: `supabase/migrations/NNNN_*.sql`, RLS everywhere, private tables without policies; the owner runs them; then `npm run schema:build`.
- Answer keys never in static data, bundle or logs.
- UI: CSS variables for theme, light + dark, page roots `w-full` with shell padding only, reduced-motion respected, never native date/time inputs (use `components/ui/date-picker.tsx`/`time-picker.tsx`), brand name via `components/brand/wordmark.tsx`.
- Server clock for time logic; IST daily resets.
- Repo mixes CRLF/LF: preserve newline style; assert scripted replacements.
- Never write backslash content (TeX, regex, paths) through Bash heredocs — use Write/Edit.
- Commit as you go; push once per finished batch (push = deploy).
- Official sources only; estimates labelled with data vintage.

## 5. Commands & environment
- Install: `npm install` (Node 24, Python 3.12+ with pymupdf, pillow, numpy). `.env.local` from `.env.example` (owner fills secrets; never paste secrets in chat).
- Dev: `npm run dev`. Type-check: `npx tsc --noEmit -p .`. Lint: `npm run lint`.
- Build: `npm run build` (prebuild writes answer-free banks). Cloudflare: `npm run build:cf` / `npm run deploy:cf`. Normal deploy: push to `main`.
- Checks: `npm run check:security|check:grading|check:goals|check:calibration|check:mock-order|check:score|check:keys|check:cwv`; E2E: `npm run test:e2e` after `next start`.
- Data: `node scripts/seed-questions.mjs`, `node scripts/copy-static-data.mjs`, `python scripts/pyq/patch-cs.py <json>`.
- Social/Telegram: `node scripts/telegram-daily.mjs --dry-run`, `node scripts/telegram-hub.mjs --dry`, `node scripts/social-publish.mjs --check`, `python scripts/make-og.py`.
- Film: `cd video && npx remotion bundle src/index.ts --out-dir .bundle2 && npx remotion render .bundle2 Film4 out/<name>.mp4 --codec=h264 --crf=16`.
- Rollback: `npx wrangler deployments list` → `npx wrangler rollback <id>`.
- Env names (no values) are listed in `HANDOFF.md` §5.

## 7. Owner preferences
- Plain, short updates; state clearly what was done, verified, or not done.
- For anything the owner must do: numbered click-by-click steps, then wait for confirmation.
- Update `checklist.md` every turn (real `- [ ]`/`- [x]` boxes) and list the next items at the end.
- Finish whole batches when asked; don't stop for trivial confirmations.
- Design choices: present several options in one contact-sheet image; premium modern fonts; real wordmark/logos, never stretched.
- UI checks: desktop 1440 + mobile 390, each in light and dark.
- ₹0 budget: flag any cost before building. Never advertise "no login". Personal data only with consent.
