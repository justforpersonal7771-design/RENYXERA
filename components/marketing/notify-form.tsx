"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, CheckCircle2, Loader2, Users } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { emailProblem } from "@/lib/auth-messages";

/** "Notify me" for a branch that isn't live yet. Members join with one click; guests by email. */
export function NotifyForm({ branch, branchName }: { branch: string; branchName: string }) {
  const user = useAuthStore((s) => s.user);
  const authLoading = useAuthStore((s) => s.loading);
  const [email, setEmail] = useState("");
  const [trap, setTrap] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done" | "already">("idle");
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/waitlist").then((r) => r.json()).then((j) => setCount(j?.counts?.[branch] ?? null)).catch(() => {});
  }, [branch]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      const problem = emailProblem(email);
      if (problem) return setError(problem);
    }
    setError(null);
    setState("saving");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ branch, email: user ? undefined : email.trim(), website: trap || undefined }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) { setState("idle"); return setError(j.error || "Couldn't save that. Please try again."); }
      setState(j.already ? "already" : "done");
      if (!j.already) setCount((c) => (c === null ? c : c + 1));
    } catch {
      setState("idle");
      setError("You seem to be offline. Please try again.");
    }
  };

  return (
    <div className="card-glass rounded-3xl p-6 sm:p-8">
      <AnimatePresence mode="wait">
        {state === "done" || state === "already" ? (
          <motion.div key="ok" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-lg font-bold text-[var(--text-primary)]">{state === "already" ? "You're already on the list" : "You're on the list!"}</p>
            <p className="text-sm text-[var(--text-secondary)] mt-1">We'll let you know the moment GATE {branchName} opens on RENYXERA.</p>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-md shadow-violet-500/30"><Bell className="w-5 h-5" /></span>
              <div>
                <p className="font-bold text-[var(--text-primary)]">Get notified at launch</p>
                <p className="text-xs text-[var(--text-secondary)]">One email when {branchName} goes live. No spam.</p>
              </div>
            </div>
            {/* Honeypot — hidden from people, tempting to bots */}
            <input type="text" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" name="website" />
            {authLoading ? (
              <div className="h-11 flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-[var(--text-muted)]" /></div>
            ) : user ? (
              <button type="submit" disabled={state === "saving"} className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white font-semibold shadow-md shadow-violet-500/30 disabled:opacity-60 cursor-pointer">
                {state === "saving" && <Loader2 className="w-4 h-4 animate-spin" />} Notify me as {user.email}
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(null); }} placeholder="you@example.com" aria-label="Email address" aria-invalid={!!error}
                  className={`flex-1 h-11 rounded-xl border bg-[var(--surface)] px-3.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${error ? "border-rose-500/60" : "border-[var(--border)]"}`} />
                <button type="submit" disabled={state === "saving"} className="h-11 px-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white font-semibold shadow-md shadow-violet-500/30 disabled:opacity-60 cursor-pointer">
                  {state === "saving" && <Loader2 className="w-4 h-4 animate-spin" />} Notify me
                </button>
              </div>
            )}
            {error && <p role="alert" className="mt-2 text-xs font-medium text-rose-500">{error}</p>}
          </motion.form>
        )}
      </AnimatePresence>
      {count !== null && count >= 25 && (
        <p className="mt-4 text-xs text-[var(--text-secondary)] inline-flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-violet-500" /> {count.toLocaleString("en-IN")} aspirants are already waiting</p>
      )}
    </div>
  );
}
