# PYQ acquisition master strategy: all branches, 2017–2026

*Owner plan, 30 Sep 2026. Goal: every official GATE question for every branch we launch, with the question, options, images and answer **exactly** right, in the same JSON shape as `data/Aggregated_Output.json`, at ₹0.*

---

## 1. What changed vs the CS process

For CS you gave Gemini Made Easy PDFs, fixed its mistakes by hand, and screenshotted every image yourself. That worked but doesn't scale to 6+ branches (~6,000+ questions), and a coaching PDF isn't the authoritative source.

**Verified today:** the official GATE 2027 site (IIT Madras) publishes, for every paper, both:

| File | Example | What's in it | How we read it |
|---|---|---|---|
| Question paper | `gate2027.iitm.ac.in/static/doc/download/2026/QPs/EC.pdf` | ~1 question per page; real text layer; maths as Unicode italics; figures as vector drawings | Gemini vision (text + LaTeX) **cross-checked** against the PDF text layer; figures cropped automatically |
| Answer key | `.../2026/Keys/EC_Keys.pdf` | Clean table: Q.No, Session, Type (MCQ/MSQ/NAT), Section, Key/Range (`B`, `B;D`, `2.5 to 2.7`), Marks | **Plain table parsing, no AI**, so answers are exact |

- Papers and keys are listed on the site for **2021–2026** for all branches (AE, CE-1/2, CS-1/2, EE, ME, EC, CH, DA, and 30+ more).
- The same page links a **bulk download of question papers 2007–2026** (Google Drive).
- For 2017–2020 keys, use the bulk archive or each year's organising-institute site.

**Principle:** questions and answers come only from **official** files. Coaching PDFs are used at most as a cross-check, never copied (their solutions are their copyright).

---

## 2. The pipeline (per paper, fully scripted)

```
official QP.pdf ──► 1 render pages (300 dpi PNG) + extract text layer
                ──► 2 Gemini vision per page → questions JSON (+ figure boxes)
                ──► 3 auto-crop figures from the page image → PNG files
official Keys.pdf ► 4 parse answer table (no AI) → key per Q.No
                ──► 5 merge + validate (hard gates) → flags
                ──► 6 human review ONLY of flagged questions
                ──► 7 tag subject/topic with the branch's official syllabus
                ──► 8 import: Aggregated_Output-style JSON + images + manifest → Supabase
```

### Step 1: Render and read the text layer (free, exact)
- Tool: PyMuPDF (`fitz`). Render every page at 300 dpi and extract the page text and figure-region candidates (vector drawings and embedded images).
- The text layer is the **ground truth for words and numbers**; the vision model is used for structure and LaTeX.

### Step 2: Vision extraction with a strict schema
- One request per page, Gemini with `responseMimeType: application/json` and a JSON schema. Output:
  - question number, type, marks, question text with LaTeX;
  - options A–D, with LaTeX, or none for NAT;
  - `[IMAGE_Q_xx_n]` / `[IMAGE_Q_xx_A]` placeholders, as in your CS data;
  - **a bounding box for every figure and image-option** (Gemini returns boxes on a 0–1000 scale).
- Prompt rules: copy text verbatim; never solve; never invent options; mark anything unreadable as `"uncertain": true`.
- **Two independent passes:** Flash-Lite then Flash, or the same model with a different prompt. Any disagreement becomes a flag (step 5). This catches most silent errors.

### Step 3: Automatic image cropping (replaces manual screenshots)
- Crop each Gemini bounding box from the 300-dpi page render, snapped to the nearest vector-drawing or embedded-image boundary from step 1, with a small padding.
- Save as `images/<BRANCH>/<YEAR>_<SESSION>/Q_07_1.png`, `Q_07_A.png` and so on, matching the placeholders. `data/image-manifest.json` is updated automatically.
- A contact sheet (all crops of a paper on one page) makes image review a 2-minute glance.

### Step 4: Answer key, deterministically
- `pdfplumber`/PyMuPDF table extraction of the key PDF gives `Q.No → {type, section, key, marks}`.
- Parse `A`, `B;D` (MSQ) and `2.5 to 2.7` (NAT ranges). Handle **"Marks to All" (MTA)** entries.
- The key's type and marks **override** the vision output (official = truth).

### Step 5: Validation gates (automatic; anything failing is flagged, never silently fixed)
| Gate | Rule |
|---|---|
| Count | Question numbers are 1..65 with no gaps or duplicates; total marks = 100; GA = Q1–10 = 15 marks |
| Key join | Every question has exactly one key row; the type matches (MCQ has 1 letter, MSQ ≥1, NAT a range) |
| Options | MCQ/MSQ have exactly 4 options, A–D; NAT has none |
| Images | Every placeholder has a cropped file, and every crop is used; each image is above a minimum size |
| Maths | Every LaTeX string renders with MathJax (headless render test) |
| Text agreement | Vision text vs PDF text layer: normalised similarity ≥ 0.9 per question (catches dropped lines and wrong numbers) |
| Double pass | Pass 1 == pass 2 on numbers, options and placeholders |
| Duplicates | No near-identical question inside a paper |

### Step 6: Human review, only what's flagged
- Expect about 5–15% of questions flagged (mostly heavy maths and figures).
- A local review page shows **the PDF crop next to our rendered question**, with the flag reasons: Approve, Fix text or Re-crop.
- Every fix is written back to the JSON with a note of what changed.
- This replaces reading all 65 questions by hand per paper.

### Step 7: Taxonomy tagging
- Use each branch's **official GATE 2027 syllabus** (like `lib/seo/syllabus.ts` for CS) as a closed list of sections, subjects and topics.
- Gemini assigns subject, topic and difficulty **only from that list**; anything outside it is flagged.
- The weightage pages and the study planner then work for every branch automatically.

### Step 8: Import
- Output exactly the `Aggregated_Output.json` shape (`exam_metadata` + `questions[]`), one file per branch.
- The existing `scripts/seed-questions.mjs` path loads questions, options and answers into Supabase. The answer key stays server-only, as today.
- `branch_code`s: `ECE`, `EE`, `CE`, `ME`, `DA` (already in `lib/branches.ts`).

---

## 3. Scale, cost and timeline (₹0)

| Branch | Papers 2017–2026 (approx.) | Questions |
|---|---|---|
| EC, EE, ME, CE | ~10–16 each (CE/ME had 2 sessions some years) | ~650–1,050 each |
| DA | 2024–2026 only (3 papers) | ~195 |

- Vision calls are about 60 pages per paper × 2 passes, roughly 120 requests per paper.
- On the free Gemini API: about 2 papers a day with Flash, and more with Flash-Lite for pass 1.
- Your **Gemini subscription can't be used by scripts**, but it's ideal for the human-review step: paste a flagged page and ask it to double-check.
- Suggested order, by user demand: **EC → EE → ME → CE → DA**. At ~2–3 papers a day, one branch takes about a week, plus review.
- The AI pre-generation (hints/explanations) shares the same free quota. **Pause it while extracting** (`ai_pregen_control.enabled = false`), or run extraction with a separate free API key from another Google account/project.

---

## 4. Accuracy targets and sign-off per paper

- **Answers:** 100% from the official key (no AI involved).
- **Numbers in questions:** 100% (text-layer agreement gate).
- **Text and LaTeX:** every question passes the render gate. Flagged ones are human-approved.
- **Images:** every placeholder resolved. The contact sheet is reviewed.
- **Sign-off:** a paper goes live only when all gates pass. Each paper's JSON records the source file names and SHA-256 checksums, the extraction date and the reviewer, so every question traces back to the official PDF.

---

## 5. Legal and ethics

- GATE question papers and keys are published officially for practice; we reproduce **official** questions and keys, credited as "GATE <year> <paper>, official question paper & key (<organising institute>)".
- Solutions and explanations are **our own** (AI-drafted, reviewed), never copied from coaching books or PDFs.
- If an institute publishes different wording in the final key (e.g. a question dropped as MTA), the final key wins.

---

## 6. What I build next (in order)

1. `scripts/pyq/fetch.mjs`: downloads a branch's official QPs and keys for chosen years (2021–2026 direct links; older years from the bulk archive folder you download) into `data/raw/<BRANCH>/`.
2. `scripts/pyq/extract.py`: steps 1–3 (render, text layer, two Gemini passes, auto-crop).
3. `scripts/pyq/keys.py`: step 4 (answer table parser, with MTA handling).
4. `scripts/pyq/validate.mjs`: step 5 gates, producing a per-paper report plus a contact sheet.
5. `scripts/pyq/review.html`: step 6 local reviewer (PDF crop | rendered question | fix).
6. A syllabus and taxonomy file per branch, then tagging; then import via `seed-questions`.
7. **Pilot: EC 2026**, one paper end to end. We measure the flag rate and your review time, tune it, then run the rest.

## 7. What I need from you

- Nothing to start: official 2021–2026 files download directly.
- For **2017–2020**: download the "Bulk Download of Question Papers (2007 to 2026)" Google Drive folder from gate2027.iitm.ac.in/download into `D:\0-UI\r2ma-stable\data\raw\bulk\` (I'll give click-by-click steps when we reach those years).
- Confirm the branch order (EC → EE → ME → CE → DA) or change it.
- During review: about 15–30 minutes per paper on flagged questions only.
