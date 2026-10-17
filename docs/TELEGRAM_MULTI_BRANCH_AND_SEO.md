# Telegram for every branch, and SEO for Telegram and the website

*Owner guide, 17 Oct 2026. Replaces the single-channel setup in `TELEGRAM_SETUP_AND_PROMOTION.md` Parts 1, 2 and 4 (that file's Parts 3, 5, 6, 7 still apply). Everything here is free.*

## 1. The structure (and why)

A GATE student cares about **their own branch**. A CS student does not want a Civil question at 8 am, and a small mixed group feels dead. But 6 branches × (channel + group) = 12 half-empty rooms. So:

| Room | Count | Purpose |
|---|---|---|
| **Hub channel** `@renyxera` | 1 | Brand voice: announcements, new features, mock reminders, plan offers, the rotating "question of the day". Every student joins this one. |
| **Branch channels** `@renyxera_cs`, `_ec`, `_ee`, `_me`, `_ce`, `_da` | 6 | Each posts **its own** official PYQ every day at 08:00 IST plus branch-specific topics, cutoffs, syllabus updates. |
| **One discussion supergroup** `@renyxera_chat` with **Topics** switched on | 1 | One topic (sub-room) per branch, plus *General*, *Doubts*, *Mocks & Ranks*, *Study Plan*. One busy group beats six empty ones. |
| **Shared folder link** | 1 | A Telegram "chat folder" that holds all channels. One tap adds them all. This is your main invite link. |

Add a new branch later by creating one channel, one topic, one secret.

Branch codes used below match the app: CS (`CSE`), EC, EE, ME, CE, DA.

## 1b. You already have a channel: upgrade it, do not recreate it

Keep your existing channel and its subscribers. It **becomes the hub**. Do this instead of 3.1, then continue with 3.2 onward:

1. Open your channel → tap its name → **✏️ Edit**.
2. **Name:** change to `RENYXERA · GATE 2027` (section 2). Subscribers keep following; nothing breaks.
3. **Description:** paste the hub description from section 2.
4. **Username:** leave it as it is. Changing a public username breaks old links and the `TELEGRAM_CHANNEL` secret. If you must change it, update the secret in the same minute.
5. **Discussion:** if it already has a linked group, open that group → **Edit → Topics: ON** (it converts the group to a forum and keeps the history). Rename it `RENYXERA · GATE Discussion` and create the topics from 3.3 step 4. If it has no group, do 3.3.
6. Pin the welcome post (section 5) and unpin older ones.
7. Do not delete old posts. Post once: "Branch channels are here: CS, EC, EE, ME, CE, DA. One tap to join all: <folder link>".
8. Then create only the **six branch channels** (3.2), the folder (3.4) and the secrets (3.6). The existing `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHANNEL` secrets stay as they are.

## 2. Names, usernames, descriptions (SEO-ready)

Telegram search matches the **name**, **username** and **description**. Put the exam and branch words people actually type in them.

| Room | Name | Username (public link) |
|---|---|---|
| Hub | `RENYXERA · GATE 2027` | `t.me/renyxera` |
| CS | `GATE CS 2027 · Daily PYQ · RENYXERA` | `t.me/renyxera_cs` |
| EC | `GATE ECE 2027 · Daily PYQ · RENYXERA` | `t.me/renyxera_ec` |
| EE | `GATE EE 2027 · Daily PYQ · RENYXERA` | `t.me/renyxera_ee` |
| ME | `GATE Mechanical 2027 · Daily PYQ · RENYXERA` | `t.me/renyxera_me` |
| CE | `GATE Civil 2027 · Daily PYQ · RENYXERA` | `t.me/renyxera_ce` |
| DA | `GATE Data Science & AI 2027 · Daily PYQ · RENYXERA` | `t.me/renyxera_da` |
| Discussion | `RENYXERA · GATE Discussion` | `t.me/renyxera_chat` |

If a username is taken, add `gate`: `renyxera_gate_cs`. Write down the final ones.

**Descriptions** (limit 255 characters; first line shows in search results):

```
Hub:  Daily GATE PYQ, free All-India mocks and an AI mentor for CS, EC, EE, ME, CE, DA. Practise free: https://gate.renyxera.workers.dev
CS:   GATE CS & IT 2027: one official PYQ every morning with the answer, topic-wise tips, syllabus and cutoff updates. https://gate.renyxera.workers.dev/gate-cse
EC:   GATE ECE 2027: one official PYQ every morning with the answer, topic-wise tips, syllabus and cutoff updates. https://gate.renyxera.workers.dev/gate-ece
(same pattern for EE, ME, CE, DA, using the branch page link /gate-ee, /gate-me, /gate-ce, /gate-da)
```

Channel photo: the RENYXERA mark on the dark background. Use the **same** photo on all, with the branch code (CS, EC…) as a corner badge so they are recognisable in a list.

## 3. Create everything: click by click (phone app)

Do the hub first, then repeat for each branch channel.

### 3.1 Hub channel
1. Telegram → pencil/compose icon → **New Channel**.
2. Name and description from section 2 → **Next**.
3. **Public channel**, link `t.me/renyxera` → **Next**. Skip adding members.
4. Open the channel → tap its name → **✏️ Edit** → **Sign Messages: off**, **Restrict Saving Content: off** (let students forward and share).

### 3.2 Six branch channels
Repeat 3.1 for each row (name, username, description from section 2). For each one, also:
1. Tap the name → **Administrators** → **Add Admin** → pick your bot → leave **only Post messages** on → **Save**.
2. Pin the welcome post (section 5).

### 3.3 The discussion supergroup with topics
1. **New Group** → name `RENYXERA · GATE Discussion` → add any one friend (Telegram needs one member) → **Create**.
2. Tap group name → **✏️ Edit** → **Group Type: Public**, link `t.me/renyxera_chat`.
3. **Edit → Topics: ON** (this turns the group into a forum). Layout: **List**.
4. Create topics (**+** in the topic list): `📣 Start here`, `💬 General`, `❓ Doubts`, `🏆 Mocks & Ranks`, `📅 Study Plan`, then one per branch: `CS`, `EC`, `EE`, `ME`, `CE`, `DA`. Give each its own icon colour.
5. **Edit → Permissions:** turn **Send links** off for members, **Slow mode: 10 s**, chat history for new members **Visible**.
6. Link it to the **hub** channel: hub channel → Edit → **Discussion** → pick this group. Now every hub post gets a **Comments** button.
7. In **📣 Start here** post and pin the rules (section 5).

Branch channels do not need their own comment group: their posts end with a *Discuss* link that goes to the branch topic.

### 3.4 One folder to join everything
1. Telegram → **Settings → Folders → Create New Folder**, name `GATE 2027`.
2. Add the hub, all 6 branch channels and the discussion group.
3. Tap the folder → **Share** → **Create invite link**. Copy it. This is the link you put in Instagram bio, YouTube description, website and the app.

### 3.5 The bot (if you do not have one yet)
Follow Part 3 of `TELEGRAM_SETUP_AND_PROMOTION.md` (BotFather, `/newbot`). Then make it **admin with only Post messages** in the hub and the six branch channels.

### 3.6 Connect it to the automation (GitHub secrets)
On a laptop: GitHub → repository → **Settings → Secrets and variables → Actions → New repository secret**. Add, one by one (value = the channel's `@username`, with the @):

| Secret | Value |
|---|---|
| `TELEGRAM_CHANNEL` | `@renyxera` (already set if you did the old setup) |
| `TELEGRAM_CHANNEL_CS` | `@renyxera_cs` |
| `TELEGRAM_CHANNEL_EC` | `@renyxera_ec` |
| `TELEGRAM_CHANNEL_EE` | `@renyxera_ee` |
| `TELEGRAM_CHANNEL_ME` | `@renyxera_me` |
| `TELEGRAM_CHANNEL_CE` | `@renyxera_ce` |
| `TELEGRAM_CHANNEL_DA` | `@renyxera_da` |
| `TELEGRAM_DISCUSS` | `t.me/renyxera_chat` |

Test: **Actions → Telegram daily question → Run workflow.** Seven jobs run (hub plus six branches); a branch without its secret skips quietly and stays green. Every morning at 08:00 IST: the hub gets the rotating question, each branch channel gets its own branch's official question with yesterday's answer.

*(The code for this is already in the repo: `scripts/telegram-daily.mjs` with `POST_BRANCH`, and `.github/workflows/telegram-daily.yml`.)*

## 4. Daily and weekly rhythm

| When | Hub | Branch channels |
|---|---|---|
| 08:00 daily | Rotating question (automatic) | Own question with yesterday's answer (automatic) |
| 20:00 daily | Hub highlight: new feature or tip (manual, 2 min) | Answer trick for the morning question (manual, optional) |
| Mon | Weekly mock announcement | "Most repeated topics" post for that branch (`/articles/most-repeated-topics/<paper>`) |
| Wed | Poll: "Which subject scares you most?" | Same poll with the branch's subjects |
| Sat | Mock reminder with link | – |
| Sun | Leaderboard shout-out | Branch toppers (with permission) |

Paid plans appear naturally, not as ads: in the hub, one post a week showing a real feature (AI mentor explaining a wrong answer, the weekly plan, Telegram nudges), with the Plans link and `utm_campaign=hub_feature`. Always tag links `utm_source=telegram&utm_medium=<channel>&utm_campaign=<post>`.

## 5. Pinned messages (copy and paste)

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

## 6. Moderation and safety
- Ban anyone who shares pirated books or paid-course PDFs; delete the post, do not argue.
- Add one trusted moderator per two topics when a topic passes about 200 members (Administrators → add, give *Delete messages* and *Ban users* only).
- Never DM links to students first; the bot never asks for passwords or payments.
- Do not buy members. It destroys reach and the channel rating.

## 7. SEO for Telegram

Telegram has its own discovery layers; Google also indexes public channels.

1. **Search inside Telegram:** it ranks by name and username match, then member count and activity. So keep the exam + branch words in the name (section 2) and keep posting daily.
2. **Google indexing:** every public channel has a web preview at `t.me/s/renyxera_cs`. Google indexes those pages. To help it:
   - Start each daily post with the keyword form: `GATE CS 2023 (Forenoon) · Q34 · Data Structures`. The script already does this.
   - Use 2 or 3 hashtags at the end: `#GATE2027 #GATECS #GATEPYQ` (branch-specific: `#GATEECE`, `#GATEME`…). Do not pile on more.
   - Each post links to the matching question page on the website, so Google sees a trusted link from Telegram to a real page.
3. **Link back from the website:** the website footer, the branch pages and the About page should link to the channels (`rel="noopener"`), and the site's structured data should list them under `sameAs` (see section 8).
4. **Description and pinned post** carry the website link with UTM tags, so you can see in `weekly_growth_metrics()` which channel brings sign-ups.
5. **Directories (free, one time):** submit each channel to tgstat.com (also gives analytics), telemetr.io, and the Telegram channel directories listed in the old playbook. Use the same name and description.
6. **Verified look:** keep the name, photo and description identical in style across all channels. Consistent branding makes forwards recognisable.
7. **Shareability:** keep *Restrict Saving Content* off, and end every post with the short channel link so forwarded copies still point home.
8. **Cross-promotion:** Instagram bio and YouTube description carry the folder link; the channel description carries the website link.

## 8. SEO for the website

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

## 9. Order of work (30 minutes of your time, then it runs)
1. Create the hub, six branch channels and the discussion group (sections 3.1–3.3), 20 minutes.
2. Make the folder link (3.4) and add the bot as admin (3.5), 5 minutes.
3. Add the 8 secrets (3.6) and run the workflow once, 5 minutes.
4. Put the folder link in the Instagram bio, YouTube description and, later, on the website.
5. I do the website SEO items 1–6 and 8 in code after you confirm the channel usernames.
