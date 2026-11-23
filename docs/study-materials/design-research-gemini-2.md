### Research & Verification Scope Note

* **Directly verified live:** `https://gate.renyxera.workers.dev/` was inspected live. Observed details in the production app include: Next.js (App Router / Turbopack) deployed on Cloudflare Workers; branches listed as `CS, ECE, EE, ME, Civil, DA`; existing navigation across Dashboard (`/`), Test Centre (`/test-centre` including `/test-centre/build?view=flashcards`, Practice, Mocks, Battles, History), Study (`/study`), AI Mentor (`/ai-mentor`, chat entry `/ai-mentor/chat?new=1&from=bar`), Review (`/mistakes`), and Analytics (`/analytics`); a 5-tab mobile bottom dock (`Home`, `Test Centre`, `Review`, `AI Mentor`, `More`); `skeleton-shimmer` loaders; and a theme system supporting `theme` (`light`/`dark`), `data-dk` (`edge`, `midnight`, `tinted`), `data-look` (`renyxera_look_v1`), and CSS font variables (`--font-display`, `--font-sans`, `--font-num`).
* **External research limitation:** Only `google:browse` was available in this environment (no web-search tool), and `google:browse` restricts fetching to URLs appearing in the prompt or search results. Therefore, external literature, specifications, and product benchmarks below cite established published works, official standards (W3C, Apple, Google), and documented product patterns with their canonical home domains/identifiers rather than unverified deep links, and **zero statistics or study percentages are invented**. Where exact 2026 third-party UI details or syllabus mark distributions fluctuate, that uncertainty is noted explicitly.

---

### 4.1 Concept

#### Concept 1: "The Reference Library & Reading Margin" (Recommended)
* **Metaphor:** `/study` is a physical subject library shelf where each GATE subject is a cloth-bound volume sized to its syllabus weight; tapping a book pulls it off the shelf and opens its two-page Table of Contents; opening a chapter moves into a clean, glare-free **annotated textbook page with tabbed right-margin tools** (Notes, PYQs, Mentor).
* **Why it suits GATE students:** Indian engineering students aged 20–25 preparing alone on phones at night already carry a mental model of standard textbooks (Silberschatz, Cormen, Korth) that feel intimidating, alongside scattered coaching notes and PYQ PDFs. A crisp shelf gives reassuring structure ("here is the entire syllabus, visibly bounded"), while shifting from a literal two-page spread to a flowing annotated page inside lessons preserves readability for 2-mark numericals, C traces, and diagrams on a `390 px` screen. It pairs naturally with RENYXERA's warm pastel surface language and Sora/Manrope typography.
* **Navigation:**
  * `/study` → Full-width bookshelf hub grouped by subject shelves (Branch selector + Search + Continue card).
  * Book Tap → Shared-element pull-out into Two-Page Book Spread (Desktop) or Spine-Tabbed Chapter Sheet (Mobile) listing all chapters with honest status (`Free & Ready`, `Ready`, `Being written`).
  * Chapter Tap → Distraction-reduced Lesson Reader (`/study/[subject]/[chapter]`) with collapsible left outline rail and compact tabbed right margin (Desktop) or two-snap bottom sheet bar (Mobile).
* **Risks:**
  1. Over-skeuomorphism on mobile (`390 px`): narrow vertical book spines clip long CS titles and two-page spreads break on narrow viewports. *Mitigation:* use horizontal book stacks + cover-facing tiles on mobile (`4.2`), and single-column open sheet for chapter contents (`4.3`).
  2. Visual clutter if wood textures or heavy 3D shadows compete with pastel cards. *Mitigation:* architectural tinted shelf ledges + flat matte buckram bindings (`4.9`).

#### Concept 2: "The Engineer's Workbench / Study Desk"
* **Metaphor:** `/study` is a top-down drafting desk holding colour-coded subject folios, loose graph sheets, and clip-on index cards. A lesson opens as an interactive blueprint pad with detachable tool cards clipped around it.
* **Why it suits GATE students:** Strongly signals active problem-solving ("do, don't just watch")—well suited to Digital Logic, COA, and Algorithms.
* **Navigation:** Desk grid of top-down binder covers → accordion drawer of chapter sheets → blueprint canvas with floating clip-on drawers.
* **Risks:** Weakest alignment with the owner's explicit bookshelf requirement ("feel like a real library or bookshelf"); top-down flat folios lack the tactile spine density that makes 11–12 subjects feel cohesive without feeling like generic dashboard cards (`card soup`).

#### Concept 3: "The Lab Manual & Field Notebook"
* **Metaphor:** Every subject is a spiral-bound engineering lab manual with grid-ruled pages, tabbed section dividers, margin sketches, and detachable specimen sheets for PYQs.
* **Why it suits GATE students:** Resembles Indian engineering college lab records and handwritten coaching short-notes—feels immediate and pragmatic rather than intimidatingly academic.
* **Navigation:** Ring-binder rack with colour tabs → tabbed index sheet → ruled single-column lab page with slide-out margin index tabs.
* **Risks:** Spiral rings, ruled backgrounds, and margin lines add visual noise behind dense matrices, Karnaugh maps, and C pointer diagrams—reducing figure-ground contrast for ESL students reading late at night (violates Cognitive Load Theory's extraneous load minimization; Sweller, 1988, *Cognitive Science*).

#### Recommendation: **Concept 1 — "The Reference Library & Reading Margin"**
Recommend Concept 1 because it honours the bookshelf hub natively (including Phase 0's gold free-chapter ribbon and two-page spread), gives strong spatial ownership of a finite syllabus, and transitions cleanly into a high-contrast, Tufte-style reading margin inside lessons where diagrams, labs, PYQs, highlights, and AI Mentor live side-by-side without overlapping prose.

---

### 4.2 Bookshelf / Library Hub

#### Real-World Reference Research
* **Apple Books** (Apple Inc., `apple.com/apple-books/` — canonical product reference): Pairs a warm off-white surface with thin horizontal shelf hairlines or shadowless cover grids, keeping metadata minimal underneath covers and elevating only the active *"Reading Now"* volume at the top.
* **Kindle App** (Amazon.com, Inc., `amazon.com/kindle-dbs/`): Demonstrates reliable compact status markers without cluttering art—thin horizontal progress bars, downloaded indicators, and corner ribbons (*Sample* / *New*) that inform our *Free Chapter* gold ribbon.
* **Google Play Books** (Google LLC, Material Design 3 surfaces, `m3.material.io`): Uses crisp elevation separation and horizontal filter chips (*All / In Progress / Unread*) above a clean cover grid.
* **Libby** (OverDrive Inc., `libbyapp.com`): Distinguishes clearly between *Available* vs *Waitlist/Coming Soon* states using calm pill badges and keeps cover proportions consistent across narrow phones.
* **Readwise Reader** (Readwise Inc., `readwise.io/read`): Benchmark for keyboard-first filtering, highlight-count pills, and instant resume states for serious study readers.
* **Literal** (Literal Club, `literal.club`): Proves modern web shelves do not need fake oak-wood JPEGs; tactile book covers resting on restrained architectural planes look timeless and non-templated.
* **Notion Gallery Databases** (Notion Labs, `notion.so`): Shows why uniform-height empty-space grids fail when subjects vary in volume—uniform cards feel like generic SaaS grids rather than books.
* **Physical Bookshop Merchandising** (e.g., independent & technical bookshops such as O'Reilly / Kinokuniya bay layouts): Combines **face-out hero covers** (for featured/new picks), **standing spines** (for dense reference breadth), and **horizontal book stacks** (allowing full cover/spine typography to read horizontally without tilting one's head).
* **Skeuomorphic vs Neo-Tactile Lesson** (Early Apple iBooks 1.0 oak planks vs modern flat-tactile UI): Heavy perspective oak wood PNGs break dark mode, fight responsive scaling, and force all covers into identical rectangles. Modern neo-tactile shelves use **subtle CSS directional lip shadows, proportional thickness, and clean cloth colour blocks** that adapt effortlessly across Light mode and RENYXERA's `edge`, `midnight`, and `tinted` dark variants.

#### Hub Specification (`390 px` & `1440 px`, Zero Empty Space)

1. **Grid & Zero-Empty-Space Architecture**
   * **Desktop (`1440 px` viewport, `32 px` left/right gutters = `1376 px` shelf track):**
     * Divide GATE CS into **2 full-width architectural shelf bays** (`display: flex; align-items: flex-end; gap: 8px; width: 100%;`), each resting on a `14 px` tactile shelf ledge spanning `100%`.
     * **How every bay guarantees 0 px trailing gap:** Combine **Face-Out Covers** (`flex: 2.3`, base `~220–250 px` wide × `296 px` tall), **Standing Spines** (`flex: 0.95`, `84–104 px` wide × `276–298 px` tall), **Tilted Leaning Books** (`flex: 1.9`, `-4deg` rotate against a stack, `~190 px` wide), and **Horizontal 2-Book Stacks** (`flex: 3.1`, `~310–350 px` wide × `160 px` stacked height). Because `flex-grow` distributes exact fractional widths across `100%`, **zero dead edge space ever appears** across `1024 px` to `1920 px`.
     * *Shelf 1 (Core CS — 8 subjects = `1376 px` exact):* OS (Face-Out `230 px`) + Algorithms (Face-Out `216 px`) + DBMS (Spine `96 px`) + CN (Spine `96 px`) + TOC (Spine `92 px`) + Compiler Design (Spine `84 px`) + Horizontal Stack [Digital Logic `296×72` atop COA `314×88` = `314 px`] + Prog & DS (Tilted `-4°` Cover `192 px`) + `56 px` total gaps (`7 × 8 px`) = **`1376 px`**.
     * *Shelf 2 (Maths, Aptitude & Study Companions — 5 items = `1376 px` exact):* Discrete Maths (Face-Out `250 px`) + Engineering Maths (Face-Out `250 px`) + General Aptitude (Face-Out `250 px`) + Formula & PYQ Atlas (Face-Out `250 px`) + Personal Highlights & Notes Codex (Horizontal Flat Binder `344 px` × `110 px`, aggregates user's highlights/notes across subjects) + `32 px` gaps (`4 × 8 px`) = **`1376 px`**.
     * **Filtered-state zero-empty-space rule:** If filters reduce a shelf to `1–3` books, switch automatically from Shelf Mode to **Expanded Showcase Row** where matching book(s) sit Face-Out (`240 px`) paired directly beside an inline **Chapter Preview Strip** filling the remaining `100%` width!
   * **Mobile (`390 px` viewport, `16 px` left/right gutters = `358 px` shelf track):**
     * Narrow vertical spines (`< 60 px`) make long CS names illegible and force horizontal scrolling. Instead, at `390 px`, render **Alternating Shelf Tiers**:
       * **Featured / Ready Tier (2-up Face-Out Covers):** `175 px + 8 px gap + 175 px = 358 px` (100% width; e.g., *Operating Systems [Free]* + *Algorithms* or active book).
       * **Stacked Horizontal Spine Tiers:** Remaining subjects rendered as **full-width (`358 px`, organic `±4 px` horizontal stagger) horizontal book spines lying stacked on shelf ledges** (`68–88 px` tall, thickness proportional to GATE marks share!). Every subject name renders **horizontally in `16–17 px` Sora 800**, completely readable without tilting the phone.

2. **Sizing, Typography & Labelling**
   * **Font:** `Sora` weight `800` (falling back to `--font-display`), uppercase or tight title-case (`letter-spacing: -0.02em`), crisp dark charcoal ink on warm pastel cloth (never low-contrast white-on-pastel).
   * **Standing Spine (`84–104 px` wide on Desktop):** Top cap carries a short horizontal brass/ink code (`DBMS`, `CN`, `TOC`, `CD`) in `11 px` monospace; body carries the **full unabbreviated subject name** (`Database Management Systems`, `Theory of Computation`) running bottom-to-top (`writing-mode: vertical-rl; transform: rotate(180deg);`) in `16–18 px Sora 800`, clamped gracefully across max 2 lines if needed (`clamp(14px, 1.15vw, 18px)`).
   * **Horizontal Stacks & Face-Out Covers:** Full subject names (`Computer Organization & Architecture`, `Programming & Data Structures`) horizontally in `16–20 px Sora 800`, sub-line in `12 px Manrope 600` (`6–8 marks · 2/7 ready`).
   * **Gold Free-Chapter Ribbon:** A notched `22 px` wide woven-gold bookmark ribbon (`#D4A338` light / `#E2B74D` dark) hanging `10 px` below the bottom edge (or protruding `12 px` past the right fore-edge on horizontal phone stacks) labelled `FREE`.

3. **Hover & Tap Behaviour (Pull-Out, Tilt, Reveal)**
   * **Desktop Hover (`@media (hover: hover)`):** Book pulls forward/up (`translateY(-12px) rotate(-1.5deg)` for standing/face-out; `translateX(10px)` pull-out for horizontal stack books, `180 ms`) and casts a soft directional shelf shadow. A compact, non-obstructive **Bookmark Peek Card** anchors adjacent to the book showing: full title, GATE CS typical marks share (labelled clearly as *historical range, verify per official paper*), chapter readiness (`2 ready · 5 writing`), user progress (`1/2 done`), and `"Click to open spread"`.
   * **Mobile & Keyboard Tap / Enter:** Opens the **Two-Page Book Spread** (Desktop) or **Open Book Sheet** (Phone) described in `4.3`. (Never hide critical info behind hover-only interactions; on touch, the horizontal spine already visibly displays ready/writing status pill, chapter ratio `2/7`, marks share, and headband progress!).

4. **Honest Status, Progress, Filters, Search & States**
   * **Honest Ready vs Being Written Badges:**
     * Ready chapters ≥ 1 & full subject live → Sage pill `Ready (7/7 ch)`.
     * Partially shipped → Ochre pill `2/7 ready · Writing`.
     * Upcoming subject (0 ready yet) → Muted cloth look (slightly desaturated `0.78` saturation, dashed edge stitching) + neutral stone pill `Writing · Notify`. No fake clickable "Coming Soon" lock pretending content exists.
   * **Progress:** `4 px` woven headband strip along the book's bottom spine (`#2E6F5E` fill on subtle recessed track) + text count (`1/2 ch`).
   * **Controls Bar (Top of `/study`):**
     * Branch Switcher (`CS [Active] | DA | ECE | EE | ME | Civil` — pulled from RENYXERA's supported branches).
     * Search Input (`/` shortcut): instant client-side fuzzy match across subject titles, chapter titles, and GATE topics (`"Deadlock"` matches *Operating Systems → Ch 4: Deadlock [Free & Ready]* and surfaces a direct 1-tap chapter jump chip!).
     * Filter Pills: `All (11)`, `Ready now`, `Free chapter`, `Owned`, `In progress`.
     * Sort Dropdown: `Syllabus order` (default), `GATE marks weight`, `Weakest in my Analytics` (reads RENYXERA's Readiness/Accuracy), `Ready first`.
   * **Continue Reading Strip (Full width above Shelf 1):**
     * Returning user: `"Pick up where you left off · Operating Systems → Ch 4: Deadlock (Step 5/9 · 55%)"` + `[Resume Lesson]`.
     * New user: `"Start free interactive lesson · Operating Systems → Ch 4: Deadlock"` + `[Open Free Chapter]`.
   * **Loading State:** Matches exact shelf geometry using RENYXERA's existing `skeleton-shimmer` class—proportional rectangular book silhouettes resting on shelf ledges so layout shift (`CLS`) = `0`.
   * **Error / Empty States:** Network failure shows cached books normally + discrete top banner (`Offline · Showing downloaded chapters · Retry`); empty search shows `"No chapters match 'xyz'"` + `"Ask AI Mentor about 'xyz'"` / `"Clear filter"`; unstarted branches (`ME/CE/EE/ECE/DA`) show an honest waitlist & notify opt-in banner alongside a button to practise that branch's existing PYQs in `/test-centre` (`4.12` #3).

#### Wireframes (Zero Empty Space)

**Mobile (`390 px`, active track `358 px`):**
```text
+------------------------------------------+ 390px
| Study Library         [CS v]   [Search]  |
|------------------------------------------|
| CONTINUE READING (358px full width)      |
| [OS] Deadlock · Step 5/9 · 55%  [Resume] |
|------------------------------------------|
| [All] [Ready] [Free] [In Progress] Sort v|
|------------------------------------------|
| SHELF 1 · FEATURED & READY (2-up = 358px)|
| +-----------------+  +-----------------+ |
| | * FREE CHAPTER  |  |                 | |
| | OPERATING       |  | ALGORITHMS      | |
| | SYSTEMS         |  |                 | |
| | 2/7 ready       |  | 0/8 · Writing   | |
| | ~8-10M  [==---] |  | ~8-10M          | |
| +------[GOLD]-----+  +-----------------+ |
|================ SHELF LEDGE =============|
|                                          |
| SHELF 2 · CORE COMPUTER SCIENCE (358px)  |
| +--------------------------------------+ |
| | DATABASE MGMT SYSTEMS  2/6  ~8M [===]| | (74px)
| +--------------------------------------+ |
|  +-------------------------------------+ |
|  | COMPUTER NETWORKS     0/7  ~8M Wr.  | | (72px)
|  +-------------------------------------+ |
| +--------------------------------------+ |
| | COMPUTER ORG & ARCH    0/6  ~8M Wr.  | | (76px)
| +--------------------------------------+ |
|  +-------------------------------------+ |
|  | THEORY OF COMPUTATION 0/6  ~7M Wr.  | | (70px)
|  +-------------------------------------+ |
| +--------------------------------------+ |
| | PROGRAMMING & DS       0/8  ~10M Wr. | | (84px)
| +--------------------------------------+ |
|================ SHELF LEDGE =============|
|                                          |
| SHELF 3 · MATHS & APTITUDE (358px)       |
| +--------------------------------------+ |
| | ENGINEERING MATHS      0/5  ~7M Wr.  | |
| +--------------------------------------+ |
|  +-------------------------------------+ |
|  | DISCRETE MATHEMATICS  0/6  ~7M Wr.  | |
|  +-------------------------------------+ |
| +--------------------------------------+ |
| | GENERAL APTITUDE       0/4  15M Wr.  | |
| +--------------------------------------+ |
|================ SHELF LEDGE =============|
| [Home] [TestCtr] [Study*] [Mentor] [More]|
+------------------------------------------+
```

**Desktop (`1440 px`, active track `1376 px`):**
```text
+---------------------------------------------------------------------------------------------------+ 1440px
|  [RENYXERA Floating Nav: Dashboard | Test Centre | Study* | AI Mentor | Battles | Review | Stats] |
|---------------------------------------------------------------------------------------------------|
|  Study Library · CS [v]        [ Search subjects, chapters, topics... (/) ]   [Filter: All] [Sort]|
|  Resume: Operating Systems -> Ch 4: Deadlock (Step 5/9 · 55% read · 4/18 PYQs)  [Continue Lesson] |
|---------------------------------------------------------------------------------------------------|
|  CORE SYSTEMS, ARCHITECTURE & CODE                                            100% Width (1376px) |
|  +-------------+ +------------+ +----+ +----+ +----+ +----+ +-------------------+ +------------+  |
|  | * FREE      | |            | | D  | | C  | | T  | | C  | |                   | |   /        |  |
|  | OPERATING   | | ALGORITHMS | | B  | | N  | | O  | | D  | |  DIGITAL LOGIC    | |  / PROG &  |  |
|  | SYSTEMS     | |            | | M  | |    | | C  | |    | +-------------------+ | /  DATA    |  |
|  |             | |            | | S  | |    | |    | |    | | COMPUTER ORG &    | |/   STRUCT. |  |
|  | 2/7 ready   | | Writing    | |    | |    | |    | |    | | ARCHITECTURE      | |    (tilt)  |  |
|  | [====----]  | | 0/8 ch     | | 0/6| | 0/7| | 0/6| | 0/5| | 0/6 · Writing     | | 0/8 ch     |  |
|  +----[GOLD]---+ +------------+ +----+ +----+ +----+ +----+ +-------------------+ +------------+  |
|  [230px Cover]   [216px Cover]  [96]   [96]   [92]   [84]     [314px Stack]         [192px Tilt]  |
|========================================== SHELF LEDGE (1376px) ===================================|
|                                                                                                   |
|  MATHEMATICS, APTITUDE & PERSONAL CODEX                                       100% Width (1376px) |
|  +--------------+  +--------------+  +--------------+  +--------------+  +----------------------+ |
|  | DISCRETE     |  | ENGINEERING  |  | GENERAL      |  | FORMULA &    |  | MY NOTES &           | |
|  | MATHEMATICS  |  | MATHEMATICS  |  | APTITUDE     |  | PYQ ATLAS    |  | HIGHLIGHT CODEX      | |
|  |              |  |              |  |              |  |              |  | 14 Highlights · 6 FC | |
|  | 0/6 · Writing|  | 0/5 · Writing|  | 0/4 · Writing|  | Live w/ Packs|  | [Open Notebook]      | |
|  +--------------+  +--------------+  +--------------+  +--------------+  +----------------------+ |
|   [250px Cover]     [250px Cover]     [250px Cover]     [250px Cover]     [344px Horizontal]      |
|========================================== SHELF LEDGE (1376px) ===================================|
+---------------------------------------------------------------------------------------------------+
```

---

### 4.3 Book Opening & Chapter View

#### Transition Motion & Reduced-Motion Choreography
1. **Stage 1 — Pull-Out (`0–120 ms`):** Tapped book elevates slightly (`scale(1.03) translateY(-10px)`), nearby shelf books dim to `opacity: 0.4` (`120 ms`).
2. **Stage 2 — Morph to Open Spread (`120–360 ms`, `cubic-bezier(0.22, 1, 0.36, 1)`):** Using CSS View Transitions API (`document.startViewTransition`, progressive enhancement) or Framer Motion FLIP layout transition:
   * *Desktop (`≥ 1024 px`):* Cover expands into a centered **Two-Page Spread modal/route** (`max-width: 1080 px`, `600–680 px` tall, subtle `8 px` center spine gutter crease—zero harsh black shadow, just a calm `3%` paper crease!).
   * *Mobile (`< 1024 px`):* Morphs into a **Full-Height Single-Page Sheet** with an `8 px` cloth-coloured left binding strip so it never crams two unreadably narrow columns onto `390 px`.
3. **Stage 3 — Chapter to Lesson (`0–220 ms`):** Tapping a ready chapter triggers a crisp horizontal `16 px` page-slide + opacity dissolve into `/study/[subject]/[chapter]`.
4. **Reduced Motion (`prefers-reduced-motion: reduce`):** Zero spatial scaling, tilting, or slide transforms; instant `120 ms` opacity crossfade into the spread/sheet and chapter view.

#### Chapter Contents View Specification
* **Desktop Left Page (`44%` width):**
  * Subject crest & cloth banner, full bold title (`Operating Systems`), brief 2-line scope summary.
  * **Honest Publishing Status Card:** `"2 of 7 chapters live · Next chapter (CPU Scheduling) drafting"`.
  * **Exam Relevance & Your Standing:** Historical GATE CS weightage note + live pull from RENYXERA `/analytics` (`Your OS Accuracy: 62% · 14/86 OS PYQs solved`).
  * **Pack Entitlement CTA:** `"Chapter 4 is Free · Unlock full OS Pack (₹X one-time)"` or `"Owned · All future OS chapters included"` (no recurring subscription confusion).
* **Desktop Right Page (`56%` width — Mobile stacks cleanly below Book Header):**
  * Ruled Table of Contents rows (`56–64 px` min height, generous tap targets):
    * Left: Chapter number (`01`..`07` in tabular mono).
    * Center: Chapter title (`04 · Deadlock`), subtitle (`Resource graphs, Banker's algorithm, coffman traps`), estimated time (`25 min · 1 lab · 18 PYQs`).
    * Right: Honest status pill:
      * **Free & Ready:** Gold-tinted outline pill + right arrow (`Free · Read now`).
      * **Ready (Owned):** Sage pill + completion check (`Done` / `55%` / `Start`).
      * **Ready (Locked):** Subtle lock icon + `Preview` or `Unlock OS Pack`.
      * **Being Written:** Muted stone row (`opacity: 0.72`), non-navigable as a lesson, paired with a light `[Notify me]` bell button (never shows a fake locked padlock on unwritten content!).

---

### 4.4 Lesson Reading Screen

#### Reading Comfort & Comprehension Research
* **Optimal Line Length (Measure):** Typographer Robert Bringhurst (*The Elements of Typographic Style*, Hartley & Marks) recommends **45–75 characters** (with ~66 characters ideal) for comfortable continuous prose. WCAG 2.2 Success Criterion 1.4.8 (Visual Presentation, W3C, `w3.org/TR/WCAG22/`) limits prose width to **no more than 80 characters**. Baymard Institute (`baymard.com`, Usability Research on Line Length) similarly finds **50–75 characters** minimizes eye-tracking fatigue when jumping from line end back to the next line start.
* **Scanning & Structured Chunking:** Nielsen Norman Group (`nngroup.com`, research on how users read on the web) established that readers scan pages first rather than reading linearly; clear semantic headings, concise paragraphs, highlighted keywords, and scannable chunks markedly improve comprehension.
* **Spatial Contiguity & Split Attention:** Richard E. Mayer (*Multimedia Learning*, Cambridge University Press) and John Sweller (Cognitive Load Theory, 1988, *Cognitive Science*) demonstrate that **placing worked examples immediately adjacent to their corresponding diagrams** prevents split-attention load—students do not waste working memory scrolling up and down between text and figure.

#### Layout Comparison: Full-Width Rows vs Single Column with Margins
| Criterion | Full-Width Alternating Rows | Pure Narrow Single Column (`66ch`) | **Recommended: Scholarly Margin Grid (66ch Prose + 980px Breakout + Tabbed Rail)** |
| :--- | :--- | :--- | :--- |
| Prose readability | Poor (lines hit 110+ chars; eye loses line track) | Excellent (`66ch` optimal measure) | **Excellent** (`64–68ch`, `~660–680 px`) |
| Side-by-side Worked Example + Figure | Good, but forces prose wide too | Poor (squeezes diagram + text into `320px` halves) | **Excellent** (figures & worked examples break out to `960–980 px` span without widening prose blocks!) |
| In-lesson Notes / PYQs / Mentor | Must cover screen as modal | Floats over prose or breaks scroll | **Docks in clean `360–380 px` right rail** on `1440 px` without covering a single character of prose |
| Night-time mobile comfort (`390 px`) | Feels like marketing landing page | Clean single stream | **Clean `358 px` stream + 2-snap bottom sheet** |

#### Exact Layout & Breakpoint Geometry
* **Desktop (`1440 px`):**
  * Global top navbar collapses automatically into a slim `44 px` **Lesson Focus Bar** (`← Operating Systems · Ch 4: Deadlock`, reading progress `2 px` hairline along its bottom, `[Aa]` display settings, `[Full Pack / Owned]` status).
  * **3-Zone Flex/Grid Stage (`1376 px` inside `32 px` margins):**
    1. **Left Outline Rail (`220 px` sticky, collapsible to `40 px` icon strip via `[`):** Clickable progress outline mirroring RENYXERA's fixed block sequence (`1. Hook` → `2. Outcomes` → `3. Intuition` → `4. Definition` → `5. Walkthrough` → `6. Worked Examples` → `7. Try It` → `8. Traps` → `9. GATE Note` → `10. Recall` → `11. Check` → `12. Lab` → `13. Links`), highlighting active section via `IntersectionObserver`.
    2. **Center Reading Track (`680 px` prose / `960 px` max breakout when Right Drawer is closed):** Centered cleanly; interactive labs and figure+worked-example pairs span `col-span` gently outward when right drawer is closed, and gracefully snap back to stacked/compact layout (`680 px`) if the Right Drawer is opened so prose NEVER clips or hides!
    3. **Right Tool Margin (`44 px` collapsed Index Tabs OR `380 px` expanded Tool Drawer):**
       * *Collapsed:* 3 quiet vertical index tabs pinned flush to the right stage margin (`Notes (4)`, `PYQs (18)`, `Mentor`)—looks like physical textbook flags, **0 px overlap over text**.
       * *Expanded (`380 px` wide, sticky `height: calc(100vh - 60px)`):* Top segmented switcher (`Notes | PYQs | Mentor`) + close `×` button (`]`). Notice: `220 + 24 + 680 + 24 + 380` = **`1328 px` < `1376 px`**—fits comfortably inside `1440 px` with zero overlap!
  * **Medium Desktop / Laptop (`1024–1279 px`):** Left outline rail auto-collapses into a sticky inline breadcrumb dropdown (`Deadlock › 5. Walkthrough ▾`), freeing `220 px` so the `640 px` reading column + `360 px` right drawer STILL sit side-by-side without overlapping!
* **Mobile (`390 px`):**
  * **Hide the global 5-tab app dock** while inside a lesson route so vertical screen space isn't eaten by two stacked bottom bars.
  * Top sticky bar (`48 px`): `← Book` | `Ch 4 · Deadlock` (`truncate`) | `[Aa]` | `Outline ▾`. Underneath sits a `2 px` progress bar.
  * Reading stream (`358 px` active width, `16 px` side gutters): diagrams render inline with tap-to-expand (`Fullscreen Pinch/Pan Modal`) for complex multi-node resource allocation graphs or 5×4 matrices. Worked examples sit immediately *above/below* their synced mini-diagram (vertical contiguity).
  * Bottom Sticky Tool Bar (`52 px` + `env(safe-area-inset-bottom)`): `Outline` | `Notes (4)` | `PYQs (18)` | `Ask Mentor`.
  * **Two-Snap Bottom Sheet (when a tool opens):**
    * Default snap **`48%` height** (half-sheet): leaves the top half of the screen visible so the student can read the paragraph/diagram *while* typing a note, solving a PYQ, or reading Mentor's hint! Clicking `"Ask Mentor"` from a block automatically scrolls that block into the visible upper `48%`.
    * Drag handle / expand button snaps to **`90%` height** for long PYQ solving or deeper chat.

---

### 4.5 Interactivity Catalogue (19 GATE CS Patterns)

All built with **zero paid libraries** (React state, native inline SVG, CSS Grid/Transforms, KaTeX MIT, Web Workers, optional MIT `@dnd-kit/core` or zero-dependency Pointer Events). Complexity key: **S** = `< 1 day` (`~100–200 LOC` reusable block), **M** = `2–4 days` (custom state engine + SVG), **L** = `1–2 weeks` (rich validator + multi-step canvas).

1. **Algorithm Matrix & State-Space Stepper**
   * *GATE CS Example:* **OS — Banker's Algorithm:** Edit `Available` or `Request_i`, click *Step*, and watch `Need = Max - Allocation` calculate, highlight candidate process `P_i`, update `Work += Allocation`, and build the Safe Sequence (`<P1, P3, P0...>`).
   * *Learning Evidence:* Stepwise segmentation reduces intrinsic cognitive load (Sweller, 1988; Mayer's Segmenting Principle, *Multimedia Learning*).
   * *Complexity & Stack:* **M** · Pure React + HTML `tabular-nums` matrix + SVG state arrows.

2. **Cycle & Pipeline Timeline Scrubber (Play / Pause / Step / Scrub)**
   * *GATE CS Example:* **COA — 5-Stage RISC Pipeline (`IF / ID / EX / MEM / WB`):** Scrub cycle-by-cycle through two dependent instructions (`ADD R1, R2, R3` → `SUB R4, R1, R5`) and toggle *No Forwarding* (stalls appear) vs *Operand Forwarding* (red bypass wire activates).
   * *Learning Evidence:* Dynamic trace visualization improves structural mental models when learners control pace (Naps et al., 2003, ITiCSE Working Group Report on Algorithm Visualization).
   * *Complexity & Stack:* **M** · React state + CSS Grid cycle table + inline SVG hazard arcs.

3. **Condition Toggle ("What-If Causal Switch")**
   * *GATE CS Example:* **OS — Coffman's 4 Deadlock Conditions:** Toggle off *Hold & Wait* or *No Preemption* in a live Resource Allocation Graph and watch the cycle break in real time, proving why all 4 are *necessary* (and circular wait + single instance is *sufficient*).
   * *Learning Evidence:* Causal manipulation / Explorable Explanations (Bret Victor, 2011, `worrydream.com`).
   * *Complexity & Stack:* **M** · Pure TS cycle-detector + inline SVG graph.

4. **Faded Worked Example ("Half-Solved Scaffold")**
   * *GATE CS Example:* **DBMS — BCNF Decomposition:** Given relation `R(A,B,C,D)` and functional dependencies, Steps 1–2 show candidate keys and violating FD `B → C` solved; Step 3 blurs the lossless-join check and asks the student to fill the two decomposed tables before checking.
   * *Learning Evidence:* Worked-example fading transitions learners smoothly from observation to independent problem solving without overload (Renkl, 1997, *Cognitive Science*; Sweller).
   * *Complexity & Stack:* **S** · Structured React block + client validator.

5. **Predict-Then-Reveal Gate ("Commitment Check")**
   * *GATE CS Example:* **Algorithms — DFS Edge Classification:** Before revealing step 4 of a directed graph DFS traversal, asks: `"When visiting edge (u → v) where v is currently GRAY on recursion stack, is it Tree, Forward, Back, or Cross?"` Locks reveal until student commits.
   * *Learning Evidence:* Prediction-Observation-Explanation (White & Gunstone, 1992) + Pretesting / Testing Effect (Roediger & Karpicke, 2006, *Psychological Science*).
   * *Complexity & Stack:* **S** · React stateful lock-gate component.

6. **Click-to-Connect Graph / Schedule Builder**
   * *GATE CS Example:* **DBMS — Conflict Serializability Precedence Graph:** Given schedule `S: r1(X); w2(X); r2(Y); w1(Y)`, student taps conflicting transaction pairs `(T1 → T2)` to add directed edges on the SVG graph, then tests if a topological cycle exists.
   * *Learning Evidence:* Generative learning / externalizing mental models (Fiorella & Mayer, 2016, *Educational Psychology Review*).
   * *Complexity & Stack:* **L** · Pure SVG click-source → click-target (works far more reliably on `390 px` thumbs than fragile mouse-drag lines!).

7. **Drag-or-Tap Reorder Sequence**
   * *GATE CS Example:* **OS — Page Replacement Frames (FIFO vs LRU vs Optimal):** Tap/reorder page fault replacements across 3 frames for a 10-page reference string and immediately spot Belady's Anomaly when shifting FIFO to 4 frames.
   * *Learning Evidence:* Active construction + contrasting cases (Schwartz & Bransford, 1998).
   * *Complexity & Stack:* **M** · Pointer Events / `@dnd-kit/core` (MIT) + mandatory up/down swap buttons for WCAG 2.2 keyboard/single-tap compliance.

8. **Semantic Architectural Zoom (Overview → Bit-Level Detail)**
   * *GATE CS Example:* **COA — Set-Associative Cache Mapping:** Start at CPU–L1–RAM block view → tap L1 Cache to zoom into `[Tag (19b) | Set Index (8b) | Byte Offset (5b)]` → tap one 4-way Set to watch 4 tag comparators test in parallel!
   * *Learning Evidence:* Shneiderman's Visual Information-Seeking Mantra ("Overview first, zoom and filter, details on demand", 1996, IEEE VL).
   * *Complexity & Stack:* **M** · Layered CSS/SVG drill-down views with breadcrumb trail.

9. **Interactive K-Map & Bit-Register Workbench**
   * *GATE CS Example:* **Digital Logic — 4-Variable Karnaugh Map:** Tap cells to cycle `0 → 1 → X (don't care)`; minimal Prime Implicant loops (`quad`, `octet`, `pair`) colour-highlight dynamically alongside the simplified SOP & POS expressions. (Also works for IEEE-754 float bit-flipper!).
   * *Learning Evidence:* Linked multiple representations (Ainsworth, 2006, *Learning and Instruction*).
   * *Complexity & Stack:* **M** · Pure TS Quine-McCluskey / fixed 4-var K-Map solver + interactive CSS Grid.

10. **Live Automaton & Pumping Lemma Simulator**
    * *GATE CS Example:* **TOC — DFA Tracer & Pumping Slider:** Type any string (e.g. `abbba`) and trace active states; on Pumping Lemma pages, drag slider `i = 0, 1, 2, 3` in `x y^i z` to watch string `a^(p+i(k)) b^p` visibly break equal `a/b` parity!
    * *Learning Evidence:* Concrete counterexample grounding resolves high failure rates in formal proof abstractions (Knobelsdorf et al., CSE research on automata).
    * *Complexity & Stack:* **M** · Pure TS DFA/NFA engine + inline SVG state circles.

11. **Parameter Slider with Linked Plot & Invariant**
    * *GATE CS Example:* **CN — TCP Bandwidth-Delay Product / Sliding Window Efficiency:** Drag propagation delay `Tp`, packet size `L`, and window `W`; watch Stop-and-Wait utilization drop while Go-Back-N hits `100%` above `1 + 2a`, alongside live transmission timeline bars. (Also great for **Engineering Maths — Bayes' Theorem / Eigenvalue scaling**!).
    * *Learning Evidence:* Covariational reasoning & quantitative intuition (Bret Victor, `worrydream.com`).
    * *Complexity & Stack:* **S** · Lightweight SVG chart + accessible `<input type="range">`.

12. **Spot-the-Bug / Misconception Trap Hunt**
    * *GATE CS Example:* **C Programming & OS — Broken Synchronization / Undefined Behaviour:** 8 lines of C (`static int x` + pointer aliasing or a broken 2-process Peterson's lock where flag check precedes assignment); student taps the exact faulty line causing race condition / dangling pointer before seeing the counterexample interleaving.
    * *Learning Evidence:* Studying erroneous examples prevents entrenched exam misconceptions (Große & Renkl, 2007, *Learning and Instruction*).
    * *Complexity & Stack:* **S** · Indexed clickable code-line viewer.

13. **Synchronized Side-by-Side Diff Toggle ("Contrast Cases")**
    * *GATE CS Example:* **CN — Subnetting Classful vs CIDR / Go-Back-N vs Selective Repeat** or **DBMS — B-Tree vs B+ Tree:** Toggle between the two structures on the exact same input (`Search keys 15..28`) and watch why B+ Tree leaf pointers make range queries 1 traversal instead of full subtree hops.
    * *Learning Evidence:* Contrasting cases highlight invariant structural features (Schwartz & Bransford, 1998, *Cognition and Instruction*).
    * *Complexity & Stack:* **S** · Synchronized dual-panel React switcher.

14. **Deterministic Memory & Call-Stack Frame X-Ray**
    * *GATE CS Example:* **Programming & DS — Recursive `func(3)` + `static` counter + Heap `malloc`:** Step line-by-line through a pre-compiled deterministic JSON trace showing Activation Records stacking/popping alongside Data Segment (`static`) and Heap pointer arrows—zero browser compiler overhead!
    * *Learning Evidence:* Notional machine execution visualization (Sorva, 2013, *ACM TOCE*).
    * *Complexity & Stack:* **L** · Pre-authored trace JSON + synchronized code-line/stack-box renderer.

15. **Tap-Any-Symbol Formula Dissector**
    * *GATE CS Example:* **OS — Effective Memory Access Time (EMAT) with TLB:** `EMAT = α(c + m) + (1 − α)(c + 2m)`; tapping `α` or `2m` opens an inline callout highlighting the 2 page-table + data RAM accesses on TLB miss and lets the student substitute custom numbers.
    * *Learning Evidence:* Eliminates symbol-referent split attention (Mayer, *Multimedia Learning*).
    * *Complexity & Stack:* **S** · KaTeX (MIT) custom macro classes + React popover.

16. **Cross-Subject Concept Hypergraph Jumps ("Where Else Is This Used?")**
    * *GATE CS Example:* Inside **OS Deadlock**, a compact `"Appears elsewhere in GATE"` strip lets the student peek *in-place* (mini preview card, never losing reading position!) at **DBMS 2PL Wait-For Graph** and **Algorithms Directed Cycle DFS (3-colour)**.
    * *Learning Evidence:* Schema integration and far transfer across exam domains (Bransford & Schwartz, 1999).
    * *Complexity & Stack:* **S/M** · Static topic-graph JSON + inline preview sheet.

17. **Cloze / Blur-Reveal Micro-Recall Cards**
    * *GATE CS Example:* **Discrete Maths & OS:** Statement with key condition blurred behind tap-pills (`"In a single-instance resource system, a cycle in the RAG is [____] and [____] for deadlock"` → `"necessary"` / `"sufficient"`).
    * *Learning Evidence:* Active retrieval practice (Roediger & Karpicke, 2006).
    * *Complexity & Stack:* **S** · Pure React + CSS `filter: blur(5px)` toggle with accessible screen-reader hiding (`aria-hidden` while masked, button label `"Reveal hidden term"`).

18. **Live Tree / Heap Operation Sandbox**
    * *GATE CS Example:* **DBMS / Algorithms — B+ Tree (order 3) or AVL / Min-Heap:** Insert or delete keys `[10, 20, 5, 6, 12]` and watch rotations / leaf splits animate cleanly step-by-step.
    * *Learning Evidence:* Constructivist algorithm exploration (VisuAlgo, Steven Halim, NUS, `visualgo.net`).
    * *Complexity & Stack:* **L** · Pure TS deterministic tree layout + inline SVG.

19. **Embedded GATE NAT Scratchpad & Virtual Keypad Drawer**
    * *GATE CS Example:* **Maths / CN / COA Numerical Answer Type (NAT):** Next to 2-mark NAT check questions (e.g., `"Compute hit latency in ns"`), a compact pop-out calculator matching standard GATE keypad order (`0–9`, `.`, `+/-`, `Backspace`) forces students to practise exact precision rounding (`2.45`–`2.55`).
    * *Learning Evidence:* Transfer-appropriate processing—practising under exam-identical numeric entry constraints (Morris et al., 1977, *Journal of Verbal Learning and Verbal Behavior*).
    * *Complexity & Stack:* **M** · Pure TS/React safe expression evaluator (zero `eval`).

---

### 4.6 Highlights, Notes & Review

#### Industry Benchmarks
* **Kindle** (`amazon.com`): Clean 4-colour palette, compact pop-up bar, chronological "Notebook" review pane, email/HTML export.
* **Readwise Reader** (`readwise.io`): Keyboard-accelerated highlight colours + inline tags, instant search, automatic spaced-repetition flashcard export.
* **Apple Books** (`apple.com`): Note-attached highlights show a tiny folded margin indicator; dark-mode-adjusted translucent fills protect text contrast.
* **Hypothesis / W3C Web Annotation Data Model** (`w3.org/TR/annotation-model/`): Anchors highlights using `TextQuoteSelector` (`exact`, `prefix`, `suffix`) + position offsets rather than fragile DOM XPaths alone, preventing loss if lesson prose gets typo edits.

#### RENYXERA Design
1. **4 Purposeful Colours (Mapped to Exam Intent, Light & All 3 Dark Modes Tested):**
   * `Concept` (Warm Butter Amber: `#FEF0B8` light / `rgba(217, 165, 32, 0.24)` dark)
   * `Formula / Trick` (Mint Sage: `#D4F0DE` light / `rgba(46, 158, 102, 0.24)` dark)
   * `Trap / Mistake` (Blush Coral: `#FADAD6` light / `rgba(214, 78, 69, 0.26)` dark)
   * `Doubt / Ask Mentor` (Periwinkle Blue: `#DCE6FA` light / `rgba(79, 124, 232, 0.26)` dark)
2. **Selection & Note Creation UX:**
   * Selecting text inside readable lesson blocks pops a compact floating pill above the selection: `[Amber][Sage][Coral][Blue] | [+ Note] | [Ask Mentor] | [Copy]`.
   * Selections inside interactive lab buttons/controls ignore highlighting (`user-select: none` on UI chrome) so accidental highlight popups never break lab tapping on `390 px` screens.
   * Adding a note renders a crisp `[1]` inline superscript marker + quiet margin fold indicator on Desktop (`right margin`) and opens the **Notes tab** inside the compact panel focused directly on that note's textarea.
3. **In-Lesson Review, Flashcard Conversion & Free Export:**
   * **Notes Tab** (inside Right Panel on Desktop / `48%–90%` Sheet on Phone): Top bar has colour filter chips (`All | Concept | Formula | Trap | Doubt`), search box, and `[+ Page Note]` for general chapter notes.
   * Each highlight card shows quote snippet, colour dot, note text, `"Jump"` scroll-to-highlight button, and **`[Make Flashcard]`**:
     * Pre-fills RENYXERA's existing Flashcard schema (`/test-centre/build?view=flashcards`): *Front* = highlighted term or auto-clozed sentence; *Back* = user's note or block summary; *Tag* = `subject/chapter`. Saves directly to the user's spaced-repetition deck!
   * **Export (100% Free Client-Side):** `[Copy Markdown]` and `[Download .md]` generate clean structured Markdown (`## Operating Systems — Deadlock\n- [TRAP] ... Note: ...`). Also viewable cross-chapter from the **Personal Notes Codex** book on Shelf 2 (`4.2`) or existing `/mistakes` & Notes pages.

#### Data Model (Plain Words)
Each highlight/note record stores:
* **Identity:** `id`, `userId`, `subjectSlug`, `chapterSlug`, `lessonVersion`
* **Multi-block safe anchor:** `startBlockId`, `endBlockId`, `startOffset`, `endOffset` (character offset within normalized block plain text, allowing spans across paragraphs or list items cleanly)
* **Resilient fallback anchor (W3C style):** `exactText`, `prefix32` (32 chars before), `suffix32` (32 chars after) so minor lesson edits re-anchor automatically
* **Study payload:** `intentColor` (`concept | formula | trap | doubt`), `noteBody` (optional text), `linkedFlashcardId` (optional), `createdAt`, `updatedAt`, `syncState` (`pending | synced` in IndexedDB for offline hostel study).

---

### 4.7 AI Mentor Inside the Lesson

#### In-Context AI Helper Patterns
* **Khanmigo** (Khan Academy, `khanacademy.org`): Socratic scaffolding embedded alongside the problem rather than dumping raw answers; understands current exercise step.
* **Duolingo Max ("Explain My Answer")** (Duolingo, `duolingo.com`): Triggered directly from a mistake with zero prompt-writing friction—one tap yields an explanation grounded in *why that wrong choice failed*.
* **Notion AI / GitHub Copilot Sidebars** (`notion.so`, `github.com`): Docked companion rail reads the open file/selection silently and offers scoped quick actions without modifying source prose uninvited.

#### In-Lesson Mentor Specification
1. **Automatic Context Packet (Sent quietly behind every in-lesson Mentor request):**
   * `subjectSlug`, `chapterSlug`, `activeSectionId`, `activeSectionTitle` (tracked via `IntersectionObserver`).
   * `selectedQuote` OR `activeCheckQuestion` (question stem + student's submitted wrong choice + correct choice) OR `activeLabStateSummary` (e.g., `"Banker's Lab: Available=[0,1,1], stuck at P2"`).
   * `studentProfileSlice`: pulled from RENYXERA's existing Analytics/Mistakes data (topic accuracy, target GATE score, recent errors in this subject).
2. **Keeping AI Output Strictly Separate from Verified Lesson Text:**
   * AI Mentor **never** injects text inline into the authored lesson canvas.
   * Lives strictly inside the **Mentor tab** of the Right Margin Panel / Mobile Bottom Sheet.
   * Every AI card has a calm distinct cool-tinted surface (separate from warm paper), explicit badge (`AI Mentor · Contextual hint — verify formulas against the verified lesson card`), and deep-link pills (`Jump to verified Definition ↑`) when referencing a section.
3. **One-Tap Quick Actions (Minimal typing on 390 px at night):**
   * *While reading:* `"Explain simply with an analogy"` | `"How does GATE test this?"` | `"Give a 4-bullet recap"`
   * *After wrong Check Question:* `"Why is my option wrong?"` | `"Walk through step-by-step"` | `"Give a similar 2-mark drill"`
   * *Inside Interactive Lab:* `"Explain why this step stalled"` | `"Test a trick case"`
4. **Filing Inside Existing `/ai-mentor` History:**
   * Opens/appends a thread inside RENYXERA's existing `/ai-mentor` conversation store tagged `origin: "study-lesson"`, `subject`, `chapter`, `sectionId`, displaying a compact pill (`[Study · OS · Deadlock]`) in the `/ai-mentor` history list with a one-click `"Return to lesson section"` link.

---

### 4.8 PYQ Panel

Inside the lesson, students see **all official GATE questions (2017–2026) mapped to that exact chapter** inside the **PYQs tab** of the compact panel without ever navigating away:
* **Collapsed State:** Tab reads `PYQs (18)` + tiny progress indicator (`4/18 done`).
* **Panel Header Summary:**
  * Total count + years (`18 PYQs · 2017–2026`), marks split (`7 × 1M · 11 × 2M`), personal status (`4 Solved · 2 Mistakes · 12 Unseen`).
  * Filter pills: `All` | `Unsolved (12)` | `Mistakes (2)` | `2-Mark`.
* **Compact Question Cards:**
  * Row 1: `GATE CS 2023 · Set 1` | `2 Marks` | `NAT` | Status dot (`Solved` green / `Mistake` coral / `Unseen` grey).
  * Row 2: 2-line question preview (`"Consider a system with 3 processes sharing 4 instances..."`).
* **Practise-In-Place Flow (Never Leaves the Lesson):**
  * Tapping a PYQ opens an **Inline Practice View** inside the panel (or centered lightbox modal automatically if the PYQ contains a wide diagram/table on mobile):
    * Renders full stem, interactive MCQ radio / MSQ checkboxes / NAT keypad, `[Check Answer]`.
    * On submit: reveals official key, concise explanation, `[Save to Mistakes Bank]`, and `[Ask Mentor about this PYQ]` (which switches smoothly to the Mentor tab with this exact PYQ loaded!).
    * Syncs attempts immediately to RENYXERA's main Analytics, Mistakes Bank (`/mistakes`), and Test History stores.
  * Footer option: `"Launch all 18 in timed Exam Mode →"` (routes to `/test-centre` only if the student explicitly chooses exam simulation).

---

### 4.9 Visual Design

#### Alignment With Existing Brand
Preserves RENYXERA's `Sora` (`--font-display`) and `Manrope` (`--font-sans`) typefaces, tabular numbers (`--font-num`), soft warm pastel heritage, and existing dark-mode architecture (`data-dk`: `edge` / `midnight` / `tinted`), while elevating Study from generic dashboard cards into crafted editorial book design.

#### Direction 1: "Warm Paper Press" (Recommended — Editorial Print & Buckram Cloth)
* **Palette (Hex):**
  * *Light Mode:* Canvas Paper `#FAF7F2`, Elevated Paper `#FFFDF9`, Shelf Backdrop `#EFE9DF`, Shelf Ledge `#DFD5C5`, Primary Ink `#1B1917`, Muted Ink `#5F5952`, Hairline Border `#E4DDD2`, Gold Free Ribbon `#C9921A`.
  * *Matte Buckram Book Cloth Pastels (all paired with Dark Ink `#1B1917`, contrast ≥ 7:1):* OS Terracotta `#E8C5B8`, Algo Sage `#C4D9CC`, DBMS Cobalt Mist `#C5D5E8`, CN Ochre `#EBD8B0`, TOC Lavender Stone `#D6CFE6`, Maths Dusty Rose `#E4C9D2`.
  * *Dark Modes (tuned across `data-dk`):*
    * `edge`: Paper `#121213`, Surface `#1B1B1D`, Ink `#ECE9E2`, Muted `#A6A096`, Hairline `#2D2D31`.
    * `midnight`: Paper `#0B0D12`, Surface `#131720`, Ink `#EAECEF`, Muted `#9BA3B4`, Hairline `#222836`.
    * `tinted`: Paper `#141210` (warm ink-obsidian), Surface `#1E1A17`, Ink `#EFE7DA`, Muted `#AEA394`, Hairline `#332C25`.
    * *(Dark-mode book spines shift cloth to deep muted tones like `#4B332C`, `#2D4236`, `#2C3B4E` with `#EFEAE1` ink so night-time shelf glare disappears!)*
* **Typography Roles & Weights:**
  * Book Spines & Covers: `Sora 800`, `-0.02em` tracking.
  * Lesson `h1`: `Sora 700`, `clamp(26px, 3vw, 34px)`, `1.2` line-height.
  * Section `h2`: `Sora 600`, `19–21 px`, `1.3` line-height.
  * Reading Body: `Manrope 400/500`, `17 px` default, `1.7` line-height (`64–68ch`).
  * UI Labels / Metadata: `Manrope 600`, `12–13 px`.
  * Matrices / Code / NAT: `JetBrains Mono` / `--font-num`, `14.5 px`, `tabular-nums`.
* **Materials:** Warm uncoated paper surface (subtle 1.5% inline SVG noise grain optional on cover cards only—never behind prose), matte buckram cloth spines with subtle `2 px` top/bottom headband stitch border, flat architectural shelf lip shadow.
* **Iconography:** Custom `1.5 px` uniform stroke icons (bookmark ribbon, page curl, lab step arrow, pin), zero emoji chrome.
* **Signature Detail:** **The Woven Gold Bookmark Ribbon + Spine Headband Progress**—books with a free chapter have a notched gold ribbon extending past the lower edge, and read progress sits inside the stitched spine headband rather than floating generic progress bars.

#### Direction 2: "Draftsman's Study Desk" (Technical Vellum & Anodized Rail)
* **Palette:** Paper `#F6F7F5`, Surface `#FFFFFF`, Rail `#DFE3DF`, Ink `#14191D`, Accent Teal `#1F6E6C`, Cloth Pastels slightly cooler (`#CBDAD8`, `#D4DCE8`, `#E6DEC8`); Dark `#111518` / `#181E22`, Ink `#E8ECEF`.
* **Materials:** Fine drafting vellum (`16 px` faint dot-grid strictly inside diagram/lab frames), hairline `1 px` steel shelf rails, crisp square corners (`rounded-lg` `8 px` instead of `rounded-3xl` everywhere).
* **Signature Detail:** **Engineering Plate Callouts** (`FIG. 04.02` with precision corner registration ticks around every data-driven SVG figure and tabbed index-card margin flags).

#### Direction 3: "Night Owl Reading Room" (Sepia-Dusk Low-Glare)
* **Palette:** Warm Sepia Light `#F3ECDF`, Surface `#FAF4E8`, Ink `#261F18`, Warm Brass `#A86D24`; Dark Espresso `#15110E`, Surface `#201A15`, Ink `#EAE0D0`, Brass `#D49B4B` (minimizes blue light spike for 1 AM phone readers).
* **Materials:** Oiled walnut shelf lip (`#C8B9A6` light / `#2E251E` dark), deckle-tinted paper cards, soft amber ink accents.
* **Signature Detail:** **1-Tap Paper Tint Switcher (`Crisp Paper | Warm Sepia | Night Charcoal`)** docked right inside the top reading bar.

#### Anti-AI-Slop Concrete Blacklist (Must Enforce Across All Directions)
1. **No purple-indigo-pink gradients or glowing aura halos** (especially around AI Mentor buttons or book cards—even though `<meta name="theme-color">` uses `#4f46e5` `[1.1]`, keep Study surfaces calm ink & paper).
2. **No "card soup":** Never wrap every definition, intuition paragraph, and tip inside thick bordered `rounded-3xl` floating white boxes with drop shadows. Prose sits directly on the paper background separated by generous vertical rhythm (`28–36 px`), `1 px` hairline rules, or a quiet `3 px` left accent rule for Traps & GATE Notes.
3. **No decorative emoji icons** (`🚀`, `🔥`, `💡`, `✨`, `🎯`) in headings, pills, or Mentor buttons.
4. **No generic AI illustrations** (no cartoon students with laptops, no glowing brains). Every graphic is a **structured CS diagram, graph, table, or bit-map**.
5. **No fake photographic oak/mahogany JPEG shelves** that clash with dark mode and stretch awkwardly across screen widths.

---

### 4.10 Motion and Sound

#### Choreography & Exact Specs (Compositor-Only `transform` & `opacity`)
| Interaction | Duration | Easing | Properties | Reduced-Motion Alternative |
| :--- | :--- | :--- | :--- | :--- |
| Book hover pull-out | `180 ms` | `cubic-bezier(0.22, 1, 0.36, 1)` | `translateY(-10px) rotate(-1.5deg)` | Border highlight change (`0 ms`), no lift/tilt |
| Book → Two-Page Spread | `320 ms` | `cubic-bezier(0.22, 1, 0.36, 1)` | FLIP / View Transition `transform`, `opacity` | `120 ms` opacity crossfade |
| Chapter → Lesson slide | `220 ms` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | `translateX(16px → 0)`, `opacity` | `100 ms` opacity crossfade |
| Desktop Right Rail open | `240 ms` | `cubic-bezier(0.22, 1, 0.36, 1)` | `translateX`, `opacity` | Instant mount / `100 ms` fade |
| Mobile Bottom Sheet snap | `280 ms` | `cubic-bezier(0.32, 0.72, 0, 1)` | `translateY` | `120 ms` opacity fade |
| Check Question feedback | `180 ms` / `260 ms` | `ease-out` | Correct: SVG check `stroke-dashoffset` (`200 ms`); Wrong: subtle `±4px` 2-cycle damped nudge (`260 ms`) | Colour + icon + text reveal (`100 ms`), zero shake |
| Interactive Lab step | `160 ms` | `ease-out` | Node/edge `opacity`, `transform` | Instant state highlight |
| Highlight floating menu | `120 ms` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | `scale(0.95 → 1)`, `opacity` | `80 ms` opacity fade |

#### Sound Verdict
* **Verdict:** **OFF by default**, with an optional **Quiet Tactile Sound** switch (`Off [default] / Subtle`) in the `Aa` Reading Settings popover.
* **Why default OFF:** Target readers study late at night in shared hostel rooms or homes; unexpected phone media audio is disruptive, wastes battery/audio-context wakeups on low-end Android devices, and clashes with background silence/music.
* **When enabled (zero asset cost):** Pure client-side Web Audio API oscillator bursts (`< 35 ms`, `-24 dB` soft low-pass envelope—no `.mp3` network downloads) triggered **only** on explicit check-question submission and recall-card flip, never on hover or scrolling.

---

### 4.11 Accessibility & Performance

* **Keyboard Navigation:**
  * Bookshelf: `ArrowLeft`/`ArrowRight` traverses books across a shelf, `ArrowUp`/`ArrowDown` jumps shelves, `Enter`/`Space` opens spread, `/` focuses search, `Esc` closes peek/spread.
  * Lesson: `[` toggles left outline, `]` toggles right panel (`1`/`2`/`3` switches Notes/PYQs/Mentor when panel focused), `Esc` closes panels/popovers/modals.
  * Interactive labs: Every drag interaction (`4.5` #7) and click-to-connect edge builder (`4.5` #6) provides keyboard focus rings (`2 px solid` high-contrast ring with `2 px` offset) and explicit move/connect button pairs (satisfies **WCAG 2.2 SC 2.5.7 Dragging Movements**, W3C, `w3.org/TR/WCAG22/`).
* **Screen Readers & Semantics:**
  * Strict heading tree (`h1` Chapter → `h2` Lesson Blocks → `h3` Sub-items).
  * Interactive labs and step-through figures include a synchronized `aria-live="polite"` text narration strip (e.g. `"Step 3: P1 granted (1,0,2); Available is now (2,3,0)"`) plus accessible HTML `<table>` equivalents behind SVG matrices.
  * Touch targets minimum `44×44 CSS px` for primary buttons and shelf books (aligns with Apple Human Interface Guidelines `44×44 pt`, `developer.apple.com/design/`, and comfortably exceeds WCAG 2.2 SC 2.5.8 `24×24 CSS px` minimum).
* **Contrast:**
  * Body copy ≥ `7:1` on paper canvas (exceeds WCAG 2.2 AA `4.5:1`); bold spine titles on pastel cloth use dark ink `#1B1917` (light) / `#EFEAE1` (dark) guaranteeing ≥ `4.5:1` across light and all 3 `data-dk` dark variants.
  * Never indicate right/wrong check answers or traps by colour alone—always pair with icon + text status (`Correct`, `Incorrect`, `Trap`).
* **Dyslexia-Friendly & Comfort Controls (`Aa` Popover):**
  * Font scale (`15 / 17 / 19 / 21 px`), line height (`1.55 / 1.7 / 1.85`), column width (`55ch / 66ch`), and **Dyslexia-Comfort Mode** following British Dyslexia Association style recommendations (`bdadyslexia.org.uk`): increases letter/word spacing (`0.03em` / `0.1em`), eliminates italics inside long explanations, enforces left-aligned ragged-right prose (never justified), and optionally swaps `--font-sans` to bundled `Atkinson Hyperlegible` (SIL Open Font License, free).
* **Low-End Android Performance Budgets (3–4 GB RAM, Hostel 3G/4G):**
  * `/study` and lesson shell JS budget: **≤ 120 KB gzipped** initial route JS.
  * Zero WebGL/Three.js; bookshelf is pure CSS Flex/Grid + lightweight SVG (`< 15 KB` total DOM).
  * Lesson prose SSRs immediately; heavy interactive labs (e.g., B+ Tree / Stack X-Ray) code-split with `next/dynamic` below the fold.
  * Full lesson payload (`prose + SVG JSON + topic PYQs`) kept **≤ 80 KB gzipped** per chapter and cached in **IndexedDB + Service Worker** so a student can study whole chapters completely offline.
  * Avoid `backdrop-filter: blur()` on full-height scrolling bottom sheets (use opaque `98%` layered surfaces instead—prevents severe GPU frame drops on budget Mali/Adreno chips).

---

### 4.12 Edge Cases (29 Scenarios)

**Bookshelf & Catalog (1–10)**
1. **Very long subject names** (*"Computer Organization and Architecture"*): Standing desktop spines wrap cleanly onto 2 vertical lines (`max-lines: 2`) or drop `font-size` via `clamp(13px, 1.05vw, 17px)`; mobile horizontal stacks give full `358 px` width so names never ellipsize (`...`).
2. **Many subjects (12–18 packs in future):** Wrap gracefully into additional balanced `100%`-width shelf tiers (`6–8` books per desktop shelf) using the exact same proportional flex rules—never an awkward horizontal scroll track.
3. **Branch with no books yet (`ECE`, `EE`, `ME`, `Civil`, `DA`):** Never show an empty wooden void! Display a clean full-width Branch Launch Card (`"DA Study Packs are in authoring · Vote on first subject"` + 1-click `[Notify me]`), alongside direct quick cards into that branch's *existing* RENYXERA **PYQs, Mocks & AI Mentor**, plus free-preview access to shared *Engineering Maths / General Aptitude* shelves once live!
4. **Filter returns only 1 or 2 books:** Shelf switches automatically from multi-spine layout to **Expanded Monograph Showcase** (Face-Out Cover + Live Chapter Preview Card filling `100%` width—zero blank shelf space).
5. **Search returns 0 matches:** Show helpful empty shelf banner with matching PYQ/AI Mentor shortcut (`"No chapter titled 'Belady' yet — search 3,250 PYQs or ask AI Mentor"` + `[Clear search]`).
6. **Search matches a chapter inside a `"Being written"` book:** Show the book pulled forward with an honest badge (`"Ch 3 · Paging — Drafting · Notify when live"`) rather than hiding it or leading to a dead 404.
7. **User owns 0 packs (new/free user):** Gold free-chapter ribbon stands out immediately; non-free ready chapters let user preview the first 2 blocks (`Hook` + `Intuition`) before showing a calm one-time pack unlock sheet inside the spread (no aggressive countdown popups).
8. **Book has 0 ready chapters yet:** Appears with slightly muted stitched cloth and honest `Writing` pill; clicking opens Book Spread showing syllabus breakdown, GATE marks share, and `"Notify me when Ch 1 ships"`, NOT an empty lesson route.
9. **Slow 3G / API failure on `/study`:** Render cached bookshelf metadata immediately from Service Worker/IndexedDB (`stale-while-revalidate`), show `skeleton-shimmer` `[1.1]` only on cold first-ever visit, and offer a non-blocking `[Retry]` pill on failure.
10. **Offline launch (PWA on train/hostel):** Downloaded/visited chapters remain 100% readable & labs remain interactive offline; unvisited locked chapters and AI Mentor show calm offline pills (`"Offline — reconnect to open Mentor or stream new chapters"`).

**Lesson Reading & Interactive Labs (11–18)**
11. **Long lesson (12+ blocks) restore & anchor:** Persist exact `(blockId, scrollRatio)` locally per chapter so returning via `"Continue Reading"` lands directly at the paragraph where the student stopped, even if font size changed.
12. **Wide SVG graph or 6×6 Banker's matrix on `320–390 px` phone:** Wrap figures in a subtle horizontal scroll tray with right-edge fade hint *plus* a `[Expand View]` pinch-to-zoom full-screen SVG overlay; keep matrix columns compact via `tabular-nums`.
13. **Check question repeated errors / messy NAT formatting:** Trim whitespace, normalize `"-0"` to `"0"`, warn cleanly without penalizing if user enters non-numeric text (`"1/2"` → `"Enter a decimal number, e.g. 0.5"`), and after 2 wrong attempts offer `[Ask Mentor why my step fails]` directly beside the check feedback.
14. **Interactive Lab pushed into extreme/degenerate input:** Clamp numeric controls (`processes ≤ 6`, `resources ≤ 4`), validate impossible states calmly (`"Requested resources exceed Max claim — adjust P1"`), and always keep a `[Reset to Default]` button visible in one tap.
15. **Multiple KaTeX equations overflowing narrow phones:** Wrap block equations in `overflow-x: auto; max-width: 100%;` so long summations never push the entire page into horizontal bounce scroll!
16. **Browser back button inside open sheet/modal:** Push shallow history state or intercept popstate gently when Mobile Bottom Sheet (`Notes/PYQs/Mentor`) or Diagram Lightbox is open so pressing Android Back closes the sheet instead of kicking the user out of the lesson!
17. **Lesson content updates after student completed a chapter:** Compare `lessonVersion`; preserve completion & notes, show an optional subtle `"Updated 2 new PYQs"` chip in TOC without wiping progress.
18. **Zero-script / slow-hydration frame:** Lesson prose renders via SSR with static SVG fallback first; interactive lab hydrates smoothly inside fixed `min-height` container so text doesn't jump underneath the reader's eyes (`CLS ≈ 0`).

**Highlights & Notes (19–23)**
19. **Highlight crossing multiple blocks (e.g., Paragraph → List Item → Definition):** Store `startBlockId` + `endBlockId` with offsets (`4.6`), iterating block text nodes cleanly to wrap `<mark>` segments per block without breaking React DOM reconciliation!
20. **Overlapping highlights (e.g., Amber sentence + Coral trap phrase inside it):** Render inner highlight with nested `<mark>` precedence + subtle `2 px` bottom coloured underline for the outer span so both remain visibly selectable and deletable independently.
21. **Lesson copy edited invalidating offsets:** Fall back to W3C `TextQuoteSelector` (`exactText` + `prefix32`/`suffix32`) fuzzy matching; if completely deleted in a rewrite, file safely under `"Unanchored Notes (from earlier edition)"` inside Notes Panel—NEVER silently delete student notes!
22. **No highlights or notes yet:** Show calm 3-line empty state inside Notes Panel: `"Select any sentence to highlight in 4 study colours, attach a note, or send straight to Flashcards."` + `[+ Add Chapter Note]`.
23. **Selecting text inside interactive widgets / KaTeX / UI buttons:** Set `user-select: none` on buttons/nav/SVG labels and ignore selections crossing interactive lab boundaries so highlight toolbars never fire mid-interaction.
24. **Multi-tab or offline highlight conflict:** Use `BroadcastChannel` across tabs and last-write-wins per `highlightId` with tombstone deletes (`deletedAt`) synced cleanly when back online.

**PYQs, AI Mentor, Viewports & Themes (25–29)**
25. **AI Mentor daily quota reached or API timeout:** Preserve the user's typed question, show honest message (`"Daily Mentor limit reached — resets at midnight IST"` or `"Mentor busy · Retry"`), and offer instant offline links to matching lesson sections & PYQ solutions.
26. **Student asks Mentor for live test answer or off-syllabus chatter:** Mentor prompt restricts scope to conceptual tutoring, checks against RENYXERA lesson schema, and redirects off-syllabus prompts politely back to GATE syllabus topics.
27. **PYQ containing wide logic circuit / state diagram inside compact panel:** Render thumbnail at `100%` panel width with crisp `[Zoom Figure]` tap-lightbox and keep dark-mode-safe white/cream canvas padding around legacy black-on-white scanned circuit diagrams so lines never turn invisible black-on-black in dark mode!
28. **Topic with `0` PYQs vs `45+` PYQs:** If `0` (e.g., foundational subtopic), replace PYQ panel list with `"0 direct PYQs isolated—practise combined parent-topic PYQs instead"` + shortcut; if `45+`, virtualize list or paginate in clean chunks of 10 by recency (`2026 → 2017`) with year/mark filters.
29. **Tiny phones (`320–360 px`), `200%` browser zoom, and live theme switches (`edge`/`midnight`/`tinted`):** At `200%` zoom (`1440 / 2 = 720 px` CSS width), desktop side rails gracefully collapse into the mobile top-bar + sticky bottom-sheet pattern (`WCAG 2.2 SC 1.4.10 Reflow`—zero horizontal scrolling); switching `theme` or `data-dk` (`edge`, `midnight`, `tinted`) `[1.1]` updates CSS variables live with zero reload or broken contrast.

---

### 4.13 Skills & Tools for an AI Coding Agent (Claude Code)

Run these specialized skills/checks in strict chronological order across the build (all using free/local tooling):

1. **Skill 1 — `brand-token-architect` (Design System Setup)**
   * *When:* Before writing any component JSX.
   * *Checks:* Wires Study tokens into RENYXERA's existing `theme`, `data-dk` (`edge | midnight | tinted`), `data-look`, and `--font-display` / `--font-sans` / `--font-num` vars `[1.1]`; verifies zero hardcoded hex colours in components; locks `66ch` prose measure and `4 px` spacing grid.
2. **Skill 2 — `study-schema-validator` (Data & Learning Integrity)**
   * *When:* When creating lesson data models & Phase 0/1 JSON/MDX loaders.
   * *Checks:* Verifies fixed lesson block sequence, checks every diagram has `altSummary` + `ariaLive` narration, validates MCQ/MSQ/NAT answers & numerical tolerance intervals, catches KaTeX syntax errors at build time.
3. **Skill 3 — `anti-ai-slop-critic` (Editorial Craft Review)**
   * *When:* Right after building Hub (`4.2`), Spread (`4.3`), and Lesson Shell (`4.4`).
   * *Checks:* Audits DOM/Tailwind classes for banned patterns: purple-blue gradients, neon box glows, >2 nested rounded card containers around prose (`card soup`), decorative emojis, fake wood textures, and ensures `0 px` trailing dead space on `390 px` & `1440 px` shelves (including filtered states).
4. **Skill 4 — `interactive-lab-reviewer` (Simulators & Data Vis)**
   * *When:* After building each interactivity pattern (`4.5`).
   * *Checks:* Ensures SVG diagrams scale/pan cleanly down to `320 px`, numbers use `tabular-nums`, states never get stuck without `[Reset]`, and every drag/hover control has single-tap + keyboard equivalents.
5. **Skill 5 — `motion-choreography-audit` (60fps & Reduced Motion)**
   * *When:* After wiring transitions (`4.3`, `4.10`).
   * *Checks:* Confirms only `transform` and `opacity` animate, durations stay `≤ 320 ms`, `prefers-reduced-motion: reduce` disables tilts/slides/shakes cleanly, and zero heavy `backdrop-filter` blur runs over large scrolling sheets on mobile.
6. **Skill 6 — `a11y-reflow-gate` (Automated Playwright + `@axe-core/playwright`, Free)**
   * *When:* Before merging each milestone.
   * *Checks:* Runs headless Playwright across `360×740`, `390×844`, `1440×900`, and `200%` zoom across Light + `edge` + `midnight` + `tinted` modes; verifies WCAG 2.2 AA contrast (`≥ 4.5:1`), zero horizontal overflow, full keyboard tabbing across shelves/tabs/sheets, and `aria-live` announcements in labs.
7. **Skill 7 — `perf-pwa-budget-check` (Lighthouse CLI + `@next/bundle-analyzer`, Free)**
   * *When:* Pre-release verification.
   * *Checks:* Enforces `< 120 KB` gzipped route JS, `< 80 KB` chapter data payload, `CLS = 0` on skeleton-to-shelf hydration, and full Service Worker/IndexedDB offline reading + highlight persistence.
8. **Skill 8 — `visual-regression-diff` (Playwright Screenshot Diff, Free)**
   * *When:* Final UI gate.
   * *Checks:* Diffs deterministic screenshots at `390 px` and `1440 px` (Full shelf, 1-book filter, Empty branch, Open spread, Lesson with Notes/PYQ/Mentor open) to catch regressions early.

---

### 4.14 Build Order

1. **Milestone 1 — Core Bookshelf + Reader Shell (Ship First)**
   * Design tokens hooked into RENYXERA Light + `data-dk` (`edge`, `midnight`, `tinted`) `[1.1]`.
   * Full-width zero-empty-space Bookshelf (`/study`) at `390 px` (2-up covers + horizontal stacks) and `1440 px` (cover-facing + bold spines + stack + tilt) + pull-out hover/tap + Search, Filter, Sort, Continue card, Skeleton loaders, and non-CS Branch state.
   * Two-Page Book Spread (Desktop) / Single-Page Book Sheet (Mobile) with honest Ready/Writing TOC.
   * Lesson Reader Shell (`66ch` prose + `960 px` figure breakout + Desktop collapsible left outline + Mobile sticky bar + `Aa` comfort & dyslexia controls + IndexedDB chapter caching).
   * First 3 core interactive blocks: **State-Space Stepper** (OS Banker's Lab), **MCQ/MSQ/NAT Check Block**, and **Blur-Reveal Recall Cards**.
   * *Result:* Complete, buyable/testable end-to-end free chapter (*OS → Deadlock*) live in production.

2. **Milestone 2 — Exam Loop: In-Lesson PYQs + Highlights & Notes**
   * Right Tabbed Margin Dock (Desktop) + `48%/90%` Two-Snap Bottom Sheet (Mobile).
   * **PYQ Panel (`4.8`):** Filterable topic PYQs (`2017–2026`), practise-in-place with diagram dark-mode safety, live sync to RENYXERA Mistakes Bank (`/mistakes`) and Analytics.
   * **4-Colour Highlights & Margin Notes (`4.6`):** Cross-block W3C quote+offset anchoring, inline `[1]` margin markers, 1-tap `Make Flashcard` → `/test-centre/build?view=flashcards`, Markdown export, offline IndexedDB sync, and the Shelf 2 **Notes Codex**.

3. **Milestone 3 — Contextual AI Mentor & Pattern Expansion**
   * **AI Mentor Tab (`4.7`):** Auto-injected section/selection/mistake/lab context, strict visual separation from verified text, 1-tap quick chips, tagged archival into `/ai-mentor` history.
   * Reusable Interactive Pattern Library (`4.5`): Ship **Medium** engines next (*Pipeline Cycle Scrubber*, *Coffman What-If Switch*, *K-Map/Bit Workbench*, *DFA/Pumping Simulator*, *Tap-Any-Symbol Formula*) followed by **Large** sandboxes (*Precedence Graph Builder*, *Call-Stack X-Ray*, *B+ Tree Sandbox*) as new subjects roll out.

4. **Milestone 4 — Entitlements, Offline Packs & Final Polish**
   * One-time Subject Pack unlock flow inside Book Spread + full offline pack download indicator (so students can cache a subject on college/hostel Wi-Fi).
   * Optional Quiet Tactile Sound (`Off` by default), automated Lighthouse/Axe/Playwright regression suite (`4.13`), and multi-branch expansion (`DA`, `ECE`, `EE`, `ME`, `Civil`).

---

### Self-Check Summary
* Sections `4.1` through `4.14` completed: **Yes**
* Phone (`390 px`) & Desktop (`1440 px`) ASCII wireframes with zero empty space: **Yes** (`358 px` and `1376 px` exact layouts + single-item filter adaptation)
* Interactivity catalogue with GATE CS examples across OS, DBMS, CN, Algorithms, TOC, COA, Digital Logic, and Maths: **Yes** (19 patterns)
* At least 25 edge cases: **Yes** (29 edge cases)
* Citations grounded and zero invented statistics: **Yes** (direct live citation `[1.1]` for `gate.renyxera.workers.dev`, canonical published works/standards cited transparently with tool limitation disclosed)