import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpen, BrainCircuit, CheckCircle2, ClipboardList, FileText, PieChart, Rocket, Users } from "lucide-react";
import { BRANCHES, branchBySlug } from "@/lib/branches";
import { NotifyForm } from "@/components/marketing/notify-form";

// Step 8 (4H): one static, crawlable landing page per GATE branch — /gate-cse, /gate-da, …
export const dynamicParams = false;
export function generateStaticParams() {
  return BRANCHES.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const b = branchBySlug((await params).slug);
  if (!b) return {};
  const title = b.live
    ? `GATE ${b.paper} Preparation — Free PYQs, Mocks & AI Mentor | RENYXERA`
    : `GATE ${b.paper} (${b.short}) Preparation — Coming to RENYXERA`;
  const description = b.live
    ? `Prepare for GATE ${b.name} with every official paper since 2017, an exam-like test simulator, mistake analytics and an AI mentor. Free to start.`
    : `GATE ${b.name} preparation is coming to RENYXERA: past papers with solutions, topic-wise practice and full mocks. Join the waitlist to be notified at launch.`;
  return { title, description, alternates: { canonical: `/${b.slug}` }, openGraph: { title, description, type: "website" } };
}

const FEATURES = [
  { icon: FileText, title: "Every official paper", body: "Previous-year GATE papers in a timed, exam-like interface." },
  { icon: ClipboardList, title: "Solutions you can trust", body: "Answers from the official keys, with step-by-step explanations." },
  { icon: PieChart, title: "Know your weak topics", body: "Analytics by subject and topic, and a mistakes bank to revise from." },
  { icon: BrainCircuit, title: "AI mentor", body: "Hints, shortcuts and a revision plan built from what you got wrong." },
];

export default async function BranchPage({ params }: { params: Promise<{ slug: string }> }) {
  const b = branchBySlug((await params).slug);
  if (!b) notFound();
  const others = BRANCHES.filter((o) => o.slug !== b.slug);
  const faq = [
    { q: `What is the GATE ${b.paper} exam pattern?`, a: "GATE is a 3-hour computer-based test with 65 questions for 100 marks: General Aptitude carries 15 marks and your subject the remaining 85. Questions are multiple choice (MCQ), multiple select (MSQ) or numerical answer (NAT); only wrong MCQs carry negative marks." },
    { q: `How many students write GATE ${b.paper}?`, a: `${b.candidates[0].toUpperCase()}${b.candidates.slice(1)} (${b.paper} paper). ${b.trend}` },
    b.live
      ? { q: "Is RENYXERA free?", a: "Yes — you can practise official papers, build custom tests and track your progress for free, as a guest or with an account." }
      : { q: `When will GATE ${b.paper} be available on RENYXERA?`, a: `We're planning to open ${b.short} in ${b.plannedLaunch}. Join the waitlist and we'll email you once — the day it goes live.` },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <div className="py-10 sm:py-14 space-y-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${b.live ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-amber-500/10 text-amber-700 dark:text-amber-300"}`}>
            {b.live ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Rocket className="w-3.5 h-3.5" />}
            {b.live ? "Live now" : `Coming ${b.plannedLaunch}`}
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-[var(--text-primary)] leading-tight">
            GATE {b.paper} <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">{b.short}</span>
          </h1>
          <p className="mt-2 text-sm font-semibold text-[var(--text-secondary)]">{b.name}</p>
          <p className="mt-4 text-base text-[var(--text-secondary)] leading-relaxed max-w-xl">{b.blurb}</p>
          <p className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--text-secondary)]"><Users className="w-4 h-4 text-violet-500 shrink-0" /> <span>{b.candidates[0].toUpperCase()}{b.candidates.slice(1)} · {b.trend}</span></p>
        </div>
        {b.live ? (
          <div className="card-glass rounded-3xl p-6 sm:p-8">
            <p className="text-lg font-bold text-[var(--text-primary)]">Start practising today</p>
            <p className="text-sm text-[var(--text-secondary)] mt-1">No sign-up needed to try it. Create a free account to save your progress on every device.</p>
            <Link href="/setup" className="mt-5 inline-flex w-full h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white font-semibold shadow-md shadow-violet-500/30">
              Start a free practice test <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <NotifyForm branch={b.code} branchName={b.paper} />
        )}
      </section>

      {/* What you get */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[var(--text-primary)] text-center">{b.live ? "Everything you need, in one place" : "What you'll get"}</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card-glass rounded-3xl p-5">
              <span className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center"><f.icon className="w-5 h-5" /></span>
              <p className="mt-3 font-bold text-[var(--text-primary)]">{f.title}</p>
              <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Syllabus */}
      <section className="card-glass rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center"><BookOpen className="w-5 h-5" /></span>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-[var(--text-primary)]">GATE {b.paper} syllabus at a glance</h2>
        </div>
        <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {b.subjects.map((s) => (
            <li key={s} className="flex items-center gap-2.5 rounded-xl bg-[var(--surface-secondary)]/60 border border-[var(--border-subtle)] px-3.5 py-2.5 text-sm font-medium text-[var(--text-primary)]">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> {s}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-[var(--text-muted)]">Summary for orientation — always check the official GATE {b.paper} syllabus from the organising IIT.</p>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[var(--text-primary)] text-center">Frequently asked</h2>
        <div className="mt-6 space-y-3">
          {faq.map((f) => (
            <details key={f.q} className="card-glass rounded-2xl p-5 group">
              <summary className="cursor-pointer font-semibold text-[var(--text-primary)] list-none flex items-center justify-between gap-3">
                {f.q}<ArrowRight className="w-4 h-4 shrink-0 transition-transform group-open:rotate-90 text-[var(--text-muted)]" />
              </summary>
              <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Other branches */}
      <section>
        <h2 className="text-xl font-display font-extrabold text-[var(--text-primary)] text-center">Other GATE branches</h2>
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {others.map((o) => (
            <Link key={o.slug} href={`/${o.slug}`} className="card-glass rounded-2xl p-4 hover:-translate-y-0.5 transition-transform">
              <p className="font-bold text-[var(--text-primary)]">GATE {o.paper}</p>
              <p className="text-xs text-[var(--text-secondary)] truncate">{o.short}</p>
              <p className={`mt-2 text-[10px] font-bold uppercase tracking-wide ${o.live ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>{o.live ? "Live" : "Coming soon"}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
