# RENYXERA UI/UX overhaul plan: reorganise first, then restyle

[← Docs index](../README.md) · [Design system](DESIGN-SYSTEM.md) · [Looks spec](LOOKS-SPEC.md) · [Logo prompt](LOGO-MASTER-PROMPT.md) · [Coverage matrix](UIUX-COVERAGE-MATRIX.md) · [Open items](../open-work/OPEN-ITEMS-2026-11-06.md)

Written 7 Nov 2026 on branch `feature/lunar-glass-ui`. Scope per the owner: every component, screen, module, modal and flow, on desktop **and** phone; mostly **reorganisation, transitions, effects and animation**; colour and logo are a separate layer (palette below, logo in the logo prompt). Nothing here is applied to `main` until each phase passes the review gates in section 9.

## 0. What is wrong today (observed on the live screens, 7 Nov 2026)

| Screen | Observation | UX consequence |
|---|---|---|
| Dashboard (signed out) | Two hero blocks stacked: "Practise like the real exam" and then "Good evening, here's your next step". Four feature cards of dense grey text. Three equal buttons in the first hero. | The visitor sees two competing headlines and four calls to action; the next step is not obvious. |
| AI Mentor home | Eight cards of equal weight (header, quick question, goal, things I noticed, practise with AI, daily check-in, plus settings). Five identical dark-blue pill buttons in a row. Tone selector (Friendly, Strict, Concise) sits in the hero. | No hierarchy: the chat, the main reason to be here, is one small box among many. Settings compete with the task. |
| Exam session | Question and options are separated by a large empty gap (the options sit at the bottom). Header packs six chips and four icon buttons. A cyan-to-purple Submit button sits beside a green Save & next. | Eyes travel far between question and answer; two primary-looking buttons compete in the header and the footer. |
| Results | A glowing purple ring, eight tiles, an orange gradient Retry button and a purple gradient Review button, a floating "Question grid" pill, three separate rows of actions. | At least five accent colours and three gradients at once; the single most useful next action (review what you got wrong) is not singled out. |
| Navigation | A wide top island with 6 labelled tabs plus a second cluster of 8 small icons (search, calendar, to-do, goal, leaderboard, trophy, tools, theme, branch, account). Test Centre has its own second bar of 6 sub-tabs. | Two navigation systems, one dense; on phone the labels are lost. |
| Styles in code | 38 files use `card-pastel`, 32 use `btn-main`, 22 `pill-soft`, 21 `btn-soft`, 19 `pill-ink`, 17 `card-well`, 13 `nav-active-pill`; hard offset ink shadows on buttons. | The restyle must go through these shared classes, not 179 component files one by one. |

## 1. Principles

1. **One screen, one job, one primary action.** Every screen declares its job; exactly one primary button; everything else is secondary or in a menu.
2. **Chat, test and result come first.** The thing the student came to do sits top-left, large; settings, goals and tips move to a side rail or a sheet.
3. **Two navigation levels, never three.** Level 1 is the dock; level 2 is a single contextual command bar per area. Utility icons live in one tray.
4. **Calm by default, rich on purpose.** One bright element per screen (the hero, the score ring, the Mentor reply); chrome stays quiet.
5. **Motion explains.** Transitions show where something came from and went; nothing animates only to decorate; reduced-motion is honoured; exams are frozen.
6. **Mobile is designed first** (thumb reach, sheets, 44 px targets), then widened.
7. **Honest, readable colour.** Text is always navy; peach and powder blue are fills.

## 2. Colour roles (owner's palette, with the readability rules that make it work)

| Token | Colour | Use |
|---|---|---|
| `--ground` | Soft Lavender White `#E9E8F8` | App background, behind everything |
| `--powder` | Powder Blue `#8DB9F0` | Primary accent: active nav, selected states, primary highlights, the hero card |
| `--peach` | Warm Sunset Peach `#F5B69E` | Secondary accent: warm highlights (Forge, mistakes, streaks), attention states |
| `--ink` | Deep Slate Navy `#1A1C29` | **All text**, primary buttons, icons |
| `--glass` | White at 70 to 90 percent | Cards and the dock, with a 1 px white edge and a soft shadow |

Rules (checked by calculation, 7 Nov): muted text is `#566379` (the reference grey `#64748B` is 3.9:1 on lavender, below the 4.5:1 minimum); **peach is never used for words** (peach on white is 1.7:1), only as a fill with navy text on it (navy on peach is about 9:1); links are navy and underlined, not blue; success, warning and error keep their own semantic colours (green, amber, red-orange) so a result is never ambiguous; the ribbon of the logo is the only place two accents blend. Dark mode: ground `#0E1020`, glass at 7 percent white, text `#ECEEF8`, accents lightened. Already implemented as the `lunar` Look in `app/looks.css`.

## 3. Navigation and shell

| Today | New |
|---|---|
| Top island: 6 tabs + 8 icons + branch + theme + account | **Desktop:** a floating glass dock on the left (80 px wide, radius 40) with 6 destinations (Home, Test Centre, Study, AI Mentor, Review, Analytics), a sliding powder-blue indicator, the logo mark at the top, and at the bottom: search (opens the command palette), theme switch and the account avatar. **Phone:** a floating glass pill at the bottom with the 5 most used (Home, Test Centre, Review, AI Mentor, More). |
| 8 utility icons in the top bar (calendar, to-do, goal, leaderboard, trophy, tools, look, branch chip) | One **tray** (a single "Tools" button in the dock and a sheet on phone) holding Calendar, To-do, Goals, Leaderboard, Look, Tools; the branch chip moves into the account menu and the page header. |
| Test Centre second bar of 6 sub-tabs | A single **command bar** at the top of the area: a segmented control (Build, Practice, Mocks, Flashcards, Challenge, History) plus context filters (stream, module type, difficulty) as dropdowns. |
| Search icon only | A **command palette** (`/` or the search button): jump to any screen, question id, topic or action; recent items; "Ask the Mentor" as the last result. |
| Content sits on the page ground | Content sits inside one large glass **stage** (radius 40) to the right of the dock, so every page shares the same frame. |

## 4. Page templates (every screen uses one of five)

1. **Hub** (Dashboard, Test Centre, Mentor home, Analytics): hero card (job + one primary action), then a 2-column grid: main (60 percent) and a side rail (40 percent) on desktop; a single column on phone with the rail turning into horizontally scrolling cards.
2. **Task** (Build a test, Setup, Practice, Mentor chat, Study lesson): a focused column, sticky action bar at the bottom, steps shown as a stepper.
3. **Exam** (session, diagnostics): the frozen template. Same functional layout as the real GATE interface; restyled chrome only; no animation of content.
4. **Reading** (PYQ pages, syllabus, articles, tools, legal): a readable measure (about 72 characters), a sticky table of contents on desktop, a bottom "next" bar on phone.
5. **Form and settings** (Profile, Billing, Design Studio, Login): grouped sections with a left section list on desktop and an accordion on phone.

## 5. Component inventory (what each becomes)

| Component | Today | New behaviour |
|---|---|---|
| **Button** | Ink offset-shadow rectangles (`btn-main`, `pill-ink`), gradient variants | Three levels only: **primary** (navy pill, white text), **secondary** (powder-tint pill), **ghost** (text). Lift 3 px with a soft shadow on hover; press scales to 0.98; loading state is an inline spinner that keeps the width. Destructive is outlined red-orange. |
| **Card** | `card-pastel`, `card-well`, `card-glass`, `card-band`, `folder-panel`, `ai-panel` | Three weights: **flat** (no blur, for lists), **raised** (shadow, default), **hero** (glass blur, one per screen). Tints from the palette only. Every card has a title row, a body and an optional footer action. |
| **Tabs** | Folder tabs and mixed pill tabs | One **segmented control** with a sliding indicator (layout animation), keyboard arrows, scrollable on phone. |
| **Inputs and selects** | Mixed native and custom dropdowns | One field style (radius 20, 48 px high); custom dropdown and date/time pickers keep their no-native-picker rule; inline validation text; clear button; mobile uses a bottom sheet for long lists. |
| **Chips and badges** | Many sizes and colours | Two sizes; meaning by colour: powder (info), peach (attention), green/amber/red (status). Max 3 chips in any header. |
| **Modals** | Centered dialogs of varied widths | **Dialog** (confirm, short forms) and **Sheet** (anything longer; bottom on phone, right on desktop). Same header, same close, focus trap, Esc, scroll lock, spring-in 280 ms. Upgrade, auth, schedule, share card, report an issue, branch change, post-purchase tour all migrate. |
| **Toasts** | Floating messages | Top-centre on desktop, above the bottom pill on phone; 4 s; one at a time; an action button when useful. |
| **Tooltips and popovers** | Mixed | Popover glass, 12 px offset, arrow-less; tooltips only for icons. |
| **Progress, rings, charts** | Gradient ring, bars, heatmap, topic table | Flat navy and powder strokes; semantic colours for right and wrong; one accessible table alternative per chart; no glow. |
| **Empty, loading, error states** | Spinner text and plain messages | Skeletons that match the final layout; empty states with a small illustration, one sentence and one action; errors say what happened and offer retry. |
| **Question and option tiles** | Bold-edged tiles, letter chip, radio at right | Same structure (exam fidelity), restyled: 20 px radius, navy 1.5 px border on select, powder fill; correct and wrong use green and red-orange. |
| **Upgrade and tier gates** | Gates, locked cards, sheets | One **upsell pattern**: preview of what is unlocked, price per day, one tap; never a hard wall for a taster feature. |

## 6. Motion and effects system

| Token | Value | Used for |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrances, sheets, hovers |
| `--ease-inout` | `cubic-bezier(0.65, 0, 0.35, 1)` | Moves between positions, indicator slide |
| `--spring-soft` | spring (damping 20, stiffness 120, mass 1) | Cards, dock indicator, number badges |
| `--spring-snap` | spring (damping 14, stiffness 260) | Toggles, taps, chips |
| Durations | 120 ms micro, 220 ms standard, 360 ms large, 500 ms page | |

Patterns: **route change** = 220 ms cross-fade plus 8 px rise of the stage content, dock stays still; **lists** = 30 ms stagger capped at 8 items; **cards** = lift and shadow on hover, press scale; **dock indicator** slides with a spring; **sheets** rise from the bottom (phone) or slide from the right (desktop) with a scrim; **numbers** appear once and hold (no counting up: it flickers, learned from the reel); **score ring** draws once in 700 ms; **skeleton** shimmer at 1.4 s, off in reduced motion; **toasts** slide 12 px and fade. Rules: respect `prefers-reduced-motion` (replace movement by fades); **exam screens are frozen** (no ambient animation, no page transitions inside a test); animate only `transform` and `opacity`.

Effects budget: backdrop blur only on the dock, the hero card, sheets and popovers (low-end Android phones struggle with many blurred layers); cards use a translucent fill without blur; shadows are soft and low-opacity; ambient background is two static colour fields (no animation on phone); `prefers-reduced-transparency` swaps glass for solid. Focus rings: 2 px navy with a 2 px white offset on every interactive element.

## 7. Screen by screen (all routes)

Format: **job** · reorganisation · phone · transitions and states.

### Public and acquisition
- **Landing `/` signed out** · convert a visitor in 5 seconds · one hero: headline, one primary ("Try a quick sample test"), one secondary ("Sign in"); the four feature cards become a horizontal strip of icons with one line each; a proof row (years of papers, question count, plans from ₹29); remove the second "Good evening" hero for signed-out users · phone: hero then a sticky bottom CTA · stagger-in of the strip.
- **Branch landing pages `[slug]`, PYQ pages `pyq/[paper]/[q]`, syllabus, topics, GATE 2027 changes, articles, tools (cut-off, score calculator, study plan)** · answer a search query fast · Reading template, question card as the hero, "Practise this topic" as the single action, related questions as a list, share and report moved into a kebab menu · phone: sticky bottom "Practise" bar.
- **Plans `/pro`** · convert · three plan cards (Free, Plus, Pro) side by side with Pro as the hero card; a comparison table below; Mentor recharges as a quiet row; FAQ in accordions; the billing-period switch is the segmented control · phone: swipeable plan cards with the selected plan's price pinned at the bottom.
- **Compare, about, contact, legal (terms, privacy, refunds, cookies, disclaimer, receipt)** · inform · Reading template with a table of contents.
- **Login, signup, reset password** · get in · centred glass card on the ground, one provider button first, then email; Turnstile loads quietly · phone: full-screen sheet.

### Home and coach
- **Dashboard (signed in)** · "what should I do next" · hero card: today's single next step (resume test, revise mistakes, or start a diagnostic) with the days to GATE 2027; below, a row of four stat capsules (accuracy, readiness, streak, solved) each with a "View →" link; a "Coming up" stack (daily plan overlapping the next mock); the Mentor entry as a glowing container; leaderboard snapshot in the rail · phone: hero, capsules scroll horizontally, then stacked cards · stagger-in, capsule numbers hold.
- **AI Mentor home** · start talking · the **chat input is the hero** (large, centred, with the five quick prompts as chips beneath it); a side rail with Today (goal, check-in) and "Things I noticed"; tone selector and plan info move into a popover on the input; "Practise with AI questions" becomes one rail card · phone: input pinned at the bottom, rail as a collapsible "Today" strip.
- **AI Mentor chat** · converse · full-height stage, history in a drawer (already built), user bubble powder, Mentor bubble glass; rich replies (equations, code, tables); the short disclaimer line under the input; send/stop morph; typing indicator uses the logo mark · phone: composer rises with the keyboard, history as a left sheet.
- **AI Tutor** · explain one question · Task template, the question on the left (top on phone), the explanation stream on the right, "Ask follow-up" chips.

### Test Centre and the exam
- **Test Centre hub** · pick how to practise · command bar (segmented: Build, Practice, Mocks, Flashcards, Challenge, History) and filter dropdowns; mission card (the one next step) and live-mock card on top; the six doors become a tidy grid with consistent icon cards · phone: segmented scrolls, doors become a 2-column grid.
- **Build a test / Setup / Exam Setup** · configure in under a minute · Task template with a 4-step stepper (Source, Topics, Rules, Review); a live summary card on the right ("20 questions, 60 minutes, −1/3 negative marking") that updates as choices change; Forge/Spark/Blend sources as a segmented control; the folder-tab sections become accordions · phone: summary as a bottom bar that expands.
- **Practice, Checkpoint, Revision, Fresh mock** · quick drills · Task template, progress at the top, question card centred, one primary action.
- **Mocks and Mock results** · compete · schedule list with countdown capsules, "register" as primary, ranks as a podium card; results table with your row pinned.
- **Exam session** · answer questions without distraction · **frozen template**. Reorganise: header becomes timer (left of centre), question counter and section chip (left), and only three icons (calculator, bookmark, theme) plus one **Submit**; the question card sits at the top with the **options directly beneath it** (no empty gap), the palette stays in a fixed right panel (bottom sheet on phone, opened by a tab button); the action bar has Mark & next, Clear on the left and Save & next as the single primary on the right; the calculator keeps the compact phone layout · no transitions between questions except a 120 ms fade; paused state dims and disables.
- **Diagnostics** · the first test · same template with a welcome card and a "what you will get" strip.
- **Results** · tell me how I did and what to do next · one hero: the score ring (flat navy and powder, no glow) with accuracy; **one primary action: "Review the questions you got wrong"**; secondary: retry, share, dashboard; the eight tiles collapse to four (correct, wrong, marks, time) plus a segmented "Breakdown" below; AI insights card ("Your weakest topic was …") as the next step; the Telegram nudge moves to the bottom · phone: ring on top, stat chips in two columns, sticky bottom primary · ring draws once, tiles stagger.
- **Review (results review)** · learn from each question · split view: question list on the left (filter chips: wrong, skipped, marked, slow) and the detail on the right with your answer, the correct answer, explanation, "Ask the Mentor" and report; next/previous with arrow keys · phone: list then detail as a push transition.

### Review and learn
- **Mistakes, Bookmarks, Revision, Flashcards, Notes** · fix weak spots · one shared **Review** template: segmented tabs, a filter bar (subject, topic, date), a list of question cards, a sticky "Revise these" action; flashcards use a flip animation (transform only).
- **Study, GA lessons, Browse, Syllabus** · learn a topic · Reading template with a left topic tree, progress ticks, and a "Practise this" action per section.
- **Analytics and Coach insights** · see where marks leak · hero: readiness estimate with a plain-language sentence; then three panels (topic strength table, trend line, mistake DNA); every chart has a table view; filters in one bar · phone: panels stacked, tables become cards.
- **Calendar, Planner, To-do, Goals** · plan the days · calendar as the stage with the day list in a sheet; goals slider simplified to two inputs; all inside the tray on phone.

### Compete
- **Battles list, Challenge `/challenge/[id]`, Arena leaderboard (Friends, Everyone, Season)** · play friends · lobby cards with presence dots; a result screen with both scores, rating change and rematch as primary; leaderboard with a segmented scope and a pinned "you" row; season badges beside names · phone: leaderboard as list with pinned row.

### Account, billing and extras
- **Profile and settings, Referral, Telegram link, Devices, Downloads, Receipt** · manage my account · Form template; sections: Profile, Plan and payments, Telegram, Devices, Look, Danger zone; plan card at the top with the single upgrade action.
- **Design Studio** · choose a look · the new theme becomes the default; Looks stay as optional extras with a live preview card.
- **Admin** · Overview, Funnel, Links · tabs as segmented control; tables with sticky headers; no decorative motion.

### Modals and overlays (all migrate to Dialog or Sheet)
Upgrade sheet (with per-day price and Mentor recharges), auth, confirm dialogs, branch change, schedule block, quick panels (calendar, to-do, goal, leaderboard, look), report an issue, share card, virtual calculator, post-purchase tour, install prompt, Look trial chip, offline banner, version-update toast, cookie notice.

## 8. Phone specifics
Bottom glass pill (5 items, 56 px high, 12 px from the edge, safe-area aware); thumb zone: primary actions in the lower third; sheets instead of centred modals; 44 px minimum targets; the keyboard never covers the input (Mentor, forms); landscape keeps the exam usable (palette as a drawer); no hover-only behaviour; blur reduced to the pill and the hero; text never below 14 px; images lazy-load except the first.

## 9. Delivery: phases, gates and tests
| Phase | Content | Gate |
|---|---|---|
| 0 (done on the branch) | Palette tokens as the `lunar` Look; light and dark | Looks switch cleanly; contrast table passes |
| 1 | Primitives: Button, Card (3 weights), Segmented control, fields, chips, Dialog and Sheet, toasts; motion tokens | Storybook-style gallery page at `/design-system`; all states shown |
| 2 | Shell: left dock, mobile pill, tray, command bar, command palette, stage | Keyboard and screen-reader pass; no layout shift |
| 3 | Hubs: Dashboard, Mentor home, Test Centre, Plans | Owner review of desktop and phone screenshots |
| 4 | Tasks and exam: Setup, Practice, Exam wrapper, Results, Review | Exam fidelity check (same functions, same timings); scoring tests green |
| 5 | Review, Study, Analytics, Calendar, Battles, Profile, Billing, Admin, public pages | Screenshot sweep |
| 6 | Dark mode polish, empty/loading/error states, motion pass, reduced-motion pass | Accessibility audit (WCAG AA), Lighthouse and the bundle budget |
| 7 | Flip default Look to Lunar on `main` | Owner sign-off |

Test matrix for every phase: desktop 1440 and 1280, phone 390, light and dark, signed-out and signed-in, Free and Pro; the existing end-to-end smoke, `check:perf`, `check:images`, `check:security` must stay green; screenshot comparison before and after for every route; real-device phone check for the exam and the Mentor.

## 10. Risks and decisions (resolved on 7 Nov 2026; the owner delegated these)

| Question | Decision | Why and how it is protected |
|---|---|---|
| Glass on low-end phones | **Auto "lite effects" mode.** Blur and animated backgrounds switch off when `navigator.deviceMemory <= 4`, `hardwareConcurrency <= 4`, `prefers-reduced-transparency`, or `prefers-reduced-motion`. Blur exists only on the dock, the hero card, sheets and popovers. | Measured before the default flips: Playwright with 4x and 6x CPU throttling on the exam, Mentor and dashboard, with a frame-time and INP budget (phase 6 gate). |
| Exam fidelity | **Chrome changes only; the function does not.** The same palette states (answered, not answered, not visited, marked, marked and answered), the same timer, the same keyboard shortcuts, the same scoring. | The scoring, grading and mock-order check scripts must stay green; a side-by-side screenshot review against the current exam. |
| Options directly under the question | **Approved.** Behind a switch (`examLayout=compact`, default on) so it can be reverted in one line. | Same answer logic; only the vertical arrangement changes. |
| Paid Looks | The new theme becomes the **free default**. Looks stay as optional extras, so the Pro Looks promise is unchanged. | The Look system is kept as it is. |
| Scale | A multi-week programme shipped as phases on the branch; `main` stays shippable. | Section 9 gates. |
| Dock and tray layout | **Approved as in section 3**, with a switch back to the classic top bar during the transition. | Removes the risk of a big-bang change. |
| Results: one primary action and 8 tiles to 4 | **Approved.** Nothing is deleted: the four tiles removed (attempted, skipped, penalty, time detail) move into the "Breakdown" segment below. | Same data, calmer first view. |
| Logo palette | **Confirmed:** the owner's table (Lavender, Powder Blue, Peach, Deep Navy, White) applied to the **original logo shape**; see the single prompt at the top of `LOGO-MASTER-PROMPT.md`. | New logo files will be wired in on arrival; until then the existing mark is used in the dock. |

## 11. Trending interactions: what we adopt, what we adapt, and what we change from the reference snippets

The owner supplied ten effects as references. They are good ideas, and several of the snippets, applied exactly as written, would hurt the product. This table is the engineering decision for each. All effects use the `motion` package already installed (`motion/react`, the same API as framer-motion), the shared motion tokens of section 6, and honour reduced motion.

| # | Effect | Verdict | Where it goes | Corrections to the snippet |
|---|---|---|---|---|
| 1 | Morphing tabs (glide pill) | **Adopt, as the one Segmented control** | Test Centre command bar, Analytics ranges, leaderboard scope, Review tabs, Plans period, Mentor tone | Wrap each group in `LayoutGroup` and give every instance a unique `layoutId` (two groups on a page would collide); arrow-key support and `role="tablist"`; muted text uses `#566379`, not `#64748B` (3.9:1 fails). |
| 2 | Magnetic spotlight cards | **Adapt** | Plan cards, Forge and hub tiles (not list rows) | Only where `(hover: hover)`; follow the pointer with `requestAnimationFrame`; no extra `backdrop-blur-2xl` per card (blur on every card is the main phone cost); the highlight's radius must match the card (the snippet mixes 32 px and `rounded-xl`). |
| 3 | Parallax card stacking | **Adapt** | Dashboard "Coming up" (3 cards) and the landing feature stack | The snippet's scale is computed from the index, so it does not react to scrolling; drive it with `useScroll` and `useTransform` per card; keep content reachable; plain stack under reduced motion; test on a phone. |
| 4 | Elastic swipe-to-action | **Adopt on phone lists, with safeguards** | Mistakes, Bookmarks, Revision queue | Add visible buttons or a kebab menu (swipe-only is not discoverable or accessible); "Remove" gets a 5-second **Undo** instead of instant deletion; swipe right = "Revise now"; `touch-action: pan-y` so vertical scrolling is not stolen; light haptic where supported. (The snippet's `useDrag` note is wrong: Motion uses the `drag` props, which the code correctly uses.) |
| 5 | Dynamic mesh aurora | **Adapt** | Dashboard hero and Mentor chat background on desktop only | A full-viewport fixed layer with `blur-[100px]` and `mix-blend-multiply` animating is one of the most expensive things a browser can do; on phones and lite mode it is **two static colour fields** (already in the Look); paused during exams and when the tab is hidden; `/noise.png` does not exist, so the grain is a tiny generated tile or skipped. |
| 6 | Expandable bento (fluid modal) | **Adopt, narrowly** | Dashboard summary cards that have a quick view (Mistakes, Analytics snapshot, Mentor status) | The route and deep link stay (an "Open full page" button inside); focus trap, focus return, Esc, scroll lock; a full-screen Sheet on phone. The brief's "wrap the Test/Mock score summary" is not done: the result page is a destination, not a card in a grid. |
| 7 | Magnetic call-to-action | **Adapt, narrowly** | **Hero CTAs only**: landing "Try a quick sample test", Plans "Get Pro", the dashboard hero action | Only `(hover: hover) and (pointer: fine)`, a maximum pull of 6 px, off under reduced motion. **Not applied to every `.btn-main`**: hundreds of buttons listening to the mouse, targets that move under the cursor reduce click accuracy, and exam screens must stay still. |
| 8 | Dynamic Island timer | **Adapt** | A running timed test or All-India mock while the student is elsewhere in the app; a pending Battle invite | One timer source: the exam runtime store with `serverNow()`, never a second clock; hidden on the exam page itself (the header timer stays); "Submit" asks for confirmation; "Pause" is not shown for All-India mocks (they cannot be paused); sits below dialogs; respects the phone safe area. |
| 9 | Fluid odometer | **Adapt** | Rank and rating changes, streak increments, the score on the results reveal | Animate only when the value **changes** after first paint (and once on the result reveal); never on a static analytics number at mount; tabular digits with fixed width so nothing jitters; key by digit **position**; reduced motion shows the number. It replaces `CountUp`, which flickers (the same bug as the reel). |
| 10 | Ethereal success orbs | **Adopt** | Strong result, Daily Forge finished, referral reward, season badge | `aria-hidden`; once per event id; at most 12 orbs; `transform` and `opacity` only, with pre-blurred radial backgrounds instead of animating `filter: blur`; off under reduced motion. |

Additional motion logic worth adding in the same system: **shared-element transitions** between a list item and its detail (View Transitions API with a fade fallback); **scroll-linked progress** on long Reading pages; **skeleton to content cross-fade**; **layout animation** when a list filters or reorders; a **press-and-hold** confirmation on the exam Submit as an accidental-tap guard; the **command palette** spring.

## 12. Coverage statement

Every one of the 70 page routes and the 179 component files, plus the global style files, the Look system, the app icons, the manifest and share images, is listed with its template, what changes and its phase in [`UIUX-COVERAGE-MATRIX.md`](UIUX-COVERAGE-MATRIX.md). The matrix is generated from the code by a script, and it reports **0 unmapped** routes and files (one gap, `components/theme-provider.tsx`, was found by the script and added). Anything added to the app later must be added to the matrix; the script is `docs/design/` friendly and can be re-run.


See also: [MOTION-INTERACTION-CATALOGUE.md](MOTION-INTERACTION-CATALOGUE.md) (the full list, 21 effects, mapped to the chosen screens).

---

## Navigation decision (7 Nov 2026): where the menus live

Question from the owner: the bottom dock of variant 02 could collide with other bottom-anchored items; decide, from research, whether pages go left or elsewhere.

**Decision**

| Surface | Desktop | Phone |
|---|---|---|
| Pages (Home, Test Centre, Study, AI Mentor, Review, Analytics, Battles) | **Slim floating glass rail on the left**: seven icons, name on hover or focus, one gliding indicator | Floating bottom pill of five (Home, Test Centre, Review, AI Mentor, More) |
| Logo | Top-left (original mark, Bruno Ace SC wordmark, PRO badge) | Top-left |
| Tools group (search, planner, to-do, focus target, leaderboard, tools, theme, paper chip, profile) | One glass pill, top-right | Compact pill, top-right |
| Tools and legal section dock | **Top of the page** (centre), was bottom centre | Unchanged, above the tab bar |
| Bottom of the desktop screen | **Reserved for page actions** | The tab pill |

**Why (evidence and the app's own conflicts)**

- Research this turn: sidebars are the usual desktop choice for complex apps and for six or more destinations; a bottom tab bar is mainly a mobile pattern (source list in the sources section of [MOTION-INTERACTION-CATALOGUE.md](MOTION-INTERACTION-CATALOGUE.md) and the search results of 7 Nov); utilities such as account and settings are kept apart from primary navigation, which the top-right tools group already does. Vertical space is scarcer than horizontal on laptops. (Sources were agency blogs; I found no NN/g article on this, so the app's own conflicts below carry the decision.)
- The code already anchors things to the bottom centre on desktop, and a global bottom dock would sit on top of all of them: the Test Centre "Start test" bar (`setup/page.tsx`, fixed bottom-6 centre), the tools and legal section dock (`seo/sub-nav.tsx`, bottom-5 centre), the profile save bar (`profile/page.tsx`), the results banner (`exam/results/page.tsx`), the look trial chip (`look-applier.tsx`), and the Mentor composer.
- The left rail holds only pages, so it stays uncrowded; the logo and tools stay where the owner asked.

Supersedes the earlier choice of variant 02's bottom dock for desktop navigation. The classic look is unchanged: all of this is the Lunar look.
