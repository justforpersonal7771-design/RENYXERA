"use client";

import { useEffect, useMemo, useState } from "react";
import { NumberStepper } from "@/components/ui/number-stepper";
import { motion } from "motion/react";
import {
  Loader2, Save, LogOut, CheckCircle2, User as UserIcon, Palette, IdCard, Target,
  GraduationCap, CalendarDays, Trophy, Clock, Mail, Sparkles, XCircle,
} from "lucide-react";
import { normalizeUsername, usernameProblem } from "@/lib/username";
import { useAuthStore } from "@/store/use-auth-store";
import { useAuthModalStore } from "@/store/use-auth-modal-store";
import { AvatarPicker, type AvatarValue } from "@/components/profile/avatar-picker";
import { StatsAchievements } from "@/components/profile/stats-achievements";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { isAvatarStyleId } from "@/lib/avatar/dicebear-styles";
import { generateAvatarDataUri, randomAvatarSeed } from "@/lib/avatar/generate-avatar";
import { SIGNED_OUT_FLAG } from "@/lib/utils";

const INPUT_CLASS =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-shadow";

const LABEL_CLASS = "flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] mb-1.5";

function SectionHeader({ icon: Icon, title, subtitle, tint }: { icon: typeof UserIcon; title: string; subtitle: string; tint: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tint}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h2 className="text-base font-extrabold text-[var(--text-primary)] leading-tight">{title}</h2>
        <p className="text-xs text-[var(--text-secondary)]">{subtitle}</p>
      </div>
    </div>
  );
}

const BRANCHES = [
  { label: "Computer Science & IT", value: "CSE" },
  { label: "Data Science & AI — Coming Soon", value: "DA" },
  { label: "Electronics & Comm. — Coming Soon", value: "ECE" },
  { label: "Electrical Engg. — Coming Soon", value: "EE" },
  { label: "Mechanical Engg. — Coming Soon", value: "ME" },
  { label: "Civil Engg. — Coming Soon", value: "CE" },
];

/**
 * Module 4E-3. Identity + avatar (4E-1) + exam goal fields are all wired to the real
 * `profiles` table here. What's NOT done yet, honestly: 4E-2's "goals actually drive
 * the Focus Target / Goal Slider engine" — these fields save correctly, but nothing
 * reads target_rank/target_year to derive a recommended focus band yet. That's a
 * separate piece of work against the existing goal-slider engine, not done in this
 * pass. Stats/Achievements sections from the master plan's profile spec also aren't
 * built yet — this covers Identity, Avatar, and Exam Goals only.
 */
export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const authLoading = useAuthStore((s) => s.loading);
  const setProfile = useAuthStore((s) => s.setProfile);

  const [avatar, setAvatar] = useState<AvatarValue>({ style: "adventurer", seed: randomAvatarSeed() });
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [targetBranch, setTargetBranch] = useState("CSE");
  const [targetYear, setTargetYear] = useState("2027");
  const [targetRank, setTargetRank] = useState("");
  const [dailyHours, setDailyHours] = useState("2");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const openAuthModal = useAuthModalStore((s) => s.open);

  // Live username availability: idle (unchanged/empty) → checking → available/taken/invalid.
  type NameStatus = { state: "idle" | "checking" | "available" | "unavailable" | "error"; reason?: string };
  const [nameStatus, setNameStatus] = useState<NameStatus>({ state: "idle" });
  const savedUsername = (profile?.username || "").toLowerCase();

  useEffect(() => {
    const name = username.trim();
    if (!name || name === savedUsername) {
      setNameStatus({ state: "idle" });
      return;
    }
    const problem = usernameProblem(name);
    if (problem) {
      setNameStatus({ state: "unavailable", reason: problem });
      return;
    }
    setNameStatus({ state: "checking" });
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/username/check?u=${encodeURIComponent(name)}`, { signal: ctrl.signal });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          setNameStatus({ state: "error", reason: body.error || "Couldn't check right now." });
        } else if (body.available) {
          setNameStatus({ state: "available" });
        } else {
          setNameStatus({ state: "unavailable", reason: body.reason || "That username is taken." });
        }
      } catch (e: any) {
        if (e?.name !== "AbortError") setNameStatus({ state: "error", reason: "Couldn't check right now." });
      }
    }, 450);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [username, savedUsername]);

  const usernameBlocksSave = nameStatus.state === "checking" || nameStatus.state === "unavailable";

  const avatarUri = useMemo(() => generateAvatarDataUri(avatar.style, avatar.seed, { size: 160 }), [avatar]);
  const branchLabel = BRANCHES.find((b) => b.value === targetBranch)?.label.replace(" — Coming Soon", "") ?? targetBranch;

  // Seed local form state from the loaded profile once it arrives.
  useEffect(() => {
    if (!profile) return;
    setAvatar({
      style: isAvatarStyleId(profile.avatar_style) ? profile.avatar_style : "adventurer",
      seed: profile.avatar_seed,
    });
    setDisplayName(profile.display_name || "");
    setUsername((profile.username || "").toLowerCase());
    setTargetBranch(profile.target_branch || "CSE");
    setTargetYear(profile.target_year ? String(profile.target_year) : "2027");
    setTargetRank(profile.target_rank ? String(profile.target_rank) : "");
    setDailyHours(profile.daily_study_hours ? String(profile.daily_study_hours) : "2");
  }, [profile]);

  async function handleSave() {
    if (!user) return;
    if (usernameBlocksSave) {
      setError(nameStatus.reason || "Wait for the username check to finish.");
      return;
    }
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const updates = {
        display_name: displayName.trim() || null,
        username: normalizeUsername(username.trim()) || null,
        avatar_seed: avatar.seed,
        avatar_style: avatar.style,
        target_branch: targetBranch,
        target_year: targetYear ? Number(targetYear) : null,
        target_rank: targetRank ? Number(targetRank) : null,
        daily_study_hours: dailyHours ? Number(dailyHours) : 2,
      };
      const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
      if (error) {
        // 23505 = unique violation: someone claimed the name between check and save.
        if ((error as any).code === "23505" || /duplicate|unique/i.test(error.message)) {
          setNameStatus({ state: "unavailable", reason: "That username was just taken." });
          setError("That username was just taken — try another.");
        } else if (/profiles_username_format/.test(error.message)) {
          setError("Usernames can only use lowercase letters, numbers and underscores.");
        } else {
          setError(error.message);
        }
        return;
      }
      // The topbar's AccountButton (and this page, on a future visit) read the avatar
      // and other fields straight from this store — without updating it here too, a
      // successful save would only be reflected once something else happened to
      // refetch the profile (a sign-out/in or a hard reload), so the avatar (and name,
      // goals, ...) looked like they "didn't update" even though the write succeeded.
      setProfile(profile ? { ...profile, ...updates } : null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setError(err?.message || "Could not save — is Supabase configured?");
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    setSigningOut(true);
    try {
      // Read by ClientLayout on the next page load to surface a "Signed out" toast —
      // sessionStorage survives the navigation, a JS variable wouldn't.
      sessionStorage.setItem(SIGNED_OUT_FLAG, "1");
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.auth.signOut();
      // AuthListener's onAuthStateChange handler switches the IndexedDB namespace back
      // to guest, resets every store, and redirects to the dashboard. `signingOut` stays
      // true (never reset on this success path) so the render below keeps showing a
      // spinner instead of this page's own "not signed in" prompt — user becomes null a
      // moment before that redirect actually fires, and without this check that CTA
      // card would flash on screen first, reading like a broken/dead-end page rather
      // than an in-progress sign-out.
    } catch {
      sessionStorage.removeItem(SIGNED_OUT_FLAG);
      setSigningOut(false);
    }
  }

  if (authLoading || signingOut) {
    return (
      <div className="w-full h-full flex items-center justify-center" data-fill-height>
        <Loader2 className="w-6 h-6 animate-spin text-[var(--text-muted)]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full h-full flex items-center justify-center px-4" data-fill-height>
        <div className="card-glass rounded-3xl p-8 sm:p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center bg-gradient-to-br from-cyan-500 via-indigo-600 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/30">
            <UserIcon className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-extrabold text-[var(--text-primary)] mb-1.5">You&apos;re not signed in</h1>
          <p className="text-sm text-[var(--text-secondary)] mb-6">Sign in to set up your profile and sync your progress across devices.</p>
          <button
            onClick={() => openAuthModal("login", "/profile")}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-500/25 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const name = displayName.trim() || user.email?.split("@")[0] || "Aspirant";

  return (
    <div className="w-full max-w-5xl mx-auto pb-4 space-y-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-[0_24px_60px_-20px_rgba(79,70,229,0.6)]"
      >
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-20 w-72 h-72 rounded-full bg-cyan-300/30 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 left-1/3 w-80 h-80 rounded-full bg-fuchsia-300/25 blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="w-24 h-24 shrink-0 rounded-2xl overflow-hidden bg-white/15 backdrop-blur-md shadow-xl ring-4 ring-white/25">
            {/* eslint-disable-next-line @next/next/no-img-element -- data: URI */}
            <img src={avatarUri} alt="Your avatar" className="w-full h-full" width={160} height={160} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight truncate">{name}</h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> {profile?.tier || "free"}
              </span>
            </div>
            {username && <p className="text-sm font-semibold text-white/80">@{username}</p>}
            <p className="flex items-center gap-1.5 text-sm text-white/75 mt-0.5">
              <Mail className="w-3.5 h-3.5" /> {user.email}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-bold">
                <GraduationCap className="w-3.5 h-3.5" /> GATE {targetYear || "—"} · {branchLabel}
              </span>
              {targetRank && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-bold">
                  <Trophy className="w-3.5 h-3.5" /> Target AIR {targetRank}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-bold">
                <Clock className="w-3.5 h-3.5" /> {dailyHours || 0}h / day
              </span>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="self-start sm:self-center flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white/15 hover:bg-white/25 backdrop-blur transition-colors disabled:opacity-50"
          >
            {signingOut ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
            Sign Out
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="lg:col-span-2 lg:self-start card-glass rounded-3xl p-6"
        >
          <SectionHeader icon={Palette} title="Avatar" subtitle="Pick a style and shuffle until it feels like you." tint="bg-fuchsia-500/10 text-fuchsia-500" />
          <AvatarPicker value={avatar} onChange={setAvatar} />
        </motion.div>

        <div className="lg:col-span-3 space-y-6">
          {/* Identity */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="card-glass rounded-3xl p-6"
          >
            <SectionHeader icon={IdCard} title="Identity" subtitle="How you show up across RENYXERA." tint="bg-indigo-500/10 text-indigo-500" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLASS}>Display Name</label>
                <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={60} className={INPUT_CLASS} placeholder="Your name" />
              </div>
              <div>
                <label className={LABEL_CLASS}>Username</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)]">@</span>
                  <input
                    value={username}
                    onChange={(e) => setUsername(normalizeUsername(e.target.value))}
                    maxLength={20}
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    aria-invalid={nameStatus.state === "unavailable"}
                    aria-describedby="username-status"
                    className={`${INPUT_CLASS} pl-8 pr-9 ${
                      nameStatus.state === "unavailable" ? "border-rose-500/60 focus-visible:ring-rose-500"
                      : nameStatus.state === "available" ? "border-emerald-500/60 focus-visible:ring-emerald-500" : ""
                    }`}
                    placeholder="username"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {nameStatus.state === "checking" && <Loader2 className="w-4 h-4 animate-spin text-[var(--text-muted)]" />}
                    {nameStatus.state === "available" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    {nameStatus.state === "unavailable" && <XCircle className="w-4 h-4 text-rose-500" />}
                  </span>
                </div>
                <p id="username-status" aria-live="polite" className={`mt-1.5 text-[11px] font-medium min-h-[16px] ${
                  nameStatus.state === "available" ? "text-emerald-600 dark:text-emerald-400"
                  : nameStatus.state === "unavailable" ? "text-rose-500"
                  : "text-[var(--text-muted)]"
                }`}>
                  {nameStatus.state === "available" && `@${username} is available`}
                  {nameStatus.state === "checking" && "Checking availability…"}
                  {(nameStatus.state === "unavailable" || nameStatus.state === "error") && nameStatus.reason}
                  {nameStatus.state === "idle" && "Lowercase letters, numbers and _ · 3–20 characters"}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Exam goals */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="card-glass rounded-3xl p-6"
          >
            <SectionHeader icon={Target} title="Exam Goals" subtitle="Your target for this attempt." tint="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLASS}><GraduationCap className="w-3.5 h-3.5" /> Target Branch</label>
                <CustomDropdown value={targetBranch} onChange={setTargetBranch} options={BRANCHES} className="w-full text-sm font-medium" />
              </div>
              <div>
                <label className={LABEL_CLASS}><CalendarDays className="w-3.5 h-3.5" /> Target Year</label>
                <NumberStepper ariaLabel="Target year" min={2025} max={2035} value={Number(targetYear) || 2027} onChange={(v) => setTargetYear(String(v))} />
              </div>
              <div>
                <label className={LABEL_CLASS}><Trophy className="w-3.5 h-3.5" /> Target Rank (optional)</label>
                <NumberStepper ariaLabel="Target rank (0 = not set)" min={0} max={100000} step={10} value={Number(targetRank) || 0} onChange={(v) => setTargetRank(v > 0 ? String(v) : "")} />
              </div>
              <div>
                <label className={LABEL_CLASS}><Clock className="w-3.5 h-3.5" /> Daily Study Hours</label>
                <NumberStepper ariaLabel="Daily study hours" min={0} max={16} step={0.5} decimals={1} value={Number(dailyHours) || 0} onChange={(v) => setDailyHours(String(v))} />
              </div>
            </div>

            {error && (
              <div role="alert" className="mt-5 flex items-center gap-2 text-xs font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3">
              {saved && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500">
                  <CheckCircle2 className="w-4 h-4" /> Saved
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={saving || usernameBlocksSave}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-500/25 transition-colors"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <StatsAchievements />
    </div>
  );
}
