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

## 3. The Looks, in three tiers (Free 2, Plus 4, Pro 10)
Names are working titles. Each Look is a full design with its own cards, background, fonts, corners, icons and motion. The list comes from the style guides the owner shared and a wider survey (sources in section 10). **High contrast** is not a Look: it is an accessibility switch (black, white and yellow, 2 px outlines, larger text) that works on top of any Look and is always free.

### Free (2)
| Look | Style family | Character |
|---|---|---|
| **Classic pastel** | Soft UI / bento | Today's look: soft pastels, ink buttons, friendly. The default. |
| **Paper** | E-ink / paper, Swiss | Calm exam-hall reading: warm off-white, ink text, thin rules, serif headings, almost no colour. |

### Plus (4)
| Look | Style family | Character |
|---|---|---|
| **Minimal Mono** | Minimalism, Swiss modern | Black and white with one accent colour, big whitespace, hairline rules, no shadows, grid-strict. Fast and quiet. |
| **Midnight** | Dark mode (OLED) | True black, vivid indigo accent, glow instead of borders, calm motion. For night study. |
| **Ocean Bento** | Flat, bento grid | Cool blue-teal, mixed-size rounded tiles, crisp white surfaces, no shadows. |
| **Sunrise Soft** | Soft UI (neumorphic, accessible) | Peach and gold, gently raised surfaces with good contrast, warm shadows. Motivating. |

### Pro (10)
| Look | Style family | Character |
|---|---|---|
| **Glass** | Glassmorphism | Frosted translucent cards with blur over a soft colour backdrop, thin light borders, layered depth. |
| **Liquid Glass** | Liquid glass, iridescence | Glass whose edges shimmer and morph slowly, rainbow highlights, floating panels. |
| **Aurora** | Aurora UI, gradient mesh | Flowing animated gradients behind clean cards; the premium "wow" background. |
| **Neo-brutal Arcade** | Neubrutalism | Thick black outlines, hard offset shadows, flat saturated colour, sticker tilts, chunky type. The Arena's home look. |
| **Pixel Quest** | Pixel art, 8-bit | Limited palette, pixel fonts for headings, stepped (non-smooth) borders and shadows, tiny pixel icons, blip sounds (opt-in). |
| **Neon Nights** | Cyberpunk, synthwave, retro-futurism | Near-black with magenta, cyan and violet neon glow, scan-line texture, glitch on hover, glowing numbers. |
| **HUD Terminal** | Sci-fi HUD, terminal | Thin lines, green and amber on black, monospace numerals, square corners, blinking caret. |
| **Blueprint** | Engineering drawing | Deep blue grid paper, white line art, dimension-line details. Suits GATE. |
| **Editorial** | Editorial / magazine | Large serif headlines, hairline rules, generous space, restrained colour. |
| **Clay** | Claymorphism | Soft inflated 3D shapes, thick rounded corners, bright pastels, squishy button motion. |

Extra Pro candidates waiting in the wings (not in the first release): Memphis Pop, Vaporwave Sunset, Y2K Chrome, Hand-drawn Notebook, Dimensional Paper-stack, Nature Distilled (earthy, organic).

**Try before you buy ("tease, don't block"):** a student can **try a paid Look for 5 minutes, once per Look**, across the whole app (a small countdown chip with "Keep it" and "Switch back"), after which the app returns to their own Look. **Trials are capped per tier:** at most **2 Looks from each paid tier** can be tried per account (a Free student can try 2 Plus Looks and 2 Pro Looks; a Plus subscriber can try 2 Pro Looks). A tried Look cannot be tried again, even after the cap resets by upgrading. The count is stored on the server (not only on the device) so clearing the browser does not reset it. The picker always shows a live preview of the real design on a mini-screen, so nothing is hidden. Plus Looks are also included in Pro.

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
3. **Studio shell:** Looks tab, Customize tab, live preview, My looks. Ship with Classic and Paper (the two Free Looks) plus the High-contrast switch to prove the mechanism.
4. **Fonts tab** with the Free set, then Plus and Pro fonts.
5. **Plus Looks** (Midnight and Minimal Mono first, then Ocean Bento, Sunrise Soft), then **Pro Looks** (Neo-brutal Arcade first because the Arena reuses it, then Glass, Neon Nights, Pixel Quest, Aurora, Liquid Glass, HUD Terminal, Blueprint, Editorial, Clay). Batches of 2 to 3, each checked on Dashboard, Test Centre, Build a test, exam session, results, Mentor, Study, Plans, Tools on desktop and phone, light and dark, with a contact sheet for the owner to approve before release.
6. **Entitlements:** a server-checked list of owned Looks by plan (no client-only locks), try-for-a-day state, My looks limits.

Order of value: the Free Looks and the Studio shell prove the system; Neo-brutal Arcade comes first among the premium Looks because it carries the Arena; Glass, Neon Nights and Pixel Quest follow because they are the most visibly different and the best upgrade hooks.

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
1. Tier lines: are Minimal Mono, Midnight, Ocean Bento and Sunrise Soft right for Plus, and the ten right for Pro? (Easy to move later.)
2. Free has two Looks (Classic, Paper) plus the High-contrast switch. Add Midnight to Free so night-time students never need a paid plan?
3. My looks limits (1, 5, unlimited) and the trial rule ("5 minutes, once per Look, 2 Looks per paid tier"): is that how you meant the cap of 2?
4. Price effect: show the Pro Looks as one of the reasons to upgrade on the Plans page? (Recommendation: yes, as a small "Looks and Studio" row, never the main reason.)

## 10. Sources and style map
Surveyed 1 Nov 2026: [Fireart, web design styles](https://fireart.studio/blog/web-design-styles-complete-guide/) (flat, minimalist, retro, Y2K, neo-brutalism, claymorphism, Memphis), [Tilda Education](https://tilda.education/en/web-design-styles) (minimalism, brutalism and neobrutalism, constructivism, Swiss, editorial, hand-drawn, retro, flat, bento), and [UI Style Guide](https://www.uistyleguide.com/) (67 styles in 10 groups, including glassmorphism, liquid glass, aurora, pixel art, cyberpunk and HUD). The UX Planet "50 design styles" article blocked automated reading (HTTP 403), so it is not used. Style families chosen for GATE: those that keep dense information readable (minimal, glass, flat, bento, dark), those with game energy for the Arena (neubrutalism, pixel, neon), and those with a clear identity for marketing and sharing (aurora, blueprint, editorial).

**Safety notes per family:** glass and aurora need a readable-text overlay and a "reduce transparency" fallback; neon, scan-lines and glitch effects must respect "reduce motion" and never flash faster than 3 times a second; pixel fonts are used for headings and numerals only, never for question text or maths.
