# Instagram automation: setup and daily use

Profile: https://www.instagram.com/renyxera

What is **already built** (in the repo, nothing to code):
- `scripts/social-publish.mjs`: posts due entries from `content/calendar.json` to Instagram (Reels or single images) and the Telegram hub, then marks them posted.
- `.github/workflows/social-publish.yml`: runs it every 30 minutes (free on GitHub Actions).
- `scripts/social-upload.mjs`: uploads a video or image to a public Supabase bucket (`social`) and prints the public link Instagram needs.
- `.github/workflows/social-check.yml` (new): a button that checks your Instagram token and Telegram bot without posting.
- `content/calendar.json`: the content calendar (one entry now: the launch film).

What **you** do once: `01-SETUP.md` (about 30 minutes). Then daily use is `02-DAILY-USE.md`.

Important facts:
- This uses **Instagram Login with the Instagram API**. It needs a **Professional** account (Creator or Business). **No Facebook Page is needed** with this method.
- Posting to your own account in the app's development mode works **without Meta app review**.
- Instagram needs a **public HTTPS video link** and recommends **1080x1920** vertical Reels. The free Supabase limit is 50 MB per file, so upload the 1080x1920 cut to Instagram and the 4K cut to YouTube.
- Do **not** use auto-like, auto-follow or auto-DM tools. Only publishing is automated.
