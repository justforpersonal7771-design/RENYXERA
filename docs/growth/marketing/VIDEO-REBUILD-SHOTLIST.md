# Video rebuild: audit and shot list (for owner approval)

[← Docs index](../../README.md) · [Open items](../../open-work/OPEN-ITEMS-2026-11-06.md) · [Owner tasks](../../open-work/OWNER-TASKS.md)

Written 7 Nov 2026. Owner feedback: the vertical film "is literally messed up", "all the videos are boring", wants trending, high-end reels, not basic ones, tested properly. Nothing below is built yet: this follows the motion-reel rule "shot list first, then stop for the owner's OK", because redoing scenes is expensive and changing a table is cheap.

## 1. Audit of what exists (frames rendered 7 Nov)

**Vertical film (`FilmVertical`, 1080×1920)** is the 16:9 film squeezed into three fixed bands, so it cannot look good:
- The logo and the tagline "A new era of intelligent learning" sit at the top for the whole film: about 20% of the frame is a static sign.
- The middle band shows a cropped desktop screenshot: cut off on the left, UI text about 10 px tall, unreadable on a phone. At some moments the band is empty (frame 300 is a dark box).
- The "Start now · link in bio" button is on screen from the first frame, so there is no payoff at the end.
- Everything fades in the same way; nothing moves with intent, nothing lands on a beat.
- The headline words are low-contrast while they appear (grey on purple).

**Landscape v8 (4K)** is polished but it is a slow product walk-through, and it predates Forge, Battles, the new Mentor and the plans page. It stays on YouTube for now; it needs a re-cut later.

**reel-top5** (the "5 topics, 14 of 100 marks" countdown) has good bones (real numbers, 9:16, one idea). Fixed 7 Nov: the number used to count up and flicker.

## 2. Direction (what "next level" means here, in rules we can test)

1. **A 2-second hook** that is a claim or a question with a real number, never the logo. Logo only in the last 3 seconds.
2. **Real product on a real phone frame.** The app is mobile-ready, so we record it at phone size (390×844) with Playwright and show the actual screen full-width, not a cropped desktop. Never invent a screen (house rule).
3. **Something new every 1.5 to 2.5 seconds**, cuts on the beat, whip pans with both shots on screen, zooms in log space, big kinetic type (one or two words at a time, 120+ px), one proof number per film.
4. **One accent colour** (our violet-to-pink ribbon) on dark, one display face and one UI face (the brand's own).
5. **Sound**: a synthesized beat (or a track you supply) plus small SFX on every hit; no voice-over by default. Captions burned in because most reels are watched muted.
6. **CTA only at the end**: the last 2.5 seconds, a big button shape and the address.
7. **Tested before it is shown**: render a contact sheet of every beat at phone size, score hook, readability, motion, variety, brand, sync (all 8 or more), fix the worst three, repeat three times.

## 3. The films (all 9:16 first; the 16:9 cut follows)

| # | Film | Length | Idea | Real assets |
|---|---|---|---|---|
| A | **5 topics = 14 of 100 marks** | 18 s | The countdown reel, rebuilt: hook with the number, each topic slams in on the beat with its marks, a stacking bar that fills to 14.2, end card | real topic weights from `reel-top5.json` |
| B | **Wrong answer to explained** | 22 s | A student gets a question wrong; the real AI Mentor reply appears with the equation typeset and the code block; "it explains why" | real Mentor chat on a phone frame (the new rich replies) |
| C | **Questions you will not find in PYQs** | 20 s | Forge: a hard cross-topic question, the timer, the trap highlighted, "329 original questions" | real Forge screens |
| D | **Challenge a friend** | 18 s | Battles: send a challenge, both finish, result with rating change, season badge | real Battles screens |
| E | **16:9 launch film** (YouTube) | 60 s | Cut of A to D with a stronger intro, replaces v8 later | same real screens |

## 4. Film A shot list (the first one to build; 120 BPM, one beat = 0.5 s)

| Shot | Beats | Time | On screen | Motion and transition | Sound |
|---|---|---|---|---|---|
| 1 Hook | 0 to 4 | 0.0 to 2.0 | "14 of 100" huge, then "marks come from just 5 topics" | number slams in, camera push; first frame is already the hook | low hit, riser |
| 2 Rank 5 | 4 to 8 | 2.0 to 4.0 | "5" block + topic name + marks | whip in from the right, number settles with a small squash | tick, whoosh |
| 3 Rank 4 | 8 to 12 | 4.0 to 6.0 | same layout, new colour tint | whip in from the bottom, previous block slides out as this one slides in | tick, whoosh |
| 4 Rank 3 | 12 to 16 | 6.0 to 8.0 | same | whip, bar below grows | tick, whoosh |
| 5 Rank 2 | 16 to 20 | 8.0 to 10.0 | same | whip, zoom in on the marks | tick, whoosh, snare roll |
| 6 Rank 1 | 20 to 26 | 10.0 to 13.0 | "1" larger, "3.13 marks, asked 10 of 10 years" | slow push in, years as 10 dots filling in a row | big hit |
| 7 Total | 26 to 32 | 13.0 to 16.0 | the 5 blocks stacked into one bar that fills to 14.2 | blocks fly into the bar on the beats | rising pad, hits |
| 8 End | 32 to 36 | 16.0 to 18.0 | "Study these first" + button "Start free" + address | button pops with a spring, one full flash (the single structural flash) | final hit, tail |

Phone-size check for every frame: text at least 64 px tall at 1080 width; nothing in the top 180 px or bottom 340 px (app UI covers it).

## 5. How it will be built and tested

- **Tool:** Remotion in `video/` (already in the repo, brings its own ffmpeg), with springs and a beat grid in code. The motion-reel pipeline from the installed skill also needs ffmpeg, uv and Playwright installed system-wide; ffmpeg is not installed on this PC, so I will not install system software without your OK and will use Remotion unless you say otherwise.
- **Real screens:** `video/scripts` Playwright captures at 390×844 for B, C and D (guest mode and a test account; no private data on screen).
- **Test loop:** contact sheet and phone-size sheet per round, three rounds minimum, scores written to `video/docs/critique.md`, then render and check duration, 30 or 60 fps, yuv420p and audio present with a frame pulled from the encoded file.

## 6. What I need from you

- [ ] OK, or edits, on films A to E and the order (default: A, then B, then C, D, E).
- [ ] Music: a track you are allowed to use (name or file), or "synthesize" (default, no copyright risk).
- [ ] Voice-over: yes or no (default no; captions instead).
- [ ] Hindi or English captions (default English).
