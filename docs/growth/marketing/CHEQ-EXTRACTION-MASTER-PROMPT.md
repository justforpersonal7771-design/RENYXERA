# Master prompts: (1) extract a reference ad, (2) give a model the whole product

[← Docs index](../../README.md) · [Ad blueprint v3](AD-BLUEPRINT-V3.md) · [Creative brief](AD-CREATIVE-BRIEF.md)

Use this with a model that **accepts video and audio input** (for example Gemini in Google AI Studio: upload the `.mp4`, paste the prompt). Claude here can look at still frames but cannot hear sound or judge exact timing between frames, so this prompt asks for exactly the things frames cannot give: timing to the tenth of a second, motion curves, and the audio. Paste the model's answer back and the ad can be matched much more closely.

Reference file supplied by the owner: `ad/CheQ UPI is FINALLY Here Scan Pay and Earn rewards_1080p.mp4` (50 s, 16:9).

## The prompt (copy everything inside the box)

```
You are a senior motion designer and ad editor. I have uploaded a 50-second fintech app advertisement. I want to recreate its CRAFT (rhythm, pacing, type, motion, colour, sound) for a different product. I do NOT want to copy its logos, photos or exact wording, so describe technique, not just content.

Watch the whole video, including the audio, at least twice. Then answer in the exact sections below. Use timestamps in seconds to one decimal (for example 12.4). If you are not sure about something, say "unsure" instead of guessing. Do not invent anything that is not in the video.

SECTION 1. SHOT LIST (a table, one row per cut or distinct moment, in order; do not skip fast cuts)
Columns: start, end, duration, what is on screen (plain words), on-screen text exactly as written (case and punctuation), background (flat colour / photo / video / pattern), how this shot is entered (hard cut / slide / scale / blur-in / wipe / mask / morph), how it leaves, camera or layer motion (push-in, drift, parallax, none), and the beat or sound it lands on.

SECTION 2. TYPOGRAPHY
Typeface style (geometric sans, grotesque, rounded...), nearest well-known font name, weights used, approximate size relative to the frame height (for example "cap height about 30 percent of frame"), tracking (tight / normal / wide), case, alignment, how many words appear at once, how words are revealed (per word, per letter, whole line), whether motion blur is applied while text moves, and any "ghost" oversize faded words behind the main action (list each with its timestamp and text).

SECTION 3. COLOUR
List every distinct background colour used, in order of appearance, with an estimated hex value and the timestamps where it is used. Then the text colours, the accent colours, and the shadow or border style of any cards. State clearly whether any gradients, glows or textures are used and where.

SECTION 4. INTERFACE AND GRAPHICS
For every UI element drawn in the film (notification cards, phone screens, chips, buttons, QR code, cards, coins, badges, sparkles, confetti, line patterns): timestamp, what it shows, how it is built (flat vector, 3D, photo), how it animates in (spring overshoot, slide, scale, flip), and how long it is held on screen so it can be read. Note which elements are decoration and which carry the message.

SECTION 5. MOTION AND EASING
For the 8 most important animations, describe the motion curve in words and as a best-guess cubic-bezier (for example "fast start, long soft settle, about cubic-bezier(0.16, 1, 0.3, 1)"). Describe any overshoot or bounce, any shake, any squash and stretch, and the typical duration in frames at 30 fps. Say whether transitions are hard cuts, wipes, or morphs and how often each occurs.

SECTION 6. PEOPLE AND PHOTOGRAPHY
How many different people appear, for how long each, how they are framed (full body cut-out on a colour field, hands only, over the shoulder), what they are doing, how they are lit, and how the photos are integrated with the graphics (cut-out, rounded rectangle, full bleed). Do not describe any person's identity.

SECTION 7. AUDIO
a) Voice-over: full transcript with timestamps, voice type (gender, age, pace in words per minute, tone), any music ducking under the voice.
b) Music: genre, estimated tempo in BPM, key mood, where the energy rises and drops (give timestamps), whether there is a deliberate silence or breakdown.
c) Sound effects: every distinct SFX with its timestamp and what triggers it (whoosh on a slide, click on a tap, chime on a success, coin sound, riser, impact).
d) How tightly cuts are synced to the beat (every cut on a beat / most / loose).

SECTION 8. STRUCTURE AND PERSUASION
Label each part of the ad: hook (first 3 s), pain point, pattern interrupt, product reveal, benefit, proof, offer, call to action, end card, with start and end times. Quote the exact line that carries each. State the single main message and any secondary messages. State how many seconds pass before the brand name is first shown, and before the offer is first stated.

SECTION 9. RHYTHM METRICS
Total number of cuts; average shot length; shortest and longest shot; the pacing curve in 5-second windows (cuts per window); how many shots are under 1 second; how many are over 3 seconds.

SECTION 10. WHAT MAKES IT WORK, AND WHAT DOES NOT
As a senior ad reviewer: the 5 techniques most responsible for attention and recall (be specific and cite timestamps), and the 3 weakest moments (cluttered, slow, unclear, too small to read on a phone) with a one-line fix each.

SECTION 11. REBUILD BRIEF
Write a precise brief that a motion designer could follow to build a NEW ad for an AI study-mentor app for exam students (flat colour fields, no gradients, no stock photography), reusing the structure, rhythm, pacing curve, type treatment, easing and sound dynamics you found above. Give a 30-second timeline with timestamps, the on-screen text per shot, the background colour per shot, the transition per cut, and the sound design per shot.

Output format: Markdown with the section numbers and tables above. Be exhaustive and specific. No introduction and no closing summary.
```

## How to use the answer

1. Paste the model's full answer into a new file `docs/growth/marketing/CHEQ-ANALYSIS.md` (or send it to Claude in chat).
2. Claude will diff it against `AD-BLUEPRINT-V3.md`: timing curve, colour order, easing and sound dynamics, then adjust the build and re-run the reviewer pass.
3. If a second reference ad is wanted, run the same prompt on it and ask for Section 8 and 9 side by side.

## Notes

- Do not upload other people's ads anywhere public; AI Studio is fine for private analysis.
- The prompt deliberately asks for technique and says not to copy logos, photos or exact wording.


---

# Part 2: the product-context master prompt (give the model the whole product, let it design the ad)

Use this with any strong model (a video-capable one such as Gemini 2.5 Pro or later in Google AI Studio is a good default, but this prompt needs no video, so any top model works). It does **not** tell the model how the ad should look. It gives the complete, honest picture of the product, the audience, the plans and prices, the rules, and what we can actually produce, then asks the model to act as the creative director and return the full creative direction for two builds: a **vertical** ad (Instagram Reels, YouTube Shorts) and a **landscape** ad (YouTube).

Tip: also attach (1) the CheQ reference ad if you want the model to learn from it, and (2) two or three screenshots of the live site, because a model that cannot browse cannot see the interface. If the model can browse, the prompt tells it to open the link.

Facts below are accurate as of **7 November 2026**. Update the "Status" lines before reusing this later.

## The prompt (copy everything inside the box)

```
You are the creative director, lead motion designer and senior ad reviewer at a top performance-marketing studio. You will design the complete creative direction for a video advertisement for the product described below. I am deliberately NOT telling you what the ad should look like or say. Decide that yourself from the product, the audience and the evidence. If you can open links, review the live site: https://gate.renyxera.workers.dev (home page, /test-centre, /forge, /ai-mentor, /pro for plans, /battles). If you cannot browse, rely only on this document and say which parts you could not check. Never invent a feature, number or testimonial that is not stated here. If something you want to claim is not here, put it in a list called "Needs owner confirmation" instead of using it.

=== 1. THE PRODUCT IN ONE PARAGRAPH ===
RENYXERA ("a new ERA of intelligent learning") is a web app (also installable as a PWA on phone and desktop) for Indian engineering students preparing for GATE, the national postgraduate engineering exam. It combines an exam-identical test interface with official past papers, original GATE-level practice questions, an AI mentor that explains answers, planning and analytics, and friend-versus-friend challenges. Live: https://gate.renyxera.workers.dev (no custom domain yet). Brand wordmark: RENYXERA (display face Bruno Ace SC); interface fonts Manrope (body) and Sora (display); light and dark themes; a pastel card system with ink outlines. Status: live, early stage, no paying customers yet; about 1,200 visitors in the last 30 days. Do NOT imply a large user base, rankings, selections or success stories: none can be claimed.

=== 2. THE AUDIENCE AND THE EXAM ===
- Who: engineering students and graduates in India, roughly 20 to 26, preparing mostly alone, often at night, many cost-sensitive (coaching is expensive), on phones as much as laptops. Languages: English (Hindi later).
- The exam: GATE 2027 runs 6 to 21 February 2027 (IIT Madras). Computer-based, 65 questions, 100 marks. Multiple-choice questions carry negative marking: a wrong 1-mark answer costs 1/3 mark, a wrong 2-mark answer costs 2/3 (0.67). Numerical answer questions have no negative marking. Papers per branch: CS, EC, EE, ME, CE, DA.
- Behaviour we know: students do many past-paper questions, check the answer key, and often cannot find out WHY they got a question wrong; they are anxious about negative marking and time.

=== 3. WHAT IS BUILT AND LIVE (status: live unless marked) ===
PRACTISE AND EXAM
- Official past-paper bank: about 3,250 questions across six branches (2017 to 2026), with images, maths and code rendered properly; the CS bank is verified against the official papers.
- Exam-identical session: countdown timer, question palette, mark for review, save and next, submit confirmation, a virtual scientific calculator (GATE style), server-side grading with GATE rules, results, review, mistakes bank, bookmarks, notes, revision, Flashcards with spaced repetition, a short Checkpoint quiz, diagnostics.
- Test Centre: one hub to Build a test (choose sources, topics, length, rules), Practice, Mocks, History. Sources: official past papers, Forge, Spark (AI-generated questions), Blend (a mix).
- All-India mock tests on a schedule with ranks (free for everyone; rank and results are free).
- Forge: original GATE-level questions written and verified by code, not found in any past paper. 329 live for CS. Free users get a fixed taster of 10 plus Forge Mocks; Plus gets 15 a day with worked solutions; Pro gets unlimited plus the hardest tier and an archive. Each Forge question has a worked solution, a shortcut and a "trap" note.
LEARN AND COACH
- AI Mentor: a chat (history, search, groups, edit, stop, sync across devices) that reads the student's own data (weak topics, recent mistakes, goals) and explains answers, makes plans, quizzes, reviews the last test. Replies support equations, code blocks, tables and lists. A small disclaimer says it can make mistakes. Daily AI allowance: Free a small taster (5), Plus 75 a day, Pro 150 a day. AI Mentor recharge packs (one-off, valid 90 days, any plan including Free): Small Rs 19 for 150K tokens (about 90 short questions), Medium Rs 49 for 450K, Large Rs 79 for 1.2M. Status: purchase flow shipped 7 Nov, not yet tested with a real payment.
- AI Tutor (explain a question, from mistakes and bookmarks), AI practice sets.
- Study planner with calendar, goals slider, a countdown to GATE 2027, heatmap, topic table, Mistake DNA and coach insights, a readiness estimate calibrated on official data.
COMPETE AND ENGAGE
- Battles and Arena: challenge a friend by link or in-app, friends list with presence, Arena Points and an Elo-style rating (win +30, draw +15, loss +8 points), weekly and all-time leaderboards, live lobby with a shared countdown, rematch. Four-week seasons with a Season leaderboard and top-10 badges (built 7 Nov; the first season ends 30 Nov 2026).
- Streaks, achievements, a referral (both sides get 7 days of Pro when the friend finishes a first test), shareable result cards and challenge cards (they show only profile details).
DESIGN AND SHELL
- Floating navbar island, pastel cards, light and dark, a Design Studio with 5 premium "Looks" live (more planned), India time everywhere, phone-first screens, PWA install, offline basics.
PUBLIC SITE AND GROWTH
- Landing pages per branch, a page per past paper and per question, syllabus pages, topic pages, GATE 2027 changes, a cut-off tool, a score calculator, a study-plan tool, a "how we compare" page, legal pages. A Telegram hub plus six branch channels that post one past-paper question daily. Instagram publishing is built but awaits owner account setup. YouTube channel exists; first video not uploaded yet.
OPERATIONS
- Admin-lite page (overview, funnel, tagged links) for one admin; full admin console specified but on hold.

=== 4. PLANS, PRICES AND RULES (exactly as sold) ===
- Free, forever: every official past paper for your branch; the exam simulator and custom tests; All-India mocks and leaderboards (Forge Mocks included: results and ranks free; Forge Mock solutions are Plus and Pro); analytics, mistakes bank and revision; cloud sync; Telegram daily question, countdown, result alerts and a timer; 10 Forge questions to try; a small AI taster; earn more AI requests with sponsor breaks and referrals.
- Plus: Rs 29 per month or Rs 249 per year. Adds: 15 Forge questions a day with worked solutions and Forge Mock solutions, 75 AI requests a day, 5 AI practice sets a day, smart insights and a daily adaptive path, exam trends and AI revision sheets, Study Planner automation, Telegram reminders and alarms, silver avatar styles.
- Pro: Rs 99 per month or Rs 799 per year. Everything in Plus and: unlimited Forge including the hardest tier and the archive, 150 AI requests a day, unlimited AI practice sets, deep analytics, offline downloads, AI re-plan, smart Telegram, all avatar styles, priority fixes.
- GATE season pass: one payment until 31 March after the chosen exam year (priced from the date, always cheaper per month than monthly).
- All plans are one-time purchases for a fixed period. No auto-renewal, no free trial, no lifetime plans. Payments via Razorpay (UPI, cards, net banking). Upgrade from Plus to Pro is prorated.
- Refunds: purchases are final; refunds only for our own errors (double or wrong charge, a payment that did not activate, a fault we cannot fix), by email. Study materials are not refundable once bought (same exceptions).
- Study materials (planned separate paid product, not on sale): subject packs at Rs 99 to 149 plus bundles; a free sample chapter (Deadlock) first; English only at launch.
- Branch rule: a plan is tied to the account's branch (one free change).

=== 5. BUILDING NEXT (status: planned, not yet claimable) ===
Study materials Phase 0; Forge toward 800 CS questions plus Daily Forge, Forge Mocks schedule, a calibration loop; solutions for every question; Microsoft Store and Android packaging; web push; AI Mentor streaming, photo doubts, weak-topic memory; spaced repetition with a daily adaptive set; moderated community; more Looks; Arena rooms; verbal and picture aptitude; other branches' Forge; an admin console; custom domain and branded email once revenue allows.

=== 6. THE BUSINESS SITUATION (so the ad is honest and useful) ===
No paying customers yet. The main problem is attracting first visitors and getting them to start a test (only about 7% of visitors start one). The ad's job: make a GATE student stop, understand in the first seconds what RENYXERA is for, believe it, and start free. Budget for production and ads is Rs 0: everything must be buildable with free tools. The film is built in Remotion (React code) with synthesized sound and no stock footage or photography; we have no filmed footage and no actors. We can draw any interface or graphic as vector animation, and can use the product's real screens or a re-drawn, simplified version of them. A voice-over can be added with local text-to-speech if the direction calls for it.

=== 7. HARD CONSTRAINTS (truth and law, not style) ===
- Every claim must be true today and checkable. No fake urgency, no invented testimonials, no rank, selection or score promises, no guaranteed outcomes, no "India's number one".
- Do not claim the AI is always right; it can make mistakes.
- Do not advertise "no login required"; say "Start free".
- Do not show or imply any real person's data. Names on screens must be placeholders ("A friend").
- Do not use another brand's name, logo, music or footage. Do not copy a reference ad's exact words or images; learn from its technique.
- All times shown should be India time. Prices are in rupees.

=== 8. OWNER PREFERENCES OBSERVED SO FAR (keep or delete this block before sending) ===
The owner has said: the ad should attract users within two to three seconds; it should feel premium and professional, not template-like or "AI-generated" (no purple gradients and glow); it is an advertisement, not a tour of the app; use the interface sparingly; build the interface as design inside the video rather than recording the app; and make two separate builds, one vertical and one landscape. The owner liked the technique of a typographic, colour-field, hard-cut style with a deliberate drop in the sound, as seen in a fintech reference ad (CheQ UPI), but wants an original result.

=== 9. WHAT I WANT BACK ===
Return Markdown with these sections. Be specific and complete; no filler.
A. Audience insight and the one problem the ad solves (with the evidence you used from this document).
B. Positioning in one sentence, the single main message, and two supporting proofs that are true.
C. Three different big ideas for the ad (name, one-line concept, why it would stop the scroll, risks). Then choose one and justify the choice as a senior reviewer would.
D. For the chosen idea, TWO separate creative treatments, composed natively for their own format: (1) vertical 9:16, 1080x1920, for Reels and Shorts; (2) landscape 16:9, 1920x1080, for YouTube. For each: total length and why, the second-by-second timeline, and for every shot: start, end, on-screen text (exact), spoken line if any, what is drawn on screen, background colour, how it enters and leaves, camera or layer motion, the beat or sound it lands on, and the reason the shot exists.
E. Visual theme: palette (hex), type system (faces, weights, sizes relative to frame height, tracking, case), layout grid and safe zones for each format, graphic language (shapes, cards, icons, illustration, how interface is depicted), what to avoid and why.
F. Interface design inside the film: which parts of the product to depict, how simplified, how each is built and animated, how long each is held so it can be read on a phone.
G. Motion and transitions: the transition vocabulary, easing curves as cubic-bezier values, durations in frames at 30 fps, how often each transition is used, what is allowed to move and what must hold still.
H. Sound design: music direction (genre, tempo, energy map with timestamps), every sound effect with its timestamp, voice-over decision (yes or no, and if yes: voice type, pace, full script with timestamps), where the music drops or ducks, final loudness target.
I. The hook: five alternative first-3-second openings for each format with the reason each could work, and which one you recommend.
J. Call to action for each format: exact words, how it appears, how long it holds, where the viewer goes, and what the end card shows.
K. Claims check: a table of every factual statement the ad makes, the source in this document, and a verdict (true, true with caveat, remove). Add "Needs owner confirmation" for anything you wanted to say but could not support.
L. Senior-reviewer critique of your own direction: score it 1 to 10 on hook, clarity, originality, brand fit, honesty, readability on a phone, sound, and likelihood to drive a first test; list the three weakest points and fix them in a revised version of the affected shots.
M. Test plan: how to A/B test the hooks, which metric to read on each platform (for example Reels skip rate, retention at 3 seconds), and what result would make us change the ad.
N. Production brief for a Remotion (React) build: scene list with exact frame counts, the reusable components to build, and the assets needed. Everything must be producible with free tools.

Think step by step, challenge your first idea, and only then write the final answer. Output the final answer only, in the sections above.
```

## What to do with the answer

1. Save it as `docs/growth/marketing/AD-DIRECTION-FROM-MODEL.md` (or paste it to Claude).
2. Claude compares it with the current build (`video/src/Ad.tsx`, notes in [AD-BLUEPRINT-V3.md](AD-BLUEPRINT-V3.md) and [CHEQ-ANALYSIS.md](CHEQ-ANALYSIS.md)), keeps what is better, rebuilds both formats from it, and runs the senior-reviewer pass on the frames before showing you.
3. Anything the model lists under "Needs owner confirmation" comes back to you as questions.

## Keeping this prompt true

Update the facts in sections 1 to 6 whenever plans, prices, features or counts change (the sources are `lib/billing/plans.ts`, `docs/MASTER.md` and `checklist.md`). Never let the prompt claim something the product cannot do yet: the model will build the ad around whatever it is told.
