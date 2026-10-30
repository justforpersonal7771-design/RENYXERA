# Reference review: MadeToScale reels and "12 Landing Page Animations" guide

*30 Oct 2026. Source files: `New folder/` (3 Instagram reels by @madetoscale2026, one 20-page PDF). Third-party material: ideas and structure only, never copied. Verdicts are filtered through our rules: $0 budget, DPDP-safe, real data only, reduced motion respected, student audience, solo non-developer owner.*

## 1. The tools named in the reels

| Tool (reel) | What it is | Fit for RENYXERA | Verdict |
|---|---|---|---|
| **Chatterbox** (10 free repos) | MIT text-to-speech, 23 languages **including Hindi**, optional voice cloning, every clip carries an inaudible watermark. Nano (110M) runs on CPU; the multilingual model prefers a GPU. | We already make film voice-overs locally with **Kokoro** (English) + faster-whisper word timings (`video/scripts/make_v4_audio.py`). Chatterbox would add **Hindi/Hinglish** reels, which our Telegram audience may like. | **Maybe, later.** Try one 10-second Hindi line on this PC before committing. Never clone a real person's voice without their written consent. |
| **OpenSEO** (10 free repos) | MIT keyword research, rank tracking, backlinks, site audit. Needs Docker and a **paid DataForSEO key** for most data. | Breaks the $0 rule for real data. We already plan **Google Search Console** (free) for CTR fixes (R14-D1). | **Skip** for now. Revisit only after revenue. |
| **Chatwoot** | Shared support inbox (chat, email, WhatsApp). Self-hosting needs a server. | Support is small today; the Telegram bot and `/report` cover it. | **Later**, when support volume justifies a server. |
| **Cal.com** | Booking links. Free hosted tier. | Could power paid doubt-clearing calls or scholarship interviews. No such feature planned. | **Skip** for now. |
| **Penpot** | Open-source design tool (Figma alternative), free cloud tier. | Owner mock-ups; our design lives in code and `DESIGN-SYSTEM.md`. | **Optional**, low value. |
| **OpenWhispr** | Local voice typing. | Speaking feedback instead of typing could speed the owner's reviews. Local, free. | **Optional quality-of-life** for the owner. |
| **OpenProject, AppFlowy, Immich** | Project management, notes, photo backup. | Not product-relevant; we run on `checklist.md`. | **Skip.** |
| **yt-dlp, YouTube Transcript API, AI Shorts Generator, MoneyPrinterTurbo** (YouTube reel) | Download videos, fetch transcripts, cut long videos into clips, auto-make stock-footage shorts. | We make our own films with Remotion + Kokoro; no long videos to cut. Downloading others' videos raises ToS/copyright risk. | **Skip.** |
| **claude-youtube** (14 slash commands: audit, SEO, thumbnail, competitor, calendar) | A Claude Code skill pack for YouTube channels. | Useful when the YouTube channel launches. A third-party skill pack must be reviewed like any download before use. | **Review later** (channel launch). |
| **Maps Scraper, Cold Outbound, warmly, Customer Finder, YC Outreach, DeskcommCRM, Growth Engineer** (clients reel) | B2B lead scraping and cold email/WhatsApp sequences. | Wrong audience (students), and unsolicited bulk messaging is a DPDP/spam risk. | **Skip.** |
| **Scout** (clients reel) | Finds creator and social-profile leads. | Could shortlist educators for `docs/INFLUENCER_OUTREACH_MESSAGES.md`, with hand-written, individual messages only. | **Maybe**, research aid only. |

## 2. The landing-page techniques (PDF)

The PDF's code uses GSAP, Anime.js, SVG `stroke-dashoffset`, CSS `clip-path`, CSS Grid, `IntersectionObserver` and pointer events. **We do not add GSAP or Anime.js**: the site already ships `motion` (Framer Motion), `MotionPrefs` (reduced-motion switch) and CSS, which do the same things, and R15 (performance) is cutting bundle weight.

| # | Animation | Where it helps us | Rule |
|---|---|---|---|
| 01 Hero reveal | Home hero headline, one pass under 2.5 s | yes | `motion` variants, once |
| 02 Word rotator | Hero line "Practise ___ " (PYQs, mocks, Forge) | optional | one animated thing per screen |
| 03 Sale pings | **never with invented orders**. Possible real version: "students practised today" from `/api/events` | only with real data | real numbers only |
| 04 Review shuffle | Only after real, consented testimonials exist (R13-A2) | later | no fake reviews |
| 05 Count-up stats | Public pages and results; dashboard already has some | yes, standardise one `CountUp` | reduced motion shows the final number |
| 06 Bento build | Test Centre and Tools hubs already use a bento | no change | |
| 07 Cursor tour | Onboarding / "how it works" demo without a screen recording | maybe | |
| 08 Process draw | "How it works" (Build, Practise, Review) on the landing page | yes | SVG `pathLength` with `motion` |
| 09 Before/after | Rank-predictor "what-if", or a redesign post | optional | pointer events + `clip-path` |
| 10 Price roll | Plans page when the billing toggle changes | yes | digits roll once per toggle |
| 11 Us vs them | Only comparisons that are true; we avoid naming competitors | skip | |
| 12 Click to success | Sign-up and "Upgrade" button states (idle, working, done) | yes | real request state, never fake |

The PDF's six pre-ship checks are adopted as our motion checklist: respect reduced motion, animate only `transform` and `opacity`, test on a mid-range Android, intros under 2.5 s, never fake social proof, play once.

## 3. The reel format (all three videos)

Common recipe: vertical 1080x1920, one number per card with a countdown (5 to 1), a one-line tagline, a proof badge (stars, savings), word-by-word captions, a running tally, and a closing **"Comment KEYWORD to get the links"**.

For GATE this becomes **"5 CS topics that give the most marks"**, using our own measured data (`data/forge/CS/profile.json`: marks per paper, years asked out of 10), ending with a link to practise those topics. The closing call to action should send people to the Telegram channel or a link in bio; Instagram auto-DM tools are optional and are not needed to start.

## 4. What got done from this review (30 Oct)

- Installed the **UI UX Pro Max** skill (MIT, reviewed) in `.claude/skills/ui-ux-pro-max`. Its search tool and checklists are used for UI work; `docs/design/DESIGN-SYSTEM.md` remains the authority.
- Remotion countdown-reel template planned in `video/` (see checklist).
