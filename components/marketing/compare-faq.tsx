"use client";

/** Honest comparison with the usual alternatives + FAQ (R18 F2/F3). Shown to signed-out visitors. */
import { useState } from "react";
import { Check, ChevronDown, Minus, X } from "lucide-react";
import { BANK_SUMMARY } from "@/lib/branches";

const TOTAL = Object.values(BANK_SUMMARY).reduce((n, b) => n + (b?.questions ?? 0), 0);
type Mark = "yes" | "part" | "no";
const COLS = ["RENYXERA", "Free PYQ sites", "PYQ PDFs", "Coaching test series"];
const ROWS: { need: string; marks: Mark[]; note: string }[] = [
  { need: "Every official PYQ, sorted by topic", marks: ["yes", "yes", "part", "part"], note: `${TOTAL.toLocaleString("en-IN")} official questions, six papers, 2017–2026` },
  { need: "Real exam screen, timer, calculator, GATE marking", marks: ["yes", "no", "no", "yes"], note: "Server-graded with the official keys and negative marking" },
  { need: "Full 65-question mocks in the GATE format", marks: ["yes", "no", "no", "yes"], note: "Fresh 65-question papers; All-India ranked mocks for every plan" },
  { need: "Your weak topics, measured", marks: ["yes", "no", "no", "part"], note: "Every attempt tracked by subject and topic" },
  { need: "Mistakes come back for revision", marks: ["yes", "no", "no", "no"], note: "Automatic revision queue" },
  { need: "AI mentor that explains your exact mistake", marks: ["yes", "no", "no", "no"], note: "Plus and Pro" },
  { need: "Study plan with Telegram reminders", marks: ["yes", "no", "no", "part"], note: "Planner on every plan; automation on Plus/Pro" },
  { need: "Six GATE papers in one place", marks: ["yes", "part", "part", "part"], note: "CS, ECE, EE, ME, Civil, DA" },
];
const FAQ = [
  { q: "Is RENYXERA free to start?", a: "Yes. Practise official papers, take full mocks and use the planner on the free plan. Plus and Pro add the AI mentor, deeper analytics and automation." },
  { q: "Are the questions and answers official?", a: "Yes. Every question is from an official GATE paper, checked against the official paper and the official answer key." },
  { q: "Which GATE papers are covered?", a: "Computer Science & IT, Electronics & Communication, Electrical, Mechanical, Civil and Data Science & AI, 2017–2026 where the papers exist." },
  { q: "Does it work on my phone?", a: "Yes, on any phone, tablet or laptop, and it installs like an app. Your progress syncs when you sign in." },
  { q: "How are All-India mocks ranked?", a: "Everyone takes the same paper in the same window; answers are graded on the server with the official marking rules, then ranked." },
  { q: "Can I cancel?", a: "Plans are fixed-period and don't renew automatically, so there's nothing to cancel. See the refund policy for details." },
];

const Icon = ({ m }: { m: Mark }) =>
  m === "yes" ? <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500 text-white"><Check className="h-3.5 w-3.5" /></span>
    : m === "part" ? <span className="grid h-6 w-6 place-items-center rounded-full bg-amber-400/25 text-amber-700 dark:text-amber-300"><Minus className="h-3.5 w-3.5" /></span>
      : <span className="grid h-6 w-6 place-items-center rounded-full bg-rose-500/12 text-rose-600"><X className="h-3.5 w-3.5" /></span>;

export function CompareAndFaq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-6">
      <section className="card-pastel overflow-hidden p-5 sm:p-7" data-tint="plain">
        <span className="section-label">Why RENYXERA</span>
        <h2 className="mt-2 font-display text-2xl font-extrabold text-[var(--text-primary)]">One place, instead of five</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Free PYQ sites, PDFs and coaching each do part of the job. Here&apos;s how they compare on what decides your rank.</p>
        <p className="mt-3 text-[11px] font-semibold text-[var(--text-muted)] sm:hidden">Swipe the table sideways to compare →</p>
        <div className="mt-3 sm:mt-5 overflow-x-auto [-webkit-overflow-scrolling:touch]">
          <table className="w-full min-w-[640px] border-separate border-spacing-0 text-sm">
            <thead>
              <tr>
                <th className="py-3 pr-3 text-left text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">What you need</th>
                {COLS.map((c, i) => <th key={c} className={`px-3 py-3 text-center text-xs font-bold ${i === 0 ? "rounded-t-2xl bg-violet-500/10 text-violet-700 dark:text-violet-300" : "text-[var(--text-secondary)]"}`}>{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, ri) => (
                <tr key={r.need} className="group">
                  <td className="border-t border-[var(--border-subtle)] py-3 pr-3">
                    <p className="font-semibold text-[var(--text-primary)]">{r.need}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">{r.note}</p>
                  </td>
                  {r.marks.map((m, i) => (
                    <td key={i} className={`border-t border-[var(--border-subtle)] px-3 py-3 ${i === 0 ? `bg-violet-500/10 ${ri === ROWS.length - 1 ? "rounded-b-2xl" : ""}` : ""}`}>
                      <span className="flex justify-center"><Icon m={m} /></span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-[11px] text-[var(--text-muted)]">Our own comparison of typical options; ✓ yes · – partly · ✗ no. Free community sites are excellent for discussion, and many students use both.</p>
      </section>

      <section className="card-pastel p-5 sm:p-7" data-tint="peri">
        <span className="section-label">Questions</span>
        <h2 className="mt-2 font-display text-2xl font-extrabold text-[var(--text-primary)]">Good to know</h2>
        <ul className="card-inset mt-4 divide-y divide-[var(--border-subtle)]">
          {FAQ.map((f, i) => (
            <li key={f.q}>
              <button type="button" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-semibold text-[var(--text-primary)] cursor-pointer">
                {f.q}<ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && <p className="px-4 pb-4 text-sm leading-relaxed text-[var(--text-secondary)]">{f.a}</p>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
