import Link from "next/link";
import {
  FileText, BrainCircuit, PieChart, ClipboardList, Target, CalendarDays,
  UserRound, ShieldCheck, Sparkles, ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "About RENYXERA — GATE CSE Exam Preparation",
  description:
    "RENYXERA is a free, adaptive GATE Computer Science & IT preparation workspace: 15 official GATE CSE papers with answer keys, custom tests, an AI Mentor, weakness analytics, a mistakes bank and a goal-driven study plan.",
};

const STATS = [
  { value: "15", label: "Official GATE CSE papers", sub: "2017 – 2026" },
  { value: "975", label: "Questions", sub: "with answer keys" },
  { value: "18", label: "Subjects", sub: "full syllabus" },
  { value: "91", label: "Topics", sub: "tracked individually" },
];

const FEATURES = [
  {
    icon: FileText,
    title: "Official papers & custom tests",
    body: "Attempt real previous-year GATE CSE papers in a timed, exam-like interface, or build your own tests by year, section, subject and topic.",
    tint: "bg-indigo-500/10 text-indigo-500",
  },
  {
    icon: BrainCircuit,
    title: "AI Mentor",
    body: "Get step-by-step explanations, hints, shortcuts and a revision plan generated from the questions you actually got wrong.",
    tint: "bg-fuchsia-500/10 text-fuchsia-500",
  },
  {
    icon: PieChart,
    title: "Weakness analytics",
    body: "See accuracy by subject and topic, your readiness index and mastery score, updated after every attempt so you know exactly what to study next.",
    tint: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  },
  {
    icon: ClipboardList,
    title: "Mistakes bank & bookmarks",
    body: "Every wrong answer is saved automatically with how often you've missed it, so you can retry it until it's mastered. Bookmark anything worth revisiting.",
    tint: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    icon: Target,
    title: "Focus Target",
    body: "Pick how much of the syllabus you want to cover and practice concentrates on the highest-weightage topics first, easiest to hardest.",
    tint: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: CalendarDays,
    title: "Study planner & countdown",
    body: "Plan study, revision and mock-test sessions on a calendar with reminders, and keep your GATE exam-day countdown in view.",
    tint: "bg-violet-500/10 text-violet-500",
  },
];

const STEPS = [
  { n: "1", title: "Start without an account", body: "Open the app and practice immediately — no sign-up needed to explore every screen or attempt section, subject and topic tests." },
  { n: "2", title: "Practice and review", body: "Take tests, then review every question against its answer key — signed in, the AI Mentor can explain any of them step by step. Mistakes and bookmarks are collected for you as you go." },
  { n: "3", title: "Sign in to go further", body: "Create a free account to sync progress across devices and unlock full mock exams, the AI Mentor and advanced analytics." },
];

/**
 * Public landing page. Fully server-rendered and readable without JavaScript or an
 * account — unlike the dashboard at "/", which is built from on-device data and shows
 * a loading state until that loads. Every figure here comes from the real question
 * bank (data/Aggregated_Output.json); update STATS if papers are added.
 */
export default function AboutPage() {
  return (
    <div className="py-12 sm:py-20 space-y-20 sm:space-y-28">
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-5">
          <Sparkles className="w-3.5 h-3.5" /> GATE CSE preparation, free to start
        </span>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-[var(--text-primary)] leading-tight">
          A new era of intelligent{" "}
          <span className="font-serif italic font-normal tracking-normal pr-1 bg-gradient-to-r from-[#06c2fb] via-[#5b21e0] to-[#dd42fb] bg-clip-text text-transparent">
            GATE preparation
          </span>
        </h1>
        <p className="mt-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
          RENYXERA is an adaptive study workspace for GATE Computer Science &amp; Information
          Technology aspirants. Practice with official previous-year papers, learn from an AI
          Mentor that works from your own mistakes, and always know which topics to study next.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/30 transition-colors"
          >
            Start practising free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/privacy"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] font-semibold transition-colors"
          >
            How we handle your data
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="card-glass rounded-2xl p-5 text-center">
            <div className="text-3xl sm:text-4xl font-display font-extrabold text-[var(--text-primary)]">{s.value}</div>
            <div className="mt-1 text-sm font-bold text-[var(--text-primary)]">{s.label}</div>
            <div className="text-xs text-[var(--text-muted)]">{s.sub}</div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[var(--text-primary)] text-center">
          Everything you need to prepare, in one place
        </h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="card-glass rounded-3xl p-6">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${f.tint}`}>
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="mt-4 text-base font-extrabold text-[var(--text-primary)]">{f.title}</h3>
              <p className="mt-1.5 text-sm text-[var(--text-secondary)] leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[var(--text-primary)] text-center">How it works</h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {STEPS.map((s) => (
            <div key={s.n} className="card-glass rounded-3xl p-6">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 via-indigo-600 to-fuchsia-500 text-white font-extrabold flex items-center justify-center">
                {s.n}
              </div>
              <h3 className="mt-4 text-base font-extrabold text-[var(--text-primary)]">{s.title}</h3>
              <p className="mt-1.5 text-sm text-[var(--text-secondary)] leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Accounts & Google data */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card-glass rounded-3xl p-6 sm:p-8">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-indigo-500/10 text-indigo-500">
            <UserRound className="w-5 h-5" />
          </div>
          <h2 className="mt-4 text-xl font-extrabold text-[var(--text-primary)]">Guest or account — your choice</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
            You can use RENYXERA without signing up. As a guest, your practice history, mistakes
            and bookmarks are stored only in your browser on this device. Creating a free account
            syncs them across devices and unlocks full-length mock exams, the AI Mentor and
            advanced analytics. Your guest mistakes, bookmarks, saved test templates, to-dos and
            planner events are carried into your account when you sign in.
          </p>
        </div>
        <div className="card-glass rounded-3xl p-6 sm:p-8">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="mt-4 text-xl font-extrabold text-[var(--text-primary)]">Signing in with Google</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
            If you choose &quot;Continue with Google&quot;, RENYXERA receives only your name, email
            address and profile picture — it cannot access your Gmail, Drive, Calendar or any other
            Google data. We use this solely to create and sign you in to your account. We never sell
            it, never use it for advertising, and never use it to train AI models. You can revoke
            access at any time from your Google Account. Full details are in our{" "}
            <Link href="/privacy" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden rounded-3xl p-8 sm:p-12 text-center bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-[0_24px_60px_-20px_rgba(79,70,229,0.6)]">
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-20 w-72 h-72 rounded-full bg-cyan-300/30 blur-3xl" />
        <h2 className="relative text-2xl sm:text-3xl font-display font-extrabold">Ready to start preparing?</h2>
        <p className="relative mt-2 text-white/80">No sign-up needed to begin. Your first test is a click away.</p>
        <Link
          href="/"
          className="relative mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-indigo-700 font-bold hover:bg-white/90 transition-colors"
        >
          Open RENYXERA <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
