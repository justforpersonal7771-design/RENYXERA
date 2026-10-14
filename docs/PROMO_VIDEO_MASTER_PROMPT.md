# RENYXERA intro and promo video: master prompt, scripts and production guide

Goal: one 60 to 90 second intro video (plus 15, 30 and 45 second cuts) that makes a GATE student think "I need this", with **no watermark**, at **₹0**.

Read section 1 first. It tells you which tools never add a watermark. Sections 3 and 4 are the prompts you paste. Section 8 lists the skills you need (or the tool that replaces each skill).

---

## 1. The honest production plan (what actually works with no watermark and no budget)

AI text-to-video tools on free plans (Runway, Pika, Luma, Kling and similar) put a watermark on the output or limit you to a few seconds. Do not build the video on them. Your product is a **website**, so the strongest video is **real screen footage of the site** with a clear voice and clean motion text. That is also what converts: students want to see the real product.

| Layer | Tool (free, no watermark) | Notes |
|---|---|---|
| Screen footage | Playwright recording (a script in section 6) or OBS Studio | Playwright gives perfectly smooth, repeatable footage at 1080x1920 (vertical) and 1920x1080 |
| Editing and motion text | **Remotion** (React, free for individuals) or **DaVinci Resolve** (free, no watermark) | Remotion lets you write the video as code, so you can regenerate it for every release |
| Voiceover | `edge-tts` (free, natural Indian English voices such as `en-IN-NeerjaNeural` and `en-IN-PrabhatNeural`) or record your own voice | Your own voice is best for trust. Use edge-tts for fast drafts |
| Music | YouTube Audio Library, Pixabay Music, Uppbeat free tier | Check the licence says commercial use and no attribution, or keep the credit in the description |
| Stock b-roll (optional) | Pexels, Pixabay | Free, no watermark. Use sparingly. Real product beats stock |
| Subtitles | Whisper (open source) to make the .srt, burn in with FFmpeg or Remotion | Most people watch muted. Subtitles are not optional |
| AI image/video clips (optional) | Only if the tool's licence allows commercial use and removes the mark. Check the plan page first. If it needs a paid plan to remove the mark, skip it | Do not remove a watermark with a cracked tool. It is illegal and your account can be banned |

About the GitHub repo "ai-video-editor" you mentioned: I cannot vouch for a project by name only. Before using any repo, check: last commit within 6 months, a licence that allows commercial use (MIT, Apache 2.0), more than a few hundred stars, and read its code for anything that uploads your files. If it passes, it can replace the Remotion layer. If not, use Remotion. The pipeline in `docs/SOCIAL_AUTOMATION_PLAYBOOK.md` works with either.

---

## 2. The one-line essence and the audience

**Essence:** "Everything a GATE student needs, in one calm place: real past papers, a plan that fits your day, and a nudge on Telegram when you forget."

**Audience:** GATE 2027 aspirants (CS, DA, EC, EE, ME), mostly 20 to 25 years old, watching on a phone, tired of five different apps and scattered PDFs, price-sensitive, motivated by rank and by not wasting time.

**Promise to show (not tell):**
1. Practice real GATE questions (official past papers, with solutions).
2. A planner built around your free hours.
3. All-India mocks with a real rank.
4. Telegram reminders so you never miss a block or a mock.
5. Analytics that name your weak topics.
6. Free tools: score and cut-off calculator, General Aptitude lessons.
7. Starts free. Plus is ₹29 a month. No auto-renewal.

**Tone:** warm, confident, quick. Like a senior who topped GATE and wants you to skip his mistakes. No hype words like "revolutionary". No fake rank promises.

**Colours and look (match the site):** violet to indigo to fuchsia gradients, soft light backgrounds, rounded cards, clean sans-serif (the site uses Manrope-like geometric type). Logo: the RENYXERA mark with the cyan-blue-violet "ERA".

---

## 3. THE MASTER PROMPT (paste into Claude, ChatGPT or Gemini)

Copy everything in the block. Fill the three [BRACKETS] first.

```
ROLE
You are a senior performance-video creative director and scriptwriter who has made product launch videos for education apps that convert students. You write for vertical short-form video (Instagram Reels, YouTube Shorts) first and widescreen second.

PRODUCT
RENYXERA is a GATE preparation web app for Indian engineering students.
Core features (use ONLY these, do not invent others):
- Practice real GATE past papers with solutions, by section, subject or topic; mock-style full tests with a timer and a virtual calculator.
- All-India mocks with a live leaderboard and rank.
- A study planner that builds a schedule around the student's free hours, with an exam countdown, spaced revision and a progress view. Plus and Pro members get automatic scheduling.
- Telegram bot: reminders for study blocks, timers and alarms, mock reminders (a day before, 5 PM the evening before, 30 minutes before), a morning digest, and a weekly nudge on weak topics (Pro).
- Analytics: topic-wise accuracy, weak topics, time per question.
- Free tools: GATE score and cut-off calculator (official GATE 2026 data), General Aptitude lessons, branch cut-offs.
- Branches live: CS, DA, EC, EE, ME. Free to start. Plus is ₹29 a month. Pro is higher. One payment, no auto-renewal.
- Look: modern, light and dark themes, works on phone.

AUDIENCE
GATE 2027 aspirants aged 20 to 25, phone-first, price-sensitive, overwhelmed by scattered PDFs and apps.

GOAL OF THE VIDEO
Make the viewer visit [SITE LINK] and sign up free. Secondary goal: join the Telegram channel [CHANNEL LINK].

CONSTRAINTS
- Length: produce THREE cuts: 15 seconds (hook-only teaser), 45 seconds (main), 90 seconds (full story).
- Format: 9:16 vertical master, and note what to re-frame for 16:9.
- Never promise ranks, scores or selection. Never fake testimonials or numbers. Use only the facts above.
- All on-screen text in simple English. Max 7 words per caption line.
- First 2 seconds must be a hook that stops the scroll. No logo opener, no "Hi guys".
- Include a clear call to action in the last 3 seconds.
- No copyrighted music references by name. Say the mood and BPM.

OUTPUT FORMAT (use these exact headings)
1. Three hook options for the first 2 seconds (ranked, with why).
2. The 45-second script as a table with columns: Time | Visual (what is on screen, which page of the site, what moves) | On-screen text | Voiceover line | Sound.
3. The 15-second and 90-second versions in the same table format.
4. A shot list of every screen recording I must capture (page, exact actions, duration, cursor movement notes).
5. Voiceover read as one clean paragraph per cut, with pace and emotion notes (words per minute, where to pause).
6. Music brief: mood, BPM, where the beat drops, where it goes quiet.
7. Caption and hashtag set for Instagram and YouTube Shorts, plus a pinned comment.
8. Three thumbnail / cover frame ideas.
9. A checklist to QA the final video before posting (text legible on phone, safe margins for platform UI, subtitles on, no watermark, loudness).

STYLE REFERENCES
Fast, clean, product-first. Think calm confidence, not shouting. Use motion for emphasis: a card sliding in, a number counting up, a checkmark popping, a progress bar filling. Cut every 1.5 to 3 seconds.

DEPTH
Be specific. Do not write generic advice. If you need a fact I did not give, write "[ASK ME: ...]" instead of guessing.
```

---

## 4. Scene-by-scene master storyboard (my recommended 45 second cut)

Use this directly if you do not want to run the prompt. Vertical 1080x1920, 30 fps.

| Time | Visual | On-screen text | Voiceover | Sound |
|---|---|---|---|---|
| 0.0 to 2.0 | Black. A phone with 40 browser tabs flashes, then wipes to the clean RENYXERA dashboard | "40 tabs for GATE?" | "Forty tabs, five apps, one exam." | Soft riser |
| 2.0 to 5.0 | Dashboard, cursor glides to Practice | "One place. Real papers." | "RENYXERA puts everything in one place." | Beat enters |
| 5.0 to 10.0 | Practice screen: pick Section, Subject, Topic (the three drop-downs). Start a test, a question with a math formula appears, option selected, timer visible | "Official past papers" | "Practise real GATE questions, by section, subject or topic." | Light ticks |
| 10.0 to 15.0 | Result screen: score ring fills, accuracy bars, weak topics list | "See your weak topics" | "Know exactly where you lose marks." | Whoosh |
| 15.0 to 21.0 | Planner: set free hours, plan builds across the calendar, blocks appear one by one | "A plan around YOUR day" | "Tell it your free hours. It builds the plan." | Pops per block |
| 21.0 to 26.0 | Phone showing the Telegram bot: "Study block in 10 minutes", "Mock starts tomorrow 5 PM" | "Reminders on Telegram" | "And the bot nudges you before you forget." | Notification chime |
| 26.0 to 31.0 | Mocks page: leaderboard with rank, countdown to the next All-India mock | "All-India mocks. Real rank." | "Test yourself against the whole country." | Beat peak |
| 31.0 to 36.0 | Tools: branch cut-offs table, score calculator slider moving | "Free score and cut-off tools" | "Check cut-offs and your GATE score. Free." | Bright arp |
| 36.0 to 41.0 | Pricing card: Plus ₹29 / month, "No auto-renewal" | "Start free. Plus ₹29" | "Start free. Go Plus for twenty-nine rupees a month." | Beat lifts |
| 41.0 to 45.0 | Logo, URL, Telegram handle, a button animating a tap | "RENYXERA · link in bio" | "RENYXERA. Your GATE, organised." | Hit and tail |

15 second teaser: keep rows 0 to 2, 5 to 10, 15 to 21, 41 to 45 compressed to 3 second beats.
90 second story: add a "problem" scene (scattered PDFs), the General Aptitude lessons, the weekly weak-topic nudge, dark mode, branch picker, and a founder line: "I built this for the version of me who studied alone."

---

## 5. Prompts for AI video and image tools (only if you choose to use them)

Use these for **b-roll and background plates only**, never for the product UI (generated UI always looks wrong and misleads viewers).

**Opening plate (text-to-video):**
```
Vertical 9:16, 5 seconds, cinematic. A student at a desk at night, laptop glow on their face, notebook full of formulas, warm lamp, shallow depth of field, slow push-in. Soft violet and indigo colour grade. No text, no logos, no watermark, no readable screens. Realistic, calm, hopeful mood.
```

**Transition plate:**
```
Abstract vertical background, 4 seconds, slow flowing gradient of indigo, violet and fuchsia with soft light particles, loopable, no text, clean, premium, 60 fps feel.
```

**Cover image (text-to-image):**
```
Clean premium poster, vertical, soft light background with violet-to-fuchsia gradient glow, a floating rounded dashboard card showing a progress ring and a calendar, minimal, lots of empty space at the top for a headline, no text, no logos.
```

If any tool puts a mark on the result, do not use it. Use the abstract plates made in Remotion instead (a gradient plus particles is ten lines of code).

---

## 6. Capture the screen footage with Playwright (perfect, repeatable, no watermark)

Install: `npm i -D playwright` (the repo already has it for tests). Record in a signed-in browser context so the dashboard has real data. A minimal recorder:

```js
// scripts/record-promo.mjs  (run: node scripts/record-promo.mjs)
import { chromium } from "playwright";
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 540, height: 960 },        // 9:16, scaled up 2x on export
  deviceScaleFactor: 2,
  recordVideo: { dir: "promo-raw", size: { width: 1080, height: 1920 } },
  storageState: "auth.json",                    // a saved signed-in session
});
const page = await ctx.newPage();
const pause = (ms) => page.waitForTimeout(ms);
await page.goto("https://YOUR-SITE/");           await pause(2500);
await page.goto("https://YOUR-SITE/setup");      await pause(3000);
// move the mouse smoothly like a person
await page.mouse.move(100, 300); await page.mouse.move(300, 520, { steps: 40 });
await pause(1500);
await ctx.close(); await browser.close();        // the .webm is saved when the context closes
```

Tips: turn on the dark or light theme before recording, hide the browser UI (Playwright does by default), use a test account with sample data (never a real student's data), and record each scene as its own clip so you can re-take one.

---

## 7. Assemble it (Remotion, free)

1. `npx create-video@latest` (React template). Put clips in `public/clips/`.
2. One `<Sequence>` per row of the storyboard. Text uses spring animations (pop, slide, count-up).
3. Voiceover: `pip install edge-tts` then `edge-tts --voice en-IN-NeerjaNeural --file script.txt --write-media vo.mp3 --write-subtitles vo.vtt`. Use the .vtt for caption timing.
4. Music at about 12 percent volume under the voice (ducking: lower further while the voice speaks).
5. Render: `npx remotion render src/index.ts Promo out/promo.mp4`. Remotion adds no watermark.
6. Export three sizes: 1080x1920 (Reels, Shorts), 1080x1350 (Instagram feed), 1920x1080 (YouTube, website hero).
7. Loudness: aim for about minus 14 LUFS. In FFmpeg: `ffmpeg -i in.mp4 -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:v copy out.mp4`.

DaVinci Resolve alternative: import the clips, follow the same table, export H.264. The free version has no watermark.

---

## 8. Skills you need (and what replaces each)

| Skill | Why | Free way to get or replace it |
|---|---|---|
| Hook writing | The first 2 seconds decide everything | Use the three-hook output of the master prompt, test two on Stories |
| Short scripting | Under 120 words for 45 seconds | The prompt does the first draft. You trim |
| Screen recording | Real UI is the proof | Playwright script above or OBS |
| Basic video editing (cuts, text, audio) | Assembly | Remotion (needs React basics) or DaVinci Resolve (drag and drop) |
| Motion design basics (easing, timing) | Makes it feel premium | Use spring animations; keep movement under 0.4 s |
| Voiceover / audio | Bad audio loses viewers faster than bad video | Quiet room, phone mic 10 cm away, or edge-tts |
| Subtitles | Most people watch muted | Whisper plus FFmpeg, or Remotion captions |
| Colour and brand consistency | Looks trustworthy | Reuse the site colours and fonts |
| Platform sizes and safe zones | Text hidden under UI is wasted | Keep text inside the middle 80 percent and away from the bottom 250 px |
| Basic analytics | Learn what works | YouTube Studio and Instagram Insights: watch time, 3-second hold, shares |
| Copy for captions | Drives the click | Section 3, item 7 of the prompt |
| Licensing awareness | Avoids takedowns | Only use music and clips with a commercial licence |

---

## 9. Final QA checklist before you post

- [ ] First 2 seconds show a hook, not a logo.
- [ ] No watermark, no browser tabs, no personal data on screen.
- [ ] Every number on screen is true today (₹29, branches, cut-offs).
- [ ] Subtitles are on and readable on a phone at arm's length.
- [ ] Text stays out of the bottom 250 px and the top 150 px.
- [ ] The call to action says one thing: the link in bio or the link in the description.
- [ ] Volume is even, the voice is clear over the music.
- [ ] You can explain the video in one sentence.
- [ ] The video is saved in three sizes and the project file is committed to a private backup.

---

## 10. A/B plan for the first two weeks

Post the 15 second teaser and the 45 second main cut with **different hooks**. After 48 hours keep the hook with the higher 3-second hold and re-cut. Put the winning cut as the pinned post and the website hero. Re-record the screens after every big release so the video never shows an old design.
