# R26 · Looks and the Design Studio (the whole design of the app, not just colours)

*Plan, 1 Nov 2026 (rewrites the earlier "Themes" plan after the owner's clarification). A **Look** is a complete design of the application: card style, backgrounds, fonts, corners, density, icons, motion and colour together. Students choose a Look, and in the **Design Studio** they can adjust each part and pick fonts. Looks are grouped in three tiers: **Free**, **Plus** and **Pro**. Rules: zero budget (CSS and free fonts only), every Look works in light and dark, every Look passes the single-screen audit and contrast checks, "tease, don't block" for paid Looks, and the exam screen stays fair and fast in every Look.*

## 1. Words we use
| Word | Meaning |
|---|---|
| **Look** | A complete, named design of the app (for example "Paper" or "Neo-brutal Arcade"). One tap changes everything. |
| **Design Studio** | The settings area where a Look is previewed, adjusted part by part, saved as "My look" and fonts are chosen. |
| **Parts** | The things a Look is made of: card style, background, corners, density, accent colour, fonts, icons, motion. |
| **Light / dark** | A separate switch that works on top of every Look. |

## 2. What a Look contains (the design contract)
A Look is a bundle of settings on one page attribute (`html[data-look="paper"]`, and `.dark` for dark). Layout structure never changes between Looks, so every screen is built and tested once. Everything below changes.

| Part | Options | What it changes |
|---|---|---|
| **Cards** | Soft shadow (today), Outline, Hard offset shadow, Glass, Flat, Paper (thin rule), Sticker (tilt and thick edge) | Every card, tile, panel, popover |
| **Background** | Flat, Soft gradient, Grain, Grid, Dots, Paper texture, Aurora (slow animated glow, Pro) | Page and section washes |
| **Corners** | Sharp, Soft, Round, Pill | Cards, buttons, inputs, chips |
| **Density** | Compact, Comfortable, Spacious | Padding and gaps (the single-screen rule is re-checked per density) |
| **Colour** | 7 tint pairs (mint, rose, peach, peri, lilac, butter, sky) plus one accent; 12 ready palettes; custom accent (Pro) | Washes, chips, buttons, charts |
| **Fonts** | Display face, body face, numerals (see section 4) | All text |
| **Icons** | Line (today), Duotone, Filled, Rounded | The icon set weight and fill |
| **Motion** | Calm, Normal, Lively (respects "reduce motion" always) | Hover, reveal, count-up, page transitions |
| **Buttons** | Soft, Solid ink (today), Outline, Hard shadow | Primary and secondary buttons |

**Engine:** the app already uses tokens (`--tint-*`, `--surface`, `--text-*`, `--card-radius`, `--btn`). A Look is a block of overrides for those tokens plus a few new ones (`--card-shadow`, `--card-border`, `--bg-image`, `--density`, `--motion-scale`, `--icon-weight`). **No attribute means Classic pastel** (today's look, untouched), so nothing can break for anyone who never opens the Studio. The choice is saved on the device and, when signed in, on the profile, and applied by a tiny script before first paint (no flash).

## 3. The Looks, in three tiers
Names are working titles. Each Look is a full design, with its own cards, background, fonts, corners and icons.

### Free (always)
| Look | Character |
|---|---|
| **Classic pastel** | Today's look: soft pastels, ink buttons, friendly. The default. |
| **Paper** | Calm exam-hall reading: warm off-white, ink text, thin rules, serif headings, almost no colour. Best for long study. |
| **High contrast** | Black, white and yellow, 2 px outlines, larger text. Accessibility is never a paid feature. |

### Plus
| Look | Character |
|---|---|
| **Midnight** | True dark, indigo accent, glow instead of borders, calm motion. For night study. |
| **Ocean** | Cool blue-teal, crisp white surfaces, round corners. |
| **Sunrise** | Peach and gold washes, warm shadows, lively motion. Motivating. |
| **Forest** | Deep greens and moss, serif accents, grain background. Grounded. |

### Pro (premium)
| Look | Character |
|---|---|
| **Neo-brutal Arcade** | Thick black outlines, hard offset shadows, flat saturated colour, sticker tilts, chunky fonts. The game look (default for the Arena if chosen, see 7). |
| **Aurora Glass** | Frosted glass cards over a slow animated aurora background, thin light borders, soft glow. |
| **Editorial** | Magazine feel: large serif headlines, hairline rules, generous space, restrained colour. |
| **Terminal** | Near-black with green and amber, monospace numerals and labels, square corners, a blinking caret accent. |
| **Blueprint** | Engineer's drawing: deep blue grid paper, white line art, dimension-line details. Fits GATE well. |

**Rule for paid Looks ("tease, don't block"):** Free and Plus students can **preview** any Look for the whole app for 60 seconds, and **try it for one day, once per Look**, then it returns to their own. The picker always shows the real thing on a live mini-screen. Nothing is hidden.

## 4. The Design Studio (where parts and fonts are chosen)
A separate section in Profile, "Design Studio", with a live preview pane (a real mini dashboard drawn with the chosen parts) beside the controls.

1. **Looks tab:** a grid of Look cards grouped Free / Plus / Pro, each showing a live thumbnail; tap to preview, tap again to apply.
2. **Customize tab:** one control per part from section 2 (cards, background, corners, density, colour, icons, motion, buttons), each with 3 to 7 visual swatches, not dropdowns. "Reset to this Look" always available.
3. **Fonts tab:** pick **Display**, **Body** and **Numerals** separately, with a sample of real app text (a question card, a score, a heading) so the choice is judged on real content, not the alphabet.
4. **My looks:** save a customised Look under a name. Limits: 1 on Free, 5 on Plus, unlimited on Pro. Share a Look by link (the recipient sees a preview and applies it by choice; never forced).

### Fonts (free, open-licence, loaded on demand)
Only the chosen fonts download, as Latin subsets with `display: swap`. Maths uses its own font and is never affected.

| Tier | Display | Body | Numerals |
|---|---|---|---|
| **Free** | Today's display face; Atkinson Hyperlegible (made for readability); Source Serif 4 | Today's body face; Atkinson Hyperlegible; Source Serif 4 | Today's; tabular figures of the body font |
| **Plus** | Fraunces, DM Serif Display, Space Grotesk, Sora | Inter, Nunito, Lora, IBM Plex Sans | Space Grotesk, IBM Plex Mono |
| **Pro** | Archivo Black, Bricolage Grotesque, Playfair Display, Unbounded, Syne | Merriweather, Work Sans, Manrope | JetBrains Mono, Roboto Mono |

Also: a **text size** slider (90 to 130 %), **line spacing** and a **dyslexia-friendly** toggle (OpenDyslexic-style spacing using Atkinson Hyperlegible), all Free.

## 5. Where it appears
- **Profile → Design Studio** (full), and a palette button beside the sun/moon in the top bar for quick switching among the last 4 Looks.
- First-run: after onboarding, one gentle card "Make it yours" (skippable), not before.
- Upgrade moments (see `study-materials/13-PRICING-BUNDLES-AND-OFFERS.md`): trying a Pro Look is a natural, low-pressure offer ("Keep Aurora Glass").

## 6. Plan, in order
1. **Audit hard-coded colours and styles** in components (raw hex, `bg-indigo-600`, `text-white`, fixed shadows and radii). They ignore Looks and are where Looks will break. Replace with tokens as each screen is touched. (Tools: `hallmark audit`, the `taste-skill` inspector, `interface-design` for the consistency pass; `stitch-extract-design-md` to write the current system into `docs/design/DESIGN-SYSTEM.md` as the contract.)
2. **Engine:** token contract (section 2), Classic expressed through it, the no-flash script, `scripts/check-looks.mjs` (all tokens present, text contrast at least 4.5:1 on every tint in light and dark, focus ring at least 3:1).
3. **Studio shell:** Looks tab, Customize tab, live preview, My looks. Ship with Classic, Paper and High contrast (the three Free Looks) to prove the mechanism.
4. **Fonts tab** with the Free set, then Plus and Pro fonts.
5. **Plus Looks** (Midnight first, then Ocean, Sunrise, Forest), then **Pro Looks** (Neo-brutal Arcade first because the Arena reuses it, then Aurora Glass, Editorial, Terminal, Blueprint). Batches of 2 to 3, each checked on Dashboard, Test Centre, Build a test, exam session, results, Mentor, Study, Plans, Tools on desktop and phone, light and dark, with a contact sheet for the owner to approve before release.
6. **Entitlements:** a server-checked list of owned Looks by plan (no client-only locks), try-for-a-day state, My looks limits.

Order of value: the Free Looks and the Studio shell prove the system; Neo-brutal Arcade comes first among the premium Looks because it carries the Arena and is the most distinctive.

## 7. Arena look (R25)
The Arena has its own **Arena style** setting in the Studio and in the room's settings, with three choices: **Arcade** (always the game look, the default for everyone), **My Look** (the Arena follows the student's chosen Look), and **Calm** (flat, minimal, no particles, for low-end phones and low-distraction play). Arcade is a Pro-grade Look, so for Free and Plus players the Arena shows Arcade as a free **in-game** style (rooms are a game space, not a Look purchase); owning the Neo-brutal Arcade Look only extends that style to the rest of the app.

## 8. Rules and risks
- **Exam screen:** uses the chosen Look's surfaces and fonts but keeps the answer-state colours fixed (answered, marked, not visited, current) and a calm motion level so students are never confused or slowed. Maths font is untouched.
- **Share cards, PDFs and downloads** always use Classic so links look the same for everyone.
- **Performance:** only the active Look's CSS and fonts load; Aurora and other animated backgrounds pause on low-end devices, battery saver and "reduce motion"; budgets stay at LCP under 2.5 s.
- **Single-screen rule:** each density and Look is checked with the audit script (`zz-fit`); Spacious density may use inner scroll areas on small windows, never page scroll on the main screens.
- **Hard-coded styles** are the main technical risk; step 1 comes first. A lint check (`check:looks`) fails a build that adds a raw hex colour or fixed shadow in a component.
- **Support and correctness:** an invalid or missing Look falls back to Classic; "Reset appearance" is always one tap.

## 9. Open choices for the owner
1. Tier lines: are Midnight, Ocean, Sunrise and Forest right for Plus, and the five right for Pro? (Easy to move later.)
2. Free Looks: Classic, Paper, High contrast. Add one more free, for example Midnight, so night-time students do not need a paid plan?
3. My looks limits (1, 5, unlimited) and the "try one day" rule: accept or change?
4. Price effect: show the Pro Looks as one of the reasons to upgrade on the Plans page? (Recommendation: yes, as a small "Looks and Studio" row, never the main reason.)
