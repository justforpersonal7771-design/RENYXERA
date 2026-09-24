export const metadata = {
  title: "Terms of Service — RENYXERA",
  description: "The terms governing your use of RENYXERA.",
};

/**
 * Same status as privacy/page.tsx: a solid, honest starting draft covering what the
 * product does today plus what's disclosed in advance (ads, subscriptions, the
 * no-refund policy from the master plan §7B) so it doesn't need rewriting the moment
 * those ship. Get a lawyer's review before Razorpay goes live for real transactions.
 */
export default function TermsOfServicePage() {
  return (
    <article>
      <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)] mb-1">
        Terms of Service
      </h1>
      <p className="text-sm text-[var(--text-muted)] mb-8">Last updated: 24 September 2026</p>

      <div className="space-y-8 text-[var(--text-secondary)] leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">1. Acceptance</h2>
          <p>By creating an account or using RENYXERA, you agree to these Terms. If you don't agree, please don't use the service. If you're under 18, a parent or guardian should review these Terms with you.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">2. What RENYXERA is</h2>
          <p>RENYXERA is a GATE Computer Science & Information Technology exam-preparation platform: practice questions, mock exams, analytics, and an AI-assisted mentor. <strong className="text-[var(--text-primary)]">RENYXERA is an independent, privately-run platform and is not affiliated with, endorsed by, or connected to IIT, IISc, the GATE organising committee, or any GATE-conducting institute.</strong> "GATE" refers to the publicly-known examination; we do not claim any rights over that name.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">3. Your account</h2>
          <p>You're responsible for the accuracy of the information you provide and for keeping your login credentials confidential. Free accounts are, as the name says, free — creating one doesn't obligate you to pay for anything. One account is for one person; see §7 on device limits for paid plans.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">4. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Scrape, bulk-download, redistribute, or resell RENYXERA's question bank, solutions, or other content;</li>
            <li>Attempt to bypass rate limits, access controls, or Row Level Security on our systems;</li>
            <li>Use RENYXERA to cheat on, or assist others in cheating on, the actual GATE examination or any graded/competitive RENYXERA assessment;</li>
            <li>Reverse-engineer, decompile, or attempt to extract our AI Mentor's prompts or underlying system logic;</li>
            <li>Impersonate another person, or create accounts through automated or fraudulent means;</li>
            <li>Use the platform in any way that's unlawful, harmful, or infringes another person's rights.</li>
          </ul>
          <p className="mt-2">We may suspend or terminate accounts that violate these terms. We'll always try to warn and give a path to appeal first, except in cases of clear abuse (e.g. scripted scraping, payment fraud) where immediate action may be necessary to protect the platform and other users.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">5. Intellectual property</h2>
          <p>The RENYXERA name, logo, and platform (excluding the underlying, publicly-known GATE syllabus and the specific PYQ text itself, which we compile and present but did not originally author) are our property or that of our licensors. Content you submit — notes, bookmarks, forum posts once available — remains yours; by posting it, you grant us a license to store, display, and process it in order to operate the service (e.g. showing your own notes back to you, or surfacing a public forum answer to other users).</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">6. Paid plans (when live)</h2>
          <p>When paid plans launch, pricing and what's included will be shown clearly before you pay. <strong className="text-[var(--text-primary)]">Purchases are final: we do not offer refunds.</strong> This reflects that exam content, answer keys, and analysis are delivered digitally and instantly upon purchase. For any recurring subscription, cancelling stops future renewals only — it does not refund the current paid period, and access continues until that period ends. You can always revoke a UPI AutoPay mandate directly with your bank, independent of anything in this app. A dedicated Refund & Cancellation Policy, linked at checkout, will confirm the specifics before any payment feature goes live.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">7. Device limits on paid plans</h2>
          <p>To keep paid plans fairly priced, an active paid subscription is limited to use on up to two devices at a time. We'll always show a clear message and a way to sign out another device rather than silently blocking you.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">8. AI Mentor — accuracy disclaimer</h2>
          <p>The AI Mentor uses Google's Gemini models to generate explanations and hints. Like any AI system, it can occasionally be wrong. Use it as a study aid, not a substitute for verifying an answer against the official key or your own understanding. We continuously work to improve accuracy but don't guarantee it.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">9. Leaderboards and integrity</h2>
          <p>Graded attempts are monitored for integrity signals as described in our Privacy Policy. We reserve the right to exclude an attempt from leaderboards or rankings if it shows signs of not being a genuine, independent attempt, while still showing you your own personal results and analysis.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">10. Disclaimer of warranties</h2>
          <p>RENYXERA is provided "as is." We work hard to keep it accurate and available, but we don't guarantee it will be error-free, uninterrupted, or that it guarantees any particular exam outcome, rank, or score. Your GATE result depends on your own preparation and performance, not on any promise made by this platform.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">11. Limitation of liability</h2>
          <p>To the maximum extent permitted by law, RENYXERA and its operators are not liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability for any claim relating to RENYXERA is limited to the amount you paid us, if any, in the 12 months before the claim arose.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">12. Changes to these Terms</h2>
          <p>We may update these Terms as the platform evolves. We'll update the date above when we do, and make a reasonable effort to notify account holders of material changes.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">13. Governing law</h2>
          <p>These Terms are governed by the laws of India. Any dispute will be subject to the jurisdiction of the courts of India.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">14. Contact</h2>
          <p>
            Questions about these Terms:{" "}
            <a href="mailto:renyxera@gmail.com" className="text-[var(--accent)]">renyxera@gmail.com</a>
          </p>
        </section>
      </div>
    </article>
  );
}
