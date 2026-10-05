# RENYXERA (GATE OS): handover and new-PC setup

**Written:** 2 October 2026
**Purpose:** use this file to start a new Claude Code session, on this PC or a fresh one, with no prior context. Part A sets up a clean Windows machine. Part B is the master prompt to paste into Claude. Part C is the project background. Part D is the exact state of the current work.

---

## Part A: set up a brand-new Windows PC (you have only VS Code)

Do these steps in order. Each step ends with a check you can run.

### A1. Install Git

1. Go to https://git-scm.com/download/win and download the 64-bit installer.
2. Run it and keep every default, with two exceptions:
   - "Default editor": pick **Use Visual Studio Code**.
   - "Line ending conversions": pick **Checkout as-is, commit as-is**. The repo deliberately mixes CRLF and LF, so Git must not rewrite them.
3. Check: open a **new** VS Code terminal (Terminal → New Terminal) and run `git --version`.
4. Tell Git who you are:
   ```
   git config --global user.name "Adil Awais Khan"
   git config --global user.email "<your GitHub email>"
   git config --global core.autocrlf false
   ```

### A2. Install Node.js (version 24)

1. Go to https://nodejs.org and download the **LTS** Windows installer. The old PC runs v24.14.0; any v24.x works.
2. Install with the defaults. Leave the "Tools for native modules" box unticked.
3. Check: `node -v` (should show v24…) and `npm -v`.

### A3. Install Python (version 3.12 or newer)

1. Go to https://www.python.org/downloads/windows/ and get the latest 3.x installer. The old PC runs 3.14.
2. On the first screen, **tick "Add python.exe to PATH"**, then click Install Now.
3. Check: `python --version`.
4. Install the one library the PYQ pipeline needs:
   ```
   python -m pip install pymupdf
   ```
   This provides the `fitz` module. Everything else in the pipeline uses the standard library.

### A4. Install the GitHub CLI and log in

1. Go to https://cli.github.com and install it.
2. Run `gh auth login` and choose: **GitHub.com → HTTPS → Yes (authenticate Git) → Login with a web browser**. Copy the one-time code, press Enter, paste the code in the browser and approve.
3. Check: `gh auth status`. It must show the account that owns **justforpersonal7771-design/RENYXERA**.

### A5. Clone the repo

The old PC used an SSH alias (`github-personal`). On the new PC use HTTPS instead; it works straight after `gh auth login`.

```
mkdir D:\0-UI
cd D:\0-UI
git clone https://github.com/justforpersonal7771-design/RENYXERA.git r2ma-stable
cd r2ma-stable
npm install
```

Keep the same path, `D:\0-UI\r2ma-stable`. The docs and memory notes refer to it. Then open the folder in VS Code (File → Open Folder → `D:\0-UI\r2ma-stable`).

### A6. Recreate `.env.local` (secrets: never paste them into chat)

`.env.local` is not in git. Copy `.env.example` to `.env.local` and fill in the values yourself, either from the old PC's `.env.local` (move it by USB or a password manager, not by chat or email) or from the dashboards:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Supabase → your project → Project Settings → API.
- `SUPABASE_SERVICE_ROLE_KEY`: same page. **Server only.**
- `GEMINI_API_KEY`: aistudio.google.com → Get API key. **Server only.**
- Turnstile keys and anything else listed in the old `.env.local`.

**Easiest route:** copy the whole `.env.local` file from the old PC to `D:\0-UI\r2ma-stable\.env.local`.

**Check:** run `npm run dev`, then open http://localhost:3000. The site should load and you should be able to log in.

### A7. Re-download the PYQ source files (not in git; large and reproducible)

```
python scripts/pyq/fetch.py EC
python scripts/pyq/render.py EC --paper EC_2022
python scripts/pyq/regions.py EC --paper EC_2022
python scripts/pyq/render.py EC --paper EC_2021
python scripts/pyq/regions.py EC --paper EC_2021
```

These rebuild the following folders:

- `data/pyq/official_pdfs/`
- `data/pyq/_work/EC/<paper>/pages/*.png` (the page images Claude reads)
- the text layers and regions

If `fetch.py` fails for a year, copy `data/pyq/official_pdfs/` and `data/pyq/_work/` from the old PC instead.

### A8. Install Claude Code

1. In VS Code, open Extensions (Ctrl+Shift+X), search **"Claude Code"** (publisher: Anthropic) and install it.
2. Click the Claude icon in the sidebar and sign in with your Claude account.
3. Optional, terminal version: run `npm install -g @anthropic-ai/claude-code`, then run `claude` inside the repo folder.
4. **Restore Claude's memory notes.** They are in the repo under `docs/claude-memory/`. Copy them to:
   ```
   C:\Users\<you>\.claude\projects\D--0-UI-r2ma-stable\memory\
   ```
   Open the repo once in Claude Code first, so that the `projects\…` folder exists. Check the exact folder name it creates, then paste the files in. If you skip this step, the master prompt below tells Claude to read them from `docs/claude-memory/`.

### A9. Optional tools

- **Playwright browsers** (for e2e tests only): `npx playwright install chromium`.
- **Wrangler** (Cloudflare) is already a dev dependency. You need `npx wrangler login` only if you deploy manually. Normally, pushing to `main` deploys through GitHub Actions.

---

## Part B: master prompt (paste this as the first message in the new session)

```
You are continuing development of RENYXERA (GATE OS), a GATE exam-prep web app.
Repo: D:\0-UI\r2ma-stable (GitHub: justforpersonal7771-design/RENYXERA, branch main).

Before doing anything, read in this order:
1. HANDOVER_NEW_PC.md (this handover - parts C and D)
2. docs/claude-memory/*.md (my standing rules; save them into your memory dir if not already there)
3. docs/PYQ_EXTRACTION_HANDBOOK.md and scripts/pyq/README.md (the PYQ pipeline rules)
4. checklist.md (status of every module)

Standing rules:
- Budget is ₹0: free tiers only. Never ask me to paste secrets in chat.
- Commit as you go. Push to main once per batch (a push auto-deploys to production via GitHub Actions after checks).
- The repo mixes CRLF/LF. Scripted edits must match each file's style.
- Bash heredocs strip backslashes. Write TeX/regex with the Write/Edit tools only.
- PYQs are transcribed by you (Claude) from the page images + text layer. Never Gemini. Accuracy over speed. Always verify maths against the page image, not just the text layer.
- Tables and hard figures go in as images.
- For anything I must do by hand (dashboards, secrets), give numbered click-by-click steps and wait for me to confirm.
- At the end of every turn: update checklist.md and list the next items.

Current task: the multi-branch PYQ extraction pipeline (see HANDOVER_NEW_PC.md part D).
Resume EC 2022 at Q36, then EC 2021, then EC subject/topic tagging, then EE, ME, CE, DA.
```

---

## Part C: project background

### The product

**RENYXERA** is a free GATE preparation platform. Live at https://gate.renyxera.workers.dev, it offers:

- an official-PYQ bank, practice and full mock tests with server-side grading;
- AI hints and explanations (Gemini, server-side, with a per-user quota and a shared cache);
- analytics and rank or score calibration from official marks-to-AIR data;
- leaderboards, All-India mocks, protected offline downloads, cloud sync, and a content and SEO engine.

It launched with **GATE CSE**, which has 975 questions from the existing file `data/Aggregated_Output.json`. Other branches show "Coming Soon" until their data passes the launch gate (checklist module 8C).

### Stack

- **App:** Next.js 15 (App Router), React 19, Tailwind 4, Zustand, MathJax (`better-react-mathjax`), Recharts and Motion.
- **Hosting:** Cloudflare Workers via OpenNext (`wrangler.jsonc`, `open-next.config.ts`).
- **Data:** Supabase Postgres, Auth and Row Level Security (`supabase/migrations/`). Cloudflare Turnstile protects the auth forms.
- **CI and automation:** GitHub Actions in `.github/workflows/`.
  - `ci.yml` runs the checks, then deploys on a push to main.
  - `pregen` fills the AI cache every 30 minutes.
  - A weekly database backup is encrypted with GPG.
- **Monitoring:** Sentry and Cloudflare Web Analytics.

### Constraints and decisions

- ₹0 budget. Paid items wait in "Backlog (paid)" until the app earns money. The custom domain is also deferred.
- Next.js hot reload already works. Do not migrate to Vite.
- Security first, then retention, then money. The execution order is at the top of `checklist.md`.

### Key documents

| File | What it holds |
|---|---|
| `RENYXERA_Master_Plan_Auth_Security_Monetization.md` | Full plan and rationale, module by module |
| `checklist.md` | Status of every deliverable (source of truth for progress) |
| `docs/TECHNICAL_REFERENCE.md` | Architecture and operations runbook |
| `docs/PYQ_ACQUISITION_STRATEGY.md`, `docs/PYQ_EXTRACTION_HANDBOOK.md`, `scripts/pyq/README.md` | PYQ pipeline |
| `docs/CONTENT_STRATEGY.md`, `docs/MARKETING_STRATEGY.md`, `BUGS.md` | Content plan, marketing plan, known bugs |
| `docs/claude-memory/` | Claude's saved rules and lessons from earlier sessions |

### Agreed for the later "branching" release (in the checklist, not built yet)

- Users see and access only their own branch.
- Users may switch branch freely and switch back. Progress is kept per branch, with no data loss.

---

## Part D: exact state of the current work (multi-branch PYQ pipeline)

### Output format (agreed)

The branch JSON is `data/pyq/<BRANCH>/gate_<branch>_pyqs.json`. It uses the same structure as the CS file `data/Aggregated_Output.json`: a top-level list of `{ "exam_metadata": { "year-shift": "2024" }, "questions": [...] }`.

- For EC, `year-shift` is just the year.
- In marks-to-all (MTA) questions, every option is marked `is_correct`.
- Provenance and review status go in `gate_<branch>_pyqs.meta.json`.

### Pipeline (per paper)

1. **Render pages:** run `render.py`, which writes page PNGs and the text layer.
2. **Find figures:** run `regions.py`, which writes the figure regions.
3. **Transcribe:** Claude writes `data/pyq/EC/transcriptions/<paper>/bNN.json`, about 10–15 questions per file.
4. **Crop figures:** run `crop.py`.
5. **Validate:** run `validate.py`, which checks the answer key, the text layer and MathJax.
6. **Build the bank:** run `build.py EC`.
7. **Check rendering:** run `npx tsx scripts/pyq/render-check.ts EC`, which runs the app's own parser over the bank.

### Transcription format

- **Maths:** `\( \)` for inline maths and `$$ $$` for display maths.
- **Image placeholders:** `[IMAGE_Q_07_1]` in the stem and `[IMAGE_Q_07_A]` in an option.
- **Figure specs:** each figure is given in one of three ways:
  - `regions:["p019_r1"]`
  - `rect:[x0,y0,x1,y1]` in PDF points, with `grow:false` and `pad:[0,0,0,0]`
  - `table:[y0,y1]`
- **Converting page coordinates to points:**
  - A4 papers: 1 display px of a 1414×2000 page image ≈ 0.421 pt.
  - 2022 papers (US Letter): 1 display px of a 1546×2000 image ≈ 0.396 pt.
- **Ignore** the small regions at x≈90–136. They are side boxes.

### Progress

| Paper | State |
|---|---|
| EC 2026, 2025, 2024 | ✅ 195/195 in the bank, render-clean, pushed |
| EC 2023 | ✅ 65/65 validated, 39 figures. Committed. **Not yet in the bank, docs or checklist status** (run build.py and update the docs) |
| EC 2022 | ✅ 65/65 in bank (325 total). Old note: 🟨 Q1–35 transcribed (`b01`–`b03`, Q21–35 not yet validated). **Next: Q36–65, pages p030–p054.** Q36 and Q37 were read (p030), along with Q39 (p032) and Q41 (p034). Q38, Q40 and Q42 onward still need reading. |
| EC 2021 | ⬜ The PDF is **scanned, with no text layer** (39 pages). Transcribe from images only, and expect validator flags because the text-layer check is missing. Key: `data/pyq/EC/keys_manual/EC_2021.tsv`. Q19 and Q36 are marks-to-all. |
| EC tagging | ⬜ Claude tags subject and topic from `EC_GATE2027_syllabus.pdf` (`tag.py` still calls Gemini and must be replaced) |
| EE, ME, CE, DA | ⬜ Same pipeline after EC |

### Gotchas already learned

- **Trust the page image over the text layer.**
  - EC 2022 Q18: the text layer drops a minus sign (the pMOS threshold is −1 V).
  - EC 2022 Q25: the PDF loses an exponent glyph (it should read `e^{(\xi x+\eta y)}`).
- **The 2022 header may trip `validate.py`.** "GATE 2022 Electronics and Communications Engineering (EC)" and "Organised by Indian Institute of Technology Kharagpur" may need adding to its strip regex if it flags them.
- **2024 pages carry a watermark,** so use explicit `rect` crops.
- **Table rules can leak into crops.** If a crop shows a table rule, tighten `pad`, for example `[-3,4,4,4]`.
