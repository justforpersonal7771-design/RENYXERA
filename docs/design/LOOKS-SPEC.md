# Looks specification (every detail of every Look)

*2 Nov 2026. One section per shipped Look: its design principles, tokens, fonts, motion, mode support and the rules for each kind of component. The code lives in `app/looks.css`, `app/looks-pro2.css` and `app/looks-details.css`; metadata (tier, fonts, modes) in `lib/looks/looks.ts`. Checks: `scripts/zz-looks-audit.mjs` (contrast, rounded corners, fonts, light/dark switch) and the screenshots in `scripts/zz-looks.mjs`. Plan and tiers: `docs/roadmap/R26-DESIGN-STUDIO.md`.*

## Rules that apply to every Look
1. **A Look restyles everything, not a few components.** It sets tokens (`--surface`, `--tint-*`, `--border`, `--btn`, `--card-radius`, fonts) and then overrides every surface class (`.card-pastel`, `.card-well`, `.card-band`, `.folder-panel`, `.ai-panel`, topbar, popovers) and every control class (`.btn-main`, `.pill-ink`, `.btn-soft`, `.pill-soft`, inputs, tabs). New components must use those classes or tokens, never fixed colours, so Looks reach them.
2. **Selectors use the doubled attribute** (`[data-look="x"][data-look="x"]`) so a Look beats the app's own button and card rules without more `!important`.
3. **Fonts per Look**, with a student override (Design Studio, Fonts). The override is an inline style on `<html>` and wins.
4. **Colour modes:** a Look says `modes: both | light | dark`. A single-mode Look switches the app to that mode while it is on, hides the light/dark switch, and gives the student's own choice back afterwards.
5. **Motion belongs to the Look** (speed, easing, stepped or smooth) and is switched off for "reduce motion".
6. **Contrast:** body text at least 4.5:1, large text and controls at least 3:1. The audit flags anything under 3.2:1.
7. **Single-screen rule and full width** still apply in every Look; a Look never changes layout, only appearance.
8. **Previews:** the Studio draws previews with the Look's own CSS on a wrapper, so a preview is the Look, not a picture.

## Glass (Pro, light and dark)
- **Idea:** frosted translucent panels over a soft colour backdrop (iOS and visionOS style). Depth comes from blur and a bright 1 px edge, not from outlines.
- **Principles:** hierarchy by blur and elevation; keep text on an opaque-enough fill (menus and dialogs use 86 % fill with 28 px blur so nothing behind shows through); one accent gradient for primary actions.
- **Colour:** backdrop of four soft radial colours (blue, violet, pink, teal) over `#eef3ff` (light) or `#0a0b1c` (dark). Cards `rgba(255,255,255,.42)` (light) or `rgba(28,30,60,.5)` (dark), edge `rgba(255,255,255,.7 / .16)`.
- **Fonts:** Outfit for headings and text (geometric, friendly, clean at small sizes).
- **Corners:** 26 px. **Shadow:** long soft blue shadow plus a 1 px inner highlight.
- **Buttons:** primary = indigo to violet gradient with white text, glow shadow, 1 px light border; secondary = frosted pill. **Inputs:** frosted. **Menus, popovers, dialogs, listboxes:** strongly blurred, nearly opaque.
- **Motion:** smooth 200 to 250 ms eases.

## Neo-brutal Arcade (Pro, light and dark)
- **Idea:** loud, honest, game-like: flat colour, thick black outlines, hard offset shadows (neubrutalism).
- **Principles:** every surface has a 3 px outline and a 6 px block shadow; colour is flat and saturated; interaction is physical (cards lift on hover, buttons press into their shadow).
- **Colour:** cream page `#fff7da` with a dot grid; saturated tints (mint `#b6f0c8`, rose `#ffb4c6`, butter `#ffe45e`, sky `#a9e2ff`, periwinkle `#cbc8ff`); outline `#111` (light) or `#f5f0e6` (dark); primary buttons always yellow `#ffd43b` with black text in both modes.
- **Fonts:** Archivo Black for headings, Space Grotesk for text.
- **Corners:** 14 px cards, 12 px buttons. **Shadows:** hard, no blur.
- **Motion:** snappy, 80 ms in 3 hard steps; press = shadow collapses.

## Neon Nights (Pro, dark only)
- **Idea:** synthwave / cyberpunk: near-black with magenta and cyan light.
- **Principles:** light comes from the elements (glow), not from the page; borders are thin neon lines; text stays near-white for contrast; glow never replaces contrast.
- **Colour:** `#0b0820` page with magenta and cyan radial glows and faint scan-lines; surfaces `#130f2e`; borders and glows take the card's tint (cyan, magenta, violet, amber); primary action = magenta to violet to cyan gradient with near-black text.
- **Mode:** dark only; the switch is hidden and the app is set to dark.
- **Fonts:** Space Grotesk. **Corners:** 18 px.
- **Motion:** glow pulses 1.4 s on primary hover; soft 350 ms fades.

## Pixel Quest (Pro, light and dark)
- **Idea:** 8-bit game UI. Everything is a rectangle; nothing is curved or eased.
- **Principles:** **no curves anywhere** (every `border-radius` is 0, cards use a stepped-corner clip), **no easing** (transitions off, animations in discrete steps), a **flat** background (no pattern), 4 px outlines, block shadows that disappear when pressed, a pixel font everywhere.
- **Colour:** light page `#dde7cf`, surface `#fffdf2`, ink `#2b2d42`, flat tints (green, rose, orange, lavender, blue, yellow); dark page `#12142a`, surface `#1f2140`, ink `#f1e9c8`. Primary buttons amber `#ffb703` with dark text.
- **Fonts:** Jersey 15 (a clean, compact pixel face) for headings and text, with the whole page scaled up 12.5 % so it reads comfortably; numbers and maths keep their own fonts so exam content stays legible. (Pixelify Sans was tried first and was too hard to read.)
- **Motion:** hover moves the block 2 px (hard step), press moves it 3 px and removes the shadow; spinners step in 8 frames.

## Aurora (Pro, light and dark)
- **Idea:** a slow, calm light show behind clean frosted cards (aurora UI).
- **Principles:** motion is ambient and slow (22 s drift), cards stay readable (78 to 80 % fill, 10 px blur), one gradient (violet to cyan) for primary actions.
- **Colour:** `#f6f4ff` (light) or `#07081a` (dark) with violet, cyan and pink radial fields.
- **Fonts:** Outfit. **Corners:** 24 px.
- **Motion:** background drift only when "reduce motion" is off.

## Not built yet (specified in R26): Liquid Glass, HUD Terminal, Blueprint, Editorial, Clay, Minimal Mono, Midnight, Ocean Bento, Sunrise Soft, Paper.
Each needs: tokens, surfaces, controls, fonts, mode support, motion, contrast audit, this spec section.

## Checklist for adding or changing a Look
- [ ] Tokens set (light and dark, or one mode declared) and fonts chosen.
- [ ] Surfaces: cards, wells, bands, panels, topbar, dock, popovers, menus, dialogs.
- [ ] Controls: primary, secondary, tabs, inputs, selects, checkboxes, toggles, focus ring.
- [ ] Motion rules; reduced-motion fallback.
- [ ] `node scripts/zz-looks-audit.mjs`: no text under 3.2:1; Pixel has 0 rounded elements.
- [ ] Screenshots of Dashboard, Test Centre, Build a test, exam session, results, Mentor, Study, Plans, Profile on desktop and phone.
- [ ] Studio preview and the navbar quick window both show it.
