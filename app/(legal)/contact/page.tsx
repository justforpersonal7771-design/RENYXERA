import Link from "next/link";

export const metadata = {
  title: "Contact — RENYXERA",
  description: "How to reach RENYXERA for support, feedback, data requests and content corrections.",
};

const A = "text-[var(--accent)] font-semibold";

export default function ContactPage() {
  return (
    <article>
      <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)] mb-1">Contact us</h1>
      <p className="text-sm text-[var(--text-muted)] mb-8">Last updated: 26 September 2026</p>

      <div className="space-y-8 text-[var(--text-secondary)] leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">Email</h2>
          <p>
            The fastest way to reach us is{" "}
            <a href="mailto:renyxera@gmail.com" className={A}>renyxera@gmail.com</a>. We usually reply within
            two working days (often sooner). RENYXERA is run by an independent developer in India.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">What to write to us about</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong className="text-[var(--text-primary)]">A wrong answer or typo in a question</strong> — include the paper and question number (for example, &ldquo;GATE CS 2024 FN, Q23&rdquo;). We aim to fix accepted reports within 24 hours.</li>
            <li><strong className="text-[var(--text-primary)]">Account or sign-in problems</strong> — tell us the email you signed up with. Never send us your password.</li>
            <li><strong className="text-[var(--text-primary)]">Your data</strong> — you can download everything yourself from <Link href="/profile#security" className={A}>Profile → Account &amp; security → Export my data</Link>. To have your account and data deleted, email us from the address on the account.</li>
            <li><strong className="text-[var(--text-primary)]">Payments and refunds</strong> — see our <Link href="/refunds" className={A}>Refund policy</Link>. RENYXERA doesn&apos;t take any payments yet.</li>
            <li><strong className="text-[var(--text-primary)]">Feedback, ideas or partnerships</strong> — always welcome.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">Security issues</h2>
          <p>
            If you believe you&apos;ve found a security problem, please email us with &ldquo;Security&rdquo; in the subject
            and give us a reasonable time to fix it before sharing it publicly. Please don&apos;t access other
            people&apos;s data while testing.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">Related</h2>
          <p>
            <Link href="/privacy" className={A}>Privacy policy</Link> · <Link href="/terms" className={A}>Terms</Link> ·{" "}
            <Link href="/disclaimer" className={A}>Disclaimer</Link> · <Link href="/cookies" className={A}>Cookie policy</Link>
          </p>
        </section>
      </div>
    </article>
  );
}
