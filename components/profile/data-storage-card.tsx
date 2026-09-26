"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { HardDrive, Download, Trash2, RotateCcw, Loader2, Database, WifiOff, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { useToastStore } from "@/store/use-toast-store";
import { confirmDialog } from "@/components/ui/confirm-dialog";

const fmt = (n: number) => (n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(0)} KB` : n < 1073741824 ? `${(n / 1048576).toFixed(1)} MB` : `${(n / 1073741824).toFixed(2)} GB`);

/** Profile → Data & storage: what this device holds, and the tools to clean it up. */
export function DataStorageCard() {
  const user = useAuthStore((s) => s.user);
  const toast = useToastStore((s) => s.show);
  const [usage, setUsage] = useState<{ used: number; quota: number } | null>(null);
  const [packs, setPacks] = useState<{ count: number; bytes: number } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const e = await navigator.storage?.estimate?.();
      if (e) setUsage({ used: e.usage ?? 0, quota: e.quota ?? 0 });
    } catch {}
    if (user) {
      try {
        const { listPacks } = await import("@/lib/vault/vault");
        const list = await listPacks(user.id);
        setPacks({ count: list.length, bytes: list.reduce((n, p) => n + p.bytes, 0) });
      } catch { setPacks({ count: 0, bytes: 0 }); }
    }
  }, [user]);
  useEffect(() => { void refresh(); }, [refresh]);

  const clearOfflineCache = async () => {
    if (!(await confirmDialog({ title: "Clear the offline cache?", message: "Saved copies of app pages are removed. Your study data and downloads stay. The app re-caches as you use it.", confirmLabel: "Clear cache" }))) return;
    setBusy("cache");
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      toast("Offline cache cleared", "success");
    } catch { toast("Couldn't clear the cache", "error"); }
    setBusy(null);
    void refresh();
  };

  const hardReset = async () => {
    if (!(await confirmDialog({ title: "Hard reset this device?", message: "Everything stored on this device is erased — study history not yet synced, bookmarks, mistakes, downloads, preferences and caches — and you'll be signed out here. Your account on the server is not affected.", confirmLabel: "Reset this device", tone: "danger" }))) return;
    setBusy("reset");
    const { hardResetDevice } = await import("@/lib/hard-reset");
    await hardResetDevice().catch(() => { setBusy(null); toast("Reset failed — try again", "error"); });
  };

  const pct = usage && usage.quota ? Math.min(100, (usage.used / usage.quota) * 100) : 0;

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card-glass rounded-3xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl bg-[var(--surface-secondary)]/50 p-4">
            <p className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)]"><HardDrive className="w-4 h-4 text-violet-500" /> Used on this device</p>
            <p className="mt-2 text-2xl font-extrabold font-num text-[var(--text-primary)]">{usage ? fmt(usage.used) : "—"}</p>
            <div className="mt-2 h-1.5 rounded-full bg-[var(--surface-secondary)] overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-indigo-500 to-violet-600" initial={{ width: 0 }} animate={{ width: `${Math.max(pct, 1)}%` }} transition={{ duration: 0.8 }} />
            </div>
            <p className="mt-1 text-[11px] text-[var(--text-muted)]">{usage?.quota ? `of ${fmt(usage.quota)} available to the app` : "Estimate not available in this browser"}</p>
          </div>
          <div className="rounded-2xl bg-[var(--surface-secondary)]/50 p-4">
            <p className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)]"><Download className="w-4 h-4 text-indigo-500" /> Offline downloads</p>
            <p className="mt-2 text-2xl font-extrabold font-num text-[var(--text-primary)]">{packs ? packs.count : "—"}</p>
            <p className="mt-1 text-[11px] text-[var(--text-muted)]">{packs ? `${fmt(packs.bytes)} · encrypted` : "…"}</p>
            <Link href="/downloads" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 group">Manage <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" /></Link>
          </div>
          <div className="rounded-2xl bg-[var(--surface-secondary)]/50 p-4">
            <p className="flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)]"><Database className="w-4 h-4 text-emerald-500" /> Where your data lives</p>
            <p className="mt-2 text-[12px] leading-relaxed text-[var(--text-secondary)]">Account, goals and graded tests are saved to your account. History, bookmarks and mistakes are kept on this device and work offline.</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card-glass rounded-3xl p-6 space-y-3">
        <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] p-4">
          <WifiOff className="w-5 h-5 text-sky-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--text-primary)]">Clear offline cache</p>
            <p className="text-[11px] text-[var(--text-muted)]">Fixes a page that looks stuck or out of date. Keeps your data and downloads.</p>
          </div>
          <button onClick={clearOfflineCache} disabled={!!busy} className="shrink-0 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] text-sm font-semibold text-[var(--text-primary)] hover:border-sky-500/50 disabled:opacity-50 cursor-pointer">
            {busy === "cache" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Clear
          </button>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4">
          <RotateCcw className="w-5 h-5 text-rose-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[var(--text-primary)]">Hard reset this device</p>
            <p className="text-[11px] text-[var(--text-muted)]">Erases everything RENYXERA stored in this browser and starts fresh. Your account is kept.</p>
          </div>
          <button onClick={hardReset} disabled={!!busy} className="shrink-0 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white text-sm font-semibold shadow-md shadow-rose-500/25 disabled:opacity-50 cursor-pointer">
            {busy === "reset" ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />} Reset
          </button>
        </div>
      </motion.div>
    </div>
  );
}
