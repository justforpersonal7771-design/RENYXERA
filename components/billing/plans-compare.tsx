import { Check, Minus } from "lucide-react";
import { FORGE, FREE_AI_TEASER, PLUS_AI_DAILY, PLUS_PRACTICE_SETS_DAILY, PRO_AI_DAILY } from "@/lib/billing/plans";

type Cell = string | boolean;
const ROWS: { label: string; free: Cell; plus: Cell; pro: Cell }[] = [
  { label: "Official PYQs for your paper", free: true, plus: true, pro: true },
  { label: "Exam simulator, custom tests, mocks", free: true, plus: true, pro: true },
  { label: "Forge Mocks: results and ranks", free: true, plus: true, pro: true },
  { label: "Forge Mock solutions", free: false, plus: true, pro: true },
  { label: "Forge questions (original, GATE-level)", free: `${FORGE.free.teaser} to try`, plus: `${FORGE.plus.dailyLimit} a day`, pro: "Unlimited" },
  { label: "Forge X tier and mock archive", free: false, plus: false, pro: true },
  { label: "AI Mentor and Tutor requests a day", free: `${FREE_AI_TEASER} to try`, plus: String(PLUS_AI_DAILY), pro: String(PRO_AI_DAILY) },
  { label: "AI-made practice sets", free: false, plus: `${PLUS_PRACTICE_SETS_DAILY} a day`, pro: "No set limit" },
  { label: "Analytics", free: "Basic", plus: "Trends and insights", pro: "Deep analytics" },
  { label: "Study Planner automation", free: false, plus: true, pro: true },
  { label: "AI re-plan", free: false, plus: false, pro: true },
  { label: "Telegram reminders and alarms", free: "Daily question and timer", plus: "Reminders, 3 alarms", pro: "Smart, 10 alarms" },
  { label: "Offline downloads", free: false, plus: false, pro: true },
  { label: "Avatars and crown", free: "Free styles", plus: "Silver", pro: "Gold" },
];

const FAQ: { q: string; a: string }[] = [
  { q: "Does it renew automatically?", a: "No. Every plan is one payment for a fixed period. Nothing is charged again and there is nothing to cancel." },
  { q: "What is the GATE season pass?", a: "One payment that covers you from now until 31 March after your exam year's results. The longer runway makes it the lowest monthly cost." },
  { q: "Can I get a refund?", a: "Purchases are final because access is delivered instantly. We refund only our own errors: a double or wrong charge, a payment that did not activate, or a fault we cannot fix. Details are on the refund page." },
  { q: "I paid but my plan has not appeared.", a: "It usually appears within a minute. If it does not, do not pay again: email us with the payment reference and we will fix it." },
  { q: "Is it for one branch only?", a: "Yes. A plan is tied to your account's branch. If you use your one branch change, the plan moves with it." },
  { q: "Can I upgrade from Plus to Pro?", a: "Yes. The unused days of your Plus plan are credited against Pro." },
  { q: "Are study materials included?", a: "No. Study materials are a separate purchase (subject packs and bundles) and are not refundable once bought." },
];

const show = (v: Cell) => v === true ? <Check aria-label="Included" className="mx-auto h-4 w-4 text-emerald-500" /> : v === false ? <Minus aria-label="Not included" className="mx-auto h-4 w-4 text-[var(--text-muted)]" /> : <span>{v}</span>;

/** Plans page: side-by-side comparison and the questions people ask before paying (R13-A2). */
export function PlansCompare() {
  return (
    <section aria-labelledby="compare-h" className="space-y-6">
      <div>
        <h2 id="compare-h" className="text-xl font-extrabold text-[var(--text-primary)]">Compare plans</h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-xs font-black text-[var(--text-muted)]">
                <th scope="col" className="px-4 py-3">What you get</th>
                <th scope="col" className="px-3 py-3 text-center">Free</th>
                <th scope="col" className="px-3 py-3 text-center">Plus</th>
                <th scope="col" className="px-3 py-3 text-center">Pro</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.label} className="border-b border-[var(--border-subtle)] last:border-0">
                  <th scope="row" className="px-4 py-2.5 font-semibold text-[var(--text-primary)]">{r.label}</th>
                  <td className="px-3 py-2.5 text-center text-xs text-[var(--text-secondary)]">{show(r.free)}</td>
                  <td className="px-3 py-2.5 text-center text-xs text-[var(--text-secondary)]">{show(r.plus)}</td>
                  <td className="px-3 py-2.5 text-center text-xs text-[var(--text-secondary)]">{show(r.pro)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-extrabold text-[var(--text-primary)]">Questions before you pay</h2>
        <div className="mt-3 divide-y divide-[var(--border-subtle)] rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          {FAQ.map((f) => (
            <details key={f.q} className="group px-4 py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-bold text-[var(--text-primary)]">{f.q}<span aria-hidden className="text-[var(--text-muted)] transition-transform group-open:rotate-45">+</span></summary>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
