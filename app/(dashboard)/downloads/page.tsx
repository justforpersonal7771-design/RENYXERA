"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Download, CheckCircle2, Trash2, Loader2, ShieldCheck, WifiOff, FileText, Layers, Eye, HardDrive, KeyRound, AlertTriangle } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { useDataStore } from "@/store/use-data-store";
import { useToastStore } from "@/store/use-toast-store";
import { QuestionRepository } from "@/lib/repository/question-repository";
import { confirmDialog } from "@/components/ui/confirm-dialog";
import type { AnswerKey } from "@/lib/repository/answer-keys";
import { getVaultKey, listPacks, removePack, savePack, type PackMeta } from "@/lib/vault/vault";

interface PackDef { id: string; title: string; kind: "paper" | "subject"; questionIds: string[] }

async function fetchKeys(ids: string[], onProgress: (done: number) => void): Promise<Record<string, AnswerKey>> {
  const out: Record<string, AnswerKey> = {};
  for (let i = 0; i < ids.length; i += 100) {
    const res = await fetch("/api/answers", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question_ids: ids.slice(i, i + 100) }),
    });
    if (res.status === 429) throw new Error("You're downloading too fast. Wait a minute and try again.");
    if (!res.ok) throw new Error("Couldn't download this pack. Check your connection and try again.");
    Object.assign(out, ((await res.json()) as { answers: Record<string, AnswerKey> }).answers);
    onProgress(Math.min(ids.length, i + 100));
  }
  return out;
}

const fmtBytes = (n: number) => (n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(0)} KB` : `${(n / 1048576).toFixed(1)} MB`);

export default function DownloadsPage() {
  const user = useAuthStore((s) => s.user);
  const authLoading = useAuthStore((s) => s.loading);
  const repoReady = useDataStore((s) => s.isInitialized);
  const toast = useToastStore((s) => s.show);

  const [saved, setSaved] = useState<PackMeta[] | null>(null);
  const [keyInfo, setKeyInfo] = useState<{ expiresAt?: number; error?: string } | null>(null);
  const [busy, setBusy] = useState<Record<string, number>>({}); // pack id -> % progress
  const [tab, setTab] = useState<"paper" | "subject">("paper");
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine !== false);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => { window.removeEventListener("online", update); window.removeEventListener("offline", update); };
  }, []);

  const refresh = useCallback(async () => {
    if (!user) return;
    const [packs, k] = await Promise.all([listPacks(user.id).catch(() => []), getVaultKey(user.id)]);
    setSaved(packs);
    setKeyInfo("key" in k ? { expiresAt: k.expiresAt } : { error: k.error });
  }, [user]);

  useEffect(() => { void refresh(); }, [refresh, online]);

  const packs = useMemo<PackDef[]>(() => {
    if (!repoReady) return [];
    const all = QuestionRepository.getAllQuestions().filter((q) => /^GATE_/.test(q.question_id));
    const group = (kind: "paper" | "subject", keyOf: (q: (typeof all)[number]) => string, title: (k: string) => string) => {
      const m = new Map<string, string[]>();
      for (const q of all) {
        const k = keyOf(q);
        if (!k) continue;
        if (!m.has(k)) m.set(k, []);
        m.get(k)!.push(q.question_id);
      }
      return [...m.entries()].map(([k, ids]) => ({ id: `${kind}:${k}`, title: title(k), kind, questionIds: ids }));
    };
    const papers = group("paper", (q) => q.year_shift, (k) => `GATE CS ${k.replace("-", " · ")}`)
      .sort((a, b) => b.title.localeCompare(a.title));
    const subjects = group("subject", (q) => q.subject, (k) => k).sort((a, b) => a.title.localeCompare(b.title));
    return [...papers, ...subjects];
  }, [repoReady]);

  const savedById = useMemo(() => new Map((saved ?? []).map((p) => [p.id, p])), [saved]);
  const totalBytes = (saved ?? []).reduce((n, p) => n + p.bytes, 0);

  const download = async (p: PackDef) => {
    if (!user || busy[p.id] !== undefined) return;
    if (!online) return toast("You're offline — connect to download.", "error");
    setBusy((b) => ({ ...b, [p.id]: 0 }));
    try {
      const k = await getVaultKey(user.id);
      if (!("key" in k)) throw new Error("Couldn't unlock downloads. Sign in again and retry.");
      const answers = await fetchKeys(p.questionIds, (done) =>
        setBusy((b) => ({ ...b, [p.id]: Math.round((done / p.questionIds.length) * 90) }))
      );
      await savePack(user.id, k.key, { id: p.id, title: p.title, kind: p.kind, questionCount: p.questionIds.length },
        { id: p.id, title: p.title, questionIds: p.questionIds, answers });
      toast(`${p.title} is available offline.`, "success");
      await refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Download failed.", "error");
    } finally {
      setBusy((b) => { const n = { ...b }; delete n[p.id]; return n; });
    }
  };

  const remove = async (p: PackMeta) => {
    if (!user) return;
    const ok = await confirmDialog({ title: "Remove this download?", message: `${p.title} will no longer be available offline on this device.`, confirmLabel: "Remove", tone: "danger" });
    if (!ok) return;
    await removePack(user.id, p.id);
    await refresh();
  };

  if (authLoading || (user && (!repoReady || saved === null))) {
    return <div className="flex h-full items-center justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-violet-500" /></div>;
  }
  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-24">
        <ShieldCheck className="w-10 h-10 mx-auto text-violet-500 mb-3" />
        <h1 className="text-lg font-bold text-[var(--text-primary)]">Sign in to use Downloads</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Offline packs are tied to your account and protected on this device.</p>
      </div>
    );
  }

  const visible = packs.filter((p) => p.kind === tab);
  const expiresIn = keyInfo?.expiresAt ? Math.max(0, Math.ceil((keyInfo.expiresAt - Date.now()) / 86_400_000)) : null;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-5 pb-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-violet-500/15 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Download className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-[var(--text-primary)]">Downloads</h1>
            <p className="text-sm text-[var(--text-secondary)]">Study papers and subjects offline, with answers. Packs stay encrypted on this device and open only inside RENYXERA.</p>
          </div>
        </div>
        <div className="relative mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="flex items-center gap-2 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] px-3 py-2.5">
            <HardDrive className="w-4 h-4 text-violet-500 shrink-0" />
            <span className="text-[var(--text-secondary)]"><b className="text-[var(--text-primary)]">{saved?.length ?? 0}</b> packs · {fmtBytes(totalBytes)}</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] px-3 py-2.5">
            <KeyRound className={`w-4 h-4 shrink-0 ${keyInfo?.error ? "text-amber-500" : "text-emerald-500"}`} />
            <span className="text-[var(--text-secondary)]">
              {keyInfo?.error === "offline-expired" ? "Offline access expired — connect to renew"
                : keyInfo?.error ? "Offline access needs a connection"
                : expiresIn !== null ? <>Offline access for <b className="text-[var(--text-primary)]">{expiresIn} days</b></> : "Checking…"}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border-subtle)] px-3 py-2.5">
            <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
            <span className="text-[var(--text-secondary)]">Watermarked to your account · no export</span>
          </div>
        </div>
        {!online && (
          <div className="relative mt-3 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
            <WifiOff className="w-4 h-4 shrink-0" /> You're offline. Your downloaded packs still open; new downloads need a connection.
          </div>
        )}
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] self-start">
        {([["paper", "Papers", FileText], ["subject", "Subjects", Layers]] as const).map(([k, label, Icon]) => (
          <button key={k} onClick={() => setTab(k)} className={`relative inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold cursor-pointer transition-colors ${tab === k ? "text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
            {tab === k && <motion.span layoutId="dl-tab" className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md shadow-violet-500/30" />}
            <Icon className="relative w-4 h-4" /><span className="relative">{label}</span>
          </button>
        ))}
      </div>

      {/* Pack list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <AnimatePresence initial={false}>
          {visible.map((p, i) => {
            const s = savedById.get(p.id);
            const progress = busy[p.id];
            const stale = s && s.questionCount !== p.questionIds.length;
            return (
              <motion.div key={p.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.02, 0.3) }}
                className={`relative overflow-hidden rounded-2xl border p-4 bg-[var(--surface)] ${s ? "border-emerald-500/30" : "border-[var(--border)]"}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${s ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-[var(--surface-secondary)] text-[var(--text-muted)]"}`}>
                    {s ? <CheckCircle2 className="w-5 h-5" /> : p.kind === "paper" ? <FileText className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[var(--text-primary)] truncate" title={p.title}>{p.title}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {p.questionIds.length} questions
                      {s && <> · {fmtBytes(s.bytes)} · saved {new Date(s.savedAt).toLocaleDateString()}</>}
                    </p>
                    {stale && <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400"><AlertTriangle className="w-3 h-3" /> Updated questions available — download again</p>}
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  {progress !== undefined ? (
                    <div className="flex-1 h-9 rounded-xl bg-[var(--surface-secondary)] overflow-hidden relative">
                      <motion.div className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-violet-600" animate={{ width: `${Math.max(progress, 6)}%` }} />
                      <span className="relative z-10 flex h-full items-center justify-center gap-1.5 text-xs font-semibold text-[var(--text-primary)]"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Downloading…</span>
                    </div>
                  ) : s ? (
                    <>
                      <Link href={`/downloads/view?pack=${encodeURIComponent(p.id)}`} className="flex-1 h-9 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold shadow-md shadow-violet-500/25">
                        <Eye className="w-4 h-4" /> Open
                      </Link>
                      {stale && (
                        <button onClick={() => download(p)} className="h-9 px-3 rounded-xl border border-[var(--border)] text-sm font-semibold text-[var(--text-primary)] hover:border-violet-500/50 cursor-pointer">Update</button>
                      )}
                      <button onClick={() => remove(s)} aria-label={`Remove ${p.title}`} className="h-9 w-9 inline-flex items-center justify-center rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:text-rose-500 hover:border-rose-500/40 cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button onClick={() => download(p)} disabled={!online} className="flex-1 h-9 inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] text-sm font-semibold text-[var(--text-primary)] hover:border-violet-500/50 disabled:opacity-50 cursor-pointer">
                      <Download className="w-4 h-4" /> Download
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      {visible.length === 0 && (
        <p className="text-center text-sm text-[var(--text-muted)] py-10">No {tab === "paper" ? "papers" : "subjects"} available yet.</p>
      )}
    </div>
  );
}
