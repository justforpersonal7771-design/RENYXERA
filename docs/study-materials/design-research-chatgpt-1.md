# 4.1 Concept metaphors

**Library (bookshelf)** –  This builds on the owner’s idea of a physical library.  It makes navigation spatial and familiar: subjects are “books”, chapters are “pages”.  Research on library website design shows that tying UI elements to physical library experiences (metaphors grounded in real-world libraries) helps users feel oriented.  A digital library metaphor also benefits from users’ existing mental model of shelves and books: spatial layouts reduce memory load because students can “visually locate” topics rather than recall menu paths.  *Navigation:* users browse subjects as books on shelves; clicking a book opens it.  *Risks:* If students aren’t familiar with library layouts (less likely in India) or if too many books create clutter.  Also purely metaphorical UIs can be limiting if the real world has constraints (e.g. fixed shelves). 

**Study Desk/workbench** –  This evokes an active workspace.  Elements of the interface are arranged like tools on a desk (e.g. notebooks, rulers, sticky notes).  Similar to the classic desktop metaphor, it leverages real-world familiarity. *Navigation:* The hub could look like a desktop: each subject is a notebook or sheet on the desk; chapters appear like papers on the table.  Users click/tap items to “pick them up” and open.  *Benefits:* Conveys an active, hands-on feel suitable for problem-solving (labs, scribbling, drag-and-drop on a desk).  *Risks:* May look cluttered or unrealistic.  If overdone (like skeuomorphic stationery), it can distract.  As usability experts note, metaphors must match user experience – a desk metaphor only works if students have studied with physical desks.  

**Field notebook/notebook (engineer’s journal)** –  This treats the module as a personal notebook.  The UI mimics a bound notebook or notepad (paper textures, ruled lines, hand-drawn diagrams).  For example, an “Notebook UI” concept uses paper-like backgrounds and doodles to make content feel personal and exploratory.  *Navigation:* Each lesson is a notebook page; users “flip” pages.  Summaries or maps could be drawn sketches.  *Benefits:* Feels handcrafted and study-like; the personal notebook style can be inviting for note-taking.  *Risks:* This metaphor is less common in existing apps, so it might confuse some.  Realistic paper textures and doodles can add visual noise if not done carefully, and users may prefer a cleaner layout.  

**Recommendation:** We recommend the **Library/bookshelf** concept.  It aligns with the owner’s brief (“beautiful library or bookshelf”), resonates with how students expect to find topics, and makes navigation intuitive (browsing subject “books”).  Other metaphors (desk, notebook) add playfulness but risk clutter or confusion.  Using the library metaphor also supports scalable features (collections, categories) and ties directly to the idea of “books” on a shelf.  Throughout design we should ensure familiarity without falling into outdated skeuomorphism.  

# 4.2 Bookshelf / Library Hub

Our hub will look like a seamless bookshelf filling the screen.  Studies of library UIs (Apple Books, Kindle) show successful patterns: large cover images or spines, arranged in a grid or rows with progress indicators.  In our design at 390px (phone) we use a single-column *gallery* layout (akin to Notion’s Gallery view).  Each “book” is a pastel card showing the subject’s cover (subject icon or artwork) and the full subject title in bold Sora type.  Under the title we include key status text (e.g. “Ready 3/5 chapters” or “Coming soon” in a smaller weight).  We ensure text is legible by using horizontal titles below the cover on phones; on desktop (1440px) we can tilt books or show spines with vertical Sora text because there’s more width.  The covers themselves fill their container without leaving empty margins (use CSS `object-fit: cover` or a solid swatch if needed).  

On desktop (1440px) we display books in a grid (e.g. 3–4 columns) filling the full width, with a narrow wooden shelf graphic as background (no blank whitespace).  Each book “slot” expands to fit edge-to-edge.  For visual interest, featured subjects (or free chapters) could be displayed face-out at a slight angle (like a cover on a cafe shelf) with a gold ribbon badge.  For consistency we use pastel card backgrounds and a subtle watermark texture behind all shelf areas (as on Renyxera’s cards).  

**Labels:** Use Sora (heavy weight) for subject names. On spines (desktop) rotate text 90° and letter-space tightly. On fronts (phone), horizontal labels below the cover image. Never truncate subjects – instead allow wrapping to two lines if needed, and limit name length via CSS ellipsis if truly long. For very long names, reduce font size or stack lines.  

**Hover/Tap behavior:** On hover (desktop) or tap (mobile) the book card should “come forward.”  For example, the book can tilt or lift up (translate Z or 3D rotate slightly) over ~200ms, while a subtle shadow appears underneath.  Simultaneously (or on click) a detail panel should *pull out* or *open like a book*.  For instance, tapping could slide the book to center and transition into a two-page spread of the contents (see Sec. 4.3).  We ensure the animation is smooth (cubic-bezier ease-out) and ~250–300ms long per Material guidelines.  

**Progress & status:** Each book card shows an honest status: a badge or line like “Ready/Total” chapters. We can overlay a thin progress bar (like Kindle’s orange bar on covers) at the bottom of the cover to indicate chapter completion percentage. Books still in writing (“coming soon”) show “0/?” or a “Coming soon” label in place of progress. If a subject has a free chapter, a small gold ribbon icon is pinned at the corner (like Apple Books uses to mark free content).  

**Sorting/filters/search:** Provide a search box at top (magnifying glass icon) to filter subjects by name. Also allow sorting by alphabetical, progress (most-completed first), or “recently updated.” If there are many subjects, users can choose “Category” tabs (e.g. CS, Math, Aptitude). A “Continue Reading” shortcut (like a quick link to the last-opened book) can appear at top.  

**Empty/loading/error states:** If no subjects exist (first use), show a friendly illustration (“Your library is empty – buy a lesson book to start”). On loading, show shimmer placeholders for book cards or a simple spinner. For error (e.g. network offline), display a banner (“Offline: viewing last synced library”). If a shelf row has no books yet (e.g. a new category), display a semi-transparent “Coming soon” placeholder book. All UI uses high contrast text and full touch targets (at least 44px×44px per WCAG).  

**Wireframes:** 

- *Mobile (390px):* A vertical stack of full-width book cards.  
```
+----------------------------------+
| [Cover] Subject Name             |
| Status: Ready (3/5 chapters)     |
+----------------------------------+
| [Cover] Another Subject Name     |
| Status: Coming soon              |
+----------------------------------+
| [Cover] Aptitude                 |
| Status: 100% (Completed)         |
+----------------------------------+
```

- *Desktop (1440px):* Multiple columns in a dense grid.  
```
+--------------------+--------------------+--------------------+--------------------+
| [Cover] Subject 1  | [Cover] Subject 2  | [Cover] Subject 3  | [Cover] Subject 4  |
| Ready (3/5 ch.)    | Coming soon        | 50% complete       | Ready (1/1 free)   |
+--------------------+--------------------+--------------------+--------------------+
| [Cover] Subject 5  | [Cover] Subject 6  | [Cover] Subject 7  | [Cover] Subject 8  |
| 75% complete       | 0/4 chapters       | Coming soon        | 20% complete       |
+--------------------+--------------------+--------------------+--------------------+
```

Here each card is full width of its column, ensuring no empty margins. Progress bars or text is honest (e.g. “0/4” if empty). Hovering reveals a short overlay (“Click for contents”). 

**Citations:** Many e-reader libraries use cover grids. Apple Books “seamlessly” integrates a storefront and library, Kindle shows a full-color grid with per-book progress bars, and Notion’s Gallery view highlights how cards with images and titles work well for visual navigation. Our design adapts these lessons to a responsive shelf layout. 

# 4.3 Book opening and contents view

When a book is opened, we should animate it into a two-page spread (for desktop) or a single-page view (for mobile) of the chapter list.  A smooth transition (≈300ms, ease-out) will move the selected book from the shelf into a central reading area.  For example, the book could tilt up and slide forward while its cover expands to full-screen, then morph into an open-book layout.  Page-turn animations should feel “book-like”: realistic curl/shadow effects are ideal for immersion, but if performance or user preference (reduced motion) demands it, we use a simpler fade/slide of content.  Kindle’s design, for instance, fades out the navigation/UI in ~250ms when opening a title. We can similarly fade the shelf out and replace it with the lesson outline within ~250–300ms.

The contents page itself looks like a book’s table of contents.  On desktop, show two columns (two-page spread) listing chapters side by side; on mobile, a single scrollable column.  Each chapter entry shows its title, status icon (✅ for done, ⌛ for in progress, ✏️ if being written) and share of marks (e.g. “10 marks, 2 questions”).  A small progress ring or percentage can accompany chapters in progress.  Clicking a chapter transitions into the lesson content. For reduced-motion mode, skip the fancy curl and simply crossfade or slide in the pages. Timing: use ~250ms for fades and 300–375ms for any 3D transform. 

# 4.4 Lesson reading screen

We present lessons in a **single-column layout** (both mobile and desktop) to maximize readability.  Research shows 50–75 characters per line is ideal, so on desktop we cap the text column (e.g. ~600–700px) and center it, with generous margins.  We use a font size of at least 18px (≈1.125rem) and line-height ≈1.5 to aid reading, especially for students with dyslexia (who benefit from larger text and spacing).  We avoid ultra-wide text; even on 1440px screens, content stays in one column with blank sides.  Technical figures (graphs, tables, code) can use full available width, but overall text follows a comfortable width.  

For navigation aids: on desktop, a **sticky outline panel** on the right shows the lesson’s structure (sections/blocks) and scroll progress.  As the user scrolls, the current heading is highlighted.  This Outline can collapse into a small floating button if screen space is tight.  On mobile, the outline is hidden by default but accessible via a “Table of Contents” button that opens a bottom sheet.

**Figures and media:** Images, diagrams, or step-strip figures should expand to full column width with responsive sizing.  Users can tap figures to zoom in or open a lightbox.  Equations or code blocks are presented in a monospaced font box that scrolls horizontally if needed.  We align images inline with text or as standalone blocks, but avoid multi-column text flows around images (use captions below images).

**Highlights/Notes/PYQ/AI panels:** On desktop, these tools live in collapsible side panels or insets.  For example, we might have a right-side dock with icons for “Mentor,” “Notes,” and “PYQ.”  Clicking an icon slides out a panel (300ms, ease-out) alongside the content.  When collapsed, only the icon bar (or a minimized “tab”) is visible at screen edge.  The open panel either sits above the content with a slight drop-shadow or splits the screen (grid layout).  On mobile, we use bottom sheets or full-screen modals to avoid covering text – e.g. tapping “Mentor” opens a bottom sheet that overlays only part of the screen, allowing quick dismissal.  We ensure these panels do not cover text continuously: they appear only on demand and can be collapsed.  

**Example layout:** A typical lesson page on desktop might have the content column (left) and a narrow right sidebar. The sidebar (when expanded) shows tabs: AI Mentor (chat window with context), Past Questions panel, and Highlights/Notes panel. Each tab has a header (icon + title) and its content list. When collapsed, a vertical icon bar remains. On mobile, small floating buttons (e.g. anchored at bottom-right) summon these panels one at a time.  

**Reading comfort:** All text is left-aligned (not justified).  We use high contrast (e.g. dark text on pastel background) meeting WCAG AA (≥4.5:1).  In dark mode, we invert to light text on dark backgrounds (with warm dark shades to reduce glare).  Dyslexia-friendly options (e.g. a toggle for larger text or line spacing) will be available in settings.  

# 4.5 Interactivity catalogue

We incorporate many “playable” interaction patterns.  Research shows active learning and practice testing greatly improve outcomes.  Below are patterns (with GATE CS examples), grouped by complexity:

- **Step-through algorithm (S):** An interactive walkthrough. *Example:* Banker's Algorithm (OS): show the resource matrix and let the student step through each allocation/deallocation. At each step, highlight the change. *Evidence:* Concrete feedback on each step engages students’ active processing.  
- **Predict-then-reveal quiz (S):** Present a state and ask student to predict the next state or answer, then reveal. *Examples:* MCQ “what is next request satisfied by Banker's?” or “predict next item in shortest path”. Retrieval practice boosts retention.  
- **Editable state simulation (M):** Let students modify a scenario and run the algorithm. *Examples:* OS deadlock lab where students add/remove processes and allocate resources, then simulate Banker's algorithm’s safety check. Or CN: draw extra connections and run shortest-path. *Libraries:* Can use generic graph libraries or custom JS simulation.  
- **Toggle conditions (S):** Turning a parameter on/off. *Examples:* In CN, toggle a link failure and see the new spanning tree. In OS, enable “with preemption” and see if deadlock can be avoided. *Evidence:* Manipulating variables and seeing results helps build causal understanding.  
- **Drag-and-rearrange (M):** Students drag elements. *Examples:* Dragging steps of a pipeline to simulate instruction ordering (COA), or reordering a memory map. *Libraries:* dragula.js or interact.js.  
- **Slider/Scrubber timeline (S):** Slide through an ordered sequence. *Example:* TOC grammar derivation: slide to apply production rules one by one. *Evidence:* Temporal control enhances understanding of sequences.  
- **Zoom overview/detail (M):** Click to zoom from concept map to detail. *Example:* a concept map of OS linking to DBMS shows relationships, click a node to open that topic. *Libraries:* zoomable interface (D3.js zoom).  
- **Concept map (M):** Interactive diagram of related topics. *Example:* clickable graph of Gate syllabus where nodes link topics like CN↔OS (e.g. OS uses graphs).  
- **Drill-down visual (M):** E.g. CPU scheduling Gantt chart where clicking a bar shows details or lets user change process order.  
- **Circuit/logic simulation (M):** Toggle inputs to a logic gate diagram and observe output. *Example:* Digital logic: interactive logic gates (like Logicly), free libraries exist (Logic.js).  
- **Normalization tool (M):** Interactive DBMS normalization: student inputs a table and drags dependencies into 3NF form. *Evidence:* Giving hands-on practice with data enforces concepts.  
- **Virtual lab (L):** Full environment. *Example:* SQL query builder where students assemble a query and see results. *Tools:* SQL.js in browser.  
- **Code tracing (M):** Show code and let student step with “next”. *Example:* Trace quicksort recursion; highlight lines and variables.  
- **Interactive graphs (S/M):** Let students plot points or change function parameters. *Example:* Algorithms: visualize how changing key affects binary search.  
- **Fill-in-the-blank (S):** Embedded exercises where students type an answer in a sentence. *Example:* TOC: fill missing symbol in a grammar production. Immediate feedback (green/red) encourages retrieval practice.  
- **Misconception quiz (M):** Present common wrong answers explicitly. *Example:* Show two half-baked CFGs and ask which is valid; helps correct faulty ideas. Research suggests confronting misconceptions actively aids learning.  
- **Peer example referencing (M):** A “where else used” button jumps to other topics/examples. *Example:* In the midst of a lab, a link “Where else is this used?” opens a small overlay showing related topics (like Banker's appears in both OS and CN contexts). Helps transfer knowledge.  
- **Progress bar/predictive hint (S):** The student predicts their own progress or difficulty, then compare with actual. *Example:* Before starting an exercise, ask “How many marks do you expect to score?” to prime.  

*Learning evidence:* Meta-analyses show active, hands-on tasks boost exam performance and retention.  Retrieval-practice patterns (predictive quizzes, flashcards) engage memory consolidation.  Each pattern above can be built in increasing complexity (S=small/simple, M=medium, L=large).  We’ll use free/open libraries when available (e.g. D3.js for visualizations, SQL.js or Wasm for DB lab, or custom HTML/CSS/JS for sliders and drag-and-drop).  

# 4.6 Highlights, notes and review

We will support **four-color highlighting** and **margin notes** inline in lessons.  (Colors might map to custom categories, e.g. yellow=definitions, green=questions, etc.)  Implementation: when the user selects text, an inline popup will offer highlight-colors and “Add Note”.  This mimics Kindle’s UX: long-press to select text, then choose “Highlight” or “Note” from the pop-up.  The highlight appears as colored text/underline; a note appears as a small icon – tapping it reopens the note for editing.  

All highlights and notes are stored as objects: each has text range (block ID + offsets), color, timestamp, and optional user comment.  Notes can be either tied to a highlight or standalone.  In data terms, a lesson has a list of `Highlight` records (color, text excerpt, location) and `Note` records (content, optionally linked to a highlight or block).  

Review UX: A **Notebook panel** (accessible via an icon) shows all highlights and notes for the lesson in one scrollable list, similar to Kindle’s Notebook.  It supports filtering by color or type (e.g. show only notes).  Users can tag or delete entries here.  

**Export/review:** We provide an option to export highlights/notes (e.g. to Markdown or Anki).  Users can check boxes next to notes to “Create Flashcard”: the selected text becomes the answer, and the user types the question.  This leverages the testing effect (turning notes into Q&A aids learning).  Data model for flashcards: each has a “prompt” and “answer” field and links to the originating highlight.  We also allow syncing notes via Readwise or similar (free APIs) so students can study them.  

# 4.7 AI Mentor inside the lesson

We embed an **AI chat panel** (“Mentor”) anchored in the lesson.  This panel stays in-screen (e.g. a right-side drawer on desktop, a bottom sheet on mobile).  When opened, it has context: it knows the current lesson and section, plus the student’s past mistakes/goals on this topic (per the app’s analytics).  This follows Khan Academy’s finding that giving the AI tutor relevant student history improved learning transfer.  

We strictly separate AI content from the vetted lesson: AI answers appear only in the chat panel, not altering the lesson text.  Quick-action buttons above the chat box help students ask common queries (similar to Duolingo/GPT helpers). Examples: **“Explain this step simply,” “Give me a similar question,” “Why is my answer wrong?”**  When clicked, each sends the current lesson snippet (or student answer) plus the command to the AI.  We log the conversation (question+AI response) and save it in Mentor History for the user to revisit (with date/time, topic context).  

The AI has two main modes: *Answering student questions* (Q&A about the content) and *guided practice*.  In either case, it’s contextual: we send only relevant lesson segments to the model (not the whole book).  This design mirrors Khanmigo’s approach of passing the student’s recent exercise history to Khanmigo for better answers.  We also respect API limits: if quota is reached, the panel displays a polite message (“Too many questions. Try again later”) and disables further queries until reset.  

# 4.8 PYQ panel

In-lesson, a **Past-Questions panel** lists all GATE questions tagged for the current topic.  It shows for each question: Year (e.g. “2018Q1”), Marks, and difficulty (using official classification or heuristics).  It also indicates which the student has solved (a checkmark) or not.  At top it shows “X questions found (Years Y1–Yk, total M marks)”.  

From this panel, students can click a question to practice it in the existing Test interface (we don’t navigate away).  For example, selecting “2019 Q2” slides in that question (like a modal).  After practice, they return to the lesson seamlessly.  We also provide sorting (by year, marks) and a filter (e.g. “unsolved only”).  

No external citations: this is straightforward linking of existing question bank. The key is compactness: on mobile it can be a bottom sheet, on desktop a right-side panel like the Mentor. It should not cover the text; e.g. initially it’s a thin sidebar showing only years, and expands on click. 

# 4.9 Visual design directions

We propose **three visual themes** consistent with Renyxera’s pastel-cards and Sora/Manrope fonts, each with distinct materials and palettes:

- **Warm Library (Classic)**: Uses wood and paper textures. Palette: warm beiges and browns (e.g. #F5E2D8 cream, #C9A68A tan, #8B5E3C chestnut) with pastel accents (e.g. mint #A5D8AC, blush #F0C5C1). Typography: Sora for titles (heavy), Manrope for body. Icons/illustrations: line-drawn icons (ink style) and stamped/embossed details (e.g. wax seal marks for “key concept”). Signature detail: a subtle wood grain background on shelves, or a page-turn illustration in section headings.  
- **Notional Notebook (Organic)**: Paper and cloth materials. Palette: off-white pages (#FFF8E1), gentle pastels (sky #C8E6C9, peach #FFDDC1, lavender #E4C1F9), earthy scribble colors. Typography: Sora (bold) with a secondary “handwritten” script for callouts or pull-quotes (to feel personal). Icons: hand-drawn style (like personal annotations, paperclip, pencil). Signature detail: interactive “doodle” accents (e.g. a momentary scribble when hovering over a figure).  
- **Modern Study (Clean)**: Minimalist pastels without wood textures. Palette: light neutrals (#F9F9F9, #E3F2FD pale blue, #FFE0B2 soft amber, #FCE4EC pink). Emphasis on flat colors and subtle shadows. Typography: Sora/Manrope consistently; add small colored accent bars (not gradients). Icons: simple line icons (not emoji). Signature detail: gentle drop-shadow beneath book cards or an ink-pen stroke effect on active elements.  

For dark mode, we invert to deep, muted versions: e.g. Dark Beige (#3E2B24) instead of light cream, Muted Teal (#546E7A) instead of pastel blue. Text always stays 4.5:1 contrast.

**Anti-AI design:** We explicitly avoid AI-generated clichés.  That means no purple-to-blue gradients, no neon glows, no glassy blurred “frosted glass” panels, and no infinite nested card layouts.  We also avoid generic emoji icons and stock illustrations.  Instead, every graphic (icons, motifs) will be custom-drawn or carefully chosen to match the warm pastels and wood-paper textures.  Consistency in style (e.g. all icons lined or all flat) will prevent the “card soup” feel.  In short: our palette and iconography will feel intentional and handcrafted, not randomly trendy. 

# 4.10 Motion and sound

**Animations:** Key interactions are animated ~200–300ms with ease-out easing (fast-out, slow-in) for naturalness.  Examples: pulling out a book (250ms), turning a page (400–500ms curl animation, or 250ms slide if simpler), opening a panel (300ms). On desktop we can use slightly shorter durations (~150–200ms for UI fade/slide).  For instance, navigating to a question might fade out text in 250ms while sliding the question in from the bottom in 300ms.  Feedback for answers (check/cross) should be brief (≤150ms color flash or icon pop).  All motion respects “reduce motion” settings: if set, transitions degrade to simple crossfades or instant show/hide.  

**Easing:** Use standard curves (cubic-bezier(0.4,0.0,0.2,1) or similar) for most movements. Page flips or lifts can use slightly bouncy easing for realism.  

**Sound:** We use very subtle audio feedback.  For example, a soft “whoosh” when opening the book, a gentle “plink” on correct answer, or a light page-turn rustle if appropriate.  These sounds must be quiet, short, and avoid literal jingles.  As UX experts note, sound can enhance feedback but should not be skeuomorphic (no loud paper-crumple sounds).  Every sound is optional or mute-able in settings.  We also avoid overuse – only key events (open book, correct answer) get a brief cue, building brand personality without annoyance. 

# 4.11 Accessibility and performance

We adhere to WCAG standards: normal text must have ≥4.5:1 contrast (large headings ≥3:1), and all functionality must be operable via keyboard (tab order through the shelf, open book, lessons, and check questions).  We provide meaningful ARIA labels (e.g. `aria-label="Open Operating Systems book"`, `role="button"` for interactive cards).  All images have alt text; complex visuals (charts, code) have text alternatives.  We left-align paragraphs (avoid justification) to aid dyslexic readers, and use a generous line-height (~1.5) and spacing.  Font sizes are scalable (use `rem` units) so browser zoom up to 200% works without breaking layout. We also offer a “dyslexia-friendly” mode: a toggle that can increase letter-spacing and switch to a dyslexia-optimized font if needed (by recommendation, allow user to override fonts).  

Contrast themes: light mode uses dark gray text on off-white cards (to avoid pure #FFF/#000 glare). Dark mode uses slightly warm dark background (#222) with light text (#EEE). All UI icons maintain high contrast on hover/focus. 

**Performance:** Because we target phones (including low-end Android), we optimize for speed: code-splitting, lazy-loading chapters, and keep the DOM light (reuse components). Follow best practices: aim for 60fps in animations, <50KB JS per screen, compress images. Approximately 30% of devices are low-end (≤4 cores, 4GB RAM) with CPUs up to 9× slower than flagship, so we test on budget Androids. We use a lightweight framework (or vanilla JS) and leverage hardware-accelerated CSS transitions.  Images like figures are lazy-loaded.  We also support offline (caching shelf and last-open lesson in PWA storage).

# 4.12 Edge cases

- **Very long subject names:** Wrap text or reduce font to avoid overflow. Use ellipsis only if >3 lines. On hover (desktop) show full name tooltip.  
- **Many subjects:** The grid will scroll or paginate; alternatively, allow “Show more” shelves or horizontal scrolling rows for categories.  
- **Empty branch/category:** Display a grayed-out “No books yet. Stay tuned!” placeholder.  
- **Offline:** Show “Offline” banner; enable cached content (shelf and notes). Disable Mentor and PYQ queries, with a message “Connect to internet to use Mentor”.  
- **No notes/highlights:** In Notebook panel, show “No highlights yet. Select text to highlight.”; grey out the panel and show tutorial hint.  
- **Highlight across blocks:** Split the highlight into two records or snap it to one block boundary. Our model should handle multi-block spans by storing separate highlights per block.  
- **Mentor quota reached:** In AI panel show “Daily limit reached” and disable input (then enable next day). Possibly allow one fallback static hint.  
- **Past questions with images:** Ensure images in questions scale properly. If a question has an image/PDF, open it in a viewer overlay (with zoom).  
- **Very small phones (< 350px):** UI still fits by reducing margins and buttons to minimum (e.g. stack status text below title). If too cramped, auto-collapse nonessential panels.  
- **High zoom (200%):** The layout reflows (one column naturally). The shelf should scroll vertically. All text and buttons remain accessible (we set min tap size via CSS).  
- **Excessive zoom or font size:** Ensure responsive breakpoints so content reflows (e.g. sidebar panels collapse into bottom sheets).  
- **RTL text:** Not needed (English only), but our CSS should handle it if needed (Mirroring on container-level if we ever add bilingual support).  
- **Offline notes:** If user takes notes offline, mark them “(offline)” and sync later.  
- **Session timeout:** If user is inactive, preserve scroll position and open panels on return (don’t reset the lesson).  
- **Ingredient scroll/drag:** On interactive labs, if the element goes off-screen, auto-scroll to keep it in view.  
- **Test errors:** If submitting check question fails (due to network), allow retry and show error.  
- **Speaker device & screenreader:** Ensure proper semantic HTML so NVDA/VoiceOver reads headings, questions, and labels in order.  
- **Low vision:** Allow high-contrast mode (black text on yellow, etc).  
- **Edge-case check answers:** If user repeatedly toggles an answer (right/wrong), ensure color-feedback resets properly (only one answer can be correct).  
- **Empty lesson:** If a chapter has no content yet, show “Under construction” notice with an estimated date.  
- **Loading delays:** Show loading spinners for figures/PYQ lists if slow.  
- **Repeating highlights:** If text is highlighted twice in different colors, list them separately with context.  
- **Data limits:** If the user’s content (notes, highlights) grows large, paginate or virtualize the Notebook list.  

This is by no means exhaustive, but covers typical UI, data, and state edge cases. For each, the design either provides a placeholder message or degrades gracefully. 

# 4.13 AI coding-agent skills/methods

To guide an AI (Claude Code) in building this, we must apply specialized “skills” at each step:

- **UI/UX Design (Visual System):** Define a design system with tokens (colors, typography, spacing). Tools: Sketch/Figma for mockups (free plans available) to create components (buttons, cards). Check: Are font weights (Sora/Manrope) applied correctly? Are UI states (hover, active) designed? At this stage use a *design-intelligence* skill.  
- **Anti-AI Slop Review:** After initial design, apply the **Anti-Patterns Guide**. Skill: “Detect AI UI clichés.” Check that no purple-blue gradients, no random glass, no default Inter/Roboto font slipped in. Ensure the palette and icons match brand guidelines. This is an explicit *design critique* step using known anti-AI patterns.  
- **Accessibility Audit:** Use a tool like axe-core or Lighthouse. Skill: “WCAG auditor.” Check color contrast (≥4.5:1), keyboard tab order, ARIA labels. Ensure font sizes ≥ 16px. Check line-height ≥1.5. This is an *accessibility audit* skill guided by WCAG criteria.  
- **Animation/Choreography:** Use CSS transitions or an animation library (e.g. Framer Motion). Skill: “Animation designer.” Ensure durations follow Material guidelines (300ms mobile, 150–200ms desktop). Check that easing feels natural (ease-out). Prototype transitions in Storybook or CodePen to verify timing.  
- **Interaction Design Test:** Run through flows (highlighting, solving a quiz, using Mentor). Skill: “Interaction evaluator.” Are all interactive elements reachable? Do panels behave without covering content? This is a *usability testing* skill (could even be manual run-through).  
- **Performance Audit:** Use Chrome DevTools / Lighthouse. Skill: “Performance engineer.” Check first load, script sizes, FPS on low-end. Use profiling to find bottlenecks. Ensure mobile (especially Android) renders <16ms frame times, and images are optimized.  
- **Data/Visualization QA:** For analytics charts (if any) or progress bars, apply *data viz best practices*. Skill: “Data visualization expert.” Ensure axes are labeled, legends present, no misleading bar lengths. Check where we use charts (e.g. distribution of mistakes), they follow best practices.  
- **Compliance/Privacy Check:** Skill: “Legal/a11y compliance reviewer.” Verify data (notes/highlights) are stored securely; AI data sent to tutor does not leak personal info beyond scope. Add missing tests (XSS, etc).  
- **Final Design Critique:** Skill: “Heuristic evaluation.” Review overall UI consistency, readability, branding alignment. Ensure warmth (pastel colors, softness) is evident. Check for any AI-looking scraps.

Order: Start with **UI design** and concept sketches; then **anti-AI critique** of those visuals; then build hi-fi prototypes; then **accessibility & animation** in parallel; then **integration & performance**; finally **QA & design critique**. Each step’s findings should feed back (e.g. fix contrast issues after audit, adjust colors after anti-AI check). 

# 4.14 Build order

1. **Setup & Skeleton:** Implement the basic framework (routing, top-level layout). Ship the empty Study page with shelf background. Add the subject book card component (static placeholder data).  
2. **Shelf and Navigation:** Build the responsive shelf grid (4.2), mobile list first, then desktop grid. Enable tapping a card to navigate (even if content page is placeholder). Include empty/loading states.  
3. **Lesson structure:** Create the Lesson page UI with the fixed block layout (hook, objectives, content areas). Populate one chapter (OS→Deadlock) with real content blocks (text only). Ensure scroll & text formatting.  
4. **Check questions:** Add the MCQ/NAT question widget in the lesson (without persistence). This tests interactivity and styling of quizzes.  
5. **Progress tracking:** Hook up backend state so “ready vs written” and progress percentages show correctly on shelf cards.  
6. **Highlights/Notes:** Implement text selection and highlighting logic in the lesson (front-end only), and the Notebook panel. Sync highlighting styling.  
7. **Interactive lab:** Code the OS Banker's Algorithm lab (drag inputs, step through). Ensure it works within the lesson.  
8. **Other interactivities:** Add a few more small patterns (e.g. toggle switch example, concept map stub) to validate framework.  
9. **Mentor panel:** Integrate the AI chat component (could mock responses initially). Ensure it opens and closes correctly and context is passed.  
10. **PYQ panel:** List topic questions and linking to practice. Use mock data first, then real.  
11. **Dark mode toggle & other UX:** Implement theme switch. Finalize fonts and fine-tune paddings.  
12. **Polish & QA:** Fill in all remaining content for lessons, add remaining answer types (MSQ), finalize visuals. Optimize images, fix accessibility issues.  
13. **Beta test:** Release to a small user group, gather feedback (especially on interactions and readability). Iterate on problems (e.g. mis-sized fonts on small phones).  

**First ship:** A workable shelf and one complete lesson (with interactivity and quiz) and note/highlight support. This allows students to browse, read, highlight, and answer some questions even before AI Mentor or full lesson set is done. 

**Sources:** All UI patterns are informed by best practices in digital reading and learning interfaces, cognitive science (active learning, retrieval practice), and accessibility research. 

