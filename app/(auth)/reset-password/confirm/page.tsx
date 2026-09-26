"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Loader2, Eye, EyeOff, CheckCircle2, KeyRound, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/**
 * Last step of "Forgot password": the reset email → /auth/callback (which exchanges the
 * one-time code for a recovery session) → here, where the user chooses a new password.
 * Without a recovery session (link expired, opened in another browser) we say so and
 * offer a fresh link instead of showing a form that can't work.
 */
export default function ResetPasswordConfirmPage() {
  const router = useRouter();
  const [session, setSession] = useState<"checking" | "ok" | "missing">("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    createClient().auth.getSession()
      .then(({ data }) => setSession(data.session ? "ok" : "missing"))
      .catch(() => setSession("missing"));
  }, []);

  const tooShort = password.length > 0 && password.length < 8;
  const mismatch = confirm.length > 0 && confirm !== password;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) return setError("Use at least 8 characters.");
    if (password !== confirm) return setError("The two passwords don't match.");
    setError(null);
    setLoading(true);
    const { error } = await createClient().auth.updateUser({ password });
    setLoading(false);
    if (error) return setError(error.message);
    setDone(true);
    setTimeout(() => router.push("/"), 1800);
  }

  const input = "w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 pr-10 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]";

  return (
    <div className="card-glass rounded-2xl p-6 sm:p-8">
      {session === "checking" ? (
        <div className="py-10 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-violet-500" /></div>
      ) : session === "missing" ? (
        <div className="text-center">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h1 className="text-lg font-display font-bold text-[var(--text-primary)] mb-1.5">This reset link has expired</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Reset links work once, for a limited time, in the same browser you requested them from.
          </p>
          <Link href="/reset-password" className="inline-flex mt-5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold shadow-md shadow-violet-500/30">
            Send a new link
          </Link>
        </div>
      ) : done ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h1 className="text-lg font-display font-bold text-[var(--text-primary)] mb-1">Password updated</h1>
          <p className="text-sm text-[var(--text-secondary)]">You're signed in. Taking you to your dashboard…</p>
        </motion.div>
      ) : (
        <>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-violet-500/30 mb-4">
            <KeyRound className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-display font-bold text-[var(--text-primary)] mb-1">Choose a new password</h1>
          <p className="text-sm text-[var(--text-secondary)] mb-6">At least 8 characters. You'll stay signed in on this device.</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <div>
              <label htmlFor="new-password" className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5">New password</label>
              <div className="relative">
                <input id="new-password" type={show ? "text" : "password"} autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={input} placeholder="At least 8 characters" />
                <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {tooShort && <p className="mt-1.5 text-[11px] text-rose-500">Use at least 8 characters.</p>}
            </div>
            <div>
              <label htmlFor="confirm-password" className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5">Confirm new password</label>
              <input id="confirm-password" type={show ? "text" : "password"} autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className={input} placeholder="Type it again" />
              {mismatch && <p className="mt-1.5 text-[11px] text-rose-500">Passwords don't match.</p>}
            </div>
            {error && <p role="alert" className="text-xs font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={loading || tooShort || mismatch || !password || !confirm} className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white font-semibold text-sm px-4 py-2.5 shadow-md shadow-violet-500/30 transition disabled:opacity-50 disabled:pointer-events-none mt-1">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Update password
            </button>
          </form>
        </>
      )}
    </div>
  );
}
