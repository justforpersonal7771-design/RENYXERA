# 06 · Learning design: how every topic is taught so it sticks

The brief: "ease the topics so students understand them and memorise them and keep them in mind forever". This doc turns that into a fixed method that every lesson follows, so quality does not depend on mood.

## 1. The method in one line

**Hook → picture → idea → exact statement → worked example → trap → recall card → check → past papers.** Understanding is built before memory aids are added; memory aids are then attached to *what the student already understands*, which is what makes them last.

## 2. The learning science we build on (and where it shows up)

| Principle | What it means | Where it appears in a topic |
|---|---|---|
| **Concrete before abstract** | Start with a situation or picture, then the formal rule | `hook`, `intuition` |
| **Worked examples before problems** | Novices learn faster from full solutions than from struggling | `example` blocks with every step justified |
| **Fading** | Early examples complete; later ones leave steps for the student ("your turn") | Check questions with hints that fade |
| **Dual coding** | Words and a diagram for the same idea | A diagram in every `intuition` and in most examples |
| **Chunking** | Small units, 4 to 10 minutes | Topic = one idea; chapters have 4 to 10 topics |
| **Retrieval practice** | Remembering by recalling beats re-reading | `recall` card (cue → answer) and `check` questions |
| **Spaced repetition** | Reviews at growing gaps | Recall cards feed the existing 1/3/7/14-day revision schedule |
| **Interleaving** | Mix related problems after a chapter | Chapter-end mixed check; weekly mixed sets from the mistakes bank |
| **Elaboration** | Explain why, link to known ideas | "Why this works" lines; `see_also` links; prerequisite chips |
| **Error-driven learning** | Name the mistake explicitly | `trap` blocks with the wrong answer shown and refuted |
| **Cognitive load** | Remove anything that does not help | One idea per callout, no decorative graphics, consistent layout |

## 3. The block-level writing rules

- **Hook (≤ 40 words):** a real situation the topic solves. Example for deadlock: two people each hold one chopstick and wait for the other.
- **Intuition:** plain words, a picture, no symbols yet if avoidable. A single analogy at most, with its limit stated ("where this analogy breaks").
- **Exact statement:** definition/theorem/formula typeset; symbols defined in a table; conditions of validity stated.
- **Worked example:** `given / find / steps / answer`, each step with the reason in plain words. Numbers are small and meaningful first, then GATE-sized. One example is always a real GATE question (cited), with the examiner's likely trap marked.
- **Trap:** *wrong answer → why it is tempting → why it is wrong → the rule that protects you.*
- **Shortcut:** only if it is correct under a stated condition; the condition is part of the shortcut.
- **GATE note:** how it is asked (types, typical sizes), how often (from the bank), time budget.
- **Recall card:** see §4.
- **Check:** 3 to 5 questions: one recall, one apply, one trap-aware, one GATE-style; solutions explain *why each wrong option is wrong*.

## 4. Memory aids (made well, or not at all)

A memory aid must be **correct, short, and reversible** (you can recover the fact from the aid and the aid from the fact).

| Aid | Rule | Example |
|---|---|---|
| **Recall card** | ≤ 60 words; cue on the front ("Coffman conditions?"), answer on the back, plus "if you forget everything, remember…" | "Mutual exclusion · Hold and wait · No pre-emption · Circular wait: break any one and deadlock cannot happen." |
| **Mnemonic** | Only when a natural one exists; we state what each letter stands for; no nonsense acrostics that need their own memorising | Stack operations "LIFO"; ISO layers "Please Do Not Throw Sausage Pizza Away" is acceptable but optional |
| **Visual anchor** | One signature picture per topic reused in the recall card | RAG with a cycle highlighted |
| **Pattern table** | "If you see X, think Y" tables from PYQ analysis | "Count of binary trees → Catalan; labelled trees → Cayley's formula" |
| **Number anchors** | A few constants worth memorising, with how to rederive | `log2(1024)=10`; "page size 4 KB = 2^12" |
| **Formula card** | Symbols, units, conditions, and *derivation in one line* so it can be rebuilt | Beam deflection formulas with the loading diagram |
| **Contrast pairs** | Easily confused concepts side by side | Paging vs segmentation, Mealy vs Moore |
| **Story links** | Rare, only when it genuinely aids recall | — |

We **do not** use rhymes or jokes that could make the fact wrong, and every mnemonic is checked as a statement of fact like any other content.

## 5. Revision products built from the same data (no extra writing)

- **Chapter recall sheet** (one screen): all recall cards of the chapter.
- **Subject cheat sheet** (generated): formula cards and pattern tables of a subject, assembled from the blocks (only on-screen, protected).
- **Last-week mode:** the highest-weightage topics only, recall cards then the PYQs.
- **Mistake-driven review:** when a student gets a PYQ wrong, the app links the exact topic and block (trap/shortcut) that addresses it (the tags already exist).
- **Spaced recall prompts:** the recall cards enter the existing 1/3/7/14-day schedule when a student marks a topic "understood".

## 6. Difficulty and depth management

- **Three tiers** per subject: **Foundation** (everyone), **Core** (needed for the exam), **Advanced** (rare; labelled optional). The default path skips Advanced; one tap reveals it.
- **Depth follows weightage:** a topic asked every year gets two worked examples and a trap list; a topic asked once in ten years gets a compact treatment and a pointer.
- **Prerequisite warning:** when a student opens a topic whose prerequisites they scored poorly on (Checkpoint), the top of the page offers the prerequisite first, without blocking.

## 7. Examples policy

- Our own scenarios and numbers; consistent cast (for example "Process P1…", "Node A…") across a subject.
- Increasing complexity: **toy → textbook-size → GATE-size**.
- **Edge cases get their own example** (empty list, zero denominator, tie in scheduling, equal-priority processes).
- Worked solutions show the *thinking*, not only the algebra, including where a student might choose a wrong method.

## 8. Tone and style

Second person, short sentences, no filler, no jokes at the expense of precision, no "obviously" or "trivially". Define a term at first use. Every sentence earns its place. A style guide (`content/study/style-guide.md`) fixes terminology, notation, naming of examples, units, and rounding.

## 9. Accessibility and inclusion

Plain language first; formal wording second. Colour never carries meaning alone. Diagrams have text equivalents. Reading level target: a final-year engineering student reading in their second language; avoid idioms. Hindi support is a later phase and uses the same blocks (translation of text blocks only; equations, code and diagrams are language-neutral).

## 10. How we will know a topic teaches well

- **Block-level analytics** (privacy-safe): where readers stop, which blocks are re-read, the accuracy of the topic's check questions, and PYQ accuracy before versus after reading.
- A topic whose check accuracy is below 60 % or whose drop-off exceeds a threshold goes on the "rewrite" list for the next cycle.
- Reviewer comments tagged *unclear* feed the same list.
