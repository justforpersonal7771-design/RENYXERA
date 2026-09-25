export const metadata = {
  title: "Privacy Policy — RENYXERA",
  description: "How RENYXERA collects, uses, and protects your data.",
};

/**
 * Written to reflect what the app actually does today (local-first IndexedDB, Gemini AI
 * calls, Supabase auth/Postgres now being added) plus what's planned and disclosed in
 * advance (ads, payments, the integrity signals in Module 5C) so this doesn't need a
 * rewrite the moment those ship. This is a solid, honest starting draft — good enough to
 * unblock Google OAuth verification and early operation — not a substitute for a lawyer's
 * review before Razorpay goes live for real money or before this scales meaningfully.
 */
export default function PrivacyPolicyPage() {
  return (
    <article>
      <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)] mb-1">
        Privacy Policy
      </h1>
      <p className="text-sm text-[var(--text-muted)] mb-8">Last updated: 25 September 2026</p>

      <div className="space-y-8 text-[var(--text-secondary)] leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">1. Who we are</h2>
          <p>
            RENYXERA ("RENYXERA," "we," "us") is a GATE CSE exam-preparation platform. This
            policy explains what information we collect when you use RENYXERA, why, and what
            control you have over it. Contact us at{" "}
            <a href="mailto:renyxera@gmail.com" className="text-[var(--accent)]">renyxera@gmail.com</a> with
            any question about this policy or your data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">2. What we collect</h2>
          <p><strong className="text-[var(--text-primary)]">If you use RENYXERA without an account</strong> ("guest mode"), your practice history, bookmarks, mistakes, and preferences are stored only in your browser (IndexedDB), on your device. We do not receive or see this data.</p>
          <p className="mt-2"><strong className="text-[var(--text-primary)]">If you create an account</strong>, we collect: the email address or Google account you sign up with; a display name and username you choose; an avatar — a short "seed" string used to generate an illustration, never an uploaded photo; your stated exam goals (target year, branch, rank); and your exam attempts, scores, bookmarks, and mistake history, so this can sync across your devices.</p>
          <p className="mt-2"><strong className="text-[var(--text-primary)]">If you sign in with Google</strong>, we receive your name, email address, and profile picture URL from Google, per Google's own sharing controls — we never receive your Google password.</p>
          <p className="mt-2"><strong className="text-[var(--text-primary)]">If you use the AI Mentor</strong>, the question you're viewing and relevant context about your learning progress (weak topics, recent mistakes) is sent to Google's Gemini API to generate a personalised explanation. We do not send your name or email as part of this.</p>
          <p className="mt-2">We also collect standard technical data automatically — IP address, browser type, and pages visited — for security (rate-limiting abuse) and to understand which parts of the product are used.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">3. How we handle Google user data</h2>
          <p>This section applies when you choose &quot;Continue with Google&quot; to sign in. It describes exactly what Google user data RENYXERA accesses and what we do with it.</p>
          <p className="mt-2"><strong className="text-[var(--text-primary)]">Data we access.</strong> RENYXERA requests only Google&apos;s basic sign-in scopes (<code>openid</code>, <code>email</code>, <code>profile</code>). Through these we receive your Google account&apos;s email address, your name, your profile picture URL, and a unique Google account identifier. We do not request, and cannot access, your Gmail, Google Drive, Calendar, Contacts, or any other Google service data.</p>
          <p className="mt-2"><strong className="text-[var(--text-primary)]">How we use it.</strong> We use this data only to create and sign you in to your RENYXERA account, to show your name and email on your own profile page, and to contact you about your account when necessary. We do not use Google user data for any other purpose.</p>
          <p className="mt-2"><strong className="text-[var(--text-primary)]">How we store and protect it.</strong> The data is stored in our authentication and database provider, Supabase, as part of your account record. It is transmitted only over encrypted connections (HTTPS/TLS), is encrypted at rest by our provider, and is protected by database-level access controls (Row Level Security) so that it can only be read by you and by the service itself. Access keys that can bypass those controls are kept server-side only and are never exposed to the browser.</p>
          <p className="mt-2"><strong className="text-[var(--text-primary)]">How we share it.</strong> We do not sell, rent, or trade Google user data. We do not share, transfer, or disclose it to any third party, except to Supabase, which processes it solely to provide authentication and database hosting to us, or where required by law. Google user data is never sent to our AI provider as part of AI Mentor requests.</p>
          <p className="mt-2"><strong className="text-[var(--text-primary)]">What we never do with it.</strong> We do not use Google user data for advertising (targeted, personalised, or otherwise), we do not sell it to data brokers or information resellers, we do not use it to determine credit-worthiness or for lending purposes, and we do not use it to develop, improve, or train generalised or non-personalised AI or machine-learning models. No person at RENYXERA reads your Google user data, except with your explicit consent, where necessary for security purposes (such as investigating abuse), or to comply with applicable law.</p>
          <p className="mt-2"><strong className="text-[var(--text-primary)]">Retention and deletion.</strong> We keep Google user data for as long as your account exists. You can ask us to delete it at any time by emailing <a href="mailto:renyxera@gmail.com" className="text-[var(--accent)]">renyxera@gmail.com</a>; we will delete your Google-derived account data (email, name, profile picture URL, and Google account identifier) within 30 days of your request. You can also revoke RENYXERA&apos;s access to your Google account at any time from your Google Account&apos;s &quot;Third-party apps &amp; services&quot; page (myaccount.google.com/connections), after which we receive no further data from Google.</p>
          <p className="mt-2"><strong className="text-[var(--text-primary)]">Limited Use.</strong> RENYXERA&apos;s use and transfer to any other app of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)]">Google API Services User Data Policy</a>, including the Limited Use requirements.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">4. Cookies and local storage</h2>
          <p>
            If you sign in, we set one essential cookie (managed by our authentication
            provider, Supabase) to keep you signed in between visits — this cookie
            contains no advertising or tracking identifiers, and we do not use any
            optional/analytics cookies today. Separately, and for every visitor whether
            signed in or not, your browser's own IndexedDB and localStorage are used to
            store your practice history, preferences, and (for a signed-out guest) all
            of your data, entirely on your device — see §2 above. You can clear this at
            any time through your browser's own site-data settings; doing so does not
            affect anything already synced to your account if you're signed in.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">5. Graded / competitive attempts</h2>
          <p>
            For graded mock tests and leaderboards, we record behavioural signals to protect the
            integrity of rankings other users rely on — for example whether the browser tab lost
            focus during the attempt, and whether answer timing is consistent with genuine
            attempts. This is disclosed before a graded attempt begins and is never used in
            practice mode. It is used only to exclude suspicious attempts from leaderboards, not
            for any other purpose, and you can always see your full personal result regardless.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">6. How we use your data</h2>
          <p>To provide the service (sync your progress, grade attempts, power the AI Mentor); to protect the platform (rate-limiting, fraud and abuse prevention); to improve RENYXERA (aggregate, non-identifying usage patterns); and, if you've opted in, to send you product updates or reminders. We do not sell your personal data to anyone.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">7. Advertising (planned, not yet live)</h2>
          <p>
            RENYXERA does not currently display advertising. When it does, ads will never appear
            during an active exam, and paid subscribers will never see ads. Where legally
            required — including for any user we know or believe to be under 18 — only
            non-personalised advertising will be shown. This section will be updated with
            specifics before advertising goes live.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">8. Payments (planned, not yet live)</h2>
          <p>
            When paid plans launch, payments will be processed by Razorpay. We do not, and will
            not, handle or store your card details ourselves — that happens entirely on
            Razorpay's own secure systems.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">9. Who we share data with</h2>
          <p>We share data only with the service providers that make RENYXERA work, each bound to use it only to provide their service to us: Supabase (database and authentication hosting), Google (Gemini AI, and Google Sign-In if you use it), and, once live, Razorpay (payments) and an advertising network (for non-personalised or, where permitted, personalised ads). We do not share your data with anyone else, and never sell it.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">10. Children and minors</h2>
          <p>Many GATE aspirants are 18 or older, but some are younger. We collect the minimum data necessary regardless of age, and — per §7 above — never show personalised advertising to a user we know to be under 18.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">11. Your rights and account deletion</h2>
          <p>
            You can export your data at any time from your profile. RENYXERA does not offer an
            in-app "delete my account" button, because your exam history is also what makes
            leaderboard rankings and platform integrity trustworthy for everyone. If you want
            your account closed, email{" "}
            <a href="mailto:renyxera@gmail.com" className="text-[var(--accent)]">renyxera@gmail.com</a> — we
            will anonymise your account (removing your name, email, and any other identifying
            information) while retaining anonymised attempt records, consistent with your rights
            under India's Digital Personal Data Protection Act. If you're in the European Economic
            Area or a jurisdiction that grants a stricter right to erasure, tell us and we'll
            accommodate a full deletion instead.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">12. Data security</h2>
          <p>We use industry-standard measures to protect your data — encrypted connections (HTTPS) everywhere, database-level access controls (Row Level Security) so your data is only ever readable by you, and secrets are never exposed to the browser. No system is perfectly secure, and we'll notify affected users if a breach affecting their data ever occurs.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">13. Changes to this policy</h2>
          <p>We'll update the date at the top of this page when this policy changes, and for material changes we'll make a reasonable effort to notify account holders directly.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">14. Contact</h2>
          <p>
            Questions, requests, or concerns about your data:{" "}
            <a href="mailto:renyxera@gmail.com" className="text-[var(--accent)]">renyxera@gmail.com</a>
          </p>
        </section>
      </div>
    </article>
  );
}
