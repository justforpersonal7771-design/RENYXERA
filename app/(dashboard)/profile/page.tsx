"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Loader2, Save, CheckCircle2, User as UserIcon, Palette, IdCard, Target, GraduationCap, CalendarDays,
  Trophy, Clock, XCircle, LayoutGrid, SlidersHorizontal, ShieldCheck, Laptop, HardDrive, MapPin, BookOpen,
  Building2, Sunrise, Sun, Sunset, Moon, CloudMoon, Hash, Sparkles,
} from "lucide-react";
import { upcomingExamYear, effectiveTargetYear, targetYearRolledForward, examDateFor } from "@/lib/goals/exam-year";
import { NumberStepper } from "@/components/ui/number-stepper";
import { normalizeUsername, usernameProblem } from "@/lib/username";
import { useAuthStore, type Profile } from "@/store/use-auth-store";
import { useAuthModalStore } from "@/store/use-auth-modal-store";
import { AvatarPicker } from "@/components/profile/avatar-picker";
import { StatsAchievements } from "@/components/profile/stats-achievements";
import { GoalPlan } from "@/components/profile/goal-plan";
import { ProfileHeader } from "@/components/profile/profile-header";
import { PreferencesCard, AccountSecurityCard, DevicesCard } from "@/components/profile/account-settings";
import { DataStorageCard } from "@/components/profile/data-storage-card";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { isAvatarStyleId } from "@/lib/avatar/dicebear-styles";
import { generateAvatarDataUri, randomAvatarSeed } from "@/lib/avatar/generate-avatar";
import { SIGNED_OUT_FLAG } from "@/lib/utils";

const INPUT = "w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-shadow";
const LABEL = "flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] mb-1.5";

function Card({ icon: Icon, title, subtitle, tint, children, delay = 0, className = "" }: { icon: typeof UserIcon; title: string; subtitle: string; tint: string; children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay }} className={`card-glass rounded-3xl p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tint}`}><Icon className="w-5 h-5" /></div>
        <div>
          <h3 className="text-base font-extrabold text-[var(--text-primary)] leading-tight">{title}</h3>
          <p className="text-xs text-[var(--text-secondary)]">{subtitle}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

const BRANCHES = [
  { label: "Computer Science & IT", value: "CSE" },
  { label: "Data Science & AI — Coming Soon", value: "DA", disabled: true },
  { label: "Electronics & Comm. — Coming Soon", value: "ECE", disabled: true },
  { label: "Electrical Engg. — Coming Soon", value: "EE", disabled: true },
  { label: "Mechanical Engg. — Coming Soon", value: "ME", disabled: true },
  { label: "Civil Engg. — Coming Soon", value: "CE", disabled: true },
];
const STATUSES = [
  { label: "Select…", value: "" },
  { label: "Student (pre-final year)", value: "student" },
  { label: "Final-year student", value: "final_year" },
  { label: "Graduate", value: "graduate" },
  { label: "Working professional", value: "working" },
  { label: "Full-time aspirant / dropper", value: "dropper" },
];
const STATES = ["", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman & Nicobar", "Chandigarh", "Dadra & Nagar Haveli and Daman & Diu", "Delhi", "Jammu & Kashmir", "Ladakh", "Lakshadweep", "Puducherry", "Outside India"].map((s) => ({ label: s || "Select…", value: s }));
const STUDY_TIMES = [
  { value: "early_morning", label: "Early morning", icon: Sunrise },
  { value: "morning", label: "Morning", icon: Sun },
  { value: "afternoon", label: "Afternoon", icon: Sun },
  { value: "evening", label: "Evening", icon: Sunset },
  { value: "night", label: "Night", icon: Moon },
];

const SECTIONS = [
  { id: "overview", label: "Overview", subtitle: "Your progress, streaks and achievements at a glance.", icon: LayoutGrid, tint: "bg-indigo-500/10 text-indigo-500" },
  { id: "personal", label: "Personal info", subtitle: "Your avatar, identity and background.", icon: IdCard, tint: "bg-fuchsia-500/10 text-fuchsia-500" },
  { id: "goals", label: "Exam goals", subtitle: "Your target, schedule and the plan it builds.", icon: Target, tint: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" },
  { id: "preferences", label: "Preferences", subtitle: "Theme, motion and reminders on this device.", icon: SlidersHorizontal, tint: "bg-violet-500/10 text-violet-500" },
  { id: "security", label: "Account & security", subtitle: "Sign-in, password, your data and account.", icon: ShieldCheck, tint: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { id: "devices", label: "Devices", subtitle: "Where you're signed in.", icon: Laptop, tint: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
  { id: "data", label: "Data & storage", subtitle: "What this device holds, and tools to clean it up.", icon: HardDrive, tint: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
] as const;
type SectionId = (typeof SECTIONS)[number]["id"];

interface Form {
  displayName: string; username: string; avatarStyle: string; avatarSeed: string;
  bio: string; college: string; degree: string; graduationYear: number | null; state: string; city: string;
  aspirantStatus: string; attemptNumber: number | null;
  targetBranch: string; targetYear: string; examDate: string; targetRank: string; targetScore: number | null;
  dailyHours: string; studyDays: number; studyTime: string;
}

function fromProfile(p: Profile | null): Form {
  return {
    displayName: p?.display_name || "",
    username: (p?.username || "").toLowerCase(),
    avatarStyle: p && isAvatarStyleId(p.avatar_style) ? p.avatar_style : "adventurer",
    avatarSeed: p?.avatar_seed || randomAvatarSeed(),
    bio: p?.bio || "", college: p?.college || "", degree: p?.degree || "",
    graduationYear: p?.graduation_year ?? null, state: p?.state || "", city: p?.city || "",
    aspirantStatus: p?.aspirant_status || "", attemptNumber: p?.attempt_number ?? null,
    // Only CSE is live; a "Coming Soon" branch saved before those were locked reads as CSE.
    targetBranch: BRANCHES.find((b) => b.value === p?.target_branch && !b.disabled)?.value ?? "CSE",
    targetYear: String(effectiveTargetYear(p?.target_year)),
    examDate: p?.exam_date || "",
    targetRank: p?.target_rank ? String(p.target_rank) : "",
    targetScore: p?.target_score ?? null,
    dailyHours: p?.daily_study_hours ? String(p.daily_study_hours) : "2",
    studyDays: p?.study_days_per_week ?? 6,
    studyTime: p?.preferred_study_time || "",
  };
}

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const authLoading = useAuthStore((s) => s.loading);
  const setProfile = useAuthStore((s) => s.setProfile);
  const openAuthModal = useAuthModalStore((s) => s.open);
  const upcomingYear = upcomingExamYear();
  const yearRolled = targetYearRolledForward(profile?.target_year);

  const [form, setForm] = useState<Form>(() => fromProfile(null));
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  const resetFromProfile = useCallback(() => { if (profile) { setForm(fromProfile(profile)); setError(null); } }, [profile]);
  useEffect(() => { resetFromProfile(); }, [resetFromProfile]);

  const baseline = useMemo(() => (profile ? fromProfile(profile) : null), [profile]);
  // A year that rolled forward (past exam) counts as a change to save.
  const dirty = !!baseline && (JSON.stringify({ ...form, avatarSeed: form.avatarSeed }) !== JSON.stringify(baseline) || yearRolled && form.targetYear === String(upcomingYear) && profile?.target_year !== upcomingYear);

  // Live username availability.
  type NameStatus = { state: "idle" | "checking" | "available" | "unavailable" | "error"; reason?: string };
  const [nameStatus, setNameStatus] = useState<NameStatus>({ state: "idle" });
  const savedUsername = (profile?.username || "").toLowerCase();
  useEffect(() => {
    const name = form.username.trim();
    if (!name || name === savedUsername) return setNameStatus({ state: "idle" });
    const problem = usernameProblem(name);
    if (problem) return setNameStatus({ state: "unavailable", reason: problem });
    setNameStatus({ state: "checking" });
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/username/check?u=${encodeURIComponent(name)}`, { signal: ctrl.signal });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) setNameStatus({ state: "error", reason: body.error || "Couldn't check right now." });
        else if (body.available) setNameStatus({ state: "available" });
        else setNameStatus({ state: "unavailable", reason: body.reason || "That username is taken." });
      } catch (e: any) {
        if (e?.name !== "AbortError") setNameStatus({ state: "error", reason: "Couldn't check right now." });
      }
    }, 450);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [form.username, savedUsername]);
  const usernameBlocksSave = nameStatus.state === "checking" || nameStatus.state === "unavailable";

  // Sections, synced to the URL hash so /profile#devices opens that section directly.
  const [tab, setTab] = useState<SectionId>("overview");
  useEffect(() => {
    const read = () => {
      const h = window.location.hash.slice(1);
      const id = (h === "profile" ? "personal" : h) as SectionId; // old links
      if (SECTIONS.some((x) => x.id === id)) setTab(id);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);
  const selectTab = (id: SectionId) => {
    setTab(id);
    history.replaceState(null, "", `#${id}`);
    document.getElementById("profile-scroll")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  async function handleSave() {
    if (!user) return;
    if (usernameBlocksSave) return setError(nameStatus.reason || "Wait for the username check to finish.");
    setSaving(true); setError(null); setSaved(false);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const f = form;
      const updates = {
        display_name: f.displayName.trim() || null,
        username: normalizeUsername(f.username.trim()) || null,
        avatar_seed: f.avatarSeed, avatar_style: f.avatarStyle,
        bio: f.bio.trim() || null, college: f.college.trim() || null, degree: f.degree.trim() || null,
        graduation_year: f.graduationYear, state: f.state || null, city: f.city.trim() || null,
        aspirant_status: f.aspirantStatus || null, attempt_number: f.attemptNumber,
        target_branch: f.targetBranch,
        target_year: f.targetYear ? Number(f.targetYear) : null,
        exam_date: f.examDate || null,
        target_rank: f.targetRank ? Number(f.targetRank) : null,
        target_score: f.targetScore,
        daily_study_hours: f.dailyHours ? Number(f.dailyHours) : 2,
        study_days_per_week: f.studyDays, preferred_study_time: f.studyTime || null,
      };
      const { error } = await createClient().from("profiles").update(updates).eq("id", user.id);
      if (error) {
        if ((error as any).code === "23505" || /duplicate|unique/i.test(error.message)) {
          setNameStatus({ state: "unavailable", reason: "That username was just taken." });
          setError("That username was just taken — try another.");
        } else if (/profiles_username_format/.test(error.message)) {
          setError("Usernames can only use lowercase letters, numbers and underscores.");
        } else if (/profiles_details_check/.test(error.message)) {
          setError("One of the details is too long or out of range — please check and try again.");
        } else {
          setError(error.message);
        }
        return;
      }
      setProfile(profile ? { ...profile, ...updates } as Profile : null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      setError(err?.message || "Could not save — please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    setSigningOut(true);
    try {
      sessionStorage.setItem(SIGNED_OUT_FLAG, "1");
      const { createClient } = await import("@/lib/supabase/client");
      await createClient().auth.signOut();
      // AuthListener switches storage back to guest and redirects; keep the spinner.
    } catch {
      sessionStorage.removeItem(SIGNED_OUT_FLAG);
      setSigningOut(false);
    }
  }

  const avatarUri = useMemo(() => generateAvatarDataUri(form.avatarStyle as any, form.avatarSeed, { size: 160 }), [form.avatarStyle, form.avatarSeed]);

  if (authLoading || signingOut) {
    return <div className="w-full h-full flex items-center justify-center" data-fill-height><Loader2 className="w-6 h-6 animate-spin text-[var(--text-muted)]" /></div>;
  }
  if (!user) {
    return (
      <div className="w-full h-full flex items-center justify-center px-4" data-fill-height>
        <div className="card-glass rounded-3xl p-8 sm:p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center bg-gradient-to-br from-cyan-500 via-indigo-600 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/30"><UserIcon className="w-8 h-8" /></div>
          <h1 className="text-xl font-extrabold text-[var(--text-primary)] mb-1.5">You&apos;re not signed in</h1>
          <p className="text-sm text-[var(--text-secondary)] mb-6">Sign in to set up your profile and sync your progress across devices.</p>
          <button onClick={() => openAuthModal("login", "/profile")} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md shadow-indigo-500/25 transition-colors">Sign In</button>
        </div>
      </div>
    );
  }

  const f = form;
  const name = f.displayName.trim() || user.email?.split("@")[0] || "Aspirant";
  const branchLabel = BRANCHES.find((b) => b.value === f.targetBranch)?.label.replace(" — Coming Soon", "") ?? f.targetBranch;
  const examDate = examDateFor(Number(f.targetYear) || upcomingYear, f.examDate || null);
  const daysLeft = Math.ceil((new Date(examDate + "T09:00:00").getTime() - Date.now()) / 86_400_000);
  const filled = [f.displayName, f.username, f.bio, f.college, f.degree, f.graduationYear, f.state, f.city, f.aspirantStatus, f.attemptNumber, f.targetRank, f.targetScore, f.studyTime].filter((v) => v !== "" && v !== null && v !== undefined).length;
  const completeness = Math.round(((filled + 1) / 14) * 100);
  const location = [f.city.trim(), f.state].filter(Boolean).join(", ");
  const current = SECTIONS.find((x) => x.id === tab) ?? SECTIONS[0];

  const tabBody = (() => {
    switch (tab) {
      case "personal":
        return (
          <div className="grid grid-cols-1 2xl:grid-cols-5 gap-5 items-start">
            <Card icon={Palette} title="Avatar" subtitle="Pick a style and shuffle until it feels like you." tint="bg-fuchsia-500/10 text-fuchsia-500" className="2xl:col-span-2">
              <AvatarPicker value={{ style: f.avatarStyle as any, seed: f.avatarSeed }} onChange={(v) => setForm((x) => ({ ...x, avatarStyle: v.style, avatarSeed: v.seed }))} />
            </Card>
            <div className="2xl:col-span-3 space-y-5">
              <Card icon={IdCard} title="Identity" subtitle="How you show up across RENYXERA." tint="bg-indigo-500/10 text-indigo-500" delay={0.04}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL}>Display name</label>
                    <input value={f.displayName} onChange={(e) => set("displayName", e.target.value)} maxLength={60} className={INPUT} placeholder="Your name" />
                  </div>
                  <div>
                    <label className={LABEL}>Username</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)]">@</span>
                      <input value={f.username} onChange={(e) => set("username", normalizeUsername(e.target.value))} maxLength={20} autoCapitalize="none" autoCorrect="off" spellCheck={false}
                        aria-invalid={nameStatus.state === "unavailable"} aria-describedby="username-status"
                        className={`${INPUT} pl-8 pr-9 ${nameStatus.state === "unavailable" ? "border-rose-500/60 focus-visible:ring-rose-500" : nameStatus.state === "available" ? "border-emerald-500/60 focus-visible:ring-emerald-500" : ""}`} placeholder="username" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        {nameStatus.state === "checking" && <Loader2 className="w-4 h-4 animate-spin text-[var(--text-muted)]" />}
                        {nameStatus.state === "available" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        {nameStatus.state === "unavailable" && <XCircle className="w-4 h-4 text-rose-500" />}
                      </span>
                    </div>
                    <p id="username-status" aria-live="polite" className={`mt-1.5 text-[11px] font-medium min-h-[16px] ${nameStatus.state === "available" ? "text-emerald-600 dark:text-emerald-400" : nameStatus.state === "unavailable" ? "text-rose-500" : "text-[var(--text-muted)]"}`}>
                      {nameStatus.state === "available" && `@${f.username} is available`}
                      {nameStatus.state === "checking" && "Checking availability…"}
                      {(nameStatus.state === "unavailable" || nameStatus.state === "error") && nameStatus.reason}
                      {nameStatus.state === "idle" && "Lowercase letters, numbers and _ · 3–20 characters"}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={LABEL}><Sparkles className="w-3.5 h-3.5" /> Bio</label>
                    <textarea value={f.bio} onChange={(e) => set("bio", e.target.value.slice(0, 160))} rows={2} className={`${INPUT} resize-none`} placeholder="A line about you — e.g. Final-year CSE, aiming for IISc." />
                    <p className="mt-1 text-right text-[11px] text-[var(--text-muted)] font-num">{f.bio.length}/160</p>
                  </div>
                </div>
              </Card>

              <Card icon={GraduationCap} title="Background" subtitle="Helps us tailor plans and, later, peer comparisons." tint="bg-violet-500/10 text-violet-500" delay={0.08}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL}><UserIcon className="w-3.5 h-3.5" /> I am a</label>
                    <CustomDropdown value={f.aspirantStatus} onChange={(v) => set("aspirantStatus", v)} options={STATUSES} className="w-full text-sm font-medium" />
                  </div>
                  <div>
                    <label className={LABEL}><Hash className="w-3.5 h-3.5" /> GATE attempt</label>
                    <NumberStepper ariaLabel="Which GATE attempt this is" min={1} max={10} value={f.attemptNumber ?? 1} onChange={(v) => set("attemptNumber", v)} />
                  </div>
                  <div>
                    <label className={LABEL}><Building2 className="w-3.5 h-3.5" /> College / university</label>
                    <input value={f.college} onChange={(e) => set("college", e.target.value)} maxLength={120} className={INPUT} placeholder="e.g. NIT Trichy" />
                  </div>
                  <div>
                    <label className={LABEL}><BookOpen className="w-3.5 h-3.5" /> Degree</label>
                    <input value={f.degree} onChange={(e) => set("degree", e.target.value)} maxLength={80} className={INPUT} placeholder="e.g. B.Tech CSE" />
                  </div>
                  <div>
                    <label className={LABEL}><CalendarDays className="w-3.5 h-3.5" /> Graduation year</label>
                    <NumberStepper ariaLabel="Graduation year" min={1990} max={2040} value={f.graduationYear ?? new Date().getFullYear()} onChange={(v) => set("graduationYear", v)} />
                  </div>
                  <div>
                    <label className={LABEL}><MapPin className="w-3.5 h-3.5" /> State</label>
                    <CustomDropdown value={f.state} onChange={(v) => set("state", v)} options={STATES} className="w-full text-sm font-medium" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={LABEL}><MapPin className="w-3.5 h-3.5" /> City</label>
                    <input value={f.city} onChange={(e) => set("city", e.target.value)} maxLength={60} className={INPUT} placeholder="e.g. Hyderabad" />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );
      case "goals":
        return (
          <div className="grid grid-cols-1 2xl:grid-cols-5 gap-5 items-start">
            <div className="2xl:col-span-3 space-y-5">
              <Card icon={Target} title="Target" subtitle="What you're aiming for in this attempt." tint="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL}><GraduationCap className="w-3.5 h-3.5" /> Target branch</label>
                    <CustomDropdown value={f.targetBranch} onChange={(v) => set("targetBranch", v)} options={BRANCHES} className="w-full text-sm font-medium" />
                    <p className="mt-1.5 text-[11px] text-[var(--text-muted)]">Another branch? <a href="/gate-da" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Get notified at launch</a></p>
                  </div>
                  <div>
                    <label className={LABEL}><CalendarDays className="w-3.5 h-3.5" /> Target year</label>
                    <NumberStepper ariaLabel="Target year" min={upcomingYear} max={upcomingYear + 5} value={Number(f.targetYear) || upcomingYear} onChange={(v) => set("targetYear", String(v))} />
                    {yearRolled && Number(f.targetYear) === upcomingYear && <p className="mt-1.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">GATE {profile?.target_year} is over, so we moved you to GATE {upcomingYear}. Save to keep it.</p>}
                  </div>
                  <div>
                    <label className={LABEL}><Trophy className="w-3.5 h-3.5" /> Target rank (AIR, optional)</label>
                    <NumberStepper ariaLabel="Target rank (0 = not set)" min={0} max={100000} step={10} value={Number(f.targetRank) || 0} onChange={(v) => set("targetRank", v > 0 ? String(v) : "")} />
                  </div>
                  <div>
                    <label className={LABEL}><Trophy className="w-3.5 h-3.5" /> Target marks (out of 100, optional)</label>
                    <NumberStepper ariaLabel="Target marks (0 = not set)" min={0} max={100} value={f.targetScore ?? 0} onChange={(v) => set("targetScore", v > 0 ? v : null)} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={LABEL}><CalendarDays className="w-3.5 h-3.5" /> Your exam date (optional)</label>
                    <input type="date" value={f.examDate} min={`${f.targetYear}-01-01`} max={`${f.targetYear}-03-31`} onChange={(e) => set("examDate", e.target.value)} className={`${INPUT} sm:max-w-xs`} />
                    <p className="mt-1.5 text-[11px] text-[var(--text-muted)]">Once your admit card is out, set your exact paper date — the countdown and plan use it. Until then we use GATE&apos;s usual slot ({new Date(examDateFor(Number(f.targetYear) || upcomingYear, null) + "T00:00:00").toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}).</p>
                  </div>
                </div>
              </Card>
              <Card icon={Clock} title="Study schedule" subtitle="Sizes your daily targets and reminders." tint="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" delay={0.05}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={LABEL}><Clock className="w-3.5 h-3.5" /> Hours per study day</label>
                    <NumberStepper ariaLabel="Daily study hours" min={0} max={16} step={0.5} decimals={1} value={Number(f.dailyHours) || 0} onChange={(v) => set("dailyHours", String(v))} />
                  </div>
                  <div>
                    <label className={LABEL}><CalendarDays className="w-3.5 h-3.5" /> Study days per week</label>
                    <div className="grid grid-cols-7 gap-1">
                      {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                        <button key={d} onClick={() => set("studyDays", d)} aria-pressed={f.studyDays === d}
                          className={`h-10 rounded-lg text-sm font-bold cursor-pointer transition-colors ${f.studyDays === d ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-violet-500/25" : "bg-[var(--surface-secondary)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-violet-500/40"}`}>{d}</button>
                      ))}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={LABEL}><CloudMoon className="w-3.5 h-3.5" /> When you study best</label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {STUDY_TIMES.map((t) => (
                        <button key={t.value} onClick={() => set("studyTime", f.studyTime === t.value ? "" : t.value)} aria-pressed={f.studyTime === t.value}
                          className={`h-10 inline-flex items-center justify-center gap-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${f.studyTime === t.value ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-violet-500/25" : "bg-[var(--surface-secondary)] text-[var(--text-secondary)] border border-[var(--border)] hover:border-violet-500/40"}`}>
                          <t.icon className="w-3.5 h-3.5" /> {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="sm:col-span-2 text-[11px] text-[var(--text-muted)]">That&apos;s about <strong className="text-[var(--text-primary)] font-num">{Math.round((Number(f.dailyHours) || 0) * f.studyDays * 10) / 10} hours a week</strong>{daysLeft > 0 ? <> — roughly <strong className="text-[var(--text-primary)] font-num">{Math.round(((Number(f.dailyHours) || 0) * f.studyDays * daysLeft) / 7)}</strong> hours before GATE {f.targetYear}.</> : "."}</p>
                </div>
              </Card>
            </div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="2xl:col-span-2">
              <GoalPlan targetRank={Number(f.targetRank) > 0 ? Number(f.targetRank) : null} targetYear={Number(f.targetYear) || upcomingYear} dailyHours={Number(f.dailyHours) || 0} />
            </motion.div>
          </div>
        );
      case "preferences": return <PreferencesCard />;
      case "security": return <AccountSecurityCard />;
      case "devices": return <DevicesCard />;
      case "data": return <DataStorageCard />;
      default:
        return (
          <div className="space-y-5">
            <StatsAchievements />
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <GoalPlan targetRank={Number(f.targetRank) > 0 ? Number(f.targetRank) : null} targetYear={Number(f.targetYear) || upcomingYear} dailyHours={Number(f.dailyHours) || 0} />
            </motion.div>
          </div>
        );
    }
  })();

  return (
    // Desktop: fixed header + fixed section menu; only the right-hand details scroll.
    <div data-fill-height className="w-full max-w-[1500px] mx-auto flex flex-col gap-4 lg:h-full lg:min-h-0">
      <div className="shrink-0">
        <ProfileHeader name={name} username={f.username} email={user.email} bio={f.bio} tier={profile?.tier || "free"} avatarUri={avatarUri}
          targetYear={f.targetYear} branchLabel={branchLabel} targetRank={f.targetRank} dailyHours={f.dailyHours} location={location}
          daysLeft={daysLeft} completeness={Math.min(100, completeness)} signingOut={signingOut} onSignOut={handleSignOut} studentId={profile?.student_id} />
      </div>

      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4">
        <motion.nav aria-label="Profile sections" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, delay: 0.05 }}
          className="shrink-0 lg:w-60 card-glass rounded-3xl p-2 lg:self-start">
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible scrollbar-hide">
            {SECTIONS.map((sct, i) => {
              const active = sct.id === tab;
              return (
                <motion.button key={sct.id} onClick={() => selectTab(sct.id)} aria-current={active ? "page" : undefined}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + i * 0.03 }}
                  className={`group relative shrink-0 flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-colors cursor-pointer ${active ? "text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]/70"}`}>
                  {active && <motion.span layoutId="profile-tab" transition={{ type: "spring", stiffness: 420, damping: 34 }} className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md shadow-violet-500/30" />}
                  <sct.icon className="relative w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                  <span className="relative whitespace-nowrap">{sct.label}</span>
                  {dirty && (sct.id === "personal" || sct.id === "goals") && <span className="relative ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" title="Unsaved changes" />}
                </motion.button>
              );
            })}
          </div>
        </motion.nav>

        <section id="profile-scroll" className="flex-1 min-w-0 lg:min-h-0 lg:overflow-y-auto custom-scrollbar lg:pr-1 pb-24">
          <div className="mb-4 flex items-center gap-3">
            <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${current.tint}`}><current.icon className="w-5 h-5" /></span>
            <div>
              <h2 className="text-xl font-extrabold text-[var(--text-primary)] leading-tight">{current.label}</h2>
              <p className="text-xs text-[var(--text-secondary)]">{current.subtitle}</p>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 14, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -10, filter: "blur(4px)" }} transition={{ duration: 0.22 }}>
              {tabBody}
            </motion.div>
          </AnimatePresence>
        </section>
      </div>

      {/* Floating save bar — only with unsaved changes (or a result to show) */}
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
              {dirty && <button onClick={resetFromProfile} disabled={saving} className="shrink-0 h-9 px-3 rounded-xl text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer">Discard</button>}
              {(dirty || error) && (
                <button onClick={handleSave} disabled={saving || usernameBlocksSave} className="shrink-0 inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold shadow-md shadow-violet-500/30 disabled:opacity-50 cursor-pointer">
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
