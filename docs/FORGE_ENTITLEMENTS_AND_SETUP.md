# Forge: access rules (updated) and the build/setup plan

*18 Oct 2026. Addendum to `FORGE_DESIGN.md` (the full design: principles, item schema, authoring pipeline, storage, daily set, mocks, calibration). Where this file and `FORGE_DESIGN.md` disagree, **this file wins**, because it records your newest rule.*

## 1. Honest status
- **Designed:** yes, completely (`FORGE_DESIGN.md`, 13 sections).
- **Built:** only the practice-set gate for AI-generated "GATE-level practice" (migration `0039`, Plus 5 sets a day, Pro unlimited, Free none). The Forge question bank, Daily Forge, Forge Mocks, tables, scripts and screens **do not exist yet**.
- **Content:** zero Forge questions written yet.

## 2. Access rules (your latest decision)

| | Free | Plus | Pro |
|---|---|---|---|
| **Forge questions** (practice, Daily Forge, archive, filters) | No | Yes (limited, see decision F1) | Yes (full, plus harder "X" items) |
| **Forge Mocks** (weekly All-India, 65 questions) | **Yes** | Yes | Yes |
| Past-paper (PYQ) practice and mocks | Yes | Yes | Yes |
| AI-generated practice sets (existing feature) | No | 5 a day | Unlimited |

Consequences for the design:
- `FORGE_DESIGN.md` §7 says free users get today's Daily Forge set. **That changes: Daily Forge is Plus/Pro only.** Free users see a locked card with an upgrade prompt.
- Forge Mocks are the free hook: they are a ranked, weekly event, which brings Free users back every Sunday and shows them the quality of the questions. The mock paper reveals its questions only during/after the event (existing embargo), so it does not leak the bank.
- After a mock ends, its questions are **not** added to the free pool. They join the Plus/Pro practice pool.
- Free users see mock **results and ranks**; the detailed per-question Forge solutions after a mock are shown (it is the conversion moment). Plus/Pro additionally get the archive of past mocks. (Decision F2.)
- Where it is enforced: server side only. A single function `canUseForgeQuestions(tier)` in `lib/billing/plans.ts`, checked in the API that serves Forge items (never trust the screen). Free requests for non-mock Forge items return 403 with `reason: "plan"`.

## 3. Architecture (summary of what to build)

1. **Database** (`supabase/migrations/00xx_forge.sql`):
   - `forge_items` (public half: text, options, tags, kind, difficulty, branch, `release_at`, `status`, `mock_only boolean`)
   - `forge_answers` (private half: key, ranges, worked solution; no RLS policies, read only through the answers API)
   - `forge_item_stats` (attempts, p-value, discrimination, time, reports)
   - Mock tables reuse the existing `mock_events` and embargo (`0013_mock_paper_embargo`).
2. **Serving:** `/api/forge/items` (Plus/Pro, tier-checked) and the existing mock endpoints (all tiers). `/api/answers` gets a `forge` branch like it has for PYQs.
3. **Authoring pipeline** (`scripts/forge/*`): profile -> plan -> draft (Claude) -> machine verify (code that recomputes every answer) -> human spot-check -> seed. 60 items per batch (see design §5, §11).
4. **App surfaces:** dashboard Daily Forge card (locked for Free), exam setup source switch Past papers / Forge / Mixed (Forge disabled for Free with upgrade nudge), Forge Mocks list (all tiers), analytics split by source, leaderboards.
5. **Telegram:** branch channels post the Daily Forge teaser (one question, answer behind a spoiler) once Forge exists; the hub only announces mocks ("Sunday mock at 10:00"). Never full question dumps that would cannibalise the paid benefit: **post only 1 of the 10 daily questions publicly** (decision F3).
6. **Entitlement code:** one constant block in `plans.ts` (Forge flags per tier), plan cards on `/pro` updated, Plans page copy updated.

## 4. Order of work and effort
| # | Step | Needs | Effort |
|---|---|---|---|
| 1 | Your decisions F1-F6 (file `docs/OPEN_DECISIONS_FOR_YOU.md`) | you | 15 min |
| 2 | Migration, entitlement function, API, locked UI (no content) | me | 1 work session |
| 3 | First CS batch of 60 items, hand-checked | me + you (spot-check) | 1-2 sessions |
| 4 | Buffer: 30 days of Daily Forge + 3 mocks for CS (about 800 items) | me | 10+ sessions |
| 5 | Beta behind an owner-only flag, then launch CS, then EC, EE, ME, CE, DA | both | ongoing |

CS first, then EC, then the rest (your earlier decision), unless you change F5.

## 5. Risks to keep in mind
- **Quality is the product.** A wrong Forge answer is worse than none: every item is recomputed by code and spot-checked (design P1-P6).
- **Cost:** stays at $0 only because Claude authors in sessions; there is no paid API.
- **Leak risk:** unreleased items are invisible via `release_at`; mock items are embargoed.
- **Cannibalisation:** do not give Free users the Daily Forge or full archive, or Plus/Pro lose their reason to pay.
