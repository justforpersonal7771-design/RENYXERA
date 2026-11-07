# RENYXERA logo upgrade: master prompt (Lunar Glass theme)

[← Docs index](../README.md) · [Lunar Glass UI plan](LUNAR-GLASS-UI-PLAN.md) · [Design system](DESIGN-SYSTEM.md)

Written 7 Nov 2026. Use with an image or logo model (for example Ideogram, Midjourney, Recraft, Gemini image, GPT image). Run **Prompt A** first for directions, pick one, then run **Prompt B** to refine, then **Prompt C** for the full set of files. Send the results back and Claude wires them into the app, the PWA icons, the favicon and the share images.

## What the logo must do (so the model has the real brief)

- The product is a GATE exam-preparation app for Indian engineering students. Name: **RENYXERA**, read as "a new ERA of intelligent learning". Tone: calm, fluid, approachable, modern, trustworthy. Not childish, not corporate, not sci-fi.
- It lives on a soft **lavender-white** ground with frosted glass pills and **powder blue** and **warm peach** accents, and a **deep navy** for text.
- It must work at **16 px** (browser tab), **40 px** (inside the 80 px floating nav pill), **512 px** (app icon), and as a wide wordmark in the top bar and on a share card.
- The mark must still read in one colour (navy on light, white on dark) because it is also printed on the watermark and exports.

## Brand colours (use exactly these)

| Role | Name | Hex |
|---|---|---|
| Ground | Soft Lavender White | `#E9E8F8` |
| Primary accent | Powder Blue | `#8DB9F0` |
| Secondary accent | Warm Sunset Peach | `#F5B69E` |
| Ink | Deep Slate Navy | `#1A1C29` |
| Glass white | White | `#FFFFFF` |

## Prompt A: explore six directions

```
Design a logo for an education technology app called "RENYXERA" (pronounced "ren-ix-era"; the idea is "a new ERA of intelligent learning"). The audience is Indian engineering students preparing for a national exam; the feeling is calm focus, fluid momentum and quiet confidence, like a premium wellness or high-end architecture brand rather than a typical edtech brand.

Create SIX distinct logo directions, shown on a soft lavender-white background (#E9E8F8), each as a clean flat vector with: (1) a symbol/mark on its own, (2) the wordmark "RENYXERA", (3) the horizontal lockup of mark plus wordmark.

Rules for every direction:
- Fully rounded geometry: squircle and circular forms, soft terminals, generous curvature. NO sharp corners, NO angular or techno lettering, NO stencil or sci-fi shapes.
- Colours only: Powder Blue #8DB9F0, Warm Sunset Peach #F5B69E, Deep Slate Navy #1A1C29, white. The two accent colours may overlap or blend through a soft overlap, but the shapes themselves are flat. No gradients inside the letters, no glow, no 3D, no bevel, no drop shadow, no glass effect on the logo itself.
- The wordmark is a custom rounded geometric sans-serif (the feeling of Outfit, Nunito or Quicksand but more distinctive), medium to bold weight, slightly generous letter-spacing, all capitals or a refined capital R followed by lowercase; show the best of the two. The letters "ERA" can be set in a different colour or weight to carry the meaning "a new era".
- The symbol must be simple enough to recognise at 16 pixels: one strong silhouette, at most two shapes, no thin lines, no fine detail.
- Each direction uses a different idea. Directions to explore: (1) a rounded "R" monogram built from two overlapping soft shapes in blue and peach; (2) a sunrise or horizon curve forming the letter R, the "new era" dawning; (3) two interlocking rounded loops suggesting a question and an answer, learning in dialogue; (4) a soft spark or four-lobed rounded star made of two overlapping circles, suggesting an AI mentor without using a robot or brain; (5) a rounded arch or doorway, a path forward; (6) an abstract wordmark-only treatment where the letters R and X share a curve.
- Do NOT use: graduation caps, open books, light bulbs, brains, circuit boards, rockets, owls, pencils, generic swooshes, lens flares, or any stock edtech cliché. Do not imitate any existing brand.
- No tagline, no extra text.

Present the six directions in a 3 by 2 grid, labelled 1 to 6, with generous whitespace.
```

## Prompt B: refine the direction you chose

Replace `N` with the number you like and add one line of feedback.

```
Take direction N from the previous set and refine it into the final logo for RENYXERA.
Keep it flat vector, fully rounded, using only #8DB9F0, #F5B69E, #1A1C29 and white. Improve: balance of the two accent colours, curve consistency (the same corner radius logic across the mark and the letters), optical spacing of the wordmark, and clarity at 16 px. Remove anything that is not needed.
Feedback to apply: <one sentence, for example "make the peach smaller and the mark less symmetrical">.
Show: the mark alone on lavender-white (#E9E8F8); the mark alone at 16 px, 32 px and 64 px next to each other to prove it holds up; the horizontal lockup; the wordmark alone.
```

## Prompt C: the complete asset set

```
Using the approved RENYXERA logo, produce the complete set as clean flat vector artwork on transparent or plain backgrounds, each on its own labelled panel:
1. Horizontal lockup (mark + wordmark), full colour, for light backgrounds (#E9E8F8 and white).
2. Horizontal lockup for dark backgrounds (#0E1020): navy turns to white, the two accent colours stay.
3. Mark only, full colour, square, with safe padding (for the app icon).
4. App icon: the mark centred on a rounded square (squircle) in Powder Blue #8DB9F0 or white, 1024 by 1024, with the mark kept inside the central 66 percent so it survives circular and rounded masks (maskable icon safe zone).
5. Mark only in one colour: navy #1A1C29 on transparent, and white on transparent (for watermarks and exports).
6. A 16 by 16 and a 32 by 32 favicon version, simplified if needed, high contrast.
7. A share-card version: wordmark and mark centred on lavender-white (#E9E8F8) with two soft blurred colour fields (powder blue and peach) in the corners, 1200 by 630. (The soft fields belong to the card background only, not to the logo.)
Keep every file perfectly consistent in proportions and colour. Provide SVG if possible.
```

## Negative prompt (for models that support one)

```
sharp corners, angular, techno font, sci-fi, circuit, glow, neon, 3D, bevel, gradient letters, drop shadow, glass effect on the logo, graduation cap, book, light bulb, brain, robot, rocket, owl, pencil, swoosh, lens flare, stock clip-art, thin hairlines, tiny details, busy, photo, texture, watermark, extra text, tagline
```

## What to send back to Claude

1. The chosen mark and lockup as **SVG** (or PNG at 2048 px if the tool cannot export SVG).
2. The dark-background lockup, the one-colour navy and white marks, and the 1024 app icon.
3. Tell me the name of the font if the tool names one (so I can match the interface type), and the exact hex values it ended up using if they differ from the brief.

Claude then replaces: the nav mark and top-bar wordmark, `public/manifest.json` icons (192 and 512, plus maskable), the favicon, `app/icon` files, the Open Graph and share images (`public/og/*`), the Telegram and Instagram profile images, the Remotion ad end card, and the legal and receipt headers. Until then the interface uses the wordmark set in the interface font.

## Why these choices

- **Flat, rounded, two accents:** the interface is soft glass and gradients; the logo stays the one solid, simple element so it never competes and always prints cleanly.
- **A symbol, not just letters:** a 40 px nav slot and a 16 px favicon cannot carry a long wordmark.
- **No edtech clichés:** every competing GATE app uses a cap, a book or a bulb; a calm abstract mark is the way to be remembered.
