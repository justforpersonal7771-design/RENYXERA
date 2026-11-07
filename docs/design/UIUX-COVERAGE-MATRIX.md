# UI/UX coverage matrix: every route and every component file

[← Docs index](../README.md) · [UI/UX overhaul plan](UIUX-OVERHAUL-PLAN.md)

Generated 7 Nov 2026 by a script that walks `app/**/page.tsx` and `components/**/*.tsx`, so it is a complete list, not a summary. Phase numbers are those of section 9 of the plan. A row that says UNMAPPED would be a gap; there are 0 of them.

## Also covered (not routes or components)

- **Global style layer:** `app/globals.css`, `app/looks.css`, `app/looks-details.css`, `app/looks-pro2.css` (tokens, shared card and button classes, the Look system): phases 0, 1 and 6.
- **API routes** (`app/api/**`): no UI; unchanged.
- **Special files:** `app/layout.tsx` (fonts, Look bootstrap, the island host), `app/icon.png` and `app/apple-icon.png` (new logo), `public/manifest.json` and `public/og/*` (new logo), `sitemap.ts` and `robots.ts` (no UI).
- **Transactional surfaces outside the app:** Telegram messages, Instagram posts, receipts, share cards and the ad: recoloured with the same palette (phase 6).

## Routes (70)

| Route | Template | Plan section | Phase |
|---|---|---|---|
| `/` | Hub | 7 Home and coach: Dashboard / Landing | 3 |
| `/[slug]` | Reading | 7 Branch landing pages | 5 |
| `/about` | Reading | 7 Public and reading pages | 5 |
| `/admin` | Hub | 7 Admin | 5 |
| `/ai-mentor` | Hub | 7 AI Mentor home | 3 |
| `/ai-mentor/chat` | Task | 7 AI Mentor chat | 3 |
| `/ai-tutor` | Task | 7 AI Tutor | 5 |
| `/analytics` | Hub | 7 Analytics and Coach insights | 5 |
| `/analytics/coach` | Hub | 7 Analytics and Coach insights | 5 |
| `/articles/most-repeated-gate-cs-topics` | Reading | 7 Public and reading pages | 5 |
| `/articles/most-repeated-topics` | Reading | 7 Public and reading pages | 5 |
| `/articles/most-repeated-topics/[branch]` | Reading | 7 Public and reading pages | 5 |
| `/battles` | Hub | 7 Battles, Challenge, short links | 5 |
| `/bookmarks` | Hub | 7 Mistakes, Bookmarks, Forge hub | 5 |
| `/browse` | Hub | 7 Mistakes, Bookmarks, Forge hub | 5 |
| `/calendar` | Task | 7 Calendar, Planner | 5 |
| `/challenge` | Hub | 7 Battles, Challenge, short links | 5 |
| `/challenge/[id]` | Hub | 7 Battles, Challenge, short links | 5 |
| `/checkpoint` | Task | 7 Practice, Checkpoint, Revision | 4 |
| `/compare` | Reading | 7 Public and reading pages | 5 |
| `/contact` | Reading | 7 Public and reading pages | 5 |
| `/cookies` | Reading | 7 Public and reading pages | 5 |
| `/design-studio` | Form | 7 Account, billing and extras | 5 |
| `/disclaimer` | Reading | 7 Public and reading pages | 5 |
| `/downloads` | Form | 7 Account, billing and extras | 5 |
| `/downloads/view` | Form | 7 Account, billing and extras | 5 |
| `/exam/diagnostics` | Exam (frozen) | 7 Diagnostics | 4 |
| `/exam/results` | Task | 7 Results | 4 |
| `/exam/results/review` | Task | 7 Review (results review) | 4 |
| `/exam/session` | Exam (frozen) | 7 Exam session | 4 |
| `/forge` | Hub | 7 Mistakes, Bookmarks, Forge hub | 5 |
| `/fresh-mock` | Task | 7 Practice, Checkpoint, Revision | 4 |
| `/ga-lessons` | Reading | 7 Study, GA lessons, Syllabus, Topics | 5 |
| `/gate-2027-changes` | Reading | 7 Public and reading pages | 5 |
| `/gate-cs-syllabus` | Reading | 7 Study, GA lessons, Syllabus, Topics | 5 |
| `/gate-updates` | Reading | 7 Public and reading pages | 5 |
| `/login` | Form | 7 Login, signup, reset | 5 |
| `/mistakes` | Hub | 7 Mistakes, Bookmarks, Forge hub | 5 |
| `/mocks` | Hub | 7 Mocks and Mock results | 4 |
| `/mocks/results` | Hub | 7 Mocks and Mock results | 4 |
| `/privacy` | Reading | 7 Public and reading pages | 5 |
| `/pro` | Hub | 7 Plans | 3 |
| `/profile` | Form | 7 Account, billing and extras | 5 |
| `/pyq` | Reading | 7 Public and reading pages | 5 |
| `/pyq/[paper]` | Reading | 7 Public and reading pages | 5 |
| `/pyq/[paper]/[q]` | Reading | 7 Public and reading pages | 5 |
| `/r/[code]` | Hub | 7 Battles, Challenge, short links | 5 |
| `/receipt` | Form | 7 Account, billing and extras | 5 |
| `/refunds` | Reading | 7 Public and reading pages | 5 |
| `/reset-password` | Form | 7 Login, signup, reset | 5 |
| `/reset-password/confirm` | Form | 7 Login, signup, reset | 5 |
| `/revision` | Task | 7 Practice, Checkpoint, Revision | 4 |
| `/revision/session` | Task | 7 Practice, Checkpoint, Revision | 4 |
| `/setup` | Task | 7 Build a test / Setup | 4 |
| `/signup` | Form | 7 Login, signup, reset | 5 |
| `/study` | Reading | 7 Study, GA lessons, Syllabus, Topics | 5 |
| `/syllabus` | Reading | 7 Study, GA lessons, Syllabus, Topics | 5 |
| `/terms` | Reading | 7 Public and reading pages | 5 |
| `/test-centre` | Hub | 7 Test Centre hub | 3 |
| `/test-centre/build` | Task | 7 Build a test / Setup | 4 |
| `/test-centre/history` | Hub | 7 Test Centre (History) | 4 |
| `/test-centre/mocks` | Hub | 7 Mocks and Mock results | 4 |
| `/test-centre/mocks/results` | Hub | 7 Mocks and Mock results | 4 |
| `/test-centre/practice` | Task | 7 Practice, Checkpoint, Revision | 4 |
| `/tools` | Reading | 7 Public and reading pages | 5 |
| `/tools/gate-branch-cutoffs` | Reading | 7 Public and reading pages | 5 |
| `/tools/gate-cs-cutoff` | Reading | 7 Public and reading pages | 5 |
| `/tools/gate-score-calculator` | Reading | 7 Public and reading pages | 5 |
| `/tools/gate-study-plan` | Reading | 7 Public and reading pages | 5 |
| `/topics/[subject]` | Reading | 7 Study, GA lessons, Syllabus, Topics | 5 |

## Components (179 files)


### components/ads

| File | Area | What happens to it | Phase |
|---|---|---|---|
| `sponsor-slot.tsx` | Ads | Sponsor slot as a flat card | 6 |

### components/analytics

| File | Area | What happens to it | Phase |
|---|---|---|---|
| `coach-insights.tsx` | Analytics | Readiness hero, flat charts, table views | 5 |
| `mock-analytics.tsx` | Analytics | Readiness hero, flat charts, table views | 5 |
| `topic-ladders.tsx` | Analytics | Readiness hero, flat charts, table views | 5 |

### components/auth

| File | Area | What happens to it | Phase |
|---|---|---|---|
| `auth-modal.tsx` | Auth | Glass card and Sheet | 5 |
| `field-error.tsx` | Auth | Glass card and Sheet | 5 |
| `forgot-password-form.tsx` | Auth | Glass card and Sheet | 5 |
| `google-auth-button.tsx` | Auth | Glass card and Sheet | 5 |
| `guest-data-banner.tsx` | Auth | Glass card and Sheet | 5 |
| `guest-local-notice.tsx` | Auth | Glass card and Sheet | 5 |
| `guest-lock.tsx` | Auth | Glass card and Sheet | 5 |
| `login-form.tsx` | Auth | Glass card and Sheet | 5 |
| `onboarding-gate.tsx` | Auth | Glass card and Sheet | 5 |
| `signup-form.tsx` | Auth | Glass card and Sheet | 5 |
| `turnstile-widget.tsx` | Auth | Glass card and Sheet | 5 |

### components/billing

| File | Area | What happens to it | Phase |
|---|---|---|---|
| `mentor-recharges.tsx` | Billing | Quiet row under the plan cards | 3 |
| `plan-expiry-notice.tsx` | Billing | Plan cards, upgrade Sheet, recharges, tour | 3 |
| `plans-compare.tsx` | Billing | Comparison table restyled | 3 |
| `plans-content.tsx` | Billing | Plan cards with spotlight; Pro as hero card | 3 |
| `post-purchase-tour.tsx` | Billing | Dialog sequence | 3 |
| `tier-gate.tsx` | Billing | Plan cards, upgrade Sheet, recharges, tour | 3 |
| `upgrade-modal.tsx` | Billing | Becomes the upsell Sheet | 1 |

### components/branch

| File | Area | What happens to it | Phase |
|---|---|---|---|
| `branch-modal.tsx` | Branch | Branch change Sheet | 5 |

### components/brand

| File | Area | What happens to it | Phase |
|---|---|---|---|
| `mentor-logo.tsx` | Brand | New logo files, mark in dock | 2 |
| `mentor-mark.tsx` | Brand | New logo files, mark in dock | 2 |
| `pro-crown.tsx` | Brand | New logo files, mark in dock | 2 |
| `wordmark.tsx` | Brand | New logo files, mark in dock | 2 |

### components/dashboard

| File | Area | What happens to it | Phase |
|---|---|---|---|
| `activity-timeline.tsx` | Dashboard | Hero card, stat capsules, coming-up stack | 3 |
| `bento.tsx` | Dashboard | Hero card, stat capsules, coming-up stack | 3 |
| `coming-up.tsx` | Dashboard | Hero card, stat capsules, coming-up stack | 3 |
| `diagnostic-card.tsx` | Dashboard | Hero card, stat capsules, coming-up stack | 3 |
| `exam-countdown-card.tsx` | Dashboard | Hero card, stat capsules, coming-up stack | 3 |
| `feature-deck.tsx` | Dashboard | Hero card, stat capsules, coming-up stack | 3 |
| `focus-center.tsx` | Dashboard | Hero card, stat capsules, coming-up stack | 3 |
| `github-heatmap.tsx` | Dashboard | Hero card, stat capsules, coming-up stack | 3 |
| `hero-section.tsx` | Dashboard | Hero card, stat capsules, coming-up stack | 3 |
| `incomplete-tests.tsx` | Dashboard | Hero card, stat capsules, coming-up stack | 3 |
| `metrics-strip.tsx` | Dashboard | Hero card, stat capsules, coming-up stack | 3 |
| `mock-status-card.tsx` | Dashboard | Hero card, stat capsules, coming-up stack | 3 |
| `progress-visualizer.tsx` | Dashboard | Hero card, stat capsules, coming-up stack | 3 |
| `quick-actions.tsx` | Dashboard | Hero card, stat capsules, coming-up stack | 3 |
| `recent-exams.tsx` | Dashboard | Hero card, stat capsules, coming-up stack | 3 |
| `signed-out-welcome.tsx` | Dashboard | Hero card, stat capsules, coming-up stack | 3 |
| `stack-cards.tsx` | Dashboard | Hero card, stat capsules, coming-up stack | 3 |
| `study-planner.tsx` | Dashboard | Hero card, stat capsules, coming-up stack | 3 |
| `study-timer.tsx` | Dashboard | Hero card, stat capsules, coming-up stack | 3 |
| `today-card.tsx` | Dashboard | Hero card, stat capsules, coming-up stack | 3 |
| `weekly-benchmark-card.tsx` | Dashboard | Hero card, stat capsules, coming-up stack | 3 |

### components/exam

| File | Area | What happens to it | Phase |
|---|---|---|---|
| `answers-pending-banner.tsx` | Exam | Frozen template: chrome restyled, options under the question | 4 |
| `ast-node-renderer.tsx` | Exam | No visual change (content renderer) | 4 |
| `command-palette.tsx` | Exam | Frozen template: chrome restyled, options under the question | 4 |
| `custom-test-builder.tsx` | Exam | Frozen template: chrome restyled, options under the question | 4 |
| `exam-submit-dialog.tsx` | Exam | Frozen template: chrome restyled, options under the question | 4 |
| `exam-timer.tsx` | Exam | Single timer source; shown in the island when browsing away | 4 |
| `flashcards.tsx` | Exam | Frozen template: chrome restyled, options under the question | 4 |
| `image-theme-adapter.tsx` | Exam | Frozen template: chrome restyled, options under the question | 4 |
| `mock-results-gate.tsx` | Exam | Frozen template: chrome restyled, options under the question | 4 |
| `nat-input.tsx` | Exam | Frozen template: chrome restyled, options under the question | 4 |
| `option-renderer.tsx` | Exam | Option tiles restyled, logic unchanged | 4 |
| `premium-image-gallery.tsx` | Exam | Zoom Sheet; first image eager | 4 |
| `question-meta.tsx` | Exam | Frozen template: chrome restyled, options under the question | 4 |
| `question-palette.tsx` | Exam | Fixed right panel; bottom Sheet on phone | 4 |
| `question-renderer.tsx` | Exam | Question card, options directly beneath | 4 |
| `section-tabs.tsx` | Exam | Frozen template: chrome restyled, options under the question | 4 |
| `source-mixer.tsx` | Exam | Frozen template: chrome restyled, options under the question | 4 |
| `spark-generator.tsx` | Exam | Frozen template: chrome restyled, options under the question | 4 |
| `time-split-tips.tsx` | Exam | Frozen template: chrome restyled, options under the question | 4 |
| `virtual-calculator.tsx` | Exam | Chrome restyled; phone layout kept | 4 |

### components/forge

| File | Area | What happens to it | Phase |
|---|---|---|---|
| `forge-hub.tsx` | Forge | Hub, locked cards, upsell pattern | 5 |

### components/friends

| File | Area | What happens to it | Phase |
|---|---|---|---|
| `arena-leaderboard.tsx` | Battles | Lobby, leaderboard, season badges | 5 |
| `friends-panel.tsx` | Battles | Lobby, leaderboard, season badges | 5 |
| `invite-friends.tsx` | Battles | Lobby, leaderboard, season badges | 5 |
| `live-lobby.tsx` | Battles | Lobby, leaderboard, season badges | 5 |
| `presence-ping.tsx` | Battles | Lobby, leaderboard, season badges | 5 |
| `social-dot.tsx` | Battles | Lobby, leaderboard, season badges | 5 |

### components/growth

| File | Area | What happens to it | Phase |
|---|---|---|---|
| `install-prompt.tsx` | Growth | Nudges, share, invite on the new cards | 5 |
| `invite-nudge.tsx` | Growth | Nudges, share, invite on the new cards | 5 |
| `share-card.tsx` | Growth | Nudges, share, invite on the new cards | 5 |
| `smart-upgrade.tsx` | Growth | Nudges, share, invite on the new cards | 5 |
| `telegram-join.tsx` | Growth | Nudges, share, invite on the new cards | 5 |

### components/layout

| File | Area | What happens to it | Phase |
|---|---|---|---|
| `account-button.tsx` | Shell | Moves to the dock bottom and the account menu | 2 |
| `bottom-tab-bar.tsx` | Shell | REPLACED by the floating bottom pill | 2 |
| `branch-chip.tsx` | Shell | Moves into the account menu and page header | 2 |
| `calendar-quick-panel.tsx` | Shell | Becomes a section of the Tools tray | 2 |
| `client-layout.tsx` | Shell | Hosts the stage, the dock, the island and sheets | 2 |
| `compact-calendar-view.tsx` | Shell | Dock, tray, command bar, mobile pill (replaces the top island) | 2 |
| `footer.tsx` | Shell | Restyled; compact on phone | 6 |
| `goal-slider-panel.tsx` | Shell | Becomes a section of the Tools tray | 2 |
| `launch-intro.tsx` | Shell | Restyled intro; skipped for reduced motion | 6 |
| `leaderboard-panel.tsx` | Shell | Becomes a section of the Tools tray | 2 |
| `look-quick-panel.tsx` | Shell | Becomes a section of the Tools tray | 2 |
| `mentor-nav-button.tsx` | Shell | Becomes the AI Mentor dock item | 2 |
| `review-tabs.tsx` | Shell | Becomes the Review segmented control | 2 |
| `test-centre-bar.tsx` | Shell | REPLACED by the Test Centre command bar | 2 |
| `test-centre-menu.tsx` | Shell | Folded into the command bar | 2 |
| `todo-quick-panel.tsx` | Shell | Becomes a section of the Tools tray | 2 |
| `topbar.tsx` | Shell | REPLACED by the left dock and the Tools tray | 2 |

### components/looks

| File | Area | What happens to it | Phase |
|---|---|---|---|
| `design-studio.tsx` | Design Studio | Studio and appliers; new default Look | 5 |
| `look-applier.tsx` | Design Studio | Studio and appliers; new default Look | 5 |
| `look-preview.tsx` | Design Studio | Studio and appliers; new default Look | 5 |

### components/marketing

| File | Area | What happens to it | Phase |
|---|---|---|---|
| `compare-faq.tsx` | Public pages | Reading template and landing | 3 |
| `notify-form.tsx` | Public pages | Reading template and landing | 3 |
| `promo-video.tsx` | Public pages | Reading template and landing | 3 |

### components/mentor

| File | Area | What happens to it | Phase |
|---|---|---|---|
| `ai-practice.tsx` | AI Mentor | Chat-first hub and chat | 3 |
| `mentor-extras.tsx` | AI Mentor | Chat-first hub and chat | 3 |
| `mentor-rich.tsx` | AI Mentor | Chat-first hub and chat | 3 |
| `use-mentor-chat.tsx` | AI Mentor | Chat-first hub and chat | 3 |

### components/planner

| File | Area | What happens to it | Phase |
|---|---|---|---|
| `availability-editor.tsx` | Planner | Calendar stage, tray panels | 5 |
| `missed-blocks-card.tsx` | Planner | Calendar stage, tray panels | 5 |
| `plan-insights.tsx` | Planner | Calendar stage, tray panels | 5 |
| `plan-manager.tsx` | Planner | Calendar stage, tray panels | 5 |
| `schedule-modal.tsx` | Planner | Calendar stage, tray panels | 5 |
| `spaced-revision-sync.tsx` | Planner | Calendar stage, tray panels | 5 |
| `telegram-actions-sync.tsx` | Planner | Calendar stage, tray panels | 5 |
| `today-blocks-card.tsx` | Planner | Calendar stage, tray panels | 5 |
| `weak-topics-sync.tsx` | Planner | Calendar stage, tray panels | 5 |

### components/preview

| File | Area | What happens to it | Phase |
|---|---|---|---|
| `plan-compare.tsx` | Preview | Look previews | 5 |
| `preview-frame.tsx` | Preview | Look previews | 5 |

### components/profile

| File | Area | What happens to it | Phase |
|---|---|---|---|
| `account-settings.tsx` | Profile | Form template sections | 5 |
| `avatar-picker.tsx` | Profile | Form template sections | 5 |
| `billing-history.tsx` | Profile | Form template sections | 5 |
| `data-storage-card.tsx` | Profile | Form template sections | 5 |
| `exam-branch-panel.tsx` | Profile | Form template sections | 5 |
| `goal-plan.tsx` | Profile | Form template sections | 5 |
| `profile-header.tsx` | Profile | Form template sections | 5 |
| `referral-card.tsx` | Profile | Form template sections | 5 |
| `sponsor-break-card.tsx` | Profile | Form template sections | 5 |
| `stats-achievements.tsx` | Profile | Form template sections | 5 |
| `telegram-card.tsx` | Profile | Form template sections | 5 |

### components/seo

| File | Area | What happens to it | Phase |
|---|---|---|---|
| `branch-cutoffs.tsx` | Public pages | Reading template | 5 |
| `branch-hub.tsx` | Public pages | Reading template | 5 |
| `branch-syllabus-page.tsx` | Public pages | Reading template | 5 |
| `charts.tsx` | Public pages | Reading template | 5 |
| `legal-nav.tsx` | Public pages | Reading template | 5 |
| `most-repeated-article.tsx` | Public pages | Reading template | 5 |
| `pyq-body.tsx` | Public pages | Reading template | 5 |
| `score-predictor.tsx` | Public pages | Reading template | 5 |
| `share-question.tsx` | Public pages | Reading template | 5 |
| `study-plan-tool.tsx` | Public pages | Reading template | 5 |
| `sub-nav.tsx` | Public pages | Reading template | 5 |
| `syllabus-navigator.tsx` | Public pages | Reading template | 5 |
| `tool-shell.tsx` | Public pages | Reading template | 5 |
| `tools-hub.tsx` | Public pages | Reading template | 5 |
| `topic-progress.tsx` | Public pages | Reading template | 5 |
| `where-to-start.tsx` | Public pages | Reading template | 5 |

### components/share

| File | Area | What happens to it | Phase |
|---|---|---|---|
| `share-result-button.tsx` | Share | Share card as Sheet | 5 |

### components/system

| File | Area | What happens to it | Phase |
|---|---|---|---|
| `auth-listener.tsx` | System | Listeners, banners and toasts restyled; no visual logic | 6 |
| `card-spotlight.tsx` | System | Listeners, banners and toasts restyled; no visual logic | 6 |
| `device-limit-dialog.tsx` | System | Listeners, banners and toasts restyled; no visual logic | 6 |
| `motion-prefs.tsx` | System | Listeners, banners and toasts restyled; no visual logic | 6 |
| `scrollbar-activity.tsx` | System | Listeners, banners and toasts restyled; no visual logic | 6 |
| `smooth-scroll.tsx` | System | Listeners, banners and toasts restyled; no visual logic | 6 |
| `version-watch.tsx` | System | Listeners, banners and toasts restyled; no visual logic | 6 |

### components/test-centre

| File | Area | What happens to it | Phase |
|---|---|---|---|
| `upcoming-mocks.tsx` | Test Centre | Command bar and door grid | 3 |

### components/(root)

| File | Area | What happens to it | Phase |
|---|---|---|---|
| `theme-provider.tsx` | Shell | Sets the default Look (Lunar) and the lite-effects switch (blur and aurora off on weak devices) | 1 |

### components/tutor

| File | Area | What happens to it | Phase |
|---|---|---|---|
| `tutor-home.tsx` | AI Tutor | Task template | 5 |

### components/ui

| File | Area | What happens to it | Phase |
|---|---|---|---|
| `button.tsx` | Primitives | Rebuilt on the new Button, Card, Field, Segmented, Dialog, Sheet | 1 |
| `card.tsx` | Primitives | Rebuilt on the new Button, Card, Field, Segmented, Dialog, Sheet | 1 |
| `code-block.tsx` | Primitives | Rebuilt on the new Button, Card, Field, Segmented, Dialog, Sheet | 1 |
| `combobox.tsx` | Primitives | Rebuilt on the new Button, Card, Field, Segmented, Dialog, Sheet | 1 |
| `confirm-dialog.tsx` | Primitives | Becomes the Dialog | 1 |
| `count-up.tsx` | Primitives | Replaced by the odometer; no counting on mount | 1 |
| `custom-dropdown.tsx` | Primitives | Rebuilt as the Select (bottom sheet on phone) | 1 |
| `date-picker.tsx` | Primitives | Rebuilt in the new field style | 1 |
| `folder-tabs.tsx` | Primitives | Rebuilt on the new Button, Card, Field, Segmented, Dialog, Sheet | 1 |
| `fullscreen-navigation.tsx` | Primitives | Rebuilt on the new Button, Card, Field, Segmented, Dialog, Sheet | 1 |
| `fullscreen-toggle.tsx` | Primitives | Rebuilt on the new Button, Card, Field, Segmented, Dialog, Sheet | 1 |
| `goal-tag-badge.tsx` | Primitives | Rebuilt on the new Button, Card, Field, Segmented, Dialog, Sheet | 1 |
| `interactive.tsx` | Primitives | Rebuilt on the new Button, Card, Field, Segmented, Dialog, Sheet | 1 |
| `number-stepper.tsx` | Primitives | Rebuilt on the new Button, Card, Field, Segmented, Dialog, Sheet | 1 |
| `personal-notes-drawer.tsx` | Primitives | Rebuilt on the new Button, Card, Field, Segmented, Dialog, Sheet | 1 |
| `price-roll.tsx` | Primitives | Replaced by the odometer for value CHANGES only | 1 |
| `report-issue-button.tsx` | Primitives | Opens a Sheet | 1 |
| `reveal.tsx` | Primitives | Rebuilt on the new Button, Card, Field, Segmented, Dialog, Sheet | 1 |
| `smart-truncate.tsx` | Primitives | Rebuilt on the new Button, Card, Field, Segmented, Dialog, Sheet | 1 |
| `time-picker.tsx` | Primitives | Rebuilt in the new field style | 1 |
| `toast-container.tsx` | Primitives | Rebuilt on the new Button, Card, Field, Segmented, Dialog, Sheet | 1 |
| `tooltip-layer.tsx` | Primitives | Rebuilt on the new Button, Card, Field, Segmented, Dialog, Sheet | 1 |
| `word-reveal.tsx` | Primitives | Headline reveal kept; transform and opacity only | 1 |
