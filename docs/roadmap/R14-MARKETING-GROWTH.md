# Release 14 — Marketing and growth (P4)

*Strategy docs: `../GROWTH_MASTER_PLAN.md`, `../GROWTH_TASKS.md`, `../GROWTH_ASSETS.md`, `../MARKETING_STRATEGY.md`, `../CONTENT_STRATEGY.md`, `../INFLUENCER_OUTREACH_MESSAGES.md`, `../SOCIAL_AUTOMATION_PLAYBOOK.md`. Channels: `../TELEGRAM_MULTI_BRANCH_AND_SEO.md`, `../telegram-premium/`, `../instagram/`.*

## R14-A · Promo film (assets ready)
- **A1 · Frame check (me):** sample 12 frames of each v8 file (`video/out/renyxera-film-v8-4k.mp4`, `-vertical-1080.mp4`, `-vertical-4k.mp4`); check text overlaps, tooltips in frame, logo, end card; fix and re-render if needed.
- **A2 · Owner review** on laptop and phone.
- **A3 · Publish:** YouTube (landscape, title/description with keywords + Telegram folder link + site link with UTM), YouTube Short (vertical), Instagram Reel (vertical 1080, 31.6 MB).
- **A4 · Website:** set `NEXT_PUBLIC_PROMO_YT_ID`; click-to-play poster on welcome + Plans (`components/marketing/promo-video.tsx`).
- **A5 · Cut-downs:** 30 s and 15 s versions, 4:5 feed version.

## R14-B · Instagram
- **B1 · Setup (owner):** `../instagram/01-SETUP.md`, then `social-check`.
- **B2 · 4-week calendar (me):** 5 posts/week in `content/calendar.json`: PYQ of the day (carousel), topic trick, weightage fact, Forge/mock reminder, feature demo; captions with hooks, hashtags, UTM links.
- **B3 · Carousel generator:** script turning a PYQ + solution into 5 branded slides (1080×1350) with the approved card fonts.

## R14-C · Telegram
- **C1 · Owner:** boosts, per-branch folders (send links), BotFather menu button + commands (`../telegram-premium/`).
- **C2 · Deep links:** `t.me/<bot>?start=<branch>` → reply with channel, topic, practice link; `/cs`, `/ece`, … commands.
- **C3 · Story images:** daily 1080×1920 question image per branch for channel stories.
- **C4 · Folder links per branch** on branch pages and pinned posts.
- **C5 · Forge teasers** (R11-C4).

## R14-D · SEO
- **D1** Search Console review monthly: titles/meta for pages with impressions but low CTR (S-4).
- **D2** Programmatic pages for every branch: most-repeated topics, subject hubs, year pages (exists for CS; extend).
- **D3** Branch score/rank predictors once official data exists (S-5).
- **D4** Internal linking: every PYQ page → topic hub → branch page → Telegram channel.
- **D5** Public Forge Mock leaderboards (idea 20) and Topic ROI page (idea 22).
- **D6** Domain move plan (when bought): 301 from workers.dev, Search Console change of address, update channel descriptions, Store package.

## R14-E · Community and partnerships (owner-led, Claude drafts)
- G-5 tracking sheet; C-3 value posts in 5 communities; Q-1 5 Quora/Reddit answers; P-1 3 partner offers; P-2 10 directories; P-3 college-club challenge page; V-1 3 Shorts; V-2 weekly Topic ROI posts; V-3 countdown calendar to 6 Feb 2027 (admit card 4 Jan, results 19 Mar).
- Ambassador programme after 1,000 users (referral codes + monthly rewards).
- "Your GATE year" recap after the exam.

## R14-F · Measurement
Weekly: sign-ups by channel, activation (first test within 24 h), D7/D30 retention, paid conversion by source — automated report to the owner's Telegram (idea 39).

## Done when (release)
Film live on 3 platforms; Instagram posting automatically for 4 weeks; Telegram deep links live; Search Console CTR improvements on top 20 pages; weekly growth report running.
