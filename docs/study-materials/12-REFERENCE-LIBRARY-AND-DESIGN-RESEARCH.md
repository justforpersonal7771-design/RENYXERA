# 12 · Reference library review and design research

*17 Oct 2026. Based on the `notes/` folder you added (88 PDFs, about 1.5 GB) and on learning-science practice. The folder is **reference only**: it informs structure, coverage and design. Nothing is copied from it (see section 6).*

## 1. What is in the library

| Group | Files | What it is | What we use it for |
|---|---|---|---|
| **Textbooks** | 14 (Cormen *Algorithms*, Kernighan-Ritchie *C*, Rosen *Discrete Maths*, plus CN, COA, DBMS, DS, Digital Logic, Engineering Maths, OS, TOC, Compiler Design, Quantitative Aptitude) | Full-length standard texts, 288 to 1,313 pages each | **Primary reference for correctness and depth.** We study how each explains a topic and where they differ. |
| **Unacademy notes** | 12 (Algorithms, COA, Compiler, CN, DBMS, Digital Logic, Discrete, Eng Maths, OS, Programming & DS, TOC, Aptitude) | Chapter-numbered notes with a textbook feel, 78 to 397 pages | **Design reference** (page rhythm, callout boxes, worked questions inline) and a **coverage cross-check**. |
| **GATE-O-PEDIA (PW handbook)** | 1 (541 pages, CS & IT) | One-volume handbook with numbered sections and worked solutions | Coverage map and section numbering style. |
| **Made Easy workbooks 2023** | 11 | Question-bank style, answers in brackets | How *not* to learn: questions without teaching. Useful to see the question mix per topic. |
| **ACE postal package** | 26 | Theory books and workbooks, 17 to 342 pages | Coverage cross-check, topic order used by one coaching house. |
| **GFG short notes** | 12 | 17 to 58-page revision sheets | Revision-sheet format ideas. |
| **GATE AIR 1 short notes (2024)** | 13 | Handwritten topper notes | What a topper chooses to remember: the *formulas, tables and tricks* list. |
| **Syllabus and formulas** | `CS_2026_Syllabus.pdf`, one EduRev formula sheet | Official syllabus plus a formula sheet | The syllabus is the **authority** for structure (doc 02). |

## 2. What the samples show (and what we do better)

I opened sample pages from the Unacademy OS notes, the PW handbook and the Made Easy workbook.

| Source | Looks good | Weak spot | Our answer |
|---|---|---|---|
| Unacademy | Clean chapter header, colour-coded question boxes (`Q13`/`Sol`), numbered figures, a side tab showing the chapter, solved GATE questions in the flow | Notes read like slides: bullet fragments, little *why*; no way to check yourself; static PDF pages; formulas typeset inconsistently; incomplete topics, as you noted | Explanation first, then the exam view. Each topic: idea → intuition → exact definition → worked example → "common trap" → check-yourself → linked PYQs. Interactive and always consistent. |
| PW handbook | Numbered sub-sections (`7.2.1`), crisp tables, tight text | Dense bullet lists, watermark across every page, no adaptivity | Same numbering clarity, better spacing, live PYQ links, no obstructive watermark (see doc 07 for subtle, traceable ones). |
| Made Easy | Fast questions with answers at the end of each | No explanation, answers only | We pair every question with the *method*, and our bank already has official answers. |
| Textbooks | Depth, rigour, correct terminology | Too long for the exam, not aligned to GATE weightage | We follow the syllabus tree and weightage, link to the textbook section as "go deeper". |
| AIR 1 notes | Dense recall: formulas, tables, one-line tricks | Only useful if you already understand | We generate a **cheat-sheet per chapter** from our own lesson (doc 06). |

**Gaps all of them share, which is our opening:** no diagnosis of *your* weak topic, no spaced re-reading, no link from a wrong answer to the exact paragraph that explains it, no simulation of algorithms or protocols, no consistent notation between subjects, no version control with a visible "updated for 2027" note.

## 3. Structure and design: what we adopt

These come from learning-science findings that are well established (retrieval practice, spacing, worked examples, interleaving, dual coding) and from the better parts of the references above. I did a web check on current practice; the sources were mostly vendor blogs with little on textbook structure, so I treat them as background and the design below as **our own decisions**, to be tested with students in Phase 0.

1. **One page = one idea.** A topic lesson answers one question and takes 5 to 12 minutes. Short pages beat long chapters on phones.
2. **Fixed lesson skeleton** (the template in `templates/chapter-template.md` already has it): *Why it matters → Intuition → Exact statement → Worked example (our numbers) → Common mistakes → Check yourself (3 to 5 questions) → PYQs on this topic → Go deeper (textbook reference)*.
3. **Worked example, then faded practice.** First a fully solved example, then one with a blank step, then one to do alone. This is the best-supported sequence for procedures (Dijkstra, normalisation, CPU scheduling).
4. **Retrieval before re-reading.** Every lesson ends with check-yourself questions; the Review tab brings them back at spaced intervals (reuse the Revision engine already in the app).
5. **Dual coding.** A diagram, table or trace next to every abstract rule; animated step-through for algorithms, protocols, pipelines (doc 05).
6. **Interleaved sets per subject**, mixing topics in a revision quiz, not only blocked practice.
7. **Cheat-sheet and flashcards generated from the lesson**, so the topper-notes format exists for every chapter without extra writing.
8. **Weightage badge** on each topic ("appeared in 11 of the last 14 papers; average 2.3 marks") from our PYQ tags. No competitor can show this.
9. **"Why you got it wrong" links:** a wrong answer in practice or mocks opens the exact lesson section. This is the strongest tie to the main app.
10. **Reading comfort:** large readable type, generous spacing, one accent colour per subject, dark and light themes, offline for the paid pass, notation identical across subjects.
11. **Honest scope markers:** each topic is tagged *Core*, *Advanced* or *Beyond GATE*, so students know what to skip.

## 4. Suggested textbooks per CS subject (primary, then cross-check)

You added a textbook set and asked me to use what I think is most useful. My picks for the CS pilot, with the role each plays:

| Subject | Primary reference | Cross-check | Notes |
|---|---|---|---|
| Algorithms | Cormen et al., *Introduction to Algorithms* (in the folder) | Sedgewick, Kleinberg-Tardos | Proofs and exact bounds |
| Data Structures and Programming | Kernighan-Ritchie *C* (folder) plus a data-structures text | Weiss, Tenenbaum | Code is checked by running it |
| Operating Systems | Silberschatz, *Operating System Concepts* (folder copy to be confirmed) | Tanenbaum | Scheduling and deadlock numerics |
| DBMS | Korth *Database System Concepts* | Elmasri-Navathe, Ramakrishnan | The folder copy is a "for evaluation" scan; use as a reference only |
| Computer Networks | Kurose-Ross | Tanenbaum, Forouzan | Check RFCs for field names |
| COA | Hennessy-Patterson, Mano | Hamacher, Stallings | |
| TOC | Hopcroft-Motwani-Ullman, Sipser | Linz | |
| Compiler Design | Aho-Lam-Sethi-Ullman | Cooper-Torczon | |
| Discrete Maths | Rosen (folder) | Liu, Grimaldi | |
| Digital Logic | Mano | Morris | |
| Engineering Maths | Kreyszig, Strang for linear algebra | Ross for probability | |
| Aptitude | Official GATE GA papers (our bank) | Standard quant text | Verbal: official pattern |

Rule: **two independent sources must agree** on every definition, formula and result before it appears in a lesson; if they disagree, the official GATE answer (our bank) decides, and the disagreement is recorded in the chapter's review notes.

## 5. How the reference set is used in the pipeline

- **Stage 0, Brief:** a coverage matrix compares the syllabus tree, our PYQ tags and the table of contents of the references. Topics that appear in the syllabus or PYQs but are thin in the coaching notes get flagged. This is how we beat "they are not complete".
- **Stage 1, Source study:** the drafter reads the textbook section(s) for the topic and writes short study notes (in our own words, kept outside the repo) listing the correct statements, notation, edge cases and common traps.
- **Stage 3, Review:** the human reviewer compares our lesson with the textbook for correctness, not wording.
- **Design reviews:** coaching notes are opened only to judge layout and coverage, never to lift text, figures, examples or question wording.

## 6. Hard rules for the reference folder

1. **It never goes into git.** I added `docs/study-materials/notes/` to `.gitignore`. It is 1.5 GB of third-party copyrighted PDFs; pushing it would break the deploy checkout, and it would be an infringement risk on a public repository.
2. **Never copied.** No text, figure, table, example or question wording from Unacademy, PW, Made Easy, ACE, GFG or any coaching house goes into our lessons. This updates rule 6 in `03`: coaching notes may be *looked at* for design and coverage only.
3. **Textbooks are learned from, not quoted.** Short definitions may be quoted with citation where exact wording is the point.
4. **Everything is redrawn and rewritten:** diagrams as data, our own numbers, our own structure. The automated overlap check (doc 03, section 4) runs against these PDFs' extracted text (kept locally, outside git) so accidental closeness is caught.
5. **Provenance log:** each lesson records which references informed it (in the review file, not shown to students).

## 7. Updates this causes elsewhere

- `00-README.md`: this doc added to the index; decision 3 (sources rule) reworded.
- `03-CONTENT-PIPELINE.md`: rule 6 and the overlap-check source list reworded.
- Phase 0 sample chapter stays **Deadlock** (OS): richest in diagrams, traces and numeric questions, and the references hold three independent treatments (Silberschatz in the folder, Unacademy for the design comparison, PYQs from our bank).
- A **side-by-side coverage matrix** (syllabus × PYQ weight × reference coverage) is a Phase 0 deliverable, built by script from the local PDFs.
