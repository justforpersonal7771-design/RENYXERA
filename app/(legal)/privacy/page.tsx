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
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">3. Cookies and local storage</h2>
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
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">4. Graded / competitive attempts</h2>
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
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">5. How we use your data</h2>
          <p>To provide the service (sync your progress, grade attempts, power the AI Mentor); to protect the platform (rate-limiting, fraud and abuse prevention); to improve RENYXERA (aggregate, non-identifying usage patterns); and, if you've opted in, to send you product updates or reminders. We do not sell your personal data to anyone.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">6. Advertising (planned, not yet live)</h2>
          <p>
            RENYXERA does not currently display advertising. When it does, ads will never appear
            during an active exam, and paid subscribers will never see ads. Where legally
            required — including for any user we know or believe to be under 18 — only
            non-personalised advertising will be shown. This section will be updated with
            specifics before advertising goes live.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">7. Payments (planned, not yet live)</h2>
          <p>
            When paid plans launch, payments will be processed by Razorpay. We do not, and will
            not, handle or store your card details ourselves — that happens entirely on
            Razorpay's own secure systems.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">8. Who we share data with</h2>
          <p>We share data only with the service providers that make RENYXERA work, each bound to use it only to provide their service to us: Supabase (database and authentication hosting), Google (Gemini AI, and Google Sign-In if you use it), and, once live, Razorpay (payments) and an advertising network (for non-personalised or, where permitted, personalised ads). We do not share your data with anyone else, and never sell it.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">9. Children and minors</h2>
          <p>Many GATE aspirants are 18 or older, but some are younger. We collect the minimum data necessary regardless of age, and — per §6 above — never show personalised advertising to a user we know to be under 18.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">10. Your rights and account deletion</h2>
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
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">11. Data security</h2>
          <p>We use industry-standard measures to protect your data — encrypted connections (HTTPS) everywhere, database-level access controls (Row Level Security) so your data is only ever readable by you, and secrets are never exposed to the browser. No system is perfectly secure, and we'll notify affected users if a breach affecting their data ever occurs.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">12. Changes to this policy</h2>
          <p>We'll update the date at the top of this page when this policy changes, and for material changes we'll make a reasonable effort to notify account holders directly.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">13. Contact</h2>
          <p>
            Questions, requests, or concerns about your data:{" "}
            <a href="mailto:renyxera@gmail.com" className="text-[var(--accent)]">renyxera@gmail.com</a>
          </p>
        </section>
      </div>
    </article>
  );
}
