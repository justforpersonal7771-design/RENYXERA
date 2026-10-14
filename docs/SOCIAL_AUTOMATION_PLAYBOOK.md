# Social automation playbook: videos, posts, YouTube, Instagram and Telegram on autopilot

Goal: after a one-time setup, one weekly session of about 60 minutes produces and schedules every post for the week. Everything below runs on free tiers ($0). Where a step has a catch, the catch is written next to it.

## 1. The big picture

```
Weekly batch (you, 60 min)          Runs by itself (GitHub Actions, free)
┌────────────────────────┐          ┌────────────────────────────────────────────┐
│ 1. Ideas + facts file  │   push   │ 4. Render videos / images (Remotion, FFmpeg)│
│ 2. Claude writes the   │ ───────► │ 5. Upload files to storage (public URL)     │
│    scripts + captions  │          │ 6. Publish at the scheduled time:           │
│ 3. Review + approve    │          │    YouTube · Instagram · Telegram channel   │
└────────────────────────┘          │ 7. Log results, pull analytics              │
                                    └────────────────────────────────────────────┘
```

Rule: **a human approves everything before it is scheduled.** Full autopilot with no review is how accounts post wrong facts (a wrong cut-off damages trust) or get flagged as spam.

## 2. Content system (what to post, so automation has something to run)

Five pillars, rotate them:

| Pillar | Example | Format | Source of truth |
|---|---|---|---|
| Tool demos | "Find your GATE score in 20 seconds" | 20 to 30 s Reel/Short | The site's own tools |
| Tips | "3 General Aptitude rules that give free marks" | Carousel / 30 s | `lib/seo/ga-lessons.ts` |
| Data | "GATE 2026 cut-offs by branch" | Carousel + Short | `lib/seo/gate2026.ts` (official data only) |
| Practice | "Solve this GATE question in 60 seconds" | 30 to 45 s | Past-paper question bank |
| Product updates | "New: Telegram mock reminders" | 20 s | Release notes |

Keep a single file `content/calendar.json` in the repo:

```json
[
  {
    "id": "2026-10-20-score",
    "date": "2026-10-20",
    "time": "18:30",
    "pillar": "tool-demo",
    "title": "Find your GATE score in 20 seconds",
    "script": "…",
    "caption": "…",
    "hashtags": ["#GATE2027", "#GATEprep"],
    "video": "out/2026-10-20-score.mp4",
    "channels": ["youtube", "instagram", "telegram"],
    "status": "approved"
  }
]
```

Only entries with `"status": "approved"` and a due time are published.

## 3. Step 1: generate the week's content (Claude, no custom code)

Once a week, open Claude and paste the weekly prompt. It reads facts from your repo files so numbers are never invented.

```
You are the content lead for RENYXERA (a GATE prep web app). Using ONLY the facts in the attached files
(cut-offs, lessons, feature list), write 7 posts for next week as JSON matching content/calendar.json.
Mix the five pillars. For each: a hook (max 8 words), a 20 to 45 second script (under 110 words),
a caption (max 120 words, simple English, one clear call to action), and 6 hashtags.
No rank promises. No invented numbers. If a fact is missing, write "[ASK ME]".
```

Review the JSON, fix anything wrong, set `status` to `approved`, commit.

Cost: $0 when you do this in your normal Claude chat. Do not wire the paid API into the pipeline unless you accept a monthly bill.

## 4. Step 2: make the videos automatically

Use the same stack as `docs/PROMO_VIDEO_MASTER_PROMPT.md`:

1. **Templates in Remotion**: one template per pillar (tool demo, tip, data card, practice question, update). A template takes `title`, `bullets`, `clipPath`, `voiceover` as props.
2. **Screen clips**: a Playwright script records the real pages (`scripts/record-promo.mjs`). Run it in the Action, so the footage always shows the current design.
3. **Voice**: `edge-tts` creates the voiceover and the subtitle file for each script.
4. **Render**: `npx remotion render` in a GitHub Action. A 30 second video takes a few minutes on the free runner.
5. **Images and carousels**: render slides as PNG with Remotion stills or a small HTML to PNG script (Playwright screenshot of an HTML card). No design tool needed.

Free-tier limits to remember: GitHub Actions gives 2,000 minutes a month for private repos (unlimited for public repos). Rendering 7 short videos a week is well inside that.

## 5. Step 3: publish

### Telegram channel (easiest, do this first)

You already have a bot. Add the bot as an admin of the channel with permission to post. Then one HTTPS call posts text, a photo or a video:

```
POST https://api.telegram.org/bot<TOKEN>/sendVideo   (chat_id=@renyxera, video=<file or URL>, caption=…)
```

Free, no review, no limits that matter. Keep the token in GitHub Secrets.

### YouTube (Shorts and videos)

- Use the **YouTube Data API v3** `videos.insert`. It is free but metered: the default quota is 10,000 units a day and one upload costs about 1,600 units, so roughly 6 uploads a day. More than enough.
- One-time setup: create a Google Cloud project, enable YouTube Data API v3, create an OAuth client, run the consent once to get a refresh token, store client id, secret and refresh token in GitHub Secrets.
- **Catch:** videos uploaded by an API project that has not passed Google's compliance audit may be locked to private. If that happens, apply for the audit (free form) or upload through the manual YouTube Studio scheduler, which has no such limit. Either way scheduling in Studio is a fine fallback and still takes only a minute per video.
- Shorts: vertical video up to 3 minutes with `#Shorts` in the title or description.

### Instagram (Reels, carousels, images)

- Needs an **Instagram Professional account** (Creator or Business) linked to a Facebook Page, and a Meta developer app. Use the **Instagram Graph API content publishing**: create a media container with a public `video_url`, wait until it is processed, then publish.
- The video must be at a **public HTTPS URL**. Free options: Supabase Storage public bucket (free tier), Cloudflare R2 free tier, or GitHub release assets. Delete files after publishing.
- Posting to your **own** account with your own app works in development mode without Meta app review. Review is only needed if other people's accounts use your app.
- Limits: about 50 API-published posts per 24 hours. Plenty.
- **Catch:** Meta changes its API often. Check the current docs when you set it up, and keep the manual Meta Business Suite scheduler as the fallback. It is free and also schedules Reels.

### Do not use

- Unofficial Instagram bots, "auto-like", "auto-follow" or "auto-DM" tools. They violate the rules and get accounts restricted. Automate publishing and reporting only. Do replies and DMs by hand (or with saved replies from `docs/INFLUENCER_OUTREACH_MESSAGES.md`).

## 6. The scheduler (GitHub Actions)

Run every 15 minutes, publish what is due, mark it done:

```yaml
# .github/workflows/social-publish.yml
name: social-publish
on:
  schedule: [{ cron: "*/15 * * * *" }]
  workflow_dispatch: {}
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: node scripts/social-publish.mjs
        env:
          TELEGRAM_BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}
          YT_CLIENT_ID: ${{ secrets.YT_CLIENT_ID }}
          YT_CLIENT_SECRET: ${{ secrets.YT_CLIENT_SECRET }}
          YT_REFRESH_TOKEN: ${{ secrets.YT_REFRESH_TOKEN }}
          IG_USER_ID: ${{ secrets.IG_USER_ID }}
          IG_ACCESS_TOKEN: ${{ secrets.IG_ACCESS_TOKEN }}
```

`scripts/social-publish.mjs` does: read `content/calendar.json`, pick entries whose time has passed and status is `approved`, publish to each listed channel, set `status` to `posted` with the returned post ids, commit the file back. Write this script after the first manual run of each platform works, so you know the calls are right.

Note on schedule drift: GitHub cron can run a few minutes late. Fine for social posts.

## 7. Analytics loop (weekly, 10 minutes)

- YouTube: Studio shows average view duration and 3-second hold for Shorts. The Analytics API can pull the same into a sheet.
- Instagram: Insights show reach, saves and shares. Saves and shares matter most. The Graph API exposes them for your own posts.
- Telegram: channel view counts are visible per post.
- Put one row per post in your tracking sheet (G-5): date, platform, pillar, hook, views, saves or shares, link clicks. Use short links with UTM tags (`?utm_source=instagram&utm_campaign=reel-score`) so the site analytics shows which post brought signups.
- Every Sunday, ask Claude: "Here are last week's rows. Which pillar and hook worked, and what 7 posts should I make next week?" Feed the answer into step 1.

## 8. Weekly rhythm (what you actually do)

| Day | Task | Time |
|---|---|---|
| Sunday | Run the weekly prompt, review, approve, commit | 40 min |
| Sunday | Check last week's numbers, update the sheet | 10 min |
| Daily | Reply to comments and DMs by hand | 10 min |
| Friday | Outreach to 10 creators (see the outreach doc) | 15 min |

## 9. Setup checklist (one time, in this order)

- [ ] Telegram: add the bot to the channel as admin, test one `sendMessage` from a script.
- [ ] Record the first promo video by hand using `docs/PROMO_VIDEO_MASTER_PROMPT.md`, post it manually on both platforms.
- [ ] Create `content/calendar.json` and the weekly prompt. Make 7 posts by hand with the pipeline's templates.
- [ ] YouTube: Google Cloud project, API enabled, OAuth consent, refresh token in GitHub Secrets. Upload one test video as private.
- [ ] Instagram: switch to a Professional account, link a Facebook Page, create a Meta app, get a long-lived token (refresh every 60 days; put a reminder in your calendar), upload one test Reel.
- [ ] Public storage bucket for videos used by Instagram.
- [ ] Write `scripts/social-publish.mjs` and the workflow, run it once with `workflow_dispatch`.
- [ ] Add UTM tags to every link and one analytics page to the sheet.

## 10. Risks and how to stay safe

- **Wrong facts:** only pull numbers from the repo's data files, and review before approving.
- **Token expiry:** Instagram tokens expire. Set a calendar reminder at day 50.
- **Platform rule changes:** keep the manual schedulers (YouTube Studio, Meta Business Suite) as a fallback. Nothing breaks if the automation stops.
- **Over-posting:** 1 post a day on Instagram and 3 to 5 Shorts a week is enough. Quality beats volume.
- **Copyright:** only licensed music and clips. Keep a note of each track's source in the calendar entry.
- **Ads and disclosure:** label paid partnerships. Never present AI-generated clips as real student footage.
- **Secrets:** tokens live only in GitHub Secrets, never in the repo or in `content/calendar.json`.

## 11. What I can build next in this repo (tell me when you want it)

1. `scripts/record-promo.mjs`: records the scenes from the storyboard with Playwright.
2. A Remotion project folder `video/` with the five templates and a render script.
3. `scripts/social-publish.mjs` for Telegram first, then YouTube, then Instagram.
4. `content/calendar.json` with the first four weeks drafted from the site's real data.
