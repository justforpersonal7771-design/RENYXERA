# RENYXERA promo film: the single master brief

> **Version 3 (15 Oct 2026) supersedes the earlier versions below.** Sections 0 to 17 further down are kept as history and for their prompts and checklists; where they disagree with this part, this part wins.

## V3.1 What changed and why (owner feedback)

| Feedback | Decision |
|---|---|
| v1 and v2 felt slow, not premium; screens did not look like the app | Show the **real app, live**: every product shot is the actual RENYXERA app driven by a script, captured frame by frame |
| "Simulate the process like a real one, as in the reference video, not screenshots" | Frame-accurate simulation: the app's clock is frozen and advanced exactly one frame (1/30 s) at a time; the cursor moves, clicks and types on precise frames, and the app's own animations play out naturally between them. Nothing is a static image |
| Must be 4K, every capture 4K | Captured at 3840x2160 (1600x900 layout at 2.4x device pixels); film rendered at 3840x2160 |
| Not slow, but not just sped up | Paced by a 120 BPM grid: a beat every 0.5 s, cuts and clicks land on beats; scenes are short and each makes one point |
| Voice sounded Indian / unnatural | Kokoro open model (Apache-2.0 weights, commercial use allowed), voice `af_heart`. ElevenLabs sounds better still, but its free plan is non-commercial and needs attribution; a paid plan ($6+ a month) is the upgrade path |
| Problem statement weak | Rewritten from official data (V3.3) |
| Highlight Plus and Pro, not "Start free" | Pricing scene puts Plus and Pro side by side with their real prices and benefits; free is a small line |
| Highlight upcoming features | A "Coming next" beat near the end (V3.6) |

## V3.2 Research (what premium product films do)

- Launch films that feel premium (Figma Config 2025, Stripe, Linear, Raycast, Framer) let the **product carry the video**: real UI, calm confident motion, little decoration, fast but readable pacing, typography as a second voice. Most strong launch films run 30 to 60 seconds. Sources: [Superside](https://www.superside.com/blog/saas-video-examples), [Vidico](https://vidico.com/news/top-12-outstanding-saas-product-demo-videos/), [Komet Media](https://www.kometmedia.com/blogs/8-best-saas-product-launch-video-examples-for-2026), [advids](https://advids.co/blog/saas-feature-launch).
- Techniques: UI presented in depth rather than flat, a camera that pushes in to isolate one control, focus pulls, cropped fragments, kinetic type, cuts planned on the music grid.
- Edtech install ads state one specific pain in the first 3 seconds, then move straight into the app ([Koro, India edtech](https://getkoro.app/blog/ai-hook-demo-video-for-edtech-apps-india-app-marketing-guide-2026)).
- **The reference video you sent** (uxpeak, "This UI/UX Redesign Will Teach You More Than 100 Tutorials Combined", 13.5 min, 476k views): the interface sits large and centred on a soft lavender gradient; a purple cursor performs real actions; **numbered callouts with leader lines** point at elements; a **magnifier loupe** enlarges one detail; side panels slide out to explain; the camera glides in to the area being discussed; edits happen live and smoothly. We adopt this language: soft brand gradient stage, the real app large and centred, cursor-driven live actions, numbered callouts, loupe, slide-out panels, camera glides.
- Common reasons GATE aspirants underperform (coaching blogs, opinion not survey data): too many scattered resources, previous-year questions not used well, mocks taken but not analysed, Maths and Aptitude neglected, weak revision ([PW](https://www.pw.live/gate/exams/common-mistakes-students-made-in-gate-2026), [theiesgate](https://theiesgate.in/common-gate-preparation-mistakes/), [Zeal](https://gateatzeal.com/blogs/mistakes-students-make-in-gate-preparation/)).
- Voices: [ElevenLabs vs Kokoro](https://www.evidique.com/comparisons/elevenlabs-vs-kokoro/), [free alternatives](https://oakgen.ai/blog/free-elevenlabs-alternatives-2026).

## V3.3 Problem statement (proposed)

Built only on official numbers (IIT Guwahati GATE 2026 report) and the common themes above:

> **2,11,020 students sat GATE CS 2026. Only 40,661 qualified.**
> Most of them did not lack effort. They lacked direction: scattered PDFs, previous-year questions solved but never reviewed, mocks taken but never analysed.
> **RENYXERA turns practice into progress.**

On screen: the two numbers count up, then "Effort was never the problem." / "Direction was." Then the brand.

## V3.4 Story (as built, 58 s, 4K 16:9, 120 BPM; 1 bar = 2 s)

| Bars | Scene | On screen (real app, live, signed-in demo account with Pro) | Voice |
|---|---|---|---|
| 3 | Hook | 2,11,020 counts up; then 40,661, "Fewer than 1 in 5"; source line | "Over two lakh students sat GATE CS in 2026. Fewer than one in five qualified." |
| 2 | Turn | "Effort was never the problem. / Direction was." | same |
| 1 | Logo | Mark and wordmark hit on the drop | "Meet Renyxera." |
| 4 | 01 Pick | Exam setup: deployment, section, subject, topic menus open and close; Generate; real blueprint; callouts 1-2-3 | "Pick a section, a subject, a topic..." |
| 3 | 02 Solve | Real question answered correctly; calculator 30, cos = 0.866...; Save & next; loupe on the timer | "Real previous year questions, in a real exam screen." |
| 2 | 03 Know | Real results page; callouts on the score cards and Review answers | "Then see exactly where you stand." |
| 2 | 04 Improve | Pro analytics: smart insights, adaptive path, trend chart | "Your weak topics, found for you." |
| 3 | 05 Plan | Study plan tool: hours slider dragged, two sections marked weak, hours update | "And a plan that fits your hours." |
| 2 | Free tools | Official cut-offs table; marks slider dragged; GATE score updates | "Official cut-offs and a score calculator. Free." |
| 2 | Plus & Pro | Live plans page: Plus ₹29 and Pro ₹99 called out | "Go further with Plus. Or go all in with Pro." |
| 2 | New, and next | NEW: Civil Engineering, GATE-level practice questions. COMING SOON: Flashcards, College predictor | "New papers and practice. And more on the way." |
| 3 | End | Logo, tagline, URL | "Renyxera. A new era of intelligent learning." |

## V3.5 Production pipeline (built)

1. `scripts/simulate-app.mjs` (run with `node --env-file=.env.local`): drives the real app with a frozen clock, one frame per 1/30 s, at 3840x2160, with Chrome's GPU rasteriser (about 0.5 s a frame instead of 4.5 s). Signed in as the demo account `justforpersonal7774@gmail.com` (admin magic link, no password; a 30-day admin Pro grant was added on 15 Oct so Pro screens show). `SEED=1` gives the account real history by taking topic tests at about 70 percent accuracy; `PEEK=/route` checks a page. A persistent browser profile (`video/.profile`) keeps the local history between runs.
2. `video/src/Film4k.tsx`: stage, window, camera, callouts, loupe, type; each take is time-warped so its clicks land on beats.
3. `video/scripts/make_launch_audio.py`: 120 BPM track on the edit's bar grid, effects, Kokoro voice `af_heart`.
4. `npx remotion bundle src/index.ts --out-dir=.bundle` then `npx remotion render .bundle Film4k out/renyxera-film-4k.mp4 --crf=16`.

## V3.6 New and upcoming features shown

NEW (owner, 15 Oct: "we will be implementing them right away"): Civil Engineering paper, GATE-level generated practice questions. **Do not publish the film until both are live**, or the claim is false. COMING SOON: flashcards, college predictor.

## V3.7 Open items

- Real answers on screen vary per take (the results take records whatever the simulated attempt scored). Re-run `simulate-app.mjs results` if a stronger score is wanted.
- AI Mentor and Telegram are not filmed yet (the AI Mentor answer costs AI quota; Telegram needs a test chat). Add them as takes when approved.
- Cut-downs (30 s, 15 s) and 9:16 not built for v3 yet.
- ElevenLabs (paid, $6+) would sound more natural than Kokoro if budget allows.

---

## History: version 2 brief

This is the **only** promo-video document. It merges the original brief, the three enhanced prompts (the ENHANCED file, the V2 upgrade and the "Premium interactive-feeling product film" version) and the Claude production instructions that came with them. Where they disagreed, the rule that protects truthfulness won.

Goal: a premium, animated product film for GATE aspirants that makes them think "I need this", built from **real footage of the real product**, with **no watermark**, at **₹0**.

Product: RENYXERA, "A new ERA of Intelligent Learning". Site: https://gate.renyxera.workers.dev/

---

## 0. Decisions and status (updated 15 Oct)

| Topic | Decision |
|---|---|
| Aspect ratio | **16:9 (1920x1080) is the master.** Other standard sizes are derived: 9:16 (1080x1920) for Reels and Shorts, 4:5 (1080x1350) for the Instagram feed. Desktop footage is recomposed for the narrow formats, not stretched |
| Product scenes | **Animated re-creations, not raw footage and not screenshots** (your instruction on 15 Oct: do not use the site's screenshots or video as is). Each screen is rebuilt in React in `video/src/ui.tsx` from the real layout, labels, questions, numbers and score formula, then animated with a cursor, clicks, opening menus, counters and a camera that glides between the controls. Real recordings made with Playwright (`scripts/record-promo.mjs`, saved in `video/captures/`, git-ignored) were the reference for the layout and the check that the re-creation matches the live product |
| Editor | Remotion project in `video/` (editable source, React). Remotion is free for individuals; check the licence page if the team grows beyond 3 people |
| Skills | The instructions mention "Official Remotion Agent Skills" and "Video Shotcraft". **Neither is installed in this environment** (checked: no such skill folders and none in the skill list). I used Remotion's documented APIs directly and applied the same shot-craft rules written in sections 7 and 9. Nothing was run under those names |
| Audio | Voiceover with `edge-tts` (free). Music and sound effects are **generated by script** (`video/scripts/make_audio.py`), so there is no third-party licence to track |
| Features that need a sign-in (Planner, Analytics, AI Mentor, Telegram, All-India mock, leaderboard) | **Not re-created.** Their screens are not invented. The film names them on a plain "Plan. Remind. Ask. Improve." card. When you provide recordings or approve designs, they are added as UI scenes |
| Interactivity | An MP4 cannot be clicked. The film is "interactive-feeling" (real cursor, clicks, expanding menus, guided zooms). A real clickable walkthrough is a separate companion demo (section 11) |

Status of work is tracked in section 14 so planned and finished work are never confused.

---

## 1. Production stack (all free, no watermark)

| Layer | Tool | Notes |
|---|---|---|
| Screen footage | Playwright with the DevTools screencast or recordVideo | Repeatable. A fake cursor and tap ripple are drawn in the page so they appear in the recording |
| Edit and motion | **Remotion** (React) | One composition per size, one data file for the story, so every cut renders from the same source |
| Voiceover | `edge-tts`, voice `en-IN-NeerjaNeural` | Draft quality. Replace with your own voice for the final if you can: trust beats polish |
| Music and effects | Generated in Python (numpy). Original, no licence needed | Soft pad, pulse and light plucks around 100 BPM, with click, whoosh, chime and pop effects |
| Captions | Built from the script timings and drawn by Remotion | Always on |
| Not allowed | Watermark removal tools, cracked software, unlicensed music, free AI video plans that stamp a mark | If a tool needs a paid plan to remove its mark, skip it |

"ai-video-editor" (the GitHub repo you mentioned): not used. I cannot vouch for a repo by name. Before adopting any repo check the last commit (within 6 months), a commercial-use licence (MIT or Apache 2.0), stars, and read what it uploads.

---

## 2. Essence, audience, tone, brand

**Essence:** "Your GATE preparation, organised in one calm place: real past questions, a plan that fits your day, and a clear view of where to improve."

**Audience:** GATE 2027 aspirants (CS, DA, EC, EE, ME), 20 to 25, phone-first, price-sensitive, tired of scattered PDFs, tabs and chats.

**Viewer journey:** recognition ("that is my desk") → relief ("one place") → proof ("I can see it working") → possibility ("I can start free") → action ("open the site").

**Tone:** warm, confident, quick. A senior who has been through it. No "revolutionary", no fear, no rank promises, no shaming.

**Brand:** use the site's own look. Cyan to blue to violet to magenta ribbon (the "ERA" gradient `#06c2fb → #5b21e0 → #dd42fb`), soft light surfaces, rounded cards, Bruno Ace SC for the product name only, the real mark in `public/brand/`. Never redraw or distort the logo. The logo is the payoff at the end, not the opener.

---

## 3. Truth rules (non-negotiable)

1. Product scenes are re-creations of **real screens with real content** (real question text and options, the official GATE 2026 cut-off numbers and score formula, live plan prices). Never invent screens for features that were not captured, nor questions, analytics, AI answers, ranks, user counts, testimonials or results. Where a result screen is a demo (the practice results), the film says "Sample practice session" on screen.
2. A feature that cannot be seen in a logged-out browser is **not missing**. Mark it "capture required" and keep it in the plan.
3. Never promise a rank, score or selection. Never say "guaranteed", "best", "No. 1".
4. Use a demo or guest session. Never show a real student's name, email, phone, payment, Telegram chat or token.
5. Verify on the day of export: prices, plan terms, branches, the GATE year of any data, and every link.
6. Numbers shown on screen come from the product (for example the official GATE 2026 cut-offs page), not from the edit.
7. If a tool puts a watermark on a result, do not use it.

Verification status labels used in the shot list: **Observed** (seen live in guest mode), **Brief** (in this document, not yet captured), **Capture required** (needs a signed-in session or your recording), **Verify before publishing** (time sensitive).

---

## 4. Feature inventory and capture status

| Feature | What to show | Status |
|---|---|---|
| Practice: Section, Subject, Topic pickers, Generate blueprint | The three drop-downs narrowing the choice, then the blueprint card | **Observed**, captured (guest) |
| Exam screen with timer and virtual calculator | Answer a question, open the calculator, compute | **Observed**, captured (guest) |
| Results and review | Score, accuracy, per-question review | **Observed**, captured (guest) |
| Shared General Aptitude and maths pool with year and paper tags | Tag chip on a question, larger subject lists | Brief; tag visible in the exam capture |
| Free tools: official GATE 2026 cut-offs for six papers, score calculator | Table, slider moving, result | **Observed**, captured |
| General Aptitude lessons | Lesson cards and tips | **Observed**, captured |
| Plans and pricing (Free, Plus ₹29 a month, no auto-renewal) | Pricing page | **Observed**, captured; **Verify before publishing** |
| Study planner (free-hours windows, countdown, spaced revision, progress) | Availability, generated plan | **Capture required** (sign-in) |
| Analytics (topic accuracy, weak topics, time per question) | Dashboard and analytics | **Capture required** (sign-in) |
| AI Mentor | A real question and the real answer | **Capture required** (sign-in) |
| Telegram bot (block reminders, mock reminders a day before, 5 PM evening before, 30 minutes before, morning digest, weak-topic nudge for Pro) | Real bot chat from a test account | **Capture required** (Telegram test account) |
| All-India mocks, leaderboard and rank | Mocks page during a live event | **Capture required** (live mock and test account) |
| Branches CS, DA, EC, EE, ME | Branch picker | **Capture required** (sign-in) |
| Light and dark themes, phone layout | Theme toggle, phone recording | Brief; add a phone clip in the 9:16 recompose |

---

## 5. THE MASTER PROMPT (paste into Claude, ChatGPT or Gemini when you want a new plan or a rewrite)

```text
ROLE
You are a combined product-film director, motion designer, UX storyteller, conversion copywriter,
video editor, Remotion engineer and factual-QA lead. Produce a premium, calm, modern film for RENYXERA,
not a slideshow, template ad or generic AI montage. Be specific enough that a small team can execute it.

PRODUCT
RENYXERA, "A new ERA of Intelligent Learning", https://gate.renyxera.workers.dev/
GATE preparation web app for Indian engineering students.
Features (use ONLY these; show them only with real footage or mark them "capture required"):
- Real GATE past-paper questions with solutions, by section, subject or topic; timed tests with a virtual calculator.
- Shared General Aptitude and overlapping maths questions across branches, tagged with year and paper.
- All-India mocks with leaderboard and rank.
- Study planner around free hours, with exam countdown, spaced revision and progress view; automatic scheduling for Plus and Pro.
- Telegram bot: block reminders, timers and alarms, mock reminders (a day before, 5 PM the evening before, 30 minutes before),
  morning digest, weekly weak-topic nudge for Pro.
- Analytics: topic accuracy, weak topics, time per question.
- Free tools: GATE score and cut-off calculator (official GATE 2026 data), branch cut-offs, General Aptitude lessons.
- Branches: CS, DA, EC, EE, ME. Free to start, Plus Rs 29 a month, Pro higher; one payment, no auto-renewal (verify before export).
- AI Mentor, light and dark themes, phone support.

SOURCE OF TRUTH
Inspect the live site in a real browser. The list above is a brief, not a suggestion. A feature that a logged-out view cannot
reach is not absent: mark it "capture required" and keep it. Label every scene Observed / Brief / Capture required / Verify before
publishing. Never fabricate UI, data, AI output, ranks, counts, testimonials or claims.

AUDIENCE AND GOAL
GATE 2027 aspirants, phone-first, price sensitive, overwhelmed by scattered resources. Goal: visit the site and start free.
One call to action per cut. Telegram only if the owner supplies the exact link.

DELIVERABLES
Master 16:9 (1920x1080, 30 fps) of 75 to 90 s, plus 45 s, 30 s and 15 s cuts rewritten for their length (not sped up),
9:16 and 4:5 recomposed (not cropped), a 6 to 10 s silent website loop, captions (.vtt), and an asset manifest.
A normal video is not clickable: if clicking is required, specify a separate companion web demo.

STORY (five beats)
1 Interrupt: a recognisable problem in the first 2 seconds, no logo opener.
2 Reframe: one calm place for practice, review and planning.
3 Prove: three or four connected workflows in real UI (choose, attempt, review, improve), with visible cause and effect.
4 Feel the difference: clarity and a next step, never guaranteed results.
5 Act: brand, URL, one call to action.

CREATIVE SYSTEM
Match the site: ribbon gradient accents, soft light surfaces, rounded cards, Bruno Ace SC for the name only.
Motion with purpose: cursor easing, real clicks with a ripple, guided zooms into the control being used, mask reveals,
match cuts (question card to result card), progress that fills when the real step finishes. Most micro motion 180 to 450 ms,
scene changes 450 to 800 ms, one easing family. A cut or visual change every 1.5 to 3 seconds; let complex actions breathe 3 to 5 s.
Kinetic type for emotional lines only, 3 to 7 words per caption, high contrast, inside safe zones.
Sound: soft pad and pulse about 95 to 115 BPM, light clicks, restrained whooshes, one chime. Duck music under voice. Warm, natural Indian English voice.

OUTPUT (use these headings)
1 Concept and one-sentence promise. 2 Evidence status table. 3 Three hooks, ranked. 4 Master script table
(Time | Beat | Actual page | Action | Motion | On-screen text | Voiceover | Sound | Claim status).
5 45, 30 and 15 second scripts. 6 Capture checklist (route, start state, clicks, result, duration, data, owner, retake).
7 Motion and sound spec. 8 Voiceover paragraphs with pace and pronunciation notes. 9 16:9, 9:16 and 4:5 recompose notes.
10 Optional companion web demo. 11 Social captions, pinned comment, cover ideas. 12 Remotion plan and commands.
13 QA checklist. 14 A/B plan. 15 Open questions (only genuine blockers).

FINAL TEST
Does the first second stop a GATE student who has never heard of us? Is every feature real or flagged? Does it make sense muted?
Is every claim honest? Is the next step obvious? If not, revise before delivering.
```

---

## 6. The film: story and shot plan (16:9 master)

Story arc: **scattered → one calm place → choose → attempt → understand → everything else in your reach → free to start.**

| # | Beat | Footage | Motion and interaction | On-screen text | Voiceover | Status |
|---|---|---|---|---|---|---|
| 1 | Interrupt (0 to 6 s) | Motion graphics only: study chips (PDF, Notes, Video, Chat, Sheet, Mock) drift, overlap, then collapse to one point. No product UI | Spring drift, then converge | "Too many tabs for one exam?" | "Too many tabs. Too many PDFs. And still, you are not sure what to study next." | n/a (graphic) |
| 2 | Reframe (6 to 14 s) | Live home screen | Camera push-in, cursor moves toward Practice | "One calm place." | "RENYXERA brings your GATE preparation into one calm place." | Observed |
| 3 | Choose (14 to 28 s) | Practice screen: Deployment type, Section, Subject, Topic, Generate blueprint | Guided zoom on each picker as it opens; blueprint card glides in | "Section. Subject. Topic." | "Pick a section, a subject and a topic, and your practice set is ready in seconds." | Observed |
| 4 | Attempt (28 to 42 s) | Exam screen: question with year and paper tag, answer, virtual calculator, timer | Zoom to timer, then calculator keypad as keys press | "Real questions. Exam style." | "Solve real GATE questions in an exam style screen, with a timer and a virtual calculator." | Observed |
| 5 | Understand (42 to 54 s) | Submit dialog, results and review | Match cut from the answered card to the result card; scroll to review | "See exactly how you did." | "Then see exactly how you did, so the next session starts with a clear target." | Observed |
| 6 | Everything else (54 to 64 s) | Text cards only (planner, Telegram, AI Mentor, analytics) with a note in the manifest: replace with owner captures | Chips slide in with icons | "Plan. Remind. Ask. Improve." | "A study planner built around your free hours. Reminders on Telegram. An AI mentor when you are stuck. Analytics that point at weak topics." | Capture required for UI |
| 7 | Free tools (64 to 74 s) | Branch cut-offs table, slider moving, General Aptitude lessons | Cursor drags the marks slider, result updates | "Free tools. Official 2026 data." | "Free tools too: official GATE twenty twenty six cut offs for six papers, a score calculator and General Aptitude lessons." | Observed |
| 8 | Access (74 to 82 s) | Plans page | Scroll to the plan cards, no price animation | "Start free." | "Start free. Plus is twenty nine rupees a month, one payment, no auto renewal." | Observed, **Verify before publishing** |
| 9 | Act (82 to 90 s) | Brand mark, wordmark, tagline, URL on a branded gradient | One soft pulse on the URL | "Start your next practice session." | "Renixera. A new era of intelligent learning. Visit the site and start your next practice session today." | Asset |

Connectors (match cuts) between scenes: choice → attempt (the blueprint card expands into the question), attempt → result (the answered card becomes the score card), result → plan (the weak-topic line becomes a planner block, **only when the signed-in planner capture exists**).

### Cut-downs (rewritten, not sped up)

- **45 s:** beats 1 (3 s), 2 (5 s), 3 (9 s), 4 (9 s), 5 (7 s), 7 (5 s), 9 (7 s).
- **30 s:** beats 1 (3 s), 3 (7 s), 4 (7 s), 5 (5 s), 9 (8 s).
- **15 s:** hook (2 s), choose and attempt (7 s), result (3 s), CTA (3 s).
- **Silent website loop (8 s):** choose, attempt, result, repeat. No audio, no essential text only in sound.

### Formats

| Format | Size | Use | Recompose note |
|---|---|---|---|
| 16:9 master | 1920x1080, 30 fps | Website hero, YouTube | Footage large on the right, headline and captions on the left |
| 9:16 | 1080x1920 | Reels, Shorts | Phone-layout capture, big zooms, captions in the middle third, keep 10 percent clear at the edges and 250 px at the bottom |
| 4:5 | 1080x1350 | Instagram feed | Centre the key control, captions below |

---

## 7. Shot craft and motion system (applied in code)

- First frame of every scene already shows its subject. Never fade up from black into nothing.
- Cursor: eased paths of 450 to 800 ms, a short hold, then the click with a ripple. No circles, no wandering.
- Guided zoom: 100 to 125 percent into the control being used, then back out. One zoom per beat.
- Cuts every 1.5 to 3 s, except two deliberate 3 to 5 s holds on the exam screen and the results.
- Typography: Bruno Ace SC only for the name. Everything else in the product's UI sans. Two levels at once at most.
- Caption rules: 3 to 7 words, bottom third on 16:9, white on a soft dark glass pill for contrast.
- Colour: ribbon gradient only as accent (headline underline, transitions), never a wash over the product footage.
- Transitions: gradient wipe only for the big changes (problem → product, product → CTA); everything else is a cut or a match cut.
- Reduce motion where it hides information: pause for 1 s on every result you want read.

Sound design: pad and pulse enter at the reframe, a restrained click on every real click, a soft whoosh on the big transitions, one chime on the result, ending resolve. Music at about 12 percent under the voice, with a dip while the voice speaks. Loudness target about -14 LUFS.

---

## 8. Capture plan and privacy

Run: `npm run build && npx next start -p 3000` then `BASE=http://localhost:3000 node scripts/record-promo.mjs` (all scenes) or add a scene name (`home`, `practice`, `tools`, `plans`). Output goes to `video/public/clips/<scene>/`.

| Scene | Route | Start state | Actions | Result state |
|---|---|---|---|---|
| home | `/` | Guest, splash skipped | Pause, scroll down and back | Home hero |
| practice | `/setup` then the exam and results | Guest | Deployment type → Topic Spotlight → Section → Subject → Generate blueprint → Deploy → answer → calculator (30, cos) → Save & next → Submit → Confirm → See results → scroll review | Results screen |
| tools | `/tools/gate-branch-cutoffs`, `/ga-lessons` | Guest | Scroll table, drag slider, open lessons | Calculator result, lessons |
| plans | `/pro` | Guest | Scroll to plan cards | Plans visible |

Owner captures still needed (give me the files and I will cut them in): planner (availability window, generated plan, countdown), analytics (weak topics, time per question), AI Mentor (a real question and answer), Telegram (link flow, a block reminder, a mock reminder), All-India mock (entry and leaderboard in a live window), branch picker, phone layout and dark theme. Record each as its own clip with 1 to 2 s of stillness before and after the action, on a **demo account** with sample data.

Privacy checklist: no real names, emails, phones, payments, tokens or private chats on screen; hide browser chrome and notifications; log each clip (date, route, build, account type, verification status).

---

## 9. Voiceover scripts

Voice: warm Indian English, 135 to 150 words per minute, small pause after "real questions", "weak topics" and "start free". Pronunciation of the name to confirm with the owner (drafts say "Renixera").

**Master (about 75 s)**
"Too many tabs. Too many PDFs. And still, you are not sure what to study next. Renixera brings your GATE preparation into one calm place. Pick a section, a subject and a topic, and your practice set is ready in seconds. Solve real GATE questions in an exam style screen, with a timer and a virtual calculator. Then see exactly how you did, so the next session starts with a clear target. A study planner built around your free hours. Reminders on Telegram. An AI mentor when you are stuck. Analytics that point at weak topics. Free tools too: official GATE twenty twenty six cut offs for six papers, a score calculator and General Aptitude lessons. Start free. Plus is twenty nine rupees a month, one payment, no auto renewal. Renixera. A new era of intelligent learning. Visit the site and start your next practice session today."

**15 s teaser**
"Too many tabs for one exam? Practise real GATE questions and see where you stand. Start free with Renixera."

---

## 10. Hooks to A/B test (first 2 seconds)

1. **Problem:** chips collapse to a point: "Too many tabs for one exam?"
2. **Question:** the exam screen with the timer already running: "Can you solve this in 90 seconds?" (use a real captured question)
3. **Clarity:** the picker narrowing Section → Subject → Topic: "Know what to practise next."

Keep the winning hook after 48 hours (3-second hold and average watch time), change one variable at a time.

---

## 11. Interactive companion (the video itself is not clickable)

If real clicking is wanted, build a separate page, `/tour`, with the real components in demo states:

- Welcome card: "What do you want to improve first?" with four cards (Practise questions, Plan my time, Find weak topics, Free tools).
- Each card opens a short guided step list with Next and Back, a progress indicator and captions.
- Practice step: a real picker with sample choices that links to `/setup`. Tools step: the real calculator component.
- Keyboard and touch accessible, visible focus, reduced-motion respected, no autoplay audio.
- Privacy: count only "tour started", "path chosen", "tour finished", "CTA clicked"; nothing about study data.
- Label sample data as sample. Never present a demo as a saved account action.

Status: not built. Say the word and I will build it after the film is approved.

---

## 12. Publishing pack

**Caption:** "GATE prep can get scattered across PDFs, tabs and chats. RENYXERA brings real past questions, practice by topic, review and free tools into one place. Start free: https://gate.renyxera.workers.dev/"

**Pinned comment:** "Which paper are you preparing for: CS, DA, EC, EE or ME? What is hardest right now: practice, revision or planning?"

**Cover ideas:** (1) tabs collapsing into one clean screen, headline "GATE prep, organised"; (2) a crop of the real picker with "Section. Subject. Topic."; (3) the real results card with "See exactly how you did". No stock photos of smiling students.

**Links:** add UTM tags (`utm_source=youtube|instagram`, `utm_campaign=product_film`, `utm_content=hook_a`). Test each link before posting.

---

## 13. Skills needed (and what replaces each)

| Skill | Free way |
|---|---|
| Hook writing and short scripting | Section 10 and the master prompt |
| Screen capture | `scripts/record-promo.mjs` (Playwright) or OBS |
| Editing and motion | Remotion (React basics) or DaVinci Resolve (free, no watermark) |
| Voiceover | `edge-tts`, or your own voice in a quiet room |
| Music and sound | `video/scripts/make_audio.py` (original) |
| Captions | Built from the script timings |
| Brand consistency | Reuse the site's gradient, type and mark |
| Platform sizes and safe zones | Section 6 formats |
| Analytics | YouTube Studio, Instagram Insights: 3-second hold, watch time, shares |
| Licensing | Original audio only, and keep a note of any third-party asset |

---

## 14. Work status (planned vs done)

| Item | Status |
|---|---|
| Merged single brief (this file) | Done |
| Real reference captures: home, practice to results, tools, plans (guest, 16:9; plans taken from the live site) | Done (`video/captures/`, not in git) |
| Remotion project `video/` (16:9, master and 45 / 30 / 15 s cuts) with animated UI re-creations | Done, source in `video/src` |
| Voiceover (edge-tts, normalised), generated music and effects | Done (`video/scripts/make_audio.py`) |
| Stills inspected for every scene, 15 s cut rendered and audio level measured, adjustments made (camera framing, loudness) | Done |
| Master, 45 s and 30 s renders | See section 17 for the final state |
| 9:16 and 4:5 recomposes | Not done yet |
| Owner captures (section 8) | Waiting for you |
| Companion web demo (section 11) | Not built |

---

## 15. QA checklist (do not publish until every box is ticked)

Truth
- [ ] Every product screen is a real capture; text-only cards are clearly graphic.
- [ ] No feature declared missing just because it needs sign-in; capture-required items listed.
- [ ] Prices, plan terms, branch list, data year and every link verified on the export day.
- [ ] No private data, tokens or notifications on screen. No fake numbers.

Creative and motion
- [ ] First 2 seconds show a hook, not a logo. A visible change every 1.5 to 3 seconds.
- [ ] One complete choose → attempt → understand workflow is shown with cause and effect.
- [ ] Cursor paths are deliberate; no distorted logo; brand colours consistent.
- [ ] Captions 3 to 7 words, readable on a phone, inside safe zones.

Audio and delivery
- [ ] Voice clear over music; loudness about -14 LUFS; no clipping.
- [ ] Works muted; captions file (.vtt) provided.
- [ ] No watermark; correct size, 30 fps; the one call to action and URL readable for at least 3 seconds.
- [ ] Source project, clips, audio scripts and manifest backed up.

---

## 16. Refresh after every release

Re-record only the changed scene with `node scripts/record-promo.mjs <scene>`, update `video/src/script.ts` for any changed wording or price, re-render all sizes from the same project, review on a phone and a desktop, and save the render with the date and the product build.

---

## 17. Production log (what was built, how to rebuild it)

Files
- `video/src/script.ts`: the story as data (scenes, captions, sound cues, cut-downs).
- `video/src/ui.tsx`: the six animated screens (home, exam setup, exam, results, cut-offs and calculator, plans) and the cursor.
- `video/src/Film.tsx`: the problem scene, "Plan. Remind. Ask. Improve." cards, end card, audio mix, transitions.
- `video/scripts/make_audio.py`: voiceover, music, effects. `video/src/vo.json` holds the voice lengths that set the scene timing.
- `scripts/record-promo.mjs`: records the real site (reference footage and verification).

Rebuild: `cd video && npm install`, `python scripts/make_audio.py`, then `npx remotion render src/index.ts Master out/promo-master-16x9.mp4` (also `Cut45`, `Cut30`, `Cut15`). `npx remotion studio` opens the editor with a timeline.

Checks done: every scene rendered as a still and read for cropping, legibility and brand; the 15 s cut rendered and its audio measured (peak about -2 dBFS, average about -16 dBFS); factual items traced to the live site or the data files (plan prices: Free ₹0, Plus ₹29 a month, Pro ₹99 a month, read from the live site on 15 Oct 2026; cut-offs and the score formula from `lib/seo/gate2026.ts`; the cos 30 = 0.866025403784 calculator result).

Honest limits
- The video was inspected frame by frame and by audio level, not by a person watching it play. Watch it once on a phone and a laptop before posting.
- The voice is a free text-to-speech voice and says "Renixera" as a draft pronunciation. Re-record in your own voice for the final if you can.
- The product scenes are re-creations. If the real UI changes, update `ui.tsx` (or tell me) and re-render.
- Planner, analytics, AI Mentor, Telegram and mocks still need owner captures or approved designs.
- 9:16 and 4:5 are not built yet; the layouts in `ui.tsx` need a narrow variant.
