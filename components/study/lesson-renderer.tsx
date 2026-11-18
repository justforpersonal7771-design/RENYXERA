"use client";

/**
 * Renders a study chapter from data (lib/study/schema.ts). Uses the full width (owner, 18 Nov): each topic is laid out
 * in rows: hook beside objectives, idea beside definition, method beside its figure, every worked example beside its own
 * figures, traps in a row, GATE note beside recall cards, questions two across. Blocks use the app's pastel card system
 * (one tint per block kind) so lessons look like the rest of RENYXERA in light and dark.
 * Second pass (owner, 18 Nov): one screen on desktop. The outline on the left and the lesson each scroll on their own;
 * the outline lists every section of the topic, jumps to it and follows your place. Notes, PYQs and the Mentor are
 * floating tools (lesson-tools.tsx), so the lesson gets the whole remaining width.
 */
import dynamic from "next/dynamic";
/* Labs load on demand (bundle budget, 18 Nov): each lab module is its own chunk. */
const RrLab = dynamic(() => import("@/components/study/os-more-labs").then((m) => m.RrLab), { ssr: false });
const PageFaultLab = dynamic(() => import("@/components/study/os-more-labs").then((m) => m.PageFaultLab), { ssr: false });
const WorkingSetLab = dynamic(() => import("@/components/study/os-more-labs").then((m) => m.WorkingSetLab), { ssr: false });

const DmTruthLab = dynamic(() => import("@/components/study/dm-labs").then((m) => m.TruthLab), { ssr: false, loading: () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden /> });
const DmEquivLab = dynamic(() => import("@/components/study/dm-labs").then((m) => m.EquivLab), { ssr: false, loading: () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden /> });
const DmQuantLab = dynamic(() => import("@/components/study/dm-labs").then((m) => m.QuantLab), { ssr: false, loading: () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden /> });
const DmFolLab = dynamic(() => import("@/components/study/dm-labs").then((m) => m.FolLab), { ssr: false, loading: () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden /> });
const DmRelationLab = dynamic(() => import("@/components/study/dm-labs").then((m) => m.RelationLab), { ssr: false, loading: () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden /> });
const DmFuncLab = dynamic(() => import("@/components/study/dm-labs").then((m) => m.FuncLab), { ssr: false, loading: () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden /> });
const DmHasseLab = dynamic(() => import("@/components/study/dm-labs").then((m) => m.HasseLab), { ssr: false, loading: () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden /> });
const DmLatticeLab = dynamic(() => import("@/components/study/dm-labs").then((m) => m.LatticeLab), { ssr: false, loading: () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden /> });
const DmAlgebraLab = dynamic(() => import("@/components/study/dm-labs").then((m) => m.AlgebraLab), { ssr: false, loading: () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden /> });
const DmCyclicLab = dynamic(() => import("@/components/study/dm-labs").then((m) => m.CyclicLab), { ssr: false, loading: () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden /> });
const DmGraphLab = dynamic(() => import("@/components/study/dm-labs").then((m) => m.GraphLab), { ssr: false, loading: () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden /> });
const DmColourLab = dynamic(() => import("@/components/study/dm-labs").then((m) => m.ColourLab), { ssr: false, loading: () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden /> });
const DmCountLab = dynamic(() => import("@/components/study/dm-labs").then((m) => m.CountLab), { ssr: false, loading: () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden /> });
const DmDerangeLab = dynamic(() => import("@/components/study/dm-labs").then((m) => m.DerangeLab), { ssr: false, loading: () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden /> });
const DmRecurLab = dynamic(() => import("@/components/study/dm-labs").then((m) => m.RecurLab), { ssr: false, loading: () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden /> });
const DmGenFunLab = dynamic(() => import("@/components/study/dm-labs").then((m) => m.GenFunLab), { ssr: false, loading: () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden /> });

const labLoading = () => <div className="card-pastel h-48 animate-pulse" data-tint="plain" aria-hidden />;
const MlfqLab = dynamic(() => import("@/components/study/os-extra-labs").then((m) => m.MlfqLab), { ssr: false, loading: labLoading });
const PipeLab = dynamic(() => import("@/components/study/os-extra-labs").then((m) => m.PipeLab), { ssr: false, loading: labLoading });
const SegmentLab = dynamic(() => import("@/components/study/os-extra-labs").then((m) => m.SegmentLab), { ssr: false, loading: labLoading });
const EncapLab = dynamic(() => import("@/components/study/cn-labs").then((m) => m.EncapLab), { ssr: false, loading: labLoading });
const DelayLab = dynamic(() => import("@/components/study/cn-labs").then((m) => m.DelayLab), { ssr: false, loading: labLoading });
const CrcLab = dynamic(() => import("@/components/study/cn-labs").then((m) => m.CrcLab), { ssr: false, loading: labLoading });
const WindowLab = dynamic(() => import("@/components/study/cn-labs").then((m) => m.WindowLab), { ssr: false, loading: labLoading });
const MacLab = dynamic(() => import("@/components/study/cn-labs").then((m) => m.MacLab), { ssr: false, loading: labLoading });
const SubnetLab = dynamic(() => import("@/components/study/cn-labs").then((m) => m.SubnetLab), { ssr: false, loading: labLoading });
const FragLab = dynamic(() => import("@/components/study/cn-labs").then((m) => m.FragLab), { ssr: false, loading: labLoading });
const RouteLab = dynamic(() => import("@/components/study/cn-labs").then((m) => m.RouteLab), { ssr: false, loading: labLoading });
const SeqLab = dynamic(() => import("@/components/study/cn-labs").then((m) => m.SeqLab), { ssr: false, loading: labLoading });
const CwndLab = dynamic(() => import("@/components/study/cn-labs").then((m) => m.CwndLab), { ssr: false, loading: labLoading });
const HttpLab = dynamic(() => import("@/components/study/cn-labs").then((m) => m.HttpLab), { ssr: false, loading: labLoading });
const PortsLab = dynamic(() => import("@/components/study/cn-labs").then((m) => m.PortsLab), { ssr: false, loading: labLoading });
const RagLab = dynamic(() => import("@/components/study/rag-lab").then((m) => m.RagLab), { ssr: false, loading: labLoading });
const BankerLab = dynamic(() => import("@/components/study/deadlock-labs").then((m) => m.BankerLab), { ssr: false, loading: labLoading });
const CountLab = dynamic(() => import("@/components/study/deadlock-labs").then((m) => m.CountLab), { ssr: false, loading: labLoading });
const DetectLab = dynamic(() => import("@/components/study/deadlock-labs").then((m) => m.DetectLab), { ssr: false, loading: labLoading });
const PreventLab = dynamic(() => import("@/components/study/deadlock-labs").then((m) => m.PreventLab), { ssr: false, loading: labLoading });
const StarveLab = dynamic(() => import("@/components/study/deadlock-labs").then((m) => m.StarveLab), { ssr: false, loading: labLoading });
const ForkLab = dynamic(() => import("@/components/study/process-labs").then((m) => m.ForkLab), { ssr: false, loading: labLoading });
const ProcessStateLab = dynamic(() => import("@/components/study/process-labs").then((m) => m.ProcessStateLab), { ssr: false, loading: labLoading });
const SyscallLab = dynamic(() => import("@/components/study/process-labs").then((m) => m.SyscallLab), { ssr: false, loading: labLoading });
const ThreadLab = dynamic(() => import("@/components/study/process-labs").then((m) => m.ThreadLab), { ssr: false, loading: labLoading });
const SchedLab = dynamic(() => import("@/components/study/sched-lab").then((m) => m.SchedLab), { ssr: false, loading: labLoading });
const BufferLab = dynamic(() => import("@/components/study/sync-labs").then((m) => m.BufferLab), { ssr: false, loading: labLoading });
const RaceLab = dynamic(() => import("@/components/study/sync-labs").then((m) => m.RaceLab), { ssr: false, loading: labLoading });
const SemaphoreLab = dynamic(() => import("@/components/study/sync-labs").then((m) => m.SemaphoreLab), { ssr: false, loading: labLoading });
const FitLab = dynamic(() => import("@/components/study/memory-labs").then((m) => m.FitLab), { ssr: false, loading: labLoading });
const PagingLab = dynamic(() => import("@/components/study/memory-labs").then((m) => m.PagingLab), { ssr: false, loading: labLoading });
const TlbLab = dynamic(() => import("@/components/study/memory-labs").then((m) => m.TlbLab), { ssr: false, loading: labLoading });
const ReplaceLab = dynamic(() => import("@/components/study/vm-labs").then((m) => m.ReplaceLab), { ssr: false, loading: labLoading });
const AllocLab = dynamic(() => import("@/components/study/fs-labs").then((m) => m.AllocLab), { ssr: false, loading: labLoading });
const DiskLab = dynamic(() => import("@/components/study/fs-labs").then((m) => m.DiskLab), { ssr: false, loading: labLoading });
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { StudyTabs } from "@/components/study/study-tabs";
import { rememberScroll, recallScroll, useStudyTabs } from "@/lib/study/tabs";
import { CHAPTERS } from "@/lib/study/chapters";
import { CS_SHELF } from "@/lib/study/catalog";
import { ArrowLeft, ArrowUpRight, Check, ChevronDown, ChevronLeft, ChevronRight, ListTree, ChevronsLeft, ChevronsRight, ExternalLink, X as XIcon, CircleCheck, CircleX, Lightbulb, Link2, Repeat, RotateCcw, Target, TriangleAlert, Zap } from "lucide-react";
import type { Block, Chapter, CheckQ, Topic } from "@/lib/study/schema";
import { Diagram } from "@/components/study/diagram";
import { LessonTools } from "@/components/study/lesson-tools";
import { useLessonHighlights } from "@/components/study/lesson-highlights";
import Link from "next/link";

type B<T extends Block["type"]> = Extract<Block, { type: T }>;
const card = (tint: string, extra = "") => ({ className: `card-pastel p-5 sm:p-6 ${extra}`, "data-tint": tint });
const plain = "rounded-[var(--card-radius,24px)] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6";
const Label = ({ icon, children }: { icon?: ReactNode; children: ReactNode }) => <p className="flex items-center gap-2 text-sm font-bold text-[var(--tint-ink,var(--text-primary))]">{icon}{children}</p>;

/* ------------------------------------------------------------------ check questions */
function CheckQuestion({ q, n }: { q: CheckQ; n: number }) {
  const [pick, setPick] = useState<string[]>([]);
  const [nat, setNat] = useState("");
  const [shown, setShown] = useState(false);
  const letters = ["A", "B", "C", "D"];
  const correct = q.answer.split(",").map((x) => x.trim());
  const mine = q.kind === "NAT" ? nat.trim() : [...pick].sort().join(", ");
  // numbers are compared as numbers (2.5 = 2.50), within a small tolerance for rounding
  const right = shown && (q.kind === "NAT" ? Number.isFinite(parseFloat(mine)) && Math.abs(parseFloat(mine) - parseFloat(q.answer)) <= 0.01 : mine === q.answer);
  const toggle = (l: string) => { if (shown) return; setPick((p) => (q.kind === "MSQ" ? (p.includes(l) ? p.filter((x) => x !== l) : [...p, l]) : [l])); };
  const can = q.kind === "NAT" ? nat.trim() !== "" : pick.length > 0;
  const tone = (l: string) => {
    if (!shown) return pick.includes(l) ? "border-[var(--text-primary)] bg-[var(--surface-secondary)]" : "border-[var(--border)] hover:bg-[var(--surface-secondary)]";
    if (correct.includes(l)) return "border-emerald-600 bg-emerald-500/12";
    if (pick.includes(l)) return "border-rose-600 bg-rose-500/12";
    return "border-[var(--border)] opacity-70";
  };
  return (
    <li className={plain}>
      <p className="text-xs font-bold text-[var(--text-secondary)]">Question {n} · {q.kind === "MSQ" ? "MSQ, pick all that apply" : q.kind === "NAT" ? "NAT, type a number" : "MCQ, pick one"} · {q.marks} mark{q.marks > 1 ? "s" : ""} · {q.kind === "MCQ" ? (q.marks === 1 ? "−1/3 if wrong" : "−2/3 if wrong") : "no negative marks"}</p>
      <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-primary)]">{q.q}</p>
      {q.options ? (
        <ul className="mt-3 grid gap-2" role={q.kind === "MSQ" ? "group" : "radiogroup"} aria-label={`Options for question ${n}`}>
          {q.options.map((o, i) => {
            const l = letters[i], on = pick.includes(l);
            return (
              <li key={i}>
                <button type="button" onClick={() => toggle(l)} role={q.kind === "MSQ" ? "checkbox" : "radio"} aria-checked={on} disabled={shown}
                  className={`flex w-full items-start gap-3 rounded-xl border-2 px-3 py-2.5 text-left text-sm transition-colors ${tone(l)}`}>
                  <span aria-hidden className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center border-2 border-[var(--text-primary)] ${q.kind === "MSQ" ? "rounded-md" : "rounded-full"} ${on ? "bg-[var(--text-primary)] text-[var(--background)]" : ""}`}>
                    {on && (q.kind === "MSQ" ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <span className="h-2 w-2 rounded-full bg-[var(--background)]" />)}
                  </span>
                  <span className="min-w-0 flex-1 text-[var(--text-primary)]"><b className="mr-1.5">{l}.</b>{o}</span>
                  {shown && correct.includes(l) && <CircleCheck className="h-5 w-5 shrink-0 text-emerald-600" aria-label="Correct option" />}
                  {shown && on && !correct.includes(l) && <CircleX className="h-5 w-5 shrink-0 text-rose-600" aria-label="Wrong pick" />}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <input value={nat} onChange={(e) => setNat(e.target.value)} disabled={shown} inputMode="decimal" aria-label="Your answer" placeholder="Your answer"
          className={`mt-3 h-11 w-44 rounded-xl border-2 bg-[var(--surface)] px-3 font-num text-[var(--text-primary)] ${shown ? (right ? "border-emerald-600" : "border-rose-600") : "border-[var(--border)]"}`} />
      )}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!shown ? <button type="button" onClick={() => setShown(true)} disabled={!can} className="pill-ink disabled:opacity-40">Check answer</button>
          : <button type="button" onClick={() => { setShown(false); setPick([]); setNat(""); }} className="pill-soft"><RotateCcw className="h-4 w-4" aria-hidden /> Try again</button>}
        {shown && <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${right ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-rose-500/15 text-rose-700 dark:text-rose-300"}`}>{right ? <CircleCheck className="h-4 w-4" /> : <CircleX className="h-4 w-4" />}{right ? "Correct" : `Not quite. Answer: ${q.answer}`}</span>}
      </div>
      {shown && <p className="mt-3 rounded-xl bg-[var(--surface-secondary)] p-3 text-sm leading-relaxed text-[var(--text-primary)]">{q.solution}</p>}
    </li>
  );
}

function FadedStep({ s }: { s: { say: string; blank?: boolean; answer?: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="text-[15px] leading-relaxed text-[var(--text-primary)]">{s.say}
      {s.blank && (open ? <p className="mt-1 rounded-lg bg-[var(--surface)] p-2 text-sm">{s.answer}</p> : <button type="button" onClick={() => setOpen(true)} className="ml-2 text-sm font-bold underline underline-offset-4">Show answer</button>)}
    </li>
  );
}

/* ------------------------------------------------------------------ single blocks */
const Hook = ({ b }: { b: B<"hook"> }) => <div {...card("butter")}><p className="font-display text-xl font-bold leading-relaxed text-[var(--text-primary)]">{b.text}</p></div>;
const Objectives = ({ b }: { b: B<"objectives"> }) => <div {...card("peri")}><Label icon={<Target className="h-4 w-4" aria-hidden />}>What you will learn</Label><ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] text-[var(--text-primary)]">{b.items.map((t) => <li key={t}>{t}</li>)}</ul></div>;
const Intuition = ({ b }: { b: B<"intuition"> }) => <section className={plain}><h3 className="lesson-h">The idea</h3>{b.paras.map((p, i) => <p key={i} className="lesson-p mt-2">{p}</p>)}{b.analogyLimit && <p className="mt-3 rounded-xl bg-[var(--surface-secondary)] p-3 text-sm text-[var(--text-secondary)]"><b className="text-[var(--text-primary)]">Where the picture breaks: </b>{b.analogyLimit}</p>}</section>;
const Definition = ({ b }: { b: B<"definition"> }) => <section {...card("lilac")}><h3 className="lesson-h !mb-1">{b.name}</h3><p className="lesson-p">{b.text}</p>{b.items && <ol className="mt-3 space-y-2">{b.items.map((t, i) => <li key={t} className="flex gap-3 rounded-xl bg-[var(--surface)] p-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--tint-ink)] text-xs font-bold text-[var(--surface)]">{i + 1}</span><span className="text-[15px] text-[var(--text-primary)]">{t}</span></li>)}</ol>}</section>;
const Deep = ({ b }: { b: B<"deep"> }) => (
  <section className={plain}>
    <h3 className="lesson-h">In depth</h3>
    <div className="mt-3 grid gap-x-10 gap-y-6 @3xl:grid-cols-2">
      {b.sections.map((x) => (
        <div key={x.h}>
          <h4 className="font-display text-lg font-extrabold text-[var(--st-accent,var(--text-primary))]">{x.h}</h4>
          {x.paras.map((p, i) => <p key={i} className="lesson-p mt-2">{p}</p>)}
          {x.points && <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-[var(--text-primary)]">{x.points.map((t) => <li key={t}>{t}</li>)}</ul>}
        </div>
      ))}
    </div>
  </section>
);
const Walk = ({ b }: { b: B<"walkthrough"> }) => <section className={plain}><h3 className="lesson-h">Step by step</h3><ol className="mt-2 space-y-2">{b.steps.map((s, i) => <li key={i} className="flex gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--ink)] text-xs font-bold text-[var(--background)]">{i + 1}</span><p className="lesson-p">{s}</p></li>)}</ol>{b.prompt && <details className="mt-3 rounded-xl bg-[var(--surface-secondary)] p-3"><summary className="cursor-pointer text-sm font-bold text-[var(--text-primary)]">Think: {b.prompt.q}</summary><p className="mt-2 text-sm text-[var(--text-secondary)]">{b.prompt.a}</p></details>}</section>;
const Figure = ({ b }: { b: B<"figure"> }) => <figure className={`${plain} grid content-center justify-items-center gap-2`}><Diagram fig={b.fig} /><figcaption className="text-center text-sm text-[var(--text-secondary)]">{b.caption}</figcaption><span className="sr-only">{b.alt}</span></figure>;
const Example = ({ b }: { b: B<"example"> }) => (
  <section {...card("sky")}><p className="text-xs font-bold text-[var(--tint-ink)]">Worked example{b.level === "edge" ? ", edge case" : b.level === "gate" ? ", GATE level" : ""}</p><h3 className="lesson-h !mt-1">{b.title}</h3>
    <p className="lesson-p"><b>Given: </b>{b.given}</p><p className="lesson-p mt-1"><b>Find: </b>{b.find}</p>
    <ol className="mt-3 space-y-2">{b.steps.map((s, i) => <li key={i} className="flex gap-3 rounded-xl bg-[var(--surface)] p-3"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--tint-ink)] text-xs font-bold text-[var(--surface)]">{i + 1}</span><p className="text-[15px] leading-relaxed text-[var(--text-primary)]">{s.say}{s.result && <b className="ml-1">→ {s.result}</b>}</p></li>)}</ol>
    <p className="mt-3 rounded-xl bg-[var(--surface)] p-3 font-bold text-[var(--text-primary)]">Answer: {b.answer}</p>{b.check && <p className="mt-2 text-sm text-[var(--text-primary)]"><b>Check it another way: </b>{b.check}</p>}</section>
);
const Faded = ({ b }: { b: B<"faded"> }) => <section {...card("peach")}><p className="text-xs font-bold text-[var(--tint-ink)]">Try it yourself</p><h3 className="lesson-h !mt-1">{b.title}</h3><p className="lesson-p">{b.given}</p><ol className="mt-2 list-decimal space-y-2 pl-5">{b.steps.map((s, i) => <FadedStep key={i} s={s} />)}</ol></section>;
const Trap = ({ b }: { b: B<"trap"> }) => <section {...card("rose", "h-full")}><Label icon={<TriangleAlert className="h-4 w-4" aria-hidden />}>Trap</Label><p className="mt-1 font-bold text-[var(--text-primary)]">{b.wrong}</p><p className="mt-2 text-sm text-[var(--text-primary)]"><b>Why it feels right: </b>{b.tempting}</p><p className="mt-1 text-sm text-[var(--text-primary)]"><b>Why it is wrong: </b>{b.whyWrong}</p><p className="mt-3 rounded-xl bg-[var(--surface)] p-2.5 text-sm font-bold text-[var(--text-primary)]">Rule: {b.rule}</p></section>;
const Shortcut = ({ b }: { b: B<"shortcut"> }) => <section {...card("mint")}><Label icon={<Zap className="h-4 w-4" aria-hidden />}>Shortcut</Label><p className="lesson-p mt-1">{b.text}</p><p className="mt-1 text-sm">Valid when: {b.validWhen}</p></section>;
const Gate = ({ b }: { b: B<"gate"> }) => <section {...card("butter", "h-full")}><Label icon={<Lightbulb className="h-4 w-4" aria-hidden />}>How GATE asks it</Label><p className="lesson-p mt-1">{b.text}</p></section>;
const Recall = ({ b }: { b: B<"recall"> }) => <section {...card("mint", "h-full")}><Label icon={<Repeat className="h-4 w-4" aria-hidden />}>Recall cards (tap to reveal)</Label><ul className="mt-3 grid gap-2 sm:grid-cols-3">{b.cards.map((c) => <li key={c.q}><details className="h-full rounded-xl bg-[var(--surface)] p-3"><summary className="cursor-pointer text-sm font-semibold text-[var(--text-primary)]">{c.q}</summary><p className="mt-2 text-sm text-[var(--text-secondary)]">{c.a}</p></details></li>)}</ul></section>;
const Links = ({ b }: { b: B<"links"> }) => <section className={plain}><Label icon={<Link2 className="h-4 w-4" aria-hidden />}>How this connects</Label><div className="mt-2 grid gap-4 text-sm sm:grid-cols-3">{([["Needs", b.prereq], ["Used later in", b.usedIn], ["Other subjects", b.cross]] as const).map(([h, l]) => l?.length ? <div key={h}><p className="font-bold text-[var(--text-primary)]">{h}</p><ul className="mt-1 list-disc pl-5 text-[var(--text-secondary)]">{l.map((x) => <li key={x}>{x}</li>)}</ul></div> : null)}</div></section>;

const Practice = ({ b }: { b: B<"practice"> }) => (
  <section className={plain}><Label icon={<ArrowUpRight className="h-4 w-4" aria-hidden />}>Where to go next</Label>
    <ul className="mt-3 grid gap-3 md:grid-cols-3">{b.links.map((l) => <li key={l.href}><Link href={l.href} className="group flex h-full flex-col rounded-2xl border border-[var(--border)] p-4 transition-colors hover:bg-[var(--surface-secondary)]"><span className="font-bold text-[var(--text-primary)]">{l.label}</span><span className="mt-1 text-sm text-[var(--text-secondary)]">{l.sub}</span><span className="mt-2 text-sm font-bold text-[var(--text-primary)] group-hover:underline">Open</span></Link></li>)}</ul></section>
);

/* ------------------------------------------------------------------ sections (outline + anchors) */
type Sec = { key: string; label: string };
function sectionsOf(t: Topic): Sec[] {
  const has = (k: Block["type"]) => t.blocks.some((b) => b.type === k);
  const exs = t.blocks.filter((b) => b.type === "example") as B<"example">[];
  const out: Sec[] = [];
  if (has("hook") || has("objectives")) out.push({ key: "start", label: "What this is about" });
  if (has("intuition") || has("definition")) out.push({ key: "idea", label: "The idea and the definition" });
  if (has("deep")) out.push({ key: "deep", label: "In depth" });
  if (has("walkthrough")) out.push({ key: "method", label: "Step by step" });
  exs.forEach((e, i) => out.push({ key: `ex${i}`, label: `Example ${i + 1}: ${e.title}` }));
  if (has("lab")) out.push({ key: "lab", label: "Lab: try it yourself" });
  if (has("faded") || has("shortcut")) out.push({ key: "faded", label: "Finish the solution" });
  if (has("trap")) out.push({ key: "traps", label: "Traps" });
  if (has("gate") || has("recall")) out.push({ key: "gate", label: "How GATE asks it" });
  if (has("check")) out.push({ key: "check", label: "Check yourself" });
  if (has("links") || has("practice")) out.push({ key: "next", label: "Where to go next" });
  return out;
}
const secId = (t: Topic, key: string) => `${t.id}--${key}`;
const Sect = ({ t, k, children, className = "" }: { t: Topic; k: string; children: ReactNode; className?: string }) => <section id={secId(t, k)} data-sec="" className={`scroll-mt-24 lg:scroll-mt-4 ${className}`}>{children}</section>;

/* ------------------------------------------------------------------ topic layout in rows */
/** Previous / next topic and a list of every topic with its sections (owner, 19 Nov). Topics share one scroll, so this scrolls. */
function goTo(id: string) { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }); }
function TopicNav({ topics, index, menuOnly = false }: { topics: Topic[]; index: number; menuOnly?: boolean }) {
  const [open, setOpen] = useState(false);
  const prev = topics[index - 1], next = topics[index + 1];
  const btn = "grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] disabled:opacity-35 hover:enabled:bg-[var(--surface-secondary)]";
  return (
    <div className="relative flex shrink-0 items-center gap-1.5">
      {!menuOnly && <button type="button" className={btn} disabled={!prev} onClick={() => prev && goTo(prev.id)} aria-label={prev ? `Previous topic: ${prev.title}` : "No previous topic"}><ChevronLeft className="h-4 w-4" /></button>}
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-bold hover:bg-[var(--surface-secondary)]"><ListTree className="h-4 w-4" aria-hidden /> {menuOnly ? "Contents" : <>Topics <span className="font-num text-[var(--text-secondary)]">{index + 1}/{topics.length}</span></>}</button>
      {!menuOnly && <button type="button" className={btn} disabled={!next} onClick={() => next && goTo(next.id)} aria-label={next ? `Next topic: ${next.title}` : "No next topic"}><ChevronRight className="h-4 w-4" /></button>}
      {open && <>
        <button type="button" aria-label="Close topics" className="fixed inset-0 z-[70] cursor-default" onClick={() => setOpen(false)} />
        <div role="menu" className="custom-scrollbar absolute right-0 top-11 z-[80] max-h-[60vh] w-[min(22rem,80vw)] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[0_20px_40px_-20px_rgba(0,0,0,.5)]">
          {topics.map((x, i) => (
            <div key={x.id} className={`rounded-xl p-2 ${i === index ? "bg-[color-mix(in_srgb,var(--st-accent)_10%,transparent)]" : ""}`}>
              <button type="button" role="menuitem" onClick={() => { setOpen(false); goTo(x.id); }} className="flex w-full items-start gap-2 text-left text-sm font-bold"><span className="font-num text-[var(--st-accent)]">{i + 1}</span><span className="min-w-0">{x.title}</span></button>
              <ul className="mt-1 space-y-0.5 pl-5">{sectionsOf(x).map((sec) => <li key={sec.key}><button type="button" role="menuitem" onClick={() => { setOpen(false); goTo(secId(x, sec.key)); }} className="w-full rounded-lg px-2 py-0.5 text-left text-xs text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]">{sec.label}</button></li>)}</ul>
            </div>
          ))}
        </div>
      </>}
    </div>
  );
}

function TopicView({ t, index, topics }: { t: Topic; index: number; topics: Topic[] }) {
  const one = <T extends Block["type"]>(k: T) => t.blocks.find((b) => b.type === k) as B<T> | undefined;
  const all = <T extends Block["type"]>(k: T) => t.blocks.filter((b) => b.type === k) as B<T>[];
  const figs = all("figure"), loose = figs.filter((f) => !f.for);
  const deep = one("deep"), lab = one("lab"), practice = one("practice"), hook = one("hook"), obj = one("objectives"), intu = one("intuition"), def = one("definition"), walk = one("walkthrough"), faded = one("faded"), shortcut = one("shortcut"), gate = one("gate"), recall = one("recall"), links = one("links");
  const qs = all("check").flatMap((c) => c.questions);
  return (
    <article id={t.id} className="scroll-mt-24 space-y-5 lg:scroll-mt-4">
      <header className="lesson-topic-head flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0"><p className="text-xs font-extrabold uppercase tracking-[.12em] text-[var(--st-accent)]">Topic {index + 1}</p>
        <h2 className="font-display text-2xl font-extrabold leading-tight text-[var(--text-primary)] sm:text-[2rem]">{t.title}</h2></div>
        <TopicNav topics={topics} index={index} />
      </header>
      {(hook || obj) && <Sect t={t} k="start" className="grid gap-5 @3xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">{hook && <Hook b={hook} />}{obj && <Objectives b={obj} />}</Sect>}
      {(intu || def) && <Sect t={t} k="idea" className="grid gap-5 @3xl:grid-cols-2">{intu && <Intuition b={intu} />}{def && <Definition b={def} />}</Sect>}
      {deep && <Sect t={t} k="deep"><Deep b={deep} /></Sect>}
      {walk && <Sect t={t} k="method" className="grid gap-5 @3xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"><Walk b={walk} />{loose[0] && <Figure b={loose[0]} />}</Sect>}
      {loose.length > 1 && <div className="grid gap-5 @xl:grid-cols-2">{loose.slice(1).map((f) => <Figure key={f.id} b={f} />)}</div>}
      {all("example").map((ex, i) => {
        const own = figs.filter((f) => f.for === ex.id);
        return <Sect key={ex.id} t={t} k={`ex${i}`} className={`grid gap-5 ${own.length ? "@3xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]" : ""}`}><Example b={ex} />{own.length > 0 && <div className="grid gap-5">{own.map((f) => <Figure key={f.id} b={f} />)}</div>}</Sect>;
      })}
      {lab && <Sect t={t} k="lab">{lab.lab === "rag" ? <RagLab /> : lab.lab === "prevent" ? <PreventLab /> : lab.lab === "banker" ? <BankerLab /> : lab.lab === "detect" ? <DetectLab /> : lab.lab === "count" ? <CountLab /> : lab.lab === "states" ? <ProcessStateLab /> : lab.lab === "fork" ? <ForkLab /> : lab.lab === "threads" ? <ThreadLab /> : lab.lab === "syscall" ? <SyscallLab /> : lab.lab === "sched" ? <SchedLab /> : lab.lab === "sched-prio" ? <SchedLab initial="PRIO" /> : lab.lab === "race" ? <RaceLab /> : lab.lab === "semaphore" ? <SemaphoreLab /> : lab.lab === "buffer" ? <BufferLab /> : lab.lab === "fit" ? <FitLab /> : lab.lab === "paging" ? <PagingLab /> : lab.lab === "tlb" ? <TlbLab /> : lab.lab === "replace" ? <ReplaceLab /> : lab.lab === "disk" ? <DiskLab /> : lab.lab === "alloc" ? <AllocLab /> : lab.lab === "rr" ? <RrLab /> : lab.lab === "pagefault" ? <PageFaultLab /> : lab.lab === "workingset" ? <WorkingSetLab /> : lab.lab === "truth" ? <DmTruthLab /> : lab.lab === "equiv" ? <DmEquivLab /> : lab.lab === "quant" ? <DmQuantLab /> : lab.lab === "fol" ? <DmFolLab /> : lab.lab === "relation" ? <DmRelationLab /> : lab.lab === "funcs" ? <DmFuncLab /> : lab.lab === "hasse" ? <DmHasseLab /> : lab.lab === "lattice" ? <DmLatticeLab /> : lab.lab === "algebra" ? <DmAlgebraLab /> : lab.lab === "cyclic" ? <DmCyclicLab /> : lab.lab === "graph-basic" ? <DmGraphLab /> : lab.lab === "colour" ? <DmColourLab /> : lab.lab === "count-dm" ? <DmCountLab /> : lab.lab === "derange" ? <DmDerangeLab /> : lab.lab === "recur" ? <DmRecurLab /> : lab.lab === "genfun" ? <DmGenFunLab /> : lab.lab === "sched-hrrn" ? <SchedLab initial="HRRN" /> : lab.lab === "mlfq" ? <MlfqLab /> : lab.lab === "pipe" ? <PipeLab /> : lab.lab === "segment" ? <SegmentLab /> : lab.lab === "encap" ? <EncapLab /> : lab.lab === "delay" ? <DelayLab /> : lab.lab === "crc" ? <CrcLab /> : lab.lab === "window" ? <WindowLab /> : lab.lab === "mac" ? <MacLab /> : lab.lab === "subnet" ? <SubnetLab /> : lab.lab === "frag" ? <FragLab /> : lab.lab === "route" ? <RouteLab /> : lab.lab === "seq" ? <SeqLab /> : lab.lab === "cwnd" ? <CwndLab /> : lab.lab === "http" ? <HttpLab /> : lab.lab === "ports" ? <PortsLab /> : <StarveLab />}</Sect>}
      {(faded || shortcut) && <Sect t={t} k="faded" className={`grid gap-5 ${faded && shortcut ? "@3xl:grid-cols-2" : ""}`}>{faded && <Faded b={faded} />}{shortcut && <Shortcut b={shortcut} />}</Sect>}
      {all("trap").length > 0 && <Sect t={t} k="traps" className="grid gap-5 @xl:grid-cols-2 @5xl:grid-cols-3">{all("trap").map((b, i) => <Trap key={i} b={b} />)}</Sect>}
      {(gate || recall) && <Sect t={t} k="gate" className="grid gap-5 @3xl:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">{gate && <Gate b={gate} />}{recall && <Recall b={recall} />}</Sect>}
      {qs.length > 0 && <Sect t={t} k="check"><h3 className="lesson-h flex items-center gap-2"><Check className="h-5 w-5" aria-hidden /> Check yourself</h3><ol className="mt-2 grid gap-4 @5xl:grid-cols-2">{qs.map((q, i) => <CheckQuestion key={q.id} q={q} n={i + 1} />)}</ol></Sect>}
      {(links || practice) && <Sect t={t} k="next" className="space-y-5">{links && <Links b={links} />}{practice && <Practice b={practice} />}</Sect>}
      <nav aria-label="Topic navigation" className="grid gap-3 sm:grid-cols-2">
        {topics[index - 1] ? <button type="button" onClick={() => goTo(topics[index - 1].id)} className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-left hover:bg-[var(--surface-secondary)]"><ChevronLeft className="h-5 w-5 shrink-0" aria-hidden /><span className="min-w-0"><span className="block text-xs font-bold text-[var(--text-secondary)]">Previous topic</span><span className="block font-bold">{topics[index - 1].title}</span></span></button> : <span />}
        {topics[index + 1] && <button type="button" onClick={() => goTo(topics[index + 1].id)} className="flex items-center justify-end gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-right hover:bg-[var(--surface-secondary)]"><span className="min-w-0"><span className="block text-xs font-bold text-[var(--text-secondary)]">Next topic</span><span className="block font-bold">{topics[index + 1].title}</span></span><ChevronRight className="h-5 w-5 shrink-0" aria-hidden /></button>}
      </nav>
    </article>
  );
}

/* ------------------------------------------------------------------ split view (wide screens) */
function SplitPane({ href, onClose }: { href: string; onClose: () => void }) {
  const [loaded, setLoaded] = useState<{ href: string; ch: Chapter } | null>(null);
  useEffect(() => { let live = true; CHAPTERS[href]?.().then((c) => { if (live) setLoaded({ href, ch: c }); }); return () => { live = false; }; }, [href]);
  const ch = loaded?.href === href ? loaded.ch : null;
  if (!ch) return <section aria-label="Loading the second chapter" className="min-h-0 min-w-0 animate-pulse rounded-[22px] border border-[var(--border)] bg-[var(--surface)]/60" />;
  return (
    <section aria-label={`Beside: ${ch.subject}, ${ch.title}`} className="flex min-h-0 min-w-0 flex-col rounded-[22px] border border-[var(--border)] bg-[var(--surface)]/60">
      <header className="flex shrink-0 items-center gap-2 border-b border-[var(--border)] px-4 py-2.5">
        <span className="min-w-0 flex-1"><span className="block text-[10px] font-extrabold uppercase tracking-[.14em] text-[var(--text-secondary)]">{ch.subject}</span><span className="block truncate font-display text-base font-extrabold text-[var(--text-primary)]">{ch.title}</span></span>
        <TopicNav topics={ch.topics} index={-1} menuOnly />
        <Link href={href} aria-label={`Open ${ch.title} on its own`} className="grid h-8 w-8 place-items-center rounded-full hover:bg-[var(--surface-secondary)]"><ExternalLink className="h-4 w-4" /></Link>
        <button type="button" onClick={onClose} aria-label="Close split view" className="grid h-8 w-8 place-items-center rounded-full hover:bg-[var(--surface-secondary)]"><XIcon className="h-4 w-4" /></button>
      </header>
      <div className="@container custom-scrollbar relative min-h-0 flex-1 space-y-12 overflow-y-auto p-4">
        {ch.topics.map((t, i) => <TopicView key={t.id} t={t} index={i} topics={ch.topics} />)}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ chapter */
export function LessonRenderer({ chapter, backHref = "/study" }: { chapter: Chapter; backHref?: string }) {
  const { attach, toolbar, list, count, items } = useLessonHighlights(chapter.id);
  // the rail lists every written topic (not the chapter's summary map, which can lag behind new topics); map subtitles are kept where they line up
  const mapItems = chapter.map.kind === "strip" ? chapter.map.items : [];
  const steps = chapter.topics.map((t, i) => ({ label: `${i + 1}. ${t.title}`, sub: mapItems.length === chapter.topics.length ? mapItems[i]?.sub : undefined, state: "done" as const }));
  const pane = useRef<HTMLDivElement | null>(null);
  const [current, setCurrent] = useState<string>("");
  const [soon, setSoon] = useState<number | null>(null);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [sheet, setSheet] = useState(false);
  const [sheetHost, setSheetHost] = useState<HTMLElement | null>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- the portal target exists only after mount
  useEffect(() => setSheetHost(document.body), []);
  const split = useStudyTabs((x) => x.split);
  const setSplit = useStudyTabs((x) => x.setSplit);
  const [wide, setWide] = useState(false);
  const [splitW, setSplitW] = useState(55); // % of the reading area for the current chapter
  const [railShut, setRailShut] = useState<boolean | null>(null); // null = automatic (folded while split)
  useEffect(() => { const m = window.matchMedia("(min-width: 1280px)"); const f = () => setWide(m.matches); f(); m.addEventListener("change", f); return () => m.removeEventListener("change", f); }, []);
  const dragSplit = (e: React.PointerEvent<HTMLDivElement>) => {
    const box = (e.currentTarget.parentElement as HTMLElement).getBoundingClientRect();
    const move = (ev: PointerEvent) => setSplitW(Math.min(72, Math.max(30, ((ev.clientX - box.left) / box.width) * 100)));
    document.body.style.userSelect = "none"; window.getSelection()?.removeAllRanges();
    const up = () => { document.body.style.userSelect = ""; window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
  };
  // hide the floating tools while the contents sheet is open on a phone
  useEffect(() => { if (sheet) document.body.dataset.lessonSheet = "1"; else delete document.body.dataset.lessonSheet; return () => { delete document.body.dataset.lessonSheet; }; }, [sheet]);
  const railRef = useRef<HTMLOListElement | null>(null);
  // keep the outline on the reader's place: scroll the active section (or its topic) into the middle of the rail
  useEffect(() => {
    const rail = railRef.current; if (!rail || !current) return;
    const el = rail.querySelector<HTMLElement>('[aria-current="location"]'); if (!el) return;
    const r = el.getBoundingClientRect(), b = rail.getBoundingClientRect();
    if (r.top < b.top + 40 || r.bottom > b.bottom - 40) rail.scrollTo({ top: rail.scrollTop + (r.top - b.top) - b.height / 2 + r.height / 2, behavior: "smooth" });
  }, [current]);
  const bind = (el: HTMLDivElement | null) => { pane.current = el; attach(el); };
  const href = usePathname() ?? "/study";
  const tab = useMemo(() => ({ href, title: chapter.title, subject: chapter.subject, tint: CS_SHELF.find((b) => b.chapters.some((c) => c.href === href))?.tint }), [href, chapter.title, chapter.subject]);
  // the page panel and navbar take the book colour from the URL (lib/study/catalog bookTintFor), so nothing flashes
  // each tab returns to where you were reading
  useEffect(() => {
    const el = pane.current; if (!el) return;
    const top = recallScroll(href); if (top) requestAnimationFrame(() => { el.scrollTop = top; });
    let raf = 0;
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => rememberScroll(href, el.scrollTop)); };
    el.addEventListener("scroll", on, { passive: true });
    return () => { el.removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, [href]);

  // follow the reader: the last section whose top has passed the upper third of the visible reading area
  useEffect(() => {
    const root = pane.current;
    if (!root) return;
    const scroller: HTMLElement = getComputedStyle(root).overflowY === "auto" ? root : (document.getElementById("app-scroll") ?? document.documentElement);
    const secs = [...root.querySelectorAll<HTMLElement>("[data-sec]")];
    let raf = 0;
    const pick = () => {
      const box = scroller.getBoundingClientRect();
      const line = box.top + box.height * 0.33;
      let cur = secs[0];
      for (const s of secs) { if (s.getBoundingClientRect().top <= line) cur = s; else break; }
      if (cur) setCurrent((c) => (c === cur.id ? c : cur.id));
    };
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(pick); };
    scroller.addEventListener("scroll", on, { passive: true });
    pick();
    return () => { scroller.removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, [chapter]);

  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wasSheet = sheet;
    setSheet(false);
    // after the sheet has closed (its re-render would interrupt a smooth scroll)
    setTimeout(() => el.scrollIntoView({ behavior: reduce || wasSheet ? "auto" : "smooth", block: "start" }), wasSheet ? 80 : 0);
    setCurrent(id);
  };

  const other = split && split.includes(href) ? (split[0] === href ? split[1] : split[0]) : null;
  const splitHref = wide && other && CHAPTERS[other] ? other : null;
  const folded = (railShut ?? !!splitHref);
  const topicIdx = Math.max(0, chapter.topics.findIndex((x) => current.startsWith(`${x.id}--`)));
  const written = chapter.topics.length;
  const outlineInner = (
    <>
        <div className="shrink-0 pb-3">
        {sheet && <button type="button" onClick={() => setSheet(false)} className="float-right grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] lg:hidden" aria-label="Close contents"><ChevronDown className="h-4 w-4" /></button>}
        <p className="text-[11px] font-extrabold uppercase tracking-[.14em] text-[var(--st-accent)]">{chapter.subject}</p>
        <p className="font-display text-2xl font-extrabold text-[var(--text-primary)]">{chapter.title}</p>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-secondary)]"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${((topicIdx + 1) / Math.max(1, written)) * 100}%`, background: "var(--st-accent)" }} /></div>
          <span className="font-num text-[11px] font-bold text-[var(--st-accent)]">Topic {topicIdx + 1}/{written}</span>
          <button type="button" onClick={() => setRailShut(true)} aria-label="Fold the outline" title="Fold the outline" className="hidden h-7 w-7 place-items-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] lg:grid"><ChevronsLeft className="h-4 w-4" /></button>
        </div>
        </div>
        <ol ref={railRef} className="no-scrollbar min-h-0 space-y-2 lg:flex-1 lg:overflow-y-auto lg:pr-2">
          {steps.map((s, i) => {
            const t = chapter.topics[i];
            if (!t) return (
              <li key={i}>
                <button type="button" onClick={() => setSoon((x) => (x === i ? null : i))} aria-expanded={soon === i}
                  className="flex w-full items-start gap-3 rounded-xl border-2 border-dashed border-[var(--border)] px-2 py-2 text-left transition-colors hover:border-[var(--text-secondary)]">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-[var(--border)] text-[11px] font-bold text-[var(--text-secondary)]">{i + 1}</span>
                  <span className="min-w-0"><span className="block text-sm font-bold text-[var(--text-secondary)]">{s.label.replace(/^\d+\.\s*/, "")}</span><span className="block text-xs text-[var(--text-muted,var(--text-secondary))]">{s.sub}</span></span>
                </button>
                {soon === i && <p className="mx-2 mb-1 rounded-xl bg-[var(--surface-secondary)] px-3 py-2 text-xs text-[var(--text-secondary)]">Being written. It opens here as soon as it passes review.</p>}
              </li>
            );
            const secs = sectionsOf(t);
            const curIdx = Math.max(0, chapter.topics.findIndex((x) => current.startsWith(`${x.id}--`)));
            const inTopic = i === curIdx;
            const passed = i < curIdx;
            const expanded = open[t.id] ?? inTopic;
            return (
              <li key={i}>
                <div className={`flex w-full items-start gap-2 rounded-xl border-2 px-2 py-2 transition-colors ${inTopic ? "border-[var(--st-accent)]" : passed ? "border-dashed border-[var(--st-accent)] bg-[color-mix(in_srgb,var(--st-accent)_7%,transparent)]" : "border-dashed border-[var(--border)] hover:border-[var(--text-secondary)]"}`}>
                  <button type="button" onClick={() => { setOpen((x) => ({ ...x, [t.id]: true })); go(t.id); }} className="flex min-w-0 flex-1 items-start gap-3 text-left">
                    <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-bold ${passed ? "border-2 border-[var(--st-accent)] text-[var(--st-accent)]" : "bg-[var(--st-accent)] text-[var(--surface)]"}`}>{passed ? <Check className="h-3.5 w-3.5" aria-label="Read" /> : i + 1}</span>
                    <span className="min-w-0"><span className="block text-sm font-bold text-[var(--text-primary)]">{s.label.replace(/^\d+\.\s*/, "")}</span><span className="block text-xs text-[var(--text-secondary)]">{passed ? "Read" : s.sub}</span></span>
                  </button>
                  <button type="button" onClick={() => setOpen((x) => ({ ...x, [t.id]: !expanded }))} aria-expanded={expanded} aria-label={`${expanded ? "Hide" : "Show"} sections of ${s.label}`} className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]"><ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} /></button>
                </div>
                {expanded && <ol className="ml-5 mt-1 border-l-2 border-[var(--border)] py-1">
                  {secs.map((x) => {
                    const id = secId(t, x.key); const on = current === id;
                    return (
                      <li key={x.key}>
                        <button type="button" onClick={() => go(id)} aria-current={on ? "location" : undefined}
                          className={`relative -ml-[2px] block w-full border-l-2 py-1.5 pl-3 pr-2 text-left text-[13px] leading-snug transition-colors ${on ? "border-[var(--st-accent)] font-bold text-[var(--text-primary)]" : "border-transparent text-[var(--text-secondary)] hover:border-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
                          {on && <motion.span layoutId="lesson-outline-pill" aria-hidden className="absolute inset-0 rounded-r-lg" style={{ background: "color-mix(in srgb, var(--st-accent) 10%, transparent)" }} transition={{ type: "spring", stiffness: 480, damping: 38 }} />}
                          <span className="relative">{x.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ol>}
              </li>
            );
          })}
        </ol>
    </>
  );
  return (
    <div className={`study-lesson grid gap-6 lg:h-[calc(100dvh-var(--lesson-chrome,10.5rem))] lg:grid-rows-[auto_minmax(0,1fr)] lg:gap-y-4 ${folded ? "lg:grid-cols-[3.5rem_minmax(0,1fr)] lg:gap-x-4" : "lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-x-8"}`} style={{ ["--st-accent" as string]: tab.tint ? `var(--tint-${tab.tint}-ink)` : "#c2410c" }}>
      <div className="flex min-w-0 items-end gap-2 lg:col-span-2"><Link href={backHref} aria-label="Back to all books" title="Back to all books" className="pill-ink mb-1 inline-flex shrink-0 items-center gap-1.5" style={{ ["--btn" as string]: "var(--st-accent)" }}><ArrowLeft className="h-4 w-4" aria-hidden /> Books</Link><div className="min-w-0 flex-1"><StudyTabs current={tab} /></div></div>
      {/* phones: a sticky bar shows where you are; the outline opens as a bottom sheet */}
      <div className="sticky top-0 z-30 -mx-1 flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 shadow-[0_8px_20px_-14px_rgba(0,0,0,.4)] lg:hidden">
        <span className="min-w-0 flex-1"><span className="block text-[10px] font-extrabold uppercase tracking-[.14em] text-[var(--st-accent)]">{chapter.subject} · {chapter.title}</span><span className="block truncate text-sm font-bold text-[var(--text-primary)]">{(() => { const t = chapter.topics.find((x) => current.startsWith(`${x.id}--`)) ?? chapter.topics[0]; const sec = t ? sectionsOf(t).find((x) => secId(t, x.key) === current) : null; return sec ? sec.label : t?.title; })()}</span></span>
        <button type="button" onClick={() => setSheet(true)} className="pill-ink !h-9 shrink-0 !px-3" style={{ ["--btn" as string]: "var(--st-accent)" }}>Contents</button>
      </div>
      {folded && (
        <div className="hidden min-h-0 flex-col items-center gap-2 lg:flex">
          <button type="button" onClick={() => setRailShut(false)} aria-label="Unfold the outline" title="Unfold the outline" className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"><ChevronsRight className="h-4 w-4" /></button>
          <div className="relative flex flex-1 flex-col items-center gap-2 py-2">
            <span aria-hidden className="absolute bottom-2 top-2 w-1 rounded-full bg-[var(--surface-secondary)]"><span className="block w-full rounded-full transition-all duration-500" style={{ height: `${((topicIdx + 1) / Math.max(1, written)) * 100}%`, background: "var(--st-accent)" }} /></span>
            {chapter.topics.map((t, i) => (
              <button key={t.id} type="button" onClick={() => go(t.id)} aria-label={`Topic ${i + 1}: ${t.title}`} title={t.title}
                className={`relative z-10 grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${i === topicIdx ? "bg-[var(--st-accent)] text-[var(--surface)]" : i < topicIdx ? "border-2 border-[var(--st-accent)] bg-[var(--surface)] text-[var(--st-accent)]" : "border-2 border-dashed border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)]"}`}>
                {i < topicIdx ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
      <nav aria-label="Chapter outline" className={`${folded ? "lg:!hidden" : ""} relative hidden min-h-0 flex-col lg:flex`}>
{outlineInner}      </nav>
      {sheet && sheetHost && createPortal(
        <>
          <div aria-hidden className="fixed inset-0 z-[600] bg-black/40 lg:hidden" onClick={() => setSheet(false)} />
          <nav aria-label="Chapter outline" className="fixed inset-x-2 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] z-[610] flex max-h-[68dvh] flex-col overflow-y-auto rounded-3xl bg-[var(--surface)] p-4 shadow-2xl lg:hidden" style={{ ["--st-accent" as string]: tab.tint ? `var(--tint-${tab.tint}-ink)` : "#c2410c" }}>
{outlineInner}          </nav>
        </>, sheetHost)}
      <div className={splitHref ? "grid min-h-0 min-w-0 gap-0" : "contents"} style={splitHref ? { gridTemplateColumns: `minmax(0,${splitW}fr) 14px minmax(0,${100 - splitW}fr)`, gridTemplateRows: "minmax(0,1fr)" } : undefined}>
      <div ref={bind} className="@container custom-scrollbar relative min-w-0 space-y-14 lg:overflow-y-auto lg:overscroll-contain lg:px-3 lg:pb-28 lg:pt-2">
        {chapter.topics.map((t, i) => <TopicView key={t.id} t={t} index={i} topics={chapter.topics} />)}
      </div>
      {splitHref && <>
        <div role="separator" aria-orientation="vertical" aria-label="Drag to resize the two chapters" tabIndex={0} onPointerDown={dragSplit}
          onKeyDown={(e) => { if (e.key === "ArrowLeft") setSplitW((w) => Math.max(30, w - 4)); if (e.key === "ArrowRight") setSplitW((w) => Math.min(72, w + 4)); }}
          className="group flex cursor-col-resize items-center justify-center"><span className="h-16 w-1.5 rounded-full bg-[var(--border)] transition-colors group-hover:bg-[var(--st-accent)] group-focus-visible:bg-[var(--st-accent)]" /></div>
        <SplitPane href={splitHref} onClose={() => setSplit(null)} />
      </>}
      </div>
      <LessonTools lesson={`${chapter.subject}: ${chapter.title}`} section={chapter.topics.find((t) => current.startsWith(`${t.id}--`))?.title ?? chapter.topics[0]?.title ?? chapter.title} pyqTopic={chapter.pyqTopic} notes={list} noteCount={count} noteItems={items} />
      {toolbar}
    </div>
  );
}
