# R18 · Full UI/UX upgrade plan (27 Oct 2026)

Owner brief: the UI looks ugly; fix stacking, share card, dashboard first experience; texture background with the gradient;
no gold/silver navbar effects (crown + PRO badge only); new styles (tab windows, stacks and more) across every screen.

## Research summary

Sources checked: Awwwards/Godly/Dribbble trend round-ups for 2026, EdTech dashboard work on Dribbble/Contra.
Mobbin and Refero need a login to browse, so they were not used directly.

- Bento grids are now the default for dashboards and feature sections, with 6 to 9 tiles as a sensible ceiling
  ([b12](https://www.b12.io/resource-center/website-design/web-design-guide-bento-grids-and-kinetic-typography/), [line25](https://line25.com/articles/web-design-trends-2026/)).
- Texture is back (grain, dot grids) as a quiet layer behind key sections, not a full-page effect ([theplusaddons](https://theplusaddons.com/blog/web-design-trends-2026/)).
- Neo-brutalism survives only as an accent, for example one hard-shadow call to action ([bubble](https://bubble.io/blog/web-design-trends/)).
- EdTech dashboards that work put weekly progress first and tasks below, and fight clutter with hierarchy, not more cards
  ([Contra](https://contra.com/p/2qBqQgWv-intuitive-e-learning-dashboard-design-for-enhanced-engagement)).
- Competitor Swaseekh: the stacked feature deck is its strongest moment; everything else is a plain list.

## Design direction: "exam desk"

The subject is a student's desk the night before an exam: graph paper, highlighter tints, index-card tabs.
That gives a distinct look that isn't the generic SaaS card kit.

| Token | Value | Role |
|---|---|---|
| Canvas | `#faf8f5` / dark `#0e0d14` | page, with a faint 24 px dot grid (graph paper) |
| Ink | `#16123a` | text, solid pills |
| Violet | `#6d28d9` | the one brand accent: primary actions, active tab |
| Highlighters | mint, rose, peach, peri, lilac, butter, sky | subject and feature tints only, never for chrome |
| Radius | 28 / 18 / 999 | big surfaces / inner panels / pills: three steps, chosen by hierarchy |

Type: Bricolage Grotesque for display numbers and headings, Manrope for body, no monospace for labels.
Labels in sentence case, no tracked all-caps eyebrows (replace the current `section-label` style).

## Components to add

1. **Folder tabs (the "tab window")**: index-card tabs that join the panel below them; the active tab
   takes the panel colour. Use on Analytics (Overview / Subjects / Mistakes), Profile (Account / Plan / Telegram),
   Mocks (Upcoming / Past), Browse subjects.
2. **Segmented control**: pill track with a sliding thumb (motion `layoutId`) for short switches: 3/5/7 days, light/dark, PYQ year range.
3. **Stack deck** (done, now clipped to tidy lips): only on the dashboard toolkit and the landing page.
4. **Bento grid v2**: one 2x2 hero tile + up to 6 tiles; each tile shows a live number, not a paragraph.
5. **Hard-shadow CTA**: one per screen, the main action (ink border, 4 px offset shadow, presses down on click).
6. **Command bar**: the navbar search becomes a ⌘K palette (jump to topic, mock, AI mentor).
7. **Toasts and confirmations** with the same verb as the button.

## Navbar and profile

- Navbar: logo left; centre becomes folder tabs for the 4 main areas (Practise, Mocks, Mentor, Progress);
  right side keeps search, branch chip and avatar; the 6 small icons move into the avatar menu and the ⌘K palette.
- No gold/silver rings (done); Pro shows the crown and PRO badge only.
- Profile: a header card (avatar, name, branch, plan) and folder tabs below instead of one long scroll.

## Dashboard first experience

Problem today: the hero and the "Find your starting point" card both ask for the same 20-question test,
and a new user sees empty rings (0%, 0%, 0d) before anything.

New order for a new user:
1. Hero: greeting, days to GATE, one hard-shadow button "Take the 20-question start test", and the goal picker inline.
   No empty rings; instead a preview of what the dashboard will show after the test.
2. Toolkit stack deck.
3. Telegram rooms.

For a returning user: hero with next action and real rings → Today strip (tasks + timer as one card) → bento → deck.

## Motion

One orchestrated moment per screen (the hero numbers count up once). Everything else answers an action:
tab switch slides the indicator, cards press down on tap, deck clips on scroll. Reduced motion: none of it.

## Scope: every screen and every component

Nothing is left on the old look. Each row below is redone with the shared system (tokens, FolderTabs, Segmented,
HardButton, card radii, sentence-case labels, motion rules). "Done" in the checklist only when the row is checked
on desktop + mobile, light + dark.

### Shared UI kit (components/ui) — done first, every screen inherits it
| Component | New treatment |
|---|---|
| button | 4 variants only: ink solid, violet solid, soft tint, ghost; one hard-shadow "main" variant per screen; press-down on tap |
| card | 3 levels: surface (28px), inset panel (18px), chip (pill); tint by subject only |
| custom-dropdown, combobox | popover sheet with search, check marks, keyboard nav; bottom sheet on mobile |
| date-picker, time-picker | calendar grid with today ring, highlighter range fill; time as wheel chips |
| number-stepper | segmented − value + with spring on change |
| confirm-dialog, toast-container | same verb as the button; toast slides from the bottom-right (bottom on mobile), with undo where possible |
| tooltip-layer | small ink tooltip, 150 ms delay |
| goal-tag-badge, smart-truncate, code-block | badge = soft pill with icon; code block with copy button and line numbers |
| personal-notes-drawer, report-issue-button | right drawer with handle; report = small ghost icon button |
| fullscreen-navigation/toggle, reveal, interactive | unified icon buttons; reveal follows the one-moment motion rule |

### App shell (components/layout)
| Component | New treatment |
|---|---|
| topbar | logo · 4 folder tabs (Practise, Mocks, Mentor, Progress) · search · branch chip · avatar |
| bottom-tab-bar (mobile) | 5 tabs with a sliding pill indicator, raised centre "Practise" button |
| todo-quick-panel | checklist card: drag to reorder, swipe to complete (mobile), tick animation, due chips, group by Today / Later |
| calendar-quick-panel, compact-calendar-view | week strip on top + month grid; events as highlighter bars by subject; add event as bottom sheet |
| goal-slider-panel | Segmented for Focus Target %, live preview of topics kept |
| leaderboard-panel | podium for top 3, list with your row pinned |
| review-tabs | FolderTabs (Mistakes / Bookmarks / Revision) |
| account-button, branch-chip | avatar menu holds the 6 old icons; branch chip opens branch modal |
| footer, launch-intro, client-layout | footer in columns; intro = one orchestrated reveal |

### Dashboard (components/dashboard + planner)
hero-section/bento NextActionHero, today-card, study-timer (ring timer with start/pause morph), focus-center,
metrics-strip, progress-visualizer, github-heatmap (rounded cells, month labels, tooltip), exam-countdown-card,
weekly-benchmark-card, recent-exams, activity-timeline (vertical timeline with icons), incomplete-tests,
diagnostic-card, quick-actions, mock-status-card, study-planner, signed-out-welcome, feature-deck,
missed-blocks-card, today-blocks-card, plan-manager, plan-insights, availability-editor (drag-select grid),
schedule-modal: all onto the bento v2 grid and kit; first-run state rebuilt (see above).

### Practice and exam (components/exam, setup, browse, exam/*, fresh-mock, checkpoint, challenge)
setup (FolderTabs: Subject / Topic / Year / Custom), custom-test-builder, browse, question-renderer,
option-renderer (A–D as keycaps, selected = ink fill), nat-input, question-palette (status legend as chips),
section-tabs, exam-timer, virtual-calculator, command-palette, exam-submit-dialog, answers-pending-banner,
question-meta, time-split-tips, premium-image-gallery. The exam screen keeps the official GATE layout for
realism; only the chrome around it is restyled.

### Results, review, analytics
exam/results, results/review, mocks/results, mock-results-gate, diagnostics, mistakes, bookmarks, revision,
revision/session, analytics (FolderTabs: Overview / Subjects / Mistakes / Time), mock-analytics, topic-ladders,
share-result-button, charts (one palette, light + dark).

### AI, mocks, calendar, downloads, profile, billing
ai-mentor, ai-tutor (chat bubbles, coach picker as cards), mocks, calendar page (full month/week views),
downloads + viewer, profile (header card + FolderTabs: Account / Plan / Stats / Telegram / Data), avatar-picker,
stats-achievements (badge shelf), goal-plan, referral-card, share-card, billing-history, data-storage-card,
exam-branch-panel, account-settings, pro page + plans-content (3-column plan cards, Pro highlighted),
upgrade-modal, tier-gate, plan-expiry-notice, smart-upgrade, receipt.

### Auth, growth, system
login, signup, reset-password (+confirm), auth-modal, onboarding-gate (stepper), google button, guest banners
and locks, branch-modal, device-limit-dialog, install-prompt, invite-nudge, telegram-join, sponsor-slot,
version-watch toast.

### Public pages (marketing, SEO, legal)
landing (stack deck + compare-faq), about, pyq index/paper/question, syllabus pages, topics, articles,
ga-lessons, gate-updates, gate-2027-changes, tools (cut-offs, score calculator, study plan), referral /r/[code],
legal pages (one readable article layout), all seo/* components.

## Rollout (each step: desktop + mobile, light + dark checked, then pushed)

| Step | Scope |
|---|---|
| U1 | Done 27 Oct: share card, stack deck, navbar rings, dot-grid texture |
| U2 | Shared UI kit (every components/ui file) + tokens + FolderTabs, Segmented, HardButton; sentence-case labels |
| U3 | App shell: topbar, bottom tab bar, to-do panel, calendar panel, goal slider, leaderboard, account menu, Ctrl+K |
| U4 | Dashboard and planner (every component listed) incl. first experience |
| U5 | Practice and exam chrome; results, review, analytics |
| U6 | AI mentor/tutor, mocks, calendar page, downloads, profile, billing |
| U7 | Auth, onboarding, growth and system dialogs |
| U8 | Public pages; final accessibility audit (WCAG AA) across all screens |
