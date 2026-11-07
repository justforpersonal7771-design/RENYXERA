# RENYXERA logo: keep the original shape, recolour it in the theme palette

[← Docs index](../README.md) · [UI/UX overhaul plan](UIUX-OVERHAUL-PLAN.md) · [Design system](DESIGN-SYSTEM.md)

Corrected 7 Nov 2026 after the owner's clarification: **the logo SHAPE is the original and stays**; only the **colouring** changes, to the theme palette below. Earlier versions of this prompt asked the model to invent new shapes, which is why the results looked simple and dull (generic clip-art). Do not ask for new symbols.

**Always attach the current logo files as image references:** `video/public/mark-light.png` (the mark) and `video/public/lockup-light.png` (mark plus wordmark). Without them the model invents a different logo.

## The theme palette (use exactly these, nothing else)

| Role | Name | Hex |
|---|---|---|
| Ground | Soft Lavender White | `#E9E8F8` |
| Primary accent | Powder Blue | `#8DB9F0` |
| Secondary accent | Warm Sunset Peach | `#F5B69E` |
| Ink | Deep Slate Navy | `#1A1C29` |
| Glass white | White | `#FFFFFF` |

Depth may be made from lighter and darker **tints of the same hues** (for example a lighter powder `#B5D2F6` and a deeper powder `#5E96DB`, a lighter and deeper peach). No new hues: no cyan, violet, magenta, green or orange.

## How the original colours map to the new ones

The current mark is a folded ribbon: a triangular fold at the top, a band that wraps around and back, a tail at the lower right, shaded from cyan through blue and violet to magenta.

| Part of the original mark | Original colour | New colour |
|---|---|---|
| Top fold and upper band | cyan to blue | Powder Blue `#8DB9F0` (light tint to deeper tint for the shading) |
| Inner folds, shadows and the loop's underside | royal blue, indigo | Deep Slate Navy `#1A1C29` (and a mid navy tint where the shape needs a softer step) |
| The turn of the ribbon | indigo to violet | Powder Blue deepening toward navy |
| The tail at the lower right | orchid to magenta | Warm Sunset Peach `#F5B69E` (lighter to deeper peach) |
| Wordmark "RENY X" | ink | Deep Slate Navy `#1A1C29` |
| Wordmark "ERA" | ribbon gradient | Powder Blue flowing into Warm Peach |

## Prompt A: recolour the original (attach the two files)

```
I am attaching the current logo of my education app RENYXERA (a mark and a lockup). KEEP THE SHAPE EXACTLY: the same folded ribbon forming a rounded R, the same fold, loop and tail, the same proportions, and the same wordmark lettering style and spacing. Do not redraw it as a different symbol and do not simplify it into flat clip-art. Keep its depth and richness.

Change only the COLOURS to this theme palette: Soft Lavender White #E9E8F8 (background only), Powder Blue #8DB9F0, Warm Sunset Peach #F5B69E, Deep Slate Navy #1A1C29, and white. Use lighter and darker tints of those same hues for the ribbon's shading and depth; do not add any other hue.

Colour mapping: the top fold and upper band become Powder Blue (light to deeper); the inner folds, shadows and loop underside become Deep Slate Navy; the turn of the ribbon blends from Powder Blue toward navy; the tail at the lower right becomes Warm Sunset Peach (light to deeper). In the wordmark, "RENYX" is Deep Slate Navy and "ERA" flows from Powder Blue into Warm Peach.

Produce on a Soft Lavender White (#E9E8F8) background: (a) the mark alone, large; (b) the horizontal lockup; (c) the mark at 16, 32 and 64 pixels side by side to prove it holds at small sizes; (d) a version for dark backgrounds (#0E1020) where the navy parts become white or very light powder and the blue and peach stay.
No outer glow, no neon halo, no lens flare, no extra shapes, no new text, no tagline. The material may have soft light and depth inside the ribbon, like polished frosted glass, but the outline and geometry are the original's.
```

## Prompt B: tune the result

```
Same logo, same shape, same palette. Adjust only: <one change, for example "make the peach tail a little more saturated" or "lighten the navy folds so the loop reads clearly at 16 pixels">. Show the mark at 16, 32, 64 and 256 pixels on #E9E8F8 and on white.
```

## Prompt C: the complete asset set

```
Using the approved recoloured RENYXERA logo (original shape, theme palette), produce the full set as clean vector artwork, each on its own labelled panel:
1. Horizontal lockup, full colour, for light backgrounds (#E9E8F8 and white).
2. Horizontal lockup for dark backgrounds (#0E1020).
3. Mark only, full colour, square with safe padding.
4. App icon: the mark on a squircle tile (white or Soft Lavender White), 1024 by 1024, mark inside the central 66 percent (maskable safe zone).
5. One-colour marks: Deep Slate Navy #1A1C29 and white, on transparent.
6. Favicon 16 by 16 and 32 by 32, simplified only if needed, high contrast.
7. Share card 1200 by 630: the lockup centred on #E9E8F8 with two very soft colour fields (powder blue top-left, peach bottom-right) as background only.
Keep proportions and colours identical across all files. SVG if possible.
```

## Negative prompt (if the tool supports one)

```
new symbol, different logo, redesigned shape, flat clip-art, generic template logo, cyan, violet, purple, magenta, green, orange, sharp techno lettering, circuit, outer glow, neon halo, lens flare, heavy drop shadow, graduation cap, book, light bulb, brain, robot, rocket, star, sparkle, photo, texture, watermark, extra text
```

## Why this palette works on the theme (and the rule that keeps it readable)

- Powder blue and peach are **fill** colours: they carry the brand on surfaces, active states and the logo.
- **Text is always Deep Slate Navy** (or a navy tint). Peach text on white measures 1.7:1 and the reference's grey on lavender 3.9:1, both below the 4.5:1 minimum, so those two combinations are never used for words.

## What to send back

1. The chosen mark and lockups as **SVG** (or PNG at 2048 px), the dark-background lockup, the one-colour marks and the 1024 app icon.
2. The hex values the tool actually used if they drifted from the table.

Claude then replaces the mark in the new floating dock, the PWA icons and manifest, the favicon, the Open Graph and share images, the Telegram and Instagram profile images, receipt and legal headers, and the ad end card.
