"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Loader2, Save, LogOut, CheckCircle2, User as UserIcon } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { AvatarPicker, type AvatarValue } from "@/components/profile/avatar-picker";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { isAvatarStyleId } from "@/lib/avatar/dicebear-styles";
import { randomAvatarSeed } from "@/lib/avatar/generate-avatar";

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

  // Seed local form state from the loaded profile once it arrives.
  useEffect(() => {
    if (!profile) return;
    setAvatar({
      style: isAvatarStyleId(profile.avatar_style) ? profile.avatar_style : "adventurer",
      seed: profile.avatar_seed,
    });
    setDisplayName(profile.display_name || "");
    setUsername(profile.username || "");
    setTargetBranch(profile.target_branch || "CSE");
    setTargetYear(profile.target_year ? String(profile.target_year) : "2027");
    setTargetRank(profile.target_rank ? String(profile.target_rank) : "");
    setDailyHours(profile.daily_study_hours ? String(profile.daily_study_hours) : "2");
  }, [profile]);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName.trim() || null,
          username: username.trim() || null,
          avatar_seed: avatar.seed,
          avatar_style: avatar.style,
          target_branch: targetBranch,
          target_year: targetYear ? Number(targetYear) : null,
          target_rank: targetRank ? Number(targetRank) : null,
          daily_study_hours: dailyHours ? Number(dailyHours) : 2,
        })
        .eq("id", user.id);
      if (error) {
        setError(error.message);
        return;
      }
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
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.auth.signOut();
      // AuthListener's onAuthStateChange handler switches the IndexedDB namespace back
      // to guest, resets every store, and reloads — nothing else to do here.
    } catch {
      setSigningOut(false);
    }
  }

  if (authLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--text-muted)]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-center px-4">
        <UserIcon className="w-10 h-10 text-[var(--text-muted)]" />
        <div>
          <h1 className="text-lg font-bold text-[var(--text-primary)] mb-1">You're not signed in</h1>
          <p className="text-sm text-[var(--text-secondary)]">Sign in to set up your profile and sync your progress.</p>
        </div>
        <Link
          href="/login?redirect=/profile"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-2xl mx-auto px-1 py-2 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">Profile</h1>
            <p className="text-sm font-medium text-[var(--text-secondary)]">{user.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-[var(--text-secondary)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
          >
            {signingOut ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />}
            Sign Out
          </button>
        </motion.div>

        <div className="card-glass rounded-2xl p-5 space-y-3">
          <h2 className="text-sm font-black uppercase tracking-wider text-[var(--text-muted)]">Avatar</h2>
          <AvatarPicker value={avatar} onChange={setAvatar} />
        </div>

        <div className="card-glass rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-[var(--text-muted)]">Identity</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5">Display Name</label>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={60}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                maxLength={24}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                placeholder="username"
              />
            </div>
          </div>
        </div>

        <div className="card-glass rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-[var(--text-muted)]">Exam Goals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5">Target Branch</label>
              <CustomDropdown value={targetBranch} onChange={setTargetBranch} options={BRANCHES} className="w-full text-sm font-medium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5">Target Year</label>
              <input
                type="number"
                value={targetYear}
                onChange={(e) => setTargetYear(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5">Target Rank (optional)</label>
              <input
                type="number"
                value={targetRank}
                onChange={(e) => setTargetRank(e.target.value)}
                placeholder="e.g. 500"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5">Daily Study Hours</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={dailyHours}
                onChange={(e) => setDailyHours(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              />
            </div>
          </div>
        </div>

        {error && (
          <div role="alert" className="flex items-center gap-2 text-xs font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-sm transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500">
              <CheckCircle2 className="w-4 h-4" /> Saved
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
