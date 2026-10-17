# Telegram for every branch, and SEO for Telegram and the website

*Owner guide, 17 Oct 2026. Everything is free. It assumes you have finished `TELEGRAM_SETUP_AND_PROMOTION.md` **up to Part 6**: you already have the main channel, the discussion group, the bot (admin of the main channel), the two GitHub secrets `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHANNEL`, and a successful test post.*

## 0. The plan in one picture

| Room | Link | What it is |
|---|---|---|
| **Main channel** (the one you already have) | your current `t.me/...` | Becomes the **hub**: brand news, mocks, offers, the rotating question of the day. Everyone joins this. |
| **6 branch channels** | `t.me/renyxera_gate_cs`, `_ece`, `_ee`, `_me`, `_ce`, `_da` | Each posts its **own** branch's official PYQ every morning at 08:00 IST. |
| **Discussion group** (the one you already have) | your current `t.me/renyxera_chat` | One group, switched to **Topics** so each branch has its own sub-room. |
| **Folder link** | `t.me/addlist/...` | One tap adds all rooms. This is the link you put in Instagram, YouTube and the website. |

Why not six groups: six half-empty groups feel dead; one busy group with topics feels alive.

If a username is taken, add a letter or digit (`renyxera_gate_cs1`) and write down the final one. Use the same names everywhere below.

## 1. Do this once, in this order (about 40 minutes)

Steps A to C are on your **phone** (Telegram). Step D is on a **laptop** (GitHub). They do not depend on each other after step A, so you can do C and D at the same time.

### Step A. Upgrade the existing main channel into the hub (3 min)
1. Open your main channel, tap its name at the top, tap the **pencil ✏️ (Edit)**.
2. **Name:** `RENYXERA · GATE 2027`.
3. **Description:** `Daily GATE PYQ, free All-India mocks and an AI mentor for CS, ECE, EE, ME, Civil, DA. Practise free: https://gate.renyxera.workers.dev`
4. Do **not** change its username (the `TELEGRAM_CHANNEL` secret depends on it). Tap the tick ✔ to save.

### Step B. Turn the existing discussion group into a topics group (5 min)
1. Open the discussion group, tap its name, tap **✏️ Edit**.
2. **Topics:** switch **on**. Layout: **List**. (It becomes a forum and keeps old messages.)
3. Rename it `RENYXERA · GATE Discussion`.
4. Tap **Permissions**: switch **Send links** off for members. Set **Slow mode** to 10 s.
5. Go back to the topic list and tap **+ New topic** for each of these, in this order, with a different icon colour each: `📣 Start here`, `💬 General`, `❓ Doubts`, `🏆 Mocks & Ranks`, `📅 Study Plan`, `CS`, `ECE`, `EE`, `ME`, `Civil`, `DA`.
6. In **📣 Start here**, send the rules message (section 4) and pin it: long-press the message, **Pin**.

### Step C. Create the six branch channels (about 3 min each, 18 min total)
Repeat for **each row** of this table. Telegram: tap the pencil/compose icon, **New Channel**.

| Name | Public link | Description (paste) |
|---|---|---|
| `GATE CS 2027 · Daily PYQ · RENYXERA` | `renyxera_gate_cs` | `GATE CS & IT 2027: one official PYQ every morning with the answer, topic tips, syllabus and cutoff updates. https://gate.renyxera.workers.dev/gate-cse` |
| `GATE ECE 2027 · Daily PYQ · RENYXERA` | `renyxera_gate_ece` | `GATE ECE 2027: one official PYQ every morning with the answer, topic tips, syllabus and cutoff updates. https://gate.renyxera.workers.dev/gate-ece` |
| `GATE EE 2027 · Daily PYQ · RENYXERA` | `renyxera_gate_ee` | `GATE EE 2027: one official PYQ every morning with the answer, topic tips, syllabus and cutoff updates. https://gate.renyxera.workers.dev/gate-ee` |
| `GATE Mechanical 2027 · Daily PYQ · RENYXERA` | `renyxera_gate_me` | `GATE ME 2027: one official PYQ every morning with the answer, topic tips, syllabus and cutoff updates. https://gate.renyxera.workers.dev/gate-me` |
| `GATE Civil 2027 · Daily PYQ · RENYXERA` | `renyxera_gate_ce` | `GATE Civil 2027: one official PYQ every morning with the answer, topic tips, syllabus and cutoff updates. https://gate.renyxera.workers.dev/gate-ce` |
| `GATE Data Science & AI 2027 · Daily PYQ · RENYXERA` | `renyxera_gate_da` | `GATE DA 2027: one official PYQ every morning with the answer, topic tips, syllabus and cutoff updates. https://gate.renyxera.workers.dev/gate-da` |

For each channel, exactly like Part 1 of the old guide:
1. **Name** and **Description** from the table, upload the RENYXERA logo as the photo, tap **→**.
2. Choose **Public channel**, type the link from the table (without `t.me/`), tap **→**. Skip adding members.
3. Open the channel → tap its name → **Administrators** → **Add Admin** → search your bot → leave **only Post messages** on → **Save**.
4. Post one welcome message (section 4) and pin it.

### Step D. Add the GitHub secrets (laptop, 5 min; can be done while you do C)
GitHub → your repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**. Add these six (name exactly, value with the `@`):

| Secret name | Value |
|---|---|
| `TELEGRAM_CHANNEL_CS` | `@renyxera_gate_cs` |
| `TELEGRAM_CHANNEL_EC` | `@renyxera_gate_ece` |
| `TELEGRAM_CHANNEL_EE` | `@renyxera_gate_ee` |
| `TELEGRAM_CHANNEL_ME` | `@renyxera_gate_me` |
| `TELEGRAM_CHANNEL_CE` | `@renyxera_gate_ce` |
| `TELEGRAM_CHANNEL_DA` | `@renyxera_gate_da` |
| `TELEGRAM_DISCUSS` | your discussion group link, e.g. `t.me/renyxera_chat` |

(Note the secret name for Electronics is `_EC` and Civil is `_CE`; those are the paper codes the script uses. The usernames can differ.) `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHANNEL` stay as they are.

### Step E. Make the one-tap folder link (3 min)
1. Telegram → **Settings → Folders → Create New Folder**, name it `GATE 2027`.
2. Add chats: the hub, the six branch channels, the discussion group.
3. Open the folder → **Share** → **Create invite link**. Copy it. Send it to me and I will put it on the website and in the posts.

### Step F. Test (2 min)
GitHub → **Actions** → **Telegram daily question** → **Run workflow**. Seven jobs run. Open each channel: the hub shows the rotating question; each branch channel shows its own branch's question. A branch whose secret is missing skips quietly (green).
If a job is red, open it: `chat not found` means the secret value is wrong or the channel is not public; `bot is not a member` means redo step C3 for that channel.

From then on everything posts by itself at 08:00 IST.

---

## 2. Naming and SEO wording (already used above)
Telegram search matches the **name**, **username** and **description**, so each contains the exam, year and branch words people type: `GATE`, `2027`, `PYQ`, `CS/ECE/EE/Mechanical/Civil/DA`. Keep the first line of every description meaningful; it shows in search results.

## 3. Daily and weekly rhythm

| When | Hub | Branch channels |
|---|---|---|
| 08:00 daily | Rotating question (automatic) | Own question with yesterday's answer (automatic) |
| 20:00 daily | Hub highlight: new feature or tip (manual, 2 min) | Answer trick for the morning question (manual, optional) |
| Mon | Weekly mock announcement | "Most repeated topics" post for that branch (`/articles/most-repeated-topics/<paper>`) |
| Wed | Poll: "Which subject scares you most?" | Same poll with the branch's subjects |
| Sat | Mock reminder with link | – |
| Sun | Leaderboard shout-out | Branch toppers (with permission) |

Paid plans appear naturally, not as ads: in the hub, one post a week showing a real feature (AI mentor explaining a wrong answer, the weekly plan, Telegram nudges), with the Plans link and `utm_campaign=hub_feature`. Always tag links `utm_source=telegram&utm_medium=<channel>&utm_campaign=<post>`.

## 4. Pinned messages (copy and paste)

**Hub / each branch channel (pin):**
```
👋 Welcome to RENYXERA · GATE 2027
✅ A real GATE question every morning, with yesterday's answer
✅ Free All-India mock every Sunday
✅ AI mentor that explains your exact mistake
👉 Start: https://gate.renyxera.workers.dev/?utm_source=telegram&utm_medium=pin&utm_campaign=welcome
💬 Doubts: t.me/renyxera_chat
📂 All branches in one tap: <your folder link>
```

**Discussion group, 📣 Start here (pin):**
```
📌 Rules: GATE doubts and discussion only · be kind · no piracy or PDF sharing · no promotions.
Pick your branch topic below. Questions go in ❓ Doubts with the paper, year and question number.
```

## 5. Moderation and safety
- Ban anyone who shares pirated books or paid-course PDFs; delete the post, do not argue.
- Add one trusted moderator per two topics when a topic passes about 200 members (Administrators → add, give *Delete messages* and *Ban users* only).
- Never DM links to students first; the bot never asks for passwords or payments.
- Do not buy members. It destroys reach and the channel rating.

## 6. SEO for Telegram

Telegram has its own discovery layers; Google also indexes public channels.

1. **Search inside Telegram:** it ranks by name and username match, then member count and activity. So keep the exam + branch words in the name (section 2) and keep posting daily.
2. **Google indexing:** every public channel has a web preview at `t.me/s/renyxera_cs`. Google indexes those pages. To help it:
   - Start each daily post with the keyword form: `GATE CS 2023 (Forenoon) · Q34 · Data Structures`. The script already does this.
   - Use 2 or 3 hashtags at the end: `#GATE2027 #GATECS #GATEPYQ` (branch-specific: `#GATEECE`, `#GATEME`…). Do not pile on more.
   - Each post links to the matching question page on the website, so Google sees a trusted link from Telegram to a real page.
3. **Link back from the website:** the website footer, the branch pages and the About page should link to the channels (`rel="noopener"`), and the site's structured data should list them under `sameAs` (see section 7).
4. **Description and pinned post** carry the website link with UTM tags, so you can see in `weekly_growth_metrics()` which channel brings sign-ups.
5. **Directories (free, one time):** submit each channel to tgstat.com (also gives analytics), telemetr.io, and the Telegram channel directories listed in the old playbook. Use the same name and description.
6. **Verified look:** keep the name, photo and description identical in style across all channels. Consistent branding makes forwards recognisable.
7. **Shareability:** keep *Restrict Saving Content* off, and end every post with the short channel link so forwarded copies still point home.
8. **Cross-promotion:** Instagram bio and YouTube description carry the folder link; the channel description carries the website link.

## 7. SEO for the website

Existing: `app/sitemap.ts` (branch pages, every PYQ paper and question, syllabus, tools, topics), `app/robots.ts`, branch landing pages `/gate-cse` … `/gate-da`. What to improve, in order of payoff:

| # | Task | Why | Done when |
|---|---|---|---|
| 1 | Replace the generic root title/description (`RENYXERA — A New ERA of Intelligent Learning`) with the keyword form: `RENYXERA · GATE 2027 PYQs, AI Mentor & Mocks for CS, ECE, EE, ME, CE, DA` | The homepage title is the strongest ranking signal | Source of page shows the new title |
| 2 | Every branch page gets its own title: `GATE <Branch> 2027: Previous Year Questions, Syllabus, Cutoff | RENYXERA` and a 150-character description | Branch pages stop sharing one description | each page unique in Search Console |
| 3 | Add `Organization` structured data on the homepage with `sameAs`: YouTube, Instagram, Telegram hub | Ties the brand across platforms | Rich Results Test passes |
| 4 | Add `Course`/`EducationalOrganization` and `FAQPage` markup to branch pages (3–5 real questions: syllabus, cutoff, best books, how many questions) | FAQ boxes in results | Rich Results Test passes |
| 5 | Add `Question`/`Quiz` structured data on PYQ question pages (already indexed) with the official answer | Eligible for "practice problem" results | Test passes |
| 6 | Open Graph + Twitter card images per branch (the logo on branch colour) | Good link previews on Telegram, WhatsApp, Instagram DMs | Paste a link in Telegram and the card shows |
| 7 | Submit the sitemap in Google Search Console and Bing Webmaster Tools; verify the domain once a custom domain exists | Needed to see real queries | Sitemap status "Success" |
| 8 | Internal links: every PYQ question page links to its topic hub, the branch page and the next question; every branch page links to its channel | Crawl depth and relevance | No orphan pages in the crawl |
| 9 | Core Web Vitals: the click-to-play poster already keeps the video off the critical path; keep images in WebP/AVIF with width/height | Ranking and bounce rate | Lighthouse ≥ 90 on the homepage |
| 10 | When the custom domain exists, 301-redirect `*.workers.dev` to it and update every channel description once | The workers.dev subdomain cannot build domain authority | Old links redirect |

Keywords to target by page (students type these): *GATE CS previous year questions with solutions*, *GATE 2027 syllabus <branch>*, *GATE <branch> cutoff 2026*, *GATE <branch> most repeated topics*, *GATE score calculator*, *GATE study plan 90 days*.

## 8. After setup
1. Put the folder link in the Instagram bio, the YouTube channel description and the website footer.
2. Send me the final usernames and the folder link: I add them to the website footer, branch pages and structured data (SEO items 1 to 6 and 8 above).
3. Weekly, check subscribers and views per channel, and sign-ups by `utm_source=telegram` (`select * from weekly_growth_metrics(4);`).
