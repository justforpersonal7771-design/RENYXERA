# CheQ ad: analysis from three model runs, checked against the real frames

[← Docs index](../../README.md) · [Blueprint v3](AD-BLUEPRINT-V3.md) · [Extraction prompt](CHEQ-EXTRACTION-MASTER-PROMPT.md) · [Creative brief](AD-CREATIVE-BRIEF.md)

Written 7 Nov 2026. The owner ran the extraction prompt three times in video-capable models and pasted the answers. I compared them with the frames I extracted from the 1080p file myself (34 frames, one per 1.5 s). Where the models disagree I trust the frames and say so.

## 1. What all three runs agree on (and the frames confirm)

| Finding | Evidence |
|---|---|
| **A voice-over carries every beat**; on-screen type mirrors it word for word | All three give near-identical transcripts ("You have been using the wrong app for your RuPay credit card… Paid. That's it?… Bring it to CheQ UPI… Scan, pay, done becomes scan, pay, earn… don't just UPI it, CheQ it") |
| **Ghost words** behind the action: "Wrong App", "Paid / That's it?", "Do More" | Frames at 1.5, 16.5, 18.0 s |
| **A deliberate dead-air drop** on "Paid. That's it?" (music cut, dark slate field, a plain bank-SMS card) | All three; frame at 16.5 s |
| **Flat colour fields as chapters**: ice blue/white (old way), dark slate (the cost), kelly green (the product), purple (the reward) | Frames; hex estimates agree within a shade (green ≈ `#10B969` to `#22C55E`, purple ≈ `#5842E3` to `#6342E8`, slate ≈ `#152E35` to `#16282E`) |
| **Slam-replacement**: "Scan. Pay. Done." then "Earn." slams over "Done." | All three; frames at 36 to 39 s |
| **Tiny floating UI chips** (bill pills with amounts, notification card, reward pills) rather than full screens | Frames at 1.5, 15.0, 16.5, 39 to 45 s |
| **Hard cuts on the beat** for roughly two thirds of cuts; whips and match-moves for the rest | All three |
| **Brand name appears late** (about 20 s of 50) and the offer later still (about 22 to 27 s) | All three, frames agree |
| **People as colour-field cut-outs** in the proof section, a reward pill popping beside each | Frames at 39 to 45 s |

## 2. Where the runs disagree (so do not trust these numbers)

| Item | Run 1 | Run 2 | Run 3 | My view |
|---|---|---|---|---|
| Cuts | 33 | 32 to 33 | 22 | The frames support 30+; run 3 under-counted |
| Average shot | 1.5 s | 1.5 s | 2.3 s | About 1.5 s |
| Music tempo | 116 BPM | 118 to 120 | 174 (drum and bass) | Not verifiable from frames; do not copy a tempo |
| Voice | female | male | female | Unknown; irrelevant to our build |
| Font | Gilroy/Poppins | Plus Jakarta Sans | Inter/Satoshi | A geometric grotesque with tight tracking; our Manrope 800 is in the same family |

## 3. What this changed in our ad (v3 to v3.1)

1. **Slam-replacement added.** The stack scene is now "Solve. Check. Wrong." and then **"Wrong." is slammed over by "Understand."** (squash, shake, a rose ghost offset for four frames, its own heavy hit), followed by "…and the Mentor tells you why." This is the single technique every run called out as the most memorable.
2. **Ghost words** kept: "Wrong?" behind the hook, "Mentor" behind the reveal.
3. **A notification card on the hook** (the reference's "Amount Debited" pattern): "Marks deducted, −0.67". Enlarged after review so the lower half of the vertical frame is used.
4. **Colour chapters** kept in the same order of meaning: pale for the old way, ink for the silence, blue for the turn, tints for proof.
5. **Cut density**: still lower than the reference (about 2 s per scene against 1.5 s). The one-second word loop and the stack are the fastest parts. A later pass can split the proof scenes.
6. **Reviewer fixes after the render check:** the stack word "Understand." was clipped at the right edge (size reduced); the card stack collided with "In no past paper." in the vertical build (moved to the top right); the question card stayed half on screen in the landscape swap (slide distance fixed).

## 4. What we deliberately do not copy

Partner logos (RuPay, UPI), the reference's photography, the 3D coin and card renders (no 3D toolchain here; flat cards instead), and the voice-over in this first build (on-screen type carries every line; a voice can be added later, the local tools exist).

## 5. Open for the next round

- A voice-over pass (local TTS) with the music ducking 4 to 6 dB under it, as the reference does.
- More cuts in the second half; a person-style proof section is not possible without photography, so it would use drawn cards instead.
- The browser preview component named in the blueprint is **not built yet**.
