# PYQ Extraction Handbook (start here in a new chat)

This is the single source of instructions for extracting official GATE previous-year questions
(PYQs) into GATE OS. A new Claude session should read this whole file, then
`scripts/pyq/README.md` and `docs/PYQ_ACQUISITION_STRATEGY.md`, then continue from **§9 Status**.

**Opening prompt for a new chat:**
> Read `D:\0-UI\r2ma-stable\docs\PYQ_EXTRACTION_HANDBOOK.md` fully and continue the PYQ extraction from its Status section. Follow every rule in it.

---

## 1. Why this matters

- GATE OS is a GATE exam-prep app: Next.js on Cloudflare Workers via OpenNext, with Supabase. It lives in `D:\0-UI\r2ma-stable`.
- The PYQ bank is the product's core content. Students practise on it, mock tests are built from it, and the AI explanations and analytics are keyed on it.
- **One wrong digit, sign, option or answer is a real harm.** A student learns a wrong fact or loses trust in the app. Accuracy beats speed, every time.
- The user's standard is "accurate and precise, every detail checked".

## 2. Hard rules (non-negotiable)

1. **Claude does the extraction itself.** Do not use Gemini or any other model API to read papers or answer keys; the user explicitly rejected this. Claude reads each page image (Read tool on the PNG) together with the page's PDF text layer and writes the JSON by hand.
2. **Official sources only.** Use only the question papers and keys from `gate2027.iitm.ac.in/download` and the official bulk archive. Never use coaching sites, memory, or "the usual answer".
3. **Transcribe verbatim.**
   - Never solve, simplify, fix grammar, fix typos, or reorder anything. Official quirks stay as printed, for example "complimentary error function", "homogenous", "2 mark Each".
   - Where the text layer is wrong, the page image wins. Real example: the EC_2026 Q23 text layer says `I(t) = q(t)`, but the image shows `qδ(t)`.
4. **Never guess.** If something is unreadable, add `"uncertain": "<reason>"` to the question. Do not invent text. Never write a question's text from memory; always print its text layer first.
5. **Answers come only from the official key** (`keys.py`); the transcription contains no answers.
   - MTA ("marks to all") stays MTA.
   - Keys read from a scan (the 2021 key is an image) must be read by Claude from the image and are flagged for user confirmation.
6. **One JSON per branch**: `data/pyq/<BR>/gate_<br>_pyqs.json`. Never an aggregated file.
7. **The official PDFs stay in per-branch folders** at `data/pyq/official_pdfs/<BR>/<paper>/`. They are git-ignored and re-downloadable; `manifest.json` records each file's URL and SHA-256.
8. **Two-shift years.** A two-shift year becomes two papers, `CE_2026_S1` and `CE_2026_S2`, with question IDs like `GATE_CE_2026_S1_Q7`.
   - CE has CE1/CE2 from 2023.
   - The merged 2021/2022 CE, ME and CS files may hold two shifts.
   - Always check the page count and the "Q.1" restarts.
9. **Budget is ₹0.** Use no paid tools or APIs.
10. **Repo rules:**
    - Commit as you go and push to `main` once per batch; the push auto-deploys.
    - The repo mixes CRLF and LF. Scripted edits must detect the file's newline style and assert that each replacement happened.
    - **Bash heredocs mangle backslashes on this machine.** Write any file containing TeX or regex with the Write/Edit tools, or put a Python patch script in the scratchpad.
    - At the end of every turn, update `checklist.md` and list the next items for the user.
    - Give the user click-by-click steps for anything they must do.

## 3. Folder layout

| Path | What | Git |
|---|---|---|
| `data/pyq/official_pdfs/<BR>/<pid>/<pid>_question_paper.pdf`, `_answer_key.pdf`, `manifest.json` | Official files | ignored |
| `data/pyq/_work/<BR>/<pid>/pages/pNNN.png` (300 dpi) + `pNNN.txt` (text layer) | Page renders | ignored |
| `data/pyq/_work/<BR>/<pid>/regions.json`, `regions/pNNN_rK.png` | Detected figure regions | ignored |
| `data/pyq/_work/<BR>/<pid>/key.json` | Parsed official key | ignored |
| `data/pyq/_work/<BR>/<pid>/questions.json`, `validated.json` | Merged transcription and validation results | ignored |
| **`data/pyq/<BR>/transcriptions/<pid>/b01.json …`** | **Claude's transcription (source of truth)** | **tracked** |
| `data/pyq/<BR>/images/<pid>/07_1.png` | Figure crops (app naming) | tracked |
| `data/pyq/<BR>/reports/<pid>.md` | Validation report | tracked |
| `data/pyq/<BR>/reviews/<pid>.json` | User's review decisions | tracked |
| `data/pyq/<BR>/gate_<br>_pyqs.json` | The branch bank | tracked |

Branches in scope: EC, EE, ME, CE, DA (CS already exists in the app).
Years: 2021–2026 from the download page, then 2017–2020 from the bulk archive.

## 4. Pipeline, per paper

```bash
cd D:/0-UI/r2ma-stable
python scripts/pyq/fetch.py EC                 # once per branch: download + manifest
python scripts/pyq/keys.py EC                  # all keys of the branch -> _work/.../key.json
# page renders + text layers (extract.py step 1 only; its Gemini passes are retired):
python - <<'EOF'
import fitz,sys; sys.path.insert(0,'scripts/pyq')
from common import WORK,pdf_path; from extract import norm
code,pid='EC','EC_2025'; d=fitz.open(pdf_path(code,pid,'qp')); w=WORK/code/pid/'pages'; w.mkdir(parents=True,exist_ok=True)
for i,p in enumerate(d,1):
    p.get_pixmap(dpi=300).save(str(w/f'p{i:03d}.png')); (w/f'p{i:03d}.txt').write_text(norm(p.get_text()),encoding='utf-8')
EOF
python scripts/pyq/regions.py EC --paper EC_2025   # figure regions from the PDF's drawings/images
# ... Claude transcribes -> data/pyq/EC/transcriptions/EC_2025/b01.json ... (see §5)
python scripts/pyq/crop.py EC --paper EC_2025      # merge batches + cut figures (300 dpi)
python scripts/pyq/validate.py EC --paper EC_2025  # every gate -> reports/EC_2025.md
python scripts/pyq/build.py EC                     # -> data/pyq/EC/gate_ec_pyqs.json
```

Tagging (subject, topic, difficulty) is still to do: `tag.py` uses Gemini and must be replaced by Claude tagging against `data/pyq/<BR>/syllabus.json` (see §8).

## 5. How to transcribe (the core work)

Work **5–10 questions per batch file** (`b01.json`, `b02.json` …). For each page:

1. Print the text layer:
   ```bash
   sed 's/Organizing Institute.*//' data/pyq/_work/EC/EC_2025/pages/p0NN.txt
   ```
2. Print that page's regions from `regions.json`.
3. **View the page PNG with Read** whenever the page has any maths, fractions, matrices, vectors, superscripts or subscripts, overbars, Greek letters, tables or figures. That is most technical pages. The text layer flattens maths: `n2 2n` could be n²/2ⁿ or anything else; only the image tells you.
4. Write the question in this shape:

```json
{"qno": 12, "pages": [12],
 "question_text": "A surface is given by \\(z^2 = 2x^2 - y^2\\) ...\nWhich of the following ...?",
 "options": [{"option_id": "A", "text": "\\(\\hat{\\imath} - \\sqrt{2}\\,\\hat{k}\\)"}, ...],
 "figures": [{"placeholder": "IMAGE_Q_12_1", "page": 12, "regions": ["p012_r1"]}]}
```

### Text and LaTeX conventions (match the existing CS bank)

- Inline maths goes in `\( … \)`. A displayed equation on its own line goes in `\[ … \]`. Never use `$`.
- In JSON every backslash is doubled: `\\(`, `\\frac`.
- Paragraph breaks are `\n`.
- **Tables are cropped as images, never typed** (user decision, 30 Sep 2026). Put a placeholder `[IMAGE_Q_07_1]` where the table sits and use the table shortcut:
  `{"placeholder": "IMAGE_Q_07_1", "page": 7, "table": [y_top, y_bottom], "grow": false, "pad": [3, 3, 3, 3]}`.
  `crop.py` unions the table's ruled lines inside that vertical band (in PDF points). To get the band, print word positions:
  `page.get_text("words")` for the first and last cell text, then add a margin of about 15 pt. Eye-check the crop.
- **The same applies to anything hard to type faithfully** (user decision): complex layouts, multi-line aligned derivations, truth tables or K-maps, timing diagrams, and graphics inside options. Crop them, don't rebuild them.
  - Ordinary maths (fractions, matrices, vectors, integrals) stays LaTeX: it is searchable, and it is verified by MathJax plus the text-layer check.
  - When a crop replaces text, the words and numbers inside it are excluded from the text-layer check automatically (figure-label exclusion). So the visual check of that crop is the accuracy check: look at it carefully.
- NAT blanks are written `________`, and "(rounded off to two decimal places)" is kept verbatim.
- Units stay as plain text outside maths: `\(V_{CC} = 12\) V`, `60 μA`, `1 kΩ`. Degrees: `\(90^\circ\)`.
- Useful notation:
  - Vectors `\vec{w}`; unit vectors `\hat{\imath}`, `\hat{\jmath}`, `\hat{k}`.
  - Complements `\bar{x}`; derivatives `\dot{x}`; matrices `\begin{bmatrix} … \end{bmatrix}`.
  - Stacked fractions `\dfrac{…}{…}`; slash fractions as printed (`q/C`, `1/3`).
  - Hex numbers `\((2500)_H\)`; decimal numbers `\((47)_{10}\)`.
- Keep printed style: if the paper shows `63/π Hz < B < 64/π Hz` as plain text, keep it that way.
- Omit headers and footers, "Q.11 – Q.35 Carry ONE mark Each", and page numbers.

### Options

- MCQ and MSQ have exactly A–D. NAT has `"options": []`.
- The question type comes from the key, so check it before writing the options.
- An option that is itself an image has the text `[IMAGE_Q_07_A]` plus a figure entry with that placeholder.

### Figures (placeholder `[IMAGE_Q_NN_k]`, NN two-digit)

- Put the placeholder exactly where the figure appears on the page. Look at the image: figures often come *after* the final question sentence.
- Map it to region ids from `regions.json`. Several regions can make one figure (union); for example, the P/Q/R/S candidate grids.
- `crop.py` automatically **grows the crop to include text labels** that touch the figure, such as R(s), V_o and +V_DD. The per-figure knobs are:
  - `"pad": [l, t, r, b]` in points (default 4). A negative value trims; use it when the table's vertical rule shows at the left edge. Use a large bottom pad to include a caption such as `v_i(t) = 12 sin(ωt)`.
  - `"grow": false`: turn off label growth when it swallows a body-text line. This is needed for raster figures and for figures sitting right under a sentence.
  - `"rect": [x0, y0, x1, y1]`: explicit crop in PDF points, when no region fits.
- **After every crop run, open every new crop image with Read.** Check:
  - no body text inside it;
  - no table rules;
  - no cut labels;
  - the whole figure is present.

  EC_2026 needed fixes on Q9, Q10, Q17, Q18, Q19, Q31, Q35, Q47, Q50 and Q59. The eye check is mandatory.
- Junk regions (logos, for example p001 and p008 in EC_2026) are simply not referenced.

## 6. Validation gates (`validate.py`)

A question enters the bank only with zero flags or after user approval in review. The gates:

- **presence:** Q1–65 are all present.
- **key:** the official key row exists, and type, marks and section come from the key.
- **options:** A–D for MCQ/MSQ, none for NAT, none empty.
- **images:** placeholders ↔ figure entries ↔ crop files, each at least 40 px.
- **maths:** every `\( \)` and `\[ \]` segment compiles in MathJax (`tex-check.mjs`, the same engine the app uses), and the delimiters balance.
- **text layer:**
  - Words (3+ letters) and numbers of the official text layer must appear in the transcription.
  - Figure labels on the same page are excluded.
  - Glued maths (`vbe` ↔ `V_{BE}`, `104` ↔ `10^{4}`) is tolerated.
  - A flag here usually means a dropped line or a wrong number, so investigate it; never silence it.
- **key renumbered / key from scan:** always flagged for the user to confirm.

When a flag is checker noise (a new pattern of glued maths, say), fix the checker generally and re-run. Never edit a transcription just to satisfy the checker.

## 7. Rendering check (the user requires this)

Compiling in MathJax is necessary but not sufficient. Before shipping a branch:

0. **Automated first:** `npx tsx scripts/pyq/render-check.ts EC` runs every question through the app's own parser (`normalizeQuestion` → AST). Every placeholder must become an image node and every maths segment a LaTeX node, with no raw tokens left in text; NAT ranges must parse. It must print `65/65 render-clean` for each paper (EC_2026 does).
   - Crops are named in the app's convention: `07_1.png`, `07_A.png`.
   - **App integration gap:** `ImageResolver` and the image manifest are keyed by `year-shift` only (`public/images/2026-FN/`). Before EC goes live, the app needs branch-scoped keys such as `EC/2026`, or EC images will collide with CS. That is a Release 8 app change; do not rename the data for it.
1. Load the built questions into the app's question renderer (the practice page, or a local test page) and eyeball a sample. Always include every question with a table, a matrix, `\dfrac`, an overbar or an image. Use desktop and mobile, each in light and dark mode (the standing test matrix).
2. Known risks to verify:
   - Markdown tables: none should exist any more, because tables are images. (The app's markdown-table parser has an open bug, noted in memory as `project_ui_ux_pass_state`.)
   - `________` blanks being read as a markdown rule or emphasis.
   - `_` and `*` in text outside maths.
3. Images: `images_required` must resolve to files served by the app.
4. Record anything broken in `checklist.md` and fix the renderer, not the data, unless the data is wrong.

## 8. Tagging (not yet implemented; do after transcription)

- Parse the official syllabus with `tag.py`'s `parse_syllabus` into `data/pyq/<BR>/syllabus.json`. GA uses the fixed taxonomy.
- Claude assigns section, subject, topic and difficulty per question **from the closed syllabus list only**, and writes `_work/<BR>/<pid>/tags.json` as `{"12": {"section": …, "subject": …, "topic": …, "difficulty": "easy|medium|hard"}}`.
  - Better: keep a tracked copy at `data/pyq/<BR>/tags/<pid>.json` and point `build.py` at it.
- Remove the Gemini call from `tag.py`.

## 9. Status (30 Sep 2026)

| Branch | Papers fetched | Keys | Transcribed | Validated | In bank |
|---|---|---|---|---|---|
| EC | 2021–2026 | all pass (2021 read from a scan with Gemini → **re-read by Claude**; MTA at Q19 and Q36 to confirm) | **2026 done** | 2026: 65/65 | 2026 (untagged) |
| EE, ME, CE, DA | not yet | – | – | – | – |

Done for EC_2026:
- 7 batches.
- 27 figures, each eye-checked.
- Commits `1ad479d` and `16ceee1` (not pushed yet: push with the next batch).

Superseded: `extract.py` passes A and B (Gemini) and the files `_work/EC/EC_2026/pages/*.pass_a.json`. Ignore them.

## 10. Next steps, in order

1. The §7 rendering check on EC_2026 in the app (Q7's table is now an image).
2. Re-read the EC 2021 answer key from the scan yourself and replace the Gemini-read key. Confirm with the user.
3. Tagging (§8) for EC_2026.
4. EC 2025 → 2021, one paper at a time: render, regions, transcribe, crop, eye-check, validate, build, commit.
5. EE, ME, CE (two shifts!), DA: fetch, then as above.
6. 2017–2020 from the bulk archive (check the link naming and shifts per year).
7. After each branch: push, update `checklist.md`, tell the user what is next.

## 11. Quality bar, in one line

Every character matches the official PDF. Every figure is clean and complete. Every answer comes from the official key. Every question is validated, and rendered correctly in the app.
