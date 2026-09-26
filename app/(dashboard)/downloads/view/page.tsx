"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ChevronLeft, ChevronRight, Eye, EyeOff, Loader2, Lock, ShieldCheck, WifiOff } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { useDataStore } from "@/store/use-data-store";
import { QuestionRepository } from "@/lib/repository/question-repository";
import { AstNodeRenderer } from "@/components/exam/ast-node-renderer";
import { getVaultKey, openPack, type PackContent } from "@/lib/vault/vault";

const escapeXml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!);

/** Tiled diagonal watermark naming the account — makes any leaked capture traceable. */
function watermarkUrl(text: string, dark: boolean) {
  const fill = dark ? "rgba(255,255,255,0.075)" : "rgba(30,27,75,0.07)";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="200"><text x="0" y="110" transform="rotate(-24 180 100)" fill="${fill}" font-family="system-ui,sans-serif" font-size="13" font-weight="600">${escapeXml(text)}</text></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

type LoadState = "loading" | "ready" | "missing" | "locked" | "expired";

function Viewer() {
  const params = useSearchParams();
  const packId = params?.get("pack") ?? "";
  const user = useAuthStore((s) => s.user);
  const repoReady = useDataStore((s) => s.isInitialized);
  const { resolvedTheme } = useTheme();

  const [state, setState] = useState<LoadState>("loading");
  const [pack, setPack] = useState<PackContent | null>(null);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [revealAll, setRevealAll] = useState(false);
  const [shielded, setShielded] = useState(false);
  const openedAt = useRef(new Date());

  useEffect(() => {
    if (!user || !packId) return;
    let cancelled = false;
    (async () => {
      const k = await getVaultKey(user.id);
      if (cancelled) return;
      if (!("key" in k)) return setState(k.error === "offline-expired" ? "expired" : "locked");
      const p = await openPack(user.id, k.key, packId);
      if (cancelled) return;
      if (!p) return setState("missing");
      setPack(p);
      setState("ready");
    })().catch(() => !cancelled && setState("missing"));
    return () => { cancelled = true; };
  }, [user, packId]);

  // Protection: no copy/cut/drag/context menu/print/save shortcuts; blur when the tab
  // loses focus. Deterrents against casual export — see lib/vault/vault.ts for limits.
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("vault-open");
    const block = (e: Event) => e.preventDefault();
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && ["c", "x", "s", "p", "a", "u"].includes(k)) e.preventDefault();
      if (k === "printscreen") {
        setShielded(true);
        navigator.clipboard?.writeText("").catch(() => {});
        setTimeout(() => setShielded(false), 1200);
      }
    };
    const onHide = () => { if (document.hidden) setShielded(true); };
    const onBlur = () => setShielded(true);
    const onFocus = () => setShielded(false);
    ["copy", "cut", "contextmenu", "dragstart", "selectstart"].forEach((t) => document.addEventListener(t, block));
    document.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    return () => {
      html.classList.remove("vault-open");
      ["copy", "cut", "contextmenu", "dragstart", "selectstart"].forEach((t) => document.removeEventListener(t, block));
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const questions = useMemo(() => {
    if (!pack || !repoReady) return [];
    return pack.questionIds.map((id) => QuestionRepository.getQuestionById(id)).filter(Boolean) as NonNullable<ReturnType<typeof QuestionRepository.getQuestionById>>[];
  }, [pack, repoReady]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((i) => Math.min(i + 1, questions.length - 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [questions.length]);

  const mark = `${user?.email ?? "RENYXERA"} · ${user?.id.slice(0, 8) ?? ""} · ${openedAt.current.toLocaleDateString()} · RENYXERA`;
  const bg = useMemo(() => watermarkUrl(mark, resolvedTheme === "dark"), [mark, resolvedTheme]);

  if (!user || state === "loading" || (state === "ready" && !repoReady)) {
    return <div className="flex h-full items-center justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-violet-500" /></div>;
  }
  if (state !== "ready" || !pack) {
    const msg = {
      missing: ["This pack isn't on this device", "It may have been removed, or downloaded under another account."],
      locked: ["Connect once to unlock your downloads", "Your offline key couldn't be loaded on this device."],
      expired: ["Offline access expired", "For your security, connect to the internet once every 14 days to keep using downloads."],
    }[state as "missing" | "locked" | "expired"];
    return (
      <div className="max-w-md mx-auto text-center py-24">
        {state === "expired" ? <WifiOff className="w-10 h-10 mx-auto text-amber-500 mb-3" /> : <Lock className="w-10 h-10 mx-auto text-violet-500 mb-3" />}
        <h1 className="text-lg font-bold text-[var(--text-primary)]">{msg[0]}</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">{msg[1]}</p>
        <Link href="/downloads" className="inline-flex mt-5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold">Back to Downloads</Link>
      </div>
    );
  }

  const q = questions[Math.min(index, questions.length - 1)];
  const key = q ? pack.answers[q.question_id] : undefined;
  const shown = !!q && (revealAll || revealed[q.question_id]);
  const natText = key?.n?.map(([a, b]) => (a === b ? `${a}` : `${a} to ${b}`)).join(" or ");

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 pb-8 select-none [-webkit-touch-callout:none]">
      <style>{`@media print { html.vault-open body * { display: none !important; } html.vault-open body::after { content: "Printing is disabled for protected content."; display: block; padding: 48px; font: 600 16px system-ui; } }`}</style>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Link href="/downloads" className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-semibold text-[var(--text-primary)] hover:border-violet-500/40">
          <ArrowLeft className="w-4 h-4" /> Downloads
        </Link>
        <div className="order-last basis-full sm:order-none sm:basis-auto flex-1 min-w-0">
          <p className="font-bold text-[var(--text-primary)] truncate">{pack.title}</p>
          <p className="text-[11px] text-[var(--text-muted)] inline-flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-500" /> Protected · watermarked to your account</p>
        </div>
        <button onClick={() => setRevealAll((v) => !v)} className="ml-auto sm:ml-0 inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-semibold text-[var(--text-primary)] hover:border-violet-500/40 cursor-pointer">
          {revealAll ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />} {revealAll ? "Hide answers" : "Show all answers"}
        </button>
      </div>

      {/* Question card with watermark overlay */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20" style={{ backgroundImage: bg }} />
        {q ? (
          <AnimatePresence mode="wait">
            <motion.div key={q.question_id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }} className="relative z-10 p-5 sm:p-7 [&_img]:pointer-events-none">
              <div className="flex items-center gap-2 flex-wrap mb-4 text-[11px] font-semibold">
                <span className="px-2 py-0.5 rounded-md bg-violet-500/15 text-violet-700 dark:text-violet-300">Q{index + 1} / {questions.length}</span>
                <span className="px-2 py-0.5 rounded-md bg-[var(--surface-secondary)] text-[var(--text-secondary)]">{q.question_type} · {q.marks} mark{q.marks === 1 ? "" : "s"}</span>
                <span className="px-2 py-0.5 rounded-md bg-[var(--surface-secondary)] text-[var(--text-secondary)] truncate max-w-[60%]">{q.subject} · {q.topic}</span>
              </div>
              <div className="text-[15px] leading-relaxed text-[var(--text-primary)]">
                <AstNodeRenderer nodes={q.contentAst || []} />
              </div>

              {q.question_type !== "NAT" && (
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {(q.options || []).map((o) => {
                    const correct = shown && !!key?.c.includes(o.option_id);
                    return (
                      <div key={o.option_id} className={`flex items-start gap-3 rounded-xl border p-3 transition-colors ${correct ? "border-emerald-500/60 bg-emerald-500/10" : "border-[var(--border)] bg-[var(--surface-secondary)]/40"}`}>
                        <span className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-xs font-bold ${correct ? "bg-emerald-500 text-white" : "bg-[var(--surface-secondary)] text-[var(--text-secondary)]"}`}>{o.option_id}</span>
                        <div className="min-w-0 text-sm text-[var(--text-primary)]"><AstNodeRenderer nodes={o.contentAst || []} /></div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-5 flex items-center gap-3 flex-wrap">
                <button onClick={() => setRevealed((r) => ({ ...r, [q.question_id]: !r[q.question_id] }))} disabled={revealAll}
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold shadow-md shadow-violet-500/25 disabled:opacity-60 cursor-pointer">
                  {shown ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />} {shown ? "Hide answer" : "Show answer"}
                </button>
                {shown && (
                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    {!key ? "Answer not available for this question."
                      : q.question_type === "NAT" ? `Answer: ${natText ?? "—"}`
                      : key.c.length > 1 && key.c.length === (q.options?.length ?? 0) ? "Marks to all (official key)"
                      : `Answer: ${key.c.join(" or ")}`}
                  </span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <p className="relative z-10 p-8 text-center text-sm text-[var(--text-muted)]">This pack has no questions available.</p>
        )}

        {/* Privacy shield when the tab/window loses focus */}
        <AnimatePresence>
          {shielded && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-2 bg-[var(--surface)]/80 backdrop-blur-xl text-center p-6">
              <ShieldCheck className="w-8 h-8 text-violet-500" />
              <p className="font-semibold text-[var(--text-primary)]">Protected content hidden</p>
              <p className="text-xs text-[var(--text-secondary)]">Click back into the page to continue studying.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigator */}
      <div className="flex items-center gap-2">
        <button onClick={() => setIndex((i) => Math.max(i - 1, 0))} disabled={index === 0} aria-label="Previous question" className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] disabled:opacity-40 cursor-pointer"><ChevronLeft className="w-4 h-4" /></button>
        <div className="flex-1 overflow-x-auto custom-scrollbar">
          <div className="flex gap-1.5 py-1">
            {questions.map((qq, i) => (
              <button key={qq.question_id} onClick={() => setIndex(i)} className={`h-9 min-w-9 px-2 rounded-lg text-xs font-bold shrink-0 cursor-pointer ${i === index ? "bg-gradient-to-br from-indigo-600 to-violet-600 text-white" : "bg-[var(--surface-secondary)] text-[var(--text-secondary)] border border-[var(--border)]"}`}>{i + 1}</button>
            ))}
          </div>
        </div>
        <button onClick={() => setIndex((i) => Math.min(i + 1, questions.length - 1))} disabled={index >= questions.length - 1} aria-label="Next question" className="h-10 w-10 inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] disabled:opacity-40 cursor-pointer"><ChevronRight className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

export default function DownloadViewerPage() {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-violet-500" /></div>}>
      <Viewer />
    </Suspense>
  );
}
