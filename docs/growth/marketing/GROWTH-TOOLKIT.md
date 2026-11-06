# Growth toolkit: the ten repos, checked

[← Docs index](../../README.md) · [Open items](../../open-work/OPEN-ITEMS-2026-11-06.md)

*2 Nov 2026. Licences and last-push dates were read from the GitHub API on 2 Nov 2026. "Fit" is judged for RENYXERA: a B2C app for GATE students in India, zero budget.*

| Repo | Licence | Last push | Stars | What it does | Fit for RENYXERA |
|------|---------|-----------|-------|--------------|------------------|
| Kappaemme-git/codex-first-customer-finder-skill | MIT | 19 Sep 2026 | 1145 | Finds your first customers from public posts | **Good**: find students asking "how to prepare GATE CSE" in public communities, then reply by hand |
| gooseworks-ai/goose-skills | MIT | 27 Oct 2026 | 1277 | Skill pack for content, social, research, outreach | **Good**: content and research skills; skip the cold-outreach ones |
| GetBrew/growth-engineer | MIT | 31 Oct 2026 | 251 | Growth-experiment skills | **Good**: experiment ideas, landing-page and funnel reviews |
| Mahanaicoach/google-maps-scraper-kit | MIT | 2 Nov 2026 | 2136 | Pulls business listings from Google Maps | **Later, B2B**: coaching institutes and colleges for a partner plan. Check Google Maps terms; prefer their official Places API free quota |
| melgarafael/DeskcommCRM | MIT | 2 Nov 2026 | 5059 | Self-hosted AI CRM with WhatsApp | **Later, B2B**: only once institutes become customers; needs hosting, so not free to run |
| growthenginenowoslawski/coldoutboundskills | MIT | 5 Oct 2026 | 798 | Cold-outbound email skills | **Low**: B2B only; students are not cold-email targets |
| adityajha2005/yc-outreach | MIT | 21 Oct 2026 | 202 | Outreach to startups | **Not a fit**: startup-founder targeting |
| oneshot-agent/oneshot-gtm | MIT | 30 Oct 2026 | 674 | Pay-per-result go-to-market agent | **Not a fit**: costs money per result |
| warmbly/warmbly | Apache-2.0 | 2 Nov 2026 | 855 | Cold-email inbox warm-up | **Avoid**: warm-up exists to get bulk cold mail past spam filters |
| kiryano/Scout | MIT | 5 Sep 2026 | 786 | Scrapes Instagram, TikTok, LinkedIn for leads | **Avoid**: scraping those platforms breaks their terms and risks the accounts; also stale (2 months) |

All ten are permissively licensed (MIT or Apache-2.0), so using them is allowed. Licence is not the problem; terms of the platforms and Indian law are.

## Rules we follow (legal and reputation)
1. **No mass cold messages to students.** India's DPDP Act 2023 requires consent for using personal data; TRAI rules cover unsolicited commercial messages. A student who did not ask for a message will report it, and the Telegram and Instagram accounts are our main channels.
2. **No scraping logged-in social platforms.** Public posts are read by hand or through official search; replies are written by a person.
3. **Reply, don't blast.** Answer the question the student asked, mention RENYXERA only when it helps, one reply per thread.
4. **Opt-in lists only** (Telegram group, email sign-ups, Share cards). Every message has a stop option.
5. **B2B (institutes) is separate**: a short, personal email to a named coaching-centre owner is normal business outreach; keep it under 20 a week, honest, with an unsubscribe line.

## What to use, in order (all free)
1. **First Customer Finder + Goose Skills (research):** build a weekly list of 20 public questions from GATE communities (Reddit r/gate, Telegram groups, Quora, YouTube comments). Reply by hand with a useful answer. Track in a sheet.
2. **Goose Skills + Growth Engineer (content):** turn each week's PYQ analysis into one Instagram carousel, one reel script and one Telegram post (the card and film features already make the visuals). Growth Engineer suggests one experiment a week (for example, a new share-card headline); log results.
3. **Share loop inside the product** (cheapest growth): challenge cards, result cards and the Battles game (R29) bring friends in. This beats any outreach tool.
4. **Institute partnerships (later):** a "college or coaching mode" with a class leaderboard. Find 50 institutes in Delhi, Hyderabad, Kota via the Places API free quota, send 5 personal emails a week, offer a free month. DeskcommCRM only if more than ~30 leads are active.

## Do not install
Warmbly, Scout, YC Outreach, OneShot GTM, Cold Outbound Skills: wrong audience, a cost, or a terms-of-service risk. Nothing here needs installing in the app itself; these are agent skills used in Claude sessions, outside the product code.

## Re-check before using
Repos change quickly: re-read the licence and last-push date on the day you use one, and read a skill's files before running it (they can run commands).
