# RENYXERA (GATE OS): handover to the new PC

**Updated:** 18 October 2026. Start here. This folder contains everything the next session needs.

| File | What it is |
|---|---|
| `HANDOVER.md` | this file: state of the project, what to do first, how things run |
| `01-NEW-PC-SETUP.md` | step-by-step Windows setup (Git, Node 24, Python, GitHub CLI, clone, `.env.local`, Claude Code). Written 2 Oct; still correct. Skip its old "master prompt" part: use the one below |
| `MASTER_PROMPT_Release4_and_future.md` | the long master prompt (Release 4 and future releases): product vision, plans, security, growth. Reference for big-picture decisions |
| `memory/` | Claude's standing notes (rules and project state). Copy every `.md` into the new Claude memory folder (see "Memory" below) |

## 1. First message to paste into Claude Code on the new PC

```
You are continuing development of RENYXERA (GATE OS), a GATE exam-prep web app.
Repo: D:\0-UI\r2ma-stable (GitHub: justforpersonal7771-design/RENYXERA, branch main).
Read, in this order: handover/HANDOVER.md, handover/memory/MEMORY.md and the notes it lists (my standing rules),
checklist.md (the single list of open work), docs/README.md (what each doc is).
Then continue with the first unchecked item in checklist.md section 2, and follow the rules in the memory notes
(commit as you go, push once per batch, click-by-click steps for anything I must do, test matrix desktop+mobile x light+dark,
update checklist.md at the end of every turn and list the next items).
```

## 2. Memory (how to restore it)
1. Open the repo once in Claude Code so it creates its project folder: `C:\Users\<you>\.claude\projects\D--0-UI-r2ma-stable\` (check the exact name).
2. Create a `memory` folder inside it and copy all files from `handover/memory/` there. `MEMORY.md` is the index.

## 3. What the product is (short)
RENYXERA: GATE preparation web app (Next.js on Cloudflare Workers via OpenNext, Supabase, Razorpay live, Gemini for AI). Zero-budget: everything on free tiers. Live site: https://gate.renyxera.workers.dev. Branches live: CS, ECE, EE, ME, Civil, DA. Plans: Free, Plus (INR 29/mo), Pro (INR 99/mo); Forge (GATE-level practice) is limited on Plus, full on Pro, none on Free. Pushing to `main` auto-deploys through GitHub Actions after checks.

## 4. State on 18 Oct 2026
- **PYQ banks:** all six branches live. The CS bank (`data/Aggregated_Output.json`) is verified against the official papers 2017-2026 (keys and wording). Fix tool: `scripts/pyq/patch-cs.py`. After bank edits run `node scripts/seed-questions.mjs` and `node scripts/copy-static-data.mjs`.
- **Public PYQ pages:** "Check the official answer" works for any branch (`/api/answers` with `public_pyq: true`, single question).
- **Telegram:** hub channel gets only updates (`scripts/telegram-hub.mjs`, `.github/workflows/telegram-hub.yml`); each branch channel gets its own daily question with the answer as a tap-to-reveal spoiler (`scripts/telegram-daily.mjs`, `telegram-daily.yml`, matrix over CS/EC/EE/ME/CE/DA using secrets `TELEGRAM_CHANNEL_<CODE>`). Docs: `docs/TELEGRAM_MULTI_BRANCH_AND_SEO.md`, `docs/telegram-premium/`. Folder link: https://t.me/addlist/fY_dvTl36FA3ZTQ1. Forge posting to channels is not built yet.
- **Website SEO:** home title/description/Organization JSON-LD (`app/layout.tsx`, `lib/social.ts`), branch pages with channel links and FAQ, footer links, social cards `public/og/*` made by `python scripts/make-og.py` (fonts in `scripts/fonts/`; branch logos from `logo/`). Final card style is approved (Bricolage ExtraBold title, DM Serif branch name, Sora chips, JetBrains Mono URL).
- **Share card:** `components/growth/share-card.tsx` (in the profile referral card): optional name, username, student ID and avatar, each only if ticked; glass sender bar. Not browser-tested.
- **Instagram:** publisher built (`scripts/social-publish.mjs`, `social-publish.yml`, `social-check.yml`, `content/calendar.json`). The user still has to complete `docs/instagram/01-SETUP.md` (Meta app, token, `IG_USER_ID` and `IG_ACCESS_TOKEN` secrets).
- **Promo film (Remotion, `video/`):** v8 landscape 4K is at `video/out/renyxera-film-v8-4k.mp4` (not committed; large). Vertical cut was rendering (`renyxera-film-v8-vertical-1080.mp4`, `-4k.mp4`) with bundle `video/.bundle2` (rebuild with `npx remotion bundle src/index.ts --out-dir .bundle2`). Render commands: `npx remotion render .bundle2 FilmVertical out/<name>.mp4 --codec=h264 --crf=22 --concurrency=4`. Film is not yet watched end to end by the user; user will upload to YouTube and send the video id so `NEXT_PUBLIC_PROMO_YT_ID` can be set (click-to-play poster already built).
- **Study materials:** separate paid product, plan in `docs/study-materials/` (00-12). `docs/study-materials/notes/` holds the user's reference PDFs (copyrighted, git-ignored, never copy from them). Waiting for the user's six decisions (`00-README.md`).
- **Docs organisation:** `checklist.md` = open items only; finished work in `archive/`; `docs/README.md` indexes docs.

## 5. Open work, in order (also in checklist.md)
1. Finish and check the vertical film renders; make the 1080x1920 file under 50 MB for Instagram; hand over both films.
2. User: Instagram setup, upload film to YouTube, Telegram Premium steps (`docs/telegram-premium/`), per-branch Telegram folders, study-materials decisions, growth tasks, real-phone checks, custom domain.
3. Me after BotFather step: Mini App menu, `/start <branch>` deep links, story-image generator.
4. Forge questions to Telegram branch channels (when Forge generation exists).
5. Study-materials Phase 0 (sample chapter "Deadlock") once the user approves.
6. Optional: film extras, flashcards, phone verification via the Telegram bot.

## 6. Gotchas that cost time before
- Bash heredocs strip backslashes here: write regex/TeX with the Write tool or small Python files, not heredocs (see memory `feedback_backslash_mangling`).
- The repo mixes CRLF and LF: scripted edits must preserve each file's newlines.
- Zero-byte file corruption has happened in the repo folder (see memory `project_file_corruption_pattern`).
- Do not commit: `.env.local`, `data/pyq/official_pdfs/`, `docs/study-materials/notes/`, large renders in `video/out/`.
- Secrets live only in `.env.local` (local) and GitHub Actions secrets (CI). Never paste them in chat.
- Remotion renders are heavy: run them in the background and avoid parallel renders.
- Telegram Premium belongs to the user's account, not the bot.
