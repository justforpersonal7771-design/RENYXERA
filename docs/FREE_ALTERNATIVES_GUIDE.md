# RENYXERA — Free Alternatives Guide (reviewed 29 Sep 2026)

*Step-by-step guides for the free options that replace paid items. Each one is **legitimate
and parked in the checklist backlog**; nothing here is switched on until the founder decides.
When one is done, tell engineering the result (a tag, a domain, "SMTP done") and it gets wired
in.*

---

## 1. Amazon Associates India (affiliate links for textbooks)

**What it gives:** a tracking tag (like `renyxera-21`). Our house banners then recommend the
standard GATE textbook for the subject on the page, and Amazon pays a commission when someone
buys through the link. The site code is ready (`NEXT_PUBLIC_AMAZON_TAG`).

**The rules that matter**
- You need **3 qualifying sales within 180 days** of applying, or the application is closed.
  Your own purchases never count, and buying through your own links breaks the rules.
- If it closes, you can **reapply later**, but old links stop working. For us that's harmless:
  we'd remove the tag and the banners fall back to our own promotions automatically.
- Payouts go only to an **Indian bank account**, with your **PAN** for tax.

**Best time to apply:** once the PYQ pages bring steady visitors (roughly 300+ a day), so the
180-day window isn't wasted. Until then, keep it in the backlog.

**Your identity questions**
- **Email:** use the RENYXERA email. You create a *new* Amazon.in account with it (separate from
  your personal shopping account), so nothing mixes.
- **Phone:** the rarely used number is fine **if it stays active and in your hands**. Amazon
  sends one-time codes to it at sign-in and for recovery. If the SIM lapses or the number is
  recycled to someone else, you can lose the account. Recharge it regularly.
- **Individual, not business:** choose the individual option. It uses your personal PAN and bank
  account. No company, GST or business registration is needed to start.

**Steps**
1. Open an incognito/private window (so your personal Amazon session isn't used).
2. Go to **https://affiliate.amazon.in** → **Join now for free**.
3. Click **Create your Amazon account** → enter the RENYXERA email, the spare phone number and a
   new password → verify the one-time code sent to the phone.
4. **Account information:** payee name exactly as on your PAN; address; choose the individual option.
5. **Website list:** add `https://gate.renyxera.workers.dev/pyq` and
   `https://gate.renyxera.workers.dev`. Answer "Are your websites directed at children under 13?" → **No**.
6. **Profile:** preferred Store ID `renyxera` (Amazon adds `-21`); describe the site: "Free GATE
   exam preparation — past papers, practice tests and study tools for engineering students."
   Topics: Education, Books. Traffic sources: Search engines, Social. How you build links: "Text links".
7. Finish, then open **Account settings → Payment** later to add PAN and bank (needed before the first payout).
8. Copy your tracking ID (e.g. `renyxera-21`) and send it over — it is public, safe to share.

---

## 2. Free domain from eu.org

**Is it legit?** Yes. EU.org has offered **free domains since 1996** for individuals and
non-profits who can't afford registrar fees. It is on the **Public Suffix List**, so browsers and
services treat `renyxera.eu.org` like its own domain, not a sub-folder of someone else's.
**It looks old-fashioned because it is** — a plain page run by volunteers since the 90s.

**What's "off" about it (the honest trade-offs)**
- **Slow and unpredictable approval:** one volunteer reviews requests by hand. Users report
  anything from days to **several months**. There is **no support** (only a users' mailing list).
- **You never own `eu.org` itself** — your name is `something.eu.org`, free forever, but it can
  be removed if used for abuse, and it can't be transferred to a registrar.
- **AdSense is not guaranteed** on eu.org names; some get approved, some don't. Treat it as a
  free experiment, not the plan the business depends on. A paid `.in`/`.com` from income stays
  the reliable route.

**What you control:** everything about the site and its DNS (we point it at Cloudflare, free).
They only hold the name.

**Steps**
1. **Cloudflare first** (EU.org checks your nameservers before accepting): Cloudflare dashboard →
   **Add a domain** → type `renyxera.eu.org` → **Free** plan → Continue → note the two
   nameservers Cloudflare shows (e.g. `ada.ns.cloudflare.com`, `bob.ns.cloudflare.com`).
2. Go to **https://nic.eu.org/arf/** → **Create an account** (a "handle") → fill your name,
   address, email → confirm from the email they send → note your handle (e.g. `RX123-FREE`).
3. Log in → **New domain** → Domain: `renyxera.eu.org` → Name servers: the two Cloudflare ones
   (no IPs needed) → Submit.
4. It shows automatic checks; if they pass, the request waits in the queue. You'll get an email
   when it's accepted.
5. When accepted, tell engineering: we attach the domain to the Worker, redirect
   `gate.renyxera.workers.dev` → the new domain (so Google keeps the pages it already found),
   and resubmit the sitemap.

---

### Other free domain options (checked 29 Sep 2026)
| Option | Free for how long | Speed | Catches | Verdict |
|---|---|---|---|---|
| **eu.org** (e.g. `renyxera.eu.org`) | **Lifetime, no renewals** — running since 1996 | Slow (days to months, one volunteer) | No support; can be removed for abuse | **Best long-term free choice — apply now, it costs nothing** |
| **pp.ua** (e.g. `renyxera.pp.ua`, via nic.ua) | Free, but **renew every year** (free) in a short window | Instant | Ukrainian SMS verification; **owner contact details are public**; miss the 28-day grace and restoring costs ~996 UAH | Good stop-gap if eu.org is slow; set a yearly reminder |
| **DigitalPlat** (`.us.kg`, `.dpdns.org`, …) | Free while the operator keeps running | Fast | New free TLDs attract abuse, so spam filters and security tools may distrust them; depends on the operator's goodwill (Freenom precedent) | Only for experiments, not the product |
| **is-a.dev / js.org** | Free | Pull-request review | Developer-portfolio subdomains; not meant for a product | Not suitable |

None of these guarantees AdSense approval or great email reputation. The dependable route is a paid
`.in`/`.com` from the first income; the free domain is a bridge.

---

## 3. Brevo for emails (free, 300 per day)

**What it gives:** sign-up confirmations, password resets and waitlist mails sent reliably by
Supabase through Brevo, instead of Supabase's tiny built-in allowance.

**Limits and the catch:** free plan = 300 emails/day, no card. Without our own domain the
sender is one **verified email address** (the RENYXERA Gmail). That works, but some mailboxes
may put it in **spam** more often. With a domain later we add DNS records and deliverability
improves.

**Steps**
1. **https://www.brevo.com** → **Sign up free** with the RENYXERA email → confirm the email →
   complete the profile (individual, no company needed).
2. **Senders:** top-right menu → **Senders, Domains & Dedicated IPs** → **Senders** → **Add a
   sender** → name `RENYXERA`, email = the RENYXERA Gmail → confirm the code Brevo emails you.
3. **SMTP key:** top-right menu → **SMTP & API** → **SMTP** tab → **Generate a new SMTP key** →
   name it `supabase` → copy the key (shown once). Note the **Login** shown on that page and the
   server `smtp-relay.brevo.com`, port `587`.
4. **Supabase:** Dashboard → your project → **Authentication** → **Emails** (or **SMTP
   Settings**) → **Enable custom SMTP**:
   - Sender email: the RENYXERA Gmail · Sender name: `RENYXERA`
   - Host `smtp-relay.brevo.com` · Port `587`
   - Username: the Brevo **Login** · Password: the SMTP key → **Save**.
5. Send yourself a test: use "Forgot password" on the site with your own email. It should arrive
   from RENYXERA within a minute (check spam the first time and mark "Not spam").
6. Tell engineering it works — we can then turn **email confirmation back on** (backlog #5).
   **Never paste the SMTP key in chat**; it only goes into Supabase.

---

## 4. Other free alternatives (for later)

| Instead of | Free option | Notes |
|---|---|---|
| Phone OTP by SMS (paid) | One-time **code by email** (Supabase email OTP) | Free; engineering change only |
| Google Play (₹2,100) | **Microsoft Store** (free for individuals since 2025) via PWABuilder; Android users install our PWA from the browser | Needs ID verification with Microsoft |
| Cloudflare R2 for images | Keep images as Worker static assets, or GitHub + jsDelivr CDN | Free, no card |
| Hotlink protection | Worker checks `Referer` on `/images/*` (`run_worker_first`) | Free; with multi-branch images |
| EthicalAds | Apply at ~50k page views/month | Already wired; one setting |
| Google AdSense | Needs an owned domain (eu.org may or may not be accepted) | Main earner later |

---

## 5. What an own domain (e.g. `renyxera.eu.org`) unlocks — and the switch-over checklist

Because we'd control the domain's DNS (in Cloudflare), Google and others can verify ownership —
which is impossible on `gate.renyxera.workers.dev`.

**Unlocks**
| Blocked today | With the domain |
|---|---|
| Google sign-in shows the Supabase address; OAuth branding can't be verified | Verify the domain in **Search Console (Domain property, DNS TXT record)** → add it as an **Authorised domain** on the OAuth consent screen with homepage + privacy links → submit branding verification → the Google sign-in screen shows **RENYXERA** and the logo |
| Emails may land in spam | Authenticate the domain in **Brevo** (SPF, DKIM, DMARC records in Cloudflare) → mails from `noreply@renyxera.eu.org` |
| AdSense impossible | `ads.txt` at the domain root → AdSense application (acceptance of eu.org names not guaranteed) |
| Search Console only as a URL-prefix property | A full Domain property covering every subdomain |

**Switch-over day checklist (engineering + you, in this order)**
1. Cloudflare: add a **Custom Domain** to the Worker (`renyxera.eu.org` and `www`); wait for the certificate.
2. Redirect `gate.renyxera.workers.dev/*` → `https://renyxera.eu.org/*` with **301** (keeps Google's indexed pages and their ranking).
3. App config: `NEXT_PUBLIC_SITE_URL` (canonicals, sitemap, share cards) → redeploy.
4. **Supabase → Authentication → URL Configuration:** Site URL = new domain; add `https://renyxera.eu.org/**` to Redirect URLs (keep the old one for a month).
5. **Google Cloud → OAuth client:** add the new domain to Authorised JavaScript origins; the Supabase callback URL stays the same.
6. **Turnstile:** add the new hostname to the widget's allowed hostnames.
7. **Cloudflare Web Analytics / Sentry:** add the hostname (Sentry needs nothing if the DSN is unchanged).
8. **Search Console:** add the Domain property (DNS TXT), submit the new sitemap, then use **Change of Address** from the old property.
9. **Brevo:** authenticate the domain and switch the Supabase sender to `noreply@renyxera.eu.org`.
10. **Amazon Associates / EthicalAds:** update the website URL in their dashboards.
