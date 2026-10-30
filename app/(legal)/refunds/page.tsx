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
      <p className="text-sm text-[var(--text-muted)] mb-8">Last updated: 31 October 2026</p>

      <div className="space-y-8 text-[var(--text-secondary)] leading-relaxed">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-secondary)]/60 p-4">
          <p>
            <strong className="text-[var(--text-primary)]">In short:</strong> everything we sell is a one-time purchase for a fixed period and is delivered
            digitally and instantly, so <strong className="text-[var(--text-primary)]">purchases are final</strong>. We refund only when something went wrong on
            our side: a billing error or a technical fault we cannot fix. Nothing renews automatically.
          </p>
        </section>

        <section>
          <h2 className={H}>1. What we sell</h2>
          <p>
            Paid plans (Plus and Pro, as a monthly, yearly or season pass) and, when they launch, Study materials (subject packs and bundles) are sold in
            Indian Rupees through a licensed payment gateway. The price, what&apos;s included and the access period are shown before you pay, and you accept
            these terms at checkout.
          </p>
        </section>

        <section>
          <h2 className={H}>2. When we refund</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>You were <strong className="text-[var(--text-primary)]">charged twice</strong>, or charged the wrong amount.</li>
            <li>You were charged but <strong className="text-[var(--text-primary)]">your plan or pack did not activate</strong>, and we could not fix it.</li>
            <li>A <strong className="text-[var(--text-primary)]">technical fault or an error in what you bought</strong> stopped you from using it, and we could not put it right within a reasonable time.</li>
          </ul>
          <p className="mt-2">We always try to fix the problem first. If we cannot, we refund the affected purchase.</p>
        </section>

        <section>
          <h2 className={H}>3. When we do not refund</h2>
          <p>
            Change of mind, finding a free alternative, not using the product, a changed exam date or result, a later price change or offer, or accounts that
            were shared or misused. Because the free parts of RENYXERA and the free previews let you try before you buy, we do not offer a trial refund.
          </p>
        </section>

        <section>
          <h2 className={H}>4. How to ask</h2>
          <p>
            Email <a href="mailto:renyxera@gmail.com" className={A}>renyxera@gmail.com</a> from the email address on your account. Include the payment
            reference (it is on your receipt), what happened, a screenshot if you have one, and <strong className="text-[var(--text-primary)]">the genuine reason</strong>{" "}
            for the request. We read every request, may ask for more detail, and reply with our decision. Approved refunds go back to the original payment
            method, usually within 5–7 working days (the exact time depends on your bank).
          </p>
        </section>

        <section>
          <h2 className={H}>5. Cancelling</h2>
          <p>
            Plans and packs are fixed-period and do not renew, so there is nothing to cancel. Access ends when the period you paid for ends.
          </p>
        </section>

        <section>
          <h2 className={H}>6. Your legal rights</h2>
          <p>Nothing in this policy limits any right you have under the law that applies to you.</p>
        </section>

        <section>
          <h2 className={H}>7. Related</h2>
          <p>
            <Link href="/terms" className={A}>Terms</Link> · <Link href="/privacy" className={A}>Privacy policy</Link> ·{" "}
            <Link href="/contact" className={A}>Contact</Link>
          </p>
        </section>
      </div>
    </article>
  );
}
