# Master prompt: research the concept, UX and design of RENYXERA's Study module

18 Nov 2026. For the owner to paste into ChatGPT (Deep research) and Gemini (Deep Research). One run per model. Save the answers as `docs/study-materials/design-research-chatgpt.md` and `design-research-gemini.md`, then tell Claude Code "study design reports saved". This prompt asks for research and design direction only; Claude Code builds everything.

## How to run it
1. New chat, choose Deep research (ChatGPT) or Deep Research (Gemini).
2. Paste everything inside the box. Attach screenshots of the current Study shelf (`/study`) and a lesson (`/study/deadlock`) if the model accepts images.
3. When it finishes, send: `Run the section 9 self-check, fix what fails, and give me the complete corrected document once more.`
4. Save the final answer as above.

```
You are a team of four: (1) a product designer who has shipped digital reading and learning products (e-readers, interactive textbooks, study apps), (2) a learning scientist, (3) a GATE CS teacher with 15 years of experience, (4) a front-end design lead who knows what makes an interface look hand-crafted rather than AI-generated. Do real web research and cite every claim (title, organisation or author, link). If you are not sure, say so. Do not invent statistics.

I am NOT asking you to write lessons. I want research and a concrete design direction for the STUDY MODULE of a GATE preparation web app, detailed enough that a developer can build it screen by screen.

=== 1. THE PRODUCT ===
RENYXERA is a GATE exam-prep web app (installable PWA; phone and desktop). It already has: an official past-question bank (about 3,250 questions, 2017 to 2026), an exam-identical test screen, an AI Mentor (chat that knows the student's weak topics, mistakes and goals), analytics, flashcards with spaced repetition, a Mistakes Bank, bookmarks, and notes. The visual language of the app: warm pastel cards with soft watermarks, fonts Sora (display) and Manrope (body), a floating navbar on desktop and a dock on phones, light and dark modes. Budget for tools is zero: free or in-house only.

The Study module is a paid product (lesson packs per subject, one-time price). It is in Phase 0:
- A study hub at /study shown as a bookshelf: each subject is a book on a wooden shelf (core CS, maths, aptitude), a gold ribbon marks books with a free chapter, tapping a book opens a two-page spread with its contents and an honest status per chapter (ready / being written).
- A lesson page (first chapter: Operating Systems → Deadlock) built from structured blocks in a fixed order: hook, what you will learn, intuition with analogy, definition, step-by-step walkthrough, figures drawn from data (resource graphs, step strips), worked examples beside their figures, a "try it yourself" faded example, traps, GATE note, recall cards, check questions (MCQ radio, MSQ checkboxes, NAT input, right/wrong colouring), an interactive lab (students edit a resource-allocation state and step through the algorithm), links to related topics, and links to the real past questions.
- Planned: highlights and notes (four colours, synced), an AI Mentor panel inside the lesson (opens in place, knows the lesson context, conversations saved to the Mentor history), a PYQ panel listing the real GATE questions for the topic.

=== 2. THE READER ===
Indian engineering students, 20 to 25, preparing alone, mostly on phones, often at night. English is a second language. Many find textbooks hard and long video lectures unhelpful for 2-mark GATE questions.

=== 3. THE OWNER'S REQUIREMENTS ===
- The study hub must feel like a real, beautiful library or bookshelf, using the full width with no empty space; full subject names in bold, heavy type; hovering or tapping a book reveals relevant information (chapters, what is ready, marks share, progress) with an opening or pull-out effect.
- Lessons must be interactive: students can play with concepts (labs, step-throughs, zoom into a part, see where else a concept is used), not only read.
- Highlights and notes, PYQs and the AI Mentor must live inside the lesson in a compact, well-organised way (like a small calendar or to-do panel), never sending the student away.
- It must never look AI-generated or templated.

=== 4. WHAT I NEED (use these section numbers) ===

4.1 Concept: three distinct concepts for the Study module as a whole (for example "the library", "the study desk", "the field notebook", or better ideas you find), each with its metaphor, why it suits GATE students, how navigation works, and its risks. Recommend one and say why.

4.2 Bookshelf / library hub: research real examples of shelf and library interfaces (Apple Books, Kindle, Google Play Books, Libby, Readwise, Notion galleries, Literal, physical library and bookshop design, skeuomorphic and modern takes). Then specify our hub: layout at 390 px and 1440 px with no empty space, how books are sized and labelled (full names, bold heavy type that stays legible on a narrow spine, horizontal labels or tilted books, cover-facing books for featured subjects), the hover and tap behaviour (pull out, tilt, open, show contents and status), how progress and "ready vs being written" are shown honestly, sorting and filters, search, continue-reading, and empty, loading and error states. Include ASCII wireframes for phone and desktop.

4.3 Book opening and chapter view: the transition from shelf to an open book to a lesson (motion, timing, reduced-motion version), and the chapter contents page.

4.4 Lesson reading screen: the best layout for long technical lessons on phone and desktop (column widths, side rails, sticky outline, progress, figure handling, comparison of full-width rows vs a single column with margins), with research on reading comfort and comprehension. Where the highlights/notes panel, PYQ panel and AI Mentor panel sit on desktop and on phone (bottom sheets, side panels, floating buttons), how they look when collapsed and expanded, and how they avoid covering the text.

4.5 Interactivity catalogue: 15 to 25 interaction patterns that make a technical concept "playable" (labs, step-through, scrubbing a timeline, drag to rearrange, predict-then-reveal, toggle a condition and watch the result, zoom from overview to detail, "where else is this used" jumps, concept maps, misconception quizzes), each with an example from GATE CS (OS, DBMS, CN, Algorithms, TOC, COA, Digital Logic, maths), the learning evidence behind it, and build complexity (S/M/L) with free libraries if any.

4.6 Highlights, notes and review: how the best reading apps handle highlights, margin notes, review of notes, export, and turning notes into flashcards; propose our design and its data model in plain words.

4.7 AI Mentor inside the lesson: patterns from in-context AI helpers (Khanmigo, Duolingo Max, Notion AI, Copilot sidebars), what context to pass (lesson, current section, the student's mistakes), how answers are kept separate from the verified lesson text, quick actions ("explain this step simply", "give me a similar question", "why is my answer wrong"), and how conversations are filed in the Mentor history.

4.8 PYQ panel: how to show real past questions for the topic inside a lesson (count, years, marks, difficulty, solved/unsolved by the student), and the jump to practise them without leaving.

4.9 Visual design: three visual directions that suit the chosen concept and our existing brand (pastel cards, Sora and Manrope), each with palette (hex), type roles and weights, materials (paper, cloth, wood, ink), iconography, how dark mode works, and the one signature detail. Name concrete things to avoid so it never looks AI-generated (gradients, glow, purple-blue, card soup, emoji icons, generic illustrations).

4.10 Motion and sound: the key animations (book pull-out, page turn, panel open, check-answer feedback) with durations and easing, and whether subtle sound has a place (with reasons for and against).

4.11 Accessibility and performance: keyboard, screen readers, contrast, dyslexia-friendly options, text size, reduced motion, low-end Android performance budgets.

4.12 Edge cases: list at least 25 edge cases for the hub, the lesson page and the panels (very long subject names, many subjects, a branch with no books yet, offline, no notes yet, a highlight that crosses blocks, Mentor quota reached, PYQ with images, very small phones, RTL not needed but zoom 200%, etc.) and the right behaviour for each.

4.13 Skills and tools for an AI coding agent (Claude Code): which design and engineering skills or methods should be applied at each step (for example a UI/UX design-intelligence skill for the design system, an anti-AI-slop review skill, an animation/choreography skill, an accessibility audit skill, a design-critique skill, a data-visualisation skill), what each should check, and in what order to use them.

4.14 Build order: the order to build the screens and features above, with what to ship first.

=== 5. RULES ===
Cite sources for research and examples. Be concrete (sizes, hex values, durations, wireframes). No marketing language. If two options are good, give both and recommend one.

=== 9. SELF-CHECK ===
Before answering, confirm every section 4.1 to 4.14 is answered, the hub has phone and desktop wireframes with no empty space, interactions have GATE CS examples, there are at least 25 edge cases, and every research claim has a source.
```

## What Claude Code does with the reports
Compares the ChatGPT and Gemini answers with our blueprint (`BLUEPRINT-FINAL.md`), shows you where they differ, then rebuilds the hub, lesson page and panels to the agreed direction.
