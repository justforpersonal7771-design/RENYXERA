# GATE OS — Release 4 & Future Releases Master Development Plan

## 1. Purpose

This document is the handover/master prompt for continuing development of GATE OS after Release 3.

The implementation agent must treat the existing Release 1–3 codebase as the baseline and must **not rebuild working functionality unnecessarily**.

The primary objective from Release 4 onward is to transform the already feature-rich local-first GATE preparation system into a reliable, deployable, maintainable production application while preserving the existing examination, analytics, revision, AI, and learning architecture.

---

# 2. Existing System Baseline

The following functionality already exists and must be preserved:

## Release 1 — Core GATE OS

- Dataset repository based on `Aggregated_Output.json`
- Static image repository
- AST parsing/rendering pipeline
- IndexedDB local-first persistence
- Question indexing
- Year/Paper tests
- Section tests
- Subject tests
- Topic tests
- Generic Custom Test Builder
- Seeded randomization
- Exam runtime/session lifecycle
- Dynamic exam timer
- Question palette
- MCQ/MSQ/NAT handling
- Bookmarking
- Notes
- Mistakes Bank
- Revision Engine
- Exam Results
- Historical Review
- Analytics
- Study planner/calendar
- Multi-image question rendering
- Image manifest
- Repository diagnostics
- Full-screen exam interface
- Responsive UI

## Release 2 — Premium Experience

- Premium design system
- Light/Dark/System themes
- Dark-mode image adaptation
- Premium dropdowns
- Modern cards
- Premium scrollbars
- Motion system
- Dashboard redesign
- Analytics visualization
- Calendar integration
- Command Palette
- Premium Exam Workspace
- Advanced revision
- Bookmark organization
- Mistake classification
- PWA capabilities
- Performance optimizations
- Adaptive learning foundations

## Release 3 — AI Intelligence

### Module A
- Gemini integration
- AI context builder
- AI response caching
- Rate limiting
- Token estimation
- Context compression
- AI prompt architecture
- Structured AI response parsing
- AI service gateway
- IndexedDB AI response storage

### Module B
- AI Tutor Workspace
- Question explanation
- Concept explanation
- Step-by-step reasoning presentation
- Shortcut/trick presentation
- Diagnostic observations
- Follow-up AI conversation
- AI integration with bookmarks
- AI integration with mistakes
- AI insights

### Module C
The final Release 3 module should cover:
- AI detailed solution engine
- Pattern/question intelligence
- AI-generated practice questions
- Successive question chains
- AI shortcut/formula extraction
- Personalized AI mentor
- AI-generated study sessions
- AI weakness analysis
- AI-powered revision
- AI usage/cost controls

### Module C-2 — AI Mentor Feature Gap Closure

Competitive-research-driven addendum to Module C, sourced from the Knowledge Gate walkthrough transcript analysis (see Section 19.3). Community/social features (leaderboard, batch chat, live AMA, "Course Captain" contact) are **explicitly excluded from this module** — no in-house tutor/instructor exists to staff that layer, and it depends on real multi-user scale GATE OS doesn't have yet. This module is scoped to what's buildable solo, on the existing local-first + AI Mentor architecture, for the current CS/IT product — expansion to other branches/verticals is a later decision, made only after this product is validated.

**Must-have (high value, buildable now, no new backend required):**
- **Goal Slider / target-marks prioritizer** — user sets a target (e.g. "50% of syllabus" or a target mark), and the AI Mentor surfaces which subjects/topics/subtopics to prioritize vs. skip, using the same subject/topic-level question-frequency data the dataset and Analytics engine already expose. Pure frequency math over existing data — no live AI call required, cheap to compute, high perceived value. This is the single most differentiated idea found in the competitive research and should be treated as a core Module C-2 deliverable, not optional polish.

**Nice-to-have:**
- **Per-topic reference notes** — a general topic-level notes surface (distinct from the existing per-bookmark/per-mistake notes), anchored on the Knowledge Graph's existing topic nodes. Low effort given the Knowledge Graph already models the topic hierarchy.
- **AI-blended adaptive test generation** — extend the existing Practice Generator (Module 5C territory, but flagged here since it overlaps Module C's practice-question generation) so generated/custom tests can blend real GATE per-question time/difficulty distribution rather than uniform difficulty. Audit Module 5C's planned "pattern variations"/"numerical variations" scope first — this may already be substantially covered by design.

**Audit-first (verify before building — may already be covered):**
- **Progress-monitor-style view** — a module-by-module completion view flagging over-studied vs. neglected subjects/topics. GATE OS's existing Analytics/Focus Center/AI Mentor weak-topic detection likely already covers most of this. Confirm topic-completion-% is clearly visualized per subject before treating this as a real gap.

**Explicitly out of scope for Module C-2 (needs infrastructure GATE OS doesn't have, or isn't a fit):**
- Per-question crowd analytics ("X students attempted, Y% correct, avg time") — requires a shared multi-user backend (Module 4A) and a real user base to be meaningful; revisit post-launch, not as part of Release 3/C-2.
- Leaderboard, social/follow layer, batch community, live AMAs, "Course Captain" — all require either real user scale or ongoing personal instructor time (a people-cost, not an engineering cost). If pursued at all, this belongs in Release 6 (Section 6, Study Groups/Discussion System already covers the shape of it), not Release 3.
- Video-lecture content of any kind — no in-house tutor to record it; not a direction this product pursues.

---

# 3. Non-Negotiable Architectural Rules

The implementation agent must follow these rules for every future release.

## Dataset

`Aggregated_Output.json` remains immutable source data.

Never modify it programmatically.

Never store a modified replacement copy as the authoritative dataset.

The application must dynamically consume the current dataset.

## Images

Images remain external assets under:

`public/images`

The image manifest must be generated from the actual image files.

Never hardcode a finite image list.

Multiple images such as:

`7_1.png`
`7_2.png`
`7_3.png`

must continue to work.

## Existing IDs

Do not break existing question IDs.

Question IDs must remain linked to source questions.

Generated/custom test sequence numbers may be different from JSON question numbers, but source question IDs must remain available internally.

## Existing exam behavior

Do not change:

- GATE scoring rules
- MCQ negative marking
- MSQ exact-match behavior
- NAT behavior
- dynamic timing rules
- question status semantics
- review behavior

unless a future requirement explicitly states otherwise.

## Local-first principle

The application should continue to function without network access for all features that do not require AI/cloud services.

## AI

AI must never become a hard dependency for core examination functionality.

If Gemini is unavailable:

- exams must still work
- repository must still work
- analytics must still work
- bookmarks must still work
- mistakes must still work
- revision must still work

---

# 4. RELEASE 4 — PRODUCTIONIZATION & CLOUD PLATFORM

## Theme

> Transform GATE OS from a highly capable local application into a secure, deployable, production-grade application.

Release 4 should primarily address infrastructure, persistence, security, deployment, reliability, observability, and production operations.

Do not redesign core Release 1 functionality.

## Deployment & business context (read before starting Release 4)

Two constraints govern every decision in this release, carried through from the deployment/monetization planning that produced Module 4E below:

1. **Zero budget.** Every piece of infrastructure must run on a free tier at launch — Vercel Hobby, Supabase free tier, Gemini API free tier, GitHub Actions free minutes. No paid service is acceptable until subscription revenue exists to fund it.
2. **Deploy first, monetize second.** The app is fully deployable and usable today without Supabase or auth. Get it live and in front of real users (Phase 0/1 below) before building any billing infrastructure — don't spend engineering time on payments before anyone has confirmed willingness to pay.

**Free-tier limits to know going in** (verify current numbers before committing — these change):
- **Supabase free tier**: ~500MB database, ~1GB file storage, ~5GB bandwidth/month, generous auth MAU allowance. Free projects pause after ~1 week of no API activity (first request after a pause just takes a few seconds longer — acceptable at this stage; a scheduled keep-alive ping is an easy fix if it becomes annoying).
- **Vercel Hobby (free) tier**: ~100GB bandwidth/month. Its terms are for personal/non-commercial use — once real money is being charged, budget mentally for the ~$20/mo Pro tier, funded by first subscription revenue, not before.
- **Gemini API free tier**: rate-limited per-minute/per-day. Fine for validation and early real users; needs a hard per-user daily cap regardless of tier (build on the existing Module A rate-limiter/caching foundation) and will need to move to paid Gemini usage once subscription revenue covers it (pricing is fractions of a cent per request — trivial to fund once there's any revenue at all).

**Revised sequencing** (supersedes a strict 4A→4B→4C→4D reading order — build in this order instead):

| Phase | Focus | Depends on |
|---|---|---|
| 0 | Deploy free MVP to Vercel — no Supabase, no auth yet | Nothing — app is deployable today |
| 1 | Get real users, validate demand and willingness to pay | Phase 0 live |
| 2 | Module 4A (optional Supabase sync) + 4B (optional auth) — app stays fully usable without login | Phase 1 signal |
| 3 | Module 4E (monetization: Razorpay, subscriptions, gating) | Phase 1 validated demand |
| 4 | Module 4D (observability) as usage grows | Phase 2/3 shipped |
| 5+ | Release 5, prioritized by what paying users actually ask for | Real revenue/usage data |

Module 4C (deployment/PWA/CI) applies from Phase 0 onward, not after 4A/4B — the app needs to be live before it needs users.

---

# MODULE 4A — SUPABASE CLOUD BACKEND & DATA SYNCHRONIZATION

## Objective

Introduce Supabase as the cloud persistence layer while preserving IndexedDB as the fast local cache.

The architecture should become:

```text
UI
 ↓
Zustand
 ↓
Application Services
 ↓
Local IndexedDB
 ↓
Sync Layer
 ↓
Supabase PostgreSQL
```

The application should remain usable when offline.

## Supabase Responsibilities

Use Supabase for persistent user-owned data such as:

- exam sessions
- exam attempts
- question analytics
- mistakes
- bookmarks
- notes
- calendar events
- study sessions
- custom test templates
- revision state
- AI response metadata
- AI-generated practice records
- user preferences
- learning progress

Do NOT upload the immutable full dataset to Supabase unless there is a demonstrated architectural requirement.

The static dataset remains in the deployed application.

## Database Schema

Audit and consolidate existing planned schemas.

Expected logical entities include:

- profiles
- exam_sessions
- exam_responses
- test_attempts
- question_analytics
- mistakes_bank
- bookmarks
- notes_vault
- calendar_events
- study_sessions
- custom_test_templates
- revision_items
- analytics_snapshots
- study_metrics
- ai_responses
- ai_generated_questions
- user_preferences

Use UUID primary keys for cloud records where appropriate.

Retain stable `question_id` strings for dataset references.

## Row Level Security

Implement RLS for every user-owned table.

Users must only access their own records.

Never rely on frontend filtering as the security mechanism.

## Synchronization

Implement:

- local write
- queued cloud sync
- retry
- conflict detection
- conflict resolution
- offline queue
- sync status
- last synced timestamp

Statuses:

- Offline
- Pending
- Syncing
- Synced
- Conflict
- Failed

## Conflict strategy

Prefer deterministic synchronization.

Document the conflict policy.

For simple user-authored records, use latest-update semantics only where safe.

For exam responses and immutable historical records, prefer append-only semantics.

---

# MODULE 4B — AUTHENTICATION, USER PROFILE & SECURITY

## Objective

Move from the current single-user architecture toward secure optional/multi-user production support.

Implement Supabase Auth.

Support:

- email/password
- password reset
- session persistence
- logout
- account deletion
- protected routes

Keep the existing local-first architecture.

## Security

Never expose:

- Supabase service-role keys
- Gemini secrets
- server-only credentials

to the browser.

Use environment variables.

Separate:

```text
NEXT_PUBLIC_*
SERVER_ONLY_*
```

Correctly.

If Gemini requests are moved server-side, expose only a server API route/action to the client.

## Security validation

Test:

- unauthenticated access
- authenticated access
- cross-user access
- expired sessions
- logout
- token refresh
- RLS violations
- direct database access attempts

---

# MODULE 4C — PRODUCTION DEPLOYMENT, PWA & OPERATIONS

## Objective

Deploy the application reliably.

Target:

- Vercel
- Supabase
- production HTTPS
- production PWA

## Environment configuration

Create:

`.env.local`

for development.

Create production environment variables in the hosting platform.

Never commit secrets.

Provide:

`.env.example`

containing names only.

Example categories:

- Supabase URL
- Supabase public key
- Gemini configuration
- application environment
- optional telemetry configuration

## Deployment pipeline

Implement:

```text
Local Development
 ↓
Build
 ↓
Automated Tests
 ↓
Preview Deployment
 ↓
Smoke Tests
 ↓
Production Deployment
```

## CI/CD

Add GitHub Actions or equivalent.

Pipeline should run:

- install
- type check
- lint
- unit tests
- integration tests
- build
- optional E2E tests

Deployment should fail if mandatory validation fails.

**For a solo, pre-revenue build, apply this leanly**: typecheck + build on every push (cheap, catches most real breakage) plus Playwright smoke tests for the critical flows (setup → exam → results, AI Tutor, auth once it exists) is sufficient at this stage — GitHub Actions' free tier (2,000 CI minutes/month on private repos) covers this at zero cost. Defer the full unit+integration+E2E matrix described in Sections 8–16 until there's a team or real revenue to justify the overhead; don't let process block shipping Phase 0/1.

## PWA

Validate:

- installability
- manifest
- icons
- service worker
- offline shell
- cache versioning
- update strategy
- stale cache prevention

---

# MODULE 4D — OBSERVABILITY, BACKUPS & RELIABILITY

Implement production diagnostics.

Track:

- application errors
- failed AI requests
- sync failures
- IndexedDB failures
- image failures
- dataset loading failures
- performance metrics

Create an admin/developer diagnostics area without exposing sensitive user information.

Implement:

- structured error handling
- error boundaries
- retry strategies
- database backup strategy
- migration strategy
- cache version migration strategy

Critical migrations must be backward-safe.

---

# MODULE 4E — MONETIZATION, BILLING & LEGAL FOUNDATION

## Objective

Turn the validated free product into a revenue source, without compromising the free tier's genuine usefulness or the zero-budget constraint. Design this module now; only build it once Phase 1 (Section 4's sequencing table) shows real demand — don't build billing before anyone has confirmed they'll pay.

## Pricing model: Freemium, not a crippled trial

**Free tier — must be a genuinely complete product, not bait:**
- Dashboard, full Analytics, Mistakes Bank, Bookmarks, Revision Engine — all local-first, zero marginal cost to serve.
- 1 full Year Paper test (real PYQ, real timer, real scoring) — lets a new user feel the actual exam engine, not a demo of it.
- Custom/Subject/Topic tests capped (e.g. 3 generations/day or a fixed lifetime count — tune from real usage data once live).
- AI Tutor: 3–5 free explanations/day. This is the main variable cost center (Gemini calls) — cap tightly from day one; loosen as a paid perk, never the reverse.

**Pro tier — the monetization surface:**
- Unlimited Year/Section/Subject/Topic/Custom tests.
- Unlimited AI Tutor usage.
- Full AI Mentor (readiness predictor, mistake pattern engine, AI Study Planner, Markdown export) — the most differentiated, highest-perceived-value surface in the product, so it anchors Pro.
- Cross-device cloud sync (once Module 4A ships).

This mirrors the freemium pattern used across the GATE-prep market generally (large bundled paid membership, a real taste of content free) — a validated structure in this exact space, not a novel bet.

## Subscription source of truth

A `subscriptions` table in Supabase (`user_id`, `plan`, `status`, `current_period_end`, `payment_provider_ref`), written only by a server-side webhook handler from the payment gateway. Never trust a client-side "isPro" flag for gating — ties directly to Module 4B's RLS trust boundary.

**Feature gating**: a single `useEntitlements()` store/hook reads subscription status and gates AI Tutor daily call count, cloud sync, AI Mentor exports, and the AI Study Planner. Everything else stays free.

## Single-device / single-session enforcement (zero-cost, self-built)

The goal is stopping casual credential sharing (a subscriber giving their login to friends), not building enterprise anti-piracy. Paid device-fingerprinting services exist because they defeat *sequential/rotating* sharing that simple concurrent-session blocking misses — that sophistication is not needed at ₹49–99/month; a simple, honest "new login kicks the old session out" mechanic (the same pattern Netflix/Spotify use) is a real deterrent and costs nothing to build:

1. Add an `active_session_id` column to `profiles`/`subscriptions`.
2. On every login, generate a new random session ID, store it in `profiles.active_session_id`, and also store it in the client's local storage/cookie.
3. On app load and periodically thereafter, the client compares its stored session ID against `profiles.active_session_id`. On mismatch, force logout with a clear message: "Your account was signed in on another device. For security, this session has been ended."
4. Optional refinement once real users exist: allow 2 concurrent devices (phone + laptop is a normal legitimate student pattern) but still kick the oldest session past that — reduces false-positive frustration while still preventing multi-friend sharing.

No paid service anywhere in this flow — a Supabase table plus a client-side check, entirely within the free tier.

## AI cost control as a monetization lever

Keep the base Pro tier generous on everything except AI usage (the only real variable cost). As the user base grows, introduce a higher tier (e.g. "Pro+"/"AI Unlimited") specifically for heavy AI users, priced to comfortably cover actual Gemini per-request cost plus margin. This keeps base-tier infra cost near-zero while monetizing the users extracting the most value from AI. Builds directly on Module 3C's AI usage/cost controls and Module A's rate limiter.

## Pricing & growth strategy — penetration pricing

- **Launch price: ₹49–79/month or ~₹499/year** — deliberately below the eventual ceiling. The goal at launch is proving people will pay at all and building a user base large enough to matter, not maximizing revenue per user.
- **Grandfather early subscribers** when prices rise later — existing subscribers keep their original price. A single decision that generates outsized goodwill and word-of-mouth ("early supporter" advocates) for free.
- Treat all specific price points above as a hypothesis to validate with real users (a simple "would you pay ₹99/month for this" question, or a fake-door "Upgrade to Pro" button that just captures interest), not a final number.

## Legal minimum before first payment

A basic Privacy Policy and Terms of Service (template-generated is fine to start — no lawyer required on day one, but this must exist before the first payment is accepted, especially given the audience includes students who may be under 18). Razorpay is the recommended payment gateway for this market: near-essential UPI support for Indian students, zero upfront cost (percentage + flat fee only on successful transactions), and it handles PCI compliance so card data is never touched directly.

## Domain name

Not a blocker. Launch on the free `.vercel.app` subdomain; a custom domain (~$10–12/year) is a same-day upgrade the moment there's even one paying customer — don't pre-pay for it.

## Positioning

The strongest differentiator versus typical online GATE mock-test products is genuine offline-first data ownership plus an AI mentor with real memory of the learner — most competitors have neither (see Section 19 competitive research). Lead marketing copy with "your data stays yours, and the AI actually remembers you," not question-bank size, which is not a fight GATE OS is positioned to win (see Section 19.2).

---

# RELEASE 4 VALIDATION

## Core Application Regression

Test every existing feature:

- Dashboard
- Setup
- Year Paper
- Section Test
- Subject Test
- Topic Test
- Custom Test
- Exam Session
- Timer
- Question Palette
- MCQ
- MSQ
- NAT
- Mark for Review
- Save & Next
- Clear Response
- Bookmark
- Results
- Review
- Mistakes
- Revision
- Calendar
- Notes
- Analytics
- AI Tutor

## Offline Test

Disconnect network.

Verify:

- dataset loads
- images load
- tests start
- tests complete
- results persist
- bookmarks persist
- mistakes persist
- revision works
- analytics works

Reconnect.

Verify queued data synchronizes.

## Deployment Test

Validate:

- fresh browser
- private/incognito browser
- desktop
- mobile
- slow network
- offline mode
- hard refresh
- browser restart
- PWA restart

---

# 5. RELEASE 5 — ADVANCED LEARNING PLATFORM

## Theme

> Turn GATE OS into a complete adaptive preparation platform.

Release 5 should focus on deeper learning intelligence rather than infrastructure.

---

# MODULE 5A — ADVANCED ADAPTIVE LEARNING

Build a sophisticated learner model.

Track:

- topic mastery
- concept mastery
- confidence
- retention
- accuracy
- response time
- mistake recurrence
- revision frequency
- difficulty tolerance

Create a mastery graph:

```text
Subject
 ↓
Topic
 ↓
Concept
 ↓
Question Pattern
```

Generate adaptive learning paths.

---

# MODULE 5B — SPACED REPETITION & RETENTION ENGINE

Implement evidence-based scheduling.

Track:

- first exposure
- successful recall
- failed recall
- interval
- confidence
- difficulty

Generate queues such as:

- Today
- Due Soon
- Overdue
- Weak
- High Priority

Allow manual revision override.

---

# MODULE 5C — AI PRACTICE LAB

Expand AI-generated questions.

Capabilities:

- generate MCQ
- generate MSQ
- generate NAT
- generate conceptual questions
- generate numerical variations
- generate harder variations
- generate easier variations
- generate misconception-based questions
- generate pattern variations

Every generated question must include:

- source concept
- difficulty
- expected solution
- answer
- explanation
- generation metadata

AI-generated questions must be stored separately from the immutable source dataset.

Provide a clear distinction between:

`Official Dataset`

and

`AI Generated Practice`

---

# MODULE 5D — PERSONAL AI MENTOR

Create a persistent mentor layer.

The mentor should understand:

- performance
- mistakes
- mastery
- revision
- calendar
- custom tests
- bookmarks
- AI interactions

Capabilities:

- daily plan
- weekly review
- weakness diagnosis
- revision reminders
- study suggestions
- practice generation
- exam preparation guidance

AI recommendations must be presented as recommendations, not authoritative facts.

---

# MODULE 5E — ADVANCED ANALYTICS

Add:

- mastery trajectories
- retention curves
- topic progression
- time efficiency
- mistake recurrence
- revision effectiveness
- practice-to-performance correlation
- question difficulty analysis
- personal improvement trends

Allow filtering by:

- date
- subject
- topic
- year
- section
- test type

---

# RELEASE 5 VALIDATION

Validate:

- mastery calculations
- scheduling
- generated question correctness
- AI response parsing
- AI failure handling
- historical analytics
- synchronization
- duplicate generation prevention
- source/AI question separation

---

# 6. RELEASE 6 — COLLABORATION, CONTENT & ECOSYSTEM

This release is optional and should only begin after Releases 4 and 5 are stable.

## Possible capabilities

### Shared Study Resources

Allow users to create/share:

- notes
- formulas
- shortcuts
- revision sets
- custom tests

### Community Question Collections

Optional shared collections with moderation.

### Discussion System

Question-level discussions.

Features:

- comments
- replies
- upvotes
- accepted explanations
- report mechanism

### Study Groups

Optional:

- group goals
- shared calendars
- group revision
- collaborative challenges

### Content Management

If required, build a separate controlled content administration system.

Never allow normal users to modify the official dataset.

---

# RELEASE 6 VALIDATION

Validate:

- permissions
- privacy
- moderation
- content ownership
- deletion
- reporting
- abuse protection
- synchronization
- concurrency
- data isolation

---

# 7. RELEASE 7 — SCALE & INTELLIGENCE

Only implement this release if actual usage requires it.

## Possible areas

- advanced caching
- CDN optimization
- database optimization
- background jobs
- large-scale analytics
- AI request batching
- AI model routing
- cost optimization
- feature flags
- experimentation infrastructure
- internationalization
- accessibility expansion

Do not prematurely introduce infrastructure that is unnecessary for actual usage.

---

# 7A. ADMIN CONSOLE (deferred — build after every other release is achieved and the app is stable)

Tracked as **Release 10** in `checklist.md` (modules 10A–10K). Summary:

- A separate admin site (own route group/subdomain and layout), not the student screens.
- **Strict login:** admins exist only in a server-side table seeded by SQL; no self sign-up and no way for any user to add themselves; mandatory 2FA; short sessions; optional IP/device allow-list.
- **Roles and explicit privileges** (owner, admin, moderator, content editor, support, analyst) with fine-grained permissions; only the owner grants or revokes them; enforced in Postgres, not only the UI.
- **Operations:** schedule/edit/cancel mocks, extend time on server trouble, publish results, re-rank; integrity review queue; question bank and answer-key editing with review; user management (suspend, sign out, quotas, data requests).
- **Dashboards and insights:** growth and retention, mock turnout and score distributions, question difficulty from real attempts, AI usage/cost, free-tier usage, errors, waitlists.
- Monetization admin (after payments), announcements, feature flags and maintenance mode, and an append-only audit log of every admin action.

---

# 8. UNIVERSAL TESTING STANDARD

Every future module must pass all of these levels.

## Level 1 — Static Validation

Run:

```bash
npm run lint
npm run build
```

Also run:

```bash
npx tsc --noEmit
```

No TypeScript errors.

No lint errors.

No build errors.

---

## Level 2 — Unit Tests

Test individual:

- engines
- utilities
- parsers
- transformers
- repositories
- scoring functions
- timer calculations
- analytics calculations
- AI parsers
- synchronization functions

Boundary conditions must be included.

---

## Level 3 — Integration Tests

Test complete workflows.

Example:

```text
Setup
 ↓
Generate Test
 ↓
Start Session
 ↓
Answer Questions
 ↓
Save
 ↓
Submit
 ↓
Evaluate
 ↓
Analytics
 ↓
Mistakes
 ↓
Revision
```

---

# 9. EXAM ENGINE TEST MATRIX

Every change affecting the exam engine must test:

## MCQ

- unanswered
- correct
- incorrect
- clear
- mark
- mark + answer
- navigation
- submission

## MSQ

- zero selections
- one selection
- multiple selections
- exact match
- partial match
- clear
- review

## NAT

- integer
- decimal
- negative value where valid
- invalid characters
- boundary values
- tolerance/range

## Timer

Verify:

- 1-mark question = 108 seconds
- 2-mark question = 216 seconds
- mixed-mark paper
- automatic submission
- pause/resume where applicable
- refresh recovery
- browser restart recovery

---

# 10. DATA INTEGRITY TESTING

Verify:

- source JSON unchanged
- image manifest reflects actual files
- every image token resolves correctly
- multiple images resolve correctly
- no stale dataset
- no stale IndexedDB dataset
- cache migration works
- reset utility works
- question IDs remain stable

Test with:

- empty cache
- old cache
- corrupted cache
- missing image
- malformed question
- missing optional field

---

# 11. AI TESTING STANDARD

Every AI feature must test:

### Successful response

### Empty response

### Malformed JSON

### Markdown response

### Code block

### LaTeX

### Table

### API timeout

### API rate limit

### API failure

### Network failure

### Duplicate request

### Cached response

### Context too large

### Abort/cancellation

### Unsafe/unusable generated content

The UI must fail gracefully.

---

# 12. PERFORMANCE TESTING

Monitor:

- initial load
- dashboard rendering
- exam startup
- question navigation
- timer updates
- image rendering
- analytics rendering
- AI response rendering

Targets:

- no unnecessary render loops
- no hydration warnings
- no layout shift
- smooth question navigation
- timer must not rerender the entire exam
- large lists must be virtualized when necessary
- images must lazy-load appropriately
- heavy AI/analytics modules should be code-split

---

# 13. UI/UX TESTING

Every screen must be checked for:

- responsive layout
- light mode
- dark mode
- keyboard navigation
- focus states
- readable typography
- accessible contrast
- loading states
- empty states
- error states
- success states
- mobile layout
- scrollbar behavior
- animation behavior

Respect:

`prefers-reduced-motion`

---

# 14. SECURITY TESTING

Before every production release verify:

- secrets are not committed
- secrets are not exposed client-side
- authentication works
- authorization works
- RLS works
- users cannot access another user's records
- API routes validate input
- generated AI content is treated as untrusted
- XSS-safe rendering
- HTML injection prevention
- safe Markdown rendering
- database queries are parameterized
- error messages do not expose secrets

---

# 15. RELEASE SIGN-OFF PROTOCOL

No module may be declared complete merely because:

```text
npm run build
```

passes.

The implementation agent must report:

## Implementation

- files created
- files modified
- architecture changes
- database changes
- environment changes

## Validation

For every feature:

| Feature | Implemented | Unit Tested | Integration Tested | UI Tested | Edge Cases | Status |
|---|---|---|---|---|---|---|

## Regression

Explicitly verify all impacted modules.

## Build

Report:

- lint
- typecheck
- build

## Runtime

Report:

- browser test
- mobile test
- offline test
- refresh test
- error recovery test

## Blockers

List every remaining blocker.

Never report "No blockers" unless the complete validation actually occurred.

---

# 16. DEFINITION OF DONE

A module is complete only when:

- implementation is complete
- types are correct
- build passes
- lint passes
- unit tests pass
- integration tests pass
- impacted screens are manually tested
- regression tests pass
- light mode works
- dark mode works
- responsive behavior works
- offline behavior is preserved where applicable
- persistence works
- error states work
- loading states work
- accessibility is checked
- performance is checked
- documentation is updated

---

# 17. MASTER HANDOVER INSTRUCTION

When handing this project to another LLM/IDE agent, provide this document together with the existing codebase.

The new agent must:

1. Inspect the existing project before modifying anything.
2. Read the existing architecture.
3. Inspect `Aggregated_Output.json`.
4. Inspect the AST pipeline.
5. Inspect IndexedDB.
6. Inspect Zustand stores.
7. Inspect exam lifecycle.
8. Inspect AI services.
9. Inspect Supabase integration if already present.
10. Identify existing implementations before creating replacements.
11. Preserve working functionality.
12. Avoid duplicate engines/components.
13. Avoid unnecessary architectural rewrites.
14. Implement one module at a time.
15. Run validation after every meaningful change.
16. Test impacted modules and dependent modules.
17. Document migration requirements.
18. Never silently modify source data.
19. Never hardcode dataset categories that should be dynamic.
20. Never declare completion based solely on compilation.

The agent must explicitly state:

```text
WHAT I INSPECTED
WHAT ALREADY EXISTS
WHAT I WILL CHANGE
WHY IT IS REQUIRED
WHAT FILES WILL CHANGE
WHAT COULD BE IMPACTED
HOW I WILL TEST IT
WHAT PASSED
WHAT FAILED
WHAT REMAINS
```

---

# 18. LONG-TERM PRODUCT DIRECTION

The final GATE OS architecture should evolve toward:

```text
                    GATE OS
                       │
       ┌───────────────┼────────────────┐
       │               │                │
   Core Engine     Learning Engine    AI Mentor
       │               │                │
 Exam/Test        Mastery/Revision   Tutor/Generation
       │               │                │
       └───────────────┼────────────────┘
                       │
                 Analytics Engine
                       │
                 Personalization
                       │
              Local + Cloud Storage
                       │
              Supabase Synchronization
                       │
                Production Platform
```

The long-term goal is not simply an online mock-test application.

It is a **personalized GATE preparation operating system** combining:

- official question repository
- realistic examination environment
- custom testing
- revision
- mistakes management
- analytics
- calendar planning
- adaptive learning
- AI tutoring
- AI-generated practice
- personal knowledge management
- cloud synchronization
- offline capability
- premium user experience

---

# 19. GROWTH, MARKETING & COMPETITIVE POSITIONING

This section governs post-launch (Phase 1+) activity, once Release 4/Module 4E is live. It carries the same zero-budget constraint as the rest of this document: every channel and tool listed below is free.

## 19.1 Zero-budget promotion channels

**Communities (highest leverage, zero cost):**
- GATE-focused subreddits (e.g. r/GATEtards for GATE CSE) — participate genuinely first, promote second; communities detect and punish pure self-promotion.
- Telegram/WhatsApp GATE prep groups — being a genuinely helpful member who occasionally shares the tool outperforms ads in this space.
- Engineering college CS/IT WhatsApp/Discord communities, especially final-year batches actively prepping.

**Content marketing (zero cost, compounds over time):**
- Short-form content (Reels/Shorts): "common mistake" breakdowns pulled straight from the Mistake Pattern Engine's real aggregate data — a content angle only GATE OS can make credibly, since it's powered by real usage data competitors don't have visibility into.
- A landing page targeting long-tail search queries ("GATE CSE previous year papers with solutions," "GATE CSE mock test free," "GATE CSE mistake analysis") — see SEO below.

**Creator partnerships (zero cash cost, trade-based):**
- Offer free lifetime Pro access to smaller/mid-tier GATE-CSE-focused YouTubers in exchange for an honest review — standard zero-budget way to build initial credibility.

**Referral loop (zero cost, built into the product):**
- "Invite a friend, both get 1 month free" — a referral code field plus a Supabase lookup; works especially well since GATE aspirants already cluster in tight communities.

**College ambassador program (zero cost):**
- Recruit 1–2 students per target college to share the free tier with their batch in exchange for free Pro access.

## 19.2 SEO plan (zero cost)

- Real page titles/meta descriptions targeting actual product keywords, not generic ones.
- Google Search Console + Google Analytics (both free) — submit a sitemap on launch day.
- Target long-tail, low-competition queries first ("GATE CSE AI mistake analysis," "GATE CSE custom mock test builder") rather than competing head-on for "GATE mock test" against established incumbent domain authority.
- Fast load times and mobile-friendliness — Next.js + Vercel already deliver most Core Web Vitals for free.
- `schema.org` `Course`/`EducationalOrganization` structured data — free, improves search result presentation.

## 19.3 Competitive positioning (grounded research, not guesswork)

Researched via the Knowledge Gate walkthrough (Sanchit Sir) plus Testbook/Ace Academy/Made Easy. **Scope note: video-lecture content is explicitly out of scope for GATE OS** — there is no in-house tutor to record course videos, and the product should stay focused on its CS/IT problem-solving-and-analytics strength rather than attempting to compete on video content. The notes below are trimmed to what's actually relevant to a non-video, engine-and-AI-driven product; expansion into other branches/verticals is a later decision, made after the current CS/IT product is validated.

**Honest gap — do not compete on this axis:**
- Competitor PYQ volume (thousands of questions across many exam years) exceeds GATE OS's current dataset. This is a content-curation problem, not a software problem, and chasing "more questions than the incumbent" is a losing framing. Lead with product quality and personalization instead (Section 19.4).

**Where GATE OS already has a real structural edge:**
- Genuine AI memory/personalization: the AI Tutor/Mentor remembers a learner's specific mistake history and references it directly in explanations and study plans — competitor AI in this space (per research) is closer to generic analytics/recommendation than true personalized memory.
- Offline-first, local-data-ownership by default — not a pattern seen in competitor products researched.
- A real AST-rendered exam engine (tables/code/LaTeX/multi-image rendering) with faithful GATE scoring rules — easy to underestimate, expensive to get right, and already built.

**Concrete feature ideas worth adopting (buildable within existing architecture, non-video):**
1. **"Goal Slider" equivalent** — a target-marks input that surfaces which topics to prioritize, using the same subject/topic-level question-frequency data already powering Analytics/AI Mentor. Pure frequency math, no live AI call required. **Add to Release 5 / Module 5D (Personal AI Mentor) scope.**
2. **Per-topic reference notes** — currently notes attach only to individual bookmarks/mistakes; a general topic-level notes surface (anchored on the Knowledge Graph's topic nodes) is a natural, low-effort Release 5 addition.
3. **Progress-monitor-style view** — likely already substantially covered by existing Analytics/weak-topic detection; audit before building anything new here rather than assuming it's a gap.
4. **Leaderboard/social layer** — a real engagement driver, but requires both real user scale and ongoing personal time investment (moderation, live engagement) to work — a people-cost as much as an engineering cost. Treat as optional Release 6 scope (Section 6, Study Groups/Discussion System already covers this direction), not a launch requirement.

## 19.4 Trial/freemium feature split

See Module 4E for the authoritative free-vs-Pro split. The summary reason it's structured that way: the free tier must be genuinely good (Dashboard, Analytics, Mistakes, Bookmarks, Revision, 1 free Year Paper, capped custom tests, capped AI Tutor calls) because it is the primary zero-budget marketing channel described in 19.1 — a thin/crippled free tier undermines the entire growth strategy, not just conversion.

## 19.5 Product naming

A few directions, since different names signal different positioning:

- **AI-mentor positioning** (matches the strongest differentiator — Section 19.3): GATE Sherpa, MentorGATE / GATE Mentor AI, NeuroGATE, GATE Compass.
- **Achievement/outcome positioning**: AscendGATE / GATE Ascend, RankGATE, ScoreGATE, CrackGATE AI.
- **Brandable/short**: GATEHive, QuantaGATE, GATEForge, GATEWise.

Recommended direction: Mentor/Sherpa — it communicates the thing competitors visibly lack (a real, personalized AI mentor, not just a test bank). Before committing: check `.com`/`.in` domain availability and run a basic trademark conflict check (Indian Trademark Registry public search is free) — many short brandable names are already taken.

---

# FINAL RULE

**Preserve what works. Improve what is measurable. Validate what changes. Never sacrifice data integrity or exam correctness for visual or architectural improvements.**

Every future release must make the system more reliable, more intelligent, more maintainable, and more useful without compromising the correctness of the core GATE examination engine.
