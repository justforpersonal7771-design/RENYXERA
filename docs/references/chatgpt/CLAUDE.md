# RENYXERA project instructions

Read `RENYXERA_Battles_Claude_Handoff.md` before making Battles/Arena changes.

## Non-negotiable guardrails
- Audit before coding. Preserve existing working features; do not rebuild blindly.
- Distinguish verified facts, recommendations and owner decisions.
- Never invent players, queue counts, online status, matches, scores, ratings, rewards or capabilities.
- Never trust browser-supplied score, winner, Elo, Arena Points or coin values.
- Keep grading answer keys server-only. Audit static assets, JSON, hydration data, API payloads and Broadcast events for answer-key leakage.
- Do not change the source question-bank JSON structure. If the source dataset is immutable, use read-only access and create a separate presentation-safe projection/server-side grading path.
- All reward/rating/finalisation operations must be server-authoritative, transactional and idempotent.
- Keep private matches and Realtime channels protected by RLS and participant authorization.
- No paid competitive advantage, paid coins, wagering, loot boxes or cash-out.
- No undisclosed bots or fake counts.
- Respect Do Not Disturb during active tests.
- Keep mobile and desktop first-class; support reduced motion, keyboard and screen readers.
- Do not expose secrets, `.env` values, Supabase secret/service keys or internal integrity signals.
- Do not migrate Next.js/Cloudflare adapters without compatibility checks, rollback plan and owner approval.

## Workflow
1. Read the full handoff.
2. Run read-only repository and database audit.
3. Return As-Is vs To-Be gap analysis with file/table/policy evidence.
4. Prepare a phased plan, tests and rollback approach.
5. Wait for owner review before broad refactoring.
6. Implement thin vertical slices and verify each with typecheck, lint, tests, production build and browser/device checks.
7. Report exact commands, outputs, failures and known gaps.

## Skills and agents
Use relevant project skills in `.claude/skills/` and specialist agents in `.claude/agents/`. Check availability with `/skills` and `/agents`. Review any third-party skills before installation. Use hooks or permissions for deterministic safeguards; prose alone is not a hard security boundary.

## Data and migrations
- Inspect existing tables, views, RPCs, triggers, indexes and RLS before suggesting new ones.
- Reuse existing features and tables where appropriate.
- Migrations must be reversible where possible and include rollback notes.
- Never directly edit production data as part of a UI redesign.
- Use UTC in storage and IST for display.

## Definition of done
- Acceptance criteria pass.
- No known critical score/reward/RLS/answer-key defect.
- Mobile and desktop paths work.
- Reduced-motion and keyboard flows work.
- No duplicate rewards from retries.
- Build and tests pass or exceptions are explicitly documented.
