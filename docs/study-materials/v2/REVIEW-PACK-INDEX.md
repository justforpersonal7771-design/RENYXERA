# Review packs: which file to give ChatGPT and Gemini, subject by subject

Every subject has its own folder (named after the subject). In each folder, **`00-REVIEW-INPUT.md` is the only file you need to upload or paste**: it already contains the reviewer instructions (the "back bencher" prompt) and the subject's contents draft.

## Click-by-click

1. Open the subject folder in VS Code (left bar → `docs/study-materials/v2/<subject>/`).
2. Open `00-REVIEW-INPUT.md`, press `Ctrl+A`, then `Ctrl+C`.
3. Open ChatGPT, start a **new chat**, press `Ctrl+V`, send. (If the text is too long for the box, attach the file instead and write "Follow the instructions inside the file".)
4. Copy ChatGPT's whole reply into a new file in the **same subject folder** named `chatgpt-review-<subject>.md`.
5. Repeat steps 3 and 4 in a **new Gemini chat**, saving as `gemini-review-<subject>.md`.
6. Tell me which subject is done. I merge the two replies (items both list are accepted, items from one are checked), write the subject's full plan, and move the reviewed documents into that same folder.

Do one subject at a time, in the order below. The order follows marks in the paper and what already has lessons.

| Order | Subject folder | Questions | Marks | Review input |
|---|---|---|---|---|
| 1 | `programming-and-data-structures/` | 99 | 152 | round 2: contents v3 |
| 2 | `theory-of-computation/` | 77 | 121 | v0 |
| 3 | `operating-systems/` | 78 | 126 | v0 |
| 4 | `computer-networks/` | 76 | 118 | v0 |
| 5 | `algorithms/` | 73 | 114 | v0 |
| 6 | `databases/` | 72 | 111 | v0 |
| 7 | `computer-organisation/` | 72 | 115 | v0 |
| 8 | `discrete-mathematics/` | 75 | 113 | v0 |
| 9 | `digital-logic/` | 69 | 103 | v0 |
| 10 | `compiler-design/` | 55 | 85 | v0 |
| 11 | `probability-and-statistics/` | 31 | 51 | v0 |
| 12 | `linear-algebra/` | 30 | 45 | v0 |
| 13 | `calculus/` | 18 | 21 | v0 |
| 14 | `quantitative-aptitude/` | 53 | 86 | v0 |
| 15 | `analytical-aptitude/` | 49 | 70 | v0 |
| 16 | `verbal-aptitude/` | 33 | 45 | v0 |
| 17 | `spatial-aptitude/` | 15 | 24 | v0 |

## What is in each folder

- `00-REVIEW-INPUT.md`: **give this to ChatGPT and Gemini.**
- `01-contents-draft-v0.md`: the contents draft inside the input (also readable on its own): syllabus lines, the app's chapters, the PYQ bank by topic with every question ID.
- After review: the two review files, a `REVIEW-MERGE` note, and the finished plan (plus the book contents with weights, as done for Programming and Data Structures).

## What stays in the common folder

`00-README.md`, `00-HONEST-REVIEW.md`, `01-MASTER-PROMPT.md` (how every topic is written), `02-REVIEWER-PROMPT.md` (the reviewer prompt, already inside each input).
