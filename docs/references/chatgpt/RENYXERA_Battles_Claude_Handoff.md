---
title: "RENYXERA BATTLES"
subtitle: "Product, Game Design, UX, Architecture, Security and Delivery Master Handoff"
author: "Product and Engineering Handoff"
date: "14 November 2026"
---

---

# IMPORTANT: HOW CLAUDE MUST USE THIS DOCUMENT

1. Treat Sections 1-4 and the existing-feature inventory as product context. Treat anything labelled **PROPOSED**, **RECOMMENDATION**, or **OWNER DECISION** as not yet approved or necessarily implemented.
2. First inspect the entire repository, current database schema, RLS policies, deployment configuration, existing routes, design system, game code and deployed application. Do not assume this document describes the current code accurately.
3. Produce an **As-Is vs To-Be Gap Analysis** before editing files. Link every conclusion to actual file paths, components, SQL objects, routes, or observed UI.
4. Preserve working functionality. Prefer incremental integration and migration over replacing proven systems.
5. Do not invent users, online counts, matchmaking populations, ratings, match results, rewards, question content or backend capabilities.
6. Do not make a decision that affects scoring, rating, reward economics, privacy, data migrations, subscription entitlements or deployment without documenting the decision and marking owner approval where needed.
7. Use the skills and specialist subagents listed in Section 20. Check which are available using Claude Code's `/skills` and `/agents` commands. Use project-local skills in `.claude/skills/` and subagents in `.claude/agents/`.
8. Verify changing framework/provider details against official documentation at implementation time. The technical references at the end were reviewed on 14 November 2026 and must not be treated as eternal guarantees.
9. Never expose secrets, service-role keys, answer keys, private user data or internal moderation signals to browsers or public channels.
10. Work in small verified releases. After each meaningful implementation batch, run type checks, lint, tests, production build and relevant browser/device tests. Report exactly what passed and failed.

## Required first response from Claude

Before coding, Claude must return:

- Repository and deployment inventory.
- Existing feature map and routes.
- Current architecture diagram.
- Existing database tables, functions, indexes and RLS policy map relevant to Battles.
- Existing match state machine and reward/rating implementation, if present.
- UI screenshots or a route-by-route visual audit of the current product.
- As-Is vs To-Be matrix.
- Security and scoring risks.
- A proposed file-level implementation plan with phases and dependencies.
- A list of decisions that require owner confirmation.
- A clear statement of anything it could not verify.

**Do not start broad refactoring before this audit is reviewed.**

---

# 1. PRODUCT CONTEXT AND NON-NEGOTIABLE CONSTRAINTS

## 1.1 Product

RENYXERA is an installable Progressive Web App for Indian engineering students preparing for GATE. It serves phone and desktop users. The product includes:

- Official GATE past-paper question bank, approximately 3,250 questions from 2017-2026 (owner-provided figure; verify current repository dataset).
- Branches: Computer Science (CS), Electronics and Communication (EC), Electrical (EE), Mechanical (ME), Civil (CE), and Data Science & AI (DA).
- GATE-style test experience and test builder.
- AI Mentor.
- Analytics and performance reports.
- Flashcards and study tools.
- Competitive mode named **Battles** and ranked area named **Arena**.

The GATE examination structure used by this product is 65 questions, 100 marks and 180 minutes. Question types are MCQ, MSQ and NAT.

## 1.2 Audience and usage context

- Indian engineering students, approximately 20-26 years old.
- Many study alone and at night.
- Mobile-first, especially mid-range Android phones and mobile data.
- Desktop is also a first-class experience, not merely a stretched phone layout.
- Cost-sensitive audience; the product owner has specified an Rs 0 build budget and free service tiers.

## 1.3 Required stack (verify actual repository before modifying)

- Next.js 16, React 19.
- Tailwind CSS v4.
- `motion/react` for motion where needed.
- Supabase: Auth, PostgreSQL, RLS and Realtime.
- Cloudflare Workers hosting.
- PWA support for installed mobile use.
- No paid game engine, paid backend, paid art pack or paid animation service.
- CSS, SVG, canvas or free Lottie assets are acceptable. Three.js only if performance is demonstrated on mid-range Android.

**Deployment warning:** Cloudflare's current documentation recommends vinext for new Next.js-on-Workers projects; OpenNext remains an option for existing applications with compatibility gaps. Do not migrate an existing project automatically. Run compatibility checks and compare the actual application's use of Next.js features first. See References R1-R3.

## 1.4 Device design constraints

### Mobile first-class mode

- Portrait phone, with 390px width as the reference canvas.
- Thumb-reachable primary action, normally anchored near the bottom.
- PWA safe-area insets and on-screen keyboard handling.
- Data-efficient; reconnect safely on mobile network changes.
- Avoid heavy continuous animation and large initial downloads.

### Desktop first-class mode

- Landscape, 1440px and wider reference viewport.
- Full-width layouts with multiple useful zones; do not constrain everything to a narrow centred column.
- Mouse, hover, focus, keyboard shortcuts and screen-reader support.
- Persistent left navigation and optional right-side social/information panels.

### Responsive breakpoints (proposed)

- Mobile: up to 767px.
- Tablet/intermediate: 768-1023px; reorganise panels and navigation rather than stretching the mobile screen.
- Desktop: 1024px and above.

## 1.5 Brand and visual identity

- Product wordmark: RENYXERA.
- Existing logo: violet/blue gradient.
- Existing product interface: pastel cards in light mode and dark mode.
- Display font: Sora.
- Body font: Manrope.
- Wordmark font: Bruno Ace SC (branding only, not for long UI text).
- Game world should feel distinct from study pages without losing brand continuity.

## 1.6 Non-negotiable product rules

1. No gambling, betting, wagering, loot boxes or randomised paid rewards.
2. No buying coins and no cash-out.
3. No paid competitive advantage.
4. No fake users, fabricated queue counts, fake online states, fake rankings or undisclosed bots.
5. The same match question pack and question order must be used by both players.
6. Scores, match outcomes, Elo, Arena Points and coin rewards are server-authoritative.
7. The exam question interaction and GATE marking rules remain fair and consistent.
8. Record integrity signals, but do not automatically punish a player for a single tab switch or browser blur.
9. Respect Do Not Disturb. Never interrupt an active exam/test with a battle invitation or scheduled-match pop-up; queue it until the test ends.
10. Dates and times are displayed in IST. Store timestamps in UTC and convert at the presentation layer.
11. No native date/time pickers or native dropdown menus for the game UI. Build accessible custom controls.
12. Respect `prefers-reduced-motion`, keyboard operation and screen-reader labels.

---

# 2. CURRENTLY LIVE FEATURES: PRESERVE AND AUDIT

The owner describes the following as already built and live. Claude must verify each item before treating it as complete.

| Area | Existing/live behaviour described by owner | Required treatment |
|---|---|---|
| Friends | Add by username, online presence, challenge friend | Preserve; improve presentation and reliability |
| Battle engine | Fixed pack of 3-200 questions; both use real exam screen | Preserve question engine; reuse it |
| Grading | Scores graded on server | Audit end-to-end; do not trust browser score |
| Async | Challenger plays and sends; friend plays within 7 days | Preserve ticket and expiry behaviour |
| Live | Shared lobby, both Ready, server start time 6 seconds ahead | Preserve; strengthen reconnect and event handling |
| Progress | Answered count sent every 5 seconds | Preserve; compact and server-derived |
| Results | Both marks, winner and points | Improve game-style result presentation |
| Scheduled | Schedule within 7 days; notification appears after active test | Preserve and improve reminders/attendance handling |
| Rematch | Available | Preserve and redesign presentation |
| Subject comparison | “Where marks went” per subject | Expand into useful post-match insight |
| Elo | Elo-style, start 1000, K=24 | Preserve unless owner approves change |
| Arena Points | Win 30, draw 15, loss 8 | Preserve unless owner approves change |
| Point cap | Maximum 10 point-earning battles per day | Preserve |
| Leaderboards | Weekly and all-time; friends/everyone | Preserve; make Arena prominent |
| Seasons | Four weeks; Season 1 ends 30 Nov 2026 | Preserve current season dates; verify current season state |
| Season reward | Top-10 badges | Preserve |
| Coins | Daily 10; day 7 of streak 60; win 20, draw 10, play 5 | Preserve baseline; clarify daily reward interpretation |
| Coin shop | Mentor-token boosts, avatar frames | Review functional boost policy; see economy decision |
| Clubs | Join/create via 6-character code; max 30; weekly points/rank | Preserve |
| Avatars | Generated styles; some Plus/Pro; plan crown | Preserve; paid visual identity only, never power |
| Plans | Free 3 active battles; Plus Rs 29/month; Pro Rs 99/month; no auto-renew | Preserve entitlements; verify billing implementation |

**Important:** Never remove existing purchased entitlements or user-owned cosmetics as a side effect of the redesign. If the economy proposal changes the coin shop, write a grandfathering migration plan and obtain approval.

---

# 3. GAME VISION, POSITIONING AND CORE LOOP

## 3.1 Game identity

**Recommended name for the game world:** The Circuit Arena.  
**Recommended art direction:** Circuit Afterhours.

The Battles entry point should feel like launching a separate game mode. Hide the normal website navbar, footer, study dock, banners and site menus while inside the game shell. The game has its own navigation and an explicit **Exit to Study** action.

## 3.2 Core loop

```text
ENTER GAME
   -> GAME HOME / LOBBY
      -> CHOOSE MODE
         -> MATCHMAKING / FRIEND INVITE / ASYNC TICKET
            -> MATCH FOUND / READY / VS INTRO
               -> SHARED COUNTDOWN
                  -> PLAY REAL GATE QUESTIONS
                     -> SERVER GRADING
                        -> RESULT (WIN / LOSS / DRAW)
                           -> REWARDS (COINS / XP / POINTS)
                              -> PROGRESSION (ELO / TIER / SEASON / CLUB)
                                 -> REVIEW MISTAKES / NEXT STUDY ACTION
                                    -> BACK TO GAME HOME OR EXIT TO STUDY
```

## 3.3 Why a student returns tomorrow

The return reasons should be meaningful and finite:

- A visible next league or rating target.
- A fresh Daily Challenge, not endless random grind.
- A pending friend challenge or intentionally scheduled match.
- A weekly club goal that rewards a group, not one hyperactive member.
- A concrete post-match learning insight and a recommended topic to practise.
- A fair seasonal track with transparent rewards.

Do not build a retention loop that creates anxiety about losing a streak or requires the user to play every day. Streak rewards should be forgiving and should never affect competitive strength.

---

# 4. GAME MODES AND RULES

Two main paths should be visible from the home screen:

1. **Play with friends** - live, async and scheduled challenges.
2. **Compete in Arena** - ranked matchmaking, quick formats and structured competitions.

Do not display every mode as an equally dominant home-screen tile. Keep the lobby focused and reveal detailed options in Mode Select.

## 4.1 Core mode catalogue

| Mode | Proposed format | Rating impact | Primary purpose |
|---|---|---|---|
| Live Friend Duel | 10 questions, 15 minutes | No Elo | Direct real-time rivalry |
| Async Challenge | 3-200 questions; 7-day expiry | No Elo | Different schedules/time zones |
| Scheduled Duel | 10 questions, 15 minutes | No Elo by default | Planned live competition |
| Ranked Arena | 10 questions, 15 minutes | Elo + Arena Points | Serious branch-matched competition |
| Quick Duel | 5 questions, up to 60 sec/question | No Elo initially | Short practice break |
| Daily Challenge | 5 shared daily questions | No Elo | Habit and comparable daily result |
| Subject Duel | 10 questions in one subject | Friend/unranked in V1 | Subject-specific improvement |
| Club War | Weekly group competition | Separate club score | Team identity |
| Tournament | Fixed bracket/event | Event-specific | Future competitive ecosystem |

The format lengths above are proposals. Keep the existing custom 3-200 question battle creator unless repository audit shows it must be adapted.

## 4.2 Live Friend Duel

- Two real friends join the same lobby.
- Both must press Ready.
- Server validates both memberships and records readiness.
- Server creates one authoritative `start_at` timestamp six seconds in the future.
- Both clients render countdown from the same timestamp.
- Both get exactly the same question IDs, order and deadline.
- Opponent answered count is sent every five seconds, computed from server-accepted answer records.
- Do not expose the opponent's answer choices, correctness, subject marks or partial score during play.
- Results are revealed after both submit or the authoritative deadline passes.
- Rematch creates a new match record with a new question pack or a clearly labelled same-pack rematch; owner must choose the default.

Tie policy: compare exact awarded GATE marks. Equal marks = draw. Completion time and accuracy are informational only; they do not break ties. This prevents speed-clicking from replacing knowledge.

## 4.3 Async Challenge

- Challenger selects a fixed pack and completes their attempt.
- The completed challenge becomes a ticket for the opponent.
- Opponent has up to seven days to accept/complete, according to the current live implementation.
- The same question pack/order is used for both players.
- Proposed opponent time budget: 90 seconds per question, 10-minute minimum, 180-minute maximum. This is an owner decision and must not be applied without approval.
- No time-of-day or submission-speed advantage.
- GATE marks only; no Elo by default.
- Ticket status: Draft, Sent, Accepted, In Progress, Completed, Declined, Expired, Cancelled.
- Make expiry visible and use server time.

## 4.4 Scheduled Duel

- Scheduling window: seven days ahead, matching current live rules.
- Store UTC; display IST.
- Both players receive confirmations.
- Proposed reminder: 15 minutes before match.
- Match notification is deferred while a test/exam is active due to Do Not Disturb.
- Proposed attendance grace: five minutes. Owner must approve.
- Casual friend no-show must not automatically create a ranked win. Allow convert to Async, reschedule or cancel.
- The UI must use custom date/time selection controls, timezone-safe validation and clear local-time previews.

## 4.5 Ranked Arena

Proposed ranked format: 10 questions, 15 minutes.

- Match only within the same selected GATE branch unless an explicitly calibrated cross-branch rating is approved.
- Matchmaking must use actual rating and real queue candidates.
- Initial search window: +/-100 rating, expand to +/-150 after 15 seconds, +/-200 after 30 seconds, stop/offer alternatives at 60 seconds.
- Never show an invented queue count, estimated number of players or fake opponent.
- If no opponent is available, say so and offer friend challenge, Quick Duel, Daily Challenge or return to lobby.
- If the real pool is too small, expose that honestly. Bots, if ever introduced, must say **Practice Bot**, be unranked, and never enter player leaderboards.
- Rating and branch policy, search expansion and timeout are owner-confirmation decisions.

## 4.6 Quick Duel

Proposed format: five questions, up to 60 seconds per question, maximum five minutes.

- One active question at a time.
- No backtracking after advancing.
- Expired question becomes unanswered.
- Same pack/order for both competitors.
- Unranked in V1.
- Normal GATE marking.
- Earn eligible participation rewards only if the economy cap and pair cooldown allow it.

## 4.7 Daily Challenge

Recommended V2 feature:

- Same daily five-question pack for eligible players in a branch.
- Reset at a clearly communicated IST time, preferably 00:00 IST after technical validation.
- One scored attempt per day; practice/replay must be clearly labelled and not affect the daily board.
- Daily leaderboard is based on normalized score if question pack total marks differ; for a shared identical pack, raw marks are sufficient.
- Tie-break should remain a shared rank or use a clearly published rule; recommendation: shared rank, no speed tie-break.
- Daily challenge is not a ranked Elo match.

## 4.8 Subject Duel

- User chooses a subject from the supported syllabus taxonomy.
- Same 10-question pack and order for both players.
- Difficulty and marks distribution must be balanced and visible.
- Keep unranked in V1/V2 until sufficient per-subject calibration and queue volume exist.
- Post-match report should show mark distribution and topic-level mistakes.

## 4.9 Club War

Recommended V2/V3:

- Weekly competition between clubs, maximum 30 members retained.
- Proposed top-five distinct members contribute to team score to reduce domination by one member.
- Each contribution is one eligible, server-verified match, with duplicate pair/rating/coin farming restrictions.
- Publish the scoring formula and eligibility before the competition begins.
- Do not penalize members who cannot play every day.

## 4.10 Tournament formats (future)

- Branch-based weekly ladder or small bracket.
- Fixed registration window and published schedule.
- No entry fee, coin stake or paid ticket.
- Only completed real matches count.
- Anti-collusion, no-show, dispute and tie rules published in advance.
- Start with a small, manually configurable event system; do not build a tournament engine before matchmaking has sufficient real population.

---

# 5. GATE SCORING, ELO AND RESULT INTEGRITY

## 5.1 GATE marking rules

| Question type | Correct | Incorrect | Unanswered |
|---|---:|---:|---:|
| 1-mark MCQ | +1 | -1/3 | 0 |
| 2-mark MCQ | +2 | -2/3 | 0 |
| MSQ | Full marks only for exact correct combination | 0 | 0 |
| NAT | Full marks within accepted answer/range rule | 0 | 0 |

Do not add partial MSQ credit unless the official exam rules and owner explicitly approve a change. Do not apply negative marking to MSQ or NAT.

## 5.2 Exact score arithmetic

Represent score internally in integer thirds of a mark to avoid floating-point rounding:

- 1 mark = 3 score units.
- -1/3 = -1 score unit.
- 2 marks = 6 score units.
- -2/3 = -2 score units.

Convert to decimal only for presentation. Store exact units or exact rational numerator/denominator; do not compare rounded display strings.

For a shared pack:

`match_score_units = sum(per_question_awarded_score_units)`

Result:

- Higher exact score units = win.
- Equal exact score units = draw.
- Lower exact score units = loss.

## 5.3 Separate score systems

| Metric | What it measures | Changes when |
|---|---|---|
| GATE Marks | Knowledge/performance in this paper | Every graded attempt |
| Elo Rating | Competitive skill | Ranked match only |
| Arena Points | Current season leaderboard | Eligible completed battle |
| XP | Long-term participation/progression | Eligible activity |
| Coins | Cosmetic wallet | Eligible reward transaction |

Never add these metrics together. Paid plan must not change any competitive value.

## 5.4 Elo

Preserve stated values unless approved otherwise:

- Initial rating: 1000.
- K-factor: 24.
- Expected score: `E_A = 1 / (1 + 10^((R_B - R_A)/400))`.
- New rating: `R'_A = R_A + 24 * (S_A - E_A)` where `S_A` is 1 win, 0.5 draw, 0 loss.

The implementation must define rounding policy, atomic two-player update, stale rating protection and replay protection. Use a single database transaction/RPC for both rating changes and match finalisation.

**Open question:** Is rating global or per branch? Recommendation: separate rating per branch if players can choose branch-ranked matches, but confirm with owner and audit the existing implementation before changing the model.

## 5.5 Arena Points

Preserve:

- Win: 30 points.
- Draw: 15 points.
- Loss: 8 points.
- Maximum 10 point-earning battles/day.

Do not award points for a voided, cancelled, duplicate or ineligible match. Store the eligibility decision and reward ledger record.

## 5.6 Result presentation

Result screen must show:

- Win/loss/draw clearly but respectfully.
- Both players' actual GATE marks and available marks.
- Subject/section contribution, where permitted.
- Correct, incorrect, unanswered counts.
- Exact negative marking contribution.
- Elo before/after and actual delta for ranked games.
- Arena Points and coins, with reason.
- XP and unlocked cosmetics, if any.
- Rematch, analysis, share and return actions.

Never display the opponent's private account analytics beyond the battle result and explicitly shared profile information.

---

# 6. ARENA TIERS, SEASONS AND PROGRESSION

## 6.1 Proposed engineering-themed tiers

| Tier | Proposed rating | Identity |
|---|---:|---|
| Foundation | Below 1100 | Starting league |
| Logic | 1100-1299 | Core reasoning |
| Circuit | 1300-1499 | Connected systems |
| Signal | 1500-1699 | Precision and signal |
| Matrix | 1700-1899 | Advanced structure |
| Apex | 1900+ | Top competitive tier |

Starting 1000 places a new player in Foundation.

These thresholds and names are proposals. They do not represent official GATE marks, rank or percentile.

## 6.2 Promotion/demotion recommendation

- Promotion when crossing the threshold, with a brief celebratory transition.
- Proposed 50-point demotion buffer to prevent threshold flicker.
- Show current rating, next tier threshold and points remaining.
- Do not demote a user due to a voided or server-error match.
- Do not hide the exact rating change.

## 6.3 Seasons

- Existing season cadence: four weeks.
- Season 1 end date supplied: 30 November 2026; verify live season status.
- Recommendation: Elo remains lifetime/continuous for matchmaking.
- Seasonal Arena Points reset per season.
- Owned cosmetics, coins, XP, profile and history persist.
- Season badge retains season number and historical record.
- Top-10 badges are retained as achievements after season end.

## 6.4 Season track

Recommended V2: 10-level free track with visible XP progress and deterministic rewards.

Example rewards: coins, title, profile badge, frame, emote, victory animation. No premium reward track, no paid season pass and no random reward chest.

## 6.5 XP and profile levels

Suggested XP values (owner approval required):

- Valid completed battle: 10 XP.
- Completed Daily Challenge: 5 XP.
- Review a match mistake: 5 XP.
- Completed weekly mission: 20 XP.

Do not award XP by repeatedly replaying the same friend match. XP is separate from rating and points.

## 6.6 Badges and achievements

Recommended deterministic achievements:

- First Battle.
- First Ranked Win.
- First Draw.
- Five Different Subjects Played.
- Daily Challenge Streak milestones.
- Season Top 10.
- Club Contributor.
- Subject Improvement.

Achievements must be based on server-verified events. Avoid achievements that encourage unhealthy amounts of play.

---

# 7. COINS, MISSIONS, SHOP AND ECONOMY

## 7.1 Existing coin economy

| Activity | Current described reward |
|---|---:|
| Daily login | 10 coins |
| Seventh day of streak | 60 coins |
| Win | 20 coins |
| Draw | 10 coins |
| Completed loss/participation | 5 coins |

Clarify whether seventh-day 60 means total for that day or an additional 60. Recommendation: 60 total on day seven, not 60 plus 10.

## 7.2 Proposed anti-farming limits

- Preserve 10 Arena Point-earning matches/day.
- Proposed maximum five coin-earning battles/day; owner approval required.
- Proposed limit: first reward-eligible match between same player pair in a 24-hour period earns friend-match rewards; subsequent matches are practice-only for relevant rewards.
- Pair and account pattern detection should flag abnormal rating/reward behaviour.
- Do not silently confiscate previously earned coins. Investigate/flag and apply published policies.
- Every coin transaction must have unique ID/idempotency key and server-side reason.

## 7.3 Missions (proposed)

Daily examples:

- Complete one valid battle.
- Solve five questions.
- Review three mistakes.

Weekly examples:

- Complete five eligible battles.
- Play three different subjects.
- Complete Daily Challenge on four days.
- Contribute three eligible club matches.

Missions must have finite caps and should not reward excessive play. Avoid missions that encourage users to play through an active exam or ignore study time.

## 7.4 30-day economy simulation

Illustrative scenario with one eligible battle/day and a fixed assumed mission total of 100 coins. For 30 consecutive days with day seven, fourteen, twenty-one and twenty-eight paying 60 coins total (and the other 26 days paying 10), the daily/streak allowance is 500 coins. Battle-only totals:

| 30-day battle outcomes | Daily/streak | Battles | Missions | Illustrative total |
|---|---:|---:|---:|---:|
| All losses | 500 | 150 | 100 | 750 |
| All draws | 500 | 300 | 100 | 900 |
| All wins | 500 | 600 | 100 | 1200 |

This is a balancing illustration, not a promised earning rate. Before launch, simulate streak calendars, daily caps, mission completion and actual reward-eligible matches with a script and publish expected earn rates.

## 7.5 Cosmetic-only shop recommendation

Suggested prices (owner approval required):

| Item | Proposed price |
|---|---:|
| Basic emote | 100 |
| Profile title | 150 |
| Standard avatar frame | 200 |
| Animated frame | 300-400 |
| Question-screen theme | 300 |
| Victory animation | 400-500 |
| Season exclusive | Earned via track/achievement, not bought |

Shop categories: frames, themes, emotes, titles, victory animations. Provide preview, owned/equipped status, price and affordability before purchase. Purchase must be atomic and idempotent.

## 7.6 Mentor boost conflict

Existing shop reportedly offers Mentor-token boosts at 150 and 350 coins. The proposed competition shop is cosmetics-only. Recommendation: do not sell functional boosts in the competitive shop; honour already-owned tokens and migrate without removing value. Owner approval required. If Mentor tokens remain elsewhere, isolate them from competitive match scoring and ranking.

## 7.7 Paid plans

Preserve described plans unless billing audit says otherwise:

- Free: 3 active battles.
- Plus: Rs 29/month, unlimited active battles.
- Pro: Rs 99/month, unlimited active battles.
- No auto-renewal (as owner-described; verify actual payment behaviour).

Subscription may affect non-competitive convenience or cosmetics only. It must not affect questions, score, matchmaking, Elo, Arena Points, coin earning, win probability or competitive access. Verify pricing/entitlement and consumer disclosure before release.

---

# 8. SOCIAL, FRIENDS, CLUBS AND SHARING

## 8.1 Friend presence states

Use truthful, server-backed states:

- Online / Available.
- In Lobby.
- In Match.
- Do Not Disturb / In Exam.
- Offline.

Do not infer “online now” from a stale last-seen timestamp. Respect privacy setting and presence opt-out. Display last seen only if owner-approved and privacy-safe.

## 8.2 Friend features

- Username search and add.
- Pending requests and accepted friends.
- Challenge live, async or scheduled.
- Accept, decline, play later, rematch.
- Block and report.
- Notification preferences.
- Clear error states when the user is unavailable or a match cannot be started.

## 8.3 Club features

Existing: 6-character join/create code, up to 30 members, weekly points board/rank.

Recommended improvements:

- Club badge and identity.
- Owner/leader, co-leader and member roles.
- Invite via code/share link.
- Member list with truthful status.
- Weekly contributions.
- Club achievements and history.
- Club War in V2/V3.
- Member kick/leave and leadership transfer policy.
- Report club and leave flow.

V1 chat recommendation: preset emotes/messages only (`GG`, `Well played`, `Rematch?`, `Ready?`, `Study together?`). Do not launch unrestricted free-text chat until reporting, moderation, blocking, rate-limits and retention policies are ready.

## 8.4 Spectating

Defer until V3. Proposed safety design:

- Friend-only opt-in.
- At least 30-second delay.
- Never show selected answer choices or correctness.
- No interaction with match.
- Visible SPECTATING label.
- No access to private question packs beyond delayed display approved by product owner.

## 8.5 Share card

Opt-in share card includes RENYXERA brand, match type, real outcome, marks, branch, season and user-selected display name/avatar. Never embed the entire question pack, private account IDs, or hidden integrity state.

Share options: Web Share API, WhatsApp share URL, download image, copy result link. Test mobile and desktop fallback paths. Sharing must not be forced.

---

# 9. GAME SHELL AND NAVIGATION ARCHITECTURE

## 9.1 Entry/exit boundary

When user clicks Battles:

- Transition out of standard app shell.
- Hide site nav, menus, banner, footer and study dock.
- Enter a full-screen `/battles` route group/layout.
- Use game-specific navigation.
- Keep an always-available Exit to Study action, not a browser trap.
- Preserve back-button expectations and warn before leaving an active match.

Recommended route architecture (adapt to repository):

```text
/battles                 Game home
/battles/play             Mode selection
/battles/matchmaking      Queue/waiting
/battles/match/[id]       Live/async/scheduled match shell
/battles/result/[id]      Result and analysis
/battles/arena            Rating and leagues
/battles/leaderboard      Leaderboards
/battles/season           Season track
/battles/friends          Friends and invitations
/battles/clubs            Club home/details
/battles/shop             Cosmetic shop
/battles/locker           Owned/equipped cosmetics
/battles/profile/[id]     Public profile card
/battles/settings         Game settings
```

These are proposed routes, not an instruction to rename existing routes blindly.

## 9.2 Global navigation

Mobile: bottom navigation with Home, Arena, Social, Profile; overflow for Club/Shop/Settings if needed. Keep a safe-area bottom inset.

Desktop: persistent left rail with Home, Arena, Social, Clubs, Shop, Profile and Exit to Study. Right-side panel may show online friends, invitations or event status when useful.

## 9.3 UI shell performance

- Keep countdown state isolated; do not cause all 65 question palette buttons to rerender each second.
- Separate match transport state from question editor state.
- Use selectors/memoization to subscribe only relevant components.
- Lazy-load nonessential avatars, cosmetic previews and large effects.
- Avoid expensive blur/backdrop effects on mid-range Android.
- Ensure focus does not get lost during route transitions.

---

# 10. SCREEN-BY-SCREEN UX SPECIFICATION

Every screen must have distinct mobile and desktop behaviour. The ASCII frames below are structural wireframes, not final visual design. Follow the art direction in Section 11.

## 10.1 Game launch transition

**Mobile**
```text
+--------------------------+
|                          |
|         RENYXERA         |
|            R             |
|                          |
|      THE CIRCUIT         |
|         ARENA            |
|       Entering...        |
|                          |
+--------------------------+
```
**Desktop**
```text
+--------------------------------------------------------+
|                                                        |
|                       RENYXERA                         |
|                                                        |
|                  THE CIRCUIT ARENA                     |
|                                                        |
|                   A MATCH AWAITS                       |
|                                                        |
+--------------------------------------------------------+
```

Mobile is vertical and logo-led; desktop uses a wide cinematic circuit sweep. Proposed 450-600ms transition. Never block the lobby waiting for nonessential assets.

## 10.2 Game home / lobby

**Mobile**
```text
+--------------------------+
| [AV] RENYXERA       [SET]|
| SEASON 01      17d LEFT  |
| CIRCUIT 1420             |
| [progress to next tier]  |
| +----------------------+ |
| |     RANKED ARENA     | |
| |     [FIND MATCH]     | |
| +----------------------+ |
| [FRIEND DUEL] [QUICK]   |
| PENDING CHALLENGES      |
| [Friend]       [ACCEPT] |
| DAILY MISSIONS          |
| [1/3 complete]          |
| [HOME][ARENA][SOCIAL][ME]|
+--------------------------+
```
**Desktop**
```text
+-----+---------------------------------------+----------+
|LOGO | SEASON / COINS / PROFILE              |          |
|HOME | ARENA RATING + NEXT TIER              | FRIENDS  |
|ARENA| [RANKED MATCH]                        | ONLINE   |
|SOCIAL| [FRIEND] [QUICK] [ASYNC]             | INVITES  |
|CLUB | MISSIONS / SEASON PROGRESS            | ACTIVITY |
|SHOP | RECENT MATCHES                        |          |
|EXIT |                                       |          |
+-----+---------------------------------------+----------+
```

Mobile makes Ranked and challenge tickets immediately accessible; desktop shows social activity simultaneously. Rating/season visible above fold.

## 10.3 Mode select

**Mobile:** vertical tiles: Ranked, Friend Duel, Quick Duel, Async, Scheduled, Daily Challenge. One fixed bottom action.  
**Desktop:** two/three-column tile grid with descriptions and hover/focus states. Keep only core modes prominent; reveal advanced modes lower down.

```text
MOBILE                    DESKTOP
+------------------+      +------------------------------+
| CHOOSE MODE      |      | SELECT YOUR MODE             |
| [RANKED ARENA]   |      | [RANKED]       [FRIEND DUEL] |
| [FRIEND DUEL]    |      | [QUICK]        [ASYNC]       |
| [QUICK DUEL]     |      | [SCHEDULED]    [DAILY]       |
| [ASYNC]          |      |                              |
| [SCHEDULED]      |      | [CONTINUE]                   |
| [CONTINUE]       |      +------------------------------+
+------------------+
```

## 10.4 Matchmaking / waiting

**Mobile:** centred avatar, radar, current rating/search range, elapsed timer, fixed Cancel Search.  
**Desktop:** player card, search animation, mode details and clear search state in separate zones.

Never show fake player cards or queue position. At 60 seconds show honest alternatives rather than looping indefinitely.

## 10.5 Match found + VS intro

**Mobile:** avatars stack vertically, large VS, match branch/question count.  
**Desktop:** opposing avatars, central VS, ratings/tier, branch and format side-by-side.

Show match-found only after server-confirmed match creation. No false “opponent found” animation for a placeholder.

## 10.6 Countdown

**Mobile:** large 3-2-1-GO centre number with compact player labels.  
**Desktop:** shared countdown between both player panels. Both derive it from the same server `start_at`, never from independent client timers.

## 10.7 In-match question screen

**Mobile**
```text
+--------------------------+
| ARENA  Q 04/10    10:23  |
| YOU 4/10     OPP 3/10    |
|--------------------------|
| QUESTION                 |
| [GATE question text]     |
| [image / equation]       |
| [A. option]              |
| [B. option]              |
| [C. option]              |
| [D. option]              |
| [palette / question nav] |
| [MARK] [SAVE]            |
| [PREVIOUS] [NEXT]        |
+--------------------------+
```
**Desktop**
```text
+------+--------------------------------+-------------+
| GRID | ARENA / TIMER / PROGRESS       | OPPONENT    |
| 01   | QUESTION 04                   | [AVATAR]    |
| 02   | [GATE question]                | 3/10 done   |
| 03   | [image / equation]             | CONNECTED   |
| 04   | [options or NAT]               |             |
| 05   | [MARK][SAVE][PREV][NEXT]       |             |
+------+--------------------------------+-------------+
```

Retain exam engine question content, images, LaTeX, MCQ/MSQ/NAT control behaviour and navigation. Add only game context: match header, opponent progress, timer and optional low-distraction reaction. Do not reveal correctness, marks or answer choices of opponent. Opponent progress must be isolated from question-body state to avoid whole-screen rerenders.

## 10.8 Between-question feedback

Mobile: brief “Answer saved” toast and progress count. Desktop: small non-blocking notification. Approx. 500ms maximum. Never reveal correctness during live competition.

## 10.9 Results: win / loss / draw

**Mobile:** headline, both marks, rating/coin/point deltas, buttons for Analysis, Rematch, Home.  
**Desktop:** both player result columns, subject mark breakdown, reward row and side-by-side analytics.

Win: controlled celebration. Loss: respectful and improvement-oriented. Draw: symmetrical shared result. No humiliating red screen.

## 10.10 Rewards and level-up

Mobile: vertical reveal of coins, XP, points and unlock with Equip/Continue. Desktop: horizontal reward row and cosmetic preview. No wheel, loot box or random spinner.

## 10.11 Arena / leagues

Mobile: tier, rating, progress to next tier, season rank, Ranked button, leaderboard/track links. Desktop: rating history, tier progression, recent matches and season position in multi-zone layout. Ranked entry must remain visible.

## 10.12 Season track

Mobile: vertical scroll path with reward nodes and XP bar. Desktop: horizontal 10-step path with missions beside it. Show exact reward and XP requirement; no premium track.

## 10.13 Leaderboard

Mobile: Global/Friends tabs, top-three podium and sticky own rank. Desktop: full-width table with filters and own-position panel. Support empty state and pagination; never fill with fake profiles. Filter by branch/season only if data supports it.

## 10.14 Clubs

Mobile: club identity, weekly rank, code, contribution, members and actions. Desktop: club performance, member activity, top contributors and rewards. Chat uses preset emotes in V1.

## 10.15 Friends

Mobile: username search, online friends, pending challenge cards and friend list. Desktop: search/add, online panel, pending challenges and full friend table. Clear Online/In Match/Do Not Disturb/Offline states.

## 10.16 Shop / locker

Mobile: coin balance, category tabs, two-column item grid, bottom-sheet preview. Desktop: category rail, catalogue, large preview and equipped locker. Display price and owned state. No deceptive scarcity timer.

## 10.17 Profile card

Mobile: avatar, username, tier/rating, level, club, badges and challenge/friend action. Desktop: add match history and subject summary. Public profile data must be privacy-filtered.

## 10.18 Settings / sound

Mobile: large toggles for master/music/effects, haptics, reduced motion, presence and notifications. Desktop: grouped Audio, Accessibility, Social and Game panels. Sound muted by default. User preferences persist.

## 10.19 Exit to Study

Mobile: bottom-sheet confirmation. Desktop: centred dialog. Explain whether an active match continues, whether leaving causes forfeit, and whether current answers are saved. Never silently submit or abandon an attempt.

## 10.20 Additional essential screens (add to scope)

The previous list is not enough for production completeness. Add these screens/states:

- Match invitation accepted/declined/expired.
- Ready lobby with both readiness indicators.
- Opponent disconnected/reconnecting.
- You disconnected/reconnecting.
- Match voided/cancelled with explanation.
- Match expired and auto-finalised.
- Async challenge ticket inbox/outbox.
- Schedule confirmation, reschedule and no-show resolution.
- Empty matchmaking / no eligible opponent.
- Network unavailable / offline retry.
- Question failed to load / image fallback.
- Submission pending / server acknowledgement / retry.
- Result pending finalisation.
- Reward transaction retry without duplicate payout.
- Shop insufficient coins / purchase success / purchase failure.
- Club full / invalid code / role permissions.
- Friend request blocked / already friends / privacy restricted.
- Notification preferences and system permission explanation.
- User block/report flows.
- Maintenance or Realtime quota degraded-mode notice.

Do not ship only the happy path.

---

# 11. VISUAL DESIGN SYSTEM: CIRCUIT AFTERHOURS

## 11.1 Concept

An engineering control room operating late at night: blueprint grids, precise panels, subtle circuit traces, ambient light and controlled competitive highlights. Avoid generic black/neon gamer aesthetic, excessive blur and stadium clichés.

## 11.2 Palette

| Token | Hex | Usage |
|---|---|---|
| Arena Midnight | `#111429` | Dark game background |
| Circuit Slate | `#202443` | Panels and surfaces |
| Royal Circuit | `#5146C8` | Primary action/brand accent |
| Signal Cyan | `#22D3EE` | Progress and active state |
| Soft Violet | `#A99AF7` | Secondary highlight |
| Ice White | `#E9EDF9` | Dark-mode text/surface |
| Victory Amber | `#FFB86B` | Success/reward accent |

Create a light variant using ice-white/lavender surfaces and subtle blueprint lines. Respect system/user theme; do not force dark mode.

## 11.3 Typography

- Sora: display, league, rating, game headers.
- Manrope: body, questions, controls, labels.
- Bruno Ace SC: wordmark and logo lockup only.
- Use tabular numerals for rating, timers, score and currency.

## 11.4 Materials

- Background: restrained grid/blueprint texture.
- Panels: surface contrast and fine borders, not large heavy shadows.
- Primary CTA: violet/blue gradient.
- Active progress: cyan.
- Tier identity: controlled tier-specific accent.
- Winner: amber + violet; loss: muted lavender; draw: neutral.
- Avoid overusing gradients on every card.

## 11.5 Iconography

Use a consistent outline family, 1.75-2px strokes, rounded joins, 24px base grid. Filled version only for active states or strong status. Icons need text labels where meaning is not obvious.

---

# 12. MOTION, AUDIO AND HAPTICS

## 12.1 Key motions

| Motion | Duration | Behaviour |
|---|---:|---|
| Enter Arena | 450ms | Site shell fades, game shell expands |
| Lobby cards | 250ms | Subtle upward reveal |
| Button press | 100ms | Scale to 0.97 and return |
| Radar | 3-4s loop | Slow low-cost orbit |
| Match found | 450ms | Player panels move inward |
| VS emblem | 350ms | Scale/opacity reveal |
| Countdown | 650ms per number | Controlled number reveal |
| Question transition | 180ms | Short fade/slide |
| Opponent progress | 250ms | Smooth bar update |
| Victory | 700-1200ms | Score reveal and restrained particles |
| Tier promotion | 700ms | Badge and progress transition |

Use `motion/react` only for high-value interactions. CSS transitions are preferable for simple state changes. No 3D unless measured on target phones.

## 12.2 VS choreography

- 0-150ms: lobby recedes; game backdrop appears.
- 150-450ms: player identities enter from opposite sides (or top/bottom mobile).
- 450-700ms: VS emblem appears.
- 700-1000ms: display names, tiers, ratings and branch.
- 1000-1400ms: display question count and mode.
- Then 3-2-1-GO from shared server timestamp.

Keep the intro short; it must not become a long cinematic before every match.

## 12.3 Audio

Muted by default. Original Web Audio API synthesis or properly licensed/CC0 audio only.

Suggested sounds: menu tap, button press, match found, countdown pulses, GO, answer saved, victory flourish, neutral draw, non-punitive loss, coin earned, level-up and tier promotion. Keep sounds short, compressed and optional. Never use copyrighted game sound effects or music.

## 12.4 Haptics

Optional Vibration API if supported and enabled. Example patterns:

```js
const HAPTICS = {
  button: [12],
  countdown: [18],
  matchFound: [25, 35, 25],
  victory: [30, 25, 45],
  levelUp: [20, 30, 60],
};
```

The browser/device may ignore vibration requests. Treat haptic feedback as enhancement only.

## 12.5 Reduced motion

- Replace translations with quick opacity changes.
- Remove particles and looping radar.
- Replace animated countdown with static number swaps.
- Keep score, timing and state changes clear.
- Sound and haptics are independent preferences.

---

# 13. TECHNICAL ARCHITECTURE

## 13.1 Architecture principles

- The browser is an untrusted presentation client.
- Realtime is event transport and presence, not source of truth.
- PostgreSQL is the durable source of truth for matches, answers, ratings, rewards and progression.
- Trusted server handlers validate mutations and invoke transactional database functions where atomicity matters.
- Reuse current auth, question, exam, friend and club services if they are sound.
- Do not build separate exam grading logic for Battles.
- Keep APIs typed, validated and idempotent.

## 13.2 High-level architecture

```text
MOBILE PWA / DESKTOP BROWSER
  Next.js 16 + React 19 + Tailwind v4 + motion/react
  Zustand or existing state manager
        | HTTPS authenticated actions
        v
CLOUDFLARE WORKERS / TRUSTED SERVER ROUTES
  Auth check -> input validation -> business rules
  -> transactional RPC / DB operations
        |                         \
        v                          \ Realtime Broadcast
SUPABASE POSTGRESQL                 -> PRIVATE MATCH CHANNEL
  match state                         -> opponent progress
  question pack mapping               -> countdown/status events
  answer records                      -> connection notices
  scoring + Elo + rewards
  RLS policies
        ^
        | authenticated realtime snapshot / reconciliation
CLIENT PRESENCE + BROADCAST SUBSCRIPTIONS
```

Cloudflare Workers and Supabase roles must be separated carefully. Do not put Supabase secret/service keys in client bundles. Determine the safest server-side credential pattern using current provider documentation and repository setup.

## 13.3 Realtime mechanism selection

| Mechanism | Use |
|---|---|
| Broadcast | Match events and compact progress updates |
| Presence | Lobby/friend online state and connection indication |
| Postgres Changes | Limited subscriptions where persistence-driven changes are genuinely needed |
| REST/Worker API | Trusted mutations and authoritative snapshots |

Prefer private Broadcast channels for low-latency events. Use RLS on `realtime.messages` to authorise channel reads/writes and Presence. Disable public channel access where these channels are private. See R4-R6.

Presence is not a timer. Do not update presence every second. Use it for real status transitions, not answer progress.

## 13.4 Channel design

Proposed topics:

- `match:{match_id}`: only the match participants.
- `friends:{user_id}`: user-specific social events, subject to friend/privacy rules.
- `club:{club_id}`: authorised club members.
- `arena:lobby:{branch}`: only if a real matchmaking presence use case exists; do not broadcast sensitive queue membership.

Use one shared client connection and multiplex subscriptions where the SDK and app lifecycle allow. Remove channels on route exit and clean up subscriptions.

## 13.5 Event contract

| Event | Direction | Meaning |
|---|---|---|
| `match.ready.requested` | Client -> API | User asks to Ready |
| `match.countdown_started` | Server -> participants | Shared start timestamp |
| `match.started` | Server -> participants | Server active state |
| `match.progress` | Server -> opponent | Accepted answer count only |
| `match.answer_saved` | Server -> submitting player | Acknowledgement/version |
| `match.player_disconnected` | Server -> opponent | Connectivity state |
| `match.player_reconnected` | Server -> opponent | Reconnected state |
| `match.player_submitted` | Server -> participants | Submission completion |
| `match.finalizing` | Server -> participants | Results being calculated |
| `match.completed` | Server -> participants | Final result ready |
| `match.cancelled` | Server -> participants | Cancellation/void reason |

Event payloads are versioned, compact and non-sensitive. Do not include answer keys, answer payloads or secret moderation metadata.

Example:

```json
{
  "event": "match.progress",
  "matchId": "uuid",
  "playerId": "uuid",
  "answeredCount": 4,
  "totalQuestions": 10,
  "serverTimestamp": "2026-11-14T10:00:00Z",
  "version": 12
}
```

## 13.6 Match state machine

Use a documented state machine and enforce transitions on the server.

```text
DRAFT
  -> INVITED / QUEUED
     -> LOBBY
        -> READY_CHECK
           -> COUNTDOWN
              -> ACTIVE
                 -> FINALIZING
                    -> COMPLETED

INVITED -> DECLINED / EXPIRED / CANCELLED
QUEUED -> MATCHED / CANCELLED / TIMED_OUT
LOBBY -> CANCELLED / EXPIRED
ACTIVE -> FINALIZING (deadline or both submitted)
ACTIVE -> VOIDED only for explicitly defined server/system failure policy
FINALIZING -> COMPLETED or NEEDS_REVIEW (never silently back to ACTIVE)
```

Transitions must be idempotent, validated and audit logged. Do not permit arbitrary client status writes.

## 13.7 Shared start and deadline

1. Both players send Ready requests to trusted API.
2. Server confirms both belong to match and status is `READY_CHECK`.
3. Server writes one `start_at` six seconds in the future.
4. Both receive same timestamp.
5. Clients render relative countdown using server-time offset/snapshot.
6. Server accepts answers only from valid participants and only during allowed state/time window.
7. Server `deadline_at` decides expiry; client timer is visual only.

Do not use two independent `setTimeout(6000)` timers as the authority.

## 13.8 Answer submission flow

```text
Select answer
 -> Submit with matchId, questionId, answer, clientAttemptId
 -> Server authenticates and checks membership
 -> Check match status and server deadline
 -> Validate question belongs to this match and current rules
 -> Validate answer format by MCQ/MSQ/NAT
 -> Idempotently insert/update allowed answer record
 -> Return server acknowledgement and state version
 -> Broadcast accepted answered count
 -> Finalize when both submitted or deadline reached
 -> Grade from trusted answer key
 -> Calculate result, Elo and rewards in one transaction
 -> Persist result and ledger entries
 -> Publish final result event
```

Retries must not duplicate accepted answers, score changes or rewards. Decide whether answer changes are allowed before deadline; mirror existing exam-engine behaviour or document an approved game-specific rule. Do not silently overwrite an answer after match close.

## 13.9 Disconnect/reconnect

- Deadline continues during disconnect; do not pause for one player.
- Persist accepted answers immediately.
- Reconnection: rejoin private channel, fetch authoritative snapshot, compare version, reconcile UI, resume if active and before deadline.
- Proposed 60-second opponent grace indicator is informational only; it does not extend the match deadline.
- After deadline, server grades accepted answers; missing answers = zero.
- Do not instantly forfeit based on a single lost socket.
- Define ranked no-show/void policy after audit and owner approval.

## 13.10 Question/answer-key security

This is a critical audit item. A server grading function is ineffective if the browser already downloaded the correct answer key.

- Inspect whether the current question bank is shipped as public JSON/static assets.
- The match client receives a presentation-only projection: question text, options, images, LaTeX, marks, type and non-secret metadata.
- Answer key, NAT accepted answer/range and grading metadata stay in a trusted server-only source.
- If the original dataset is immutable, do not alter its structure; create a derived secure view/projection or a server-side lookup layer. Do not expose full original data simply because it is the source of truth.
- Never put the answer key in Broadcast events, page props, HTML, hydration payloads, source maps or client-accessible caches.
- Review all API responses and static asset paths for leaks.

## 13.11 Integrity signals

Record:

- document visibility changes and timestamps,
- focus/blur events where useful,
- repeated network disconnects,
- late/duplicate/invalid submissions,
- nonparticipant requests,
- unexpected state transitions,
- unusual repeated opponent pairings,
- repeated reward claims.

Do not auto-disqualify on tab switch alone. Mobile OS interruptions and accessibility tools can trigger focus changes. Signals support review, not automatic guilt.

---

# 14. DATABASE DESIGN AND DATA INTEGRITY

Claude must inspect and reuse existing tables before proposing migrations. The following is a logical design, not a command to duplicate tables.

## 14.1 Proposed core tables

### `game_matches`

- `id UUID PRIMARY KEY`
- `match_type TEXT`
- `status TEXT`
- `branch TEXT`
- `created_by UUID`
- `question_set_hash TEXT`
- `question_count INTEGER`
- `time_limit_seconds INTEGER`
- `scheduled_at TIMESTAMPTZ NULL`
- `start_at TIMESTAMPTZ NULL`
- `deadline_at TIMESTAMPTZ NULL`
- `expires_at TIMESTAMPTZ NULL`
- `winner_id UUID NULL`
- `result_summary JSONB NULL` (non-secret result projection only)
- `finalized_at TIMESTAMPTZ NULL`
- `version INTEGER NOT NULL DEFAULT 0`
- `created_at`, `updated_at TIMESTAMPTZ`

### `game_match_participants`

- `match_id UUID`
- `user_id UUID`
- `side SMALLINT`
- `status TEXT`
- `ready_at TIMESTAMPTZ NULL`
- `submitted_at TIMESTAMPTZ NULL`
- `rating_before INTEGER NULL`
- `rating_after INTEGER NULL`
- `rating_delta INTEGER NULL`
- `arena_points_awarded INTEGER NOT NULL DEFAULT 0`
- `coins_awarded INTEGER NOT NULL DEFAULT 0`
- `last_seen_at TIMESTAMPTZ NULL`
- unique `(match_id, user_id)`
- unique `(match_id, side)`

### `game_match_questions`

- `match_id UUID`
- `question_id TEXT/UUID` (match existing question ID type)
- `ordinal INTEGER`
- `max_score_units INTEGER`
- `subject TEXT`
- `section TEXT`
- `difficulty TEXT NULL`
- unique `(match_id, ordinal)`
- unique `(match_id, question_id)` unless duplicate questions are explicitly allowed.

### `game_match_answers`

- `id UUID`
- `match_id UUID`
- `user_id UUID`
- `question_id TEXT/UUID`
- `answer_payload JSONB`
- `accepted_at TIMESTAMPTZ`
- `client_attempt_id UUID/TEXT`
- `answer_version INTEGER`
- unique `(match_id, user_id, question_id)` for one final current answer, plus idempotency key constraints.

### `arena_ratings`

- `user_id UUID`
- `branch TEXT` if rating is branch-specific (owner decision)
- `rating INTEGER NOT NULL DEFAULT 1000`
- `peak_rating INTEGER`
- `matches_played INTEGER`
- `updated_at TIMESTAMPTZ`
- unique `(user_id, branch)` or `(user_id)` depending approved rating model.

### `arena_season_points`

- `user_id UUID`
- `season_id UUID`
- `points INTEGER`
- `eligible_matches INTEGER`
- `updated_at TIMESTAMPTZ`
- unique `(user_id, season_id)`.

### `game_coin_ledger`

- `id UUID`
- `user_id UUID`
- `match_id UUID NULL`
- `transaction_type TEXT`
- `amount INTEGER`
- `idempotency_key TEXT UNIQUE`
- `metadata JSONB`
- `created_at TIMESTAMPTZ`

### `game_integrity_events`

- `id UUID`
- `match_id UUID`
- `user_id UUID`
- `event_type TEXT`
- `metadata JSONB` (minimise personal data)
- `occurred_at TIMESTAMPTZ`

## 14.2 Supporting tables (reuse equivalents where they exist)

- `game_seasons`
- `game_missions`
- `game_mission_progress`
- `game_cosmetics`
- `game_user_inventory`
- `game_user_equipped_cosmetics`
- `game_reward_ledger` or unified reward/coin ledger
- `game_match_invites`
- `game_notifications` or existing notification system
- `game_club_weekly_scores`
- `game_reports` / moderation queue

## 14.3 Transaction boundaries

The following must be atomic:

- Create match and participant records.
- Confirm Ready and set shared start time.
- Accept answer and update authoritative answer state.
- Finalise match, grade answers, determine result, update both Elo ratings, grant Arena Points, grant coins, update season and mission progress, and mark match complete.
- Purchase cosmetic, deduct coins and create inventory entry.

Use stored procedures/RPC or equivalent transactional server path. Use unique idempotency constraints to prevent double processing.

## 14.4 Indexes to evaluate

- `game_matches(status, deadline_at)` for finalisation queue.
- `game_matches(match_type, branch, status, created_at)` for matchmaking if queue is DB-backed.
- `game_match_participants(user_id, match_id)`.
- `game_match_answers(match_id, user_id)`.
- `arena_ratings(branch, rating DESC)` or equivalent.
- `arena_season_points(season_id, points DESC)`.
- `game_coin_ledger(user_id, created_at DESC)`.
- `game_match_invites(receiver_id, status, expires_at)`.

Confirm query plans on realistic row counts. Do not add indexes mechanically without checking write cost and query use.

## 14.5 RLS policy matrix

| Resource | Player read | Player write | Trusted server |
|---|---|---|---|
| Match | Only if participant | Only approved action through API/RPC | Full controlled operations |
| Participants | Own fields + opponent safe projection | Ready/leave request through API | Full |
| Match questions | Only questions assigned to participant | None | Pack creation/grading access |
| Answers | Own accepted answers; opponent count only | Submit through trusted validation path | Full grading access |
| Rating | Own rating/public safe leaderboard data | Never direct | Update transactionally |
| Season points | Public/approved leaderboard fields | Never direct | Update transactionally |
| Coin ledger | Own ledger only | Never direct | Insert transactionally |
| Integrity events | No player access to raw signals | No direct write | Insert/read by authorised reviewer |
| Cosmetics | Public catalogue + own inventory | Purchase/equip through trusted action | Full |
| Club | Members only based on role | Approved actions | Full |

The public leaderboard must use a safe view that excludes emails, internal IDs where unnecessary, private analytics and moderation flags.

---

# 15. API AND SERVICE CONTRACTS

Claude must map existing API routes before introducing duplicates. Names below are illustrative.

| Action | HTTP / RPC concept | Required behaviour |
|---|---|---|
| Create friend match | POST `/api/battles` | Auth, eligibility, pack generation, participant rows |
| Send invite | POST `/api/battles/:id/invite` | Friend permissions, expiry, idempotency |
| Accept invite | POST `/api/battles/:id/accept` | Validate invitation state and membership |
| Join lobby | POST `/api/battles/:id/join` | Participant check; safe snapshot |
| Ready | POST `/api/battles/:id/ready` | Record readiness; set shared start if both ready |
| Get snapshot | GET `/api/battles/:id` | Participant-safe authoritative state |
| Submit answer | POST `/api/battles/:id/answers` | Validate state, deadline, question and format |
| Submit match | POST `/api/battles/:id/submit` | Mark player submission idempotently |
| Finalise | Trusted internal/RPC | Grade, Elo, points, coins, missions in one transaction |
| Rematch | POST `/api/battles/:id/rematch` | New match; enforce mode policy |
| Cancel/forfeit | POST `/api/battles/:id/cancel` | Only allowed transitions; audit reason |
| Matchmaking join | POST `/api/arena/queue` | Branch/rating/eligibility checks |
| Matchmaking cancel | DELETE `/api/arena/queue/:id` | Remove queue request safely |
| Profile/leaderboard | GET | Privacy-safe projections |
| Buy cosmetic | POST `/api/shop/purchase` | Atomic debit + inventory insertion |

Use schema validation (e.g. Zod or current project standard), authentication, rate limits and explicit status codes. Never rely on frontend-only button disabling for security.

---

# 16. MATCHMAKING, FAIRNESS AND EDGE CASES

## 16.1 Match pack fairness

- Same pack ID/hash, question IDs and order for both players.
- Same time limit and start/deadline rule.
- Record pack generation algorithm/version.
- Verify the pack belongs to the chosen branch/mode.
- Use balanced marks, subjects and difficulty for generated packs.
- Do not duplicate a question within the same pack.
- Consider excluding recently seen questions in ranked mode; owner must approve the lookback window and its fairness impact.
- If question pack creation fails, do not create a partial match.

## 16.2 Matchmaking fairness

- Avoid repeatedly matching the same two players when a sufficiently large pool exists.
- Prevent self-match and duplicate active matches.
- Use server-side eligibility, branch, rating, queue age, connection and active-match limits.
- Do not make paid plan a ranking or match-quality advantage.
- Define how to handle rating gap expansion and queue cancellation races.
- Queue expiration must clean up stale rows.

## 16.3 No-shows and disconnects

Create explicit result types: Completed, Draw, Forfeit, No-show, Cancelled, Voided, System Error, Needs Review. Do not collapse all to loss.

Before launch, decide:

- Ranked match no-show policy.
- Whether a match can be voided after server outage.
- Whether one player disconnecting for the full match yields forfeit or score result.
- Whether reconnect grace affects UI only or eligibility.
- How appeals/disputes work.

Recommendation: deadline still runs; grade accepted answers; if one player never started due a confirmed system error, void rather than award fake win. Get owner approval.

## 16.4 Abuse prevention

- Server-side active match limits by plan.
- Queue/request rate limits.
- Invite spam cooldown.
- Friend-pair farming detection.
- Repeat-opponent Elo review.
- Coin and mission idempotency.
- No direct client DB write for rewards/rating.
- Account-level suspicious activity event aggregation.
- Manual review and appeal/appeals policy before punishment.

---

# 17. ONBOARDING

Recommended first-session flow:

1. Welcome to Arena; show starting rating 1000, branch and the difference between GATE score and Arena rating.
2. Offer a clearly labelled Daily Challenge (solo) or real friend duel. Do not fabricate a bot/opponent.
3. Reveal tier progression, Arena Points, coins and result analysis after completion.

Three-step tutorial:

- Step 1: answer and navigate questions.
- Step 2: shared timer and opponent progress.
- Step 3: GATE score, result, rating and rewards.

Use three sample questions for the tutorial. It must not create a ranked result, fake opponent or ranked reward.

Practice bots are an owner decision and must be explicitly labelled unranked if added.

---

# 18. ROADMAP AND RELEASE PLAN

## 18.1 V1 - 14-day target (one developer + AI assistant)

This is a proposed aggressive scope, not a guarantee. First audit the current implementation and estimate actual work. Reuse live backend functions and avoid backend rewrites unless audit finds a critical integrity problem.

| Days | Focus | Deliverables |
|---|---|---|
| 1-2 | Audit + game shell | Existing app audit, full-screen layout, responsive shell, navigation, exit |
| 3-4 | Lobby + Arena | Home, tier/rating/season card, friends, pending challenges |
| 5-6 | Match presentation | Mode select, waiting, VS, countdown, in-game progress integration |
| 7-8 | Results | Win/loss/draw, rewards, Elo view, subject breakdown, rematch |
| 9-10 | Social/progression | Leaderboard, friends, club, shop/locker, profile |
| 11-12 | Polish/accessibility | Audio, haptics, reduced motion, keyboard, screen readers |
| 13-14 | QA/release | Android, desktop, network, RLS, scoring, deployment validation |

V1 screens: launch, game home, mode select, matchmaking, match found, countdown, question screen, between-question acknowledgement, result, rewards, Arena, leaderboard, season summary, clubs, friends, shop/locker, profile, settings and exit. Add critical error/empty/reconnect states from Section 10.20.

If Quick Duel can reuse the same match engine with a fixed preset, include it; otherwise do not fork grading architecture to force it into V1.

## 18.2 V2 - competitive ecosystem

- Daily Challenge.
- Free season track.
- Daily/weekly missions.
- Subject Duel.
- Result-card sharing.
- Club War.
- Club emotes and club activity history.
- Improved match history and topic insights.

## 18.3 V3 - advanced ecosystem

- Small tournaments and brackets.
- Delayed friend spectating.
- Advanced club league.
- Labelled practice bots if owner-approved.
- Deep match insights and trend detection.
- Moderated text chat only if a real moderation plan exists.

## 18.4 What NOT to build in V1

- Unrestricted club chat.
- Spectating.
- Tournament engine.
- Bots.
- Paid battle pass.
- Loot boxes.
- 3D arena requiring high GPU.
- New AI competitor.
- Separate question grading system.
- Large mission catalogue.
- Heavy animation package.
- New analytics backend if existing reports can be reused.

---

# 19. TESTING, ACCEPTANCE CRITERIA AND RELEASE GATES

## 19.1 Scoring test matrix

Test at minimum:

- 1-mark MCQ correct/incorrect/unanswered.
- 2-mark MCQ correct/incorrect/unanswered.
- -1/3 and -2/3 exact arithmetic.
- MSQ exact set vs missing vs extra option.
- NAT inside/outside/at range boundaries and formatting.
- Zero marks and negative score cases.
- Equal exact score tie.
- Different marks with same rounded display score.
- Pack maximum marks consistency.
- Result rendering from authoritative stored result.

## 19.2 Rating/reward tests

- Win/draw/loss Elo update with K=24.
- Two-player transaction atomicity.
- Rating update race / duplicate finalisation.
- 10 point-earning battle cap.
- 5 proposed coin cap if approved.
- Same-pair cooldown if approved.
- Day boundary and IST display.
- Seventh-day coin interpretation.
- Season reset without Elo reset.
- Mission double-completion prevention.
- Shop debit + inventory grant atomicity.
- Retry cannot duplicate reward.

## 19.3 Realtime/lifecycle tests

- Both players ready.
- Only one player ready; no start.
- Same server start timestamp on both clients.
- Countdown with client clock skew.
- Progress update cadence.
- One player disconnects in lobby.
- Disconnect during active match.
- Reconnect before deadline.
- Reconnect after deadline.
- Duplicate progress/out-of-order events.
- Channel join failure and re-subscribe.
- User opens same match in two tabs/devices.
- Match finalised by cron when no one returns.
- Late join rejected.
- Both submit near deadline.
- One submit request races deadline.

## 19.4 Security tests

- Nonparticipant reads match.
- Nonparticipant joins private channel.
- Client writes rating/points/coins directly.
- Client supplies fake score/winner/delta.
- Client requests secret answer key.
- Client changes match state.
- Expired/invalid token.
- Duplicate idempotency key.
- Forged user ID.
- Ineligible subscription attempts to exceed active match limit.
- Public leaderboard leaks email/private metadata.
- Public storage includes answer key.
- Broadcast includes private answer payload.

## 19.5 Responsive/accessibility tests

- Android installed PWA at 360px, 390px and 430px widths.
- Desktop 1280px, 1440px and 1920px.
- Tablet/intermediate 768-1023px.
- Landscape phone edge case.
- On-screen keyboard on NAT input.
- Browser zoom to 200% where reasonable.
- Keyboard-only navigation.
- Focus order and focus trap in dialogs.
- Screen-reader labels for timer, answer controls, status and actions.
- Contrast for disabled/active states.
- `prefers-reduced-motion`.
- Sound disabled and unavailable.
- Vibration API unavailable.

## 19.6 Performance targets (proposed)

- 60fps target for short primary animations on a mid-range Android device; confirm by device profiling.
- No full question-screen rerender for timer/progress updates.
- Avoid unbounded Realtime subscriptions.
- Lazy-load nonessential cosmetics and heavy images.
- No oversized animation library or 3D scene in initial bundle.
- Stable layout (no major content shift) while question media loads.
- Use React profiling and browser performance tools rather than claiming 60fps without measurement.

## 19.7 Release gate

Do not ship if any of the following is true:

- Client can alter final score, Elo or rewards.
- Answer key is exposed to match client.
- Match can be finalised twice with duplicate reward.
- RLS permits nonparticipant access.
- Two clients can start at inconsistent times.
- Critical reconnect case loses accepted answers.
- Major match controls fail on target mobile width.
- Reduced motion is broken.
- A paid plan provides competitive advantage.
- Fake users or queue counts are displayed.
- Build/type/lint/test checks fail without an explicitly accepted and documented exception.

---

# 20. CLAUDE SKILLS, SUBAGENTS AND WORKING METHOD

Claude should use specialist skills rather than trying to solve product design, realtime security, visual UX and QA as one undifferentiated task. Claude Code supports project-local skills under `.claude/skills/<skill-name>/SKILL.md`, project guidance through `CLAUDE.md`, and specialist subagents under `.claude/agents/`. Verify current syntax with official docs and `/skills` or `/agents` before use. See R7-R9.

## 20.1 Required project-local skills

Create or use these skills in `.claude/skills/`. The companion ZIP supplied with this document contains starter `SKILL.md` files.

| Skill | When Claude should invoke it | Required output/work |
|---|---|---|
| `renyxera-product-guardian` | Every product or architecture change | Protects confirmed features, distinguishes facts/proposals, maintains decisions and scope |
| `competitive-game-design` | Modes, rating, progression, rewards, matchmaking | Game loop, fairness, economy simulation, abuse analysis, owner decisions |
| `game-ui-ux` | Screens, interaction, responsive shell and visual design | Mobile/desktop wireframes, states, component plan and usability audit |
| `nextjs-react-architecture` | Routing, components, server/client boundary, state | Repository-aligned architecture, component boundaries, performance review |
| `supabase-realtime-engineering` | Live match, Presence, Broadcast, reconnect, channel policy | Event contract, subscription lifecycle, state reconciliation, quota analysis |
| `supabase-rls-security` | Every DB schema/RPC/RLS change | Threat model, access matrix, RLS test cases, secret-key audit |
| `competitive-integrity-economy` | GATE grading, Elo, coins, missions, leaderboards | Exact arithmetic, transaction boundaries, anti-farming, idempotency tests |
| `pwa-mobile-performance` | PWA, viewport, offline/reconnect, motion, rendering | Android performance audit, safe-area/keyboard states, bundle and network budget |
| `accessibility-audit` | Menus, question screen, dialogs, navigation | Keyboard, screen-reader, contrast, reduced-motion and focus checklist |
| `quality-release-gate` | Every release/PR | Runs tests/build and verifies acceptance criteria; reports failures honestly |
| `cloudflare-deployment-compatibility` | Build/deploy/adapter change | Checks Next.js feature compatibility, Workers limits and rollback plan |

## 20.2 Required specialist subagents

Use subagents for isolated audits and independent review. They must return file paths, evidence and actionable findings, not unsupported summaries.

| Subagent | Responsibility |
|---|---|
| `product-auditor` | Read existing product and compare to this spec; read-only before approval |
| `frontend-game-architect` | Game shell, responsive components and visual consistency |
| `realtime-backend-engineer` | Match state, Realtime channels, server actions and reconnection |
| `security-reviewer` | RLS, answer-key leaks, secrets, direct writes, abuse paths |
| `qa-performance-engineer` | Test matrix, device tests, profiling and release gate |
| `game-economy-analyst` | Simulate coin/rating/mission balance and farming scenarios |

The main Claude agent remains accountable for integration and should reconcile conflicting subagent findings rather than blindly accepting them.

## 20.3 Official vendor skill

Cloudflare's current Next.js-on-Workers guide documents an official vinext Agent Skill installation workflow:

```bash
npx skills add cloudflare/vinext
```

Use it only if the project is actually targeting vinext and after inspecting the repository and reviewing any installed skill files. Do not migrate a working OpenNext or other deployment path without a measured compatibility reason and owner approval. See R1-R2.

Do not blindly install random community skills. Review their source, scripts, requested permissions and network actions before installation. Treat skills as executable project instructions, not harmless marketing snippets.

## 20.4 Claude Code instruction files

Use:

- `CLAUDE.md` for always-on project constraints, stack, commands, folder structure and “do not violate” rules.
- `.claude/skills/*/SKILL.md` for detailed workflows loaded when relevant.
- `.claude/agents/*.md` for isolated specialist roles.
- Hooks only for deterministic guardrails such as running formatter/test scripts or blocking secret-file reads; do not rely on a prose instruction for a hard security boundary.
- `.claude/settings.json` for shared project permissions/hooks only after reviewing the current settings schema. Never commit personal API keys or local credentials.

## 20.5 Required Claude workflow

### Phase 0 - Understand

- Read this entire handoff.
- Inspect repository and current running app.
- Map routes, tables, RPCs, RLS, workers, environment variables by name only (never reveal values), feature flags and tests.
- Identify current deployed framework and adapter.
- Inspect whether question answers are public.
- Do not modify code.

### Phase 1 - Plan

- Produce As-Is/To-Be matrix.
- Identify smallest useful V1.
- Create file-by-file plan and migrations in draft only.
- Identify dependencies and rollback steps.
- Mark owner decisions.
- Estimate work per task; do not claim certainty without inspection.

### Phase 2 - Implement thin vertical slices

1. Full-screen game shell with Exit to Study.
2. Lobby and Arena summary using existing data.
3. Live match screen integration with existing question engine.
4. Realtime progress and reconnect snapshot.
5. Result and rewards using existing trusted services.
6. Social/club/shop/season presentation.

After each slice: test, build, browser-check and report.

### Phase 3 - Harden

- RLS and answer key review.
- Idempotency and transaction review.
- Network and disconnect tests.
- Mobile performance/accessibility.
- Free-tier quota review.

### Phase 4 - Release

- Run full release gate.
- Verify deployment and migrations.
- Provide rollback instructions.
- Report known limitations and metrics to monitor.

## 20.6 Prompt for Claude to begin the project

Copy this prompt after providing Claude with the companion handoff and the repository:

```text
You are the principal product engineer, competitive-game designer, senior Next.js architect, Supabase Realtime/security engineer and QA lead for RENYXERA Battles.

Read RENYXERA_Battles_Claude_Handoff.md completely before doing anything. Then inspect the full repository, current database schema, migrations, RLS policies, functions/RPCs, API routes, current deployed app and current design system. Use the project skills in .claude/skills and specialist subagents in .claude/agents where available.

IMPORTANT: Do not code yet. First return the required Phase 0 audit:
1. Existing product and code architecture.
2. Feature-by-feature audit of all live Battles/Arena functionality.
3. Current match state machine and scoring/reward implementation.
4. Current question data flow and whether answer keys leak to clients.
5. Supabase RLS and Realtime authorization assessment.
6. Cloudflare/Next.js deployment compatibility assessment.
7. Mobile and desktop UX gap analysis.
8. As-Is vs To-Be table.
9. Critical risks and unknowns.
10. File-level V1 implementation plan with tests, migrations, dependencies and rollback.
11. Owner decisions requiring confirmation.

Preserve existing working features and data. Do not alter source question-bank JSON structures. Do not invent users, queue counts, ratings, scores, or capabilities. Do not make paid services a dependency. Do not expose answer keys or secrets. Never trust the browser for scoring or rewards.

Separate facts verified in the repository from proposals in the handoff. Cite actual file paths and database objects. Explicitly say when something cannot be verified. Ask only essential questions; where non-critical detail is unknown, make a reversible proposal and mark it for approval.

Wait for review of the audit and plan before broad code changes.
```

---

# 21. OWNER DECISIONS REQUIRED

These are proposals and need explicit approval before they become product policy.

## Gameplay

1. Approve game-world name: The Circuit Arena / Circuit Afterhours.
2. Approve league names and rating thresholds.
3. Approve tier demotion buffer.
4. Approve 10-question/15-minute Ranked format.
5. Approve Quick Duel 5-question format and 60-second per-question limit.
6. Approve tie policy: exact GATE marks only; equal marks are a draw.
7. Approve Async time budget.
8. Approve five-minute scheduled attendance grace.
9. Approve matchmaking rating expansion and 60-second timeout.
10. Confirm global vs branch-specific Elo.
11. Confirm friend matches never change Elo.
12. Confirm rematch pack policy.
13. Confirm ranked no-show/forfeit/void policy.

## Progression and economy

14. Confirm continuous Elo with seasonal Arena Points reset.
15. Approve free 10-level season track.
16. Approve XP values and levels.
17. Approve proposed five coin-earning match cap.
18. Approve same-pair 24-hour reward cooldown.
19. Confirm day-seven reward is 60 total, not 60 additional.
20. Approve mission list and values.
21. Approve cosmetic price schedule.
22. Decide fate of Mentor-token boosts and grandfathering.
23. Confirm club war top-five scoring model.
24. Confirm no premium competitive battle pass.

## Social and UX

25. Approve preset-only club messages in V1.
26. Approve delayed spectating only in later version.
27. Approve result-card sharing and privacy fields.
28. Approve muted-by-default sound and opt-in haptics.
29. Approve practice bots deferred; any future bot is explicitly labelled and unranked.
30. Confirm notification quiet hours and exam Do Not Disturb behaviour.

## Technical

31. Approve private Supabase Broadcast/Presence architecture after compatibility/security audit.
32. Approve answer-key server-only projection strategy.
33. Confirm database table reuse vs proposed new tables.
34. Confirm Cloudflare deployment adapter after `vinext check`/compatibility assessment.
35. Confirm operational plan for Supabase Free project pausing and quota alerts.
36. Approve initial conservative target for concurrency only after load testing.
37. Approve moderation/reporting scope before free-text chat.

---

# 22. ADDITIONAL FEATURES THAT SHOULD BE CONSIDERED

This section expands the original brief with features that improve fairness, retention, learning value, reliability and operations. These are not all V1 requirements.

## 22.1 Essential quality features

- Match history with filters by mode, opponent, branch and date.
- Match replay summary (not a live answer replay) showing question outcome and marks.
- Result comparison: question-level correctness comparison only after match completion and only where question/answer privacy allows.
- One-tap review of wrong questions into existing Mistakes Bank/Bookmarks.
- Add missed questions to revision or flashcards if those systems already support it.
- Rematch invitation with clear cooldown/eligibility.
- Report result problem/dispute action with match ID and evidence snapshot.
- Server status/Realtime degraded state and honest fallback.
- Notification inbox for invitations, results, schedule reminders, season events and club updates.
- Notification batching/quiet hours.
- Searchable help/rules page inside the game.
- Match rules visible before start: question count, time, marking, rating impact and rewards.
- User-controlled presence visibility.
- User block/mute/report controls.
- Data export/delete workflows consistent with the main account system.

## 22.2 Learning features

- Post-match “Where the marks went” with section and subject breakdown.
- Mistake review CTA that routes to existing question review.
- Topic weak-spot summary with uncertainty when sample size is small.
- Repeat-practice pack based on wrong topics (unranked).
- Improvement trend across 7/30/90 days.
- Compare current result against own prior attempts, not only another student.
- Study handoff: “Exit to Study” can open the related revision page after consent.
- Daily Challenge archive and personal best.
- Optional goal such as “improve Algorithms accuracy by 5 percentage points”; never promise a result.

Do not label a user “weak” or “bad.” Use neutral language: “Topics to review,” “Opportunity to improve,” and confidence/sample-size labels.

## 22.3 Competitive quality features

- Branch/subject-aware matchmaking if player population supports it.
- Match quality indicator explaining rating range and mode, not fabricated queue size.
- Anti-repeat opponent preference.
- Ranked season history and peak rating.
- Transparent rating-change explanation (expected result vs actual result).
- Leaderboard filters only where data quality supports them.
- Fairness monitoring for question difficulty and pack balance.
- Tournament readiness gate based on real population and match completion.

## 22.4 Safety/community features

- Block and report users.
- Mute reactions.
- Rate-limit invites and emotes.
- Prevent offensive usernames/club names with a moderation policy.
- Club ownership transfer and member removal audit.
- Reporting confirmation and status, without exposing internal reviewer notes.
- No free-text chat until there is moderation coverage and abuse response policy.

## 22.5 Admin/operations features (restricted)

These do not belong in the student UI but may be needed for operational reliability:

- Match lookup by ID.
- Match state and participant diagnostics.
- Safe void/reopen/repair tools with mandatory reason and audit log.
- Reward ledger investigation; never direct balance editing without ledger.
- Report/moderation queue.
- Season configuration and publish preview.
- Cosmetic catalogue management.
- Mission configuration.
- Question-pack generation diagnostics.
- Realtime usage/quota and Worker invocation dashboards using available metrics.
- Feature flags and kill switch for matchmaking, rewards and new modes.
- Incident runbook and rollback.

Admin actions must be role-protected, audited and unavailable to normal users. Do not expose privileged admin RPCs to browser clients.

---

# 23. ANALYTICS AND SUCCESS METRICS

These are early-stage proposed targets, not guaranteed benchmarks. Establish a clean baseline and cohort definitions first.

## 23.1 Core targets

| Metric | Definition | Initial target |
|---|---|---:|
| D1 retention | User returns next calendar day/cohort day | 25-30% |
| D7 retention | User returns within D7 cohort window | 10-15% |
| First-match conversion | Game entrants completing first match | 50%+ |
| Match completion | Completed / valid started matches | 85%+ |
| Matchmaking success | Real opponent found within 60 seconds | 70%+ when population sufficient |
| Invite acceptance | Accepted / sent friend invites | 20-30% |
| Rematch rate | Eligible completed matches followed by rematch | 20%+ |
| Result share | Shared cards / completed matches | 5-10% |
| Post-match review | Users opening mistake review after match | 25%+ |
| Weekly matches | Completed matches per weekly active competitor | 2-4 |
| Daily Challenge completion | Completed daily packs / challenge entrants | 25-35% |

Do not interpret a matchmaking-success target as a requirement to fabricate players. Where player volume is low, report the actual rate and improve alternatives.

## 23.2 Event instrumentation

Recommended events:

- `battles_entered`
- `game_home_viewed`
- `mode_selected`
- `matchmaking_started`
- `matchmaking_matched`
- `matchmaking_timeout`
- `friend_invite_sent`
- `friend_invite_accepted`
- `match_ready`
- `match_started`
- `answer_submitted`
- `match_reconnected`
- `match_disconnected`
- `match_completed`
- `match_voided`
- `result_analysis_opened`
- `mistake_review_opened`
- `rematch_requested`
- `result_shared`
- `cosmetic_previewed`
- `cosmetic_purchased`
- `club_contribution_recorded`
- `daily_challenge_completed`

Store minimum necessary metadata. Do not log answer payloads, tokens, secrets or private moderation data in analytics events.

## 23.3 Guardrails

- Realtime disconnect rate.
- Abandoned match rate.
- Queue time distribution.
- Match cancellation/void rate.
- Duplicate reward attempts.
- Question-load errors.
- PWA crash/error rate.
- RLS denials and suspicious access.
- Report/block rate.
- Daily competitive time and frequency.
- Post-match study conversion.

The objective is productive competition, not maximising playtime at any cost.

---

# 24. RISKS AND MITIGATIONS

| Risk | Failure mode | Mitigation |
|---|---|---|
| Gambling perception | Coins feel like wagering | No stakes, paid coins, loot boxes, cash-out or random paid rewards |
| Pay-to-win | Paid plans give advantage | Cosmetic/convenience only; equal competition |
| Study distraction | Infinite matches replace preparation | Finite modes, optional review and Exit to Study |
| Toxic behaviour | Chat/emotes harass students | Preset messages, block/report and rate limits |
| Empty lobby | Users wait without opponents | Honest timeout and alternate modes |
| Fake competition | Bots/fake profiles inflate activity | Real data only; bots explicitly labelled and unranked |
| Cheating | Browser controls score | Server grading, answer-key isolation, RLS, idempotency |
| Mobile data drop | Player loses accepted answers | Persist on server and reconcile on reconnect |
| Reward inflation | Friend farming | Pair cooldowns, caps and ledger |
| Question imbalance | One player receives harder pack | Identical pack/order and pack audit |
| Performance | Animations harm exam input | Isolated components, lazy load, profiling |
| Night disturbance | Notifications interrupt test | Do Not Disturb and queued alerts |
| Privacy | Presence/result leaks | Privacy settings, public-safe projections and RLS |
| Moderation | Free chat becomes unsafe | Defer free-text chat until operationally ready |
| Free-tier constraints | Quotas/pausing affect production | Monitor quotas, load test, backup/incident plan, document upgrade trigger |
| Framework incompatibility | Deployment breaks after adapter migration | Compatibility checks, canary, rollback, no blind migration |

---

# 25. RISKS IN FREE-TIER TECHNICAL ASSUMPTIONS

Provider quotas change. The following current values were checked against official pages on 14 November 2026 and are a planning snapshot only.

## 25.1 Supabase Realtime Free

Current published plan data indicates:

- 200 concurrent peak connections on Free.
- 2 million Realtime messages/month included.
- 100 messages/second on Free.
- 256 KB Broadcast payload limit.

See R4-R6. These are project-wide quotas; they are not 200 matches. A player may open multiple subscriptions and the rest of RENYXERA also consumes capacity. Use small payloads, compact progress every five seconds, cleanup subscriptions and observe real usage. A suggested 40 simultaneous live matches is only a conservative engineering planning target, not a provider guarantee; confirm through load tests.

Supabase Realtime Free pricing and limits pages should be rechecked before launch. Free projects may pause after inactivity according to current plan policy; verify the latest project-pause rules and operational impact before treating Free as production-grade uptime.

## 25.2 Cloudflare Workers Free

Current published limits include:

- 100,000 requests/day.
- 10ms CPU per HTTP request on Free.
- 128MB memory.
- 50 subrequests/request.
- 5 Cron Triggers per account.

See R1. CPU time measures execution and not network wait time; still, synchronous heavy work should not be placed in a Worker request. Cron processing on Free also has a 10ms CPU constraint per trigger; use small batches and database-side transactional operations where appropriate. Reconfirm all limits before release.

## 25.3 Next.js deployment

Cloudflare currently recommends vinext for new Next.js apps on Workers and documents OpenNext for existing projects where migration is not yet compatible. See R2-R3. Do not force migration just because a guide recommends a default. Audit Next.js feature usage, run compatibility checks and keep a rollback path.

## 25.4 Free is not the same as reliable forever

Do not promise zero cost forever or guaranteed availability. Document:

- What happens if Realtime quota is exhausted.
- What happens if Worker daily request quota is exceeded.
- How Supabase project pause is handled.
- How to back up database and restore.
- The exact threshold that would require a paid tier or reduced mode.
- What degraded experience is displayed honestly to students.

The owner controls any move that incurs cost.

---

# 26. SOURCES AND CURRENT TECHNICAL REFERENCES

These links support provider and Claude Code implementation guidance, not the product decisions or economics. Recheck before implementation because pricing, features and framework compatibility change.

- **R1 - Cloudflare Workers limits:** https://developers.cloudflare.com/workers/platform/limits/ (official; page last updated 29 Oct 2026 in the current search result).
- **R2 - Cloudflare Next.js / vinext guide:** https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/ (official; current guide recommends vinext for Next.js on Workers and documents installation/check workflow).
- **R3 - Cloudflare OpenNext adapter:** https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/ (official; existing-app/compatibility path).
- **R4 - Supabase Realtime pricing:** https://supabase.com/docs/guides/realtime/pricing (official; message and peak-connection quotas).
- **R5 - Supabase Realtime limits:** https://supabase.com/docs/guides/realtime/limits (official; concurrency, message rate, payload and Presence limits).
- **R6 - Supabase Realtime authorization and Broadcast:** https://supabase.com/docs/guides/realtime/authorization and https://supabase.com/docs/guides/realtime/broadcast (official; RLS on `realtime.messages`, private channels and broadcast behaviour).
- **R7 - Claude Code power-user guidance:** https://support.claude.com/en/articles/14554000-claude-code-power-user-tips (skills, subagents and project-level workflows).
- **R8 - Claude Code settings and project configuration:** https://code.claude.com/docs/en/settings (project settings and permissions).
- **R9 - Anthropic guidance on skills, hooks, rules and subagents:** https://claude.com/resources/articles/steering-claude-code-skills-hooks-rules-subagents-and-more (how to choose between persistent instructions, skills, subagents and hooks).
- **R10 - Claude skills availability/use:** https://support.claude.com/en/articles/12512180-use-skills-in-claude (Claude app and Claude Code skill use; verify current version/account capabilities).

---

# 27. FINAL PRODUCT DEFINITION

RENYXERA Battles is a game-style competitive learning environment, not a generic social dashboard and not a gambling product.

The user should:

1. Enter a dedicated full-screen game world.
2. Immediately see Arena rank, season and real social opportunities.
3. Choose a real friend challenge or find a real ranked opponent when available.
4. Experience a clear match intro and shared countdown.
5. Answer authentic GATE questions under identical rules.
6. Receive a server-verified result with exact GATE marks.
7. Earn transparent progression and cosmetic rewards.
8. Review weaknesses and return to useful study activity.

The launch priority is not to build the maximum number of game features. It is to make the existing Battles/Arena system feel coherent, fair, reliable, fast and worth returning to - while improving learning outcomes.

**North-star principle:** Every competitive feature must strengthen either fair competition, student learning, social motivation or product reliability. If it does none of these, do not build it yet.
