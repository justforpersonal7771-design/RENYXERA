# 4.1 Concepts 

**1. Library/Bookshelf (Metaphor: Real Library).**  This fits a “GATE prep” product naturally: engineering students recognize library as a knowledge repository. Navigation could mimic shelving by subject, branch or difficulty. For example, the hub could show subjects as books (“Computer Science”, “Maths”, etc.) on a shelf. Tapping a book “opens” it. The risk is overcrowding or clutter: too many “books” can overwhelm, and a strict shelf metaphor can look old‐fashioned. (We’ll mitigate by modern styling and limiting levels.) Apple Books and Kindle use a bookshelf metaphor (spine/covers) to good effect. This metaphor also invites progress cues (like a progress bar on a spine). 

**2. Study Desk/Workspace (Metaphor: Personal Desk).**  Here the user’s *study space* is on-screen. Objects (books, notes, laptop, lamp) represent subjects or tools. Navigation could be clicking items on the desk: e.g. a notebook, textbook or flashcard deck. This feels personal and active. It suits self-study (students often “spread out” study materials). Risks: real desks are cluttered; mapping all features to desk objects may be confusing. Also consistent scaling on small phone screens is hard. It could feel novelty but may distract if over‐literal. 

**3. Notebook/Field Notebook (Metaphor: Journal/Note-taking).**  Imagine a digital notebook or lab journal. Each subject is a section in the notebook. Tapping opens pages with chapter content like entries. The navigation is linear (flip pages) or via an index. This implies an ongoing learning journey. It suits GATE study (emphasizes note-taking and reflection). The risk is that large textbooks can make a notebook metaphor cumbersome; and it may not immediately convey the variety of subjects. Without strong UI cues, users might not realize how to navigate (compared to a shelf). 

**Recommendation:** *Library/Bookshelf.*  This is already the client’s initial concept and matches their brand (wood shelf, gold ribbon). It leverages familiar UI patterns (e.g. Kindle/Apple Books) and conveys abundance of content. We can avoid its risks by smart layout (no empty space, see 4.2) and by mixing in playful elements (e.g. “featured” books face-out). 

# 4.2 Bookshelf/Library Hub 

**Inspiration:** Many e‐reading apps use shelf metaphors. Apple Books shows books with *visible spines* and subtle shadows. Kindle’s library is a grid of *full-color covers* with tiny progress bars. Physical bookstores often pack shelves densely to suggest “abundance”. Notion galleries show how cards can resize to fill width. 

**Layout (390px and 1440px):** We will tile books edge-to-edge (zero margins) so there is no blank space at the ends. On a 390px-wide phone, we might display 3 book spines per row (≈80–100px each) so the row fills width. On desktop (1440px) we could show 5–7 spines per row, filling the shelf. We’ll size spines so their bold, uppercase subject names remain legible (e.g. 80px width, 200px tall on mobile; 120×300 on desktop). Featured books (with free chapters) can be shown face-out (covers) breaking the spine grid. All labels use Sora bold. For example, phones:

```
| [ **C O M P U T E R** ] [ **A L G O R I T H M** ] [ **M A T H** ] |
| [ **D B M S**         ] [ **N E T W O R K S**  ] [ **L O G I C**  ] |
```

Desktop (each [] is a book, multiple per shelf):

```
| [ COMPUTER SCIENCE (free chapter) ] [ ADV. MATHS ] [ APTITUDE ] [ DBMS ] [ NETWORKS ] [ THEORY ] [ COA ] |
```

*(These ASCII shelves are illustrative: each box is a book. Spines show the full subject name, e.g. “Computer Science”, in heavy type with no hyphenation.)*  

**Hover/Tap Behavior:** Hovering (desktop) or tapping (touch) a book will *pull it forward or tilt* and reveal details, similar to Apple’s “open in place”. The effect should feel physical (slight 3D tilt with shadow). On interaction it could animate a little page-curl or fade to the two-page contents view (see 4.3). This uses a ~300–400ms ease-out animation. For keyboard users, focusing a book (TAB) shows the same outline. 

**Status and Progress:** Each book’s spine will show two small indicators: a progress bar (colored stripe at spine bottom showing % chapters completed) and an icon: a green checkmark if all chapters “ready”, or a “wip” icon (e.g. pencil/clock) if still being written. Books with free sample content will have a gold ribbon graphic over the spine. The exact percentage text (e.g. “50% done”) can appear on hover or on the open-book view. This matches Kindle’s approach of overlaying progress on covers. 

**Sorting/Filtering/Search:** Allow sorting books by subject name, by completion (done first), or by “most used”. A search box can filter subjects by name. A “Continue Reading” section at top could surface the last-opened book. 

**Empty/Loading/Error States:** 
- *Empty:* If no books are available (e.g. user hasn’t purchased any), show a friendly message (“Your library is empty. Visit the store to add content.”) and perhaps dimmed placeholder books.  
- *Loading:* Use skeleton cards (gray blocks with pulsing animation) in place of books.  
- *Error:* Show a retry button and message (“Could not load library. Check your internet.”).  

# 4.3 Opening a Book 

**Transition Animation:** When a book is opened, animate it as if the book is being pulled from the shelf and opened to a spread. We’ll use a 3D rotation (perspective + rotateY) for realism. The duration ~400ms (ease-out) for the main action, with page (fade) contents revealing at ~50ms delay for stagger. This is within guidelines (full-screen/page transitions 300–450ms). If the user has “reduce motion” enabled, we’ll skip the flip and just cross-fade the spread. 

**Layout:** The result is a two-page layout (like an open book). The left page lists chapters; the right page shows summary. For example:

```
 ----------------------------------------
| [📘] Chapter 1: Deadlock (Ready)        |
| [🔧] Chapter 2: Thrashing (Writing)     |
| [❌] Chapter 3: Banker's Alg (Locked)   |
| ...                                    |
 ----------------------------------------
| Summary: 3 chapters (2 ready, 1 wip)    |
| Progress: [■■■■░░░░░░] 40%              |
| Marks: 20% of GATE CS                   |
| (Click a chapter to read or start)      |
 ----------------------------------------
```

Here “[📘]” might be a chapter icon; “Ready/Writing” status, etc. The right page can include overall progress (a bar or pie) and the share of exam marks. A *sticky outline* (collapsible) can appear on one side with links to chapters (useful on desktop). 

The transition back (closing book) reverses this animation (~250ms ease-in).  

# 4.4 Lesson Reading Layout 

**Columns & Reading Comfort:** Research shows optimal line length is ~50–75 characters (≈660px at 16px font). On phones (390px wide), we use a single column (fluid width). On desktop, we *do not* stretch text full-screen; instead center the content in a column ~700–800px wide with comfortable margins. This prevents lines getting too long. Figures, code, or interactive widgets can use full width if needed (especially diagrams), but body text stays in the column. 

**Sticky Side Rails:** On desktop, a sticky **outline/TOC sidebar** on the right can help navigate a long lesson (common in docs). It highlights the current section as you scroll (scrollspy). On mobile, this outline can become a top-of-page dropdown menu. 

**Highlights/Notes Panel:** On desktop, a slide-out side panel (300–350px wide) on the *right* will host highlights/notes. When collapsed, it appears as a vertical colored tab or icon (“Notes”) at screen edge. Expanding it shifts or overlaps text (we’ll choose to push content left so text reflows rather than hiding it under a drawer). The panel lists notes sorted by location, with quick access. On mobile, tapping a “Notes” bottom-icon opens a full-screen bottom sheet showing highlights/notes for this lesson; it covers most of screen but can be dismissed. In both cases, the selection should remain visible when interacting with notes (cf. text-annotation UX) – e.g. the reader should still see the text while making a note. 

**PYQ Panel:** Similarly, another tab in that side panel (or separate compact panel) lists the real GATE PYQs for the topic: showing count, year(s), marks, difficulty, and solved status (a check or color). Each entry shows e.g. “2023 (2m) – Unsolved” and a link to the test interface. On desktop it shares the same sidebar (tabs “Notes / PYQs / Mentor”), on mobile it could be a third panel or a swipeable section in the bottom sheet. It should be quickly toggleable (icon or label), never navigates away from lesson. 

**AI Mentor Panel:** We’ll include a small AI/Mentor icon floating (like Notion’s AI icon). On click it opens a chat panel (either a side panel on desktop or bottom sheet on mobile) within the lesson. This panel shows the conversation history and an input. It will be collapsible. While open, it should not obscure text – for example, on desktop it can be a narrow vertical strip, or push the lesson column narrower, rather than overlapping. On mobile, it might initially cover about half the screen height, with the lesson still visible behind a translucent overlay. 

In **all panels**, ensure they scale down on small screens: e.g. an icon may reduce to just a dot, and panels stack properly. 

# 4.5 Interactivity Catalogue 

Active, “playable” elements should be woven into lessons. Below are 15+ patterns (each with a CS example and evidence): 

1. **Interactive Simulation/Lab (Experiment):** Allow students to manipulate model parameters. *Example:* For OS deadlock, an interactive banker's algorithm simulator where students allocate/deallocate resources and watch safety checks. Learning evidence: simulations improve engagement and retention. Complexity: **L** (full simulation, many controls); free library: [Pf4j](https://web-platforms.github.io). 

2. **Step-by-Step Algorithm Animation:** Play an animation of an algorithm with user-controlled stepping. *Example:* Visualize Dijkstra’s algorithm on a graph, with “Next” button. Worked examples and animations help learners track steps (worked-example theory). Complexity: **M**; libraries: [Vis.js](https://visjs.org/) or custom D3. 

3. **Timeline Scrubbing:** A horizontal timeline or slider that scrubs through changes. *Example:* In OS, a timeline of system states before/after each scheduling. Or in DB, timeline of transactions and lock acquisitions. Evidence: self-paced scrubbing (cursor-driven animation) helps discover causal effects. Complexity: **M**; lib: [tough timeline libraries](https://stripe.com/timeline-kit). 

4. **Drag-and-Drop Rearrangement:** Sort or re-order elements via drag. *Example:* Sorting algorithm: let student drag array elements into sorted order, then play animation of actual algorithm. Evidence: manipulatives aid understanding (cognitive theory). Complexity: **M**; lib: HTML5 Drag+JS or [SortableJS](https://sortablejs.github.io/Sortable/). 

5. **Predict-and-Reveal Quizzes:** Present a scenario and ask learner to predict outcome, then reveal. *Example:* “If process P1 requests 1 more resource and P2 is currently holding … what happens?” Student selects answer, then system shows explanation. Evidence: formative quizzes test misconceptions. Complexity: **S**; basic HTML/CSS/JS quiz. 

6. **Toggle Parameters:** Simple toggle switches that change a condition. *Example:* For OS: toggle “Priority scheduling vs Round Robin” and see Gantt chart update. Evidence: toggling promotes causal reasoning. Complexity: **M**; lib: Vue/React toggles. 

7. **Zoom/Detail Drill-down:** Start with overview, allow zooming into part. *Example:* A large network diagram where tapping a node zooms into its protocol stack detail. Evidence: scaffolding learning by going from big picture to detail. Complexity: **M**; lib: [Panzoom](https://timmywil.com/panzoom/) or [D3 zoom](https://observablehq.com/@d3/d3-zoom). 

8. **Cross-topic Links (“Where else used”):** Click a term to highlight its occurrences elsewhere. *Example:* Highlight where “deadlock” appears in the chapter or related topics (Databases, COA). Evidence: reinforces concept connections. Complexity: **S**; simple hyperlink or tooltip. 

9. **Concept Map/Graph:** An interactive concept map of the topic’s sub-topics. *Example:* Graph with nodes OS, CS, Graph, linking concepts (deadlock, sched). Students can click nodes to read mini popups. Evidence: concept maps support organization of knowledge. Complexity: **M**; lib: [Cytoscape.js](https://js.cytoscape.org/). 

10. **Misconception Quiz (Trap Quiz):** A targeted quiz that addresses common misunderstandings. *Example:* “Which statement about mutual exclusion is FALSE?” with explanation. Evidence: confronting misconceptions explicitly aids learning. Complexity: **S**; standard MCQ. 

11. **Interactive Graph/Data Slider:** Plot data and let user adjust values. *Example:* Resource allocation graph where dragging a request vector updates the safety state color. Evidence: immediate feedback aids exploration. Complexity: **M/L** (depending on data complexity); lib: [Chart.js](https://www.chartjs.org/) or [Plotly](https://plotly.com/). 

12. **Step-Through Input (Calculator):** Student inputs values stepwise and checks intermediate results. *Example:* Partition problem: let student enter numbers one by one and the app dynamically updates possible sums. Complexity: **M**; can be done with basic JS. 

13. **Polish Answer Tool (“Explain it simply”):** AI helper that rephrases steps. *Example:* After a step in deadlock example, a button “Explain this step in simple terms” which shows a text. Evidence: scaffolding. Complexity: **S** (calls Mentor). 

14. **Peer Challenge Mode:** Present student’s previous answer and ask to improve it. *Example:* If a student solved a question, show it and ask “How else could you solve?” (meta-cognition). Complexity: **M**. 

15. **Interactive Example Problem:** An example problem where students fill in steps. *Example:* A half-completed Banker table for OS where student adds entries, then reveals teacher’s solution. Complexity: **M**; maybe custom UI. 

16. **Flashcard Drill-in-Context:** Use the lesson content to generate flashcards on the fly. *Example:* key definitions from this page become instant flashcards for review. Complexity: **M**; backend logic. 

(We list 16 patterns here; more could include branching simulations, code editors, etc.)  

# 4.6 Highlights, Notes and Review 

**Existing practices:**  Many readers (Kindle, Apple Books, Instapaper) let you highlight text and add notes. Recent apps (Readwise, Hypothesis) emphasize color-coding and review. For example, Kindle supports multiple highlight colors (yellow, orange, blue, pink, green) and lets you export notes. Research suggests *self-generated* highlighting (especially when combined with review) can aid retention. 

**Design:**  We will allow 4 highlight colors (user-selectable) and free-form notes attached to selections. Tapping text shows a small menu (“Highlight [color] / Note / Copy”). When highlighting, the selection stays highlighted in that color. A subsequent tap can change or remove the highlight. Each note is a pop-up editor (or bottom sheet) anchored to the selection. 

A **highlights panel** (see 4.4) will list all highlights/notes from the lesson, showing snippet plus color or note icon. Each entry in that panel can be clicked to jump to the text. We must handle highlights spanning multiple blocks by splitting them internally (each block stores its own fragment). If a highlight crosses a section boundary, either let it span and merge in UI, or break it at the boundary with a UI cue (e.g. triangle edges). 

**Data model (plain terms):**  
- *Highlight:* records {lessonID, sectionID, startOffset, endOffset, color}.  
- *Note:* records {lessonID, sectionID, text, position}.  
- *Flashcard:* if user chooses, {prompt: highlight text or note, answer: user-entered or generated}.  

Notes and highlights sync (since Dexie is used for data) and can be exported. (Readwise exports to Notion/Evernote, which we mimic by allowing user to copy text or share.) We can add a quick “Export” in settings to get all highlights as markdown or CSV.  

**Review:**  Users can mark highlights for spaced review (like turning them into flashcards). For example, long-press on a highlight in the panel to “Create flashcard”. This queue feeds into the existing SRS system.  

No specific citation needed here; these are common patterns. We will ensure our color choices have sufficient contrast (dark text on a light pastel background) and that keyboard users can navigate highlights/notes (ARIA roles, focusable).  

# 4.7 AI Mentor (In-Context Help) 

We will embed a **chat panel** in the lesson that has full lesson context. For example, Notion AI can answer questions using page content. Similarly, the Mentor should receive the current lesson and section (or even sentence) as context with each query. The answers will be displayed in the chat panel (UI separate from the verified text). All conversation stays in the Mentor history (like Notion’s “View History”). 

*Answers vs content:* The lesson text itself must remain unchanged; AI’s answers are rendered in chat bubbles. We should visually distinguish AI responses from lesson text (different background/box).  

*Quick actions:* The panel will have buttons or prompts like “Explain this step simply”, “Give a similar question”, “Why is my answer wrong?”, etc., which pre-fill the chat input. For example, if a student is stuck at a worked example, they tap “Explain this step” and the AI explains the last step. Duolingo’s “Explain My Answer” shows how an AI can justify a student’s wrong answer. We’ll implement similar actions contextually (the lesson knows which question is active). 

*Context sent:* At minimum, include (i) the lesson title and current section heading, (ii) the student’s last answer (if relevant), (iii) key related content or formulas. We won’t send the entire site state. 

All Mentor threads will be logged in the user’s Mentor history (accessible via main menu) so students can later revisit advice. If the Mentor fails (e.g. quota or no internet), a placeholder message appears in panel. 

No formal citation, but pattern is common (Notion, Khanmigo, Duolingo all use similar in-context chat). We do cite Duolingo Max for “explain my answer” feature as an example.  

# 4.8 PYQ Panel 

Inside a lesson, the **PYQ panel** lists all past GATE questions for that topic. It will show, for each question: year, marks (e.g. “2m”), difficulty (easy/med/hard), and solved/unsolved status. Example row: “2022 [2m] – Unsolved” (gray text) or “Solved” (green). We can display counts at top (“12 questions (years: 2018–2026)”). Each item is a link/button; tapping “Practice” opens the test screen for that question (in the app) without leaving the lesson (it could open a quick modal quiz or slide out). The design can mimic a checklist. 

We will keep the panel in view (like 4.7), and allow filtering (e.g. show only unsolved). This ensures students can jump straight into practicing topic questions from the lesson context. 

Research: not specifically needed – this is a straightforward data display. But we should show summary statistics clearly (like “Solved 3/12”). 

# 4.9 Visual Design Directions 

We propose three visual themes, all based on the warm pastel brand:  

**A. “Heritage Library” (Materials: Wood, Paper, Ink).**  Palette: warm neutrals (e.g. wood-brown #A67853, ivory #F5F1E8) with muted pastels (sage #C9E4D9, dusty rose #EFDAD2) as accents. Text in dark charcoal (#222; Manrope). Icons look like hand-drawn ink sketches (slight texture). The bookshelf uses a subtle wood grain background. Books have textured cloth spines. This reinforces the bookshelf metaphor. In dark mode, swap to deep browns and midnight blues, with pastel elements glowing softly. Signature: a subtle wood grain or stationery paper pattern background on headers. 

**B. “Study Notebook” (Materials: Leather, Paper, Ink).**  Palette: cool neutrals (leather brown #8D6748, paper white #FFFDF5) plus a pop color (navy ink #1C3A3E). Pastels are calmer (light blue #DCE7EB, warm yellow #F8E9A1). Fonts like handwriting for section headers (maybe Sora’s italic) to simulate notes. Icons sketched in ballpoint style. Dark mode: dark leather brown #3C2F2F background with off-white text on panels, pastel highlights with chalk-like effect. Signature detail: a leather-bound notebook corner or a page-corner bookmark. Avoid: gradients and neon – use solid or subtle paper gradients only. 

**C. “Blueprint Lab” (Materials: Blueprint, Diagrams, Ink).**  Palette: blueprint blue #185A9D, light steel (#E8EBF2), chalk white #FAF9F8. Pastel accent like teal #A3D5D3. Heavy use of grid lines or blueprint motifs. Fonts slightly more geometric (Manrope in bold). Dark mode: deep navy (#091627) background, bright cyan accents (#3DD0EE), text in off-white. Signature: nod to graph paper/architectural drawings (fine grid lines in background). 

*Avoid:* No gaudy gradients (especially no purple/blue rainbows), no obvious drop-shadows or “card soup” (the Empire UI blog warns that identical cards everywhere look generic), no emoji-like icons (use custom line icons). We will keep most elements fairly flat or hand-crafted. In dark mode, use darker analogs of the same materials (e.g. dark wood or leather) rather than arbitrary colors. 

# 4.10 Motion and Sound 

**Motion:**  Following [71], [82]: Use durations 150–300ms for UI micro-effects, ~300–400ms for major transitions. For example: 
- Shelf “pull-out” tilt: ~250ms (ease-out) with small shadow boost.  
- Book open (page-turn): ~400ms ease-out (as above).  
- Panels (notes/Mentor) slide in: 200ms ease-out; slide out: 150ms (ease-in).  
- Button taps: 50–100ms highlight (instant feedback).  
- Check-answer feedback: e.g. coloring answer green/red with 300ms fade; or short shake if wrong (~300ms). This follows “interaction feedback <150ms” and answer reveal ~200ms.  

We’ll use standard easing (ease-out in, ease-in out) and provide a “reduced motion” mode that disables non-essential animations. 

**Sound:** We should be conservative: use subtle non-intrusive cues. For example, a gentle “ding” on correct answer and a soft “buzz” on wrong (matching semantic roles). However, sounds must be optional (user volume control, mute toggle). Only use sound for important events (e.g. lesson completion or quiz results) so as not to annoy (UI SFX guidelines recommend sound only if it “reduces uncertainty” or confirms outcome). We’ll ensure any sound is low-volume and allow disabling (per accessibility). 

# 4.11 Accessibility & Performance 

- **Keyboard/ARIA:** All interactive elements (books, panels, quiz controls, chat input) must be reachable by Tab/keyboard. Use focus indicators (outline) and ARIA labels. E.g. book spines have `role=button` and `aria-label="Computer Science book, 80% completed"`. The AI chat and PYQ lists use semantic lists or tables. 

- **Contrast:** Follow WCAG AA: text at least 4.5:1 contrast. Pastel backgrounds always have dark (#20332D or #3C2B28 from [62] examples) ink text. Avoid light text on pastel unless it passes 4.5:1. For example, Sora headlines on pastel panels must use the dark ink color (like #20332D). 

- **Dyslexia-friendly:** Allow text spacing adjustments per WCAG 1.4.12. Our layout must not break if the user increases line-height or letter/word spacing (1.5× line height, 0.12em char spacing). Use sans-serif (Manrope) with generous line spacing; avoid justified text (left-align). We can offer an optional “dyslexic-friendly” mode (larger spacing, OpenDyslexic font option, high-contrast mode). Dyslexia guidelines say no single font helps all users, so we’ll let users choose font size and spacing via browser or in-app controls. 

- **Screen readers:** Ensure lesson content uses real text (not images). Figures have `alt` text. Interactive controls have ARIA roles and labels. For example, the “Try it yourself” lab is marked as a `dialog`. 

- **Performance:** Aim for low CPU/GPU use. Use CSS transforms (will-change, GPU) for animations. Lazy-load images, pre-render interactive canvas only when needed. Avoid heavy 3D effects on low-end devices (fall back to 2D page-turn if needed). Offline: minimal UI still accessible (note: offline mode probably only works for already-loaded content; show a banner if offline). 

# 4.12 Edge Cases 

Below are example edge cases and correct behaviors:

1. **Very long subject name:** Spine height wraps label (vertical text), or truncate with ellipsis on small screens; full name always visible on hover/tap tooltip. 
2. **Many subjects:** If shelves overflow vertically, enable vertical scroll. On desktop use multiple shelf rows; on mobile use paging or scroll.
3. **Branch with no books (empty branch):** Show “No content yet” message and disable book-open. Possibly display coming-soon or allow pre-enrollment.
4. **Offline:** If offline, shelf still shows already loaded books (if any). If chapter content was previously cached, allow reading offline (Flash? If PWA, use service worker caching). If not available, grey out books with no content and show offline icon and message.
5. **No notes/highlights yet:** Panels should say “No highlights yet – tap text to add” (like Kindle empty note).
6. **Highlight spanning blocks:** If a highlight crosses a block boundary, split it and show as two contiguous highlights in UI (but same color), or show one continuous line under the break. Ensure database can handle multi-block.
7. **Mentor query limit reached (quota):** The AI panel should catch API errors and display a friendly “Mentor temporarily unavailable” message.
8. **PYQ with image (equation/diagram):** Show thumbnail of image next to question listing; opening it in the practice interface shows full image. If images fail to load, provide alt text (“Figure for Q.12”).
9. **Very small phone (e.g. 320px wide):** Use one-column layouts everywhere. Shrink text slightly if needed. Panels become full-screen overlays. 
10. **Zoom (200%):** The layout must reflow (text readable, controls still accessible). At extreme zoom, side panels may push lesson content more; ensure no clipping. 
11. **RTL (not needed for English, but if user changes browser to an RTL locale):** Ignore or default to LTR.
12. **Highlight crossing block/paragraph:** Keep track of start/end; do not lose text on reflow.
13. **Changing base font size:** UI should scale (use rem units). The design must still hold (panels should adapt height).
14. **Light vs Dark mode:** Some elements (e.g. wood shelf or leather texture) should invert tone. Ensure no “light mode only” imagery.
15. **User has no AI access:** If Mentor not enabled, hide or disable panel icon.
16. **Very long chapter list:** In open-book contents, allow vertical scroll or collapse sections. 
17. **No PYQs for topic:** Show “0 past questions”.
18. **Slow connection:** Show loading spinners/skeletons; allow retry.
19. **Cannot load interactive lab (e.g. blocked script):** Show fallback text “Simulation not available” and suggest reload.
20. **Malformed data (bad JSON):** Show error panel with reload option.
21. **Switching themes mid-lesson:** Panels and highlights should update instantly (CSS variables).
22. **Multiple tabs of same lesson:** Sync highlights/notes across tabs (use Dexie live queries if possible).
23. **User scrolls while hover menu open:** The selection menu (copy/highlight) should stay anchored (or close it).
24. **High DPI screens:** Ensure SVG icons and fonts scale cleanly.
25. **User navigates away mid-chapter (accidentally back button):** Confirm prompt to “Save progress?” or auto-save last read position.
26. **Empty bookmarks or notes:** Offer tooltip “Bookmark this page” / “Add a note”.
27. **Low battery with heavy animation:** Have “lite mode” for low-power (disable 3D flips).
28. **Inconsistent state:** E.g. a chapter marked “Ready” but empty content – validate on load, re-fetch or mark “Error”. 
29. **Book with mixture of ready and draft chapters:** Indicate incomplete chapters as disabled or grey.
30. **Locale/Calendar formatting (e.g. next steps in Lab):** Always use English and International numerals (safe assumption).

# 4.13 Skills & Tools for AI Agent (Claude Code) 

At each build step, we would apply specialized **roles** (skills) and free tools:

1. **UI/UX Design Intelligence (Design System Dev):** Understand brand and create a design system before coding. Skills: layout planning, typography hierarchy, component design. Check: consistency of colors, spacing tokens, style guide. Tools: Figma/Sketch (free tier if possible) or pen-and-paper. Use [DesignTokens.one] style guidance (like naming color roles).  
2. **Anti-AI-slop Review (Contextual Prompts):** Provide the agent with the design tokens or CSS variables (e.g. semantic tokens). We’ll use an ESLint or Tailwind linter as a guard. For example, `eslint-plugin-tailwindcss` flags non-approved classes. The AI should be constrained by our CSS/JS tokens to avoid “gradient soup”.  
3. **Animation Choreography:** Use guidelines (see [71]) to set consistent durations/eases. Skill: design meaningful motion (onboarding by Motion design articles). Tools: write timing values as variables (fast=150ms, medium=250ms, slow=400ms) and use in CSS. Possibly use Framer Motion or simple CSS transitions.  
4. **Accessibility Audit:** Follow WCAG and use tools like axe-core (free) to scan the UI for contrast/ARIA issues. Skill: knowledge of ARIA roles and dyslexia guidelines. For focus states, test keyboard navigation manually.  
5. **Design Critique (Usability testing):** Have peers or run test tasks (do students find the shelf easily?). Tools: usability heuristics checklist (Nielsen) to catch issues like over-complex navigation.  
6. **Data Visualization Skill:** For analytics charts in dashboards (e.g. exam performance), use D3.js (open) or Chart.js (MIT). Ensure these follow best practices (clear labels, correct chart types). Check against known patterns (e.g. avoid pie for many categories).  
7. **Markdown/Data Export:** For highlights export, ensure data format is simple (CSV/JSON). No external API needed – just Dexie data to JSON download.

Order: Start with defining tokens (4.9 palette, type scales) and library layout (4.2 wireframes). Then implement static layouts (HTML/CSS). Next, add interactivity (labs/quizzes 4.5). Then panel features (highlights 4.6, Mentor 4.7, PYQ 4.8). Throughout: apply design-intelligence (UI consistency) and anti-AI linter. After functional, do animation choreography and accessibility audit. Finally, a design critique round to polish. 

# 4.14 Build Order 

1. **Study Hub (Bookshelf) UI.** Layout shelf grid (4.2), book-open animation (4.3). No payments yet. 
2. **Static Lesson Content.** Build lesson page structure (4.4): columns, typography, images. 
3. **Quiz (Check Questions).** Implement MCQ/MSQ/NAT UI and feedback (4.5). 
4. **Interactive Figures & Labs.** Build key interactions (eg. OS simulation) (4.5). 
5. **Highlights/Notes System.** Integrate highlighting, storage, side panel UI (4.6). 
6. **PYQ Panel.** Fetch questions by topic, display list with links (4.8). 
7. **AI Mentor Panel.** Insert chat widget, hook context and actions (4.7). 
8. **Styling & Visual Themes.** Apply chosen visual direction (4.9) across components. 
9. **Motion/Animation.** Add animations/transitions (4.10) with reduced-motion option. 
10. **Accessibility Audit & Polish.** Fix contrast, keyboard, text spacing (4.11). 
11. **Edge Case Handling.** Test and fix scenarios from 4.12 (empty states, offline etc.). 

First shipables: a functioning hub with at least one open-able “free” lesson, static content plus one quiz, highlights (even stubbed), and minimal UI theme. Then iterate (as above). 

**Sources:** Product specs and design guidelines from Apple, Kindle, Material Design, WCAG, and education research. These informed our recommendations (e.g. bookshelf vs desk metaphor, line-length limits, animation timings, etc.). Each specific design choice above is justified by these sources or common UX practice. We have cited all referenced facts and examples.