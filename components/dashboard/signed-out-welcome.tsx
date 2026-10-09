"use client";

import Link from "next/link";
import { ArrowRight, BarChart3, BrainCircuit, CloudUpload, RefreshCw } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { useAuthModalStore } from "@/store/use-auth-modal-store";
import { BANK_SUMMARY } from "@/lib/branches";

const TOTAL_QUESTIONS = Object.values(BANK_SUMMARY).reduce((n, b) => n + (b?.questions ?? 0), 0);
const PAPERS = Object.keys(BANK_SUMMARY).length;

const PERKS = [
  { icon: BarChart3, title: "See your weak topics", body: "Every attempt feeds analytics by subject and topic." },
  { icon: RefreshCw, title: "Mistakes become revision", body: "Wrong answers come back at the right time, automatically." },
  { icon: BrainCircuit, title: "AI Mentor on every question", body: "Step-by-step explanations tied to your own mistakes." },
  { icon: CloudUpload, title: "Pick up on any device", body: "Your progress follows you from laptop to phone." },
];

/** Shown above the dashboard to visitors who haven't signed in — the value of an account, not a pitch to skip it. */
export function SignedOutWelcome() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const openAuth = useAuthModalStore((s) => s.open);
  if (loading || user) return null;
  return (
    <section aria-label="Welcome" className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10 p-5 sm:p-8">
      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400">
        {TOTAL_QUESTIONS.toLocaleString("en-IN")} official GATE questions · {PAPERS} papers · 2017–2026
      </p>
      <h2 className="mt-2 max-w-3xl text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
        Practise like the real exam. Let your account remember everything.
      </h2>
      <p className="mt-2 max-w-2xl text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
        Sign in once and your branch, targets, mistakes and scores stay with you — so every session starts exactly where the last one ended.
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => openAuth("signup")}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-5 text-sm font-bold text-white shadow-md shadow-violet-500/30 transition hover:-translate-y-px cursor-pointer">
          Sign in and start <ArrowRight className="h-4 w-4" />
        </button>
        <Link href="/pyq" className="text-sm font-bold text-violet-600 dark:text-violet-400 hover:underline">Browse the official papers →</Link>
      </div>
      <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PERKS.map((p) => (
          <li key={p.title} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 p-3.5">
            <p.icon className="h-4 w-4 text-violet-500" aria-hidden />
            <p className="mt-2 text-sm font-bold text-[var(--text-primary)]">{p.title}</p>
            <p className="mt-0.5 text-xs text-[var(--text-secondary)] leading-relaxed">{p.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
