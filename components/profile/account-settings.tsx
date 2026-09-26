"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "next-themes";
import {
  SlidersHorizontal, Sun, Moon, Monitor, Sparkles, Bell, ShieldCheck, Mail, KeyRound, Download,
  Loader2, Trash2, Smartphone, Laptop, LogOut, CheckCircle2, Eye, EyeOff, AlertTriangle,
} from "lucide-react";
import { usePreferencesStore, type MotionPref } from "@/store/use-preferences-store";
import { useAuthStore } from "@/store/use-auth-store";
import { useToastStore } from "@/store/use-toast-store";
import { confirmDialog } from "@/components/ui/confirm-dialog";
import { getDeviceId, isMobileLabel } from "@/lib/devices/device";
import { passwordProblem, friendlyAuthError } from "@/lib/auth-messages";
import { SIGNED_OUT_FLAG } from "@/lib/utils";

function Header({ icon: Icon, title, subtitle, tint }: { icon: typeof Bell; title: string; subtitle: string; tint: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tint}`}><Icon className="w-5 h-5" /></div>
      <div>
        <h2 className="text-base font-extrabold text-[var(--text-primary)] leading-tight">{title}</h2>
        <p className="text-xs text-[var(--text-secondary)]">{subtitle}</p>
      </div>
    </div>
  );
}

function Segmented<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: { value: T; label: string; icon: typeof Sun }[]; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="grid gap-1 p-1 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)]" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button key={o.value} role="radio" aria-checked={active} onClick={() => onChange(o.value)}
            className={`relative inline-flex items-center justify-center gap-1.5 h-9 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${active ? "text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
            {active && <motion.span layoutId={`seg-${label}`} className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md shadow-violet-500/25" />}
            <o.icon className="relative w-3.5 h-3.5" /><span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}
      className={`relative w-11 h-6 shrink-0 rounded-full transition-colors cursor-pointer ${on ? "bg-gradient-to-r from-indigo-600 to-violet-600" : "bg-[var(--surface-secondary)] border border-[var(--border)]"}`}>
      <motion.span layout transition={{ type: "spring", stiffness: 500, damping: 30 }} className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow ${on ? "right-0.5" : "left-0.5"}`} />
    </button>
  );
}

const ago = (iso: string) => {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 90) return "Active now";
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  return `${Math.round(s / 86400)} days ago`;
};

interface Device { id: string; device_id: string; label: string; created_at: string; last_seen_at: string; current: boolean }

async function supabaseClient() {
  const { createClient } = await import("@/lib/supabase/client");
  return createClient();
}

export function PreferencesCard() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { motion: motionPref, setMotion, reminders, setReminders } = usePreferencesStore();
  const toast = useToastStore((s) => s.show);
  useEffect(() => setMounted(true), []);

  const toggleReminders = async (on: boolean) => {
    if (on && typeof Notification !== "undefined" && Notification.permission !== "granted") {
      const { requestNotificationPermission } = await import("@/lib/notifications/reminder-scheduler");
      if (!(await requestNotificationPermission())) {
        toast("Notifications are blocked in your browser settings for this site.", "error");
        return;
      }
    }
    setReminders(on);
  };


  return (
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="card-glass rounded-3xl p-6 flex flex-col">
        <Header icon={SlidersHorizontal} title="Preferences" subtitle="How RENYXERA looks and behaves on this device." tint="bg-violet-500/10 text-violet-500" />
        <div className="space-y-5">
          <div>
            <p className="text-xs font-bold text-[var(--text-secondary)] mb-2">Theme</p>
            {mounted && (
              <Segmented label="Theme" value={(theme as "light" | "dark" | "system") ?? "system"} onChange={setTheme}
                options={[{ value: "light", label: "Light", icon: Sun }, { value: "dark", label: "Dark", icon: Moon }, { value: "system", label: "System", icon: Monitor }]} />
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--text-secondary)] mb-2">Motion</p>
            <Segmented<MotionPref> label="Motion" value={motionPref} onChange={setMotion}
              options={[{ value: "system", label: "System", icon: Monitor }, { value: "reduce", label: "Reduced", icon: Eye }, { value: "full", label: "Full", icon: Sparkles }]} />
            <p className="mt-1.5 text-[11px] text-[var(--text-muted)]">Reduced turns off animations — easier on the eyes and on older phones.</p>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-[var(--surface-secondary)]/50 p-3.5">
            <div className="flex items-start gap-3 min-w-0">
              <span className="w-8 h-8 shrink-0 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center"><Bell className="w-4 h-4" /></span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--text-primary)]">Study reminders</p>
                <p className="text-[11px] text-[var(--text-muted)]">Notifications for planner events that have a reminder set.</p>
              </div>
            </div>
            <Toggle label="Study reminders" on={reminders} onChange={toggleReminders} />
          </div>
        </div>
      </motion.section>

  );
}

export function AccountSecurityCard() {
  const user = useAuthStore((s) => s.user);
  const toast = useToastStore((s) => s.show);
  const { theme } = useTheme();
  const { motion: motionPref, reminders } = usePreferencesStore();
  const [providers, setProviders] = useState<string[] | null>(null);
  const [pw, setPw] = useState({ next: "", confirm: "", show: false, saving: false, error: "", done: false });
  const [exporting, setExporting] = useState(false);
  const studentId = useAuthStore((s) => s.profile?.student_id);
  const [meta, setMeta] = useState<{ created?: string; lastSignIn?: string; verified: boolean } | null>(null);
  const [del, setDel] = useState({ open: false, email: "", busy: false, error: "" });
  useEffect(() => {
    if (!user) return;
    supabaseClient().then((sb) => sb.auth.getUser()).then(({ data }) => {
      const list = (data.user?.identities ?? []).map((i) => i.provider);
      setProviders(list.length ? [...new Set(list)] : ["email"]);
      setMeta({ created: data.user?.created_at, lastSignIn: data.user?.last_sign_in_at, verified: !!data.user?.email_confirmed_at });
    }).catch(() => setProviders([]));
  }, [user]);

  const deleteAccount = async () => {
    setDel((d) => ({ ...d, busy: true, error: "" }));
    try {
      const res = await fetch("/api/account/delete", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ confirmEmail: del.email }) });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) return setDel((d) => ({ ...d, busy: false, error: j.error || "Couldn't delete your account." }));
      // Account is gone: clear this device and leave.
      const uid = user!.id;
      try { const { wipeVault } = await import("@/lib/vault/vault"); await wipeVault(uid); } catch {}
      try { indexedDB.deleteDatabase(`GatePrepOS_DB__${uid}`); } catch {}
      try { await (await supabaseClient()).auth.signOut({ scope: "local" }); } catch {}
      window.location.replace("/");
    } catch {
      setDel((d) => ({ ...d, busy: false, error: "You seem to be offline. Please try again." }));
    }
  };

  const changePassword = async () => {
    const problem = passwordProblem(pw.next, true);
    if (problem) return setPw((p) => ({ ...p, error: problem }));
    if (pw.next !== pw.confirm) return setPw((p) => ({ ...p, error: "The two passwords don't match." }));
    setPw((p) => ({ ...p, saving: true, error: "" }));
    const { error } = await (await supabaseClient()).auth.updateUser({ password: pw.next });
    if (error) return setPw((p) => ({ ...p, saving: false, error: friendlyAuthError(error.message) }));
    setPw({ next: "", confirm: "", show: false, saving: false, error: "", done: true });
    toast("Password updated", "success");
  };

  const exportData = async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/account/export");
      const server = res.ok ? await res.json() : { error: "Server data unavailable right now" };
      const { IDBManager } = await import("@/lib/repository/storage/idb-manager");
      const safe = async <T,>(f: () => Promise<T>, d: T) => { try { return await f(); } catch { return d; } };
      const local = {
        testHistory: (await safe(() => IDBManager.getAllExamSessions(), [])).map((r) => r.sessionData),
        bookmarks: await safe(() => IDBManager.getAllBookmarks(), []),
        mistakes: await safe(() => IDBManager.getAllMistakes(), []),
        calendar: await safe(() => IDBManager.getCalendarEvents(), []),
        todos: await safe(() => IDBManager.getTodoItems(), []),
        customTests: await safe(() => IDBManager.getAllCustomTemplates(), []),
        preferences: { theme, motion: motionPref, reminders },
      };
      const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), app: "RENYXERA", server, thisDevice: local }, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `renyxera-my-data-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      toast("Your data export is downloading", "success");
    } catch {
      toast("Couldn't export your data. Please try again.", "error");
    } finally {
      setExporting(false);
    }
  };

  if (!user) return null;
  const hasPassword = providers?.includes("email");
  const inputCls = "w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 pr-10 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500";

  return (
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="card-glass rounded-3xl p-6 flex flex-col">
        <Header icon={ShieldCheck} title="Account & security" subtitle="Your sign-in details and your data." tint="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" />
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-3 rounded-2xl bg-[var(--surface-secondary)]/50 p-3.5">
            <Mail className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{user.email}</p>
              <div className="flex gap-1.5 mt-1 flex-wrap">
                {providers === null ? <Loader2 className="w-3 h-3 animate-spin text-[var(--text-muted)]" /> : providers.map((p) => (
                  <span key={p} className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">{p === "email" ? "Email & password" : p}</span>
                ))}
              </div>
            </div>
          </div>

          {providers !== null && (hasPassword ? (
            <div>
              <p className="text-xs font-bold text-[var(--text-secondary)] mb-2 flex items-center gap-1.5"><KeyRound className="w-3.5 h-3.5" /> Change password</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="relative">
                  <input type={pw.show ? "text" : "password"} autoComplete="new-password" value={pw.next} onChange={(e) => setPw((p) => ({ ...p, next: e.target.value, error: "", done: false }))} placeholder="New password" aria-label="New password" className={inputCls} />
                  <button type="button" onClick={() => setPw((p) => ({ ...p, show: !p.show }))} aria-label={pw.show ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer">
                    {pw.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <input type={pw.show ? "text" : "password"} autoComplete="new-password" value={pw.confirm} onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value, error: "", done: false }))} placeholder="Confirm new password" aria-label="Confirm new password" className={inputCls} />
              </div>
              {pw.error && <p role="alert" className="mt-1.5 text-[11px] font-medium text-rose-500">{pw.error}</p>}
              {pw.done && <p className="mt-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Password updated</p>}
              <button onClick={changePassword} disabled={pw.saving || !pw.next || !pw.confirm}
                className="mt-2.5 inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold cursor-pointer">
                {pw.saving && <Loader2 className="w-4 h-4 animate-spin" />} Update password
              </button>
            </div>
          ) : (
            <p className="text-[11px] text-[var(--text-muted)]">You sign in with {providers.join(", ") || "a linked account"}, so there's no password to manage here.</p>
          ))}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { label: "Student ID", value: studentId || "—" },
              { label: "Member since", value: meta?.created ? new Date(meta.created).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—" },
              { label: "Last sign-in", value: meta?.lastSignIn ? new Date(meta.lastSignIn).toLocaleString(undefined, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—" },
              { label: "Email", value: meta ? (meta.verified ? "Verified" : "Not verified") : "—" },
            ].map((m) => (
              <div key={m.label} className="rounded-xl bg-[var(--surface-secondary)]/50 px-3 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{m.label}</p>
                <p className={`mt-0.5 text-sm font-semibold ${m.value === "Verified" ? "text-emerald-600 dark:text-emerald-400" : m.value === "Not verified" ? "text-amber-600 dark:text-amber-400" : "text-[var(--text-primary)]"}`}>{m.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-[var(--border)] p-3.5 flex items-center gap-3">
            <Download className="w-4 h-4 text-violet-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)]">Export my data</p>
              <p className="text-[11px] text-[var(--text-muted)]">Profile, saved tests, bookmarks, mistakes and planner as a JSON file.</p>
            </div>
            <button onClick={exportData} disabled={exporting} className="shrink-0 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] text-sm font-semibold text-[var(--text-primary)] hover:border-violet-500/50 disabled:opacity-60 cursor-pointer">
              {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Export
            </button>
          </div>

          {/* Danger zone */}
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-3.5">
            <div className="flex items-center gap-3">
              <Trash2 className="w-4 h-4 text-rose-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--text-primary)]">Delete my account</p>
                <p className="text-[11px] text-[var(--text-muted)]">Permanently deletes your account, profile, saved tests and devices. This can&apos;t be undone.</p>
              </div>
              {!del.open && (
                <button onClick={() => setDel({ open: true, email: "", busy: false, error: "" })} className="shrink-0 h-9 px-3.5 rounded-xl border border-rose-500/40 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 cursor-pointer">Delete…</button>
              )}
            </div>
            <AnimatePresence>
              {del.open && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <p className="mt-3 text-xs text-[var(--text-secondary)]">Type <strong className="text-[var(--text-primary)]">{user.email}</strong> to confirm. Export your data first if you want to keep it.</p>
                  <div className="mt-2 flex flex-col sm:flex-row gap-2">
                    <input value={del.email} onChange={(e) => setDel((d) => ({ ...d, email: e.target.value, error: "" }))} placeholder="your@email.com" aria-label="Type your email to confirm" autoComplete="off"
                      className="flex-1 h-9 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500" />
                    <button onClick={() => setDel({ open: false, email: "", busy: false, error: "" })} className="h-9 px-3 rounded-xl text-sm font-semibold text-[var(--text-secondary)] cursor-pointer">Cancel</button>
                    <button onClick={deleteAccount} disabled={del.busy || del.email.trim().toLowerCase() !== (user.email ?? "").toLowerCase()}
                      className="h-9 px-4 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white text-sm font-semibold disabled:opacity-40 cursor-pointer">
                      {del.busy && <Loader2 className="w-4 h-4 animate-spin" />} Delete forever
                    </button>
                  </div>
                  {del.error && <p role="alert" className="mt-1.5 text-[11px] font-medium text-rose-500">{del.error}</p>}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.section>

  );
}

export function DevicesCard() {
  const user = useAuthStore((s) => s.user);
  const toast = useToastStore((s) => s.show);
  const [devices, setDevices] = useState<Device[] | null>(null);
  const [devicesError, setDevicesError] = useState(false);
  const [busyDevice, setBusyDevice] = useState<string | null>(null);
  const loadDevices = useCallback(async () => {
    try {
      const res = await fetch("/api/devices");
      if (!res.ok) throw new Error();
      const j = (await res.json()) as { devices: Device[] };
      const mine = getDeviceId();
      setDevices(j.devices.map((d) => ({ ...d, current: d.current || d.device_id === mine })));
      setDevicesError(false);
    } catch {
      setDevicesError(true);
    }
  }, []);
  useEffect(() => { if (user) void loadDevices(); }, [user, loadDevices]);

  const signOutDevice = async (d: Device) => {
    if (!(await confirmDialog({ title: `Sign out ${d.label}?`, message: "That device will be signed out within a few minutes, and its offline downloads will be removed.", confirmLabel: "Sign out device", tone: "danger", icon: "leave" }))) return;
    setBusyDevice(d.id);
    const res = await fetch("/api/devices", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "revoke", id: d.id }) }).catch(() => null);
    setBusyDevice(null);
    if (!res?.ok) return toast("Couldn't sign that device out. Try again.", "error");
    toast(`${d.label} signed out`, "success");
    void loadDevices();
  };

  const signOutOthers = async (everywhere: boolean) => {
    const ok = await confirmDialog(everywhere
      ? { title: "Sign out everywhere?", message: "You'll be signed out on every device, including this one.", confirmLabel: "Sign out everywhere", tone: "danger", icon: "leave" }
      : { title: "Sign out all other devices?", message: "Every other device will be signed out. You'll stay signed in here.", confirmLabel: "Sign out others", tone: "danger", icon: "leave" });
    if (!ok) return;
    setBusyDevice(everywhere ? "__all" : "__others");
    await fetch("/api/devices", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "revoke_others", device_id: getDeviceId() }) }).catch(() => null);
    const sb = await supabaseClient();
    if (everywhere) {
      sessionStorage.setItem(SIGNED_OUT_FLAG, "everywhere");
      await sb.auth.signOut({ scope: "global" }).catch(() => sb.auth.signOut({ scope: "local" }));
      return; // AuthListener wipes local data and redirects
    }
    await sb.auth.signOut({ scope: "others" }).catch(() => {});
    setBusyDevice(null);
    toast("Signed out of all other devices", "success");
    void loadDevices();
  };

  if (!user) return null;
  return (
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="card-glass rounded-3xl p-6">
        <Header icon={Laptop} title="Active devices" subtitle="Where your account is signed in. Sign out anything you don't recognise." tint="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" />
        {devicesError ? (
          <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-xs text-amber-800 dark:text-amber-200">
            <AlertTriangle className="w-4 h-4 shrink-0" /> Couldn't load your devices right now.
            <button onClick={loadDevices} className="ml-auto font-bold underline cursor-pointer">Retry</button>
          </div>
        ) : devices === null ? (
          <div className="py-6 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-[var(--text-muted)]" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {devices.length === 0 && <p className="text-sm text-[var(--text-muted)]">No devices recorded yet.</p>}
            {devices.map((d) => (
              <div key={d.id} className={`flex items-center gap-3 rounded-2xl border p-3.5 ${d.current ? "border-emerald-500/30 bg-emerald-500/5" : "border-[var(--border)]"}`}>
                <span className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center ${d.current ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-[var(--surface-secondary)] text-[var(--text-secondary)]"}`}>
                  {isMobileLabel(d.label) ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                    {d.label} {d.current && <span className="ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 align-middle">This device</span>}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">{d.current ? "Active now" : ago(d.last_seen_at)} · first seen {new Date(d.created_at).toLocaleDateString()}</p>
                </div>
                {!d.current && (
                  <button onClick={() => signOutDevice(d)} disabled={busyDevice === d.id} aria-label={`Sign out ${d.label}`} className="shrink-0 inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-[var(--border)] text-xs font-semibold text-[var(--text-secondary)] hover:text-rose-500 hover:border-rose-500/40 disabled:opacity-50 cursor-pointer">
                    {busyDevice === d.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5" />} Sign out
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="mt-5 pt-4 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row gap-2.5 sm:justify-end">
          <button onClick={() => signOutOthers(false)} disabled={!!busyDevice} className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] text-sm font-semibold text-[var(--text-primary)] hover:border-rose-500/40 disabled:opacity-50 cursor-pointer">
            {busyDevice === "__others" ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />} Sign out other devices
          </button>
          <button onClick={() => signOutOthers(true)} disabled={!!busyDevice} className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white text-sm font-semibold shadow-md shadow-rose-500/25 disabled:opacity-50 cursor-pointer">
            {busyDevice === "__all" ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />} Sign out everywhere
          </button>
        </div>
      </motion.section>
  );
}
