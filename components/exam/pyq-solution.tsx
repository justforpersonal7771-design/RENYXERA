"use client";

/**
 * "Show solution" for an official PYQ, wherever a question is reviewed (results review, mistakes, revision).
 * The button appears only when a written solution exists (one batched availability check per screen), so it never leads to a dead end.
 * The solution is read from the shared store (app/api/solution): no waiting on a model and nothing spent from anyone's allowance.
 * Layout: the answer first, then the one idea, then numbered steps, then why each option holds or breaks, then shortcut and trap.
 */
import { useEffect, useState } from "react";
import { MathJax } from "better-react-mathjax";
import { Check, ChevronDown, Lightbulb, Loader2, TriangleAlert, Zap } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";

type Solution = { answer?: string; idea?: string; steps?: string[]; options?: Record<string, string>; shortcut?: string; trap?: string; formulas?: string[] };

// One availability request for every question on screen: ids are collected for a moment, then asked together.
const known = new Map<string, boolean>();
const waiting = new Map<string, Set<() => void>>();
let timer: ReturnType<typeof setTimeout> | null = null;
function flush() {
  timer = null;
  const ids = [...waiting.keys()];
  for (let i = 0; i < ids.length; i += 80) {
    const part = ids.slice(i, i + 80);
    fetch(`/api/solution?ids=${encodeURIComponent(part.join(","))}`).then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j: { have?: string[] }) => { const have = new Set(j.have ?? []); part.forEach((id) => known.set(id, have.has(id))); })
      .catch(() => part.forEach((id) => known.set(id, false)))
      .finally(() => part.forEach((id) => { waiting.get(id)?.forEach((f) => f()); waiting.delete(id); }));
  }
}
function useHasSolution(id: string, on: boolean) {
  const [, bump] = useState(0);
  useEffect(() => {
    if (!on || known.has(id)) return;
    const set = waiting.get(id) ?? new Set<() => void>(); const f = () => bump((n) => n + 1);
    set.add(f); waiting.set(id, set);
    if (!timer) timer = setTimeout(flush, 40);
    return () => { set.delete(f); };
  }, [id, on]);
  return on ? known.get(id) ?? null : false;
}

const HAS_TEX = /\\\(|\\\[|\$\$/;
const Tex = ({ children }: { children: string }) => (HAS_TEX.test(children) ? <MathJax dynamic inline hideUntilTypeset="every">{children}</MathJax> : <>{children}</>);

export function PyqSolution({ questionId, className = "" }: { questionId: string; className?: string }) {
  const signedIn = useAuthStore((s) => !!s.user);
  const official = questionId.startsWith("GATE_");
  const has = useHasSolution(questionId, signedIn && official);
  const [open, setOpen] = useState(false);
  const [sol, setSol] = useState<Solution | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  // another question on the same screen: start closed
  useEffect(() => { setOpen(false); setSol(null); setState("idle"); }, [questionId]);

  if (!has) return null;
  const toggle = async () => {
    if (open) { setOpen(false); return; }
    setOpen(true);
    if (sol) return;
    setState("loading");
    try {
      const r = await fetch(`/api/solution?id=${encodeURIComponent(questionId)}`); const j = (await r.json()) as { solution?: Solution | null };
      if (!r.ok || !j.solution) throw new Error("none");
      setSol(j.solution); setState("idle");
    } catch { setState("error"); }
  };
  const steps = (sol?.steps ?? []).filter(Boolean);
  const opts = Object.entries(sol?.options ?? {});
  return (
    <div className={className}>
      <button type="button" onClick={toggle} aria-expanded={open} className="pill-soft inline-flex cursor-pointer items-center gap-2">
        <Lightbulb className="h-4 w-4" aria-hidden /> {open ? "Hide solution" : "Show solution"} <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open && (
        <section aria-label="Solution" className="mt-3 space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-relaxed text-[var(--text-primary)] sm:p-5">
          {state === "loading" && <p className="inline-flex items-center gap-2 text-[var(--text-secondary)]"><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Loading the solution</p>}
          {state === "error" && <p className="text-rose-700 dark:text-rose-300">Couldn&apos;t load the solution. Please try again.</p>}
          {sol && (
            <>
              {sol.answer && <p className="inline-flex flex-wrap items-center gap-2 rounded-xl bg-emerald-500/12 px-3 py-2 font-bold text-emerald-800 dark:text-emerald-200"><Check className="h-4 w-4 shrink-0" aria-hidden /> Answer: <span className="font-num"><Tex>{sol.answer}</Tex></span></p>}
              {sol.idea && <div><p className="text-xs font-black uppercase tracking-wide text-[var(--text-muted)]">The idea</p><p className="mt-1"><Tex>{sol.idea}</Tex></p></div>}
              {steps.length > 0 && (
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-[var(--text-muted)]">Step by step</p>
                  <ol className="mt-2 space-y-3">{steps.map((st, i) => (
                    <li key={i} className="flex gap-3"><span aria-hidden className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--text-primary)] text-xs font-extrabold text-[var(--background)]">{i + 1}</span><span className="min-w-0 flex-1"><Tex>{st}</Tex></span></li>
                  ))}</ol>
                </div>
              )}
              {sol.formulas && sol.formulas.filter(Boolean).length > 0 && (
                <div className="rounded-xl bg-[var(--surface-secondary)] p-3"><p className="text-xs font-black uppercase tracking-wide text-[var(--text-muted)]">Formulas used</p><ul className="mt-1 space-y-1">{sol.formulas.filter(Boolean).map((f, i) => <li key={i}><Tex>{f}</Tex></li>)}</ul></div>
              )}
              {opts.length > 0 && (
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-[var(--text-muted)]">Each option</p>
                  <ul className="mt-2 space-y-1.5">{opts.map(([k, v]) => <li key={k} className="flex gap-2.5"><b className="grid h-6 w-6 shrink-0 place-items-center rounded-md border border-[var(--border)] text-xs">{k}</b><span className="min-w-0 flex-1"><Tex>{v}</Tex></span></li>)}</ul>
                </div>
              )}
              {(sol.shortcut || sol.trap) && (
                <div className="grid gap-2 sm:grid-cols-2">
                  {sol.shortcut && <p className="rounded-xl p-3" style={{ background: "var(--tint-butter)", color: "var(--tint-butter-ink)" }}><span className="mb-1 flex items-center gap-1.5 text-xs font-black uppercase tracking-wide"><Zap className="h-3.5 w-3.5" aria-hidden /> Faster in the exam</span><Tex>{sol.shortcut}</Tex></p>}
                  {sol.trap && <p className="rounded-xl p-3" style={{ background: "var(--tint-rose)", color: "var(--tint-rose-ink)" }}><span className="mb-1 flex items-center gap-1.5 text-xs font-black uppercase tracking-wide"><TriangleAlert className="h-3.5 w-3.5" aria-hidden /> Common mistake</span><Tex>{sol.trap}</Tex></p>}
                </div>
              )}
            </>
          )}
        </section>
      )}
    </div>
  );
}
