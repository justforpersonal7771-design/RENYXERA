# Motion and interaction catalogue

[← Docs index](../README.md) · [UI/UX plan](UIUX-OVERHAUL-PLAN.md) (section 11 is the first version of this list) · [Dashboard variants](DASHBOARD-VARIANTS.md)

Written 7 Nov 2026. Status: **documentation only; nothing here is built or committed yet.** It records the owner's ten effects (from the two "Creative Director" briefs), where each lands on the screens the owner chose, the corrections needed so each helps the product instead of hurting it, and ten more effects found by research.

All code uses the `motion` package already installed (`import … from "motion/react"`, the same API as framer-motion), the shared motion tokens of the plan (section 6), and honours `prefers-reduced-motion`.

## Owner's screen decisions these effects serve

- **Dashboard:** variant 01 Focus Stream as the base; navigation is a slim left rail of pages on desktop (see the navigation decision in the UI/UX plan: the bottom is reserved for page actions) and the floating bottom pill on phone. Sections lower down: score gauge card, "coming up" card stack, subject radar. **No stories on the dashboard.**
- **AI Mentor chat:** variant 03 Command Home. **Analytics:** variant 04 Readiness Orbit.
- Images: `docs/design/dashboard-composite-v3/` (the assembled dashboard, scrolling, four modes).

## Part 1: the owner's ten effects

| # | Effect | Lands on | Corrections to the brief's code and directives | Cost and risk |
|---|---|---|---|---|
| 1 | **Morphing tabs** (glide pill) | Test Centre bar (Build a test, Forge, Flashcards), Analytics ranges (1W, 1M, 1Y), leaderboard scope, Plans period | One `LayoutGroup` per group and a **unique `layoutId` per instance** (the brief's single `active-pill` id would collide with a second group); `role="tablist"` and arrow keys; muted text `#566379`, not `#64748B` (3.9:1 fails) | Low |
| 2 | **Spotlight cards** (cursor glow) | Plus and Pro plan cards, Forge and hub tiles | Only under `(hover: hover)`; drive with `requestAnimationFrame`; **no `backdrop-blur-2xl` on every card** (the main phone cost); highlight radius equals the card radius (the brief mixes 32 px and `rounded-xl`) | Low if blur is dropped |
| 3 | **Parallax card stacking** (deck) | **Already in the app** as the "Your toolkit" deck (`components/dashboard/stack-cards.tsx` and `feature-deck.tsx`): keep this design and upgrade it (see "The existing deck" below). Also the landing feature stack | `position: sticky` is correct; the scale must follow scroll (`useScroll` and `useTransform`), not the index alone; plain stack under reduced motion; test on a phone | Low |
| 4 | **Elastic swipe-to-action** | Mistakes Bank and Bookmarks lists on phone | Add visible buttons or a kebab menu (swipe-only is not discoverable); "Remove" gets a 5-second **Undo**; `touch-action: pan-y`; light haptic where supported. (The brief says `useDrag`; Motion uses the `drag` props, which the code correctly uses.) | Medium |
| 5 | **Mesh aurora** background | Behind the app shell, Mentor chat, ad backgrounds | A fixed full-viewport layer with `blur-[100px]` and `mix-blend-multiply` animating is one of the costliest things a browser does. **Built instead (already in `app/looks.css`):** four pre-blended radial gradients on one layer, slow `transform` drift only, grain as an inline SVG (the brief's `/noise.png` does not exist), off for phones and reduced motion, paused during exams and in hidden tabs | Low as built |
| 6 | **Expandable bento** (fluid modal) | Dashboard cards with a quick view: score gauge, mistakes, analytics snapshot, Mentor status | The route and deep link stay (an "Open full page" button inside); focus trap, focus return, Esc, scroll lock; full-screen sheet on phone. **Not applied to the test or mock result summary** (the brief asks for it): the result page is a destination, not a card in a grid | Medium |
| 7 | **Magnetic call-to-action** | **Hero actions only**: landing "Try a quick sample test", Plans "Get Pro", the dashboard "Resume" | `(hover: hover) and (pointer: fine)`, pull at most 6 px (the brief says 15), off under reduced motion. **Not on every `.btn-main`** (the brief asks for a global swap): hundreds of listeners, targets that move reduce click accuracy, exam screens must stay still | Low |
| 8 | **Dynamic Island timer** | A timed test or All-India mock while the student is elsewhere in the app; a pending Battles invite | One clock only: the exam runtime store with `serverNow()`, never a second timer. Mounted in the layout, but **visible only while a timed attempt runs and the student is off the exam page**; no Pause for All-India mocks; "Submit" asks to confirm; sits below dialogs; respects the phone safe area | Medium |
| 9 | **Fluid odometer** | Score gauge number, rank and rating changes, streak increment, result reveal, Analytics numbers | Animate only when the value **changes** after first paint (and once on the result reveal), never on a static number at mount; tabular digits and fixed width; key by digit position; reduced motion shows the number. Option: use the small `NumberFlow` library instead of custom code (see part 2) | Low |
| 10 | **Ethereal success orbs** | Strong mock result, Daily Forge finished, referral reward, season badge | `aria-hidden`; once per event id; at most 12 orbs; `transform` and `opacity` only with pre-blurred radial backgrounds (not animated `filter: blur`); off under reduced motion | Low |

The brief's four "execution directives" are applied with these changes: Test Centre tabs get #1; Plus and Pro tiers get #2; mobile Mistakes Bank gets #4; aurora (#5) is already in the app shell under the Lunar look; the Dynamic Island (#8) is mounted in the layout but is hidden unless a timed attempt is running; Analytics numbers get #9 on change only.

## Where the effects sit on the chosen dashboard

| Dashboard part | Effect |
|---|---|
| Whole page background | #5 aurora (Lunar look) |
| "Resume" button | #7 magnetic (hero action) |
| Score gauge card | #9 odometer on change, #6 expands to a quick view with an "Open Analytics" button |
| "Your toolkit" deck (existing) | #3: keep the design, apply the upgrades below |
| Subject radar card | #6 expand; shapes animate in once (draw-on, 600 ms) |
| Tonight timeline | check-off micro-animation (spring), list reorder (#18 below) |
| Left page rail | #20 magnify and animated icons, sliding active indicator (indicator built) |
| Mistakes list (phone) | #4 swipe with undo |
| Plans and upgrade | #2 spotlight cards |
| Mock result and Daily Forge finish | #10 orbs, #9 odometer |
| Running timed test, user elsewhere | #8 island |
| **Stories (not on the dashboard)** | weekly recap, mock result review, Forge daily, onboarding, Battles round recap (see #19) |

## Part 2: ten more trending effects (from this turn's research)

| # | Effect | Where it goes | Verdict and notes |
|---|---|---|---|
| 11 | **Shared-element transitions** (View Transitions API) | Mistakes row to question, Forge card to player, Plans card to checkout | **Adopt as progressive enhancement.** Same-document view transitions are supported in all major browsers including Firefox 144 and later; cross-document transitions work in Chromium and Safari, not Firefox. Unsupported browsers simply skip the animation. Reduced-motion check applies |
| 12 | **Scroll-driven animation** (CSS `animation-timeline`) | Dashboard scroll-progress line, reading pages, deck scale | **Adopt where it runs on the compositor**; support is Chromium and Safari with a static fallback elsewhere (not re-verified this turn: check before building). Never drive with a JavaScript scroll listener |
| 13 | **NumberFlow-style number transitions** | Same places as #9 | **Adopt the library** `@number-flow/react` rather than custom code: animates digit by digit, groups several counters, respects reduced motion and falls back to a plain swap. Free and small |
| 14 | **Liquid-glass edge and refraction** | Dock, tools group, popovers | **Adapt, cheaply:** a specular edge (gradient border plus inner highlight) works everywhere. True refraction (SVG `feDisplacementMap` inside `backdrop-filter`) is **Chromium-only and experimental** (open WebKit bug, May 2026), so it is an optional enhancement behind a feature check, never required |
| 15 | **Drag bottom sheets** (with handle, velocity dismiss) | Phone: More menu, filters, Mentor tools, quick views | **Adopt.** Spring open, drag to dismiss, focus trap; a first version exists in the bottom tab bar |
| 16 | **Press-and-hold to confirm** | Exam Submit, delete, sign out everywhere | **Adopt:** a ring fills over 600 ms; release cancels; keyboard alternative is a normal confirm dialog |
| 17 | **Skeleton to content cross-fade** | Every list and card that loads | **Adopt:** same box size (no layout shift), 150 ms cross-fade, shimmer only on the skeleton |
| 18 | **Layout animation for lists** (FLIP, `Reorder`) | To-do, planner blocks, filtering Mistakes by subject | **Adopt:** items slide into place instead of jumping |
| 19 | **Story-style progress cards** | Weekly recap, mock result walkthrough, Forge daily, onboarding, Battles round recap (**not the dashboard**) | **Adopt for those places:** segmented progress bar, tap or hold to pause, no auto-advance under reduced motion, always a visible "Skip" |
| 20 | **Rail magnification and animated icons** | Left page rail on desktop | **Adapt:** neighbours scale 1.0 to 1.15 under the pointer (`hover: hover` only), icon strokes redraw on hover in 150 ms; no animation on touch |
| 21 | **Haptic feedback** | Undo, success, swipe threshold, hold-to-confirm | **Adopt on supported devices** (`navigator.vibrate` on Android; iPhone ignores it); skip under reduced motion |

Libraries named here (Sonner for toasts, Vaul for drawers, cmdk for the command palette) are well known but were **not verified in this turn's search**; the app already has a toast store, a bottom sheet and a command palette, so the plan is to refine those, not add dependencies.

## The existing deck ("Your toolkit"): keep it, and raise it

What it is today: a pinned deck of six large pastel cards (PYQ bank, Mock tests, Progress, Fix it, AI Mentor, Study planner). The heading pins under the navbar; each new card slides up over the pile and the earlier ones step back a little narrower and higher (16 px lip, 3.5% narrower each, slightly dimmer). Each card has the text, the student's own numbers and a button on the left and a live mini preview on the right. On phones and under reduced motion it is a plain list.

Kept as is: the structure, the card anatomy (label, title, body, stats, action, live preview), the lip-and-shrink pile, the pinned heading, the plain-list fallback.

Upgrades (none changes what the cards say):

1. **Smoother:** the scroll position is stored in React state, so the deck re-renders on every frame. Drive it with motion values (`useScroll` and `useTransform`, or CSS `animation-timeline` where supported) so the cards move without re-rendering. Same look, less work on phones.
2. **Lunar look:** radius 32 px, soft white glass without blur, palette tints only (the current previews still use emerald, violet and rose bars; move them to powder, lavender and peach).
3. **Depth:** a gentle progressive dim and 1 to 2 px of blur on cards two or more steps back; a soft spring settle when a card lands.
4. **Progress and control:** a slim dot rail beside the deck (the active dot is longer), clickable and keyboard reachable, so students can jump to a card; `aria-current` on the active one.
5. **Life on arrival:** when a card becomes the front card, its numbers tick up once (NumberFlow) and its preview bars fill; they do not replay while it stays in front.
6. **Phone:** instead of a plain list, a light sticky stack (CSS `position: sticky`, small scale step, no JavaScript) so phones get the same idea at no cost.
7. **Spotlight:** the front card gets the cursor glow (#2) on desktop only.
8. **Personal order:** put the card that matters most to this student first (for example Fix it when 14 mistakes are due) instead of a fixed order.

The mockups show the deck as the app draws it today, restyled to Lunar, with the new dot rail: `docs/design/dashboard-composite-v5/`.

## Rules that apply to every effect

1. `transform` and `opacity` only; never `transition: all`; never animate width, height, top or left.
2. Durations under 300 ms for interface moves; custom ease-out `cubic-bezier(.16, 1, .3, 1)`; springs for gestures.
3. Reduced motion keeps the content and drops the travel; every effect has a plain fallback.
4. Repeated actions (keyboard shortcuts, palette) get no animation.
5. One signature move per screen; exam screens stay still.
6. Blur only on the dock, the tools group, sheets and popovers; the effects budget in the plan (section 6) still holds.
7. Measure on 4x and 6x CPU throttling before any effect becomes default (phase 6 gate).

## Sources

- [Cross-Document View Transitions: the gotchas (CSS-Tricks)](https://css-tricks.com/cross-document-view-transitions-part-1/)
- [View Transitions API guide, 2026 (cssawwwards)](https://cssawwwards.com/blog/view-transitions-api-guide-2026)
- [NumberFlow (React) package listing](https://openapps.pro/packages/number-flow-react)
- [Liquid glass in CSS and SVG (Ekino)](https://medium.com/ekino-france/liquid-glass-in-css-and-svg-839985fcb88d)
- [WebKit bug 313914 (backdrop-filter and SVG filter support)](https://bugs.webkit.org/show_bug.cgi?id=313914)
- [Web design trends 2026: what to adopt, test or skip (Netguru)](https://www.netguru.com/blog/top-web-design-trends)
