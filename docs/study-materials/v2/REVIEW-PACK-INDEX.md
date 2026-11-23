# Review packs: one file per subject (in depth)

Every subject has its own folder (named after the subject). In each folder, **`00-REVIEW-INPUT.md` is the one file to give ChatGPT and Gemini.** It holds everything for an in-depth review of that whole subject:

- **A.** the reviewer instructions (back-bencher prompt) plus in-depth parts: a gap table of at least 80 rows, the full plan chapter by chapter, a check of **every** PYQ (chapter, concept, trap, is the official key right, is the text mis-transcribed), more question ideas per lesson, what is missing, and weights;
- **B.** the subject's contents: syllabus lines, the app's chapters, the PYQ statistics by topic;
- **C.** **all** the subject's PYQs with full text and the official key.

## Click-by-click

1. In VS Code, open `docs/study-materials/v2/<subject>/00-REVIEW-INPUT.md`.
2. Press `Ctrl+A`, then `Ctrl+C`.
3. Open ChatGPT, start a **new chat**, press `Ctrl+V`, send. If it says the text is too long, attach the file and write "Follow the instructions inside the file".
4. If the reply stops part-way it will say "CONTINUE FROM CHAPTER n". Reply "continue" until it finishes.
5. Copy the whole reply into a new file in the same subject folder: `chatgpt-review-<subject>.md`.
6. Repeat 3 to 5 in a **new Gemini chat**, saving as `gemini-review-<subject>.md`.
7. Tell me the subject is done. I merge the two replies (both-agree items accepted, single-source items checked), write the subject's full plan and contents, and keep all of it in that folder.

| Order | Subject folder | Questions | File size |
|---|---|---|---|
| 1 | `programming-and-data-structures/` (round 2: contents v3 with exact tags) | 99 | 85 KB |
| 2 | `theory-of-computation/` | 77 | 50 KB |
| 3 | `operating-systems/` | 78 | 60 KB |
| 4 | `computer-networks/` | 76 | 58 KB |
| 5 | `algorithms/` | 73 | 53 KB |
| 6 | `databases/` | 72 | 55 KB |
| 7 | `computer-organisation/` | 72 | 56 KB |
| 8 | `discrete-mathematics/` | 75 | 48 KB |
| 9 | `digital-logic/` | 69 | 44 KB |
| 10 | `compiler-design/` | 55 | 44 KB |
| 11 | `probability-and-statistics/` | 31 | 25 KB |
| 12 | `linear-algebra/` | 30 | 22 KB |
| 13 | `calculus/` | 18 | 14 KB |
| 14 | `quantitative-aptitude/` | 53 | 33 KB |
| 15 | `analytical-aptitude/` | 49 | 32 KB |
| 16 | `verbal-aptitude/` | 33 | 25 KB |
| 17 | `spatial-aptitude/` | 15 | 14 KB |

Notes: figures are not in the files (each such question says "HAS A FIGURE"); chapters other than P&DS are matched to PYQs by bank topic label, so the reviewer is asked to place each PYQ in its real chapter.

## Common documents (stay in this folder)

`00-README.md`, `00-HONEST-REVIEW.md`, `01-MASTER-PROMPT.md` (how every topic is written), `02-REVIEWER-PROMPT.md` (the reviewer prompt, already inside each input).
