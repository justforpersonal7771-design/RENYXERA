"use client";

import { useRef, useState } from "react";
import { emailProblem, passwordProblem, friendlyAuthError } from "@/lib/auth-messages";
import { FieldError } from "@/components/auth/field-error";
import { TurnstileWidget, type TurnstileHandle } from "@/components/auth/turnstile-widget";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";

interface LoginFormProps {
  /** Where to send the user after a successful sign-in. */
  redirectTo?: string;
  /** Called right after a successful sign-in — the modal uses this to close itself
   *  instead of navigating (the page already reflects the new session once
   *  AuthListener's reload runs). */
  onSuccess?: () => void;
  /** Renders the "Create an account" / "Forgot?" / "Continue as guest" links as
   *  in-place mode switches (for the modal) rather than full navigations (for the
   *  standalone page). */
  onSwitchToSignup?: () => void;
  onSwitchToForgot?: () => void;
  onDismiss?: () => void;
}

export function LoginForm({ redirectTo = "/", onSuccess, onSwitchToSignup, onSwitchToForgot, onDismiss }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string | null; password?: string | null }>({});
  const turnstileRef = useRef<TurnstileHandle>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fe = { email: emailProblem(email), password: passwordProblem(password, false) };
    setFieldErrors(fe);
    if (fe.email || fe.password) return;
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password, options: { captchaToken: captchaToken ?? undefined } });
      if (error) {
        turnstileRef.current?.reset();
        setError(friendlyAuthError(error.message));
        setLoading(false);
        return;
      }
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong while configuring sign-in. Is Supabase set up yet?");
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-xl font-display font-bold text-[var(--text-primary)] mb-1">Welcome <span className="font-serif italic font-normal text-[1.15em] bg-gradient-to-r from-[#06c2fb] via-[#5b21e0] to-[#dd42fb] bg-clip-text text-transparent pr-0.5">back</span></h1>
      <p className="text-sm text-[var(--text-secondary)] mb-6">Sign in to sync your progress across devices.</p>

      <GoogleAuthButton onError={setError} />

      <div className="flex items-center gap-3 my-5">
        <div className="h-px flex-1 bg-[var(--border)]" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">or</span>
        <div className="h-px flex-1 bg-[var(--border)]" />
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">
        <div>
          <label htmlFor="login-email" className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setFieldErrors((f) => ({ ...f, email: null })); }}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            placeholder="you@example.com"
          />
          <FieldError message={fieldErrors.email} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="login-password" className="block text-xs font-bold text-[var(--text-secondary)]">
              Password
            </label>
            {onSwitchToForgot ? (
              <button type="button" onClick={onSwitchToForgot} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                Forgot?
              </button>
            ) : (
              <Link href="/reset-password" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                Forgot?
              </Link>
            )}
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setFieldErrors((f) => ({ ...f, password: null })); }}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 pr-10 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <FieldError message={fieldErrors.password} />
        </div>

        <TurnstileWidget ref={turnstileRef} onToken={setCaptchaToken} />

        {error && (
          <p role="alert" className="text-xs font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !captchaToken}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm px-4 py-2.5 transition-colors disabled:opacity-50 disabled:pointer-events-none mt-1"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Sign in
        </button>
      </form>

      <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
        New here?{" "}
        {onSwitchToSignup ? (
          <button type="button" onClick={onSwitchToSignup} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Create an account
          </button>
        ) : (
          <Link href="/signup" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            Create an account
          </Link>
        )}
      </p>
      <p className="text-center text-xs text-[var(--text-muted)] mt-3">
        {onDismiss ? (
          <button type="button" onClick={onDismiss} className="hover:text-[var(--text-secondary)] hover:underline">
            Continue as guest instead
          </button>
        ) : (
          <Link href="/" className="hover:text-[var(--text-secondary)] hover:underline">
            Continue as guest instead
          </Link>
        )}
      </p>
    </div>
  );
}
