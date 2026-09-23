# RENYXERA — Master Plan
## Infrastructure, Authentication, Exam Security, Multi-Branch Expansion & Zero-Investment Monetization
### Release-by-Release / Module-by-Module Execution Report

**Document version:** 2.0
**Date:** 24 September 2026
**Owner:** Lead Technical Architect & Product Owner
**Repository:** `D:\0-UI\r2ma-stable`
**Current production:** https://renyxera.vercel.app/ → **migrating to Cloudflare (P0)**
**Supersedes:** v1.0 (23 Sep 2026)
**Source documents folded in:** `GATE_OS_Deployment_and_Monetization_Plan.md`, `GATE_OS_Growth_Security_Marketing_Plan.md`, `GATE_OS_Release_4_and_Future_Releases_Master_Prompt.md`, `BUGS.md`

---

## 0. The Governing Doctrine

Three rules govern every decision in this document. Where a mandate and a rule conflict, the conflict is named explicitly and resolved in the open — never silently.

> **Rule 1 — The Zero-Investment Doctrine.** The complete platform is built, launched, secured, and monetized at **₹0 out-of-pocket infrastructure cost**. The only money that ever leaves our hands is a percentage of revenue already received (payment gateway fees). Any module that cannot meet this is flagged, and a ₹0 alternative is supplied.
>
> **Rule 2 — The Client Is Hostile.** Our users are CS/IT students preparing for the hardest computer-science exam in the country. They read minified bundles, inspect Network tabs, and enumerate API routes for fun. Every check that matters happens on a server we control. A client-side check is a UI affordance, never a security boundary.
>
> **Rule 3 — Sequence Is Strategy.** Security and infrastructure first, retention second, monetization third, community fourth. Monetizing an app whose scores can be forged destroys the brand permanently and cannot be undone by a later patch.

**Priority ordering used throughout:** `P0` (blocking, ship immediately) → `P1` (this release) → `P2` (next release) → `P3` (backlog).

**Document map:**

| Part | Contents |
|---|---|
| I | Verified current state and the four findings |
| II | Zero-Investment infrastructure doctrine, Cloudflare-first stack, asset architecture |
| III | Releases 4–9, module by module, with acceptance criteria |
| IV | Economics: pay-per-exam pricing, ads, seasonality, diversification |
| V | Cross-cutting: legal, compliance, security model, metrics, risk register |
| VI | Sequencing, dependency graph, immediate execution queue |

---

# PART I — WHERE WE ACTUALLY ARE

## 1.1 Built and working

| Area | State |
|---|---|
| Frontend | Next.js 15.4 App Router, React 19, TypeScript, Tailwind v4 |
| State | 10 Zustand stores (`analytics, calendar, data, exam-runtime, exam, goal-slider, study, toast, todo, ui`) |
| Persistence | IndexedDB via `idb`, 12 object stores, **one fixed database name** |
| Question bank | 975 questions / 15 papers, `data/Aggregated_Output.json` (1.3 MB), **static JSON, no database** |
| Assets | `public/images` 6.1 MB, `public/brand` 2.5 MB |
| Exam engine | Subject / Section / Topic / Year / Custom modes; Focus Target filtering verified end-to-end |
| AI | Gemini via `@google/genai`, proxied through `/api/ai/generate` |
| PWA | Service worker, network-first (`gateos-pwa-cache-v4`) |
| Theming | Brand gradient system, glass morphism, dark/light, scroll reveal |
| Routes | 14 pages, 3 API routes |
| Hosting | **Vercel Hobby — non-commercial licence (P0 blocker for all revenue)** |
| Auth | **None.** No auth dependency installed. |
| Backend DB | **None.** IndexedDB is the sole source of truth. |
| Users | **The concept does not exist in the codebase.** |
| Branches | CSE only |

## 1.2 The four findings — verified against source, not assumed

### FINDING-1 · P0 · The only route that costs money has no protection

`app/api/ai/generate/route.ts` reads `{ systemInstruction, prompt }` from the request body and forwards both to Gemini using our server-held key. Confirmed in source: **no authentication, no rate limiting, no prompt-length cap, and the client supplies the system instruction verbatim.**

Meanwhile `/api/dataset` and `/api/image-manifest` — which serve free, already-public static data — *both* call `checkRateLimit`/`getClientKey`. **Protection is applied exactly backwards.**

Three distinct exposures, not one:
- **Quota drain** — a loop takes the AI Mentor offline for every real user.
- **Cost** — uncapped spend the moment we leave the Gemini free tier.
- **Prompt injection / brand safety** — a caller-supplied `systemInstruction` means our API key can be steered to generate arbitrary content that is attributable to RENYXERA.

### FINDING-2 · P0 · The rate limiter cannot work where it is deployed

`lib/security/rate-limiter.ts` is an in-memory `Map` sliding window. Its own header comment concedes it only stops "casual bulk scrape" against a warm instance. On serverless, each invocation may land on a fresh instance with fresh memory. `getClientKey` falls back to IP — and a large share of Indian mobile traffic arrives via CGNAT, so IP keying simultaneously throttles whole cities together and lets a single rotating user run free. Real limiting requires shared state keyed on **user ID**.

### FINDING-3 · P0 · The answer key is shipped to the browser

Verified by inspecting `data/Aggregated_Output.json`. Every question carries:

```json
"options": [ { "option_id": "A", "text": "…", "is_correct": false }, … ],
"nat_answer_range": { … }
```

`is_correct` and `nat_answer_range` reach the client and are written to IndexedDB. During a live test, every correct answer sits in the user's browser, readable from the Network tab or `indexedDB` in the console.

For honour-system self-practice this is tolerable. **For a paid, ranked, leaderboard product sold to CS students it is fatal** — and this audience is precisely the one that will find it.

### FINDING-4 · P0 · Storage has no concept of a user

`lib/repository/storage/idb-manager.ts` opens a single database under one fixed `DATABASE_NAME`. Store keyPaths are bare — `STORE_MISTAKES` on `questionId`, `STORE_BOOKMARKS` on `questionId`. There is no `userId` anywhere in the schema.

The day two students log in on one hostel or lab machine, **user B sees user A's bookmarks, mistakes, attempt history and analytics.** Authentication does not fix this; the storage layer itself must become user-aware. One screenshot of this in a college WhatsApp group is a reputational event we do not recover from.

---

# PART II — THE ZERO-INVESTMENT INFRASTRUCTURE DOCTRINE

## 2.1 ⚠️ P0 — The Vercel licence conflict, and why Cloudflare is not optional

**Verified 24 Sep 2026 against live source text (not summaries) — both sides of this decision.**

**Vercel — confirmed, verbatim, current** (`vercel.com/docs/limits/fair-use-guidelines`, doc dated 2026-09-14):

> "Hobby teams are restricted to non-commercial personal use only. All commercial usage of the platform requires either a Pro or Enterprise plan." Commercial usage is defined as any deployment "used for the purpose of financial gain of **anyone** involved in **any part of the production** of the project" and explicitly lists: *"Any method of requesting or processing payment from visitors of the site,"* *"Advertising the sale of a product or service,"* and *"The inclusion of advertisements, including but not limited to online advertising platforms like Google AdSense."* Enforcement: Vercel "reserves the right to disable or remove any Project... with or without notice at its sole discretion."

This is unambiguous and names our exact two monetization mechanisms (ads, payments) by name. The moment AdSense or Razorpay goes live on `renyxera.vercel.app`, we are in breach of the plan hosting us, and the remedy is Vercel Pro at ~$20/month — which breaks Rule 1 on day one of monetization.

**Cloudflare — confirmed permissive on commercial use, with one real clause worth naming.** Cloudflare's Self-Serve Subscription Agreement (`cloudflare.com/terms/`) has no blanket prohibition on commercial use of Free Services. It does contain, in **Section 2.2.1(h)**, a restriction against using Free Services to *"process or collect personal or business credit card information on any web property that is receiving Free Services."* Read literally this sounds concerning for Module 7B (card payments), but the standard, PCI-DSS-standard mitigation makes it moot: **Razorpay's hosted Checkout / tokenized flow (the only integration path this plan ever specifies) means raw card data goes directly from the payer's browser to Razorpay's own PCI-compliant servers — it never touches our Cloudflare-hosted property or our own code.** We are not "processing or collecting" card data under any reasonable reading of that clause; Razorpay is. This is also simply correct payment-integration practice independent of Cloudflare's ToS (it's what keeps us out of PCI DSS scope at all). **Action item, carried forward: never build a custom card-entry form that submits PAN data to our own backend — always Razorpay's hosted/tokenized surface.** Section 2.6 also notes Cloudflare can discontinue Free Services at will with no liability — ordinary free-tier platform risk, mitigated by keeping the CDN base URL and DNS user-owned and portable (§2.3).

This is therefore not a cost optimisation. It is a **licensing prerequisite for the existence of every revenue line in this plan**, and it is scheduled as Module 4A — the first thing built, before auth, before the database, before anything.

### 2.1.1 Technical path, verified end-to-end against this actual codebase

Cloudflare's own current docs (fetched 24 Sep 2026) name **vinext** as the new officially-recommended Next.js runtime for Workers — but its own compatibility dashboard describes it as **beta**, under active development, with several feature categories still marked unsupported or deferred. Not the right foundation for a revenue-bearing app on day one. **`@opennextjs/cloudflare` reached its 1.0 GA milestone in February 2026** and is Cloudflare's documented fallback path; that's what this plan uses, and it's now installed (`^1.20.6`) and proven against our real code, not just plausible in theory:

- **Blocking technical fact, true regardless of adapter:** Cloudflare Workers run in a V8 isolate sandbox with **no filesystem at request time**. Our three data-serving API routes (`/api/dataset`, `/api/exam/grade`, `/api/image-manifest`) all read `data/*.json` via `fs.readFile(path.join(process.cwd(), …))` — a pattern that cannot work on Workers under any adapter. **Fixed:** all three now `import` their JSON directly (Next.js/TypeScript already had `resolveJsonModule` on), so the data is bundled at build time instead of read from disk at request time. Verified behaviorally identical on the existing Vercel/Node path before and after — same responses, same grading results, same rate limiting — so this was a safe, zero-risk refactor to make immediately, independent of when the actual migration happens.
- **`npm run build:cf` (added, wraps `opennextjs-cloudflare build`) succeeds end-to-end** on the real app — full `next build` plus the Cloudflare bundle-generation step complete with no errors, across every dependency (`@google/genai`, `zod`, `idb`, `motion`, `recharts`, all 23 routes). This is the single most important verification in this section: **the app is genuinely Workers-compatible**, not hypothetically compatible.
- **`wrangler deploy --dry-run` (no Cloudflare login required) computed the real final upload size: 9,489 KiB uncompressed / 2,089 KiB gzip.** Cloudflare raised the Workers script-size ceiling to a flat **64 MiB uncompressed on every plan (free included)** on 4 Sep 2026, retiring the old 3 MB(free)/10 MB(paid) *compressed* limits this plan would otherwise have needed to worry about. At ~9.3 MB we're using ~15% of that ceiling — comfortable headroom even after Release 8's ~5× multi-branch data growth.
- **Scaffolded, committed, and additive-only:** `wrangler.jsonc` (name, `compatibility_date`, `nodejs_compat` flag, assets binding), `open-next.config.ts`, and `build:cf`/`preview:cf`/`deploy:cf`/`cf-typegen` npm scripts. **The existing `dev`/`build`/`start` scripts and the live Vercel deployment are completely untouched** — this is a parallel, opt-in path, not a cutover.
- **What remains and needs the account owner, not this session:** creating the actual Cloudflare account, `wrangler login` (or an API token), running `deploy:cf` for real, connecting the domain/DNS, verifying the live deployment against the Playwright suite, and only then decommissioning Vercel. These are account-level, outward-facing, hard-to-reverse actions outside what an assistant should do unattended.

> **Standing instruction:** verify both providers' live policy text before executing the migration. Hosting terms change; this decision must rest on the current terms, not on this document. (Done above, 24 Sep 2026 — re-verify if this section is acted on much later.)

## 2.2 The complete ₹0 stack

| Need | Service | Free ceiling | Cost |
|---|---|---|---|
| Hosting / CDN / edge compute | **Cloudflare Pages + Workers** | Unlimited static bandwidth; 100k Worker req/day; 500 builds/mo | ₹0 |
| Object storage (images, PDFs) | **Cloudflare R2** | 10 GB storage, **zero egress fees** | ₹0 |
| Database | **Supabase Postgres** | 500 MB DB, ~5 GB egress | ₹0 |
| Row security | Supabase RLS | included | ₹0 |
| Auth — Google / Email | **Supabase Auth** | ~50k MAU | ₹0 |
| Auth — Mobile OTP | **Firebase Auth** (SMS), bridged into Supabase | ~10k verifications/mo *(verify — see 2.4)* | ₹0 |
| Server-side evaluation | **Supabase Edge Functions** or **Cloudflare Workers** | within above | ₹0 |
| Rate limiting | **Upstash Redis** | ~10k commands/day | ₹0 |
| Bot / abuse gate | **Cloudflare Turnstile** | unlimited | ₹0 |
| Avatars | **DiceBear** (`@dicebear/collection`, MIT) | self-hosted SVG, unlimited | ₹0 |
| Transactional email | Supabase SMTP / **Resend** | ~3,000 emails/mo | ₹0 |
| Error tracking | **Sentry** | ~5,000 events/mo | ₹0 |
| Product analytics | **Cloudflare Web Analytics** | free, cookieless | ₹0 |
| CI/CD | **GitHub Actions** | 2,000 min/mo | ₹0 |
| AI inference + vision PDF parsing | **Gemini free tier** | rate-limited | ₹0 |
| Ads | AdSense / Ezoic / Media.net | free to join — they pay us | ₹0 |
| Payments | Razorpay | no setup fee; UPI MDR currently nil *(see 4.4)* | ₹0 upfront |
| Domain | `*.pages.dev` | free | ₹0 |

**Recurring infrastructure cost to build, launch, secure and monetize: ₹0.**

Optional, revenue-funded, never prerequisites: custom domain ~₹1,000/yr; Google Play developer account ~₹2,100 one-time (Module 9D).

## 2.3 Image & binary asset architecture — a P0 design rule

Three storage options exist and only one is correct. Getting this wrong silently destroys the free tier.

| Option | Verdict | Why |
|---|---|---|
| Binary images in Supabase Postgres (`bytea`/base64) | **FORBIDDEN** | Our `public/images` is already 6.1 MB against a **500 MB total database quota**. Multi-branch expansion (Release 8) multiplies diagram volume 5×. Storing binaries here consumes the quota that user data, attempts and analytics need, and bloats every query and backup. |
| Raw GitHub repository URLs / `raw.githubusercontent.com` | **FORBIDDEN** | Not a CDN. Subject to hotlink throttling and rate limits, no cache-control guarantees, no custom headers, and an availability dependency on a service that does not promise asset delivery. |
| **Cloudflare Pages CDN (`public/images/`) + Cloudflare R2** | **MANDATED** | Unlimited static bandwidth on Pages; R2 gives 10 GB with **zero egress fees** for the larger multi-branch diagram corpus. |

**The rule, stated once and enforced everywhere:**

> **The database stores relative path strings only.** `images/cse/2023/q42-circuit.png` — never a binary, never a base64 blob, never an absolute third-party URL. Resolution to a full URL happens at render time from a single configurable CDN base. This keeps the database small, makes the CDN swappable without a migration, and keeps every asset path portable across branches and years.

**Split rule:** assets shipped with the app and needed offline (brand, UI, the CSE core set) live in `public/images/` on the Pages CDN. Bulk and long-tail assets (multi-branch diagram corpus from Release 8) live in R2, fetched on demand.

## 2.4 Free-tier ceilings and their ₹0 answers

| Ceiling | Reached at | Symptom | ₹0 mitigation |
|---|---|---|---|
| Supabase 500 MB DB | ~50k–100k users of profiles + attempts | Writes fail | Enforced by §2.3 (no binaries); archive aged attempt rows to R2 as compressed JSON, retain aggregates |
| Supabase idle pause (~1 wk) | Pre-launch only | Project sleeps | Free scheduled Worker ping; irrelevant once daily traffic exists |
| Upstash 10k cmd/day | ~2,000 AI calls/day | Limiter degrades | Postgres counter fallback + per-user daily AI quota (wanted regardless) |
| Gemini free-tier RPM | Concurrent AI spikes | 429s | Prompt-hash caching (`STORE_AI_RESPONSES` exists); queue; heavy AI becomes a paid tier |
| **Firebase SMS quota** | ~10k OTPs/mo | OTP login fails | **Verify current India quota and pricing before building — Google has repriced phone auth.** Fallbacks: make OTP one of three auth paths (Google OAuth absorbs load), route overflow to email OTP at ₹0, or MSG91 free-tier trial. Never make SMS the *only* door. |
| R2 10 GB | Multi-branch full corpus | Uploads fail | Aggressive WebP/AVIF compression at ingest; the vision pipeline (8B) crops diagrams rather than storing full pages |
| Cloudflare Workers 100k req/day | ~10k+ graded submissions/day | Throttle | Batch grading; static content served by Pages, not Workers |
| Resend 3,000 mail/mo | ~3,000 signups/mo | Verification stops | Supabase SMTP; batch non-critical mail |

Every ceiling has a ₹0 answer. None forces a payment.

---

# PART III — THE RELEASE PLAN

> **Module notation:** Priority · Goal · Deliverables · Acceptance criteria · Cost · Depends on.
> Modules are dependency-ordered within a release. Releases follow Rule 3: **infrastructure and security → retention → monetization → community**.

---

## RELEASE 4 — FOUNDATION: INFRASTRUCTURE, DATA & IDENTITY
### *Make it commercial-legal, make it multi-user, make it safe.*

Nothing in Releases 5–9 is possible before this release completes. It converts RENYXERA from a single-device local tool on a non-commercial host into a legally monetizable multi-user platform.

---

### Module 4A · P0 · Cloudflare Migration — **EXECUTE FIRST**

**Goal.** Be legally permitted to earn money, and gain unlimited bandwidth and edge compute at ₹0.

**Deliverables**
- Verify Vercel Hobby non-commercial terms and Cloudflare's commercial-use position from live policy text; record the finding in the repo.
- Migrate to **Cloudflare Pages** via `@cloudflare/next-on-pages` (or OpenNext). Validate every surface: middleware, all three API routes, the service worker and PWA install, image optimisation, `next/font`, build reproducibility.
- Stand up **Cloudflare Workers** as the edge-compute target for Release 5's server-authoritative evaluation.
- Provision **Cloudflare R2** bucket for the Release 8 asset corpus; wire the CDN base URL as a single environment variable per §2.3.
- Move DNS, Web Analytics and Turnstile into the same Cloudflare account — one free control plane.
- Keep the Vercel deployment live as a rollback target until parity is proven, then decommission.

**Acceptance criteria**
- Full feature parity on Cloudflare, verified against the existing Playwright suite.
- Service worker and offline PWA behaviour unchanged.
- Hosting terms permit advertising **and** payments — in writing.
- Rollback path documented and tested.

**Cost:** ₹0 **Depends on:** nothing — **blocks all of Releases 6 and 7**

---

### Module 4B · P0 · Data Layer Migration — Static JSON → Supabase Postgres

**Goal.** Move the question bank out of a shipped static file into a queryable, access-controlled database — the precondition for answer-key withholding, multi-branch scale, and server-side evaluation.

**Deliverables**
- Supabase project; environment discipline enforced: `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` client-side; `SUPABASE_SERVICE_ROLE_KEY` **server-only, never under a `NEXT_PUBLIC_` prefix, never imported into a client component.** A CI grep fails the build if a service-role key appears outside `app/api/**` or `lib/server/**`.
- Migrate `data/Aggregated_Output.json` (975 questions / 15 papers) into Postgres with the **public/private split baked into the schema from day one** — this is what makes FINDING-3 fixable:

```sql
-- BRANCHES: multi-branch from the first migration, not retrofitted later
create table branches (
  code text primary key,                 -- 'CSE','ECE','EE','ME','CE','DA'
  name text not null,
  status text not null default 'coming_soon',  -- 'live' | 'coming_soon'
  question_count int default 0,
  sort_order int default 0
);

-- QUESTIONS: public half only. Safe to send to any client.
create table questions (
  id text primary key,                   -- GATE_CS_2026_FN_Q1
  branch_code text not null references branches(code),
  year int not null, session text, question_no int,
  question_type text not null,           -- MCQ | MSQ | NAT
  marks numeric not null,
  section text, subject text, topic text, difficulty text,
  question_text text not null,
  image_paths text[] default '{}',       -- RELATIVE PATHS ONLY (§2.3)
  created_at timestamptz default now()
);

-- OPTIONS: text only. is_correct deliberately absent.
create table question_options (
  question_id text not null references questions(id) on delete cascade,
  option_id text not null,               -- A|B|C|D
  text text not null,
  image_path text,                       -- relative path only
  primary key (question_id, option_id)
);

-- ANSWER KEY: private half. NEVER exposed to the anon role.
create table question_answers (
  question_id text primary key references questions(id) on delete cascade,
  correct_option_ids text[],             -- MCQ/MSQ
  nat_min numeric, nat_max numeric,      -- NAT range
  solution_text text,
  solution_image_paths text[] default '{}'
);

-- USER DATA
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique, display_name text,
  phone text unique, phone_verified boolean default false,
  avatar_seed text not null, avatar_style text not null default 'adventurer',
  target_branch text default 'CSE' references branches(code),
  target_year int, target_rank int, target_score numeric,
  daily_study_hours numeric default 2,      -- drives Goal Slider (4E)
  entitlements jsonb default '{}'::jsonb,   -- per-exam & pass grants (7A)
  daily_ai_calls int default 0, daily_ai_reset_at timestamptz,
  status text not null default 'active',    -- 'active'|'suspended'|'anonymized'
  created_at timestamptz default now(), updated_at timestamptz default now()
);

create table exam_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  branch_code text not null references branches(code),
  config jsonb not null,
  question_ids text[] not null,
  mode text not null default 'practice',    -- 'practice' | 'graded'
  server_started_at timestamptz not null,
  duration_seconds int not null,
  submitted_at timestamptz,
  server_score numeric, server_max numeric, -- server-computed truth only
  percentile numeric, air int,
  status text not null default 'in_progress',
  integrity_flags jsonb default '[]'::jsonb
);

create table exam_responses (               -- APPEND-ONLY
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references exam_attempts(id) on delete cascade,
  question_id text not null,
  selected_option_ids text[], nat_value numeric,
  time_spent_seconds int, marked_for_review boolean default false,
  created_at timestamptz default now()
);

create table user_question_state (
  user_id uuid not null references auth.users on delete cascade,
  question_id text not null references questions(id) on delete cascade,
  bookmarked boolean default false, mistake_count int default 0,
  last_seen_at timestamptz, note text,
  primary key (user_id, question_id)
);

create table branch_waitlist (              -- Module 4H "Notify Me"
  id uuid primary key default gen_random_uuid(),
  branch_code text not null references branches(code),
  email text, user_id uuid references auth.users on delete set null,
  created_at timestamptz default now()
);
```

- **RLS enabled on every table in the first migration. Default-deny.**
  - `questions`, `question_options`, `branches` → readable by `authenticated` and `anon` (public half; safe).
  - **`question_answers` → no policy for `anon` or `authenticated` at all.** Reachable only by the service role inside Edge Functions/Workers. This single line is the structural fix for FINDING-3: the answer key is not "hidden" from the client, it is **unreachable** by it.
  - `profiles`, `exam_attempts`, `exam_responses`, `user_question_state` → `auth.uid() = user_id`.
  - `exam_responses` → `INSERT` only; no `UPDATE`, no `DELETE` for users (append-only integrity).
- Migrations live in version control; the Supabase dashboard is never the source of truth.
- `profiles` row created by a Postgres trigger on `auth.users` insert — never by a client call that can be skipped or forged.
- Seed `branches` with all six codes: CSE `live`, ECE/EE/ME/CE/DA `coming_soon`.
- **Offline is preserved:** the public half syncs into IndexedDB for practice mode. Only graded mode requires the network. The local-first speed advantage is not traded away.

**Acceptance criteria**
- A query against `question_answers` with the anon key returns **zero rows** — proven by an automated test in CI, not by inspection.
- Service-role key absent from the built client bundle (CI grep over build output).
- All 975 questions render identically from Postgres as from the old JSON.
- Practice mode works fully offline after first sync.

**Cost:** ₹0 **Depends on:** 4A

---

### Module 4C · P1 · Authentication — Three Doors

**Goal.** Real accounts with the lowest possible friction for an Indian student on a mid-range Android phone.

**Deliverables**

**Three parallel auth paths — none of them is the only door:**

| Path | Rationale | Cost |
|---|---|---|
| **Google OAuth** | Engineering students overwhelmingly have a Google account already. Expected majority path; eliminates password-reset support load entirely. | ₹0 |
| **Mobile OTP (SMS)** | The single lowest-friction identity in India — many students trust a phone number over an email they rarely check. Firebase Auth SMS, bridged to Supabase via third-party JWT auth. | ₹0 within quota |
| **Email + password** | Fallback; required for institutional/college users (Release 8 B2B) and for anyone SMS fails for. | ₹0 |

- **Firebase↔Supabase bridge:** Firebase issues the phone-verified JWT; Supabase is configured to trust Firebase as a third-party auth provider so a single `profiles` row and one RLS model serve all three paths. **Do not** build two parallel user tables — one identity, three doors.
- **SMS quota discipline** (from §2.4): OTP is rate-limited per phone number *and* per IP *and* per device, gated by Turnstile, with resend cooldown and a hard daily cap. SMS is the one auth path with a real-world unit cost behind the free quota; an unprotected OTP endpoint is an attacker's way to burn it. Treat the OTP endpoint with the same seriousness as the AI route.
- Route protection at **middleware**, not in page components. Client-side redirects are UX, never the boundary.
- Session persistence across reloads; silent token refresh; "sign out everywhere" on credential change.
- Auth UI built in the existing glass/gradient design language — no default vendor widget.

**No-Account-Deletion Policy** *(mandate — implemented, with a compliance guard)*
- **No delete-account control anywhere in the user UI.** Retention metrics, historical testing telemetry, leaderboard integrity and fraud history are preserved. Attempt history in particular must survive, or ranks and percentiles become reconstructible fiction.
- ⚠️ **Compliance guard — deliberate, and not a softening of the policy.** India's DPDP Act grants a right to erasure, and Google Play policy requires an account-deletion path for listed apps (Module 9D). A hard "no deletion under any circumstances" with no path at all creates real legal and store-listing exposure that a free-tier product cannot absorb. The policy is therefore implemented as:
  - **UI: no deletion control.** Mandate satisfied literally.
  - **Legal backstop: a manual, support-request-only erasure path**, disclosed in the Privacy Policy, executed as **anonymization rather than deletion** — `profiles.status = 'anonymized'`, PII fields nulled, username replaced with an opaque token. **Attempt rows, scores and telemetry are retained in anonymized form.**
  - This preserves 100% of the analytics and anti-fraud value the mandate is protecting, while keeping us compliant. It is the strictly better version of the same policy.

**Acceptance criteria**
- All three auth paths converge on one `profiles` row; no duplicate identities.
- A protected route hit while logged out never returns the protected data in the network response.
- OTP endpoint survives a scripted abuse attempt without exhausting the SMS quota.
- No deletion control exists in any UI surface; the documented anonymization path works and retains attempt history.

**Cost:** ₹0 **Depends on:** 4B

---

### Module 4D · P1 · Guest Walkthrough / Teaser Mode

**Goal.** Let a visitor feel the product before being asked for anything — then convert them at the exact moment they want the thing that is locked.

Forcing signup before a student has experienced the product is the single largest conversion killer in edtech. Equally, an unlimited guest mode gives away the assets we intend to sell. The resolution is a **teaser**: full UI, real but bounded substance, contextual locks.

**Deliverables**

| Surface | Guest | Signed in |
|---|---|---|
| Full UI exploration, navigation, theming | ✅ | ✅ |
| Practice questions (capped sample set) | ✅ | ✅ full bank |
| Basic result screen | ✅ | ✅ |
| **Full mock exams** | 🔒 | ✅ |
| **AI Mentor** | 🔒 | ✅ |
| **Deep weakness analytics** | 🔒 | ✅ |
| **Subject leaderboards** | 🔒 | ✅ |
| Bookmarks / mistakes persistence | Local only, warned | ✅ synced |

- **Contextual signup triggers** — never a wall on arrival. The prompt appears at the moment of intent, and states what is being unlocked: *"Sign in to start a full 3-hour mock and get your All India percentile."* A modal on page load converts far worse than a lock on a button the user just chose to press.
- **Value-visible locks.** Locked features render **blurred-but-present** with a real preview — a guest must see the weakness heatmap they are missing, not an empty state. Desire precedes conversion.
- Guest data lives in the `renyxera-guest` IndexedDB namespace and is **migrated into the new account on signup**, never discarded. Losing a guest's 40 bookmarks at the exact moment they sign up is the worst possible first impression.
- Guest AI calls: zero, or a single hard-capped trial call behind Turnstile. Guests must not be a path around per-user AI quotas (4G).

**Acceptance criteria**
- A guest can navigate every screen without an account.
- Each locked feature shows a preview plus a contextual, specific unlock prompt.
- Guest → signup migrates all local data with zero loss and zero duplicates.

**Cost:** ₹0 **Depends on:** 4C

---

### Module 4E · P1 · Profile, Pre-Populated Avatars & the Dynamic Exam Goals Engine

**Goal.** An identity the user chose, at zero storage cost — and a goals section that **actually drives the product** instead of decorating it.

#### 4E-1 · Avatars — DiceBear, generated client-side

Uploaded photos would cost storage quota, bandwidth, a resize pipeline, EXIF handling, and an **image-moderation obligation on a platform used by minors**. Every one of those costs money or carries risk.

**DiceBear** (`@dicebear/core` + `@dicebear/collection`, MIT) generates avatars as **SVG in the browser from a seed string**:

| Property | Result |
|---|---|
| Storage | **Zero bytes** — we persist `avatar_seed` + `avatar_style`, never an image |
| Bandwidth | **Zero** — nothing fetched, generated locally |
| Offline | Works fully — matters for a PWA |
| Moderation risk | **Eliminated** — nothing can be uploaded |
| Variety | Effectively infinite, with no asset library to design or host |

Picker: 6–8 curated styles (`adventurer`, `bottts`, `notionists`, `thumbs`, `lorelei`, `micah`, `shapes`, `identicon`) with live previews, a "Shuffle" reroll, and a colour/accessory variation row — all instant, all offline.

#### 4E-2 · The Dynamic Exam Goals Engine *(mandate — goals must drive behaviour)*

The four goal fields are **inputs to the existing Focus Target and Goal Slider algorithms**, not stored strings. This is the difference between a profile form and a coaching product.

| Field | What it actually drives |
|---|---|
| **Target GATE Year** | Days-remaining countdown → syllabus pacing; compresses or expands the study plan; weights recent-year PYQs higher as the date nears |
| **Target Branch** | Question pool scoping; subject weightage model; which leaderboards the user appears on (multi-branch ready from 4B) |
| **Target Rank / Score** | Sets the **Focus Target percentage automatically** instead of the user guessing a slider value. A target of AIR 500 implies a required accuracy and coverage profile; the engine derives the focus band from it and re-derives after every graded attempt. |
| **Daily Study-Hour Target** | Sizes the daily question set and session length; drives streak definitions, reminder cadence, and the "you are N hours behind" signal |

- **Closed loop:** every graded attempt updates the mastery model, which re-derives the recommended focus band, which changes tomorrow's question set. The Goal Slider stops being a manual control the user fiddles with and becomes a **recommendation with a manual override**.
- **Feasibility feedback:** if the target rank and the days remaining and the daily hours are mutually impossible, the profile says so honestly and proposes the nearest achievable target. Honesty here builds more trust than flattery.

#### 4E-3 · Profile surface

`/profile` sections: **Identity** (unique username validated server-side against reserved/profanity lists, display name) · **Avatar** (4E-1) · **Exam Goals** (4E-2) · **Preferences** (theme, default duration, notifications, reduced motion) · **Stats** (attempted, accuracy, streak, hours, tests — the emotional payload that brings people back) · **Achievements** (Module 9B) · **Account** (email/phone, linked providers, active devices, export my data). **No Danger Zone, no delete control** (4C).

**Acceptance criteria**
- Choosing an avatar writes only a seed string — verified by inspecting the row; no binary, no external URL.
- Avatar renders identically offline, after a cold PWA start, in both themes.
- Changing Target Rank **measurably changes the next recommended question set** — demonstrated in a test, not asserted.
- Username uniqueness enforced by a database constraint, not a client check.

**Cost:** ₹0 **Depends on:** 4C

---

### Module 4F · P0 · Per-User Isolation & Device Sessions *(fixes FINDING-4)*

**Goal.** Deliver true separate sessions per user at both layers: separate **data** and separate **devices**.

#### 4F-1 · Storage isolation

| Approach | Mechanism | Verdict |
|---|---|---|
| **Per-user database** | `openDB(\`renyxera-${userId}\`, …)` | **MANDATED** — isolation becomes structural, not query-dependent. There is no query that *can* leak, because the other user's data is in a different database. No keyPath migration needed across the 12 stores. Sign-out wipe is one `deleteDB` call. |
| Composite keys `[userId, questionId]` | One DB, schema version bump | Rejected — migrates all 12 stores and leaves leakage a query bug away |

- `idb-manager.ts` takes the active user id and opens the namespaced database. Guests use `renyxera-guest`.
- **Sign-out must reset all 10 Zustand stores.** A fresh database with stale in-memory state still shows user A's analytics to user B. This is the easy bug to ship here — it gets an explicit test, listed store by store: `analytics, calendar, data, exam-runtime, exam, goal-slider, study, toast, todo, ui`.
- Account switching without a page reload must be safe by construction.

#### 4F-2 · Device sessions

- Device sessions table: label, browser, approximate location, last seen — surfaced in Profile → Account → **Active Devices**, with "sign out this device" and "sign out everywhere."
- **Release 4 policy: multi-device allowed, all sessions visible, no enforcement.** Enforcement is a paid-tier anti-sharing control and belongs in Module 7D, where it protects revenue. Enforcing it on free users now generates support pain for zero benefit.
- Idle expiry; forced re-auth on credential change.

**Acceptance criteria**
- Two accounts used sequentially in one browser: account B sees **zero** bookmarks, mistakes or attempts from account A — verified in the UI *and* by listing IndexedDB databases in DevTools.
- Sign out → sign in as a different user → no stale state in any of the 10 stores.
- "Sign out everywhere" invalidates every listed session.

**Cost:** ₹0 **Depends on:** 4C

---

### Module 4G · P0 · API Hardening *(fixes FINDING-1 and FINDING-2)*

**Goal.** Close the live, exploitable hole. **The validation half of this module ships before everything else in this document** — it needs no Supabase and no auth.

**Deliverables — Phase 1, immediate (no dependencies)**
- **Zod schema validation** on `/api/ai/generate`: body shape, prompt max length, type enforcement.
- **Server-owned system-instruction enum.** The client sends a *key* (`"mentor" | "explain" | "generate_questions" | …`); the server maps it to instruction text held in server-only code. A client-supplied instruction string is rejected outright. This closes the prompt-injection and brand-safety exposure, not merely the cost one.
- Response size caps, request timeouts, and structured logging (route, outcome, latency, caller key).

**Deliverables — Phase 2, after auth**
- **Supabase JWT verification required.** Anonymous callers receive 401 and **no Gemini call is made**.
- **Upstash Redis rate limiting keyed on `user_id`** — never on IP (CGNAT, §1.2 FINDING-2). Replaces the in-memory limiter for this route.
- **Per-user daily quota enforced in Postgres** (`profiles.daily_ai_calls`, `daily_ai_reset_at`) so it survives Redis eviction and cannot be bypassed by key rotation. This is also the natural upsell surface for the ₹99 AI Mentor add-on (7A).
- **Server-side prompt-hash response cache** mirroring the existing client `STORE_AI_RESPONSES` — repeated identical questions cost zero quota.
- **Cloudflare Turnstile** on signup, login, password reset **and OTP request** — scripted account creation is otherwise the trivial route around per-user quotas.
- Reprioritise the existing limiter: keep it on `/api/dataset` and `/api/image-manifest`, but the expensive route now carries the strongest controls.

**Acceptance criteria**
- Unauthenticated POST to `/api/ai/generate` → 401, zero Gemini calls.
- A client-supplied `systemInstruction` string outside the server enum → 400.
- A single account exceeding its daily quota is refused by the database counter across concurrent serverless instances.
- 100 scripted signups blocked by Turnstile.

**Cost:** ₹0 **Depends on:** Phase 1 none; Phase 2 on 4C

---

### Module 4H · P1 · Multi-Branch Teaser & Waitlist *(immediate UI, backend in Release 8)*

**Goal.** Capture demand for ECE/EE/ME/CE/DA **now**, months before the data exists — at near-zero engineering cost.

Shipping the selector early is deliberate: it converts a gap in our catalogue into a **free, compounding acquisition asset**. A student who searches "GATE ECE PYQ" and finds a branch page with a waitlist becomes a launch-day user instead of a bounce.

**Deliverables**
- Branch selector in onboarding and Profile → Exam Goals showing all six branches, driven by `branches.status` (4B). CSE selectable; the other five carry a **"Coming Soon"** badge.
- **"Notify Me" trigger** on each unreleased branch → writes to `branch_waitlist` (email for guests, `user_id` for members). Instant confirmation; no dead-end.
- Waitlist counts visible internally — **they are the prioritisation signal for Release 8.** We build the branch the market asked for, not the one we guessed.
- Public landing pages per branch (`/gate-ece`, `/gate-da`, …) — indexable from day one, feeding Release 6's SEO engine while the data pipeline is still being built.
- Automated launch email to the waitlist when a branch flips to `live`.

**Acceptance criteria**
- All six branches visible; five clearly marked Coming Soon and non-selectable as a target.
- "Notify Me" persists for both guests and members and confirms immediately.
- Branch landing pages are statically generated and indexable.

**Cost:** ₹0 **Depends on:** 4B

---

### Module 4I · P2 · Cloud Sync

**Goal.** Progress follows the user across devices without surrendering local-first speed.

**Design principle:** IndexedDB remains the **read path** — the UI never waits on the network. Supabase is the durable mirror and the cross-device channel. Offline capability is a genuine differentiator for students on unreliable connections and is not traded away for sync.

**Deliverables**
- Sync status model: `Offline / Pending / Syncing / Synced / Conflict / Failed`, surfaced as a small non-intrusive indicator.
- **`exam_responses` are append-only** — never updated in place, never client-deleted. Correctness property *and* the foundation of Release 5's integrity model.
- Conflict resolution: last-write-wins for preferences; union-merge for bookmarks; max for counters; **server-wins unconditionally for anything score-related.**
- Durable sync queue surviving browser close; exponential backoff; manual "Sync now" and "Export my data (JSON)".

**Acceptance criteria**
- Bookmark on phone → appears on laptop within one sync cycle.
- Airplane mode: app fully usable; queued writes flush on reconnect with no duplicates.
- Killing the browser mid-sync loses nothing.

**Cost:** ₹0 **Depends on:** 4B, 4F

---

### Release 4 — Definition of Done

- [ ] Running on Cloudflare Pages/Workers; commercial use permitted; Vercel decommissioned
- [ ] R2 provisioned; CDN base URL configurable; **no binary assets in Postgres, no GitHub raw URLs**
- [ ] 975 questions in Postgres with the public/private split; `question_answers` unreachable by anon/authenticated (CI-proven)
- [ ] Google OAuth + Mobile OTP + Email/Password all converge on one identity
- [ ] No account-deletion control in any UI; anonymization backstop documented and working
- [ ] Guest teaser mode with contextual locks and lossless signup migration
- [ ] Profile with DiceBear avatars storing only a seed
- [ ] Exam Goals measurably drive Focus Target and Goal Slider
- [ ] Per-user IndexedDB namespacing; all 10 Zustand stores reset on sign-out; no cross-account bleed
- [ ] Active Devices list + sign out everywhere
- [ ] `/api/ai/generate` authenticated, zod-validated, server-enum-instructed, user-ID rate-limited, quota-enforced
- [ ] Six branches visible; five Coming Soon with working waitlist
- [ ] Service-role key absent from client bundle (CI-enforced)

---

## RELEASE 5 — EXAM INTEGRITY: THE HACKER-PROOFING RELEASE
### *Make a score mean something to a room full of people who can read your bundle.*

Our users are the exact demographic most capable of, and most motivated by, defeating a client-side exam engine. This release assumes they will try, and removes the possibility rather than obscuring it.

---

### Module 5A · P0 · Answer Key Withholding *(fixes FINDING-3)*

**Goal.** The correct answer must not exist in the browser during a live graded test — not hidden, not obfuscated, **not present**.

The schema from 4B already enforces this at the database layer. This module enforces it at the delivery layer.

**Deliverables**
- **Graded-mode payload contains exactly:** `question_id`, `question_text`, `option_id` + `text` per option, `marks`, `question_type`, `image_paths`. Nothing else.
- **Never transmitted in graded mode:** `is_correct`, `correct_option_ids`, `nat_min`/`nat_max`, `solution_text`, `solution_image_paths`.
- Obfuscation is explicitly rejected as a strategy — encrypted blobs, shuffled keys, checksum tricks. Anything the client can decrypt, the client can be made to reveal. **The key simply is not sent.**
- **Practice mode keeps instant feedback and full offline capability.** Immediate feedback is pedagogically valuable and practice is not competitive. The modes are visually distinct — a clear **Graded** vs **Practice** badge — so the difference is a stated product decision, never a silent degradation.
- Offline graded attempts: permitted, queued, **evaluated on reconnect**, shown as "Pending evaluation" — never a fabricated local score.

**Acceptance criteria**
- In a graded attempt, no answer-bearing field appears in any network response, any IndexedDB record, or any JS heap object before submission — verified by DevTools inspection **and** an automated check in CI.
- Practice mode retains instant feedback offline.

**Cost:** ₹0 **Depends on:** 4B

---

### Module 5B · P0 · Server-Authoritative Evaluation

**Goal.** Remove the client's ability to invent a score, a duration, or a submission.

Today `components/exam/exam-timer.tsx` derives remaining time from a client-held `elapsedSeconds` in a Zustand store and auto-submits at zero. A console edit defeats it. Total duration is computed client-side from question marks. All of it moves.

**Deliverables**
- **Attempt token issued server-side on start:** `{ attempt_id, server_started_at, duration_seconds, question_ids[], nonce }`, signed and persisted in `exam_attempts`.
- The client timer becomes a **display** driven by the server start time and duration, reconciled on each sync tick. Tampering changes the pixels, not the deadline.
- **Evaluation runs on Cloudflare Workers or Supabase Edge Functions** with the service role — the only context that can read `question_answers`.
- **The client submits only `{ attempt_id, [{ question_id, selected_option_ids | nat_value, time_spent_seconds }] }`.** It submits selections. It never submits a score.
- Server validates on submit: is this attempt open, within `duration + grace`, does the question set match the token, has it already been submitted?
- `exam_attempts.server_score` is **the only score** that may appear in analytics, on a leaderboard, or on a certificate.
- Idempotent submission — a double-tap or network retry cannot create two attempts or two scores.
- Late submissions accepted inside a grace window (network reality in India is not negotiable); flagged beyond it.

**Acceptance criteria**
- Editing `elapsedSeconds` in the console does not extend the real deadline.
- A replayed, forged, or score-bearing submission payload is rejected.
- Server and honest-client scores agree across a 100-attempt regression suite.
- Answer key never leaves the Worker/Edge Function boundary.

**Cost:** ₹0 **Depends on:** 5A, 4A

---

### Module 5C · P1 · Attempt Integrity Signals

**Goal.** Protect leaderboard credibility without turning the product into spyware.

**Stated position:** we will **not** build webcam proctoring, screen recording, or keystroke surveillance. They are expensive, hostile, destroy trust with a student audience, and carry serious privacy obligations. We collect cheap behavioural signals, disclose them plainly, and use them narrowly.

**Deliverables**
- Signals written to `exam_attempts.integrity_flags`, **graded attempts only**: tab/window blur count and time away; answers faster than a per-difficulty floor; accuracy statistically inconsistent with the user's own history; copy/paste and devtools-open events (best-effort); multiple concurrent attempts on one account.
- **Transparency requirement:** before a graded attempt begins, a plain-language notice states exactly what is monitored. No hidden collection, ever.
- Graded attempts declared **full-screen recommended, single-tab**, with a soft warning rather than a hard block.
- Flagged attempts are **excluded from leaderboards, never deleted** — the user keeps their full analysis and is told why.
- **Shadow-flag first.** Run signals silently for a full cycle and tune thresholds against real data before any enforcement. A false accusation costs far more than an undetected cheat.

**Acceptance criteria**
- Signals recorded in graded mode only, never in practice.
- Disclosure notice precedes any collection.
- A flagged user still sees their complete performance analysis.

**Cost:** ₹0 **Depends on:** 5B

---

### Module 5D · P1 · Question Bank Protection

**Goal.** Make wholesale scraping uneconomic without harming legitimate offline use.

**Deliverables**
- No single request returns the whole bank. Paginate and scope to what the user is actually doing.
- Per-account fetch-volume limits (Upstash) with anomaly alerting on outliers.
- Free tier receives a capped working set; full-bank offline download is a paid entitlement — serving security and monetization with one control.
- R2/CDN hotlink protection on images (free on Cloudflare).
- Invisible per-account watermarking of served question sets, so a leaked dump is traceable to an account.
- ToS clause prohibiting scraping and redistribution — required for AdSense regardless (§5.1).

**Reality check:** anything rendered in a browser can be copied by a determined person. The goal is to raise cost, not achieve the impossible. **Do not over-invest here at the expense of Release 6.**

**Cost:** ₹0 **Depends on:** 5A

---

### Module 5E · P1 · Leaderboards & All-India Test Series *(Community Phase A)*

**Goal.** Cash in the integrity work. This is the highest-retention feature class in competitive-exam products — and it is only credible after 5A–5C.

**Deliverables**
- **Scheduled All-India Mock Tests** — a common attempt window, results released together. The synchronised format is what creates the event, the sharing, and the WhatsApp-group traffic spike.
- **Real-time percentile and AIR**, server-computed; subject-wise comparison against the cohort.
- Leaderboards: All-India, **subject-wise**, college-level, friends. Opt-in, with a privacy toggle and the option to appear under a username rather than a real name.
- **Branch-scoped** from the start (4B) — no rework when Release 8 lands.
- Streaks, weekly challenges, topic ladders.
- **Shareable result cards** generated client-side. This is a free growth engine, not vanity: every card shared into a GATE group is an impression in front of exactly our target user.
- Flagged attempts silently excluded from ranking.

**Acceptance criteria**
- 1,000 simultaneous submissions rank correctly within free-tier limits.
- No client-side action can alter a rank.

**Cost:** ₹0 **Depends on:** 5B, 5C

---

## RELEASE 6 — MONETIZATION I: CONTENT ENGINE & ADVERTISING
### *Income from traffic, the way news sites earn it.*

---

### 6.0 The arithmetic, stated before any effort is spent

Display advertising pays per thousand page views (RPM). For **Indian education traffic**, realistic RPM is roughly **₹15–₹80**.

| Monthly page views | Realistic monthly ad revenue |
|---|---|
| 10,000 | ₹150 – ₹800 |
| 50,000 | ₹750 – ₹4,000 |
| 200,000 | ₹3,000 – ₹16,000 |
| 1,000,000 | ₹15,000 – ₹80,000 |

Three consequences shape this entire release:

1. **Ads are a volume business.** They do not pay meaningfully below ~100k monthly page views. Meanwhile **340 students buying one ₹29 exam is ₹9,860** — revenue that would otherwise require roughly 500,000 ad page views.
2. **An app shell generates almost no page views.** A student doing a 3-hour mock produces *one* page view on an SPA. **Content pages** generate the volume ads need. This is precisely why news sites earn from ads and apps do not.
3. **Therefore the content engine (6A) is not an accessory — it is the product change that makes ad revenue exist at all.** Ad code without it earns approximately nothing.

> **Strategic conclusion:** ads are a **long-horizon compounding asset built on the SEO surface**, monetizing the ~90% who will never pay. **Pay-per-exam (Release 7) carries near-term revenue.** Do not reverse this order — but do not skip ads either, because they are the only way the free majority ever produces income.

---

### Module 6A · P1 · The Content & Programmatic SEO Engine

**Goal.** Build the indexed, crawlable, high-page-view surface that both ad revenue and organic acquisition depend on.

We already own the raw material: **975 questions with subject, topic, difficulty and solutions** — thousands of genuinely useful pages nobody has to invent.

**Deliverables**
- **Programmatic pages**, statically generated from Postgres:
  - `/questions/[id]` — one page per question with full solution, related questions, topic context (~975 at launch, ~5,000 after Release 8)
  - `/subject/[subject]` — 18 CSE subject hubs: syllabus, weightage analysis, recommended sequence
  - `/topic/[topic]` — PYQ counts and trend data
  - `/pyq/gate-[branch]-[year]` — year-wise paper analysis
  - `/syllabus/gate-cse-2027` — the highest-intent query in the niche
  - `/gate-ece`, `/gate-da`, … — branch landing pages from 4H, live before the data is
- **Editorial content** against real search demand: preparation strategy, cutoff analysis, 6-month plans, book recommendations, GATE-vs-placement.
- **Genuine value on every page.** AdSense rejects thin auto-generated pages and Google's helpful-content systems demote them. **Programmatic must not mean empty** — every page carries analysis worth reading with no ads on it.
- Technical SEO: SSG/ISR, `sitemap.xml`, `robots.txt`, canonicals, OpenGraph/Twitter cards, `Article` + `FAQPage` + `Quiz` structured data, a Core Web Vitals budget.
- **Free tools as link magnets:** rank predictor, score calculator, normalisation calculator, college predictor, study-plan generator. These earn backlinks better than articles and are themselves high-page-view, ad-friendly pages.

**Acceptance criteria**
- 1,000+ indexable pages with substantive unique content.
- Lighthouse SEO ≥ 95; Core Web Vitals green.
- Sitemap submitted; indexing confirmed in Search Console.

**Cost:** ₹0 **Depends on:** 4A, 4B, 5A (solutions must be server-held before they are published)

---

### Module 6B · P1 · Legal Pages & Ad Network Onboarding

**Goal.** Get approved — which takes longer than expected and has hard prerequisites.

**AdSense prerequisites, all mandatory:** substantial original content (6A — applying first means near-certain rejection) · Privacy Policy, Terms, About, Contact · clear navigation, no under-construction sections · 18+ account holder · review typically days to weeks, rejection common, re-application permitted after remediation.

**Deliverables**
- **Legal pack, written once, used three times** (AdSense + Razorpay + DPDP): Privacy Policy (naming every data type including 5C integrity signals and the 4C anonymization path), Terms of Service (incl. anti-scraping), Cookie Policy, About, Contact, **Refund & Cancellation Policy (§4.4)**, Disclaimer ("not affiliated with any IIT or the GATE organising institute" — easy to forget, important to have).
- AdSense application **after** the content engine is live.
- **Fallbacks:** Ezoic (lower entry bar, often better optimisation at small scale), Media.net, AdPushup. **Never depend on a single network.**
- **Direct sponsorships as a parallel track from day one** — coaching institutes, publishers, laptop brands, hostel and study-abroad services. They pay far better per impression than programmatic and can be sold at low traffic. **One direct sponsor can exceed months of AdSense revenue at our early scale.**

**Cost:** ₹0 **Depends on:** 6A

---

### Module 6C · P1 · Ad Placement Architecture

**Goal.** Earn from ads without damaging the experience that produces paying users.

**Hard rules — non-negotiable:**

| Rule | Reason |
|---|---|
| **Zero ads during an active exam** | Breaking concentration in a 3-hour mock is the fastest way to lose a serious user. Also an integrity vector. |
| **Zero ads for Pro Test Plan and AI Mentor subscribers** | "Ad-free" is a headline benefit of the ₹49 tier. Its value must be real. |
| **Ads permitted on Basic ₹29 plan** | This is the explicit trade: Basic is cheaper *because* it is ad-supported. Disclosed at checkout. |
| **No ads on auth, checkout or payment flows** | Conversion and trust. |
| **Layout-reserved slots** | CLS damage hurts SEO — the very traffic ads depend on. |
| **Lazy-load below the fold** | Protects Core Web Vitals. |
| **No interstitials on core app routes** | Content pages only, if at all. |

- **`<AdSlot>` component:** entitlement-aware (renders nothing for ad-free tiers), route-aware (renders nothing in `/exam/session`), consent-aware, reserved-height, lazy-loaded, graceful on no-fill.
- **Service-worker interaction must be tested** — our SW is network-first with caching; ad scripts must be excluded from caching or fill and reporting break.
- Consent management for DPDP/GDPR; **non-personalised ads for users under 18** (§5.2).
- A/B framework measuring ad revenue **against** paid conversion and retention. Be willing to remove a unit earning ₹200/month that costs a ₹49 purchase.

**Acceptance criteria**
- Ad-free entitlement holders trigger zero ad network requests.
- CLS < 0.1 with ads live.
- No ad renders on `/exam/session` under any condition.

**Cost:** ₹0 **Depends on:** 6B

---

## RELEASE 7 — MONETIZATION II: PAY-PER-EXAM, PASSES & ANTI-MISUSE
### *Disruptive micro-pricing for a price-sensitive market.*

---

### Module 7A · P1 · The Tier & Entitlement Model

**Goal.** Price below the psychological threshold where a student deliberates. ₹29 is less than a coffee; the decision is reflexive, not considered.

**The strategic bet:** competitors sell ₹2,000–₹15,000 courses. We sell **individual exams at ₹29**. This trades margin per transaction for **volume, reach, and a near-zero barrier to first purchase** — and first purchase is the hardest conversion in the funnel. Every subsequent sale to that user is far easier.

| Product | Price | Includes |
|---|---|---|
| **Basic Test Plan** | **₹29 / exam** | Full mock exam access, server-graded score, AIR & percentile, basic analysis. **Ad-supported (non-intrusive display).** |
| **Pro Test Plan** | **₹49 / exam** | Everything in Basic + **100% ad-free** + advanced analytics (weakness heatmap, time-per-question, comparative subject breakdown, rank projection) |
| **AI Mentor Add-On** | **₹99 / month** | Tiered AI quota — personalised doubt resolution, step-by-step derivations, adaptive plan generation. Quota tiers priced above the base. |
| **Season Pass (All-Access)** | **₹199** | **Peak-window instrument (Sept–Jan).** All mocks in the season, ad-free, full analytics. The cash-flow product — see §4.3. |
| **Free** | ₹0 | Practice bank (capped), 2 free mocks, basic analytics, ads, leaderboard participation |

**Deliverables**
- **Entitlements stored server-side** in `profiles.entitlements` (jsonb): per-exam grants, pass validity windows, AI quota tier. **Every gated action re-checks server-side.** A client-side `tier === 'pro'` check is a UI hint, never a gate (Rule 2).
- Entitlement checks live inside the same Edge Function that evaluates the exam — a user cannot obtain a graded score without a valid grant, because grading and entitlement are the same server call.
- Upgrade path inside a Basic attempt: "Remove ads and unlock deep analytics for ₹20 more" at the results screen, when the value is most visible.
- Graceful degradation at quota limits — a warm upsell, never a hard wall mid-task.
- **Bundling nudges:** after a user's third individual ₹29 purchase, surface the ₹199 pass with the arithmetic shown plainly. Honest maths converts better than urgency.

**Cost:** ₹0 **Depends on:** 4C

---

### Module 7B · P1 · Payments — Razorpay, UPI-First

**Goal.** Take ₹29 from a student with as close to zero friction as the rails allow.

**Deliverables**
- Razorpay integration, **UPI first**, then cards, netbanking, wallets. UPI is how this audience pays; a card-first checkout loses most of them.
- **Micro-transaction viability:** UPI P2M MDR is currently nil under Indian regulation, which is what makes a ₹29 price point economically sane. **Confirm Razorpay's actually-applied rate for our account before launch** — the pricing tiers in 7A assume near-zero MDR on UPI. If a platform fee applies, the ₹199 pass and bundling become proportionally more important.
- One-time payments for per-exam and pass purchases; Razorpay Subscriptions for the ₹99 AI Mentor recurring mandate.
- **Server-side webhook is the sole source of truth** for entitlement changes. A client-side success callback is never trusted. Signature verification on every webhook; idempotent processing.
- Invoicing, GST handling, payment-failure recovery and dunning for the recurring add-on.

#### The No-Refunds / No-Cancellations Policy *(mandate — implemented, with the wording that makes it enforceable)*

- **Policy: no refunds and no cancellations.** Disclosed at three points: the in-app checkout screen (with an explicit acknowledgement checkbox), the Razorpay payment page description, and the Refund & Cancellation Policy page.
- **Justification is genuine and should be stated plainly to users:** exam content, the answer key and the full analysis are delivered instantly and irreversibly on purchase. This is standard and accepted for instantly-delivered digital goods.
- ⚠️ **Two wording constraints — these protect the policy, they do not weaken it:**
  1. **Razorpay requires a published refund/cancellation policy.** "No refunds" is permitted; **having no policy page at all is not.** The page is mandatory for onboarding.
  2. **For the ₹99 recurring mandate, "no cancellation" cannot mean "the user cannot stop future billing."** Under the RBI e-mandate framework a user can always revoke a UPI AutoPay mandate at their bank, and advertising otherwise invites a Razorpay account review — an existential risk to the only revenue rail we have. **Correct enforceable wording:** *"No refunds. Cancellation stops future renewals only; no pro-rata refund is issued and access continues to the end of the paid period."* This is the same commercial outcome, stated in a way that survives scrutiny.
- **Chargeback posture:** card networks permit disputes regardless of our policy; UPI disputes are materially harder to raise. This is a second, independent reason to drive UPI as the default rail.

**Cost:** ₹0 upfront **Depends on:** 4A (commercial hosting), 7A

---

### Module 7C · P1 · Subscription & Purchase Abuse Prevention

**Goal.** Protect revenue without punishing honest buyers.

**Deliverables**
- Server-side entitlement verification on every paid action — restated because it is the control that matters most.
- **Micro-payment fraud patterns** specific to a ₹29 price point: card-testing (many small transactions on rotating cards), velocity limits per account and per payment instrument, blocked disposable-email domains.
- **Content-extraction abuse:** because there are no refunds, the refund-abuse vector largely closes — but purchase-then-mass-scrape remains. Flag accounts whose fetch volume after a single ₹29 purchase is wildly disproportionate (ties to 5D watermarking).
- Turnstile on checkout initiation.
- Admin review dashboard — a human must be able to see and act.

**Cost:** ₹0 **Depends on:** 7B

---

### Module 7D · P1 · Account-Sharing Prevention

**Goal.** Stop one ₹199 pass serving a WhatsApp group of forty. This is the largest revenue leak in Indian edtech, and the control already exists in our schema.

**Deliverables**
- **Two-device limit on paid entitlements**, enforced server-side. **Two, not one** — students genuinely use a phone and a laptop; a one-device limit generates constant legitimate complaints and support load we cannot staff.
- Netflix-style behaviour: a third device shows *"You're signed in on 2 devices"* with a chooser to sign one out. Never a silent failure.
- Concurrent-session detection: one account taking two graded tests simultaneously from different regions is a hard signal.
- Device-change cooldown to block credential rotation through a group.
- Escalation ladder: warn → force re-auth → temporary lock → manual review. **Never auto-ban a paying customer** — and with no refunds, a wrongly locked buyer is a guaranteed public complaint.

**Cost:** ₹0 **Depends on:** 4F-2

---

### Module 7E · P2 · Referral & Growth Loops

**Goal.** Compound acquisition without an advertising budget — because there is none.

**Deliverables**
- Referral: both sides receive a **free exam credit** (not a discount — a credit converts better and costs us nothing at ₹0 marginal delivery cost). Attribution via a profile code.
- Shareable achievements: result cards, AIR cards, streak milestones — pre-formatted for WhatsApp and Instagram Stories, where this audience lives.
- **College ambassador programme:** free Season Pass + leaderboard status for verified campus reps.
- Study-group invitations — a social hook with an acquisition side effect.
- Early-user testimonials exchanged for exam credits.

**Cost:** ₹0 (paid in product, not cash) **Depends on:** 7A

---

## RELEASE 8 — MULTI-BRANCH EXPANSION & REVENUE DIVERSIFICATION
### *The cheapest available multiplier on total addressable market.*

The exam engine is **branch-agnostic**. Only the dataset changes. This is the highest-leverage growth work in the entire plan: the same code, roughly five times the audience.

---

### Module 8A · P1 · Vision-Based PDF Extraction Pipeline

**Goal.** Convert past-paper PDFs for ECE, EE, ME, CE and DA into structured database seeds — automatically, at ₹0.

Manual transcription of five branches × 10+ years × ~65 questions is roughly 3,000+ questions with diagrams. It is not feasible by hand. **Gemini's free-tier vision capability makes it feasible by machine.**

**Pipeline stages**
1. **Ingest** — source official past papers as PDFs; page-split; render pages to images.
2. **Vision extraction** — Gemini vision per page, returning structured JSON: `question_no`, `question_text` (LaTeX-preserved for mathematical notation), `question_type` (MCQ/MSQ/NAT), `marks`, `options[]`, `has_diagram`, diagram bounding boxes.
3. **Diagram cropping** — crop each detected diagram from the page image, compress to WebP/AVIF, upload to **R2 under a deterministic relative path** (`images/ece/2023/q42-circuit.webp`). **Only the relative path is written to the database (§2.3).** Cropping rather than storing full pages is what keeps us inside the 10 GB R2 ceiling.
4. **Answer-key extraction** — parse official answer keys into `question_answers`. Separate stage, separate table, never merged into the public payload.
5. **Classification** — Gemini assigns subject, topic and difficulty against the branch syllabus taxonomy, enabling Focus Target and the Goal Slider on day one for the new branch.
6. **Human validation gate** — a review UI for spot-checking. **Mandatory.** A wrong answer key in a paid, ranked product is a trust-destroying defect, and vision models do misread mathematical notation. Nothing goes `live` unvalidated.
7. **Publish** — flip `branches.status` to `live`; fire the 4H waitlist launch email.

**Deliverables**
- Repeatable, resumable, rate-limit-aware pipeline scripts (Gemini free-tier RPM is the binding constraint — the pipeline runs over days, not minutes, and must checkpoint).
- Validation dashboard with accept/edit/reject per question.
- Extraction quality metrics per batch.

**Sequencing:** branch order is decided by **`branch_waitlist` counts from Module 4H** — build what the market asked for. DA is a reasonable early bet (new, fast-growing, underserved by incumbents, and closest to our existing CS taxonomy), but the waitlist decides, not intuition.

**Acceptance criteria**
- ≥95% extraction accuracy on a validated sample before a branch goes live.
- Every diagram in R2 under a relative path; **zero binaries in Postgres**.
- A new branch goes live with full Focus Target / Goal Slider support and no code changes.

**Cost:** ₹0 **Depends on:** 4B, 4H

---

### Module 8B · P2 · Revenue Diversification — Seven More Lines

Ads and per-exam sales are lines one and two. Ordered by effort-to-return at our scale:

| # | Stream | Mechanism | Realistic contribution | Effort |
|---|---|---|---|---|
| 1 | **Direct sponsorships** | Coaching institutes, publishers, laptop brands buy placements and newsletter slots directly | ₹5k–50k/mo once traffic is real | Low tech, high sales |
| 2 | **Affiliate** | Amazon Associates India on book pages; course and gadget affiliates | ₹2k–20k/mo at moderate traffic | Low |
| 3 | **Digital products** | Formula sheets, condensed notes, topic-wise PYQ compilations, last-month revision packs | ₹49–199 each, high margin; converts non-subscribers | Medium |
| 4 | **B2B / college licences** | Batch access sold to colleges and coaching centres (50–500 seats) | **Largest per-deal line** — one college can exceed 300 individual ₹29 sales | High sales, medium tech |
| 5 | **Sponsored content** | Clearly labelled sponsored articles on the 6A surface | ₹3k–15k per placement | Low |
| 6 | **Job / internship board** | Companies pay to reach final-year CSE/ECE students | Later stage | Medium |
| 7 | **Mentorship marketplace** | Paid AIR-holder doubt sessions, revenue-shared | Medium | High ops |

**An eighth, handled carefully:** aggregate, fully anonymised insight reports ("GATE CSE 2027 preparation trends"). Only aggregated, never individual, never without an explicit Privacy Policy basis. Likely more valuable as **free PR earning backlinks** than as a product.

**Sequencing:** 1, 2 and 3 need almost no new engineering and start as soon as 6A has traffic. **Line 4 is where the largest money is**, and it needs Release 5's test series to be credible.

**Cost:** ₹0 **Depends on:** 6A, 5E

---

## RELEASE 9 — PRODUCT DEPTH & CONTROLLED COMMUNITY
### *Retention is what makes every revenue line above actually work.*

---

### Module 9A · P1 · Adaptive Learning Engine

Spaced repetition (SM-2 or FSRS) over the existing mistakes store; automatic weak-topic detection; a daily adaptive set; a per-topic mastery model feeding the 4E-2 Goals Engine.

**Highest-impact module in this release.** It converts RENYXERA from a question bank into a coach — which is the entire justification for the ₹99 AI Mentor tier and the strongest defence against a competitor who simply has more questions.

### Module 9B · P1 · Gamification & Habit

Streaks with freeze days, XP and levels, badges surfaced on the profile (4E-3), daily goals, weekly challenges, study-time leaderboards. Cheap to build, disproportionate effect on daily active use — and daily active use is what makes ad inventory worth anything.

### Module 9C · P2 · Controlled Community *(Community Phase B)*

A peer doubt-solving forum — **launched only with moderation infrastructure in place, never before.** An unmoderated student forum becomes a liability within weeks, and we cannot staff human moderation at ₹0.

**Required before a single thread opens:**
- **Automated language moderation and toxicity scoring** on every submission, pre-publication. A free-tier classifier (Gemini, or an open toxicity model) scores content; above threshold it is held, not published.
- **Enforced Terms of Service** with a clear, specific code of conduct.
- Rate limits on posting; new accounts restricted; **reputation gating** — the right to post freely is earned through verified activity.
- User reporting with an escalation queue, plus shadow-ban and suspension capability (`profiles.status`).
- **Zero tolerance, automated:** content that is abusive, sexual, casteist/communal, or that solicits exam malpractice or leaked material.
- Structured by question and topic — which makes every resolved thread **user-generated content feeding the 6A SEO surface**, a compounding benefit.

**Explicit rule:** if moderation cannot keep pace, the forum closes. A damaged brand costs more than a missing feature.

### Module 9D · P2 · Mobile Presence

Trusted Web Activity to publish the existing PWA to the Play Store, or Capacitor for a fuller wrapper.

⚠️ **The one genuine cost in this document: a Google Play developer account, ~$25 (~₹2,100) one-time.** It is **optional** — the PWA installs directly from the browser — so it stays outside the zero-rupee path. Buy it from revenue if and when a store listing is worth it. **Note the interaction with Module 4C:** Play policy requires an account-deletion path for listed apps, which the documented anonymization backstop satisfies. Apple's ~₹9,000/year is out of scope.

### Module 9E · P2 · AI Depth

Personalised study-plan generation, step-by-step derivations, AI-generated mocks calibrated to a weakness profile, natural-language question search, voice revision mode. Heavier AI is the clearest justification for the ₹99 tier and the cleanest quota boundary.

---

# PART IV — THE ECONOMICS

## 4.1 Revenue model at scale

Blended assumptions: ~8% of registered users make at least one paid purchase; ~2.5 exams per paying user per season at a ₹39 blended price; ~1.5% take the ₹99 AI add-on; ~15 page views per user per month.

| Registered | Paying (8%) | Per-exam revenue | AI add-on (1.5%) | Ad revenue | Total / month |
|---|---|---|---|---|---|
| 1,000 | 80 | ₹7,800 | ₹1,485 | ₹225 – ₹1,200 | **~₹9,500 – ₹10,500** |
| 10,000 | 800 | ₹78,000 | ₹14,850 | ₹2,250 – ₹12,000 | **~₹95,000 – ₹1.05L** |
| 50,000 | 4,000 | ₹3.90L | ₹74,250 | ₹11,250 – ₹60,000 | **~₹4.8L – ₹5.3L** |
| 200,000 | 16,000 | ₹15.6L | ₹2.97L | ₹45,000 – ₹2.40L | **~₹19L – ₹21L** |

Illustrative, not forecasts. The **structural** conclusions hold across the whole range:

- **Micro-pricing out-earns classic subscription SaaS at every scale here**, because 8% paying ₹29–49 beats 3% paying ₹99/month in a market this price-sensitive — and the first purchase is dramatically easier to obtain.
- **Ads monetize the ~92% who never pay.** Structurally small early, structurally significant past 200k page views, and they cost nothing to keep running.
- **The Season Pass is the margin lever.** Converting a 3-exam buyer (₹87–147) into a ₹199 pass increases revenue per user *and* removes per-transaction friction *and* front-loads cash into the peak window.

## 4.2 Why ₹29 is the right number

- Below the deliberation threshold. ₹29 is a reflex; ₹299 is a decision requiring parental consultation for many of our users.
- **Undercuts every incumbent by an order of magnitude.** Competitors sell ₹2,000–₹15,000 packages; we are not competing on the same axis, which is the strongest position available to a new entrant with no brand.
- **UPI makes it collectable.** A ₹29 transaction is viable in India in a way it is not in most markets, and nil UPI MDR is what preserves the margin (7B).
- **Trades margin for funnel.** The hardest conversion is ₹0 → ₹1. Once crossed, ₹49 and ₹199 become easy.
- **Ad-supported Basic vs ad-free Pro is an honest, legible upgrade.** The customer understands exactly what the extra ₹20 buys — and 6C guarantees the ad-free promise is real.

## 4.3 GATE seasonality — the execution calendar

GATE is an annual **February** exam. Traffic and willingness-to-pay swing violently, and the business must be run against that calendar, not against a flat month.

### Peak window — September to January
- **Push the ₹199 Season Pass hard.** It front-loads cash into the window where intent is maximal and removes repeat-purchase friction for the rest of the season.
- **All-India Mock Series** on a published schedule — the single strongest acquisition and retention event we have (5E).
- Referral loops and ambassador activity at maximum intensity (7E).
- Ship nothing risky. **Reliability during peak outranks any feature.** A failed mock in January is unrecoverable.
- Ad inventory is at its most valuable — and this is when a direct sponsor will pay most (8B line 1).

### Trough window — March to May *(post-exam)*
- **Halt all paid acquisition effort.** Intent collapses; anything spent here is wasted. (At ₹0 budget this means halting *time*, which is the scarce resource.)
- Reallocate entirely to compounding work:
  - **Programmatic SEO content generation (6A)** — SEO takes months to compound, so the trough is exactly when to build the asset that pays in the next peak.
  - **Branch data ingestion (8A)** — the vision pipeline runs for days and needs validation time. This is its window.
  - **Platform depth (9A, 9B)** — adaptive engine and gamification, built when nobody is mid-exam.
  - Infrastructure, debt, and the `BUGS.md` backlog.
- Retain the prior cohort with result analysis, next-year planning tools, and early-bird passes for the following season.

### June to August — ramp
New aspirants begin. Launch new branches here (8A), with SEO from the trough already indexing and the waitlist ready to convert.

## 4.4 What decides success

1. **Trust in the scores.** Release 5 is the moat. A rank that cannot be gamed is what a serious aspirant pays for, and what a free competitor will not bother to build.
2. **Price disruption.** ₹29 reframes the category.
3. **The AI coach, narrow and good.** Not a chatbot — a system that knows this user's weak topics and says what to do on Tuesday morning (9A + 9E).
4. **Speed and offline.** The local-first architecture is a hard-won advantage over slow competitor web apps. **Release 4's sync work must not erode it.**
5. **A genuinely good free tier.** College WhatsApp groups are the entire acquisition strategy; a stingy free tier kills it at the source.
6. **The content engine.** Compounds for years; simultaneously acquisition, SEO and ad substrate.
7. **Multi-branch reach.** Same code, ~5× the market.
8. **Shipping weekly through September–January.**

## 4.5 What would kill it

- Monetizing before Release 5 — selling ranks that a CS student can forge.
- Ad density costing more in lost purchases than it earns (measure it explicitly, 6C).
- Cross-user data leakage on a shared college machine (FINDING-4) — one screenshot in a student group is reputational.
- An AI-route incident producing an outage or a bill during peak season (FINDING-1).
- A vision-pipeline answer-key error shipping unvalidated into a paid ranked test (8A gate 6).
- The forum opening before moderation exists (9C).
- Burning September–January on infrastructure instead of shipping to users.
- A Razorpay account review triggered by misworded refund terms (7B).

---

# PART V — CROSS-CUTTING CONCERNS

## 5.1 Legal pack — required early, used everywhere

| Page | Required for |
|---|---|
| Privacy Policy | AdSense, Razorpay, DPDP, Play Store |
| Terms of Service | AdSense, anti-scraping enforcement, paid access, forum conduct |
| **Refund & Cancellation Policy** | **Razorpay onboarding — mandatory even to state "no refunds"** |
| Cookie Policy | Ad consent |
| About + Contact | AdSense approval |
| Disclaimer | "Not affiliated with any IIT or the GATE organising institute" |

Written once in Module 6B; unblocks ads, payments and compliance simultaneously.

## 5.2 Privacy & India's DPDP Act

- **Minimum collection.** Every profile field must justify itself.
- Explicit consent for analytics and personalised advertising.
- **Minors:** some users will be under 18. DPDP imposes stricter requirements for children's data and ad networks restrict personalised ads to minors. Posture: collect birth year; **serve only non-personalised ads to under-18 users.**
- **Data export** available (4E-3). **Erasure** handled via the documented anonymization backstop (4C) — the mandate's retention goals preserved, the legal right honoured.
- 5C integrity signals and the anonymization path must both be named explicitly in the Privacy Policy.
- Breach-notification readiness.

## 5.3 The security model, stated once

| Layer | Control |
|---|---|
| Transport | HTTPS everywhere; HSTS |
| Hosting | Cloudflare — WAF, DDoS protection, bot management at ₹0 |
| Auth | Supabase JWT (+ Firebase bridge for OTP); httpOnly refresh; **middleware-enforced routes** |
| Authorization | Postgres RLS, default-deny; **`question_answers` unreachable by anon and authenticated roles** |
| Secrets | `NEXT_PUBLIC_` vs server-only; CI grep over build output |
| API | Auth required; zod validation; **server-owned system-instruction enum**; Upstash limits keyed on user ID; Turnstile |
| Exam integrity | Server-held key, server timer, server evaluation on Workers/Edge, append-only responses, integrity flags |
| Data isolation | Per-user IndexedDB namespace + RLS + full Zustand reset on sign-out |
| Payments | Webhook signature verification; entitlements server-side only |
| Assets | Relative paths in DB; CDN/R2 delivery; hotlink protection; watermarking |
| Content | Automated toxicity scoring pre-publication (9C) |
| Monitoring | Sentry; structured API logs; anomaly alerts |

**Governing rule (Rule 2): the client is hostile. Every check that matters runs on a server we control.**

## 5.4 Metrics from day one

**Acquisition:** signups/day by source, organic sessions, indexed pages, keyword ranks, **branch waitlist counts** (the Release 8 prioritisation signal).
**Activation:** % completing a first test within 24h — the strongest early retention predictor.
**Retention:** D1/D7/D30, weekly active, streak distribution.
**Revenue:** free→paid conversion, exams per paying user, ₹29 vs ₹49 mix, pass attach rate, AI add-on take rate, ad RPM, **revenue per free user**.
**Health:** error rate, p95 latency, sync failure rate, AI quota utilisation, **headroom on every free tier in §2.2**.
**Integrity:** flagged attempt rate, and a manually audited false-positive rate — this metric lies if left unwatched.

## 5.5 Risk register

| Risk | Impact | Response |
|---|---|---|
| AI route abused before 4G | High | 4G Phase 1 ships first, out of sequence |
| Vercel ToS breach at monetization | **Critical** | 4A migration before any ad or payment code |
| Firebase SMS quota repriced/exhausted | Medium | Three auth doors; OTP never the only path; strict OTP rate limiting (§2.4) |
| Supabase 500 MB exhausted by assets | High | §2.3 enforced — relative paths only; R2 for bulk |
| Answer key leak | **Critical** | 5A + RLS denial; CI test asserting anon cannot read `question_answers` |
| Vision pipeline ships a wrong answer key | **Critical** | Mandatory human validation gate before `live` (8A stage 6) |
| AdSense rejection | Medium | Content engine first; Ezoic/Media.net fallback; direct sponsors in parallel |
| Razorpay review over refund wording | High | Precise enforceable wording (7B); published policy page |
| DPDP challenge to no-deletion | Medium | Anonymization backstop (4C) |
| Cross-user leak on shared device | High (reputational) | 4F with an explicit two-account test |
| Forum toxicity | High (reputational) | 9C gated on moderation; close it if moderation cannot keep pace |
| Seasonal revenue collapse (Mar–May) | Expected | Season passes; trough reallocated to compounding work (§4.3) |
| Solo-founder bandwidth | High | Strict sequencing; resist parallel work |

---

# PART VI — SEQUENCING

## 6.1 Dependency graph

```
┌─ IMMEDIATE (no dependencies, ship now) ────────────────────────┐
│ 4G-Phase1  zod validation + server instruction enum + caps     │
│ 4F-prep    IndexedDB namespacing plumbing (guest namespace)    │
│ 5A-prep    build-time public/private dataset split + grade API │
└────────────────────────────────────────────────────────────────┘
                              ↓
4A  Cloudflare migration  ⚠ P0 — blocks ALL of Releases 6 & 7
                              ↓
4B  Postgres + RLS + public/private schema + asset path rule
                              ↓
        ┌─────────────────────┼─────────────────────┐
        ↓                     ↓                     ↓
4C Auth (3 doors)        4H Branch teaser      4G-Phase2 (auth-gated)
        ↓                  + waitlist
   ┌────┼────┐                  │
   ↓    ↓    ↓                  │
4D Guest 4E Profile 4F Isolation│
        + Goals Engine    ↓     │
                       4I Sync  │
                              ↓ ↓
5A Answer withholding → 5B Server evaluation → 5C Integrity → 5E Leaderboards
                              ↓         ↓
                        5D Bank protection
                              ↓
6A Content/SEO engine → 6B Legal + ad networks → 6C Ad placement
                              ↓
7A Tiers/entitlements → 7B Razorpay → 7C Abuse → 7D Device limits → 7E Referrals
                              ↓
        ┌─────────────────────┴─────────────────────┐
        ↓                                           ↓
8A Vision pipeline → multi-branch launch     8B Revenue diversification
        ↓                                           ↓
9A Adaptive · 9B Gamification · 9C Community(gated) · 9D Mobile · 9E AI depth
```

## 6.2 Calendar alignment

| Window | Focus |
|---|---|
| **Now → peak** | Releases 4 and 5. Security and identity **must** be complete before the peak. |
| **Sept – Jan (peak)** | Release 7 monetization live; 5E mock series running; 6A content published continuously; **ship nothing risky** |
| **Feb (exam)** | Freeze. Reliability only. |
| **Mar – May (trough)** | 8A branch ingestion, 6A SEO at volume, 9A/9B depth, backlog |
| **Jun – Aug (ramp)** | Launch new branches; convert the 4H waitlist; early-bird passes |

**Start 6A content immediately and continuously.** SEO compounds on a months-long clock and is the only line in this plan that cannot be rushed later.

## 6.3 Immediate execution queue

| # | Action | Blocks | Status |
|---|---|---|---|
| 1 | **Harden `/api/ai/generate`** — zod schema, server-owned instruction enum, prompt-length cap, structured logging | FINDING-1 | ✅ **done** |
| 2 | **Apply and tighten rate limiting on the AI route** (was completely unprotected; now origin-checked + IP-keyed + 15 req/min) | FINDING-2 | ✅ **done (interim)** |
| 3 | **Build-time public/private dataset split + server-side grading route** | FINDING-3 | ✅ **done (infra)** |
| 4 | **IndexedDB per-user namespacing + full Zustand reset** | FINDING-4 | ✅ **done (prep)** |
| 5 | Verify Vercel and Cloudflare live terms in writing | 4A | ✅ **done** — see §2.1 |
| 6 | Convert `fs.readFile` data loading to build-time imports (Workers has no runtime filesystem) | 4A | ✅ **done** |
| 7 | Scaffold OpenNext/Wrangler config; prove `build:cf` succeeds and compute real bundle size | 4A | ✅ **done** — see §2.1.1 |
| 8 | Create Cloudflare account, `wrangler login`, run `deploy:cf` for real, cut over DNS | 4A | ⏸ **needs account owner** |
| 9 | Create Supabase project; commit migration 001 with RLS on every table | 4B | pending |
| 10 | Verify Firebase phone-auth quota and India pricing | 4C | pending |
| 11 | Begin daily SEO content — one solution page per day | 6A | pending |

**What shipped for #1–4, and what's honestly still open** (all four verified against the live dev server, not just typechecked):

- **#1 — Done, for real.** `/api/ai/generate` no longer accepts `{systemInstruction, prompt}` at all. The client now sends `{type, params}` — a server-owned enum naming one of six fixed `PromptBuilder` templates plus structured, zod-validated, size-capped data — and the actual instruction text is built entirely server-side (`lib/security/ai-request-schema.ts`, rewritten `app/api/ai/generate/route.ts`). Verified live: the old payload shape is now rejected with a schema error, an unrecognized `type` is rejected, and a valid request reaches the real `buildPrompt()` call. Also added: a hard request-body size ceiling, a 30s Gemini timeout, and structured per-request logging.
- **#2 — Done as the ₹0, no-dependency interim fix; full fix is still Module 4G Phase 2.** The route previously had *zero* rate limiting (the dataset/image-manifest routes had it, the one route that costs money didn't). It now carries the same origin-check + rate-limit pattern, at a tighter 15 req/min. It's still IP-keyed via `getClientKey()`, which the master plan already names as a weak key (CGNAT) — swapping to Upstash-backed, user-ID-keyed limiting genuinely needs auth to exist first, so that part remains Module 4G Phase 2, not claimed as solved here.
- **#3 — The split and grading engine are real and tested; the live exam UI is not yet cut over.** New: `lib/repository/dataset-split.ts` (splits any paper into an answer-free public payload + a server-only answer key; grades one response), `/api/exam/grade` (POST responses → server-computed correctness + score, zod-validated, origin-checked, rate-limited), and `/api/dataset?scope=public` (the same split, live, on the existing dataset route). Verified live against real questions: correct/incorrect MCQ and NAT grading both scored correctly, malformed requests get 400, cross-origin gets 403. **What's deliberately not done:** the current practice/exam flow still fetches the full answer-bearing dataset and self-grades in the browser — rewiring that (18 call sites across the exam runtime, results pages, analytics and AI context) is Module 5A/5B, scheduled for Release 5 once 4B/Supabase exists, and doing it piecemeal today risked regressing a recently-stabilized, working exam UI. The default `/api/dataset` response is unchanged and still carries answer keys, with a code comment marking exactly why and where the replacement path is.
- **#4 — Real, tested, and inert by default.** `IDBManager` now supports `setActiveNamespace(userId | null)`, and `lib/store/reset-all-stores.ts` resets all 10 Zustand stores via `getInitialState()`. Verified live: the default (no namespace set) still opens the exact same `GatePrepOS_DB` every current user already has — zero migration risk — while calling `setActiveNamespace("test-user")` opens a genuinely separate, independently-listed database without touching the default one, and `resetAllStores()` reverts dirtied state while keeping action methods callable. Nothing calls either of these yet, because there's no sign-in/sign-out flow to call them from — that wiring is Module 4C/4F once auth exists. This is the isolation *mechanism*, proven to work, ready for auth to drive.
- **#5–7 — the Vercel/Cloudflare licence question is closed, and the technical migration path is proven, not just planned.** Full detail in §2.1/§2.1.1: Vercel's ToS confirmed to name ads and payments explicitly as prohibited on Hobby; Cloudflare confirmed permissive with one card-processing clause that Razorpay's hosted checkout already satisfies. `@opennextjs/cloudflare` (GA, not the newer beta `vinext`) is installed, `wrangler.jsonc`/`open-next.config.ts` are scaffolded, `npm run build:cf` succeeds against the real app, and a no-login `wrangler deploy --dry-run` measured the actual upload at 9.3 MB / 2.0 MB gzip — well inside Cloudflare's current 64 MiB (all-plans) ceiling.
- **#8 — genuinely blocked on the account owner, not on more engineering.** Creating the Cloudflare account, authenticating Wrangler, running a real `deploy:cf`, pointing DNS at it, and decommissioning Vercel only after the live Cloudflare deployment passes the same Playwright verification this app already has — these are account-level and outward-facing, so they're listed here as the exact next steps rather than done unattended:
  1. Create a Cloudflare account (free) and add the domain if a custom one is in use, otherwise a `*.pages.dev`/`*.workers.dev` subdomain works immediately.
  2. `npx wrangler login` locally (or generate a scoped API token) to authenticate Wrangler to that account.
  3. `npm run deploy:cf` — builds and pushes the real Worker.
  4. Smoke-test the live Cloudflare URL against the existing Playwright suite before touching DNS.
  5. Repoint the domain (or share traffic during a verification window) — only once step 4 passes.
  6. Decommission the Vercel project once the Cloudflare deployment has run cleanly for a few days.

---

## Appendix A — Cost ledger

| Item | Cost |
|---|---|
| Hosting, edge compute, CDN, object storage, database, auth, rate limiting, bot protection, email, analytics, error tracking, CI, AI inference, vision extraction, avatars | **₹0** |
| Razorpay | % of revenue received; UPI MDR currently nil — no upfront cost |
| Custom domain *(optional)* | ~₹1,000/yr — from revenue |
| Google Play account *(optional, 9D)* | ~₹2,100 one-time — from revenue |
| **Required investment to build, launch, secure and monetize** | **₹0** |

## Appendix B — Mandate traceability

| # | Mandate | Module |
|---|---|---|
| 1 | Immediate Cloudflare migration (P0) | 4A |
| 2 | Image asset architecture — no DB binaries, no GitHub URLs, CDN/R2 + relative paths | §2.3, 4B, 8A |
| 3 | Mobile OTP via Firebase + Google OAuth + Email | 4C |
| 4 | No account deletion in UI | 4C (+ compliance backstop) |
| 5 | Guest walkthrough / teaser mode with contextual locks | 4D |
| 6 | Per-user IndexedDB namespacing + Zustand reset | 4F-1 |
| 7 | Answer key withholding | 5A, 4B schema |
| 8 | Server-authoritative evaluation on Workers/Edge Functions | 5B |
| 9 | API hardening — JWT, zod, server enum, Upstash by user ID | 4G |
| 10 | JSON → Supabase Postgres with RLS | 4B |
| 11 | Dynamic Exam Goals Engine driving Focus Target / Goal Slider | 4E-2 |
| 12 | Multi-branch: Coming Soon UI + Notify Me; vision extraction backend | 4H, 8A |
| 13 | Leaderboards Phase A; moderated community Phase B | 5E, 9C |
| 14 | ₹29 / ₹49 / ₹99 pricing; no refunds, no cancellations | 7A, 7B |
| 15 | Seasonality — peak passes and mock series; trough SEO and ingestion | §4.3 |

## Appendix C — Source documents

- `GATE_OS_Deployment_and_Monetization_Plan.md` — free-tier limits, phase sequencing
- `GATE_OS_Growth_Security_Marketing_Plan.md` — device enforcement, zero-budget channels, competitive analysis
- `GATE_OS_Release_4_and_Future_Releases_Master_Prompt.md` — Supabase schema and sync statuses, auth security validation matrix
- `BUGS.md` — P0–P3 backlog to fold into each release
- Live codebase at `D:\0-UI\r2ma-stable` — the four findings in §1.2 verified directly against source and data

---

*End of document.*
