# RENYXERA — Growth & Marketing Master Plan (₹0)

> **Source of truth for marketing from 8 Oct 2026.** Supersedes `docs/MARKETING_STRATEGY.md`
> for acquisition (that file's pricing and revenue sections still apply). The task list lives in
> `docs/GROWTH_TASKS.md`; ready-to-use drafts live in `docs/GROWTH_ASSETS.md`.
>
> Built from two external "master prompts", corrected against the real product. Every fact in
> §1–§2 was checked in the code or on the live site on 8 Oct 2026. Re-check before quoting.

---

## 0. What the two prompts got wrong (and what we kept)

| Prompt assumption | Reality (verified) | Effect on the plan |
|---|---|---|
| "GATE CS only — don't advertise other papers" | **5 papers live**: CS (975 Qs, 2017–2026), EC (390), EE (390), DA (195), ME (520, both shifts of 2021/22). CE next. | Market CS first; EC/EE/DA/ME are real but thinner (see §2 matrix). |
| "No accounts — keep it local-only" | Google sign-in + **guest mode** (guests can take capped tests, ≤15 Qs). Branch is locked per account after one change. | Funnel = guest first, sign-in when they want history/full papers. Don't force sign-up. |
| "Move the Gemini key server-side, add rate limits" | Already done: `lib/ai/gemini.ts` is `server-only`; AI quotas exist. | No work; keep it in the readiness checklist only. |
| "`Aggregated_Output.json` / stale IndexedDB" | Obsolete. Banks are `public/data/<BR>/questions.json` (answer-free) + DB answers. | Ignore. |
| "Build referral / UTM tracking" | Exists: `/r/<code>` invite links, UTM + referrer captured to the profile once (`lib/growth/acquisition.ts`). | Surface it to users; use the UTM convention in §8. |
| "Create SEO pages" | ~2,500 URLs already in the sitemap: every PYQ paper + every question page for live branches, topic pages, CS syllabus, score/rank predictor, cut-offs, study planner, 2 articles. | SEO work = fill gaps (non-CS tools/articles), not start from zero. |
| Kept from both | Problem-first messaging, 80/20 value/product, community-first, creator micro-partnerships, product-led share loops, experiments, honesty rules, "never claim execution without evidence". | §4–§16. |

---

## 1. Reality snapshot (8 Oct 2026)

**Product (what a student can do today):**
- Real GATE exam simulator (official-style interface, sections, palette, timer, fullscreen with integrity warnings).
- Build tests: full official year papers, subject-mastery tests, custom tests.
- Results + answer review; **Mistakes**, **Bookmarks**, **Revision** loops.
- Analytics by subject/topic/difficulty; Focus Target (syllabus % goal).
- AI Mentor / AI Tutor (server-side Gemini, quota-limited).
- Study planner + calendar + to-dos; leaderboard; Pro/Plus tiers (branch-specific).
- Public, no-login pages: PYQ papers and individual questions, topic pages, CS syllabus with weightage, score & rank predictor, cut-offs, study plan + countdown, 2 data articles, branch landing pages (`/gate-cse`, `/gate-ece`, `/gate-ee`, `/gate-da`, `/gate-me`).
- Growth plumbing: invite links `/r/<code>`, UTM/referrer capture, "Download result" card, daily Telegram post workflow (`.github/workflows/telegram-daily.yml`, needs channel secrets), Cloudflare Web Analytics beacon, question report API.

**Baseline numbers (from the database, 8 Oct 2026):** 8 accounts in total (1 in the last 7 days),
sources recorded: direct only, 0 question reports. **Treat the real user count as ~0.** Every target in
this plan starts from zero, and nothing in public copy may imply traction.

**GATE 2027 calendar (official site, gate2027.iitm.ac.in):** late-fee registration closes **12 Oct 2026**;
admit card **4 Jan 2027**; exams **6–7, 13–14, 20–21 Feb 2027**; results **19 Mar 2027**.
→ We are ~4 months from the exam: the season of peak study intensity. Students now want **practice,
mocks, revision and score prediction**, not "how to start".

---

## 2. Launch readiness

**Verdict: READY FOR ORGANIC DISTRIBUTION — YES for GATE CS; YES (soft) for EC, EE, DA, ME.**

Checked 8 Oct 2026: production smoke test (22 public pages × phone/desktop × light/dark + a guest
exam end to end) passes except one bug found and fixed the same day (hydration error on the study-plan
tool; the date-picker label used the browser locale).

| Priority | Item | Why it matters | Action | Blocker? |
|---|---|---|---|---|
| A | Study-plan tool hydration error | Public SEO tool threw a React error on load | Fixed (locale pinned) — verify after deploy | Was; fixed |
| A | "Report this question" reachable from exam review | Trust: wrong Q/answer must be reportable | Verify the button is visible in review on mobile | Verify |
| A | Guest → first value < 2 min | The aha moment must not need sign-in | Time the guest flow from a branch page | Verify |
| B | Non-CS public tools/articles | Predictor, cut-offs, syllabus page, articles are CS-only | Build per branch as data allows (§10) | No |
| B | Proper Share (link + preview) | Main viral loop | Planned feature (see TASKS) | No |
| B | Telegram bot (verification + reports) | Retention + free channel | Planned feature | No |
| C | WhatsApp | Costs money per message | After revenue | No |

**Paper readiness matrix (what we may honestly market):**

| Paper | PYQ coverage | Practice + simulator | Analytics / Mistakes / Revision | AI Mentor | Public SEO pages | Market? |
|---|---|---|---|---|---|---|
| CS | 2017–2026, 975 Qs | ✅ | ✅ | ✅ | PYQs, topics, syllabus, predictor, cut-offs, planner, articles | **Yes — lead** |
| EC | 2021–2026, 390 | ✅ | ✅ | ✅ | PYQs + question pages + topics | Yes ("6 years of official papers") |
| EE | 2021–2026, 390 | ✅ | ✅ | ✅ | same as EC | Yes |
| ME | 2021–2026, 520 (both shifts 2021/22) | ✅ | ✅ | ✅ | same as EC | Yes |
| DA | 2024–2026, 195 (all papers since DA began) | ✅ | ✅ | ✅ | same as EC | Yes ("every DA paper ever") |
| CE | not yet | — | — | — | — | **No** (coming) |
| Others | — | — | — | — | — | **No** |

Claim limits: say "official previous-year papers 20XX–2026"; never "complete preparation", never
rank/selection promises, never "AI predicts your rank" beyond the existing predictor's stated range.

---

## 3. North Star and metrics

**North Star: Weekly Active Learners (WAL)** = distinct people (guest or signed-in) who, in a week,
answer ≥10 questions **or** complete ≥1 test **or** open review/mistakes after a test.

| Stage | Metric | Where it comes from today | Gap |
|---|---|---|---|
| Reach | visits by page/source | Cloudflare Web Analytics | add UTM to every link (§8) |
| Acquisition | sign-ins by source | `profiles.acquisition` | ✅ |
| Activation | first test submitted, first 10 answers, first AI use | exam sessions (local + synced) | **add a tiny events table** (TASKS G-3) |
| Retention | D1 / D7 / D30 returning | not tracked | events table |
| Referral | invites sent, `/r/` sign-ups, shared pages | referral_codes, `/r/` source | share events |
| Quality | question reports, AI thumbs | report API | surface report button |
| Efficiency | **Time cost per activated user** (minutes of founder time ÷ activated users, per channel) | manual weekly sheet | §15 |

Weekly review (Sunday, 20 min): WAL, new activations by channel, D7 of last week's cohort, top
pages, reports received, what students asked. Decide scale / iterate / stop per experiment.

---

## 4. Positioning

**Primary (problem-first):**
> *You've solved hundreds of GATE questions. Do you know which topics are actually costing you marks?*
> RENYXERA puts every official GATE paper in the real exam interface, tracks every mistake, and turns
> them into your revision list — free.

**Three angles**
1. **Real exam, real papers** — "Practise the actual GATE 2017–2026 papers in the exact exam interface, timer and all."
2. **Mistakes → revision** — "Every wrong answer lands in your Mistakes list and comes back until you get it right."
3. **Your branch, not just CS** — "EC, EE, ME and DA aspirants: your official papers, tagged to your syllabus, finally in one place."

**Aha moment (target < 5 min):** finish a 10-question subject test → see the per-topic breakdown → open one
wrong answer in review → it's already in Mistakes.

**Five short hooks**
1. Your mock score isn't the problem. Your repeated mistakes are.
2. GATE 2025 asked this in 3 minutes. Can you do it in 1?
3. 120 days left. Which 3 topics give you the most marks per hour?
4. Stop re-reading notes. Re-solve your mistakes.
5. Every official GATE paper since 2017, in the real exam screen, free.

Ten social hooks, ten creator hooks and ten SEO angles: `docs/GROWTH_ASSETS.md` §1.

---

## 5. Audience priority (Oct 2026 → Feb 2027)

| # | Persona | Pain now | First touch | Offer |
|---|---|---|---|---|
| 1 | **CS final-year / repeater, serious** | needs timed full papers + weak-topic diagnosis | Telegram/Reddit PYQ challenges, YouTube Shorts | full-paper simulator + analytics |
| 2 | **Late starter (any branch)** | 4 months, huge syllabus | "most repeated topics" + study planner | planner + topic-wise PYQs |
| 3 | **EC/EE/ME aspirant** | branch PYQ practice is scattered | branch Telegram groups, branch Quora answers | "your 6 years of official papers" |
| 4 | **DA aspirant** (new paper, little material) | very few practice sources | DA communities, LinkedIn | "every DA paper ever" (all 195) |
| 5 | Working professional | 1 hr/day | LinkedIn | 10-question daily tests |

Persona 1 first: largest paper, deepest data, most tools.

---

## 6. Channel ranking (Reach × Relevance × Organic potential × Trust × Speed × Sustainability ÷ Effort)

**Tier 1 — do now**
1. **Telegram** (existing GATE groups + own channel with the daily post bot): highest GATE density, forwards spread for free.
2. **SEO** (2,500 pages exist; fix gaps, earn first backlinks): compounding.
3. **Reddit + Quora** answers (high intent, permanent, link-tolerant when genuinely useful).
4. **Product loops** (share links, invite links, Telegram reports) — make every user a channel.

**Tier 2 — next**
5. YouTube Shorts / Instagram Reels from the PYQ engine (one PYQ = one 30-s video).
6. Micro-creator & Telegram-admin partnerships (custom challenge for their audience).
7. LinkedIn (DA + working professionals; founder build-in-public).

**Tier 3 — opportunistic**
8. College GATE/coding clubs, free directories (AI-tools, edu lists), Product Hunt-style launches (low GATE density; only for backlinks).

Skip: Facebook groups (low activity), X/Twitter (low GATE density), Discord (small), paid anything.

---

## 7. Funnels (per channel)

```
Telegram/Reddit/Quora post (a real PYQ)
  → public question page /pyq/<paper>/q<N> (no login, answer + explanation path)
    → "Try 10 more like this" → guest subject test
      → result + review (aha) → "Save your progress" → Google sign-in
        → Mistakes/Revision next day (D1) → invite link / share card
```
Every outbound link points at the **most specific useful page** (a question or topic page),
never the bare homepage.

---

## 8. Attribution (UTM convention)

`?utm_source=<platform>&utm_medium=<type>&utm_campaign=<series_wNN>&utm_content=<asset>`

- source: `telegram | reddit | quora | youtube | instagram | linkedin | creator_<handle> | college_<name> | directory_<name>`
- medium: `community | post | answer | short | reel | bio | dm | partner`
- campaign: `qotd_w41`, `mistake_series`, `launch_oct26`, `branch_ec` … (week number = ISO week)
- content: short slug of the asset, e.g. `os_paging_2025fn_q14`

Captured automatically into the profile on sign-in. One shared sheet (§15) holds every link posted.

---

## 9. Content engine

**Series: "GATE Daily"** (one real PYQ per day, rotating subjects/branches)
1 PYQ → Telegram post (question + options, answer next morning) → Reddit/Quora (only where a thread
asks about the topic) → 30-s Short/Reel (screen recording of solving in the RENYXERA simulator) →
LinkedIn (weekly digest) → the question page itself is the landing page.

Rules: 80% value / 20% product; answer always shown (the post is useful even with no click);
every answer verified against the official key in the bank (never from memory); adapt per platform,
never paste identical text.

Supporting series (weekly): **Mistake of the Week** (common trap), **Topic ROI** (marks per topic from
our tagged data — original data = backlinks), **Countdown** (days left + what to do this week).

Scoring each idea: Search demand × Student pain × Product relevance × Shareability × Gap × Ease (1–3 each).

---

## 10. SEO engine

Have: PYQ papers + ~2,400 question pages (all live branches), topic pages, CS syllabus, CS tools, 2 CS articles.

Priority gaps (highest first):
1. Branch syllabus-with-weightage pages for EC/EE/ME/DA (data exists from tagging).
2. "Most repeated topics" articles per branch (original data from our tags → linkable).
3. Branch score/rank predictor + cut-offs (needs official marks-vs-rank data per branch; verify sources first).
4. Internal links: each question page → same-topic practice CTA with UTM-free internal tracking.
5. Search Console: submit sitemap, watch impressions per template; fix titles with low CTR.

No thin AI pages, no doorway pages; every page must have real data or a real tool.

---

## 11. Community & creator outreach

Process per target: **observe (read rules + 1 week of posts) → contribute (3+ genuinely useful posts/answers) → offer (a custom free challenge for their audience) → ask (permission to share a link)**.
Prioritise micro-communities and micro-creators with dense GATE audiences over big generic accounts.

Offers that cost ₹0: a co-branded PYQ challenge set, a "weak-topic check" test link for their group,
weekly PYQ digest they can forward, early Pro access for the admin/creator (Pro is ours to give).

Trackers (templates in ASSETS §5): community tracker and creator tracker with status
`researched → contributing → contacted → replied → partner / declined`.
**No contacts have been made yet** — research is task C-1/C-2.

---

## 12. Product-led loops (ranked)

| Loop | Exists? | Value | Share chance | Effort | Abuse risk | Rank |
|---|---|---|---|---|---|---|
| Public question pages as "Can you solve this?" links | ✅ pages exist; add a share button | high | high | S | low | **1** |
| Invite link `/r/<code>` surfaced after a good result | ✅ backend; UI placement | med | med | S | low (no rewards) | **2** |
| Result card share **link** with preview image | planned | high | high | M | low (privacy default anon) | **3** |
| Telegram bot weekly report (forwardable) | planned | high (retention) | med | M | low | **4** |
| "Same test" friend challenge (beat my score on this exact set) | new | high | high | M | low | **5** |
| Streak / weekly progress card | partial | med | med | S | low | 6 |

---

## 13. Seasonal plan (verified dates)

| Window | Student mood | Our push |
|---|---|---|
| Now → 12 Oct | last registrations | "120 days plan" + planner tool |
| Oct–Dec | heavy practice | GATE Daily, topic ROI, full-paper challenges, Reddit/Quora answers |
| 4 Jan (admit card) | anxiety | mock rhythm content, timed-paper challenges |
| 6–21 Feb (exams) | revision, then answer-key hunt | last-week revision lists; post-exam: memory-based discussion (no fake keys) |
| Feb–Mar (keys, 19 Mar results) | score anxiety | score & rank predictor push (CS), cut-off pages |
| Apr+ | GATE 2028 starters | "start here" content, full syllabus planner |

---

## 14. Plans

**7-day sprint (8–14 Oct):** see TASKS phase P0/P1 — readiness checks, analytics events, Telegram channel live,
first 7 GATE Daily posts drafted (ASSETS §2), community research list (20 targets), 5 Quora/Reddit answers.

**30 days:** Week 1 infra + content engine · Week 2 community contribution (no links-first) · Week 3 first
partner offers + SEO gap #1 · Week 4 share button + invite surfacing + review experiments.

**90 days (realistic ranges, assumptions stated):** starting from ~0 users, a consistent solo effort of
~1 h/day typically yields **50–300 activated users in month 1–2** if 2–3 Telegram communities accept
contributions; SEO adds little before month 3. These are assumptions, not forecasts — replace with
measured channel data after week 3.

---

## 15. Solo-founder operating system

| Block | Time | Do |
|---|---|---|
| Daily | 15 min | publish GATE Daily (Telegram) + answer 1 community question |
| Daily | 15 min | read 1 community/subreddit, log student questions in the sheet |
| 3×/week | 30 min | 1 Quora/Reddit long answer; 1 Short |
| Weekly | 60 min | 1 partner outreach (personalised), metrics review, pick next experiment |
| Weekly | 2 h | one product-loop improvement from TASKS |

Sheet tabs: Links (UTM), Communities, Creators, Experiments, Weekly metrics, Student questions.

---

## 16. Experiments (first five)

| # | Hypothesis | Channel | Metric | Window | Stop/scale rule |
|---|---|---|---|---|---|
| E1 | PYQ question links convert better than the homepage | Telegram | sign-ins per 100 visits | 2 wks | keep winner |
| E2 | Answer-next-day posts get more forwards than answer-inline | own channel | forwards/post | 2 wks | keep winner |
| E3 | Branch posts (EC/EE/ME) find a less crowded audience than CS | branch groups | activations/hour | 3 wks | shift effort |
| E4 | "Topic ROI" data posts earn links/saves | Reddit/LinkedIn | saves, backlinks | 4 wks | repeat monthly |
| E5 | Invite prompt after a ≥60% result increases invites | product | invites/active user | 3 wks | keep/drop |

---

## 17. What NOT to do

Paid anything; fake accounts/reviews/testimonials/user counts; identical copy-paste posts; mass DMs;
links before contributing; advertising CE or other unsupported papers; rank/selection promises;
memory-based "answer keys" presented as official; X/Facebook effort; thin AI pages; buying backlinks.

## 18. Execution status legend

Every task/asset is **Planned → Drafted → Ready → Submitted → Published → Verified**. Nothing is marked
Published/Verified without a link or a tool confirmation.
