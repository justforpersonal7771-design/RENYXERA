# 07 · Protection and security

The brief: study materials only inside the website, "very secured and protected", and if someone tries to obtain them they "should see blank pages".

## 0. The honest boundary (read this first)

A website cannot make content impossible to capture. Anything a student can read on their screen can be photographed with another phone, screen-recorded by the operating system, or typed out by hand. No technology on the web prevents that, and anyone who promises it is wrong. What we **can** do, and will do:

1. Make **bulk and automated copying** (scrapers, "Save page as", view-source, copy-paste, print-to-PDF, browser extensions, downloaded files, API calls) **return nothing useful, or blank pages**.
2. Make **casual capturing** (screenshots on the same device, screen shares) **unattractive and traceable**, with a visible and an invisible per-account watermark.
3. Make **large-scale leaking** slow, detectable and attributable to an account, so that we can cut it off and act on it.
4. Back it with **terms of service and a takedown process**.

That combination is what real content businesses (publishers, exam platforms) rely on. We state the limit in the Terms and never promise "impossible".

## 1. Threat model

| Attacker | Goal | Capability | Our main defences |
|---|---|---|---|
| Casual student | Copy a paragraph or screenshot a page to share | Browser only | Selection, copy, context menu, drag, print blocked; text not in DOM; watermark; blur-on-blur |
| Scraper / bot | Dump every chapter | Scripts, headless browsers | Auth, entitlement, encrypted bundles, per-day topic caps, behavioural detection, Turnstile, device limits |
| Paying account sharing | Many people on one account | Credentials | Two-device limit (7D), concurrent-session detection, per-day caps, watermark tied to the account |
| Determined leaker | Re-publish the course | Screen recorder, camera, manual retyping | Watermark (visible + invisible), per-account fingerprint, rate caps that make full capture slow, legal action |
| Insider / compromised build | Leak source | Repo or deploy access | Private repo, encrypted-at-rest bundles, secrets never in repo, access logs |
| Search engines / AI crawlers | Index or train on content | Crawl | Protected content never served as readable text; `robots`/`X-Robots-Tag`/`noai`; only the free preview is public |

## 2. The layered design

### Layer A · Nothing readable ever travels or sits in the page
- Published chapters are **encrypted bundles** (AES-256-GCM). The server stores and serves only ciphertext. A scraper, `curl`, "view source", or the browser's Network tab gets opaque bytes.
- The key is released per chapter, per session, over an authenticated, entitlement-checked call; it is imported as a **non-extractable** CryptoKey (the pattern already in `lib/vault/vault.ts`). Keys rotate with every content version.
- Decryption happens **in memory only**. There is no `.html`, `.pdf`, `.docx` or image file to download; images do not exist at all (everything is vector data).
- Responses carry `Cache-Control: no-store`; the service worker never caches protected bundles unencrypted; offline reading reuses the encrypted per-account vault (14-day key renewal), wiped on sign-out.

### Layer B · The page has no text to copy
- Protected text is drawn as **SVG glyph paths** (font outlines converted at build time into path data inside the bundle) or onto a **canvas**; the DOM contains **no readable text nodes** for protected lessons. Copy, find-in-page, text selection, "Select all", reader mode, translate and accessibility scrapers therefore find nothing.
- Equations are already SVG paths (MathJax SVG). Code is drawn the same way (glyph paths), tables as positioned paths with a hidden structural skeleton that contains no words.
- Screen-reader support is the real tension here (see §6): an opt-in **assistive mode** exists, gated, rate-limited and watermarked, because excluding disabled students is not acceptable.

### Layer C · Capture-hostile behaviour (the "blank page" layer)
The viewer blanks the lesson (a plain blank page with a "paused" notice) when any of these happen:
- the tab or window **loses focus** or becomes hidden (`visibilitychange`, `blur`), the common case when someone switches to a capture tool;
- **print** is invoked (print stylesheet shows a blank page and a message);
- **devtools heuristics** fire (window size delta, debugger timing). This is a deterrent only, not a guarantee, and is tuned to avoid false positives;
- the **Screen Capture / Picture-in-Picture / presentation** APIs are active on this page (detectable only for captures started *from this page*);
- the **PrintScreen key** is pressed (we clear the clipboard and blank the page; this does not stop OS tools but stops the simplest path);
- **multiple sessions** are reading the same chapter at once (concurrent-session rule).
Also disabled: context menu, drag, text selection, long-press save, `Ctrl+S/P/U/C`, saving media.

### Layer D · Watermarking and traceability
- **Visible:** tiled, semi-transparent watermark with the account's email and ID, rotated, at a density that makes cropping it out destroy the page. Slow, subtle motion so a single screenshot cannot be cleaned by simple masking.
- **Invisible (forensic):** per-account micro-variations baked into the rendered geometry (glyph spacing and path jitter patterns, a hidden low-contrast pattern in diagrams) that encode the account ID and the read timestamp. A leaked screenshot or recording can be decoded back to the account even if the visible mark is cropped.
- **Server-side reading log:** which account opened which topic when (privacy-safe, retention-limited), so a leak can be matched to opening patterns.

### Layer E · Rate limits and behaviour analytics (stops bulk capture)
- Per-account **daily topic cap** (for example 60 topics per day; more than a human can read) and a **minimum dwell time** per block before the next bundle is released (anyone paging through at machine speed gets nothing).
- **Sequential-sweep detection:** opening topics in order faster than reading speed, or all chapters of a subject in a short window, flags the account (soft limit first, then lock and review).
- **Per-device and per-network limits** (reusing device sessions from 7D), Turnstile on the key endpoint, headless-browser heuristics.
- All thresholds are configuration, not code, so we can tune them from real data.

### Layer F · Account integrity
- Entitlements checked server-side on every key release (the same fail-closed pattern as `getEntitlement()`); the client never decides access.
- Two-device limit, concurrent-session detection and device-change cooldown (already built in 7D) apply fully.
- Refunds or chargebacks revoke access and keys immediately.

### Layer G · Legal and operational
- **Terms of Service** clauses: personal use only, no scraping, no redistribution, no recording; explicit that watermarks identify the account; breach ends access without refund.
- **Takedown playbook:** monitor Telegram/Reddit/YouTube/WhatsApp-sharing sites for our phrases and our fingerprints (we plant unique, harmless "canary" phrases and example numbers per version); send DMCA/IT Act notices; revoke the offending account.
- **Canary content:** a few deliberately unique wordings/examples per release so a leaked copy is provably ours.
- Registered copyright notice in the footer of every protected page.

## 3. What each attack sees

| Attempt | What happens |
|---|---|
| Right-click, Ctrl+C, select, drag | Nothing selectable; no text nodes |
| View-source, Network tab, `curl`, `wget`, "Save as" | Ciphertext or the app shell; no lesson text |
| Print / "Save as PDF" | Blank page with a notice |
| Reader mode, translate, text-to-speech, extensions that read the DOM | Empty |
| Search engines and AI crawlers | Only the free preview topics are readable; everything else is opaque |
| Headless script with a valid cookie | Fails Turnstile, is rate-capped, receives watermarked, minimum-dwell-paced content, gets flagged |
| Switching to another window to screenshot | The lesson blanks on focus loss |
| OS screenshot or screen recording by the device itself | May succeed, but carries the visible and invisible watermark and is bounded by the daily cap |
| Photographing the screen | Cannot be prevented; carries the watermark; slow and low quality at scale |

## 4. What this costs us (engineering effort, free-tier friendly)

All on the existing free stack: Cloudflare Workers (key endpoint, rate limits), Supabase (entitlements, reading log, RLS), the browser's Web Crypto (already used in the vault). No paid DRM service. The pieces map onto what exists:
- vault and non-extractable key: `lib/vault/vault.ts`, `/api/vault/key` (reuse and extend per chapter);
- watermark and blur shield and print blocking: `app/(dashboard)/downloads/view/page.tsx` (extend to the reader);
- device limits and cooldown: migrations for 7D;
- Turnstile verification: existing helper.

## 5. Native app option (later, only if leaks are a real problem)

A wrapper app (Capacitor/TWA with a native shell) can set Android's `FLAG_SECURE`, which makes screenshots and screen recordings of the app **black** at the operating-system level, and iOS can detect and blank screen capture. That is the only route to genuinely blank screenshots. It adds app-store cost and maintenance (the Play Store listing is already a parked item). It is a deliberate Phase 4 option, not v1.

## 6. Accessibility versus protection (decision needed)

Removing text from the DOM blocks assistive technology. Options:
1. **Assistive mode (recommended):** a setting that, after an extra confirmation and only for accounts with it enabled, exposes an accessible text layer for that session, with a stronger watermark and lower daily cap. Misuse is bounded by the same rate limits and the audit log.
2. No assistive mode (not acceptable for inclusion and potentially legally risky).
We recommend option 1 and will say so in the Terms and the help page.

## 7. Verification (how we will prove it works before launch)

An automated **red-team suite** in CI and before every content release:
- scripted scrapers with a valid account try to dump N chapters (must be rate-capped and flagged);
- `curl` on every study URL (must return ciphertext/shell only);
- headless Chromium "Save as PDF" and print (must be blank);
- DOM inspection: assert **zero protected words** exist in the DOM for a protected lesson (search for a known canary phrase);
- clipboard test, selection test, context menu test (must be inert);
- focus-loss test (must blank);
- watermark decode test: take a screenshot and recover the account ID with the decoder;
- Playwright matrix in desktop and mobile, light and dark (the standing rule).
A failure of any of these blocks a release.

## 8. Operational runbook (outline)

- Monitoring dashboard: reads per account per day, flags, key requests, failures (feeds the future admin console).
- Incident steps: confirm the leak (decode watermark) → revoke account and keys → rotate the chapter key → publish a new version with new canaries → notify (if needed) → takedown.
- Quarterly red-team repeat, plus after any renderer change.
