"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { upcomingExamYear, effectiveTargetYear, targetYearRolledForward, examDateFor } from "@/lib/goals/exam-year";
import { NumberStepper } from "@/components/ui/number-stepper";
import { motion, AnimatePresence } from "motion/react";
import {
  Loader2, Save, LogOut, CheckCircle2, User as UserIcon, Palette, IdCard, Target,
  GraduationCap, CalendarDays, Trophy, Clock, Mail, Sparkles, XCircle,
  LayoutGrid, SlidersHorizontal, ShieldCheck, Laptop, Download, BookX, Bookmark, RefreshCw, PieChart, ArrowRight,
} from "lucide-react";
import { normalizeUsername, usernameProblem } from "@/lib/username";
import { useAuthStore } from "@/store/use-auth-store";
import { useAuthModalStore } from "@/store/use-auth-modal-store";
import { AvatarPicker, type AvatarValue } from "@/components/profile/avatar-picker";
import { StatsAchievements } from "@/components/profile/stats-achievements";
import { GoalPlan } from "@/components/profile/goal-plan";
import { PreferencesCard, AccountSecurityCard, DevicesCard } from "@/components/profile/account-settings";
import { ProfileHero } from "@/components/profile/profile-hero";
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

const SECTIONS = [
  { id: "overview", label: "Overview", subtitle: "Your progress, streaks and achievements at a glance.", icon: LayoutGrid, tint: "bg-indigo-500/10 text-indigo-500" },
  { id: "profile", label: "Profile", subtitle: "Your avatar, name and username.", icon: IdCard, tint: "bg-fuchsia-500/10 text-fuchsia-500" },
  { id: "goals", label: "Exam goals", subtitle: "Your target, and the plan it builds for you.", icon: Target, tint: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" },
  { id: "preferences", label: "Preferences", subtitle: "Theme, motion and reminders on this device.", icon: SlidersHorizontal, tint: "bg-violet-500/10 text-violet-500" },
  { id: "security", label: "Account & security", subtitle: "Sign-in details, password and your data.", icon: ShieldCheck, tint: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { id: "devices", label: "Devices", subtitle: "Where you're signed in.", icon: Laptop, tint: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
] as const;
type SectionId = (typeof SECTIONS)[number]["id"];

const SHORTCUTS = [
  { href: "/downloads", label: "Downloads", icon: Download, tint: "bg-violet-500/10 text-violet-500" },
  { href: "/mistakes", label: "Mistakes", icon: BookX, tint: "bg-rose-500/10 text-rose-500" },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark, tint: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { href: "/revision", label: "Revision", icon: RefreshCw, tint: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { href: "/analytics", label: "Analytics", icon: PieChart, tint: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
];

const BRANCHES = [
  { label: "Computer Science & IT", value: "CSE" },
  { label: "Data Science & AI — Coming Soon", value: "DA", disabled: true },
  { label: "Electronics & Comm. — Coming Soon", value: "ECE", disabled: true },
  { label: "Electrical Engg. — Coming Soon", value: "EE", disabled: true },
  { label: "Mechanical Engg. — Coming Soon", value: "ME", disabled: true },
  { label: "Civil Engg. — Coming Soon", value: "CE", disabled: true },
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
  const upcomingYear = upcomingExamYear();
  const [targetYear, setTargetYear] = useState(String(upcomingYear));
  // A saved year whose exam is already over rolls forward to the next GATE.
  const yearRolled = targetYearRolledForward(profile?.target_year);
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

  // Seed local form state from the loaded profile (on arrival, and for "Discard").
  const resetFromProfile = useCallback(() => {
    if (!profile) return;
    setAvatar({
      style: isAvatarStyleId(profile.avatar_style) ? profile.avatar_style : "adventurer",
      seed: profile.avatar_seed,
    });
    setDisplayName(profile.display_name || "");
    setUsername((profile.username || "").toLowerCase());
    // Only CSE is live; a "Coming Soon" branch saved before those were locked reads as CSE.
    setTargetBranch(BRANCHES.find((b) => b.value === profile.target_branch && !b.disabled)?.value ?? "CSE");
    setTargetYear(String(effectiveTargetYear(profile.target_year)));
    setTargetRank(profile.target_rank ? String(profile.target_rank) : "");
    setDailyHours(profile.daily_study_hours ? String(profile.daily_study_hours) : "2");
    setError(null);
  }, [profile]);
  useEffect(() => { resetFromProfile(); }, [resetFromProfile]);

  const dirty = !!profile && (
    displayName !== (profile.display_name || "") ||
    username !== (profile.username || "").toLowerCase() ||
    avatar.seed !== profile.avatar_seed ||
    avatar.style !== (isAvatarStyleId(profile.avatar_style) ? profile.avatar_style : "adventurer") ||
    targetBranch !== (profile.target_branch || "CSE") ||
    // A never-saved year matches the default; a past year (rolled forward) counts as a change to save.
    targetYear !== String(profile.target_year ?? effectiveTargetYear(null)) ||
    targetRank !== (profile.target_rank ? String(profile.target_rank) : "") ||
    dailyHours !== (profile.daily_study_hours ? String(profile.daily_study_hours) : "2")
  );

  // Sections, synced to the URL hash so /profile#devices opens that section directly.
  const [tab, setTab] = useState<SectionId>("overview");
  useEffect(() => {
    const read = () => {
      const h = window.location.hash.slice(1) as SectionId;
      if (SECTIONS.some((x) => x.id === h)) setTab(h);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);
  const selectTab = (id: SectionId) => {
    setTab(id);
    history.replaceState(null, "", `#${id}`);
    if (window.innerWidth < 1024) document.getElementById("profile-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
  const examDate = examDateFor(Number(targetYear) || upcomingYear, null);
  const daysLeft = Math.ceil((new Date(examDate + "T09:00:00").getTime() - Date.now()) / 86_400_000);

  const tabBody = (() => {
    switch (tab) {
      case "profile":
        return (
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-start">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="xl:col-span-2 card-glass rounded-3xl p-6">
              <SectionHeader icon={Palette} title="Avatar" subtitle="Pick a style and shuffle until it feels like you." tint="bg-fuchsia-500/10 text-fuchsia-500" />
              <AvatarPicker value={avatar} onChange={setAvatar} />
            </motion.div>
            <div className="xl:col-span-3">
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

            </div>
          </div>
        );
      case "goals":
        return (
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 items-stretch">
            <div className="xl:col-span-3 flex flex-col">
          {/* Exam goals */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="card-glass rounded-3xl p-6 flex-1 flex flex-col"
          >
            <SectionHeader icon={Target} title="Exam Goals" subtitle="Your target for this attempt." tint="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLASS}><GraduationCap className="w-3.5 h-3.5" /> Target Branch</label>
                <CustomDropdown value={targetBranch} onChange={setTargetBranch} options={BRANCHES} className="w-full text-sm font-medium" />
                <p className="mt-1.5 text-[11px] text-[var(--text-muted)]">
                  Studying another branch?{" "}
                  <a href="/gate-da" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Get notified when it launches</a>
                </p>
              </div>
              <div>
                <label className={LABEL_CLASS}><CalendarDays className="w-3.5 h-3.5" /> Target Year</label>
                <NumberStepper ariaLabel="Target year" min={upcomingYear} max={upcomingYear + 5} value={Number(targetYear) || upcomingYear} onChange={(v) => setTargetYear(String(v))} />
                {yearRolled && Number(targetYear) === upcomingYear && (
                  <p className="mt-1.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                    GATE {profile?.target_year} is over, so we moved you to GATE {upcomingYear}. Save to keep it.
                  </p>
                )}
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

            {/* What each goal actually drives — real content for the space a stretched
                card gains, and a plain explanation of why these fields matter. */}
            <div className="mt-6 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)] mb-3">What your goals change</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { icon: CalendarDays, title: "Target year", body: "Sets your countdown and pacing, and moves on to the next GATE by itself once this one is over." },
                  { icon: Trophy, title: "Target rank", body: "Works out the marks you need and the topics to focus on (your Goal plan)." },
                  { icon: Clock, title: "Daily hours", body: "Sizes your daily question target and checks whether the plan fits your time." },
                  { icon: GraduationCap, title: "Branch", body: "Picks the question pool and subject weightage your practice is built from." },
                ].map((g) => (
                  <div key={g.title} className="flex gap-3 rounded-2xl bg-[var(--surface-secondary)]/50 p-3">
                    <span className="w-8 h-8 shrink-0 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                      <g.icon className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[var(--text-primary)]">{g.title}</p>
                      <p className="text-[11px] leading-snug text-[var(--text-muted)] mt-0.5">{g.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }} className="xl:col-span-2 flex flex-col">
              <GoalPlan targetRank={Number(targetRank) > 0 ? Number(targetRank) : null} targetYear={Number(targetYear) || upcomingYear} dailyHours={Number(dailyHours) || 0} />
            </motion.div>
          </div>
        );
      case "preferences":
        return <PreferencesCard />;
      case "security":
        return <AccountSecurityCard />;
      case "devices":
        return <DevicesCard />;
      default:
        return (
          <div className="space-y-6">
            <StatsAchievements />
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
              <GoalPlan targetRank={Number(targetRank) > 0 ? Number(targetRank) : null} targetYear={Number(targetYear) || upcomingYear} dailyHours={Number(dailyHours) || 0} />
            </motion.div>
          </div>
        );
    }
  })();

  const current = SECTIONS.find((x) => x.id === tab) ?? SECTIONS[0];

  return (
    <div className="w-full max-w-7xl mx-auto pb-24 flex flex-col lg:flex-row gap-6">
      {/* Sidebar: vertical profile card + quick access */}
      <aside className="lg:w-[300px] xl:w-[320px] shrink-0 flex flex-col gap-4 lg:sticky lg:top-2 lg:self-start">
        <ProfileHero
          name={name}
          username={username}
          email={user.email}
          tier={profile?.tier || "free"}
          avatarUri={avatarUri}
          targetYear={targetYear}
          branchLabel={branchLabel}
          targetRank={targetRank}
          dailyHours={dailyHours}
          signingOut={signingOut}
          onSignOut={handleSignOut}
          daysLeft={daysLeft}
        />

        <motion.nav aria-label="Profile sections" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.08 }}
          className="card-glass rounded-3xl p-2.5">
          <p className="px-2.5 pt-1.5 pb-2 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--text-muted)] hidden lg:block">Quick access</p>
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible custom-scrollbar">
            {SECTIONS.map((sct) => {
              const active = sct.id === tab;
              return (
                <button key={sct.id} onClick={() => selectTab(sct.id)} aria-current={active ? "page" : undefined}
                  className={`group relative shrink-0 flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-colors cursor-pointer ${active ? "text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]/70"}`}>
                  {active && <motion.span layoutId="profile-tab" transition={{ type: "spring", stiffness: 420, damping: 34 }} className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md shadow-violet-500/30" />}
                  <sct.icon className="relative w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                  <span className="relative whitespace-nowrap">{sct.label}</span>
                </button>
              );
            })}
          </div>
          <div className="hidden lg:block mt-2 pt-2 border-t border-[var(--border-subtle)]">
            <p className="px-2.5 pt-1 pb-2 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">Shortcuts</p>
            <div className="grid grid-cols-1 gap-0.5">
              {SHORTCUTS.map((sc, i) => (
                <motion.div key={sc.href} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.04 }}>
                  <Link href={sc.href} className="group flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]/70 transition-colors">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${sc.tint}`}><sc.icon className="w-3.5 h-3.5" /></span>
                    <span className="flex-1 font-medium">{sc.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.nav>
      </aside>

      {/* Section content */}
      <section id="profile-section" className="flex-1 min-w-0 scroll-mt-24">
        <div className="mb-4 flex items-center gap-3">
          <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${current.tint}`}><current.icon className="w-5 h-5" /></span>
          <div>
            <h2 className="text-xl font-extrabold text-[var(--text-primary)] leading-tight">{current.label}</h2>
            <p className="text-xs text-[var(--text-secondary)]">{current.subtitle}</p>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 14, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -10, filter: "blur(4px)" }} transition={{ duration: 0.25 }}>
            {tabBody}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Floating save bar — only when there are unsaved changes (or a result to show) */}
      <AnimatePresence>
        {(dirty || saving || saved || error) && (
          <motion.div initial={{ opacity: 0, y: 40, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40, scale: 0.96 }} transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="fixed bottom-4 inset-x-0 mx-auto z-40 w-[calc(100%-2rem)] max-w-xl">
            <div className="nav-cluster rounded-2xl px-4 py-3 flex items-center gap-3 shadow-[0_20px_50px_-15px_rgba(76,29,149,0.45)]">
              {error ? (
                <p role="alert" className="flex-1 min-w-0 text-xs font-semibold text-rose-500">{error}</p>
              ) : saved && !dirty ? (
                <p className="flex-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Changes saved</p>
              ) : (
                <p className="flex-1 min-w-0 text-sm font-semibold text-[var(--text-primary)]"><span className="sm:hidden">Unsaved changes</span><span className="hidden sm:inline">You have unsaved changes</span></p>
              )}
              {dirty && (
                <button onClick={resetFromProfile} disabled={saving} className="shrink-0 h-9 px-3 rounded-xl text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer">Discard</button>
              )}
              {(dirty || error) && (
                <button onClick={handleSave} disabled={saving || usernameBlocksSave}
                  className="shrink-0 inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold shadow-md shadow-violet-500/30 disabled:opacity-50 cursor-pointer">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save changes
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
