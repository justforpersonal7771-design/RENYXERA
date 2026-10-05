"use client";

import { useState } from "react";
import { branchOfQuestionId } from "@/lib/branches";
import Link from "next/link";
import { MathJaxContext } from "better-react-mathjax";
import { CheckCircle2, Eye, Loader2, Play } from "lucide-react";
import { MATHJAX_CONFIG } from "@/lib/mathjax-config";
import { AstNodeRenderer } from "@/components/exam/ast-node-renderer";
import type { RenderNode } from "@/types/ast.types";

type Opt = { option_id: string; contentAst: RenderNode[] };

/**
 * Body of a public PYQ page. The question text is in the HTML (crawlable); maths renders
 * in the browser. "Check answer" fetches the official key through the rate-limited
 * /api/answers route, so keys are never part of the static page.
 */
export function PyqBody({ id, type, question, options, paperYearShift }: { id: string; type: string; question: RenderNode[]; options: Opt[]; paperYearShift: string }) {
  const [key, setKey] = useState<{ c: string[]; n: [number, number][] | null } | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "error" | "limited">("idle");

  const reveal = async () => {
    setState("loading");
    try {
      const res = await fetch("/api/answers", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ question_ids: [id] }) });
      if (res.status === 429) return setState("limited");
      const j = (await res.json()) as { answers?: Record<string, { c: string[]; n: [number, number][] | null }> };
      const k = j.answers?.[id];
      if (!k) return setState("error");
      setKey(k);
      setState("idle");
    } catch {
      setState("error");
    }
  };

  const nat = key?.n?.map(([a, b]) => (a === b ? `${a}` : `${a} to ${b}`)).join(" or ");

  return (
    <MathJaxContext config={MATHJAX_CONFIG}>
      <div className="text-base sm:text-lg leading-relaxed text-[var(--text-primary)]">
        <AstNodeRenderer nodes={question} />
      </div>

      {options.length > 0 && (
        <ol className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3" aria-label="Options">
          {options.map((o) => {
            const right = key?.c.includes(o.option_id);
            return (
              <li key={o.option_id} className={`rounded-2xl border p-4 flex gap-3 transition-colors ${right ? "border-emerald-500/60 bg-emerald-500/10" : "border-[var(--border)] bg-[var(--surface)]"}`}>
                <span className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-sm font-bold ${right ? "bg-emerald-500 text-white" : "bg-[var(--surface-secondary)] text-[var(--text-secondary)]"}`}>{o.option_id}</span>
                <div className="min-w-0 flex-1 text-[var(--text-primary)]"><AstNodeRenderer nodes={o.contentAst} /></div>
                {right && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" aria-label="Correct" />}
              </li>
            );
          })}
        </ol>
      )}

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        {!key ? (
          <button onClick={reveal} disabled={state === "loading"} className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] font-semibold text-[var(--text-primary)] hover:border-emerald-500/50 disabled:opacity-60 cursor-pointer">
            {state === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4 text-emerald-500" />} Check the official answer
          </button>
        ) : (
          <p className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold">
            <CheckCircle2 className="w-4 h-4" /> Official answer: {type === "NAT" ? nat : key.c.join(", ")}
          </p>
        )}
        <Link href={`/setup?branch=${branchOfQuestionId(id) ?? "CSE"}`} className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-lg shadow-violet-500/25">
          <Play className="w-4 h-4 fill-current" /> Practise the full {paperYearShift} paper
        </Link>
      </div>
      {state === "error" && <p className="mt-2 text-sm text-rose-600">Couldn&apos;t load the answer — check your connection.</p>}
      {state === "limited" && <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">Too many answers checked in a short time — try again in a minute.</p>}
    </MathJaxContext>
  );
}
