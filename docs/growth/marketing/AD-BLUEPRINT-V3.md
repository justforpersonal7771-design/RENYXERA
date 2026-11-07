# RENYXERA ad blueprint v3 (30 s), built on what the CheQ ad actually does

[← Docs index](../../README.md) · [Creative brief and v1/v2 critique](AD-CREATIVE-BRIEF.md) · [Owner tasks](../../open-work/OWNER-TASKS.md)

Written 7 Nov 2026 after watching the reference ad frame by frame (CheQ UPI launch, 50 s, 7 Sept 2026; the owner supplied the file). This replaces the v2 script in the brief.

## 1. What the CheQ ad does (observed, by timestamp)

| Time | What is on screen | Technique to copy |
|---|---|---|
| 0.0 to 3.0 | White. A giant ghost word ("Wrong App?") behind a collage: photos of people paying, floating white UI chips ("Paid Successfully", "₹1175") | A **pattern interrupt**: a question that names the old way as the flaw |
| 4.5 to 12 | "Your RuPay Credit Card", then "you [QR scanning] scan", full-bleed photos with one word on each ("Groceries", "Medicines") | **One word per shot**, 1 to 1.5 s each, motion-blurred in |
| 13.5 to 19.5 | Pale-blue field: "and what do you get after every payment?" with small bill chips; dark field: ghost "Paid / That's it?" with a white notification card ("Amount Debited") tilted on top; "Do More" repeated in blur | **Ghost word + small notification card**: the pain, shown as a UI moment |
| 21 | The product lock-up on a bright green field with four sparkle marks | The **hard stop and reveal**: colour changes completely |
| 22.5 to 25.5 | A phone: "Earn 1.5%", a card dropping into a slot, "Linked Successfully", a QR scan | The interface is **drawn, simplified and animated**, not recorded |
| 27 to 36 | Purple field "And Earn Guarantee", dark field "1.5% CheQ Points", "On Every Transaction" with a green seal, "Same RuPay card. Same UPI habit.", green "Now, a lot more Rewarding" | The **offer in four short lines**, each on its own colour field, with big type |
| 36 to 39 | "Scan." / "Scan. Pay." / "Scan. Pay. Done." then "Scan. Pay. Earn." stacked beside a person | A **three-word stack** that becomes the tagline |
| 46 to 50 | QR scan, "Don't just UPI", logo on pale blue | A **plain, quiet end** |

What we do **not** copy: their photographs of people (we have none and will not use stock that reads as stock), and their partner logos.

## 2. Our 30-second structure (same for both builds)

**Hook, pain loop, hard stop, reveal.** The paste's framework, mapped to the evidence above:

| Time | Beat | On screen (flat fields, ink and cream, one blue accent, pastel tints) | Sound |
|---|---|---|---|
| 0.0 to 2.0 | **Hook** (flaw named) | cream field, ghost "Wrong?", **−0.67** slams in at frame 0, a tilted white notification card: "Marks deducted, −0.67" | boom at frame 0 |
| 2.0 to 6.0 | **Pain loop** (daily habit, syncopated) | four 1-second single-word cuts on four colour fields: **Solve. Check. Wrong. Again.** each blurred in, with a tiny chip in a corner (Mock test, Answer key, Score) | a kick on every word |
| 6.0 to 8.0 | **Hard stop** | cut to ink, **silence**, a clock face, "11:47 PM. Nobody to ask why." | drums stop, a quiet tick |
| 8.0 to 10.0 | **Turn** | the blue field, "Until now." then the wordmark | big hit, beat returns |
| 10.0 to 17.0 | **Reveal: the AI Mentor** | ink field, ghost "Mentor", "Meet your AI Mentor.", a question card, the wrong tap and −0.67 stamp, then the Mentor card writing its answer line by line, the right answer goes green | beat |
| 17.0 to 19.0 | Proof 1 | butter field, "10 years of real GATE papers." with 2017 to 2026 chips lighting up | hit |
| 19.0 to 21.0 | Proof 2 | mint field, "300+ original questions. In no past paper." | hit |
| (landscape) 21.0 to 23.5 | Battles | rose field, "Challenge a friend." result card | hit |
| 21.0 to 25.0 (V) / 23.5 to 26.5 (H) | **Stack** | blue field, **Practise. Understand. Improve.** stacked large, the last word highlighted | rising pad |
| 25.0 to 30.0 (V) / 26.5 to 30.0 (H) | Action | ink field, "Start free." button, "Link in bio" (V) or the address (H), wordmark | final hit and chime |

**Voice-over (optional).** Default: none, because the type carries every line. If you want one: a calm, direct male or female English voice, about 150 words per minute, lines only on the Hook ("Every wrong answer costs you marks."), the Break ("And at 11:47 PM, nobody tells you why.") and the Reveal ("Meet your AI Mentor. It explains why."). The project already has local voice tooling (Kokoro, Chatterbox); no paid service is needed.

## 3. Design rules (all enforced in code)

- Flat colour only: cream `#FAF8F5`, ink `#18181B`, blue `#0A4FD0`, and the app's own tints (mint, butter, rose, sky). **No gradients, glows or particles.**
- Display type: Manrope 800 at 120 to 520 px with tight tracking; the brand face (Bruno Ace SC) only for the wordmark. The supplied logo files contain a purple-pink gradient, so the wordmark is drawn as flat text.
- Motion: hard cuts on the beat; a flat colour block wipe at each cut; words blur in over 6 frames with a snappy `cubic-bezier(.16,1,.3,1)`; cards use a spring with a small overshoot.
- Interface is **drawn in the film**: ink-edged cards with an offset shadow, rounded chips, the app's pastel tints. It is a simplified depiction, not a recording.
- Safe zones for the vertical build: nothing important in the top 180 px or bottom 340 px.

## 4. Claims check (every line on screen is true)

−0.67 is the GATE penalty for a wrong 2-mark multiple-choice answer. "10 years of real GATE papers" = 2017 to 2026 papers in the bank. "300+ original questions" = 329 live for CS on 6 Nov 2026. "Free to start" = the Free plan exists. The Mentor text is a correct worked answer (a minimal DFA for binary numbers divisible by 3 needs 3 states). The Battles card uses the placeholder "A friend", and "Rating +12" is the real Elo change for a win between equal ratings (K = 24).

## 5. Interactive web preview

**Not built yet.** The earlier plan was a `components/marketing/ad-preview.tsx` component using `motion/react`. The ad is rendered with Remotion instead, which already gives an exact, frame-accurate preview in Remotion Studio (`cd video && npm run studio`, compositions `AdVertical` and `AdLandscape`). A browser component can still be added later for a landing-page section. Details of how the build changed after the analysis: [CHEQ-ANALYSIS.md](CHEQ-ANALYSIS.md).
