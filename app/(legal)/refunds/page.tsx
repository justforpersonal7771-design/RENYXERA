import Link from "next/link";

export const metadata = {
  title: "Refund & Cancellation Policy — RENYXERA",
  description: "RENYXERA's refund and cancellation policy for paid plans.",
};

const A = "text-[var(--accent)] font-semibold";
const H = "text-lg font-bold text-[var(--text-primary)] mb-2";

export default function RefundPolicyPage() {
  return (
    <article>
      <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)] mb-1">Refund &amp; Cancellation Policy</h1>
      <p className="text-sm text-[var(--text-muted)] mb-8">Last updated: 26 September 2026</p>

      <div className="space-y-8 text-[var(--text-secondary)] leading-relaxed">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-secondary)]/60 p-4">
          <p>
            <strong className="text-[var(--text-primary)]">RENYXERA is currently free.</strong> We don&apos;t take any payments today, so there is
            nothing to refund. This policy sets out how refunds and cancellations will work once paid plans are
            introduced; we&apos;ll update the date above and tell existing users before anything changes.
          </p>
        </section>

        <section>
          <h2 className={H}>1. Paid plans</h2>
          <p>
            Paid plans (for example monthly, season or yearly access) will be sold in Indian Rupees through a licensed
            payment gateway. The price, what&apos;s included and the access period will be shown clearly before you pay.
          </p>
        </section>

        <section>
          <h2 className={H}>2. 7-day refund on your first purchase</h2>
          <p>
            If a paid plan isn&apos;t right for you, you can ask for a full refund within <strong className="text-[var(--text-primary)]">7 days</strong> of your
            first purchase of that plan. To keep this fair for everyone, it doesn&apos;t apply if more than 5 full mock tests
            have been attempted on the plan in that time, or where there are signs of account sharing or misuse.
          </p>
        </section>

        <section>
          <h2 className={H}>3. Cancelling a subscription</h2>
          <p>
            You can cancel a recurring plan at any time. Cancelling stops future renewals; you keep access until the end of
            the period you&apos;ve already paid for. Renewals that have already been charged aren&apos;t refunded, except where
            required by law or where the renewal was charged in error.
          </p>
        </section>

        <section>
          <h2 className={H}>4. Payment problems</h2>
          <p>
            If you were charged twice, charged but didn&apos;t receive access, or charged the wrong amount, contact us and we&apos;ll
            fix it or refund the difference in full.
          </p>
        </section>

        <section>
          <h2 className={H}>5. How to request a refund</h2>
          <p>
            Email <a href="mailto:renyxera@gmail.com" className={A}>renyxera@gmail.com</a> from the email address on your
            account, with the payment reference and the reason. Approved refunds are returned to the original payment
            method, usually within 5–7 working days of approval (the exact time depends on your bank).
          </p>
        </section>

        <section>
          <h2 className={H}>6. Related</h2>
          <p>
            <Link href="/terms" className={A}>Terms</Link> · <Link href="/privacy" className={A}>Privacy policy</Link> ·{" "}
            <Link href="/contact" className={A}>Contact</Link>
          </p>
        </section>
      </div>
    </article>
  );
}
