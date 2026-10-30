# 14 · Future features for Study materials

*31 Oct 2026. Owner request: "think and list them down, like summary, voice and many more". Effort is a rough size for one person working with Claude: S = a day or two, M = about a week, L = several weeks. Phase: **MVP** (ships with the first CS packs), **v1** (first months after launch), **Later**. Everything respects the product rules: zero budget (local or free tools), real data only, content protection (`07-PROTECTION-AND-SECURITY.md`), and a separate paid product from the plans.*

## A. Understand it (the lesson itself)

| Feature | What the student gets | Effort | Phase |
|---|---|---|---|
| **One-screen summary** per lesson | The idea, the formula and the trap in a card that fits one screen; shown first, with "read the full lesson" below | S | MVP |
| **Recall card and formula sheet** per chapter | Five questions to answer from memory, plus every formula and rule on one printable-looking page (screen only in the protected reader) | S | MVP |
| **"Why GATE asks this"** strip | Marks per paper, years asked out of 10, last year it appeared, from our own data | S | MVP |
| **Worked examples with our own numbers** | Step-by-step solutions whose answers are recomputed by code (as Forge does) | M | MVP |
| **Trap callouts** | The typical wrong answer and why students pick it, taken from PYQ patterns | S | MVP |
| **Explain it differently** toggle | Plain-language, formal, or example-first version of the same lesson | M | v1 |
| **Mind map / concept map** per chapter | A clickable map linking topics, prerequisites and PYQs | M | v1 |
| **Hindi and Hinglish** lessons | Same lessons in Hindi or Hinglish (text first, then voice) | L | Later |

## B. Listen (voice)

| Feature | What the student gets | Effort | Phase |
|---|---|---|---|
| **Audio lessons** | Every lesson read aloud (local text-to-speech: Kokoro for English; Chatterbox for Hindi if the test passes) with word-by-word highlighting, speed control, background play on phones | M | v1 |
| **"Revise on the go" playlist** | Today's recall cards and summaries as a 10-minute audio queue (commute, walking) | M | v1 |
| **Voice questions** | Ask the lesson a spoken question and hear a short answer (uses the AI quota, paid plan feature) | L | Later |

## C. Watch and play (the out-of-the-box part)

We already have a video pipeline (Remotion) and a PYQ-weighted data set, so animations are cheap for us and rare in this market.

| Feature | What the student gets | Effort | Phase |
|---|---|---|---|
| **Animated explainers** (30 to 60 s) | Cache mapping, pipeline hazards, page replacement, scheduling, normal forms, LL/LR parsing step by step, rendered once and streamed | M each | v1 |
| **Interactive simulators** inside lessons | Drag and run: cache (hit or miss trace), page replacement (FIFO, LRU, Belady), CPU scheduling Gantt, DFA builder with a test string, K-map solver, B+ tree insert and split, Banker's algorithm, SQL playground on sample tables | M each | v1 (cache, paging, scheduling first) |
| **Spot-the-error exercises** | A worked solution with one wrong step; find it | S | v1 |
| **Predict, then reveal** | Before the answer appears, pick a prediction; trains exam reasoning | S | MVP |

## D. Practise and remember

| Feature | What the student gets | Effort | Phase |
|---|---|---|---|
| **Linked PYQs and Forge questions** at the end of every lesson | "Try the real questions", filtered to the topic, with the free taster rules for Free users | S | MVP |
| **Check-yourself questions** (per chapter) | Short checks with instant feedback, recomputed keys | M | MVP |
| **Flashcards generated from lessons** | One tap adds a lesson's recall cards to the existing spaced-repetition system (flashcards exist today) | S | v1 |
| **Mistake-linked lessons** | A wrong answer in a test links to the exact lesson section that fixes it | M | v1 |
| **Spaced revision of lessons** | A lesson is re-offered on a spaced schedule (the Planner already has spaced reviews) | M | v1 |
| **Night-before sheets** | One page per subject: formulas, traps, last-year topics, for the final week | S | v1 |

## E. Personalise and plan

| Feature | What the student gets | Effort | Phase |
|---|---|---|---|
| **Study order for me** | Orders the packs and chapters by their weakest subjects and by marks per paper, inside the Study Planner | M | MVP |
| **Progress and readiness** | Completion rings per chapter and subject; readiness combines lessons read, checks passed and test scores | M | MVP |
| **Ask this lesson** (AI) | The AI Mentor answers questions with the open lesson as context (plan quota applies) | M | v1 |
| **Weak-topic "learn first" prompts** | Before a topic test, a 3-minute lesson refresher if the student is weak there | S | v1 |
| **Daily five-minute lesson** | One short item a day (Telegram or dashboard), keeps the habit | S | v1 |

## F. Reading comfort and access

| Feature | What the student gets | Effort | Phase |
|---|---|---|---|
| **Reading settings** | Text size, line width, dyslexia-friendly font, light and dark | S | MVP |
| **Highlights and notes** | Select text to highlight or add a private note; notes searchable | M | v1 |
| **Bookmarks and "continue reading"** | Resume at the exact paragraph | S | MVP |
| **Offline reading** in the protected vault | Downloaded packs (encrypted, per-account watermark; see `07`) | L | v1 |
| **Search inside everything you own** | Instant search across packs | M | v1 |

## G. Community and trust (only with moderation, later)

| Feature | What the student gets | Effort | Phase |
|---|---|---|---|
| **Report an error** on any paragraph | A one-tap error report that reaches us; fixed within 48 h with a visible note (policy in `08`) | S | MVP |
| **"What changed"** page | Every correction and every March refresh, listed | S | MVP |
| **Study groups and shared notes** | Small groups reading the same chapter | L | Later |
| **Ask a tutor** (paid reviewers) | Human answers on lessons from the reviewer for that subject | L | Later |

## H. Suggested order of building

1. **MVP (with the first packs):** summary card, recall card, "why GATE asks this", worked examples, trap callouts, linked PYQs and Forge items, check-yourself, study order, progress, reading settings, bookmarks, error report, what-changed.
2. **v1, in this order:** simulators for cache, paging and scheduling (highest marks, easiest to show), animated explainers for the same topics, audio lessons, flashcards from lessons, mistake-linked lessons, ask-this-lesson, offline vault.
3. **Later:** Hindi and Hinglish, voice questions, groups, tutors.

## I. Why these are worth it

The free alternatives are notes (static text). What they lack, and we can give: marks-per-paper evidence for each topic, recomputed numbers, traps taken from real PYQs, simulators and animations for the topics that carry the most marks, and the loop from a mistake back to the exact lesson. Those features also give the pack pages something concrete to show, which is what the free-lesson and bundle pages (`13`) will sell.
