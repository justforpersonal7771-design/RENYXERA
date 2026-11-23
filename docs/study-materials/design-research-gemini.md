> **Research & Tooling Scope Note:** In this environment, only `https://gate.renyxera.workers.dev/` could be directly fetched and inspected (``); live web search and external URL browsing were unavailable. Therefore:
> - All facts about RENYXERA's current UI, tokens, navigation, and stack are directly observed from ``.
> - All external UX, learning-science, accessibility, and competitor patterns cite established published standards, peer-reviewed literature, and well-known product architectures—without inventing statistics or unverified URLs. Current 2026 UI details of third-party apps should be spot-checked before copying micro-interactions.

---

### What We Observed on RENYXERA (``)
Before designing `/study`, key architectural facts observed directly on the live app:
- **Stack & Shell:** Next.js (App Router + Turbopack), hosted on Cloudflare Workers, preconnecting to `cdn.jsdelivr.net`, with `SkeletonShimmer` loading states and a `LookApplier` (`data-look`, CSS variables `--font-display`, `--font-sans`, `--font-num`) plus `data-dk` supporting three dark styles (`edge`, `midnight`, `tinted`) ``.
- **Navigation:** Desktop top bar contains `Dashboard` (`/`), `Test Centre` (`/test-centre` + dropdown including `Flashcards` at `/test-centre/build?view=flashcards`), `Study` (`/study`), `AI Mentor` (`/ai-mentor`), `Battles` (`/battles`), `Review` (`/mistakes`), `Analytics` (`/analytics`), and a Mentor quick-chat button (`/ai-mentor/chat?new=1&from=bar`). Phone bottom dock currently has 5 slots (`Home`, `Test Centre`, `Review`, `AI Mentor`, `More`) ``.
- **Supported Streams:** CS, ECE, EE, ME, Civil, DA ``.

---

## 4.1 Concept: Three Directions for the Study Module

### Concept A: "The Study Library" (Bookshelf Hub → Open Two-Page Folio → Desk Margin Tools)
- **Metaphor:** A sunlit university study alcove. Subjects sit as tangible cloth-and-board volumes on timber shelves; opening one spreads its chapter folio across your desk; inside a lesson, your notes, past-year question index, and tutor sit neatly clipped to the right margin like a compact desk planner.
- **Why it suits GATE students:** Indian engineering students preparing alone at night already face cognitive fatigue from chaotic PDFs and 3-hour video playlists. A bounded "book per subject" metaphor creates psychological closure ("Operating Systems is one finite, conquerable book of 9 chapters"), reduces overwhelm, and aligns directly with RENYXERA's existing Phase 0 `/study` bookshelf and two-page spread.
- **Navigation:** `/study` (Library Shelves) → Tap book → Two-page Contents Spread (modal/route `/study/[subject]`) → Tap chapter → Lesson Folio (`/study/[subject]/[chapter]`) with persistent collapsible right-rail / bottom-sheet desk drawer (`Notes` · `PYQs` · `Mentor`).
- **Risks:** Skeuomorphism can drift into tacky clipart wood or illegible sideways spines on narrow screens if handled literally; two-page spreads break down on 390 px phones unless adapted cleanly to a single-page folio.

### Concept B: "The Engineering Workbench" (Reference Manual + Breadboard Labs + Side Ledger)
- **Metaphor:** A systems lab desk with a spiral-bound reference manual in the centre, live interactive circuits/state machines on a breadboard, and a compact ring-bound ledger on the side for notes, PYQ drills, and mentor queries.
- **Why it suits GATE students:** Positions GATE CS as *applied engineering* rather than rote reading—especially strong for COA, Digital Logic, OS, and CN where 2-mark questions test edge-case state transitions.
- **Navigation:** Hub uses flat modular "Manual Cards & Spec Packs" stacked in rack drawers → Lesson opens a split-pane workbench (prose left, live simulator/figure right) with slide-over tool drawers.
- **Risks:** Feels cold and utilitarian on late-night mobile reading; drops the warmth of RENYXERA's existing pastel card language (``) and breaks away from the Phase 0 bookshelf the owner already wants.

### Concept C: "The Annotated Field Notebook" (Loose-Leaf Syllabus Binder + Margin Slipcase)
- **Metaphor:** A curated topper's bound notebook (like Feynman's notebooks or *The Pragmatic Programmer* margins): crisp ruled/dot-grid off-white sheets, tabbed dividers per subject, taped-in interactive diagrams, and Post-it-style pastel callout slips.
- **Why it suits GATE students:** Mirrors how Indian GATE aspirants actually study (handwritten short notes, margin traps, highlighted formulas). Extremely friendly for ESL readers because hierarchy feels informal, scannable, and human.
- **Navigation:** Hub shows stacked tabbed subject binders in a slipcase → Tapping pulls a binder tab → Flat scrollable chapter index → Lesson renders as a continuous sheet with inline fold-out sticky notes and a compact bottom/side pocket for PYQs & Mentor.
- **Risks:** Lacks the gravitas and physical durability of a "book" for a **paid one-time pack** product—students paying per subject expect a *definitive textbook*, not loose notes.

### Recommendation: **Concept A ("The Study Library") enhanced with Concept C's Margin Utility**
Use **Concept A** as the structural shell (timber shelves, cloth-bound books, two-page contents spread) so it honours Phase 0 and makes each paid subject feel substantial and worth owning. Inside the lesson screen itself, borrow **Concept C's** tactile paper warmth, 4-colour ink highlights, and compact margin-tab drawer (`Notes` | `PYQs` | `Mentor`).

---

## 4.2 Bookshelf / Library Hub

### Research on Real Shelf & Library Interfaces
*(Based on established documented patterns of each product; live 2026 builds were not crawled.)*
1. **Apple Books (Apple Inc.):** Switched over iterations from heavy skeuomorphic oak shelves to clean floating cover grids with soft elevation shadows, clear progress badges, and inline reading-goal ribbons—proving that *lighting and cast shadow*, not noisy wood grain, sell physicality.
2. **Amazon Kindle & Google Play Books:** Prioritise flat face-out covers with strict aspect ratios (`2:3`), thin bottom progress bars, and fast filter pills (`Downloaded`, `Unread`) because spine-only views fail readability when book titles vary in length.
3. **Libby (OverDrive):** Uses high-contrast horizontal shelf rails with bold typographic "library cards" and immediate availability/status tags ("Available" vs "Waitlist")—a direct parallel to our honest `Ready` vs `Being written` chapter indicators.
4. **Literal.club & Readwise Reader:** Show how modern reading tools display rich metadata (reading progress, highlight count, tags) via clean hover states and side-drawer peeks without cluttering the shelf item itself.
5. **Physical Bookshops & Archival Series (e.g., Penguin Hardbacks, O'Reilly, Taschen):** Bookshops solve the "narrow spine legibility + empty shelf" problem using **two merchandising tricks**: (a) **face-out hero books** angled/displayed frontward for key titles, and (b) **wide cloth spine labels** with horizontal title bands rather than tiny vertical text, anchored by heavy bookends or topic plaques so shelves look intentionally curated rather than sparse.

### Hub Specification (Zero Empty Space, Legible Spines, Honest Status)

#### 1. Solving Legibility on Spines & Eliminating Empty Space
- **No skinny 30 px vertical slivers.** Vertical 90°-rotated text on narrow spines is hostile to ESL readers and violates comfortable touch sizing (WCAG 2.2 SC 2.5.8 recommends >= 24×24 CSS px minimum; mobile usability requires >= 44–48 px).
- **Two Book Geometries on Desktop (1440 px):**
  1. **Face-Out Featured / Active Books (`190 px` wide × `264 px` tall):** Used for 1–2 books per shelf (e.g., subjects with a Free Chapter or currently being read). Full cover visible with **Sora 800** title, gold woven ribbon on top-right (`FREE CH.`), subtle watermark emblem, marks share badge, and bookmark ribbon showing `%` read.
  2. **Broad Archival Spine Books (`92 px–112 px` wide × `264 px` tall):** Wide enough to hold a crisp **horizontal paper/foil spine label** (`76–96 px` inner measure) set in **Sora 700, 13 px, line-height 1.12**, allowing full multi-word subject names (`Operating Systems`, `Computer Networks`, `Database Management Systems`, `Discrete Mathematics`) to read **horizontally left-to-right** without tilting your head! Subtle vertical debossed subject code (`CS-04`) sits below it.
- **How Shelves Guarantee 0 Empty Space at 1440 px:**
  - Each shelf bay has an inner width of `1320 px` (`max-w-[1368px]` with `24 px` side uprights).
  - Books sit inside a `flex` shelf row (`gap: 10px`).
  - **Shelf-End Curation Plaque / Pack Slipcase (`flex: 1 1 180px`):** Whatever horizontal remainder exists on the right of a shelf is intentionally filled by a flush-aligned **Shelf Index Plaque / Bundle Slipcase** (e.g., on Shelf 1: *"Core CS Systems · 42–48 Marks in GATE · Complete Core Bundle"* or on Shelf 2: *"Theory & Maths · 30–35 Marks"*), flanked by a minimal brass bookend (`16 px`). Result: every shelf spans **100% upright-to-upright** with zero dead air, regardless of branch or filter!
- **Phone (390 px) Shelf Geometry:**
  - `12 px` outer padding (`366 px` inner shelf width).
  - Every shelf holds **3 wide 3/4-angled Spine+Cover Books** (`~115 px` each, `gap: 10px`) OR **2 Face-Out Books** (`178 px` each). Full subject names sit horizontally in **Sora 700, 12.5 px**, with a clean `12 px` wooden shelf ledge underneath each row. If a filtered row has 1 book, it expands into a **Horizontal Book-on-Stand Card** (`366 px` wide: cover left + chapter summary right) so no half-empty shelf ever appears.

#### 2. Hover & Tap Behaviour (Pull-Out + Inspection)
- **Desktop Hover (`pointer: fine`):**
  - Hovered book pulls forward/up: `transform: translateY(-12px) rotateY(-8deg) scale(1.02)` (`220ms`), exposing a `6 px` cream page-edge slice on its right edge and deepening its cast shadow onto the wooden ledge.
  - Simultaneously, an **anchored Shelf Popover Card** (`280 px` wide, `8 px` offset above or beside the book, edge-flipped so it never clips off-screen) appears after a `90ms` hover intent delay showing:
    - Full Subject Title + GATE Marks Share (`~9–11 Marks`)
    - Honest Chapter Count (`1 Ready · 2 In Review · 6 Writing`)
    - User Progress (`Ch. 1 · 62%` or `Not started`)
    - Mini chapter status dots (`●` green = Ready, `◐` amber = Writing, `○` hollow = Planned)
    - Primary cue: `"Click to open book →"`
- **Tap (Phone 390 px & Touch):**
  - Tap 1 pulls the book forward (`translateY(-8px)`) and opens an **inline expanding Shelf Drawer directly beneath that shelf row** (accordion-style, pushing lower shelves down smoothly—no floating tooltip clipping!) showing the same honest breakdown: chapters list, ready/writing badges, marks share, free chapter tag, and a full-width **"Open Book"** / **"Resume Ch. 1: Deadlock"** button. Tapping an already-pulled book (or clicking "Open Book") launches the Book Opening transition (4.3).

#### 3. Honest Progress & "Ready vs Being Written"
Never hide unfinished content behind vague "Coming Soon" locks:
- **On the book spine/cover:** A tiny stamped folio badge at the base: `1/9 Ready` (or `9/9 Ready`), plus a warm bookmark ribbon (`18 px` wide) protruding slightly below the book bottom when `progress > 0%`.
- **Gold Ribbon:** Strictly reserved for books containing a **Free Sample Chapter** (`FREE CH.`), rendered as a stitched diagonal corner ribbon or woven bookmark tail (`#C9962B`).
- **Two-tier progress clarity:** Show *Content Availability* (`1 of 9 chapters ready`) separately from *Your Study Progress* (`62% of ready lessons`) so a student never confuses "I finished 100% of the subject" with "I finished the 1 chapter currently published."

#### 4. Controls: Reading Stand, Branch Switcher, Filters, Search
- **Top "Reading Desk" Band (integrated above Shelf 1):**
  - **Continue Reading Stand:** Shows last opened lesson (`Operating Systems → Ch. 1: Deadlock · Step 4/7: Banker's Lab`), quick stats (`14 min left · 11 topic PYQs`), and `Resume` button. (If user hasn't started yet, this slot smoothly transforms into **"Start Here: Free Chapter — Deadlock in OS"** so it is never blank.)
  - **Search Bar:** Instant search across **Subject names, Chapter titles, and GATE topics** (e.g., typing `thrashing` or `Dijkstra` filters shelves and highlights matching books with a subtle badge: `"Matches Ch. 4: Virtual Memory"`).
  - **Branch & Filter Strip:** Stream selector (`CS`, `DA`, `ECE`, `EE`, `ME`, `Civil`—synced with user's active profile paper ``), Availability pills (`All`, `Has Ready Chapters`, `Free Sample`, `Owned`), and Sort (`GATE Weightage`, `Recommended Order`, `My Progress`, `A–Z`).

#### 5. States: Empty, Loading, Error
- **Loading:** Shelf-shaped timber rails already visible immediately; book slots render warm paper-toned `skeleton-shimmer` blocks (``) matching exact spine/face-out widths (zero layout shift).
- **Empty (Search/Filter 0 matches):** Shelf stays visible with a single centred "Missing Volume Request" card resting on the ledge (`"No books match 'B+ Trees' under Owned"` + 1-tap `Reset filters` and `Search PYQ Bank instead →`).
- **Empty (Branch with 0 books yet, e.g. Civil/ME early launch):** See Edge Case #3 in 4.12.
- **Error (Network fail & no offline cache):** Warm archival notice resting on Shelf 1 (`"Couldn't reach the library shelf"` + `Retry` button + offline indicator showing any previously cached chapters still readable right now).

#### 6. ASCII Wireframes (Zero Empty Space)

**Desktop — `1440 px` Viewport:**
```text
+--------------------------------------------------------------------------------------------+
| [RENYXERA]   Dashboard   Test Centre   [Study*]   AI Mentor   Battles   Review   Analytics |
+--------------------------------------------------------------------------------------------+
|  THE STUDY LIBRARY · GATE CS (2027)                         [ Branch: CS v ]  [Owned | All]|
| +----------------------------------------------------+ +---------------------------------+ |
| | READING STAND · PICK UP WHERE YOU LEFT OFF         | | [Q Search subjects, topics...]  | |
| | [OS] Ch. 1: Deadlock · Step 4: Banker's Lab (62%)  | | Filter: [All] [Ready] [Free Ch] | |
| | 11 PYQs · 2 notes saved          [ Resume Lesson >]| | Sort:   [GATE Weightage v]      | |
| +----------------------------------------------------+ +---------------------------------+ |
|                                                                                            |
|  SHELF 1 · CORE SYSTEMS & ARCHITECTURE                                                     |
| |+----------------++--------++--------++--------++--------++----------------------------+| |
| ||[GOLD: FREE CH] ||  DBMS  ||  COMP  ||  COMP  ||  DIGI  || CORE SYSTEMS PACK          || |
| ||                ||  ====  ||  NET-  ||  ORG & ||  LOG-  || 42–48 Marks in GATE CS     || |
| ||   OPERATING    ||  Data- ||  WORKS ||  ARCH  ||  IC    || 1/5 books currently ready  || |
| ||    SYSTEMS     ||  base  ||        ||        ||        || [View Bundle & Syllabus ->] || |
| ||                ||  Mgmt  ||        ||        ||        ||                            || |
| ||  9-11M | 1/9R  ||  8-10M ||  8-10M ||  7-9M  ||  5-7M  || [Brass Bookend]            || |
| |+----------------++--------++--------++--------++--------++----------------------------+| |
| |========================================TIMBER LEDGE====================================| |
|        \_/ (Warm Bookmark: 62%)                                                            |
|                                                                                            |
|  SHELF 2 · ALGORITHMS, THEORY & MATHEMATICS                                                |
| |+----------------++--------++--------++--------++--------++----------------------------+| |
| ||[FACE-OUT]      ||  DATA  || THEORY || COMP-  || DISCR- || THEORY & MATHS PACK        || |
| ||                ||  STRUC-|| OF     || ILER   || ETE    || 32–38 Marks in GATE CS     || |
| ||  ALGORITHMS    ||  TURES || COMP.  || DESIGN || MATHS  || Honesty pledge: chapters   || |
| ||                ||        ||        ||        ||        || unlock only when lab-tested|| |
| ||  9-12M | 0/8R  ||  7-9M  ||  7-9M  ||  4-6M  ||  8-10M || [Notify me on release ->]  || |
| |+----------------++--------++--------++--------++--------++----------------------------+| |
| |========================================TIMBER LEDGE====================================| |
+--------------------------------------------------------------------------------------------+
```

**Phone — `390 px` Viewport:**
```text
+--------------------------------------+
| RENYXERA · Study      [CS v] [Search]|
+--------------------------------------+
| +----------------------------------+ |
| | RESUME · OS Ch. 1: Deadlock 62%  | |
| | Step 4: Banker's Lab  [Resume >] | |
| +----------------------------------+ |
| [All] [Ready] [Free Ch] [Weightage v]|
|                                      |
| SHELF 1 · CORE SYSTEMS               |
| +----------++----------++----------+ |
| |[FREE CH] ||          ||          | |
| |OPERATING || DATABASE || COMPUTER | |
| | SYSTEMS  ||  MGMT    || NETWORKS | |
| |          ||          ||          | |
| |9-11M 1/9R||8-10M 0/8R||8-10M 0/7R| |
| +----------++----------++----------+ |
| |===========TIMBER LEDGE===========| |
|  \_/ (62%)                           |
|                                      |
| +----------++----------++----------+ |
| |COMP ORG  || DIGITAL  ||  CORE    | |
| | & ARCH   ||  LOGIC   ||  BUNDLE  | |
| |          ||          ||  42-48M  | |
| |7-9M 0/8R ||5-7M 0/6R || [Peek >] | |
| +----------++----------++----------+ |
| |===========TIMBER LEDGE===========| |
|                                      |
| SHELF 2 · ALGO, THEORY & MATHS       |
| +----------++----------++----------+ |
| |ALGORITHMS|| DATA     || THEORY   | |
| |          || STRUCTS  || OF COMP  | |
| |9-12M 0/8R||7-9M 0/7R ||7-9M 0/7R | |
| +----------++----------++----------+ |
| |===========TIMBER LEDGE===========| |
+--------------------------------------+
| [Home] [Test] [Review] [Mentor][More]|
+--------------------------------------+
```
*(Notice: on 390 px, the last slot of Shelf 1's second row is a matching `CORE BUNDLE` slipcase so there is no gap next to Digital Logic!)*

---

## 4.3 Book Opening & Chapter View

### Transition Choreography (Shelf → Open Book → Lesson)
- **Step 1 — Pull & Centre (`0–180 ms`):** Selected book elevates (`scale(1.06)`, shadow softens), shelf dims gently to `opacity: 0.35` with a warm backdrop (`rgba(24, 21, 18, 0.42)`).
- **Step 2 — Cover Hinge Spread (`180–440 ms`):** Using CSS 3D `perspective: 1400px` and `transform-origin: left center`, the front cover pivots open (`rotateY(-155deg)` fades out at midpoint) while the two-page cream folio expands smoothly from the book's bounding box (`clip-path` / `transform: scale()` FLIP transition) into the centred **Spread Modal / Route** (`max-width: 960 px` on desktop, `100%` sheet on mobile).
- **Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` (decelerated entrance, zero elastic bounce).
- **Step 3 — Lesson Launch (`220 ms`):** Tapping a chapter slides the right-hand contents folio softly left (`translateX(-24px)`, `opacity: 0`) while the Lesson Screen fades in at `opacity: 1` (`180 ms`).
- **Reduced Motion (`prefers-reduced-motion: reduce`):** Zero 3D `rotateY`, zero scaling/zoom. Immediate `140 ms` crossfade (`opacity: 0 → 1`) directly into the Two-Page Contents View and Lesson Screen.

### Chapter Contents Page (Two-Page Spread on Desktop / Single Folio on Phone)
- **Left Page (Bookplate & Subject Ledger):**
  - Subject title (Sora 800), author/editorial stamp (`"RENYXERA GATE CS Series · Revised for 2027"`), GATE weightage breakdown (past 10 years' average marks & high-yield topics).
  - Visual progress gauge: `1 of 9 chapters ready · 62% of Ch. 1 completed`.
  - Primary CTA: **"Resume Ch. 1: Deadlock"** (or **"Read Free Chapter: Deadlock"**).
  - Purchase/Unlock Box (if unowned): Transparent one-time pack price (e.g., `₹299 once · Lifetime till GATE 2028`), exact count of chapters currently ready vs scheduled dates, zero countdown timers or dark patterns.
- **Right Page (Table of Contents):**
  - Numbered rows (`01` to `09`), each showing:
    - Chapter title & 1-line GATE focus (`"01 · Deadlock — Conditions, RAG, Banker's Algorithm"`).
    - **Honest Status Pill:**
      - `Free · Ready` (sage green pill + gold dot)
      - `Ready` (sage green)
      - `Writing · ETA Dec` (warm amber outline, muted ink)
      - `Planned` (stone grey outline, muted ink)
    - Micro-metadata: `~25 min · 11 PYQs · 1 Interactive Lab`.
    - Right edge: Student's personal status (`62%` ring, `✓ Done`, or `Notify me` bell for unwritten chapters).
  - Tapping a `Writing` or `Planned` chapter does **not** dead-end: it expands a tiny inline card with the planned sub-topics, a **"Practise this topic's PYQs now →"** deep link to Test Centre, and a **"Notify when ready"** toggle.

---

## 4.4 Lesson Reading Screen

### Research on Reading Comfort & Comprehension
1. **Optimal Line Length (Measure):** Classic typography standards (Robert Bringhurst, *The Elements of Typographic Style*) and accessibility specifications (**W3C WCAG 2.2 SC 1.4.8 Visual Presentation**) converge on limiting text blocks to **no more than 80 characters** (with **55–72 characters** widely cited as the sweet spot for sustained comprehension, avoiding eye-tracking fatigue on long return sweeps).
2. **Spatial Contiguity & Split-Attention (Multimedia Learning):** Richard Mayer's *Spatial Contiguity Principle* and John Sweller's *Cognitive Load Theory* demonstrate that learners comprehend worked technical examples significantly better when explanatory text sits **immediately adjacent** to its corresponding diagram rather than scrolling back and forth between a distant figure and text.
3. **Scrollable Long-Form vs Paginated:** On mobile and desktop study apps, continuous vertical scrolling with sticky section anchors outperforms rigid page breaks for technical code/diagrams, provided a clear progress/outline cue prevents "lost in document" disorientation.

### Column Architecture: Full-Width Rows vs Single Column + Margins
- **Comparison:**
  - *Pure Full-Width Rows:* Terrible for prose (lines stretch to 130+ chars at 1440 px), forcing exhausting horizontal eye travel.
  - *Strict Single Narrow Column (`680 px`):* Great for prose, **bad for worked examples beside figures** and **bad for interactive labs** (forces cramped graphs or vertical scrolling back and forth between the resource-allocation graph and step text).
- **Recommended Hybrid ("68 ch Prose Spine with 1080 px Breakout Bands"):**
  - **Default Prose Blocks** (Hook, Intuition, Definition, Traps, GATE Note): Centred `660 px` (`~64–68 ch` at `17 px` Manrope, `line-height: 1.65`).
  - **Breakout Blocks** (Worked Example + Figure, Interactive Banker's Lab, Step-by-Step Strips): Expand symmetrically up to `1040 px` (or full central workspace width when the right utility rail is open), arranged as a **2-column split (`48%` interactive/figure left | `52%` synchronized step narration right)** on desktop (`>= 1024 px`). On phone (`390 px`), the diagram stays **pinned/sticky (`max-height: 36vh`, collapsible)** at the top while you scroll through its worked steps underneath—preserving Mayer's Spatial Contiguity even on a small screen!

### Desktop (`1440 px`) Three-Zone Layout (Never Covering Text)
1. **Left Slim Outline Rail (`220 px`, collapsible, auto-hides `< 1200 px`):**
   - Sticky chapter breadcrumb (`OS > Ch. 1: Deadlock`), block checklist matching the fixed lesson flow (`1. Hook` → `2. Intuition` → `3. Definition` → `4. Walkthrough` → `5. Worked Examples` → `6. Try It` → `7. Traps` → `8. Recall` → `9. Check Qs` → `10. Lab` → `11. PYQs`), highlighting current scroll section + completion dots.
2. **Central Reading Canvas (`flex: 1`, padding keeps text between `640 px–960 px`):**
   - Clean paper sheet with generous breathing room.
3. **Right Utility Rail (`360 px` when open, `44 px` vertical tab spine when collapsed):**
   - **Pushes/reflows the grid (`grid-template-columns: 200px 1fr 360px`) rather than floating over the prose**, so the reader can read the Banker's example *while* typing a note or comparing a PYQ side-by-side!
   - **Collapsed state (`44 px` docked edge rail):** Three crisp vertical tab buttons stacked like physical index tabs sticking out of a book edge:
     - `Notes (2)` (pen/bookmark icon + count badge)
     - `PYQs (11)` (archive/exam icon + solved badge `3/11`)
     - `Mentor` (RENYXERA Mentor star mark ``)
   - **Expanded state (`360 px` compact desk panel):** Segmented top header switches effortlessly between `Notes` | `PYQs` | `Mentor` plus a close (`×`) button and width toggle (`360 px` / `480 px`).

### Phone (`390 px`) Layout & Bottom Sheets
- **Reading Canvas:** `16 px` horizontal padding (`358 px` prose width, `16 px` Manrope, `~48–54 ch` per line). Sticky slim top bar (`44 px`) shows `← OS · Deadlock` + thin reading progress hairline + `Aa` typography button.
- **Collapsed Tool Dock:** A compact floating **Pill Trio** (`[Notes 2] [PYQs 3/11] [Ask Mentor]`, height `40 px`) anchored cleanly above the bottom safe-area (note: inside `/study/[subject]/[chapter]` reading mode, hide RENYXERA's 5-tab global mobile dock `` so vertical reading space isn't eaten up—provide the `←` back arrow to return to `/study`; the Pill Trio auto-hides on fast scroll down and reappears on slight scroll up or tap).
- **Expanded Sheet (Material 3–style dual-detent Bottom Sheet):**
  - **Half-sheet (`48%` height):** Lets the student view a PYQ or ask the Mentor about the current paragraph **while still seeing the lesson diagram/text in the top 52% of the screen**.
  - **Full-sheet (`90%` height):** Drag handle up for deep PYQ solving or multi-turn Mentor chat.

---

## 4.5 Interactivity Catalogue (20 Playable Patterns for GATE CS)

| # | Pattern Name & Mechanics | Concrete GATE CS Example | Learning Science Evidence | Build Complexity & Free Tech |
|---|---|---|---|---|
| 1 | **Stateful Algorithm Step-Through & Editor** — Edit initial table/graph inputs, click Step/Play/Reset, watch invariants highlight | **OS (Deadlock):** Edit Allocation/Max/Available matrices in Banker's Algorithm; step through `Need <= Work` checks and watch Safe Sequence build or Deadlock freeze | *Concrete-Representational-Abstract (CRA)* + *Active Simulation* (reduces abstract state tracking load) | **M** · React state + crisp SVG + HTML table |
| 2 | **Pipeline / Timeline Scrubber** — Drag a cycle scrubber (`t=1..12`) and toggle hardware features | **COA (Pipelining):** Scrub a 5-stage `IF-ID-EX-MEM-WB` diagram across clock cycles; toggle *Operand Forwarding* ON/OFF to watch stalls vanish | *Dynamic Linking / Temporal Contiguity* (Mayer) | **M** · React + CSS Grid / SVG |
| 3 | **Predict-Then-Reveal Trace** — User clicks the *next* node/edge to be visited before the step unlocks | **Algorithms (Graph Traversal):** On a weighted graph, student must click the next vertex Dijkstra relaxes and enter its updated `dist[]`; wrong pick explains *why* | *Testing Effect / Retrieval Practice* (Roediger & Karpicke) + *Error-correction feedback* | **M** · React + SVG graph |
| 4 | **Condition Toggle & Live Curve** — Flip binary network/system events and observe state machine response | **CN (TCP Congestion):** Toggle *3 Duplicate ACKs* vs *Timeout* at `cwnd = 16`; watch Slow Start vs AIMD curve & `ssthresh` recalculate live | *Variational Theory of Learning* (discerning critical features by varying one dimension) | **S** · React + inline SVG polyline |
| 5 | **Drag-to-Rearrange Schedule / Order** — Reorder operations on parallel tracks and watch conflicts resolve | **DBMS (Concurrency):** Drag `R1(X)`, `W2(X)` cells in two interleaved transactions to make the schedule *Conflict Serializable* while the Precedence Graph updates live | *Enactive Manipulation / Constructive Learning* (Chi's ICAP framework) | **M** · Native Pointer Events / `@dnd-kit/core` (MIT) + SVG |
| 6 | **Semantic Zoom (Overview → Bit Detail)** — Click a layer/box to zoom smoothly into sub-fields | **CN (IP Fragmentation):** Click an IPv4 Datagram → zooms into `20B Header` → click `Flags/Offset` to split a 4000B payload across a 1500B MTU link | *Focus + Context (Shneiderman)*; prevents visual clutter | **S** · React + CSS transitions + SVG |
| 7 | **Interactive K-Map Cell Painter** — Click/drag cells (`1`, `0`, `X`) to form power-of-2 wrap-around groups | **Digital Logic:** Paint prime implicants on a 4-variable K-Map (including edge-wrap & 4-corner groups); live checker flags redundant groups vs essential PIs | *Immediate Corrective Feedback* + *Dual Coding* (visual grouping ↔ Boolean algebra) | **M** · React + CSS Grid |
| 8 | **Live Automaton & String Stepper** — Type any test string (`abba`), step state token through nodes | **TOC (NFA/DFA/PDA):** Toggle between NFA and its Subset-Constructed DFA for `(a+b)*abb`; step a custom string through active state sets | *Constructive Exploration*; makes non-determinism tangible | **M** · Pure TS state engine + SVG (`dagre` MIT or fixed coordinates) |
| 9 | **Faded Worked-Example Scaffold** — Step 1–2 solved, Step 3 has inline blank slots, Step 4 fully student-solved | **OS (Virtual Memory):** Calculate Effective Access Time with 90% TLB hit & 2-level page table; student fills only the page-fault penalty term first | *Faded Worked-Example Effect* (Renkl / Sweller — optimal transition from novice to problem solver) | **S** · React + KaTeX (`MIT`) |
| 10 | **"Where Else Is This Used?" Cross-Concept Jump** — Click a badge on a mechanism to preview its twin in another subject | **Cross-Subject:** Inside OS Deadlock's *Cycle in Wait-For Graph*, click link card → peeks at **DBMS Conflict Graph cycles** & **Algo Topological Sort** with 1-line comparison | *Interleaving & Transfer of Learning* (Bjork's Desirable Difficulties) | **S** · JSON cross-link index + Popover |
| 11 | **Misconception Trap Detector ("Spot the Flaw")** — Given a plausible 4-line proof/solution, tap the exact faulty line | **Discrete Maths (Relations/Logic):** A "proof" claiming symmetry + transitivity implies reflexivity; student taps the hidden assumption (`∃ y such that xRy`) | *Refutational Learning* (explicitly confronting common exam traps lowers repeat errors) | **S** · React selectable line blocks |
| 12 | **Parameter Slider with Live Invariant Readout** — Slide hardware params and watch bit-split update | **COA (Cache Mapping):** Slide Cache Size (`4KB–64KB`), Block Size, & Associativity (`1, 2, 4, Full`); watch 32-bit address `[Tag | Index | Offset]` bars resize & test a hit/miss stream | *Quantitative Intuition Building* (seeing inverse relationships live) | **S** · React `<input type="range">` + SVG |
| 13 | **Relational Algebra / SQL Row Matcher** — Inspect two mini tables and click rows that survive a join/filter | **DBMS (SQL & RA):** Evaluate `LEFT OUTER JOIN` + `WHERE B.col IS NULL` vs `ON` clause; rows animate into result table or fade out with `NULL` markers | *Mental Model Alignment* (exposes SQL execution order traps) | **M** · React state + CSS FLIP |
| 14 | **Recurrence Tree Unfolder** — Click "Expand Next Level" to grow tree down to base case and sum per-level work | **Algorithms (Recurrences):** Unfold $T(n) = 2T(n/2) + n$ vs $T(n) = 4T(n/2) + n$; level-sum bars on the right prove Master Theorem cases visually | *Visual Proof / Structural Understanding* over blind memorisation | **M** · React + SVG tree |
| 15 | **Bit-Level Flipper & Format Inspector** — Click individual `0/1` bits and see value + special states instantly | **Digital Logic / COA:** Flip Sign, 8-bit Exponent (Bias 127), or Mantissa bits in IEEE-754 single precision; watch normalized vs denormalized, `±0`, `Inf`, `NaN` | *Direct Manipulation* (connects binary representation to arithmetic edge cases) | **S** · Pure JS `DataView` / `Float32Array` + React |
| 16 | **CIDR Subnet Tree Splitter** — Click "Split /24 into two /25s" recursively to allocate host pools | **CN (IP Addressing):** Allocate subnets for 60, 28, and 12 hosts from a `192.168.10.0/24` block without overlapping broadcast/network IDs | *Constraint Satisfaction Practice* (prevents off-by-2 host mistakes) | **M** · React binary tree view |
| 17 | **Area-Proportional Probability / Bayes Square** — Drag priors/sensitivity sliders on a `1×1` unit square | **Engg Maths (Probability):** Visualise $P(D|Pos)$ as shaded sub-rectangles inside the unit square so base-rate fallacy disappears visually | *Iconic/Visual Bayes Representation* (Gigerenzer natural frequency / area framing) | **S** · SVG `<rect>` grid |
| 18 | **Scheduling Gantt Composer & Metric Ticker** — Toggle preemption/quantum or reorder ready-queue bursts | **OS (CPU Scheduling):** Toggle `RR q=2` vs `SRTF` on 4 arrival-time processes; watch Gantt bars redraw and Average Waiting Time / Context Switches update | *Comparative Exploration* (tests GATE boundary conditions like tie-breaking) | **M** · React + SVG timeline |
| 19 | **Adversary Game (Pumping Lemma / Game Theory)** — Student plays Defender against an automated Adversary | **TOC (Regularity):** Choose pumping length $p$, pick string $w$, watch the system choose a decomposition $xyz$ or let you try all splits to prove $L=\{a^nb^n\}$ fails | *Game-Based Quantifier Reasoning* ($\forall \exists \forall$ quantifier order becomes intuitive) | **L** · Pure TS rule engine + React |
| 20 | **Formula Term Unpacker ("Why Not +1?")** — Tap any variable/constant inside a KaTeX formula for a mini-visual | **Maths / OS / CN:** In CSMA/CD $T_t \ge 2 \cdot T_p$, tap `2` to trigger a 3-frame animation showing collision at $T_p - \epsilon$ travelling back $T_p$ | *Elaborative Interrogation* ("why is this exact factor true?" — Learning Scientists) | **S** · KaTeX custom clickable spans + Popover |

*(All 20 require **zero paid libraries**: pure React, TypeScript, SVG, CSS, KaTeX (MIT), and optional `@dnd-kit/core` (MIT) or `dagre` (MIT) — all self-hosted or bundled within zero budget.)*

---

## 4.6 Highlights, Notes & Review

### Competitor Patterns
- **Kindle & Apple Books:** 4-colour highlights + inline margin notes, aggregated in a side notebook panel. Weak at turning notes into active recall.
- **Readwise Reader:** Fast keyboard/tap highlight capture, colour/tag mapping, unified Review queue, and Markdown/spaced-repetition export.
- **Hypothes.is:** Open-standard *dual-anchoring* (CSS selector / block path + text quote + character offset) so highlights survive minor content edits.

### Our Design (Integrated Inside Lesson + RENYXERA Ecosystem)
- **4 Semantic Highlight Colours (Tuned for Light, Dark & ESL Clarity):**
  1. **Butter (`Core Idea`)** — Main theorem/intuition
  2. **Sage (`Formula / Rule`)** — Equations, conditions, invariants
  3. **Coral-Peach (`Exam Trap`)** — Common GATE pitfalls, off-by-one boundaries
  4. **Lavender (`Revisit / Doubt`)** — Unclear lines to ask Mentor or review later
- **Capture UX:** Selecting text in any prose/definition/trap block reveals a crisp compact pill toolbar (`4 colour dots` · `Add Note` · `Ask Mentor` · `Make Flashcard`). Tapping a colour highlights immediately in 1 tap (`<= 120 ms` optimistic save).
- **Margin Indicator & Notes Tab:** Highlighted blocks with an attached note display a subtle `18 px` dog-ear/ink-line badge in the right gutter. Clicking it (or opening the `Notes` tab in the Desk Rail/Bottom Sheet) jumps directly to that note, supports filtering by colour (`Exam Traps only`), quick inline editing, and **1-tap Export (Markdown copy / `.md` download)**.
- **1-Tap Flashcard Creation:** Clicking **"Make Flashcard"** on any highlight or note opens a pre-filled compact modal: *Front* = Question prompt (auto-suggested from block heading or user-edited, e.g., *"4 Necessary Conditions for Deadlock?"*), *Back* = Highlighted quote + note, synced straight to RENYXERA's existing **Spaced Repetition Flashcards** (`/test-centre/build?view=flashcards` ``) and tagged `subject: OS, topic: Deadlock`.

### Plain-Words Data Model
- **`StudyAnnotation`** (one record per highlight or note):
  - `id`: unique string
  - `userId`, `subjectId`, `chapterId`, `lessonVersion`: links to exact lesson revision
  - `anchor`:
    - `blockId`: stable block ID (e.g., `"def-coffman-conditions"`)
    - `startOffset`, `endOffset`: character indices inside that block's plain text
    - `exactQuote`: the highlighted text (fallback matcher if a typo fix shifts offsets!)
    - `prefix`, `suffix`: 24 chars before/after for fuzzy re-anchoring
  - `color`: `'core' | 'formula' | 'trap' | 'revisit'`
  - `noteText`: optional markdown string (`""` if highlight-only)
  - `linkedFlashcardId`: nullable ID if converted to a flashcard
  - `createdAt`, `updatedAt`, `syncedAt` (stored in IndexedDB offline-first, synced to backend when online).

---

## 4.7 AI Mentor Inside the Lesson

### Patterns from Existing In-Context AI Helpers
- **Khanmigo (Khan Academy):** Socratic prompting—avoids dumping the final numeric answer immediately when a student is mid-exercise; nudges the next step.
- **Duolingo Max ("Explain My Answer"):** Triggered contextually right after a wrong attempt, binding the exact question + student's chosen distractor into the prompt.
- **Notion AI & IDE Sidebars (Copilot):** Selection-anchored quick actions + compact side panel that preserves scroll position and doesn't displace the primary document.

### Our In-Lesson Mentor Architecture
- **Context Passed Silently on Open (Token-Budgeted):**
  - `subject` & `chapter` (`OS · Deadlock`)
  - `activeBlock`: the block currently centred in viewport (or user-selected text / active Check Question)
  - `studentAttempt`: if opened from a Check Question or Lab, passes the exact question stem, user's selected/entered wrong answer, and expected answer
  - `studentProfileSlice`: weak sub-topics & Mistakes Bank entries for this chapter (leveraging RENYXERA's existing Mentor capabilities ``).
- **Strict Separation from Verified Lesson Text:**
  - Lesson blocks = warm cotton paper, crisp ink text, teacher-authored & reviewed.
  - AI Mentor responses = inside the dedicated `Mentor` drawer/sheet with a distinct **tinted slate-lavender surface**, RENYXERA's Mentor star badge (``), and a subtle header stamp: *"AI Mentor · Experimental explanation — verify formulas against the lesson block"*. Every response auto-links back to the cited block (`Jump to Step 3 ↑`).
- **Quick Actions (1-Tap Chips tailored for Indian ESL GATE Prep):**
  1. `"Explain this simply"` (plain English + everyday Indian analogy, shorter sentences)
  2. `"Why is my answer wrong?"` (appears contextually on wrong Check Qs / Lab errors)
  3. `"Give me a similar 2-mark question"` (generates a fresh practice check inside the chat)
  4. `"Show the GATE exam shortcut"` (time-saving trick vs textbook method)
  5. `"What prerequisite am I missing?"` (links back to earlier OS/COA concepts)
- **Filing in Mentor History (`/ai-mentor` ``):**
  - Conversations inside a lesson reuse **one persistent thread per `(userId, chapterId)`** by default (with a `+ New topic thread` button), tagged `contextType: "lesson"`, `subjectId`, `chapterId`, `blockId`.
  - In `/ai-mentor`, these appear under a clean **"From Study Lessons"** filter tab (`OS · Ch. 1: Deadlock · 4 messages`), letting the student continue seamlessly outside the lesson or click **"Jump back to lesson →"**.

---

## 4.8 PYQ Panel

### Surface & Filtering Inside the Lesson
- Lives as the middle tab (`PYQs (11)`) in the Desk Rail (desktop) / Pill Trio Bottom Sheet (phone).
- **Compact Header Summary:**
  - Topic title (`Deadlock · 11 GATE PYQs (2017–2026)`)
  - Student micro-bar: `3 Solved · 1 in Mistakes Bank · 7 Remaining`
  - Breakdown pills: `All (11)` · `Unsolved (7)` · `2-Mark (7)` · `1-Mark (4)` · `Mistakes (1)`.
- **Question Row Cards (Compact To-Do Feel):**
  - Single-screen scannable card: `[2023 · Set 1] [2M · NAT]` + 2-line question preview + status dot (`✓ Green` Solved | `! Coral` In Mistakes | `○ Grey` Unattempted).

### Practising Without Leaving the Lesson
- Tapping any PYQ row expands an **Inline Micro-Solver** right inside the panel (no route navigation away from the lesson!):
  - Full question stem (with KaTeX + zoomable tap-to-enlarge figure if the PYQ has a graph/table).
  - Exact GATE answer control: Radio buttons (`MCQ`), Checkboxes (`MSQ`), or numeric keypad/input (`NAT`).
  - `Check Answer` → Instant right/wrong feedback + official answer + concise solution + **"Ask Mentor about this PYQ"** button + auto-logs wrong attempts to **Mistakes Bank** (`/mistakes` ``).
- Escape hatch at panel bottom: `"Want timed exam mode? Open all 11 in Test Centre →"` (opens `/test-centre` filtered to this topic).

---

## 4.9 Visual Design

### Three Visual Directions (Harmonised with RENYXERA's Sora + Manrope + Pastel Cards)

| Attribute | Direction 1: **"Warm Folio & Timber"** *(Recommended)* | Direction 2: **"Drafting Studio"** | Direction 3: **"Night Scholar & Brass"** |
|---|---|---|---|
| **Vibe** | Sunlit study library, cotton paper, natural bookcloth, birch shelves | Architectural vellum, technical manual, clean pastel grid tabs | Late-night hostel desk lamp, warm charcoal linen, muted brass |
| **Light Surfaces** | Page `#FAF7F2`, Paper Card `#FFFFFF`, Shelf Timber `#E7DDD0`, Border `#E2D9CC` | Page `#F6F8FA`, Vellum `#FFFFFF`, Desk `#EAEEF3`, Border `#D8E0EA` | Page `#F4F1EC`, Sheet `#FCFBF8`, Shelf `#DDD6CA`, Border `#D9D2C7` |
| **Dark Surfaces** *(mapped to RENYXERA `data-dk` ``)* | Charcoal Paper `#161412`, Elevated `#201D19`, Timber `#2A241E`, Border `#322D27` | Blueprint Slate `#11151B`, Card `#181E27`, Desk `#1F2733`, Border `#2B3544` | Midnight Ink `#111014`, Card `#191820`, Timber `#23202A`, Border `#2E2B38` |
| **Ink & Accent** | Ink `#1F1B16` (Dark `#EFEAE2`), Primary `#3B49DF` (pairs w/ existing `#4F46E5` ``), Gold Ribbon `#C6922C` | Ink `#151C24` (Dark `#E8EEF5`), Primary `#2F5BEA`, Amber Marker `#D97706` | Ink `#221F1B` (Dark `#F2EDE4`), Brass `#C99A3B`, Sage `#3E8E6E` |
| **Bookcloth Spines (Muted Pastel)** | Terracotta `#D98A76`, Sage `#7FA38D`, Slate Blue `#7890B2`, Ochre `#D4AA63`, Plum `#9C84A6` | Ice Teal `#80B0B8`, Periwinkle `#8B9AD6`, Sand `#CBB799`, Mint `#83B89E` | Deep Olive `#5F7464`, Oxblood `#8E5757`, Indigo Cloth `#55648A`, Ochre `#A4844A` |
| **Highlight Tints (Light / Dark)** | Butter `#FEF0B8`/`#4A3E18`, Sage `#D9F2E4`/`#1A3D2C`, Peach `#FADCD3`/`#4B241E`, Lav `#E7E2FA`/`#2D264B` | Same muted saturation (`<= 22%` opacity in dark mode so ink contrast stays `>= 4.5:1`) | Same calibrated ink-friendly overlays |
| **Typography** | Display: **Sora** `700/800` (tracking `-0.02em`); Body: **Manrope** `400/500/600` (`17px/1.65`); Numbers/Code: `JetBrains Mono` / tabular-nums (`--font-num` ``) | Same stack; heavier use of `uppercase 11px tracking-[0.08em]` Manrope 700 spec labels | Same stack; slightly larger body (`17.5px/1.68`) & softer contrast `#E6DFD3` to cut night glare |
| **Materials & Texture** | Subtle CSS noise paper grain (`opacity: 0.025`), stitched cloth spine bands (`1px dashed`), matte shelf lip shadow | Fine `24px` 1px architectural dot-grid on lab backgrounds, crisp `1px` rules | Linen weave micro-pattern on book covers, brushed brass (`#C99A3B`) hairline dividers |
| **Iconography** | `1.6px` stroke custom/Lucide-style rounded geometric ink icons + bespoke SVG bookplate crests per subject | Technical `1.5px` square-cap drafting icons, caliper/circuit glyphs | `1.5px` fine-nib icons + minimal celestial/bookmark motifs |
| **Signature Detail** | **Physical Bookmark Ribbon:** A notched woven ribbon (`16px` wide) hanging `10px` below any in-progress book spine on the shelf, matching the subject's cloth hue | **Live Section Ruler:** A vertical millimeter-style margin ruler along the lesson spine that ticks as blocks are mastered | **Warm Desk-Lamp Vignette (Dark Mode):** Soft radial warm-amber wash (`opacity: 0.04`) behind the active open book only |

### Concrete Anti-AI-Slop Rules (Strict Enforcement)
1. **NO purple-to-cyan/pink gradients** (`linear-gradient(135deg, #6366f1, #ec4899)`) on buttons, banners, or cards. Use flat, tactile bookcloth solids with subtle top-edge light (`1px inset rgba(255,255,255,0.22)`).
2. **NO neon glows / colored `box-shadow` auras** around AI Mentor or active cards. Use crisp `1px` borders + quiet warm shadows (`rgba(28, 22, 16, 0.08)`).
3. **NO "card soup" inside lessons.** Lesson blocks (Intuition, Definition, Walkthrough) must flow cleanly on **one unified paper page** separated by vertical rhythm, thin hairline rules, and subtle left-border callouts—NOT 14 stacked `rounded-3xl` floating boxes!
4. **NO emoji icons** (`🔥`, `💡`, `⚠️`, `🚀`) in headers, Traps, or GATE Notes. Use crisp `1.6px` SVG ink glyphs (`Trap`, `Gate Note`, `Recall`).
5. **NO generic 3D clay/blob illustrations.** Every diagram is data-driven SVG (graphs, matrices, pipelines) drawn directly in the palette's ink colours.
6. **NO glassmorphism (`backdrop-blur-xl`) over reading prose.** Sheets and popovers use solid paper/vellum surfaces so underlying text never muddies readability.

---

## 4.10 Motion & Sound

### Key Animations & Choreography
*(Compositor-only `transform`, `opacity`, `clip-path`; zero layout-thrashing `width`/`top` transitions.)*

| Interaction | Motion Spec | Duration & Easing | Reduced Motion (`prefers-reduced-motion`) |
|---|---|---|---|
| **Book Hover Pull-Out** | `translateY(-12px) rotateY(-8deg) scale(1.02)` + shadow deepen | `220 ms` · `cubic-bezier(0.22, 1, 0.36, 1)` | Instant `2px` border highlight, `0 ms` translate |
| **Book Open Spread** | Cover `rotateY(-155deg)` + folio expands to modal spread | `380 ms` open / `260 ms` close · `cubic-bezier(0.22, 1, 0.36, 1)` | `140 ms` opacity crossfade |
| **Desk Panel / Bottom Sheet** | Desktop grid flex/slide (`translateX`); Phone bottom sheet (`translateY` with velocity snap) | `260 ms` open / `200 ms` close · `cubic-bezier(0.2, 0.8, 0.2, 1)` | `120 ms` opacity fade |
| **Interactive Lab Step** | Active matrix cell / node pulses once (`scale(1.06) → 1`), pointer arrow slides smoothly | `200 ms` · `ease-out` | Instant state highlight swap |
| **Check-Answer Feedback** | **Correct:** subtle `scale(0.98 → 1)` + sage border fill + crisp checkmark draw (`stroke-dashoffset`). **Wrong:** gentle `4px` horizontal nudge (`±4px`, 2 cycles) + calm coral border | Correct `240 ms`; Wrong `220 ms` · `ease-out` | Instant colour + icon swap (no nudge) |

### Should Sound Have a Place?
- **Default: Strictly OFF (Muted).** Indian engineering students frequently study late at night in shared hostel rooms, libraries, or next to sleeping family—unexpected audio from a browser tab is disruptive and embarrassing.
- **Opt-in ("Subtle Tactile Audio" toggle in lesson settings):** Using zero-byte **Web Audio API synthesis** (no MP3 downloads), ultra-quiet (`gain <= 0.06`) wooden/paper micro-ticks (`8–15 ms` filtered noise burst or soft marimba sine ping) *only* for:
  1. Stepping through an Interactive Lab (`tick`)
  2. Completing a Check Question / Recall Card (`soft chime` on correct, muted low thud on wrong)
- **Never** add page-flip whooshes on every scroll or tap—those become irritating within 3 minutes.

---

## 4.11 Accessibility & Performance

- **Keyboard Navigation:**
  - Bookshelf uses **roving `tabindex`** (Arrow Left/Right moves across shelf books, Arrow Up/Down jumps shelves, `Enter`/`Space` opens book).
  - Lesson shortcuts (when focus is not inside `<input>`/`<textarea>`): `N` toggles Notes, `P` toggles PYQs, `M` toggles Mentor, `[` / `]` steps forward/back inside an active Interactive Lab, `Escape` closes any open popover/sheet and returns focus cleanly to the trigger.
- **Screen Readers:**
  - Proper landmark regions (`<nav aria-label="Chapter sections">`, `<main>`, `<aside aria-label="Study tools">`).
  - `aria-live="polite"` regions announce Check Question feedback (`"Incorrect. Hint: Process P1 still needs 2 units of R2."`) and every Interactive Lab step transition.
  - Every data-driven SVG (Resource Allocation Graph, Pipeline, K-Map) ships with a visually-hidden accessible summary table (`sr-only`) so blind/low-vision learners can inspect exact matrix/graph values.
- **Contrast:**
  - Body text & dark-mode highlights strictly checked for **WCAG AA >= 4.5:1** (`#1F1B16` on `#FAF7F2` > 14:1; `#EFEAE2` on `#161412` > 12:1). Large UI controls & icons >= 3:1. Highlight tints in dark mode are translucent dark washes (`18–22%` alpha), never bright neon yellow behind white text.
- **Dyslexia-Friendly & ESL Comfort Controls (`Aa` Reader Menu):**
  - Font toggle: Default (`Manrope`) vs **Atkinson Hyperlegible** (free, open-source Braille Institute font designed for maximum character distinction like `1`/`l`/`I` and `0`/`O`—crucial for maths/code/ESL!).
  - Text size: `15 px` / `17 px` (default) / `19 px` / `21 px` (`rem`-scaled, tested to **200% browser zoom** without horizontal scroll).
  - Line spacing: `1.5` / `1.65` / `1.85`.
  - **Focus Line Mode:** Dims surrounding blocks to `opacity: 0.45`, keeping only the active paragraph/step crisp (reduces visual crowding at night).
- **Low-End Android PWA Performance Budgets (Hostel Wi-Fi & Budget Devices):**
  - **Initial Lesson Route JS:** `<= 65 KB` gzipped (interactive labs lazy-loaded via `next/dynamic` only when the student scrolls within `400 px` of the lab block).
  - **Zero heavy 3D/WebGL/PDF libraries:** Use pure CSS 3D transforms for book spreads and crisp inline SVG for all labs & figures.
  - **Offline Resilience:** Service Worker precaches `/study` shell; opening any owned/free chapter persists its JSON AST + KaTeX expressions + topic PYQs into **IndexedDB** (`~120–250 KB` per chapter), allowing full reading, highlighting, lab execution, and PYQ practice offline—queueing annotations & Mentor drafts for sync when 4G returns.

---

## 4.12 Edge Cases (28 Concrete Cases & Exact Behaviour)

### Bookshelf Hub (1–10)
1. **Very long subject name** (e.g., *"Computer Organization & Architecture"* or *"Algorithms & Asymptotic Complexity"*): Horizontal spine label wraps cleanly up to 3 lines (`max-lines: 3`, `font-size` steps cleanly from `13.5 px` down to `11.5 px` via CSS `clamp`/token) inside a minimum `92 px` spine width—never truncates with `...` on primary title.
2. **Many subjects (e.g., 16+ books in a broad branch or "All Streams" view):** Shelves group cleanly into 2–3 logical bays (`Core`, `Maths & Theory`, `Aptitude & Electives`); shelf-end bundle card shrinks to its `180 px` minimum or moves to a dedicated summary strip so shelves stay packed without overflow.
3. **Branch with 0 books yet (e.g., user switches to Civil or ME at Phase 0):** Do **not** render an empty wooden shelf. Replace the shelf bays with a clean **"Branch Roadmap Folio"** card sitting on a single desk surface showing syllabus subjects planned, a `Notify me` vote button per subject, and a direct button: `"Practise 500+ Civil/ME PYQs in Test Centre →"`.
4. **Offline on `/study`:** Books whose chapters are cached locally stay full-colour with a subtle `Offline Ready ✓` micro-dot; uncached books mute to `75%` opacity with `Needs internet to download` badge; tapping an uncached book explains calmly instead of spinning forever.
5. **Search yields 0 results:** Keep the shelf frame intact; show an inline "No matching chapter or topic" bookend note with spelling suggestion (if close) + 1-tap `Search PYQs for "<query>"` fallback.
6. **Search matches a topic inside an unowned or `Writing` chapter:** Highlight the book, auto-expand a tiny match pill (`"Match in Ch. 4 (Writing)"`), and allow jumping to that topic's **PYQs** immediately even before the chapter text is published.
7. **Book with 100% chapters `Writing` (0 ready yet):** Never show a fake progress bar or "Free" badge. Spine reads `0/8 Ready · Upcoming`, and opening its spread shows the honest syllabus map + PYQ links per chapter.
8. **Slow 3G / Cold Cache Load:** Render wood shelf rails immediately in HTML/SSR, matching exact book widths in paper-toned `skeleton-shimmer` (``) so zero CLS (`0.00`) occurs when book data arrives.
9. **Very small phones (`320 px–360 px` wide, e.g. older budget Androids):** Switch from 3 books/row to **2 wide 3/4 books per shelf** (`~144 px` each) so bold horizontal titles never wrap awkwardly or fall below comfortable tap targets.
10. **200% Browser Zoom on Desktop (`1440 px` → effective `720 px`):** Breakpoint switches smoothly to the tablet/2-column shelf grid (`2–4` books per shelf + end plaque); no overlapping labels, no horizontal page scrollbar.

### Lesson Reading Screen (11–20)
11. **Connection drops mid-lesson:** Lesson text, labs, and cached PYQs continue working uninterrupted; top bar shows subtle `Offline · changes saved locally` pill; highlights/answers queue in IndexedDB and sync automatically on reconnect.
12. **Long KaTeX equations overflowing `390 px` phone:** Wrap display math (`$$...$$`) in an `overflow-x: auto` container with a subtle right-edge fade mask hinting horizontal swipe—never break page width or shrink math below `13 px`.
13. **Wide Resource-Allocation / Gantt SVG on `390 px`:** SVG uses responsive `viewBox` plus a compact **"Tap to Expand Landscape View"** button (rotates/expands into a full-screen pinch-zoomable modal), while keeping the worked example steps stacked cleanly underneath.
14. **Highlight spanning across two blocks (e.g., paragraph → definition or KaTeX block):** Restrict `window.getSelection()` range automatically to the nearest single `[data-block-id]` boundary—OR split cleanly into two linked `StudyAnnotation` segments sharing a `groupId` so DOM wrapping never corrupts block containers or KaTeX spans.
15. **Overlapping highlights in different colours:** Use additive/layered `<mark>` spans with priority colour on the inner span and a crisp `2px` underline for the outer span so both remain visible and individually clickable/deletable.
16. **Lesson content updated after user already highlighted text (`lessonVersion` bumped):** Anchor resolution tries `blockId + offsets` first; if text shifted, fuzzy-matches `exactQuote` + `prefix`/`suffix` within the block and silently updates offsets. If the block was rewritten completely, surface the orphaned highlight safely in the `Notes` tab under `"Archived note (section updated)"`—never silently delete student work!
17. **Invalid inputs in Interactive Lab (e.g., negative available resources or Allocation > Max in Banker's):** Clamp numeric inputs inline with a gentle inline helper (`"Allocation cannot exceed Max (3)"`) rather than crashing the algorithm stepper or popping browser `alert()`.
18. **Rapid double-tap on `Check Answer` or `Next Step`:** Lock submission during the `220 ms` feedback window (`disabled` / idempotent state) so duplicate XP, analytics logs, or Mistakes Bank entries are never written.
19. **Bookmarked/resumed lesson points to a renamed/removed block ID:** Fallback gracefully to the nearest matching section heading or lesson top with a quiet toast (`"Section updated — scrolled to nearest topic"`).
20. **User toggles `Light` / `Dark` (`edge`, `midnight`, `tinted` ``) mid-lesson:** All paper surfaces, highlight alpha washes, and **inline SVG strokes/fills** bind to semantic CSS variables (`--ink-primary`, `--diagram-node-fill`), updating instantaneously with zero page reload and zero broken black-on-black diagrams.

### Panels: Notes, PYQs & AI Mentor (21–28)
21. **No notes/highlights yet (`Notes` empty state):** Show a visual 10-second micro-guide inside the panel (`"Select any line in the lesson to highlight in 4 colours, attach an exam-trap note, or turn it into a flashcard."`) + 1-tap `"Jump to first Trap block"` shortcut.
22. **Power user with 100+ notes/highlights across chapters:** Notes tab virtualises or paginates cleanly (`This lesson` shown first, collapsible `Other OS chapters` below) with instant text filter.
23. **AI Mentor quota / rate limit reached:** Keep the full thread readable; replace the input composer with a calm notice (`"Daily AI Mentor limit reached — resets at midnight IST"`), show remaining local tools (`"You can still review 11 topic PYQs or flashcards"`), and disable send without wiping typed draft text.
24. **AI Mentor stream disconnects mid-response:** Preserve already-streamed tokens, append a quiet inline `[Connection interrupted]` tag with a 1-tap `Retry from here` button (no blank error screen wiping the explanation).
25. **PYQ contains diagrams, truth tables, or images:** Render crisp dark-mode-safe diagrams (inverted or palette-mapped SVGs / high-contrast PNGs inside a padded white/paper frame if raster) with tap-to-zoom lightbox inside the panel.
26. **Topic has 0 PYQs in 2017–2026 bank (very niche/new sub-topic):** Show `"0 direct GATE questions in 2017–2026 — frequently tested as a sub-step in related Memory/Scheduling questions"` + surface 3 closest related PYQs instead of an empty list.
27. **Topic has 40+ PYQs (e.g., Process Scheduling or SQL):** Show a `Top 8 High-Yield` default view with a `Load all 42` toggle and difficulty/year filter so the compact panel never feels endless.
28. **Phone virtual keyboard opens inside Mentor/Notes bottom sheet (tiny remaining viewport):** Bottom sheet automatically snaps to its `92%` full detent, pins the input bar above `env(keyboard-inset-height)` / `visualViewport`, and scrolls the latest message into view so the keyboard never covers what the student is typing.

---

## 4.13 Skills & Workflow for an AI Coding Agent (Claude Code)

Run these specialised skills/methods in **exact sequential order** per feature milestone—never batch everything into one giant blind generation pass:

| Order | Skill / Method | When to Run | Exact Checklist & Gate Criteria |
|---|---|---|---|
| **1** | **Design System & Token Alignment Skill** | Before writing any `/study` UI component | Inspect RENYXERA's existing CSS tokens (`--font-display`, `--font-sans`, `--font-num`, `data-look`, `data-dk` ``); define semantic `--study-paper`, `--study-timber`, `--study-ink`, `--study-spine-*`, and 4 highlight tokens for both light and all 3 dark modes. Verify zero hardcoded hex leaks. |
| **2** | **Responsive & Spatial Layout Skill** | Scaffolding `/study`, Spread Modal, & Lesson Shell | Verify **0 empty space** on bookshelf at `390 px` and `1440 px`; verify `65ch` prose measure + breakout bands; verify desktop right rail pushes layout without covering text; verify `visualViewport` keyboard handling on mobile bottom sheets. |
| **3** | **Data-Vis & Interactive Lab Skill** | Building each of the interactive figures/labs | Check every SVG uses responsive `viewBox`, CSS-variable strokes/fills (dark-mode safe), `sr-only` accessible table fallback, bounded user inputs (no NaN/negative crashes), and zero runtime layout shift. |
| **4** | **Motion & Choreography Skill** | After static layouts work cleanly | Implement shelf pull-out, cover open, sheet snap, and check-answer feedback using **only** `transform`/`opacity`/`clip-path`; verify `prefers-reduced-motion` disables 3D/nudges; test 60fps smoothness on throttled CPU (`4×` slowdown). |
| **5** | **Anti-AI-Slop Review Skill** | After first visual pass of every screen | Ruthlessly hunt and remove: purple/cyan gradients, neon glows, nested rounded-3xl card soup inside lessons, emoji bullets, generic decorative SVGs, and unrequested glassmorphism. Confirm authentic timber/paper/ink hierarchy. |
| **6** | **Accessibility & ESL Readability Audit Skill** | Before merging any screen | Run keyboard-only navigation (roving shelf tabindex, Escape focus restoration), WCAG AA contrast checks on all 4 highlight tints in light + `midnight`/`tinted` dark modes, `200%` zoom test, `aria-live` checks on labs/MCQs, and `Aa` font/spacing toggles. |
| **7** | **Design Critique & Mobile PWA Perf Audit** | Pre-ship milestone review | Inspect real `390×844` (and `360×640`) screenshots; verify lesson route JS budget (`<= 65 KB` gzipped shell via dynamic lab imports), IndexedDB offline reading + annotation queue, and zero console/hydration errors. |

---

## 4.14 Build Order (Shippable Vertical Slices)

Ship in four tight, testable increments—**always keeping the first live chapter (`OS → Ch. 1: Deadlock`) end-to-end usable from Day 1**:

1. **Slice 1 — Core Reading Loop & Design Tokens (Ship First):**
   - Extend RENYXERA's CSS tokens with the *Warm Folio & Timber* light/dark study variables.
   - Build `/study` Bookshelf Hub (390 px & 1440 px zero-empty-space shelves, horizontal bold spine labels, hover/tap pull-out, honest `Ready / Writing` tags, Continue-Reading stand).
   - Build Book Opening transition + Two-Page Contents Spread (`/study/[subject]`).
   - Build Lesson Reading Screen (`/study/[subject]/[chapter]`) rendering all structured blocks for **OS → Deadlock** (`660 px` measure + `1040 px` figure/example split, Check Qs: MCQ/MSQ/NAT, Recall Cards, and the first **Banker's Algorithm / RAG Interactive Lab**).
   - *Why first:* Delivers a complete, sellable free-sample chapter and validates reading comfort on phones immediately.

2. **Slice 2 — PYQ Panel & Annotations (Sticky Retention):**
   - Build the collapsible Desk Rail (desktop) / Pill Trio + Dual-Detent Bottom Sheet (phone) shell.
   - Ship **PYQ Panel** wired to RENYXERA's existing 2017–2026 question bank `` with inline micro-solver and automatic Mistakes Bank sync.
   - Ship **Highlights & Notes** (4 semantic colours, single-block resilient anchoring, IndexedDB offline storage + sync, Markdown export, and **1-tap Flashcard creation** into `/test-centre/build?view=flashcards` ``).

3. **Slice 3 — Contextual AI Mentor & Offline PWA:**
   - Wire the **AI Mentor tab** inside the panel with silent lesson/block/wrong-answer context injection, verified-vs-AI visual framing, 5 ESL quick actions, and persistent thread filing in `/ai-mentor`.
   - Add Service Worker + IndexedDB offline chapter pack caching and offline annotation/PYQ sync queue.

4. **Slice 4 — Reusable Interactive Engine & Authoring Scale-Up:**
   - Abstract the top 8–10 high-leverage interactive patterns from Section 4.5 (K-Map Painter, Pipeline Scrubber, Automaton Stepper, Cache Slider, Schedule Composer, Faded Scaffold, Cross-Concept Jump Map) into reusable JSON-driven block components so the teacher team can author subsequent OS, DBMS, CN, and Algorithm chapters rapidly without custom one-off page code.
   - Add `Aa` Reader Settings (`Atkinson Hyperlegible`, size, spacing, Focus Line mode) and opt-in Web Audio tactile ticks.

---

### Citations & References
- `` **RENYXERA** — *RENYXERA · GATE 2027 PYQs, AI Mentor & Mocks for CS, ECE, EE, ME, Civil, DA* (`https://gate.renyxera.workers.dev/`), directly inspected for live navigation routes, theme/look script tokens (`data-look`, `data-dk`, `--font-display`, `--font-sans`, `--font-num`), mobile dock structure, Next.js/Cloudflare stack, and supported exam streams.
- **W3C Web Accessibility Initiative (WAI)** — *Web Content Accessibility Guidelines (WCAG) 2.2*: SC 1.4.3 Contrast (Minimum), SC 1.4.8 Visual Presentation (`<= 80` character line width), SC 1.4.11 Non-text Contrast, SC 2.5.8 Target Size (Minimum `24×24` CSS px).
- **Robert Bringhurst** — *The Elements of Typographic Style* (Hartley & Marks): optimal reading measure of `45–75` characters (centre ~`66 ch`).
- **Richard E. Mayer** — *Multimedia Learning* (Cambridge University Press): Spatial Contiguity Principle and Dual Coding integration of worked text alongside diagrams.
- **John Sweller & Alexander Renkl** — *Cognitive Load Theory* & *Faded Worked-Example Effect*: managing split-attention and scaffolding learners from worked examples to independent problem solving.
- **Henry L. Roediger III & Jeffrey D. Karpicke (2006)** — *Test-Enhanced Learning / Retrieval Practice* (*Psychological Science*): active recall and predict-then-reveal testing outperform passive re-reading.
- **Robert A. Bjork & Elizabeth L. Bjork** — *Desirable Difficulties*: spacing, interleaving, and cross-topic transfer cues.
- **Michelene T. H. Chi** — *ICAP Framework* (*Cognitive Science*): Interactive and Constructive manipulation over Passive reading.
- **Product UX References (canonical documented architectures; not live-crawled):** Apple Books (elevation & progress badges), Amazon Kindle & Google Play Books (face-out ratios & notebook aggregation), Libby by OverDrive (status/availability shelf badges), Readwise Reader (highlight triage & spaced-repetition export), Literal.club (hover metadata shelves), Hypothes.is (block + quote dual anchoring), Khanmigo / Duolingo Max / Notion AI (Socratic hints, answer-specific explanation, selection-anchored actions).