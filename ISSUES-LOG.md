# Issues and fixes log

Every bug, issue, request and fix is logged here, newest first, with date and time (local time of the work machine, taken from the commit when there is one), what was reported, the cause, the fix, the files, the commit and a code snippet where there is one. Small things count. Status: **Fixed**, **Open**, **Owner** (needs you), **Watch** (fixed but not yet confirmed live).

**How to add an entry:** copy the template at the bottom, give it the next id (`L-0xx`), put it at the top of its day.

---

## 2026-11-29

### L-051 · 28 Nov · Clay controls audit: chips, search, switches, dropdowns · Fixed
- **Reported:** search bar, buttons, toggles and chips in the Clay Look were not proper.
- **Cause:** the first Clay pass styled cards, `.btn-*` and inputs only; outlined pill buttons stayed flat, the search input got a second inset inside its own well, and switches and dropdown triggers were untouched.
- **Fix:** `app/looks-clay.css` controls audit: outlined buttons become raised clay (pressed purple when on), search wrapper is the single debossed well with a bare input, switches have a debossed track and raised knob, dropdown triggers are wells, option hovers, selected tab raised, native controls accent purple.
- **Checked:** Study planner (order chips, subjects chips, search, Reset, Apply) in light and dark. **Open:** account switches, the dropdown menu list, exam setup and the Studio preview not looked at on screen.

### L-050 · 28 Nov · Clay (claymorphism) Look added to the Design Studio, Pro tier · Fixed
- **Reported:** add claymorphism in the Design Studio for Pro; research it and build with the design skills.
- **Research:** Smashing Magazine, LogRocket and SetProduct (2026): large radius, tinted outer shadow, bright top-left inner rim, darker bottom-right inner shade; inputs debossed; WCAG 1.4.11 means shadow alone cannot carry meaning.
- **Fix:** `app/looks-clay.css` (tokens, pastel backdrop, inflated surfaces, puffy buttons that sink when pressed, debossed inputs, light and dark); `lib/looks/looks.ts` marks Clay ready, fonts Lilita One and Rubik, font choices; spec section in `docs/design/LOOKS-SPEC.md`.
- **Checked:** Study page in light and dark with the attribute applied. **Open:** the Studio preview card and the contrast audit for Clay not run; the Design Studio page did not finish loading in my headless run.

### L-049 · 28 Nov · Purple packs card and four 3D tiles restored · Fixed
- **Reported:** the packs card should be the purple purchase card; place the four 3D tiles as before, arranged properly.
- **Fix:** the four tilt tiles (topics read, chapters started, highlights, library) are back as the first row; below, the hero (2.1 parts) beside the purple `PremiumCard` (1 part, same height); the planner and path follow.
- **Files:** `app/(dashboard)/study/page.tsx`, `components/study/bookshelf.tsx`

### L-048 · 28 Nov · Study home redesigned: hero, planner with Apply, ring card · Fixed
- **Reported:** still not good; add an Apply button for the roadmap filters and search; research the placement; fresh look for the Study homepage.
- **Research:** NN/g and Baymard say to filter in batch with an Apply button when a change reshapes the page, keep Apply at the end of the options, show the result count, and keep Apply sticky on phones; learning apps (Brilliant, EdApp, Tutor LMS) lead with one resume or next card plus progress and an Up next list.
- **Fix:** `RoadmapPanel` is now the hero (Resume if a book is open, else the next chapter, with marks and PYQ chips, one big button and four Up-next chapters). New `StudyPlanner` (search, order, ready-only, subjects) stages a draft and applies on Apply or Enter, shows how many changes are pending and how many books will show, Reset restores defaults, sticky on phones. Reading stats became a ring card; packs a slim card.
- **Files:** `components/study/study-planner.tsx`, `components/study/study-roadmap.tsx`, `components/study/bookshelf.tsx`, `lib/study/roadmap-prefs.ts`, `app/(dashboard)/study/page.tsx`
- **Watch:** selected chips use the text colour as fill because the tint variable is only set inside tinted cards.

### L-047 · 28 Nov · Study hub cards reorganised by hierarchy · Fixed
- **Reported:** rearrange the cards; research, then design skills, then reorganise.
- **Research:** learning dashboards put the resume/next action first and progress compact (LearnDash student dashboard guide, Domo 2026 dashboard guide); bento guidance says the largest tile carries the most important content and smaller tiles support it (SaaSFrame 2026 bento guide, freeCodeCamp).
- **Fix:** focal point is the Next-on-your-roadmap block (largest type, one primary button); order pills and subjects sit under it; the right column stacks Resume, a compact Your reading card (replaces four equal stat cards) and a one-line Study packs card; search and filters became one slim toolbar above the path and shelves.
- **Files:** `components/study/study-roadmap.tsx`, `components/study/bookshelf.tsx`, `app/(dashboard)/study/page.tsx`

### L-046 · 28 Nov · Roadmap joins the library hero; choices filter the shelves; focus target hides outside chapters · Fixed
- **Reported:** remove the roadmap modal; fold the GATE CS library card into the roadmap; the roadmap should filter and apply on the screen itself; the focus target should show only subjects, topics and chapters inside it.
- **Fix:** `lib/study/roadmap-prefs.ts` shares order and included subjects. `RoadmapPanel` replaces the library card (order pills, subjects, resume, next chapter); search moved to its own bar; `RoadmapPath` is a collapsible path list; the bookshelf hides excluded subjects and shows each book's place on the roadmap. With a Focus Target, a book's Contents lists only chapters with marks inside the target, with a Show them button.
- **Files:** `components/study/study-roadmap.tsx`, `components/study/bookshelf.tsx`, `lib/study/roadmap-prefs.ts`, `app/(dashboard)/study/page.tsx`
- **Open:** not yet checked with a Focus Target set on screen; shelf badges not screenshotted.

### L-045 · 28 Nov · Algorithms: picture questions solved, PYQs tagged, old files removed · Fixed
- **Reported:** finish the eleven picture-only questions, tag Algorithms PYQs, remove unused files, read on a phone.
- **Fix:** all 12 picture questions read from the images in `public/images` and solved (2017 AN Q13 D; Q59 225; 2017 FN Q30 C; 2018 FN Q57 4; 2021 AN Q19 929; Q30 A, B; 2021 FN Q25 C; Q48 3; Q49 C; 2024 AN Q53 9; 2025 AN Q59 6; 2025 FN Q64 5), each as a worked example in its chapter. All 73 Algorithms questions tagged in `lib/study/pyq-chapter-map.json` (books now pds, ds, algo). Old `algo-a..d.ts` deleted; `algo-v2.ts` holds the chapter shells. Trace tables no longer split words on a phone.
- **Files:** `content/study/CS/algo-v2*.ts`, `lib/study/pyq-chapter-map.json`, `components/study/figures/linear.tsx`, `scripts/study-validate.ts`
- **Open:** `scripts/focus-check.ts` already failed before this change (it expects the old P&DS chapter ids).

### L-044 · 28 Nov · Algorithms book rewritten as a textbook (A0 to A10) · Fixed
- **Reported:** start and complete the next book.
- **Fix:** eleven numbered chapters (toolbox, asymptotics, sorting, hashing, divide and conquer, greedy, DP, traversals, MST, shortest paths, practice) with real GATE questions re-solved, programs compiled with gcc, figures, traps and checks. All nine shelf rows wired to them. Browser sweep (desktop and phone) and contrast audit clean on all rows. Graph figure labels shortened to fit their circles.
- **Files:** `content/study/CS/algo-v2*.ts`, `lib/study/chapters-server.ts`, `lib/study/catalog.ts`
- **Open:** figure-only questions (2017 AN Q13, 2017 AN Q59, 2018 FN Q57, 2021 AN Q19, Q30, 2021 FN Q25, Q48, Q49, 2024 AN Q53, 2025 AN Q59, 2025 FN Q64) are covered by method, not solved on the picture; old algo-a..d.ts files kept but unused by the shelf; PYQ tags for Algorithms not yet in pyq-chapter-map.json.

### L-043 · 28 Nov · Study roadmap opens as a modal · Fixed
- **Reported:** the roadmap should be a modal.
- **Fix:** a one-line launcher card on the Study page (shows Next up); the full roadmap opens in a portal dialog (bottom sheet on phones), closes on Esc, backdrop or X, and locks page scroll while open. Subject chips folded into a disclosure.
- **Files:** `components/study/study-roadmap.tsx`

### L-042 · 28 Nov · Roadmap sort is the reader's choice · Fixed
- **Reported:** do not force the logical order; offer other ways to sort.
- **Fix:** six orders (Balanced, Marks first, Logical, Most past questions, Continue reading, Shelf order) and Include chips to drop subjects; both saved on this device.
- **Files:** `components/study/study-roadmap.tsx`
- **Open:** dev overlay showed '1 Issue' in the screenshot; cause not yet checked.

### L-041 · 28 Nov · Study roadmap added · Fixed
- **Reported:** study needs a guide to the flow: where to start, high-weightage books, logical order.
- **Fix:** new Study roadmap above the shelf with three modes (Balanced, Marks first, Logical order), a Next up card, stages by cumulative marks share and per-chapter cards with % of marks, PYQs, progress and access chip. Balanced works in prerequisite tiers (C, then Data Structures, then Algorithms/Digital Logic, and so on); weight breaks ties inside a tier.
- **Files:** `components/study/study-roadmap.tsx`, `app/(dashboard)/study/page.tsx`
```ts
const score = (id) => mode === "marks" ? wRank(id) : mode === "logical" ? learnRank(id) : tierOf(id) * 100 + wRank(id);
```
- **Watch:** check on a phone and in dark mode.

### L-040 · Chapter numbers and labels were selectable (highlight popup appeared on them) · Fixed
- **Reported:** the heading badges (7.5.1) and the EXAMPLE 7.1 label could be selected, which opened the highlight palette. They should not be selectable.
- **Fix:** `select-none` on the heading number badges (all four levels), the Example, Chapter and Topic labels and the Worked example label. **Files:** `components/study/lesson-renderer.tsx`

### L-039 · Page still said "Programming and Data Structures" (header, tab) · Fixed
- **Cause:** the part chapters copied the old combined subject name.
- **Fix:** `subject` is now "Programming in C" for the four C parts and "Data Structures" for every Data Structures chapter (also the names the bank uses, so the PYQ drawer filters correctly). **Files:** `content/study/CS/pds-cparts.ts`, `content/study/CS/pds-ds.ts`

### L-038 · PYQ count and percentage missing on most rows · Fixed
- **Cause:** weights for the combined book came from `lib/study/pyq-chapter-map.json`, which tagged all 42 C questions to chapter `c`; the new rows had no tags (and the new Data Structures book id was not in the tag list). My earlier regex fix did not apply because tagged books ignore `match`.
- **Fix:** retagged the 98 questions (C by bank topic: `c` 11, `c2` 26, `c3` 20; Data Structures rows `linked` 6, `stackq` 8, `trees` 17, `heaps` 10, `choose` 1) and let both books use the tags (`books: ["pds", "ds"]`). Rows with no question of their own show nothing. **Files:** `lib/study/pyq-chapter-map.json`, `lib/study/focus.ts`

### L-037 · Data Structures chapters integrated into the subject rows; the single "From arrays to graphs" row removed · Fixed
- **Reported:** remove that chapter and put the chapters under their own topics.
- **Fix:** rows now Foundations (D0, D1), Arrays (D2), Linked lists (D3), Stacks and queues (D4, D5), Recursion (D6), Trees and BSTs (D7, D8, D9, D11), Binary heaps (D10), Hashing (D12, route `/study/ds-hashing`), Graphs (D13, D14), Choosing the right structure (D15, D16). The older single-draft pages for these routes are replaced by the new chapters. **Files:** `content/study/CS/pds-ds.ts`, `lib/study/chapters-server.ts`, `lib/study/catalog.ts`, two new route pages.

### L-036 · Calculator bar: controls jumped between left and right · Fixed (Watch)
- **Reported (L-032):** the expand, minimise and close buttons are not on the left.
- **Cause:** in the small state the buttons followed the number, in the open state they were pushed right (`ml-auto`).
- **Fix:** the buttons always sit on the left after the drag handle, the result is right-aligned beside them. If you meant the right side, it is a one-line change. **Files:** `components/exam/virtual-calculator.tsx`
- **Also fixed:** a lint error in the same file (a state update inside an effect), the likely cause of the failed CI lint job. Line: `if (!open) return;` and the reset moved to the effect cleanup.

### L-035 · Question bank discrepancy file · Fixed
- **Reported:** log every discrepancy found in the bank in a separate file. **Done:** `docs/QUESTION-BANK-DISCREPANCIES.md` (59 rows, with the full detail of 2021 AN Q17 for you to confirm).

### L-034 · Four figure questions re-checked (2026_FN_Q37, 2023_FN_Q21, 2022_FN_Q40, 2017_AN_Q45) · Fixed
- **Reported:** recheck what had only been taken on Gemini's word. **Result:** all four keys correct from the pictures (next-state table solved by program: option B; mux with feedback is a D latch; decoders and a 2:1 mux; T inputs T1 = Q1'Q0, T0 = (Q1Q0)').

### L-033 · Compiler Design and Digital Logic figures checked; two more bank defects · Fixed (Owner step)
- **Reported:** next item on the list: check the Compiler Design (11) and Digital Logic (21) figures.
- **Done:** every key checked against the pictures in `public/images` (liveness, available expressions, parse tables, SDDs, circuits, counters, IEEE formats). All keys hold.
- **Defects found:** 2023_FN_Q37 option D printed `B2: {a, i, j}` (true: `{a, j}`); 2023_FN_Q44 function printed `A + A'C' + AB'C` (paper: `A' + A'C' + AB'C`); 2022_FN_Q41 picture prints `0xC42100000` (stray C; true value `0x42100000`).
- **Fixed in** `data/Aggregated_Output.json` and `public/data/questions.json`; the database copy is `supabase/migrations/0068_bank_corrections_2.sql` (**owner runs it once**). The picture typo cannot be edited.
- **Docs:** `compiler-design/` and `digital-logic/` `01-REVIEW-MERGE-AND-PLAN.md` updated.

### L-032 · Calculator bar: screenshot with the three round buttons circled, no text · Open
- **Reported:** a screenshot of the floating calculator bar (display 785, then history, expand and close buttons) with the buttons circled. No message came with it, so the request is unclear (too big? wrong place? should show more?).
- **Next:** ask the owner what to change before touching `components/study/lesson-tools.tsx`.

### L-031 · Data Structures D6, D11, D12, D14 added · Fixed
- **Reported:** complete the remaining chapters of the book.
- **Done:** D6 recursion on data structures (2023 FN Q47, figure read from the app), D11 B and B+ trees (2019 FN Q20, 2024 FN Q11, 2020 FN Q51, 2017 AN Q54, 2025 FN Q21, 2025 AN Q57), D12 hashing bridge (2026 FN Q24, 2026 AN Q30, 2025 FN Q65, 2020 FN Q28), D14 tries and disjoint sets. The book is now 17 chapters, D0 to D16. All programs compiled with gcc; chapter-check, browser sweep (desktop and phone) and contrast audit clean.
- **Files:** `content/study/CS/pds-d6.ts`, `pds-d11.ts`, `pds-d12.ts`, `pds-d14.ts`, `pds-ds.ts`, `lib/study/catalog.ts`

---

## 2026-11-28

### L-030 · 10:33 · CI build failed: React error #418 (hydration) · Fixed (Watch)
- **Reported:** GitHub Actions "check" job failed on `/`, `/mistakes`, `/bookmarks`, `/revision` (phone and desktop, light and dark) with "Minified React error #418".
- **Cause:** the icon-watermark script (L-027) added an SVG child to pastel cards before React had hydrated them. Error 418 is a server/client HTML mismatch.
- **Fix:** mark a card only after React has hydrated it (React puts a `__reactFiber$…` key on hydrated nodes); start after 1.2 s, retry every 1.5 s for 20 s.
- **Files:** `components/layout/icon-watermarks.tsx` · **Commit:** aaeb167
```ts
const hydrated = (el: Element) => Object.keys(el).some((k) => k.startsWith("__reactFiber"));
function mark(card: Element) { if (!hydrated(card)) return; /* … clone the icon … */ }
```
- **Also:** the "lint" job failed in the same run. `npm run lint` prints no errors locally, so the cause is unknown. **Open:** need the lint log of the next run if it fails again.

### L-029 · 10:33 · Share-as-image preview too large, under the options · Fixed
- **Reported:** the preview image is huge; put it to the right at a readable size.
- **Fix:** two columns on large screens (options left, preview right, up to 28rem, sticky); stacked on phones.
- **Files:** `components/growth/share-card.tsx` · **Commit:** aaeb167
```tsx
<div className="grid gap-4 … lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-start">
```

### L-028 · 01:25 · Mentor screen scrolled the whole page · Fixed
- **Reported:** a scrollbar on `/ai-mentor/chat`; the page should be one screen, only inner content flows.
- **Cause:** `.mentor-stage::before` (a soft glow with `inset: -20% -10%`) reached outside the stage and made the page scroller 93 px taller than the screen (scrollHeight 981 against 888). Found by hiding elements one at a time and watching `scrollHeight`.
- **Fix:** clip the stage. After the fix scrollHeight = 888.
- **Files:** `app/globals.css` · **Commit:** 37dbbf3
```css
.mentor-stage { position: relative; overflow: clip; }
```

### L-027 · 01:25 · Watermark should be the card's own icon · Fixed (Watch)
- **Reported:** pastel cards showed generic shapes (circle, ring, star, diamond); the watermark should be the icon, everywhere it exists.
- **Fix:** a small client component copies each pastel card's first lucide icon into the bottom-right corner, large and faint. Cards with no icon keep the shape (the shape rule skips cards that contain `.tile-mark`).
- **Files:** `components/layout/icon-watermarks.tsx` (new), `components/layout/client-layout.tsx` · **Commit:** 37dbbf3 (hydration fix in L-030)
- **Not yet checked on screen** by me.

### L-026 · 01:25 · Shelf collapsed into one column · Fixed
- **Reported:** "why the stacking became like this": all books in one long column, Data Structures above Programming in C.
- **Cause:** I had made four stacks; the grid only switches to columns for 2 or 3 stacks, so four fell back to a single column. The shelf stacks bottom to top, so the first id is the bottom book.
- **Fix:** three stacks again.
- **Files:** `components/study/bookshelf.tsx` · **Commit:** 37dbbf3
```ts
stacks: [["os","dbms","cn"], ["algo","pds","ds"], ["toc","cd","coa","dl"]]
```

### L-025 · 01:25 · Percent of marks and PYQ count missing on most book rows · Fixed (Watch)
- **Reported:** show the percentage and number of PYQs for every row that has them; show nothing only when there are none.
- **Cause:** the rows' `match` patterns did not hit the bank's topic names ("Functions, Parameter Passing, Scope Rules, Recursion", "Pointers, Multi-Dimensional Arrays, Structures", …).
- **Fix:** patterns written from the real topic labels (Programming in C: 11 + 26 + 20 questions; Data Structures: 42). "Reading code and practice" has no questions of its own and shows nothing.
- **Files:** `lib/study/catalog.ts` · **Commit:** 37dbbf3

### L-024 · 00:49 · Data Structures D13, D15, D16 added · Fixed
- Graphs (representation, BFS, DFS), choosing the right structure (2025 AN Q38), patterns and mixed practice (26 real questions grouped). Book is 13 chapters. **Commit:** 704534b, 618ae55

### L-023 · 00:36 · Bank text errors found by the reviews · Fixed (Owner step)
- **Fixed in `data/Aggregated_Output.json`** (11 text fixes): 2021_FN_Q27 `→ q`, 2022_FN_Q51 `5·2^n`, 2025_AN_Q40 `bAc`, 2026_AN_Q41 `a` for α, 2026_FN_Q21 missing overline, 2025_AN_Q43 option A fourth term, 2022_FN_Q45 `U33`, 2026_FN_Q38 `K = 2^L`, 2022_FN_Q56 `NOT EXISTS`, 2023_FN_Q18 "Let and".
- **Owner:** run `supabase/migrations/0067_bank_corrections.sql` once (done 28 Nov). It also moves the key of 2021_AN_Q17 from C to A.
- **Open:** 2025_AN_Q50 option D is not an identity as printed; the original paper is needed. 2020_FN_Q12 picture lists supplier S1 twice (no S2).
- **Commit:** ca9bdfa

### L-022 · 00:30 · Extreme lag at the end of a long chapter · Fixed (Watch)
- **Reported:** heavy lag across the app when at the last topic or bottom of the contents.
- **Cause (measured):** painting. Scrolling at the bottom used 9.5 s of raster time per 40 scroll steps. The full-screen ambient gradient (four radial gradients, drawn on html, body and the shell) plus the grain texture were repainted on every frame. Removing background images cut it to 2.5 s.
- **Fix:** draw the gradient once on its own fixed composited layer (`::after`), drop the duplicate html/body copies, make the grain layer fixed too, add `content-visibility: auto` to topics, measure scroll height at most every 2.5 s in the top bar. Raster time 9.5 s to 1.7 s.
- **Files:** `app/globals.css`, `components/layout/topbar.tsx` · **Commit:** 7c8caef
```css
.ambient-gradient { background-image: none; }
.ambient-gradient::after { content:""; position:fixed; inset:0; z-index:-2; will-change:transform; transform:translateZ(0); background-image: radial-gradient(...) /* x4 */; }
.study-lesson [data-topic] { content-visibility: auto; contain-intrinsic-size: auto 1400px; }
```
- **Measured in dev mode in a headless browser, not on your GPU.** Tell me if it still lags.

### L-021 · 00:30 · Rail text wrapped under the number badge · Fixed
- **Reported:** the text should never go below the numbering at any level.
- **Cause:** the badge and the label were inline, so a second line started under the badge.
- **Fix:** badge and text in a flex row (text in its own column).
- **Files:** `components/study/lesson-renderer.tsx` (`SecLabel`) · **Commit:** 7c8caef

### L-020 · 00:30 · Study page scrolled the outer card (14 px) · Fixed
- **Reported:** a scrollbar on the outer card; only the inner content should flow.
- **Cause:** the lesson height allowance (`--lesson-chrome` 9.5 rem) was about 14 px too small. Measured at four screen sizes.
- **Fix:** 10.5 rem. App scroller height now equals its content at 1920x940, 1440x900, 1366x768, 1280x720.
- **Files:** `components/study/lesson-renderer.tsx` · **Commit:** 7c8caef

### L-019 · 00:30 · Programming in C and Data Structures as separate books · Fixed
- **Reported:** two separate books; remove the "1. 2." numbering from the C parts.
- **Fix:** two shelf books under one pack (₹129); C parts renamed without numbers.
- **Files:** `lib/study/catalog.ts`, `lib/study/packs.ts`, `components/study/bookshelf.tsx` · **Commit:** 7c8caef

### L-018 · 00:01 · Reviews merged and verified (7 subjects) · Fixed
- Databases, COA, Discrete Maths (Gemini + ChatGPT), Compiler Design, Digital Logic, Linear Algebra, Probability (Gemini). Docs: `docs/study-materials/v2/<subject>/01-REVIEW-MERGE-AND-PLAN.md`.
- **Reviewer errors found:** ChatGPT COA 2023_FN_Q64 (tag is 19 for every block size); Gemini difficulty counts in COA, Discrete Maths, Probability; ChatGPT refused two questions that are solvable from the text. **Commit:** 18d4af2

---

## 2026-11-27

### L-017 · 23:52 · Data Structures D2 to D10 added · Fixed
- D2 arrays, D3 linked lists, D4 stacks, D5 queues, D7 trees, D8 BSTs, D9 AVL, D10 heaps, each with the real GATE questions explained, programs compiled with gcc, chapter-check, browser sweep and contrast audit. **Commits:** 70ae7f9, e386c51, a5a7a13, f81c426

### L-016 · 23:13 · Programming in C split into four parts · Fixed
- 22 chapters on one rail was overloaded. Routes `/study/c-programming`, `/study/c-functions`, `/study/c-pointers`, `/study/c-reading`. **Commit:** 70ae7f9

### L-015 · 23:13 · Rail number badges empty for D chapters · Fixed
- **Cause:** `SecLabel` only recognised labels starting with a digit; "D1.1 …" starts with a letter, so the badge was blank.
- **Fix:** `/^[A-Za-z]{0,2}\d/`. **Commit:** 70ae7f9
```ts
const num = sp > 0 && /^[A-Za-z]{0,2}\d/.test(sec.label) ? sec.label.slice(0, sp) : "";
```

### L-014 · 23:13 · Rail jumps stuttered · Fixed (Watch)
- Far jumps used smooth scrolling across many lazily drawn topics. Now instant when the target is more than 1.2 screens away. **Files:** `components/study/lesson-renderer.tsx` · **Commit:** 70ae7f9

### L-013 · 20:00 · Rail chip showed 19 for chapter 18 · Fixed
- The chip used the list position; now `t.no ?? i + 1`. **Commit:** 876eeb4

### L-012 · 19:58 · Study tabs: no separators, controls always visible · Fixed
- Separator lines between tabs; the ⋯ and ✕ appear on hover only and the title shrinks with an ellipsis. **Commit:** 0e5ba9f

### L-011 · 19:58 · Figures overflowed on phones (D1) · Fixed
- `grid-cols-[minmax(0,1fr)]`, `min-w-0` on figure frames, a compact call-tree mode. **Commit:** 0e5ba9f

### L-010 · 19:27 · Focus mode: capsule clipped, dock in the wrong place · Fixed
- Dock drops to the bottom when the nav is hidden; wrapping dock with a row break so the capsule never leaves the screen on phones; calmer accent-ring capsule. **Commits:** b5f4e09, 2e88f84

### L-009 · 19:15 · Low contrast in the code editor · Fixed
- Line numbers, comments, file names and the "Output" label were below 4.5:1. **Files:** `app/globals.css` · **Commit:** b5f4e09
```css
--ce-gutter: #74654e; --ce-cmt: #6b5d47; --ce-out-label: #166534;  /* light */
```

### L-008 · 19:01 · Programming in C chapters C0 to C21 finished · Fixed
- **Commits:** 15379ee … f7b357b (one per chapter).

---

## Template

```
### L-0xx · HH:MM · short title · Status
- **Reported:** what you saw or asked (your words if short).
- **Cause:** why it happened (measured or read from the code).
- **Fix:** what changed.
- **Files:** paths · **Commit:** hash
\`\`\`ts
// the key code, if any
\`\`\`
- **Open / Owner / Watch:** anything left.
```
