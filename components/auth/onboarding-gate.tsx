"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, CheckCircle2, XCircle, Sparkles, LogOut, IdCard, PartyPopper } from "lucide-react";
import { useAuthStore, type Profile } from "@/store/use-auth-store";
import { normalizeUsername, usernameProblem } from "@/lib/username";
import { upcomingExamYear } from "@/lib/goals/exam-year";
import { NumberStepper } from "@/components/ui/number-stepper";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { SIGNED_OUT_FLAG } from "@/lib/utils";
import { confirmDialog } from "@/components/ui/confirm-dialog";

const STATUSES = [
  { label: "Select…", value: "" },
  { label: "Student (pre-final year)", value: "student" },
  { label: "Final-year student", value: "final_year" },
  { label: "Graduate", value: "graduate" },
  { label: "Working professional", value: "working" },
  { label: "Full-time aspirant / dropper", value: "dropper" },
];
const INPUT = "w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500";
const LABEL = "block text-xs font-bold text-[var(--text-secondary)] mb-1.5";

/**
 * Required account setup. A signed-in account whose profile has no `onboarded_at` sees
 * this full-screen step on every page (it's read from the database, so reloading or
 * navigating can't skip it) until the essentials are saved: display name, a unique
 * username, target year and status. The database enforces the same rule
 * (profiles_onboarding_check), and assigns the permanent student ID.
 */
export function OnboardingGate() {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const setProfile = useAuthStore((s) => s.setProfile);
  const upcoming = upcomingExamYear();

  // Only once migration 0007 exists (the column is present) and the account isn't set up.
  const needed = !!user && !!profile && "onboarded_at" in profile && !profile.onboarded_at;

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [year, setYear] = useState(upcoming);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null); // student id once finished
  const [name, setName] = useState<{ state: "idle" | "checking" | "ok" | "bad"; reason?: string }>({ state: "idle" });

  useEffect(() => {
    if (!needed || !profile) return;
    setDisplayName((d) => d || profile.display_name || user?.email?.split("@")[0]?.replace(/[._\d]+/g, " ").trim() || "");
    setUsername((u) => u || (profile.username ?? ""));
    if (profile.target_year && profile.target_year >= upcoming) setYear(profile.target_year);
  }, [needed, profile, user, upcoming]);

  useEffect(() => {
    const u = username.trim();
    if (!u) return setName({ state: "idle" });
    const problem = usernameProblem(u);
    if (problem) return setName({ state: "bad", reason: problem });
    if (profile?.username && u === profile.username.toLowerCase()) return setName({ state: "ok" });
    setName({ state: "checking" });
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/username/check?u=${encodeURIComponent(u)}`, { signal: ctrl.signal });
        const body = await res.json().catch(() => ({}));
        setName(res.ok && body.available ? { state: "ok" } : { state: "bad", reason: body.reason || body.error || "That username is taken." });
      } catch (e: any) {
        if (e?.name !== "AbortError") setName({ state: "bad", reason: "Couldn't check right now — try again." });
      }
    }, 400);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [username, profile?.username]);

  if (!needed && !done) return null;

  const canSave = displayName.trim().length >= 2 && name.state === "ok" && !!status && !saving;

  const save = async () => {
    if (!user || !profile) return;
    if (!canSave) return setError("Please fill in every field above.");
    setSaving(true);
    setError(null);
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const updates = {
      display_name: displayName.trim(),
      username: normalizeUsername(username.trim()),
      target_year: year,
      target_branch: "CSE",
      aspirant_status: status,
      onboarded_at: new Date().toISOString(),
    };
    const { data, error } = await supabase.from("profiles").update(updates).eq("id", user.id).select("*").single();
    setSaving(false);
    if (error) {
      if ((error as any).code === "23505" || /duplicate|unique/i.test(error.message)) {
        setName({ state: "bad", reason: "That username was just taken." });
        return setError("That username was just taken — pick another.");
      }
      return setError("Couldn't save your details. Please try again.");
    }
    setDone((data as Profile)?.student_id || profile.student_id || "—");
    setProfile({ ...profile, ...(data as Profile) });
  };

  const signOut = async () => {
    if (!(await confirmDialog({ title: "Sign out?", message: "You'll need to sign in again to sync your progress. Your account setup will wait for you — you'll finish it next time.", confirmLabel: "Sign out", cancelLabel: "Stay signed in", tone: "warning", icon: "leave" }))) return;
    sessionStorage.setItem(SIGNED_OUT_FLAG, "1");
    const { createClient } = await import("@/lib/supabase/client");
    await createClient().auth.signOut().catch(() => {});
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xl overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="onb-title">
      <motion.div initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="nav-cluster w-full max-w-lg rounded-3xl p-6 sm:p-8 my-auto shadow-[0_40px_100px_-30px_rgba(76,29,149,0.6)]">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-2">
              <motion.div initial={{ rotate: -20, scale: 0.5 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 14 }}
                className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-600 to-fuchsia-600 text-white flex items-center justify-center shadow-lg shadow-violet-500/40">
                <PartyPopper className="w-8 h-8" />
              </motion.div>
              <h2 className="mt-4 text-xl font-extrabold text-[var(--text-primary)]">You&apos;re all set, {displayName.split(" ")[0]}!</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">Your student ID</p>
              <p className="mt-1 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/10 text-violet-700 dark:text-violet-300 text-lg font-extrabold font-num tracking-wider"><IdCard className="w-5 h-5" /> {done}</p>
              <p className="mt-2 text-xs text-[var(--text-muted)]">It&apos;s permanent and unique to your account — you&apos;ll find it on your profile.</p>
              <button onClick={() => setDone(null)} className="mt-6 w-full h-11 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white font-semibold shadow-md shadow-violet-500/30 cursor-pointer">Start preparing</button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-md shadow-violet-500/30"><Sparkles className="w-5 h-5" /></span>
                <div>
                  <h2 id="onb-title" className="text-lg font-extrabold text-[var(--text-primary)] leading-tight">Finish setting up your account</h2>
                  <p className="text-xs text-[var(--text-secondary)]">Just the essentials — takes 30 seconds.</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className={LABEL} htmlFor="onb-name">Your name</label>
                  <input id="onb-name" value={displayName} onChange={(e) => setDisplayName(e.target.value.slice(0, 60))} className={INPUT} placeholder="e.g. Aarav Sharma" autoFocus />
                </div>
                <div>
                  <label className={LABEL} htmlFor="onb-user">Username <span className="font-normal text-[var(--text-muted)]">— unique, how others see you</span></label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)]">@</span>
                    <input id="onb-user" value={username} onChange={(e) => setUsername(normalizeUsername(e.target.value))} maxLength={20} autoCapitalize="none" autoCorrect="off" spellCheck={false}
                      className={`${INPUT} pl-8 pr-9 ${name.state === "bad" ? "border-rose-500/60" : name.state === "ok" ? "border-emerald-500/60" : ""}`} placeholder="username" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      {name.state === "checking" && <Loader2 className="w-4 h-4 animate-spin text-[var(--text-muted)]" />}
                      {name.state === "ok" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      {name.state === "bad" && <XCircle className="w-4 h-4 text-rose-500" />}
                    </span>
                  </div>
                  <p aria-live="polite" className={`mt-1.5 text-[11px] font-medium ${name.state === "ok" ? "text-emerald-600 dark:text-emerald-400" : name.state === "bad" ? "text-rose-500" : "text-[var(--text-muted)]"}`}>
                    {name.state === "ok" ? `@${username} is yours` : name.state === "bad" ? name.reason : name.state === "checking" ? "Checking…" : "Lowercase letters, numbers and _ · 3–20 characters"}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL}>Target GATE year</label>
                    <NumberStepper ariaLabel="Target GATE year" min={upcoming} max={upcoming + 5} value={year} onChange={setYear} />
                  </div>
                  <div>
                    <label className={LABEL}>I am a</label>
                    <CustomDropdown value={status} onChange={setStatus} options={STATUSES} className="w-full text-sm font-medium" />
                  </div>
                </div>
                <p className="text-[11px] text-[var(--text-muted)]">Branch: <strong className="text-[var(--text-secondary)]">Computer Science &amp; IT</strong> (more branches coming soon). You can add college, goals and more later in your profile.</p>
              </div>

              {error && <p role="alert" className="mt-4 text-xs font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">{error}</p>}

              <button onClick={save} disabled={!canSave} className="mt-6 w-full h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white font-semibold shadow-md shadow-violet-500/30 disabled:opacity-50 cursor-pointer">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />} Continue
              </button>
              <button onClick={signOut} className="mt-3 w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer">
                <LogOut className="w-3.5 h-3.5" /> Sign out and finish later
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
