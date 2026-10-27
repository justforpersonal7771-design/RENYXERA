# RENYXERA design system: unified pastel (R18, 27 Oct 2026)

One look across every screen. This file is the rulebook: when building or changing any screen, use these tokens and components only.

## 1. Research behind it

| Finding | Source | What we do |
|---|---|---|
| Soft pastel palettes are the established language of education, journaling and wellness apps | [setproduct / design guides via godly round-ups](https://www.downgraf.com/inspiration/godly-website-design-inspiration/), [Headspace/Calm onboarding notes](https://uxcam.com/blog/10-apps-with-great-user-onboarding/) | Pastel surfaces, friendly type, calm motion |
| Saturated colour should be reserved for signals (Duolingo keeps orange/red/blue for streak, danger, XP) | [Notion x Duolingo token remix](https://github.com/rohitg00/awesome-claude-design/blob/main/design-md/remix/notion-x-duolingo.md) | Logo blue only for the main action and links; red/amber only for errors, streaks |
| Light bento dashboards: white cards on light wells, soft tints, double borders for depth | [shadcnblocks bento](https://www.shadcnblocks.com/block/bento39), [Superdesign bento](https://superdesign.dev/library/bento-configuration-dashboard) | Card family below (pastel, band, well, stat) |
| Active nav item needs more than one cue (fill + weight + colour), never hue alone | [saasui tabs/segmented](https://www.saasui.design/blog/saas-tabs-segmented-control-ux-patterns), [uxpatterns tabs](https://uxpatterns.dev/patterns/navigation/tabs) | Navbar: pastel chip + bold + blue ink text |
| Segmented controls: 2–4 segments; tabs use tablist/tab/tabpanel roles; don't slide content between tabs | [eleken segmented](https://www.eleken.co/blog-posts/segmented-control-ui), [uxpatterns](https://uxpatterns.dev/patterns/navigation/tabs) | `Segmented` and `FolderTabs` in `components/ui/folder-tabs.tsx` |
| Pastel fills pass with dark text, but grey labels and light borders often fail; focus rings need 3:1 | [Texas DIR contrast guide](https://dir.texas.gov/txds/accessibility/color-contrast/), [Twilio Paste utils](https://www.mintlify.com/Twilio-labs/paste/utilities/color-contrast-utils) | Muted text darkens inside pastel surfaces; 2px blue focus ring |
| Competitor Swaseekh: pinned card stack in a tinted frame, ink pills, big stat pairs | owner screenshots | Toolkit deck on the dashboard |

## 2. Audit (27 Oct, before this pass)

| Area | Found | Action |
|---|---|---|
| Card styles | 74 `card-glass`, 41 `card-pastel`, 18 `card-inset`, 4 legacy components | Glass now renders as a solid card; new screens use only the card family |
| Buttons | 53 hard-coded solid-blue buttons, 17 `btn-main`, 9 `pill-ink` | Three button roles (below); migrate screen by screen |
| Text sizes | 389 arbitrary `text-[Npx]` | Type scale below; replace while restyling each screen |
| Hex colours in components | 191 | Tokens only on new and restyled code |
| Radius | 8 different radius steps in use | Three steps |
| Contrast | muted grey 3.9–4.3:1 on every pastel; peach/butter accent text 4.3–4.4:1 | Fixed: all pairs now 5.5–6.8:1 |

## 3. Tokens

**Colour (from the logo)**
| Token | Light | Use |
|---|---|---|
| `--background` | #faf8f5 | page, with a faint dot grid |
| `--surface` | white | cards, panels |
| `--ink` / text | #16123a | headings, body |
| Brand blue | #0a5ff2 (Tailwind `violet`/`indigo`/`blue` scales remapped) | main action, links, focus ring |
| Magenta | #dd42fb (Tailwind `fuchsia`) | small highlights only |
| Cyan | #06c2fb | charts, secondary accents |
| Pastels | mint, rose, peach, peri, lilac (light blue), butter, sky + `-ink` | card fills; ink variants for text on them |

Rules: pastel never as text colour; text on pastel is ink or the matching `-ink`; one saturated colour per screen region.

**Type:** Bricolage Grotesque (display, numbers) · Manrope (body). Scale: 12 / 14 / 16 / 20 / 24 / 32 / 48. Sentence case labels, no letter-spaced capitals.

**Radius:** 28px large surfaces (`--card-radius`, 22 on phones) · 18–20px panels, popovers, tiles · pill for chips and buttons.

**Elevation:** flat (wells) · card (soft 18–40px blur) · popover (`.popover-surface`) · hero (`.metal`, one per screen).

**Motion:** 150–250 ms ease-out for state changes; one orchestrated moment per screen; smooth scroll (Lenis) outside the exam; all motion off with reduced motion.

## 4. Components

| Component | Class / file | Use when |
|---|---|---|
| Pastel card | `.card-pastel[data-tint]` | hero and feature cards, the dashboard bento |
| Band card | `.card-band[data-tint]` | lists of items: suggestions, sessions, questions |
| Well | `.card-well[data-tint]` | groups of white cards (analytics sections, suggestion grids) |
| Stat tile | `.card-stat` | one number + label |
| Metal hero | `.metal` | the single top card of a screen (tilt + sheen on hover) |
| Main button | `.btn-main` | the one primary action per screen |
| Ink pill | `.pill-ink` | secondary actions inside cards |
| Soft pill | `.pill-soft` | tertiary links, filters |
| Tabs | `FolderTabs` | 2–6 sections of one screen (pastel track, white active chip) |
| Segmented | `Segmented` | 2–4 short options (days, plan, difficulty) |
| Popover | `.popover-surface` | every dropdown, picker, dialog, panel |
| Pinned deck | `StackCards` | feature showcases (dashboard toolkit, landing) |
| Section label | `.section-label` | small ink chip naming a card |

Navbar: floating island; current page = pastel chip + bold blue text; open panels use the same chip.

## 5. Per-screen card mix

| Screen | Mix |
|---|---|
| Dashboard | metal hero · pastel bento · pinned deck · coming-up pastel tiles |
| Analytics | stat tiles on top · pastel charts · band cards for detail · well for subject list |
| AI Mentor | pastel hero · well holding band cards (colour = priority) · pastel insight cards |
| Forge / Study / Battles | metal hero · tabs · white question/lesson cards · pastel side cards |
| Exam engine | official GATE layout kept; chrome (dialogs, palette, timer) uses popover + pills |
