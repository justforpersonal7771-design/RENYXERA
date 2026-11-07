# RENYXERA ad: creative brief, script, senior-reviewer critique

[← Docs index](../../README.md) · [Open items](../../open-work/OPEN-ITEMS-2026-11-06.md) · [Shot list (earlier plan)](VIDEO-REBUILD-SHOTLIST.md)

Written 7 Nov 2026. This replaces the "show how the app works" plan. Owner direction (7 Nov): it is an **advertisement**, not a demo; hook within 2 to 3 seconds; premium, flat, no purple gradients and nothing that looks AI-generated; the interface is **drawn inside the video as design** (not screen recordings); two separate builds, **vertical (Reels, Shorts)** and **landscape (YouTube)**; reference ad: CheQ.

**About the CheQ reference.** I could only read the title of the link ("CheQ UPI is FINALLY Here, Scan, Pay and Earn rewards"); I cannot watch video. What I used instead: the general pattern of fintech app ads (flat solid colour, big plain type, a simplified interface drawn and animated in the film, one benefit per scene, reward moments). If you send 5 to 8 screenshots of frames from that ad, I will match it more closely.

## 1. Brief

- **Audience:** GATE CS aspirants in India, 20 to 26, studying alone at night, wary of expensive coaching.
- **Insight:** the worst part of preparing alone is a wrong answer at 11 pm with nobody to tell you *why*. GATE also takes marks away for it (negative marking).
- **Single message:** *RENYXERA tells you why you got it wrong.*
- **Proof (only true, checkable things):** 10 years of real GATE papers (2017 to 2026); 300+ original questions that are in no past paper (329 live for CS on 6 Nov); free to start.
- **Action:** start free (vertical: "link in bio"; landscape: the address).
- **Tone:** direct, a little dry, never shouting. No fake urgency, no invented testimonials, no rank or selection promises.
- **Look:** cream and ink, one blue accent, pastel tint blocks from the app's own palette, bold sans type, flat shapes, hard cuts and colour-block wipes on the beat. No gradients, glows, particles or stock icons. The logo appears twice (mid and end); the logo file itself carries the brand ribbon colours and is used as supplied.
- **Sound:** synthesized beat with a deliberate drop (silence and a clock tick) during the "nobody to ask why" beat, then it comes back hard. No voice-over; all meaning is on screen for muted viewing.

## 2. Script v1 (first pass)

1. Black. "One wrong answer."
2. "It costs you marks."
3. "And nobody to ask why."
4. "Until now." (logo)
5. "RENYXERA explains every answer."
6. "10 years of real GATE papers."
7. "329 original questions. Not in any paper."
8. "Challenge a friend. Beat their score."
9. "Free to start. gate.renyxera.workers.dev"

## 3. Senior reviewer's critique of v1 (and the fix for each point)

| # | Problem | Why it matters | Fix in v2 |
|---|---|---|---|
| 1 | The hook is a vague sentence; the real number comes at second 3 | Viewers decide in 1 to 2 seconds. A number is a stronger stop than a sentence | **Frame 0 is already the number: "−0.67"** (what a wrong 2-mark answer costs in GATE). The words follow at 0.3 s |
| 2 | Four features in one 20-second ad | One ad, one message. Four claims dilute all of them | One message ("it tells you why"). Two proofs (10 years of papers, original questions). Battles only in the landscape cut, where there is time |
| 3 | "Explains every answer" | An AI can be wrong; "every" is an overclaim and a trust risk | "RENYXERA explains why." No "every". The AI disclaimer stays in the product |
| 4 | "329 original questions" | The number grows and is CS-only | "300+ original questions", for GATE CS |
| 5 | No human moment, so no reason to care | Ads work on a feeling first | Add the beat **"11:47 PM. Nobody to ask why."** on a dark, quiet frame |
| 6 | The interface is shown as a tour | The owner does not want a tour; a tour makes viewers think "work" | Show **one** wrong tap and **one** Mentor answer, built as clean design in the film, each held long enough to read. Nothing else is interface |
| 7 | The sound would be a constant beat | No dynamics means no emotion | A **drop**: drums stop during the 11:47 beat (clock tick only), then a hit and the full beat on "Until now" |
| 8 | CTA is a long address | Hard to read, nothing to tap | Vertical: "Start free. Link in bio." in a big button shape. Landscape: button plus the address, held 3 seconds |
| 9 | Logo at the start | Starting on a logo is the surest way to be skipped | Logo only at "Until now" and the end card |
| 10 | Slow cuts | Reels reward change every 1.5 to 3 seconds | Scene length 1.5 to 4 seconds, hard cuts plus a flat colour-block wipe on the beat |

## 4. Script v2 (what is built)

Vertical (19 s, 1080×1920) and landscape (22 s, 1920×1080, with the Battles scene added). Each is composed for its own shape, not resized.

| Time (vertical) | Scene | On screen | Sound |
|---|---|---|---|
| 0.0 to 1.5 | Hook | ink background, **−0.67** huge, then "marks. Gone." | boom at frame 0 |
| 1.5 to 4.0 | One wrong answer | a question card is drawn in; a wrong option is tapped, the card turns rose, "−0.67" stamps | beat starts |
| 4.0 to 6.0 | The night | ink, "11:47 PM." and "Nobody to ask why." | **drop**: drums stop, a quiet clock tick |
| 6.0 to 7.5 | Until now | cream, wipe in, "Until now.", logo lockup | big hit, beat returns |
| 7.5 to 11.5 | The payoff | "RENYXERA explains why." and the Mentor card writing its answer; the right option turns mint | beat |
| 11.5 to 14.0 | Proof 1 | "10 years of real GATE papers." with the years 2017 to 2026 lighting up | hit |
| 14.0 to 16.0 | Proof 2 | "300+ original questions. In no paper." | hit |
| (landscape only) 16.0 to 18.5 | Battles | "Challenge a friend." result card | hit |
| 16.0 to 19.0 (V) / 18.5 to 22.0 (H) | Action | "Start free." button, "Link in bio" or the address, logo | final hit and chime |

## 5. Rules for the review after the build

Render a contact sheet of every beat at phone size and at laptop size, then score as the same senior reviewer: hook in 2 seconds, one message, readable at arm's length, motion has a reason, sound dynamics, brand fit, honesty of every claim. Everything must score 8 or more; fix the worst three; repeat. Scores and fixes are written to `video/docs/ad-critique.md`.

## 6. Open points for the owner

- [ ] Send 5 to 8 screenshots (frames) of the CheQ ad you like, so the second round can match it.
- [ ] The question shown in the film is a classic, correct one (the minimum DFA for binary numbers divisible by 3 has 3 states). Say if you want a real past-paper question instead.
- [ ] The film shows "300+ original questions": say if you want the exact live count instead.
