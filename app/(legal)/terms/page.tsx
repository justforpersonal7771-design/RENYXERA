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
      <p className="text-sm text-[var(--text-muted)] mb-8">Last updated: 30 September 2026</p>

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
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">6. Plans: Free, Plus and Pro</h2>
          <p>RENYXERA has three tiers. <strong className="text-[var(--text-primary)]">Free</strong> includes every official previous-year question, the exam simulator, All-India mocks, leaderboards, mistakes and revision tools, cloud sync, and a one-time trial of AI requests. <strong className="text-[var(--text-primary)]">Plus</strong> and <strong className="text-[var(--text-primary)]">Pro</strong> are paid plans that add a daily AI allowance, additional analytics and study tools, premium avatar styles and visual badges. The exact features, price and duration of each plan are shown on the Plans page and at checkout before you pay; that page is part of these Terms.</p>
          <p className="mt-2">Plans are bought for a fixed period (for example one month or one year) and <strong className="text-[var(--text-primary)]">do not renew automatically</strong>. Prices are in Indian Rupees and include applicable taxes unless stated otherwise. We may change prices for future purchases; a change never affects a plan you have already paid for.</p>
          <p className="mt-2"><strong className="text-[var(--text-primary)]">Upgrading from Plus to Pro:</strong> the unused part of a paid Plus plan is credited against the Pro price, calculated from the days remaining, and Pro then runs for its full period from the upgrade date. Plans granted free of charge (for example by promotion or referral) carry no credit.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">7. Payments and refunds</h2>
          <p>Payments are processed by Razorpay; we never see or store your card or UPI details. A plan is activated only after the payment provider confirms the payment. <strong className="text-[var(--text-primary)]">Purchases are final: we do not offer refunds</strong>, because access is delivered digitally and instantly. If you were charged but your plan did not activate, or you were charged twice, contact us and we will fix it or refund the duplicate charge. The Refund &amp; Cancellation Policy gives the details.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">8. AI requests, credits and fair use</h2>
          <p>AI requests are limited per account: a one-time trial on Free, and a daily allowance on Plus and Pro that resets at midnight India time. You may also earn <strong className="text-[var(--text-primary)]">bonus AI credits</strong> through referrals or by watching a short sponsor message ("sponsor break"). Bonus credits have no cash value, cannot be transferred or sold, expire on the date shown, and are used only after your daily allowance. We may adjust allowances, credit amounts and daily limits to keep the service sustainable, and we may withhold or remove credits obtained through automation, fake accounts or other abuse.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">9. Referrals</h2>
          <p>You may invite friends with your personal link. Rewards are given only when the invited person creates a genuine new account, confirms their email and actually uses RENYXERA as described on the Plans page. Rewards are capped per month and in total. Creating accounts for yourself, sharing a device between referrer and referred account, or any other attempt to game the programme makes the referral ineligible, and we may reverse rewards and suspend accounts involved. We can change or end the referral programme at any time; rewards already credited are kept unless obtained through abuse.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">10. Device limits on paid plans</h2>
          <p>A paid plan is for one person. It can be active on up to two devices at a time, and only a limited number of new devices can be added each month. On a third device you will be asked to sign one of the others out; you can always keep using the Free features there. Sharing a paid account with others is not allowed.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">11. Sponsored content</h2>
          <p>Some pages and sponsor breaks show sponsored messages or affiliate links, always clearly labelled. We earn from some of them. Sponsors do not influence our questions, answers, analytics or rankings, and there are never ads inside an exam.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">12. AI Mentor — accuracy disclaimer</h2>
          <p>The AI Mentor uses Google's Gemini models to generate explanations and hints. Like any AI system, it can occasionally be wrong. Use it as a study aid, not a substitute for verifying an answer against the official key or your own understanding. We continuously work to improve accuracy but don't guarantee it.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">13. Leaderboards and integrity</h2>
          <p>Graded attempts are monitored for integrity signals as described in our Privacy Policy. We reserve the right to exclude an attempt from leaderboards or rankings if it shows signs of not being a genuine, independent attempt, while still showing you your own personal results and analysis.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">14. Disclaimer of warranties</h2>
          <p>RENYXERA is provided "as is." We work hard to keep it accurate and available, but we don't guarantee it will be error-free, uninterrupted, or that it guarantees any particular exam outcome, rank, or score. Your GATE result depends on your own preparation and performance, not on any promise made by this platform.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">15. Limitation of liability</h2>
          <p>To the maximum extent permitted by law, RENYXERA and its operators are not liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability for any claim relating to RENYXERA is limited to the amount you paid us, if any, in the 12 months before the claim arose.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">16. Changes to these Terms</h2>
          <p>We may update these Terms as the platform evolves. We'll update the date above when we do, and make a reasonable effort to notify account holders of material changes.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">17. Governing law</h2>
          <p>These Terms are governed by the laws of India. Any dispute will be subject to the jurisdiction of the courts of India.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">18. Contact</h2>
          <p>
            Questions about these Terms:{" "}
            <a href="mailto:renyxera@gmail.com" className="text-[var(--accent)]">renyxera@gmail.com</a>
          </p>
        </section>
      </div>
    </article>
  );
}
