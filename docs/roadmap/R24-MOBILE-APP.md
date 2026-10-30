# Release 24 — RENYXERA on phones (the mobile app plan)

*Plan, 31 Oct 2026. Owner: "most of the users use the mobile". The rule that shapes everything: **zero budget until revenue** (`project_zero_budget_constraint`), one codebase, and the web app is the product. So the mobile app is the same app, installed on the phone's home screen, and then, as money allows, wrapped for the stores. Windows is a separate release (`R17-MICROSOFT-STORE.md`). Claims marked "verify" depend on store rules that change; check them on the day.*

## 1. Where we are today

- A responsive web app with a bottom tab bar (Home, Test Centre, Review, AI Mentor, More), tested on a phone viewport in light and dark in every release.
- A service worker, an offline shell and warm-up, and installable as a PWA. **Fixed on 31 Oct:** the manifest said "GATE CSE" (we serve six branches), had one icon for both normal and "maskable" use (which crops the logo on many phones), no screenshots, no shortcuts. It now has a proper name and description, separate maskable icons, 5 install-dialog screenshots, 5 shortcuts (Build a test, Mocks, Practice, AI Mentor, Planner), `orientation: any`, `categories`, and `launch_handler`.
- Telegram is our free push channel (daily question, reminders, mock alerts).
- Not done: an install prompt in the app, iOS install guidance, web push, a phone-specific audit of every screen, store listings.

## 2. What the options cost and what they give

| Route | Cost | Phone users get | Verdict |
|---|---|---|---|
| **A. Installable web app (PWA)** | ₹0 | Home-screen icon, full-screen window, offline, shortcuts on long-press (Android), same updates as the site | **Do now. This is the mobile app.** |
| **B. Android app in Google Play** (a Trusted Web Activity: our site in a thin shell) | Google's one-time registration fee, about ₹2,100 (verify); new personal accounts must also run a closed test with a minimum number of testers for a set number of days before production (verify) | A Play Store listing, installs by search, "real app" trust | **When revenue covers it, or earlier if the owner chooses to pay.** Needs a signed app bundle and `/.well-known/assetlinks.json`. |
| **C. iPhone** | App Store needs Apple's yearly fee (about $99) and a Mac or a paid cloud Mac, and Apple rejects thin web wrappers (guideline 4.2) | On iPhone the app **is** the PWA: Safari, Share, Add to Home Screen | **PWA only.** Make the iPhone steps painless; revisit with a native feature set and revenue. |
| **D. Native wrapper (Capacitor)** | Free tools; Android Studio free; iOS builds need Mac time | Camera for "photo doubts", native push, share extension, widgets | **Later**, when a feature needs it (photo doubts, widgets). |
| **E. Other Android stores** (Samsung Galaxy Store etc.) | Free listings (verify per store) | Extra reach on Samsung phones | Optional after B. |

Decision for now: **A fully, then B when affordable, C stays PWA, D only when a feature needs it.**

## 3. Phase 0: make the installable app excellent (now to two weeks, ₹0)

1. **Manifest and icons** — done 31 Oct (see §1). Still to check on a real Android phone: the install dialog shows the new screenshots and name; long-press the icon shows the five shortcuts; the maskable icon is not clipped.
2. **Install prompt, at the right moments (Android Chrome):** capture the browser's install event; show an "Install app" item in the account menu always, and a small card after the **second visit** or after the **first finished test** (never on the first screen, never during a test, once per 14 days if dismissed). Track `install_shown`, `install_accepted`, `appinstalled` in `/api/events`.
3. **iPhone guidance:** iOS has no install prompt. Show a short, dismissible "Add to Home Screen" card (Share, then Add to Home Screen) to iPhone Safari users who are not already in the installed app, after the second visit. Detect with the standalone display-mode check.
4. **Offline that works in the exam:** verify a started test survives airplane mode and resumes; downloads (paid) read offline; a clear "you are offline" banner (exists) on every screen.
5. **Notifications:** keep Telegram as the primary channel. Add **web push** (free, VAPID keys, our own service worker) for Android Chrome and for the installed iPhone app (iOS 16.4 or newer): daily question, revision due, mock starts. Ask permission after the student finishes a test, never at first load.
6. **Safe-area and keyboard polish:** notch and gesture-bar insets on the tab bar and exam footer; the on-screen keyboard must not cover the NAT answer box or the Submit button; no horizontal page scroll.
7. **Deep links:** Telegram, Instagram and share links open the installed app on Android, not a browser tab (scope and `launch_handler` are set; verify on a phone).

## 4. Phase 1: phones first, screen by screen (two to six weeks)

- Run the single-screen audit on a **390 x 844 phone** exactly as on desktop (`scripts/zz-fit.mjs`, add a phone size), and fix the screens that scroll the page for no good reason. Long-reading screens (Mentor chat, lessons, Plans) keep an inner scroll area with a fixed header.
- **Touch:** 44 px minimum targets, 8 px spacing, no hover-only actions, thumb-reachable primary buttons (the bottom 40% of the screen).
- **Performance on a ₹15,000 phone on 4G:** the R15 plan (WebP images, per-paper data files, font trimming, LazyMotion); budgets: Largest Contentful Paint under 2.5 s, Interaction to Next Paint under 200 ms on the exam screen, first-practice-visit data under 150 KB. Add real-user vitals to `/api/events` (R15-F2).
- **Maths on small screens:** wide formulas scroll inside their own box, never the page; font sizes stay readable.
- **Data saver:** a setting that skips animations, decorative images and the heavy ring effects (also helps battery).
- **Storage safety on iPhone:** Safari clears site data after about 7 days without a visit for sites not installed to the home screen (verify). For signed-out students the local test history can vanish. Mitigation: nudge sign-in after the first finished test (cloud sync already exists) and the "Add to Home Screen" card, which exempts the app.

## 5. Phase 2: Google Play (when you decide to pay the fee)

Owner steps (click by click when we start): create the Play Console developer account with the renyxera Google account and pay the registration fee; complete identity verification; create the app listing. Me: generate the Android package from the live site with Bubblewrap or PWABuilder (the same tools as the Windows package), sign it, publish `assetlinks.json` (the signing certificate fingerprint), prepare the listing (name, short and full description, 8 screenshots from the manifest set, feature graphic, privacy policy URL, data-safety form), run the closed test, then publish. Because the shell loads our site, **every web release reaches the Play app automatically**; only the shell is versioned. Cost after the fee: ₹0.

Store rules to respect: payments for digital study packs inside a Play-distributed app may fall under Google's billing policy; our checkout stays on the website (Razorpay) and the app should not push purchases inside the shell until we have read the current policy for education content (verify before listing).

## 6. Phase 3: native features (only when one is worth it)

- **Photo doubts:** photograph a question and ask the Mentor (camera and image upload; works in the browser today through the file picker, so a wrapper is optional).
- **Home-screen widgets** (today's question, days to GATE) and **notification actions** (mark revision done): need a native wrapper.
- **Share extension:** send a question from another app into the Mentor.
Wrapper: Capacitor around the same web build.

## 7. How we will know it works

| Measure | Where | Target |
|---|---|---|
| Share of sessions on phones | Cloudflare analytics and events | track (expect over 70 %) |
| Install rate (accepted installs / prompts shown) | `/api/events` | 10 % or better |
| Day-7 return of installed vs browser users | events | installed higher; if not, fix the app |
| INP and LCP on mid-range Android | check:cwv and real-user vitals | under 200 ms and 2.5 s |
| Crash and error rate on phones | Sentry | no new error class unfixed for 7 days |
| Store rating (after Play) | Play Console | 4.3 or better |

## 8. Test matrix (every release, per `feedback_test_matrix`)

Android Chrome on a mid-range phone, Samsung Internet, iPhone Safari (current and previous iOS), and the **installed** app on Android and iPhone; each in light and dark; online and offline; portrait, plus rotation on the exam screen. Real-phone checks the owner does: sign-in with Google, a small payment, the install flow, a push notification, a test started offline.

## 9. Decisions and owner steps

1. **Pay for Google Play now or wait for revenue?** (recommended: wait; the PWA covers Android users in the meantime)
2. **Web push yes or no?** (recommended: yes after finishing a test, with Telegram staying primary)
3. **Phase 0 on a real Android phone:** after the next deploy, open the site in Chrome on your phone, tap the three dots, then Install app (or Add to Home Screen), long-press the icon to see the shortcuts, and send me a screenshot of the install dialog and the home screen.
4. **iPhone:** in Safari tap Share, then Add to Home Screen; open it; tell me if the name, icon and full-screen look right.

Order of work: Phase 0 items 2, 3, 4 and 6 first (the install prompt, the iPhone card, offline and keyboard checks), then web push, then the Phase 1 phone audit, then Play when funded.
