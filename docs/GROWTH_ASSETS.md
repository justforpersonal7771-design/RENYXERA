# RENYXERA — Growth assets (drafts)

Companion to `GROWTH_MASTER_PLAN.md`. Status of everything here: **Drafted** (nothing posted or sent).
Answers below come from the official keys stored in our database (checked 8 Oct 2026), not from memory.
Base URL: `https://gate.renyxera.workers.dev`

---

## 1. Hooks

**Social (save/share-first)**
1. "GATE 2025 asked this. The obvious option is the trap."
2. "If you're writing GATE 2027, your mistakes list matters more than your notes. Here's why."
3. "4 months left. Stop starting new topics; start re-solving old mistakes."
4. "Can you solve this GATE PYQ in 60 seconds? Answer tomorrow."
5. "The page-table question every GATE CS aspirant should be able to do in 30 seconds."
6. "DA aspirants: there are only 195 official DA questions ever asked. Have you solved all of them?"
7. "EC/EE/ME: 6 years of your official papers, one place, real exam screen."
8. "Your mock score went down? Check which topic, not how many hours."
9. "The GATE topics that repeat most often (from our tagged data)." — compute the list first (task S-2); never quote numbers we haven't computed.
10. "Solved it? Now do the next 9 like it — free, no login."

**Creator / admin (audience-benefit-first)**
1. A free weak-topic check your students can take in 15 minutes, no login.
2. A daily PYQ post your channel can forward, with the official answer next day.
3. A co-branded "Week of DBMS" challenge on real GATE papers.
4. Full official papers in the real GATE interface for your students' mock practice.
5. Topic-repeat data for your paper you can quote in a video (we share the sheet).
6. Free Pro access for you to evaluate it before recommending anything.
7. A DA-specific set (every DA question since 2024) for your DA students.
8. A branch PYQ challenge for EC/EE/ME groups that rarely get good free tools.
9. A "last 30 days" revision drill built from your students' common mistakes.
10. Nothing to promote: share it only if your students find it useful.

**SEO angles**
GATE CSE PYQ topic-wise · GATE DA previous year papers · GATE EC/EE/ME PYQ 2021–2026 · most repeated GATE topics (per branch) ·
GATE 2027 study plan 120 days · GATE score calculator / rank predictor · GATE cut-off by year · GATE syllabus with weightage (per branch) ·
GATE virtual calculator practice · GATE mock test in real interface.

---

## 2. GATE Daily — first 7 posts (Telegram format; answer posted next morning)

Each link: `?utm_source=telegram&utm_medium=post&utm_campaign=qotd_w41&utm_content=<slug>`

**Day 1 — OS (GATE CS 2025 FN, Q14)**
> 🧠 GATE Daily · Operating Systems
> Demand paging, 32-bit logical address, 20-bit physical address, page size 2048 bytes, byte addressable.
> Max number of page-table entries?
> A) 2^21 B) 2^20 C) 2^22 D) 2^24
> Answer + 9 more like this: https://gate.renyxera.workers.dev/pyq/gate-cs-2025-fn/q14?utm_source=telegram&utm_medium=post&utm_campaign=qotd_w41&utm_content=os_paging_cs25fn_q14

*Next morning:* ✅ **A) 2^21.** Pages = 2^32 / 2^11 = 2^21, one entry per page of the logical space. (The physical address width is a distractor.)

**Day 2 — CN (CS 2025 FN, Q16)**
> Match OSI layer to function: (a) Network (b) Transport (c) Data link with (I) packet routing (II) framing & error handling (III) host-to-host communication.
> A) a-I, b-II, c-III B) a-I, b-III, c-II C) a-II, b-I, c-III D) a-III, b-II, c-I
> …/pyq/gate-cs-2025-fn/q16 (+UTM `cn_osi_cs25fn_q16`)

*Answer:* ✅ **B.** Network → routing, Transport → host-to-host (end-to-end), Data link → framing/errors.

**Day 3 — Algorithms (CS 2025 FN, Q18)**
> G: undirected, positive weights; T: an MST. d₁ = shortest distance in G, d₂ = in T. Always true?
> A) d₁ = d₂ B) d₁ ≤ d₂ C) d₁ ≥ d₂ D) d₁ ≠ d₂
> …/pyq/gate-cs-2025-fn/q18 (`algo_mst_cs25fn_q18`)

*Answer:* ✅ **B.** T is a subgraph of G, so any T path is also a G path; an MST doesn't preserve shortest paths, so equality isn't guaranteed.

**Day 4 — Compiler Design (CS 2025 FN, Q12)** — Which statement about the symbol table is FALSE?
> A) tracks scope B) can be a BST C) not required after parsing D) created during lexical analysis
> …/pyq/gate-cs-2025-fn/q12 (`cd_symtab_cs25fn_q12`)

*Answer:* ✅ **C** is false — semantic analysis, code generation and debugging info still use it.

**Day 5 — DA (GATE DA 2026, Q15)** — Quicksort, first element as pivot, random distinct input, linear partition. Recurrence for the expected time T(n)?
> A) T(1)+T(n−1)+O(n) B) T(n/4)+T(3n/4)+O(n) C) 2T(n/2)+O(n) D) (1/n)Σₖ[T(k)+T(n−k−1)]+O(n)
> …/pyq/gate-da-2026/q15 (`da_quicksort_da26_q15`)

*Answer:* ✅ **D** — average over all n equally likely pivot ranks.

**Day 6 — ME (GATE ME 2026, Q14)** — The Newton-Raphson method for solving algebraic equations is based on: A) Taylor series B) Fourier series C) Laurent series D) Power series
> …/pyq/gate-me-2026/q14 (`me_newton_me26_q14`)

*Answer:* ✅ **A** — first-order Taylor expansion about the current guess.

**Day 7 — Weekly wrap (no new question)**
> This week: OS, CN, Algorithms, Compiler, DA, ME. Got any wrong? Re-solve them in the real exam screen — wrong answers go to your Mistakes list automatically:
> https://gate.renyxera.workers.dev/setup?utm_source=telegram&utm_medium=post&utm_campaign=qotd_w41&utm_content=weekly_wrap

Before posting each day: open the link once and confirm the page loads and the question matches.

---

## 3. Quora / Reddit answer skeleton

1. Answer the actual question fully (no link needed to be useful).
2. Show reasoning or data (e.g. topic-repeat counts from our tagged papers).
3. Practical next step for this week.
4. *Only if relevant:* "I built a free tool that has the official papers in the exam interface; this topic's questions are here: <specific page + UTM>." Always disclose you built it.

Target threads first: "how to practise PYQs", "best free mock for GATE <branch>", "4 months left GATE", "DA previous year papers".

---

## 4. Outreach templates (personalise the [brackets]; never send unchanged)

**Telegram group admin**
> Hi [name], I've been following [group] — the [specific recent post/thread] was useful. I run a free GATE practice site with every official [branch] paper in the real exam screen. Would it help your members if I posted one PYQ a day with the official answer next morning (no spam, one link per post to that question)? Happy to send the first week here for you to check first.

**Small YouTuber (1k–50k, GATE-focused)**
> Hi [name], your video on [topic] explained [specific point] really clearly. I built a free tool where students can practise exactly those PYQs in the real GATE interface and see their weak topics. If useful, I can make a [topic] challenge set your viewers can take free (no login) and share the anonymised topic stats back with you for a follow-up video. Here's Pro access if you'd like to try it: [code].

**Large educator / coaching**
> Hi [name], short note: we have every official GATE [branch] paper 20XX–2026 tagged by syllabus topic. If your team ever wants topic-repeat data for a session, we'd gladly share the table, free, credit optional. The practice site is here if relevant to your students: [link].

**College GATE / coding club**
> Hi [club], we'd like to offer your members a free GATE PYQ challenge (official papers, real exam screen, no login). We can set a club-specific set for [date] and send you the anonymous topic results to plan revision sessions. No promotion needed beyond sharing the link with members.

**Follow-up (once, after 5–7 days)**
> Just checking whether the [offer] would be useful — no worries if not. Thanks for the [group/channel].

---

## 5. Tracker templates (one sheet, tabs)

**Communities:** Community | Platform | URL | Paper | Members (as shown) | Posts/day | Rules (links allowed?) | Admin contact | Status | Last action | Result
**Creators:** Creator | Platform | URL | Paper | Audience (as shown) | Avg views/likes | Contact route | Personalisation angle | Status | Follow-up date | Result
**Links:** Date | Channel | Exact URL with UTM | Asset | Visits (CF) | Sign-ins (profiles.acquisition) | Notes
**Experiments:** ID | Hypothesis | Channel | Metric | Start | End | Result | Decision
**Weekly metrics:** Week | WAL | Activations by source | D7 of last cohort | Top pages | Reports | Founder hours | Time per activated user

Statuses: researched → contributing → contacted → replied → partner / declined.
