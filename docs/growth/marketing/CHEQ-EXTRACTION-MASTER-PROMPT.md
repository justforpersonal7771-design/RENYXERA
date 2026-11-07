# Master prompt: extract everything from a reference ad

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
