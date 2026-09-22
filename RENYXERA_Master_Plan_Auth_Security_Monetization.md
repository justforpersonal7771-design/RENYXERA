# RENYXERA — Master Plan
## Authentication, Exam Security, Profiles, and Zero-Investment Monetization
### Release-by-Release / Module-by-Module Execution Report

**Document version:** 1.0
**Date:** 23 September 2026
**Repository:** `D:\0-UI\r2ma-stable`
**Production:** https://renyxera.vercel.app/
**Prepared against:** current `master` (82 commits), plus `GATE_OS_Deployment_and_Monetization_Plan.md`, `GATE_OS_Growth_Security_Marketing_Plan.md`, `GATE_OS_Release_4_and_Future_Releases_Master_Prompt.md`, `BUGS.md`

---

## 0. How to read this document

This is the single planning document for everything after the current UI/UX stabilisation. It is organised as:

- **Part I** — verified current state, including real security holes found while writing this.
- **Part II** — the zero-rupee doctrine: the exact free-tier stack, its ceilings, and the one licensing conflict that will bite us the day we turn on ads.
- **Part III** — Releases 4 through 9, module by module, with acceptance criteria.
- **Part IV** — the money: ads, subscriptions, and seven other revenue lines, with honest arithmetic.
- **Part V** — cross-cutting concerns: legal, privacy, compliance, metrics, risks.
- **Part VI** — sequencing and the immediate next actions.

Every module carries a **Cost** line. If it is not `₹0`, it is flagged and an alternative is given. The constraint for this entire plan is: **the complete application ships and runs without spending a single rupee.** The only money that ever leaves our hands is a percentage of revenue we have already received (payment gateway fees), and that only begins in Release 7.

---

# PART I — WHERE WE ACTUALLY ARE TODAY

## 1.1 What is built and working

| Area | State |
|---|---|
| Frontend | Next.js 15.4 App Router, React 19, TypeScript, Tailwind v4 |
| State | 10 Zustand stores (`analytics, calendar, data, exam-runtime, exam, goal-slider, study, toast, todo, ui`) |
| Persistence | IndexedDB via `idb`, 12 object stores, single fixed database name |
| Question bank | 975 questions across 15 papers, `data/Aggregated_Output.json` (1.3 MB) |
| Assets | `public/images` 6.1 MB, `public/brand` 2.5 MB |
| Exam engine | Full test builder — Subject / Section / Topic / Year / Custom modes; Focus Target filtering verified end-to-end |
| AI | Gemini via `@google/genai`, proxied server-side through `/api/ai/generate` |
| PWA | Service worker, now network-first (`gateos-pwa-cache-v4`) |
| Theming | Brand gradient system, glass morphism, dark/light, scroll reveal |
| Routes | 14 pages, 3 API routes |
| Auth | **None.** No auth dependency is installed. |
| Backend DB | **None.** IndexedDB is the sole source of truth. |
| Users | **The concept does not exist in the codebase.** |

## 1.2 Four findings (verified in code, not theoretical)

These were confirmed by reading the source and the dataset while preparing this plan. They define the first work items.

### FINDING-1 — The only route that costs money is the only route with no protection

`app/api/ai/generate/route.ts` accepts a POST of `{ systemInstruction, prompt }` and forwards it to Gemini using our server-held API key. It has:

- no authentication
- no rate limiting
- no per-caller accounting
- no prompt size ceiling

Meanwhile `app/api/dataset/route.ts` and `app/api/image-manifest/route.ts` — which serve static, free, already-public data — **both** call `checkRateLimit` / `getClientKey`. The protection is applied exactly backwards. Anyone who opens DevTools can read the endpoint shape and drain the entire Gemini free-tier quota in minutes, taking the AI Mentor offline for every real user. On a paid Gemini tier it becomes a direct, uncapped bill.

**This is the highest-priority item in the entire plan.** It is Module 4F.

### FINDING-2 — The rate limiter cannot work where it is deployed

`lib/security/rate-limiter.ts` is an in-memory sliding window. Its own comments concede it only deters "casual bulk scrape." On serverless, each invocation may land on a fresh instance with fresh memory, so the counter resets arbitrarily. It is security theatre. Real limiting needs shared state — Upstash Redis free tier, or a Postgres counter table. Both are ₹0, both are in Module 4F.

### FINDING-3 — The answer key is shipped to the browser

Confirmed by inspecting `data/Aggregated_Output.json`. Every question object carries:

```json
"options": [ { "option_id": "A", "text": "...", "is_correct": false }, ... ]
```

`is_correct` is in the payload delivered to the client and then written into IndexedDB. During a live test, the correct answer to every question is sitting in the user's browser, readable from the Network tab or from `indexedDB` in the console.

For a free, local-first, honour-system practice tool this is acceptable — the user is only cheating themselves. **The moment we add any of: leaderboards, All India Test Series, ranks, certificates, or paid tiers, it becomes fatal.** Scores stop being meaningful, and the competitive product we intend to sell is worthless.

This defines Release 5 in its entirety.

### FINDING-4 — Storage has no concept of a user (structural)

`lib/repository/storage/idb-manager.ts` opens one database under a single fixed `DATABASE_NAME`. Object stores use bare keyPaths — `STORE_MISTAKES` keyed on `questionId`, `STORE_BOOKMARKS` keyed on `questionId`. There is no `userId` anywhere in the schema.

Consequence: the day two people log in on the same laptop — a shared hostel machine, a college lab, a sibling — **user B sees user A's bookmarks, mistakes, exam history and analytics.** Authentication alone does not fix this; the storage layer itself must become user-aware. This is a hard prerequisite for "separate sessions per user," and it is Module 4D.

---

# PART II — THE ZERO-RUPEE DOCTRINE

## 2.1 The complete free stack

| Need | Service | Free ceiling | Cost |
|---|---|---|---|
| Hosting / CDN | **Cloudflare Pages** (see 2.2) | Unlimited bandwidth, 500 builds/mo | ₹0 |
| Hosting (current) | Vercel Hobby | ~100 GB bandwidth/mo | ₹0 *(licence conflict — see 2.2)* |
| Auth | **Supabase Auth** | ~50,000 monthly active users | ₹0 |
| Database | **Supabase Postgres** | 500 MB DB, ~5 GB egress | ₹0 |
| Row-level security | Supabase RLS | included | ₹0 |
| Rate limiting | **Upstash Redis** | ~10,000 commands/day | ₹0 |
| Bot / abuse gate | **Cloudflare Turnstile** | unlimited | ₹0 |
| Avatars | **DiceBear** (`@dicebear/collection`, MIT) | self-hosted, unlimited | ₹0 |
| Transactional email | Supabase built-in, or **Resend** | ~3,000 emails/mo | ₹0 |
| Error tracking | **Sentry** | ~5,000 errors/mo | ₹0 |
| Product analytics | **Cloudflare Web Analytics** or Umami Cloud | free, cookieless | ₹0 |
| CI/CD | **GitHub Actions** | 2,000 min/mo | ₹0 |
| AI | **Gemini free tier** | rate-limited | ₹0 |
| Ads | Google AdSense / Ezoic | free to join — they pay us | ₹0 |
| Payments | Razorpay | no setup fee, ~2% per transaction | ₹0 upfront |
| Source control | GitHub | unlimited | ₹0 |
| Domain | `.vercel.app` / `.pages.dev` subdomain | free | ₹0 |

**Total recurring cost to launch and operate: ₹0.**

The first rupee we ever spend is the ~2% Razorpay cut on money a customer has already paid us. That is revenue-contingent, not investment.

> **Optional, not required:** a custom domain (`renyxera.com`) costs roughly ₹800–1,200/year. It is **not** needed for launch, ads, or payments — a `.pages.dev` subdomain works for all three. Treat it as the first thing to buy *out of revenue*, not out of pocket.

## 2.2 ⚠️ The licensing conflict that must be resolved before ads go live

**Vercel's Hobby plan is for non-commercial, personal use.** Displaying advertising or taking subscription payments makes a deployment commercial. The moment we switch on AdSense at `renyxera.vercel.app`, we are in breach of the plan we are hosted under, and the remedy is Vercel Pro at roughly $20/month — which breaks the zero-rupee constraint on day one of monetization.

**Resolution: migrate hosting to Cloudflare Pages before Release 6.**

- Cloudflare's free tier permits commercial use.
- Bandwidth is unlimited — which matters, because `public/images` is already 6.1 MB and an ad-supported content strategy is bandwidth-hungry by design.
- Next.js deploys via `@cloudflare/next-on-pages` or OpenNext.
- Turnstile and Cloudflare Web Analytics then sit natively alongside it, also free.

**Action:** verify both providers' current terms directly before migrating — hosting terms change, and this decision should rest on the live policy text rather than on this document. But plan for the migration. It is Module 6A, and it **blocks** every ad-based revenue line.

## 2.3 The ceilings, and what happens when we hit them

| Ceiling | Hit at roughly | Symptom | ₹0 mitigation |
|---|---|---|---|
| Supabase 500 MB DB | ~50k–100k users of profile + attempt data | Writes fail | Archive old attempt rows into compressed JSON; keep aggregates only |
| Supabase pauses after ~1 week idle | Pre-launch only | Project sleeps | Irrelevant once daily traffic exists; a free cron ping covers the gap |
| Upstash 10k commands/day | ~2,000 AI calls/day | Limiter degrades | Fall back to a Postgres counter; add a per-user daily AI quota (which we want anyway) |
| Gemini free-tier RPM | Concurrent AI spikes | 429s | Queue + cache by prompt hash (`STORE_AI_RESPONSES` already exists); make heavy AI a Pro benefit |
| Vercel 100 GB bandwidth | ~30k–50k sessions/mo | Overage / throttle | Moot after the Cloudflare migration |
| Resend 3,000 emails/mo | ~3,000 signups/mo | Verification mail stops | Supabase built-in SMTP; batch non-critical mail |

Every ceiling above has a ₹0 answer. None forces a payment.

---

# PART III — THE RELEASE PLAN

> **Notation.** Each module lists: **Goal → Deliverables → Acceptance criteria → Cost → Depends on.**
> Modules within a release are ordered by dependency. Releases are ordered by risk-reduction first, revenue second — because shipping ads on top of an insecure, single-user app would burn the brand permanently.

---

## RELEASE 4 — IDENTITY & TRUST
### *"Who is this person, and is their data actually theirs?"*

This release converts RENYXERA from a single-device local tool into a real multi-user product. Nothing after this release is possible without it.

**Release goal:** a user can sign up, log in on any device, own a profile with a chosen avatar, have their data follow them, and be unable to see anyone else's — while the AI endpoint stops being a free-for-all.

---

### Module 4A — Supabase Foundation

**Goal.** Stand up the backend that every later module depends on, without touching app behaviour yet.

**Deliverables**
- Supabase project created; free tier.
- Environment discipline: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` client-side; `SUPABASE_SERVICE_ROLE_KEY` **server-only, never in a `NEXT_PUBLIC_` variable**, never imported into a client component. Add a CI grep that fails the build if a service-role key appears outside `app/api/**` or `lib/server/**`.
- Core schema:

```sql
-- profiles: one row per auth user
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique,
  display_name text,
  avatar_seed text not null,          -- DiceBear seed, NOT a file
  avatar_style text not null default 'adventurer',
  target_year int,
  target_branch text default 'CSE',
  tier text not null default 'free',  -- 'free' | 'pro'
  active_session_id uuid,             -- single-device enforcement (Module 4D)
  daily_ai_calls int not null default 0,
  daily_ai_reset_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- exam attempts: append-only, server-owned truth
create table exam_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  config jsonb not null,
  started_at timestamptz not null,
  submitted_at timestamptz,
  server_score numeric,               -- computed server-side (Release 5)
  status text not null default 'in_progress',
  integrity_flags jsonb default '[]'::jsonb
);

-- user question state: bookmarks, mistakes, notes
create table user_question_state (
  user_id uuid not null references auth.users on delete cascade,
  question_id text not null,
  bookmarked boolean default false,
  mistake_count int default 0,
  last_seen_at timestamptz,
  note text,
  primary key (user_id, question_id)
);
```

- **RLS enabled on every table from the first migration.** Default-deny; explicit `auth.uid() = user_id` policies. A table without RLS is treated as a build-blocking defect.
- A seeded migration file checked into the repo — schema lives in version control, never only in the Supabase dashboard.

**Acceptance criteria**
- With RLS on, a raw anon-key query for another user's row returns zero rows — proven by an automated test, not by inspection.
- The service-role key does not appear in any client bundle (verified by grepping the built output).
- `profiles` row is auto-created by a Postgres trigger on `auth.users` insert — no client-side "create my profile" call that can be skipped or forged.

**Cost:** ₹0 **Depends on:** nothing

---

### Module 4B — Authentication Layer

**Goal.** Real accounts, with the lowest possible signup friction for a student on a phone.

**Deliverables**
- **Email + password** with verification.
- **Google OAuth** — for this audience (engineering students) this will be the majority path and removes password-reset support load entirely. Free via Supabase.
- Password reset flow (request → emailed link → set new password).
- Session persistence across reloads; silent token refresh.
- **Route protection** at the middleware layer, not in page components — `middleware.ts` gates `/dashboard`, `/exam`, `/analytics`, `/bookmarks`, `/mistakes`, `/revision`, `/setup`, `/ai-mentor`. Client-side redirects are a UX affordance, never the security boundary.
- **Anonymous / guest mode preserved.** This is a deliberate product decision, not a shortcut: forcing signup before a student has felt the product is the single biggest conversion killer for edtech. A guest gets the full local-first experience; on signup, their existing IndexedDB data is **migrated into their new account** rather than discarded.
- Account deletion (DPDP-relevant — see §5.2), with a cascade that genuinely removes rows.
- Auth UI built in the existing glass/gradient design language, not a default Supabase widget.

**Acceptance criteria**
- Hitting a protected route while logged out redirects, and the protected data never appears in the network response.
- A guest with 40 bookmarks who signs up has 40 bookmarks on the server afterwards, and zero duplicates.
- Session survives a hard reload and a browser restart.
- Deleting an account removes every row across all three tables (verified by query).

**Cost:** ₹0 **Depends on:** 4A

---

### Module 4C — Profile Section with Pre-Populated Avatars

**Goal.** Give every user an identity they chose, with zero storage cost and zero moderation risk.

**The avatar decision — and why it is the right one.** Uploaded profile photos would mean: storage quota consumed, bandwidth consumed, an image-moderation obligation (our users include minors; user-uploaded imagery on a platform with minors is a real liability), EXIF/privacy handling, and a resize pipeline. Every one of those costs money or risk.

**Use DiceBear instead.** Install `@dicebear/core` + `@dicebear/collection` (MIT licence) and generate avatars **locally in the browser as SVG from a seed string**. Consequences:

- Storage cost: **zero bytes.** We persist only `avatar_seed` (a short string) and `avatar_style` — not an image.
- Bandwidth cost: **zero.** Nothing is fetched; the SVG is generated client-side.
- Works fully **offline**, which matters for a PWA.
- Moderation risk: **eliminated.** A user cannot upload anything.
- Infinite variety without an asset library to design or host.

**Deliverables**
- `/profile` route with sections: Identity, Avatar, Exam Goals, Preferences, Account, Danger Zone.
- **Avatar picker:** a grid of 6–8 curated DiceBear styles (`adventurer`, `bottts`, `notionists`, `thumbs`, `lorelei`, `micah`, `shapes`, `identicon`), each showing live previews; a "Shuffle" control that rerolls the seed; a colour/accessory variation row. All rendered inline, instantly, offline.
- **Identity:** unique username (validated against a reserved/profanity list, checked server-side for uniqueness), display name.
- **Exam goals:** target GATE year, target branch, target rank/score, daily study-hour target — these feed the existing Goal Slider and Focus Target features rather than being decorative.
- **Preferences:** theme (light/dark/system), default test duration, notification opt-ins, reduced-motion respect, question language/format preferences.
- **Stats strip:** total questions attempted, accuracy, streak, hours studied, tests completed — computed, read-only. This is the emotional payload of the profile page and the reason people return to it.
- **Achievements / badges** (see Module 9B) surfaced here.
- **Account:** email, connected providers, password change, active devices (from 4D), export my data (JSON), delete my account.

**Acceptance criteria**
- Choosing an avatar writes only a seed string to the database — confirmed by inspecting the row; no binary, no URL to external storage.
- Avatar renders identically offline, after a cold PWA start, in both themes.
- Username uniqueness is enforced by a database constraint, not just a client check.
- Every profile field round-trips: edit → save → hard reload → value persists.

**Cost:** ₹0 **Depends on:** 4B

---

### Module 4D — Per-User Session Isolation

**Goal.** Deliver the user's explicit requirement — *separate sessions per user* — at both layers: separate **data**, and separate **device sessions**.

This module has two distinct halves. Both are required; doing only one leaves a real hole.

#### 4D-1 — Storage isolation (fixes FINDING-4)

The IndexedDB layer must become user-aware. Two viable approaches:

| Approach | How | Trade-off |
|---|---|---|
| **A. Per-user database** (recommended) | `openDB(\`renyxera-${userId}\`, ...)` — one physical DB per account | Cleanest isolation; logout/switch is trivial; no migration of keyPaths needed |
| B. Composite keys | Add `userId` to every keyPath: `[userId, questionId]` | One DB, but requires a schema version bump and a migration of all 12 stores |

Approach **A** is recommended: it requires no change to the 12 object-store keyPaths, makes isolation structural rather than query-dependent (there is no query that *can* leak, because the other user's data is in a different database), and makes "sign out and wipe" a single `deleteDB` call.

**Deliverables**
- `idb-manager.ts` takes the active user id and opens the namespaced database.
- Guest data lives in `renyxera-guest`; on signup it is migrated into `renyxera-<uid>` and the guest DB is dropped.
- Sign-out closes the handle and clears in-memory Zustand state — **all 10 stores** must be reset, or the next user sees the previous user's state hydrated from memory even with a fresh DB. This is an easy bug to ship; make it an explicit checklist item with a test.
- A "switch account" path that never requires a page reload to be safe.

#### 4D-2 — Device session management

**Deliverables**
- `profiles.active_session_id` written on login (already designed in `GATE_OS_Growth_Security_Marketing_Plan.md`).
- A **device sessions table** — device label, browser, approximate location, last-seen — surfaced in Profile → Account → Active Devices, with "sign out this device" and "sign out everywhere."
- **Policy for Release 4: multi-device allowed, all sessions visible.** Do *not* enforce a single-device limit yet. Enforcement is a Pro-tier anti-sharing control and belongs in Release 7 (Module 7D), where it protects revenue. Enforcing it on free users in Release 4 would only generate support pain with zero benefit.
- Idle-session expiry and explicit "sign out everywhere" on password change.

**Acceptance criteria**
- Two accounts logged in sequentially on one browser: account B sees zero bookmarks, zero mistakes, zero attempt history from account A — verified in the UI *and* by listing IndexedDB databases in DevTools.
- Sign out → sign in as a different user → no stale Zustand state anywhere (analytics, calendar, todo, study, goal-slider all reset).
- Active Devices lists every real session and "sign out everywhere" invalidates all of them.

**Cost:** ₹0 **Depends on:** 4B

---

### Module 4E — Cloud Sync

**Goal.** The user's progress follows them from laptop to phone, without losing the local-first speed that makes the app feel instant.

**Design principle: local-first stays.** IndexedDB remains the read path — the UI never waits on the network. Supabase is the durable mirror and the cross-device channel. This preserves offline use, which is a genuine differentiator for students on unreliable connections.

**Deliverables**
- Sync engine with the status model already specified in the Release 4 master prompt: `Offline / Pending / Syncing / Synced / Conflict / Failed`, surfaced as a small, non-intrusive indicator.
- **Exam responses are append-only.** Never updated in place, never deleted by the client. This is both a correctness property and the foundation of Release 5's integrity model.
- Conflict resolution: last-write-wins for preferences; union-merge for bookmarks; max-value for counters; **server-wins, always, for anything score-related.**
- Backoff and retry; a sync queue that survives a browser close.
- Manual "sync now" and "export my data as JSON" in Profile.

**Acceptance criteria**
- Bookmark on phone → appears on laptop within one sync cycle.
- Airplane mode: the app remains fully usable; queued writes flush on reconnect with no duplicates.
- Killing the browser mid-sync loses nothing.

**Cost:** ₹0 **Depends on:** 4A, 4D

---

### Module 4F — API Hardening *(fixes FINDING-1 and FINDING-2)*

**Goal.** Stop the AI endpoint from being an open, uncapped, uncounted gateway to our Gemini quota.

> **This module should ship first in Release 4, or even before it, out of sequence.** It is the only item in this document that is actively exploitable right now.

**Deliverables**
- **Authentication required** on `/api/ai/generate`. Verify the Supabase JWT server-side; reject anonymous callers with 401. (During the guest-mode window, issue a short-lived, low-quota guest token rather than leaving the route open.)
- **Durable rate limiting** — replace the in-memory limiter with Upstash Redis (`@upstash/ratelimit`), keyed on `user_id`, not IP. IP keying fails on CGNAT, which is how a large share of Indian mobile traffic reaches us; an IP key would throttle entire cities together while letting one user with a changing IP run free.
- **Per-user daily AI quota**, enforced in Postgres (`profiles.daily_ai_calls`, `daily_ai_reset_at`) so it cannot be bypassed by rotating Redis keys. Free tier: a modest daily allowance. This doubles as the Pro upsell surface in Release 7.
- **Input validation with `zod`** (already a dependency): maximum prompt length, allowed `systemInstruction` values from a **server-side enum** — the client must not be able to supply an arbitrary system instruction. Today it can, which is also a prompt-injection and brand-safety problem, not only a cost problem.
- **Response caching by prompt hash** — `STORE_AI_RESPONSES` (keyPath `promptHash`) already exists client-side; mirror it server-side so repeated identical questions cost zero quota.
- **Cloudflare Turnstile** on signup, login and password reset to stop scripted account creation (which would otherwise be the trivial way around per-user quotas).
- Keep the existing rate limiting on `/api/dataset` and `/api/image-manifest`, but reprioritise: the expensive route gets the strongest controls.
- Structured request logging (user id, route, latency, outcome) to make abuse visible.

**Acceptance criteria**
- An unauthenticated POST to `/api/ai/generate` returns 401 and makes **no** Gemini call.
- A single account exceeding its daily quota is refused by the database counter even across many concurrent serverless instances.
- A client-supplied `systemInstruction` outside the server enum is rejected.
- 100 accounts created by script are blocked by Turnstile.

**Cost:** ₹0 **Depends on:** 4B (for identity); the validation and enum work can start immediately

---

### Release 4 — Definition of Done

- [ ] Signup, login, Google OAuth, password reset, account deletion all work end-to-end
- [ ] RLS proven by automated cross-user access tests
- [ ] Profile page complete with DiceBear avatar picker storing only a seed
- [ ] Per-user IndexedDB namespacing; no cross-account data bleed on a shared device
- [ ] All 10 Zustand stores reset on sign-out
- [ ] Active Devices list + sign out everywhere
- [ ] Sync works offline-first with no data loss
- [ ] `/api/ai/generate` authenticated, quota-enforced, input-validated
- [ ] Service-role key absent from the client bundle (CI-enforced)
- [ ] Guest→account data migration loses nothing

---

## RELEASE 5 — EXAM INTEGRITY & TEST SECURITY
### *"Make a score mean something."*

This is the user's explicit "add security to our tests." It is also the release that makes every competitive and paid feature possible — leaderboards, test series, ranks, certificates. Without it, those features are decorative.

The governing principle: **the client is untrusted.** Today the client holds the answers, runs the clock, and computes the score. All three must move.

---

### Module 5A — Answer Key Withholding *(fixes FINDING-3)*

**Goal.** The correct answer must not be in the browser during a live, graded attempt.

**Deliverables**
- Split the question payload into **public** and **private** halves:
  - Public (shipped freely): `question_id, question_text, options[].text, marks, subject, topic, section, difficulty, images`.
  - Private (server-only): `is_correct`, `nat_answer_range`, solution/explanation text.
- Build the dataset split at build time — one script, no new infrastructure. `data/Aggregated_Output.json` stays as the authoring source; the build emits `public.json` (client) and seeds a Supabase `question_answers` table (server).
- **Graded attempts** (test series, leaderboard-eligible, Pro mocks) fetch questions from the public payload and submit answers to the server for grading.
- **Practice mode keeps the current instant-feedback behaviour**, because immediate feedback is pedagogically valuable and this mode is not competitive. The difference must be visible in the UI: a clear "Graded" vs "Practice" badge. Do not silently degrade the practice experience in the name of security.
- Offline graded attempts: allowed, queued, **graded on reconnect** — status shown as "Pending evaluation" rather than a fake score.

**Acceptance criteria**
- In a graded attempt, `is_correct` appears nowhere in any network response or IndexedDB record before submission — verified by DevTools inspection and an automated check.
- Practice mode retains instant feedback and full offline capability.

**Cost:** ₹0 **Depends on:** 4A

---

### Module 5B — Server-Authoritative Timer and Scoring

**Goal.** Remove the client's ability to invent a score or a duration.

Today `components/exam/exam-timer.tsx` computes remaining time from a client-held `elapsedSeconds` in the Zustand store, and auto-submits when it reaches zero. A user can edit that value in the console. Total time is derived client-side from question marks.

**Deliverables**
- On attempt start, the server issues an **attempt token**: `{ attempt_id, server_started_at, duration_seconds, question_ids[], nonce }`, signed and stored in `exam_attempts`.
- The client clock becomes a **display** driven by the server-issued start time and duration. Drift is reconciled on each sync tick.
- Submission is validated server-side: is this attempt open, is it within `duration + grace`, does the question set match the token, has it already been submitted?
- **All scoring happens server-side.** `exam_attempts.server_score` is the only score that can appear on a leaderboard, in analytics, or on a certificate.
- Late submissions accepted with a grace window (network reality), flagged beyond it.
- Idempotent submission — a double-tap or a retry cannot create two attempts.

**Acceptance criteria**
- Editing `elapsedSeconds` in the console does not extend the real deadline.
- A replayed or tampered submission payload is rejected.
- Client-computed and server-computed scores match for 100 honest attempts (regression suite).

**Cost:** ₹0 **Depends on:** 5A

---

### Module 5C — Attempt Integrity Signals

**Goal.** Detect likely cheating on competitive attempts without turning the product into spyware.

**Explicit stance:** we will **not** build webcam proctoring, screen recording, or keystroke surveillance. They are expensive, they are hostile, they destroy trust with a student audience, and they carry serious privacy obligations. We collect cheap behavioural signals, disclose them plainly, and use them only to protect leaderboard integrity.

**Deliverables**
- Signals recorded into `exam_attempts.integrity_flags` during graded attempts only:
  - tab/window blur count and total time away
  - impossibly fast answers (below a per-difficulty floor)
  - accuracy statistically inconsistent with the user's history
  - copy/paste and devtools-open events (best-effort)
  - multiple concurrent attempts from one account
- **Transparency requirement:** before a graded attempt starts, a plain-language notice states exactly what is monitored. No hidden collection.
- Graded attempts declared **full-screen recommended, single-tab**, with a soft warning rather than a hard block.
- Flagged attempts are excluded from leaderboards, not deleted; the user's practice value is preserved and they are told why.
- Shadow-flag first: run the signals silently for a full cycle and tune thresholds against real data before any enforcement. False accusations are far more damaging than a few undetected cheats.

**Acceptance criteria**
- Signals recorded for graded attempts only, never in practice mode.
- The disclosure notice appears before any collection begins.
- A flagged attempt still shows the user their full analysis.

**Cost:** ₹0 **Depends on:** 5B

---

### Module 5D — Question Bank Protection

**Goal.** Make wholesale scraping of the 975-question bank (and everything we add) uneconomic, without harming legitimate offline use.

**Deliverables**
- The full bank is no longer delivered in a single 1.3 MB fetch. Paginate and scope by what the user is actually doing.
- Free tier gets a capped working set; deep bank access becomes a Pro benefit — this serves both security and monetization.
- Per-account fetch-volume limits (Upstash), with anomaly alerting on outliers.
- Image assets served through the CDN with hotlink protection (free on Cloudflare).
- Invisible per-account watermarking of served question sets so a leaked dump is traceable to an account.
- Terms of Service explicitly prohibiting scraping and redistribution (needed for AdSense anyway — see §5.1).

**Reality check:** anything rendered in a browser can be copied by a determined person. The goal is to raise cost, not to achieve the impossible. Do not over-invest here at the expense of Release 6.

**Acceptance criteria**
- No single request returns the entire bank.
- Legitimate offline use is unaffected for the user's scoped working set.

**Cost:** ₹0 **Depends on:** 5A

---

### Module 5E — Leaderboards and All India Test Series

**Goal.** Cash in the integrity work. This is the highest-retention feature in competitive-exam products, and it is only credible after 5A–5C.

**Deliverables**
- Scheduled All India Mock Tests — everyone attempts in the same window, results released together. The "everyone at once" format is what creates the event, the social sharing, and the WhatsApp-group traffic spike.
- Server-computed rank, percentile, subject-wise comparison against the cohort.
- Leaderboards: all-India, college-level, friends. Opt-in, with a privacy toggle and the option to appear under a username rather than a real name.
- Streaks, weekly challenges, topic-wise ladders.
- Shareable result cards (image generated client-side) — **this is a free growth engine**, not a vanity feature. Every shared card is an impression in a group of exactly our target users.
- Flagged attempts silently excluded from ranking.

**Acceptance criteria**
- 1,000 simultaneous submissions rank correctly and within free-tier limits.
- No user can alter their own rank via any client-side action.

**Cost:** ₹0 **Depends on:** 5B, 5C

---

## RELEASE 6 — MONETIZATION I: ADVERTISING
### *"Income from traffic, the way news sites do it."*

This directly answers the request to run ads like news sites do. It also comes with arithmetic that must be understood before effort is invested, because the intuition that "ads on a website make money" is only true at scale most apps never reach.

---

### 6.0 The honest arithmetic — read this first

Display advertising pays per thousand page views (RPM). For **Indian** traffic in the education category, realistic RPM is roughly **₹15–₹80**, varying by ad network, placement, season, and how much of the traffic is mobile.

| Monthly page views | Realistic monthly ad revenue |
|---|---|
| 10,000 | ₹150 – ₹800 |
| 50,000 | ₹750 – ₹4,000 |
| 200,000 | ₹3,000 – ₹16,000 |
| 1,000,000 | ₹15,000 – ₹80,000 |

Three consequences follow, and they shape the whole release:

1. **Ads are a volume business.** They do not meaningfully pay until we are well past 100k monthly page views. Until then, subscriptions will out-earn ads by a wide margin at a fraction of the traffic — 100 subscribers at ₹99 is ₹9,900/month, which would otherwise require roughly 500,000 ad page views.
2. **An app shell generates very few page views.** A student doing a 3-hour mock produces *one* page view on a single-page app. **Content pages** — solutions, notes, PYQ explanations, syllabus guides — are what generate the page-view volume ads need. That is precisely why news sites earn from ads and apps generally do not.
3. **Therefore the content engine (6B) is not optional.** It is the actual product change that makes ad revenue possible. Ad code without it earns approximately nothing.

**Strategic conclusion: build ads as a long-horizon compounding asset on the SEO/content surface, while subscriptions (Release 7) carry the near-term revenue.** Do not reverse this order.

---

### Module 6A — Commercial Hosting Migration ⚠️ BLOCKER

**Goal.** Be legally able to earn money from the deployment.

**Deliverables**
- Verify Vercel Hobby's current non-commercial terms and Cloudflare Pages' current commercial-use position, from the live policy text.
- Migrate to Cloudflare Pages (`@cloudflare/next-on-pages` or OpenNext). Validate: middleware/auth routes, the three API routes, PWA/service-worker behaviour, image optimisation, and build reproducibility.
- Move DNS/analytics/Turnstile into the same account for one free control plane.
- Keep the Vercel deployment live as a rollback target until the migration is proven.

**Acceptance criteria**
- Full feature parity on Cloudflare, verified against the existing Playwright suite.
- Hosting terms permit advertising and paid subscriptions.

**Cost:** ₹0 **Depends on:** nothing technical; **blocks 6C, 6D, and all of Release 7's payment flows**

---

### Module 6B — The Content & SEO Engine *(the actual revenue enabler)*

**Goal.** Create the indexed, crawlable, high-page-view surface that both ad revenue and organic user acquisition depend on.

We already own the raw material: **975 questions with subjects, topics, difficulty, and (soon) solutions.** That is potentially thousands of genuinely useful pages that nobody has to write from scratch.

**Deliverables**
- **Programmatic SEO pages**, statically generated:
  - `/questions/[question-id]` — one page per question, with full solution, related questions, topic context. ~975 pages at launch.
  - `/subject/[subject]` — 18 subject hubs with syllabus, weightage analysis, recommended sequence.
  - `/topic/[topic]` — topic pages with PYQ counts and trend data.
  - `/pyq/gate-cse-[year]` — 15 year-wise paper pages with full analysis.
  - `/syllabus/gate-cse-2027` — the highest-intent search term in this niche.
- **Editorial content** targeting real search demand: "GATE CSE preparation strategy", "GATE cutoff analysis", "how to prepare in 6 months", "best books for GATE CSE", "GATE vs placement". These are searched constantly and rank achievably.
- **Genuine value on every page.** AdSense rejects thin, auto-generated, low-value pages, and Google's helpful-content systems demote them. Each page must carry real analysis a student would want even with no ads on it. Programmatic must not mean empty.
- Technical SEO: SSG/ISR for all content routes, `sitemap.xml`, `robots.txt`, canonical URLs, OpenGraph/Twitter cards, `Article` + `FAQPage` + `Quiz` structured data, Core Web Vitals budget.
- **Free tools as link magnets:** GATE rank predictor, score calculator, normalisation calculator, college predictor, study-plan generator. These attract organic backlinks better than articles do, and every one is a high-page-view, ad-friendly page.

**Acceptance criteria**
- 1,000+ indexable pages, each with substantive unique content.
- Lighthouse SEO ≥ 95; Core Web Vitals green (ads must not break this — see 6D).
- Sitemap submitted; indexing confirmed in Search Console.

**Cost:** ₹0 **Depends on:** 5A (solutions must exist server-side to publish them)

---

### Module 6C — Ad Network Onboarding

**Goal.** Get approved, which takes longer than people expect and has hard prerequisites.

**AdSense approval prerequisites — all mandatory:**
- Substantial original content (6B delivers this; applying before it means near-certain rejection)
- Privacy Policy, Terms of Service, About, Contact pages — **AdSense requires these; they are also needed for DPDP compliance and for Razorpay onboarding.** Build once, use three times.
- Clear site navigation; no under-construction sections
- Account holder must be 18+
- Typical review: days to several weeks; rejection is common and re-application is allowed after fixing the cited reason

**Deliverables**
- Legal pages: Privacy Policy (naming every data type collected, including Release 5 integrity signals), Terms of Service (incl. anti-scraping), Cookie Policy, About, Contact, Refund Policy (needed for Release 7).
- AdSense application, with the content engine live first.
- **Fallbacks if AdSense declines or underperforms:** Ezoic (lower entry bar, often better optimisation at small scale), Media.net, AdPushup, PropellerAds. Never depend on a single network.
- **Direct sponsorships** as a parallel track: coaching institutes, book publishers, laptop/tablet brands, and hostel/study-abroad services pay far better per impression than programmatic, and they can be sold from day one at low traffic. A single direct sponsor can exceed months of AdSense revenue at our early scale.

**Acceptance criteria**
- Approval obtained, or a fallback network live.
- All legal pages published and linked in the footer.

**Cost:** ₹0 **Depends on:** 6A, 6B

---

### Module 6D — Ad Placement Architecture *(without wrecking the product)*

**Goal.** Earn from ads without damaging the experience that makes people stay and subscribe.

**Hard rules — non-negotiable:**

| Rule | Reason |
|---|---|
| **Zero ads during an active exam** | Breaking concentration in a 3-hour mock is the fastest way to lose a serious user. Also an integrity risk. |
| **Zero ads for Pro subscribers** | "Remove ads" is one of the strongest reasons to pay; its value must be real. |
| **No ads on the auth or payment flows** | Conversion and trust. |
| **Layout-reserved slots** | Ads must not cause layout shift; CLS damage hurts SEO, which is the very traffic ads depend on. |
| **Lazy-load below the fold** | Protects Core Web Vitals. |
| **No interstitials on core app routes** | Content pages only, if at all. |

**Permitted placements:** content/solution pages (in-article, sidebar, end-of-article), the dashboard sidebar for free users, between result sections (post-submission only), and a *rewarded* format — watch an ad to unlock one extra AI Mentor call today, which converts ad inventory into a soft paywall nudge.

**Deliverables**
- `<AdSlot>` component: tier-aware (renders nothing for Pro), route-aware (renders nothing in `/exam/session`), consent-aware, reserved-height, lazy-loaded, with a graceful empty state when the network returns no fill.
- **Service worker interaction must be tested.** Our SW is network-first with caching; ad scripts must be excluded from caching or they will break fill and reporting.
- Consent management for GDPR/DPDP where applicable; non-personalised ads for users who decline or are flagged as minors.
- An A/B framework for density — measure ad revenue *against* subscription conversion and retention, and be willing to remove a unit that earns ₹200/month while costing a ₹99/month subscriber.

**Acceptance criteria**
- Pro users see zero ad requests in the network tab.
- CLS stays under 0.1 with ads live.
- No ads render on `/exam/session` under any condition.

**Cost:** ₹0 **Depends on:** 6C

---

## RELEASE 7 — MONETIZATION II: SUBSCRIPTIONS & ANTI-MISUSE
### *"The revenue line that actually pays the bills."*

This is where the user's "application security to avoid misuse when the subscription comes in" lands.

---

### Module 7A — Tier Model and Entitlements

**Goal.** A free tier generous enough to build habit and word-of-mouth; a Pro tier valuable enough that a serious aspirant pays without hesitation.

**Proposed split** (refined from `GATE_OS_Growth_Security_Marketing_Plan.md`):

| Capability | Free | Pro |
|---|---|---|
| PYQ bank | Capped working set | Full 975+ bank |
| Practice tests | Unlimited | Unlimited |
| Full-length mocks | 2/month | Unlimited |
| AI Mentor | Small daily quota | High quota |
| AI question generation | ✗ | ✓ |
| Analytics | Basic | Full — weakness maps, trend forecasting, rank prediction |
| Focus Target / Goal Slider | Basic | Full adaptive engine |
| All India Test Series | Participation | Participation + detailed comparative analysis |
| Ads | Yes | **No** |
| Offline full-bank download | ✗ | ✓ |
| Devices | 2 | 2 (enforced) |
| Support | Community | Priority |

**Pricing (India, students — price is a positioning decision, not a spreadsheet output):**
- Monthly **₹99**
- Quarterly **₹249** (₹83/mo)
- Annual **₹599** (₹50/mo) ← push this hard; it front-loads cash and removes monthly churn
- **Lifetime / "Founding Member" ₹999**, limited to the first 500 users — this is the single best early cash-flow instrument. It funds nothing (we spend nothing) but it proves willingness-to-pay and creates evangelists.
- **Grandfather every early subscriber permanently.** Cheap, and it creates the loudest possible advocates.

**Deliverables**
- Entitlement checks **server-side on every gated action.** A client-side `tier === 'pro'` check is a UI hint, never a gate. Assume the client is hostile.
- Feature flags driven by the server-held tier.
- Graceful degradation at limits — a warm upsell, never a hard wall mid-task.

**Cost:** ₹0 **Depends on:** 4B

---

### Module 7B — Payments (Razorpay)

**Goal.** Take money from Indian students with the lowest possible friction.

**Deliverables**
- Razorpay integration — **UPI first**, then cards, netbanking, wallets. UPI is how this audience actually pays; a card-first checkout would lose most of them.
- Razorpay Subscriptions for recurring; one-time for lifetime.
- Server-side **webhook** handling as the source of truth for entitlement changes — never trust a client-side success callback.
- Idempotent webhook processing; signature verification on every webhook.
- Invoice generation, GST handling, refund policy and flow.
- Payment-failure recovery: retry prompts, dunning email, grace period before downgrade.

**Costs:** ₹0 upfront; ~2% + GST per transaction, deducted from revenue received. Compliant with the zero-investment constraint.

**Depends on:** 6A (commercial hosting), 7A

---

### Module 7C — Subscription Abuse Prevention

**Goal.** Protect the revenue without punishing honest users.

**Deliverables**
- Server-side entitlement verification on every Pro action (restating 7A because it is the control that matters most).
- Trial abuse prevention: one trial per verified email *and* per device fingerprint; Turnstile on signup; disposable-email domain blocklist.
- Refund abuse monitoring — subscribe → mass-download → refund is the obvious attack; flag accounts with abnormal download volume in a refund window.
- Payment-fraud signals: many cards on one account, rapid subscribe/cancel cycles.
- Admin dashboard for manual review — a human must be able to see and act.

**Cost:** ₹0 **Depends on:** 7B

---

### Module 7D — Account-Sharing Prevention

**Goal.** Stop one subscription serving a WhatsApp group of forty.

This is the largest revenue leak in Indian edtech, and the control already exists in our schema (`profiles.active_session_id`).

**Deliverables**
- **Two-device limit for Pro**, enforced server-side. Two, not one — students genuinely use a phone and a laptop, and a one-device limit would generate constant, legitimate complaints.
- Netflix-style behaviour: logging in on a third device shows "You are signed in on 2 devices" with a chooser to sign one out. Never a silent failure.
- Concurrent-session detection: the same account taking two tests simultaneously from different cities is a hard signal.
- Device change cooldown to stop credential rotation through a group.
- Escalation ladder: warn → force re-auth → temporary lock → manual review. **Never auto-ban a paying customer**; a wrongly banned subscriber is a public complaint.

**Acceptance criteria**
- A legitimate phone + laptop user is never interrupted.
- A third concurrent device is blocked with a clear, actionable message.

**Cost:** ₹0 **Depends on:** 4D-2

---

### Module 7E — Referral and Growth Loops

**Goal.** Make acquisition compound without an advertising budget — because there isn't one.

**Deliverables**
- Referral: both sides get free Pro days. Attribution via a unique code on the profile.
- Shareable achievements: result cards, rank cards, streak milestones — pre-formatted for WhatsApp and Instagram Stories, which is where this audience lives.
- College ambassador programme: free Pro + leaderboard status for verified campus reps.
- Study-group invitations — a social hook with a built-in acquisition side effect.
- "Free Pro for a month" in exchange for a genuine review/testimonial, early on.

**Cost:** ₹0 (paid in product, not cash) **Depends on:** 7A

---

## RELEASE 8 — REVENUE DIVERSIFICATION
### *"Many ways to generate income," as requested.*

Ads and subscriptions are lines one and two. Here are seven more, ordered by effort-to-return at our scale.

| # | Stream | How | Realistic contribution | Effort |
|---|---|---|---|---|
| 1 | **Direct sponsorships** | Coaching institutes, publishers, laptop brands buy placements/newsletter slots directly | High per deal; ₹5k–50k/month once traffic is real | Low tech, high sales |
| 2 | **Affiliate** | Amazon Associates India on book-recommendation pages; course affiliates; gadget guides | ₹2k–20k/month at moderate traffic | Low |
| 3 | **Digital products** | Formula sheets, condensed notes, topic-wise PYQ compilations, last-month revision packs as paid PDFs | ₹100–299 each; high margin; converts non-subscribers | Medium |
| 4 | **B2B / college licences** | Sell batch access to colleges and coaching centres (per-seat, 50–500 students) | The single largest per-deal revenue line; one college can exceed 100 individual subscribers | High sales, medium tech |
| 5 | **Sponsored content** | Clearly labelled sponsored articles on the content engine | ₹3k–15k per placement | Low |
| 6 | **Job / internship board** | Companies pay to post to a pool of final-year CSE students | Later stage, once the audience is sizeable | Medium |
| 7 | **Certification / mentorship** | Paid AIR-holder doubt sessions, revenue-shared; verified performance certificates | Medium | High ops |

**An eighth, treated with care:** aggregate, fully anonymised insight reports ("GATE CSE 2027 preparation trends") sold or used as PR. Only ever anonymised and aggregated; never individual data; never without an explicit privacy-policy basis. Used well, this is more valuable as free PR that earns backlinks than as a product.

**Sequencing:** streams 1, 2 and 3 require almost no new engineering and should start as soon as Release 6's content engine has traffic. Stream 4 (colleges) is where the largest money is, and it needs Release 5's test series to be credible.

---

## RELEASE 9 — PRODUCT DEPTH
### *Features that drive retention — which is what makes every revenue line above work.*

A subscription business is a retention business. These are ordered by expected impact on retention per unit of effort.

### Module 9A — Adaptive Learning Engine
Spaced repetition (SM-2 or FSRS) over the existing mistakes store; automatic weak-topic detection; a daily adaptive question set; a mastery model per topic that feeds the existing Goal Slider. **Highest-impact item in this release** — it converts the app from a question bank into a coach, which is the core of the Pro pitch.

### Module 9B — Gamification and Habit
Streaks with freeze days, XP and levels, badges surfaced on the profile (Module 4C), daily goals, weekly challenges, study-time leaderboards. Cheap to build, disproportionate effect on daily active use.

### Module 9C — Social and Community
Study groups, group leaderboards, peer doubt-solving with upvotes, discussion threads on individual questions (which also adds user-generated content to the SEO surface — a compounding benefit for Release 6), a mentor/mentee pairing for AIR holders.

### Module 9D — Mobile Presence — ₹0
Trusted Web Activity to ship the existing PWA to the Play Store, or Capacitor for a fuller wrapper. **Note the one genuine cost in this entire document: the Google Play developer account is a one-time ~$25 (~₹2,100).** It is optional — the PWA installs directly from the browser without it — so it stays out of the zero-rupee path. Buy it out of revenue if and when the Play Store listing is worth it. Apple's ₹8,000+/year fee is firmly out of scope.

### Module 9E — AI Depth
Personalised study-plan generation, AI doubt-solving with step-by-step derivations, AI-generated mocks calibrated to a weakness profile, natural-language question search, a voice-based revision mode. Heavier AI usage is the clearest Pro-tier justification and the cleanest quota boundary.

### Module 9F — Content Expansion
Beyond CSE: GATE DA (Data Science & AI), ECE, ME, CE. **The engine is branch-agnostic; only the dataset changes.** This is the cheapest available multiplier on total addressable market in the entire plan — the same code, several times the audience.

---

# PART IV — THE ECONOMICS

## 4.1 Which revenue line actually carries us

At a realistic 2–5% free-to-paid conversion:

| Registered users | Paying (3%) | Subscription revenue @ ₹99 avg | Ad revenue (~15 PV/user/mo) | Total |
|---|---|---|---|---|
| 1,000 | 30 | ₹2,970 | ₹225 – ₹1,200 | ~₹3,200 – ₹4,200 |
| 10,000 | 300 | ₹29,700 | ₹2,250 – ₹12,000 | ~₹32,000 – ₹42,000 |
| 50,000 | 1,500 | ₹1,48,500 | ₹11,250 – ₹60,000 | ~₹1.6L – ₹2.1L |
| 200,000 | 6,000 | ₹5,94,000 | ₹45,000 – ₹2,40,000 | ~₹6.4L – ₹8.3L |

These are illustrative, not forecasts. The structural point holds regardless of which end of each range is true: **subscriptions dominate at every scale, but ads become materially significant once the content engine is mature, and they earn from the ~97% of users who will never pay.** That is exactly why both belong in the plan — ads monetise the free majority; subscriptions monetise intent.

**Seasonality matters enormously here.** GATE is an annual February exam. Traffic and conversion will spike from roughly September through January and collapse in March–May. Plan cash flow around this: push annual plans hard in the peak, and use the trough for content and feature work rather than acquisition spend.

## 4.2 What makes this product succeed

Ranked by what will actually decide the outcome:

1. **Trust in the scores.** Release 5 is the moat. A rank that cannot be gamed is the thing a serious aspirant will pay for, and it is the thing free competitors will not bother to build.
2. **The AI coach, done narrowly and well.** Not a generic chatbot — a system that knows this user's weak topics and tells them what to do on Tuesday morning. Module 9A + 9E.
3. **Speed and offline capability.** The existing local-first architecture is a genuine, hard-won advantage. Many competitors are slow web apps. Protect this; do not let Release 4's sync work erode it.
4. **The free tier being genuinely good.** Word of mouth in college WhatsApp groups is the entire acquisition strategy. A stingy free tier kills it at the source.
5. **The content engine.** It compounds — every page written keeps earning traffic for years. It is simultaneously acquisition, SEO, and the ad-revenue substrate.
6. **Being priced for a student.** ₹99/month is an easy yes. ₹499/month invites comparison with full coaching.
7. **Consistency.** Weekly shipping during the September–January peak is worth more than any single feature.

## 4.3 What will most likely kill it

- Ad density degrading the experience enough to cost more in subscriptions than the ads earn. **Measure this explicitly.**
- Building Release 6 before Release 5 — monetising an app whose scores can be faked.
- The free tier being too thin to spread by word of mouth.
- A security incident on the AI route producing a bill or an outage during peak season (FINDING-1).
- Burning the September–January window on infrastructure work instead of shipping to users.
- Cross-user data leakage on a shared college machine (FINDING-4) — one screenshot of that in a student group is a reputational event.

---

# PART V — CROSS-CUTTING CONCERNS

## 5.1 Legal pages — required, and required early

| Page | Needed for |
|---|---|
| Privacy Policy | AdSense, Razorpay, DPDP, app stores |
| Terms of Service | AdSense, anti-scraping enforcement, subscriptions |
| Refund / Cancellation Policy | Razorpay onboarding (mandatory) |
| Cookie Policy | Ad consent |
| About + Contact | AdSense approval |
| Disclaimer | "Not affiliated with IIT/GATE organising institute" — important, and easy to forget |

Write these once in Release 6, and they unblock ads, payments, and compliance simultaneously.

## 5.2 Privacy and India's DPDP Act

- Collect the minimum. Every field on the profile must justify itself.
- Explicit consent for analytics and personalised advertising.
- **Minors:** some users will be under 18. DPDP has stricter requirements for children's data, and ad networks restrict personalised advertising to minors. Simplest safe posture: collect a birth year, and serve only non-personalised ads to anyone under 18.
- Data export and account deletion — already in Module 4C; these are rights, not features.
- Breach-notification readiness.
- Integrity signals from Module 5C must be named explicitly in the Privacy Policy.

## 5.3 The security model, stated once

| Layer | Control |
|---|---|
| Transport | HTTPS everywhere; HSTS |
| Auth | Supabase JWT; httpOnly refresh; middleware-enforced routes |
| Authorization | Postgres RLS, default-deny; service-role key server-only |
| API | Auth required; `zod` validation; Upstash rate limits; Turnstile |
| Exam integrity | Server-held answer key, server timer, server scoring, integrity flags |
| Data isolation | Per-user IndexedDB namespace + RLS |
| Payments | Webhook signature verification; server-side entitlements only |
| Secrets | `NEXT_PUBLIC_` vs server-only, CI-enforced |
| Headers | CSP, X-Frame-Options, Referrer-Policy (CSP needs care once ad scripts load) |
| Monitoring | Sentry; structured API logs; anomaly alerts |

**The single governing rule: the client is untrusted.** Every check that matters happens on a server we control.

## 5.4 Metrics to instrument from day one

**Acquisition:** signups/day, source, organic sessions, indexed pages, keyword ranks.
**Activation:** % completing a first test within 24h — the strongest early predictor of retention.
**Retention:** D1/D7/D30, weekly active, streak distribution.
**Revenue:** free→paid conversion, ARPU, MRR, churn, LTV, ad RPM, revenue per free user.
**Health:** error rate, p95 latency, sync failure rate, AI quota utilisation, free-tier headroom on every service in §2.1.
**Integrity:** flagged attempt rate, false-positive rate (audit manually — this one lies if unwatched).

## 5.5 Risk register

| Risk | Impact | Response |
|---|---|---|
| AI route abused before 4F ships | High — outage or bill | Ship 4F first, out of sequence |
| AdSense rejection | Medium | Content engine first; Ezoic/Media.net fallback; direct sponsors |
| Vercel ToS breach at monetization | High | Module 6A migration, before any ad code |
| Supabase free tier exceeded | Medium | Archive strategy; the revenue at that scale funds the upgrade |
| Seasonal revenue collapse (Mar–May) | Medium | Annual plans; use the trough for building |
| Competitor undercuts on price | Medium | Compete on integrity and the AI coach, not price |
| Cross-user leak on shared device | High (reputational) | Module 4D, with an explicit test |
| Solo-founder bandwidth | High | Strict release sequencing; resist parallel work |

---

# PART VI — SEQUENCING

## 6.1 Dependency order (this order is not optional)

```
4F (AI route hardening)  ← DO THIS FIRST, it is live and exploitable
   ↓
4A Supabase → 4B Auth → 4C Profile+Avatars
                  ↓
              4D Session isolation → 4E Sync
                  ↓
5A Answer withholding → 5B Server timer/scoring → 5C Integrity → 5E Leaderboards
                  ↓                                    ↓
              5D Bank protection                       │
                  ↓                                    │
6A Cloudflare migration ⚠ BLOCKER ──────────────────────┤
   ↓                                                   │
6B Content engine → 6C Ad networks → 6D Ad placement    │
   ↓                                                   │
7A Tiers → 7B Razorpay → 7C Abuse → 7D Device limits → 7E Referrals
   ↓
Release 8 (diversification) ∥ Release 9 (depth)
```

## 6.2 Suggested rhythm

Given a solo developer and a February exam date, the shape that matters is: **security and identity before the peak; monetization during it; depth in the trough.**

- **Release 4** — the foundation. Nothing else is possible first.
- **Release 5** — before any competitive or paid feature is announced.
- **Release 6** — content engine started early and continuously, because SEO takes months to compound; start writing content *during* Releases 4 and 5, not after.
- **Release 7** — target the pre-exam peak, when willingness to pay is at its maximum.
- **Releases 8 and 9** — the post-exam trough.

## 6.3 The next five actions

1. **Harden `/api/ai/generate` today** — add `zod` validation, a server-side `systemInstruction` enum, and a prompt-length cap. These need no Supabase and no auth, and they close the worst of the hole immediately.
2. **Create the Supabase project** and commit the first migration with RLS enabled on every table.
3. **Install `@dicebear/core` + `@dicebear/collection`** and build the avatar picker — it is self-contained, visible, and proves out the profile shape.
4. **Verify Vercel's and Cloudflare's current terms** in writing before any monetization work begins. This single check determines the hosting decision.
5. **Start writing content.** One solution page per day, beginning now. SEO compounds on a months-long clock, and it is the only line in this plan that cannot be rushed later.

---

## Appendix A — Cost ledger

| Item | Cost |
|---|---|
| Hosting, database, auth, storage, CDN, rate limiting, bot protection, email, analytics, error tracking, CI, AI, avatars | **₹0** |
| Razorpay | ~2% of revenue received — no upfront |
| Custom domain *(optional)* | ~₹1,000/yr — buy from revenue, not required |
| Google Play account *(optional, Module 9D)* | ~₹2,100 one-time — buy from revenue, not required |
| **Required investment to build, launch, and monetize** | **₹0** |

## Appendix B — Source documents

- `GATE_OS_Deployment_and_Monetization_Plan.md` — free-tier limits, freemium hypothesis, phase sequencing
- `GATE_OS_Growth_Security_Marketing_Plan.md` — tier split, `active_session_id` device enforcement, penetration pricing, zero-budget channels, competitive analysis
- `GATE_OS_Release_4_and_Future_Releases_Master_Prompt.md` — Supabase schema and sync statuses (4A), auth and security validation matrix (4B)
- `BUGS.md` — P0–P3 backlog to fold into each release
- Live codebase at `D:\0-UI\r2ma-stable` — the four findings in §1.2 were verified directly against source and data

---

*End of document.*
