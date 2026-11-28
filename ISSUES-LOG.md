# Issues and fixes log

Every bug, issue, request and fix is logged here, newest first, with date and time (local time of the work machine, taken from the commit when there is one), what was reported, the cause, the fix, the files, the commit and a code snippet where there is one. Small things count. Status: **Fixed**, **Open**, **Owner** (needs you), **Watch** (fixed but not yet confirmed live).

**How to add an entry:** copy the template at the bottom, give it the next id (`L-0xx`), put it at the top of its day.

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
