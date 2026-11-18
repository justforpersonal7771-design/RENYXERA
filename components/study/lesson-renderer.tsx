"use client";

/**
 * Renders a study chapter from data (lib/study/schema.ts). Uses the full width (owner, 18 Nov): each topic is laid out
 * in rows: hook beside objectives, idea beside definition, method beside its figure, every worked example beside its own
 * figures, traps in a row, GATE note beside recall cards, questions two across. Blocks use the app's pastel card system
 * (one tint per block kind) so lessons look like the rest of RENYXERA in light and dark.
 */
import { useState, type ReactNode } from "react";
import { ArrowUpRight, Check, CircleCheck, CircleX, Lightbulb, Link2, Repeat, RotateCcw, Target, TriangleAlert, Zap } from "lucide-react";
import type { Block, Chapter, CheckQ, Topic } from "@/lib/study/schema";
import { Diagram } from "@/components/study/diagram";
import { RagLab } from "@/components/study/rag-lab";
import { LessonRail } from "@/components/study/lesson-rail";
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
  const right = shown && mine === q.answer;
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

/* ------------------------------------------------------------------ topic layout in rows */
function TopicView({ t, index }: { t: Topic; index: number }) {
  const one = <T extends Block["type"]>(k: T) => t.blocks.find((b) => b.type === k) as B<T> | undefined;
  const all = <T extends Block["type"]>(k: T) => t.blocks.filter((b) => b.type === k) as B<T>[];
  const figs = all("figure"), loose = figs.filter((f) => !f.for);
  const lab = one("lab"), practice = one("practice"), hook = one("hook"), obj = one("objectives"), intu = one("intuition"), def = one("definition"), walk = one("walkthrough"), faded = one("faded"), shortcut = one("shortcut"), gate = one("gate"), recall = one("recall"), links = one("links");
  const qs = all("check").flatMap((c) => c.questions);
  return (
    <article id={t.id} className="scroll-mt-24 space-y-5">
      <h2 className="font-display text-2xl font-extrabold text-[var(--text-primary)] sm:text-3xl">{index + 1}. {t.title}</h2>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">{hook && <Hook b={hook} />}{obj && <Objectives b={obj} />}</div>
      <div className="grid gap-5 lg:grid-cols-2">{intu && <Intuition b={intu} />}{def && <Definition b={def} />}</div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">{walk && <Walk b={walk} />}{loose[0] && <Figure b={loose[0]} />}</div>
      {loose.length > 1 && <div className="grid gap-5 md:grid-cols-2">{loose.slice(1).map((f) => <Figure key={f.id} b={f} />)}</div>}
      {all("example").map((ex) => {
        const own = figs.filter((f) => f.for === ex.id);
        return <div key={ex.id} className={`grid gap-5 ${own.length ? "lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]" : ""}`}><Example b={ex} />{own.length > 0 && <div className="grid gap-5">{own.map((f) => <Figure key={f.id} b={f} />)}</div>}</div>;
      })}
      {lab && <RagLab />}
      {(faded || shortcut) && <div className={`grid gap-5 ${faded && shortcut ? "lg:grid-cols-2" : ""}`}>{faded && <Faded b={faded} />}{shortcut && <Shortcut b={shortcut} />}</div>}
      {all("trap").length > 0 && <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{all("trap").map((b, i) => <Trap key={i} b={b} />)}</div>}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">{gate && <Gate b={gate} />}{recall && <Recall b={recall} />}</div>
      {qs.length > 0 && <section><h3 className="lesson-h flex items-center gap-2"><Check className="h-5 w-5" aria-hidden /> Check yourself</h3><ol className="mt-2 grid gap-4 xl:grid-cols-2">{qs.map((q, i) => <CheckQuestion key={q.id} q={q} n={i + 1} />)}</ol></section>}
      {links && <Links b={links} />}
      {practice && <Practice b={practice} />}
    </article>
  );
}

/* ------------------------------------------------------------------ chapter */
export function LessonRenderer({ chapter }: { chapter: Chapter }) {
  const { attach, toolbar, list } = useLessonHighlights(chapter.id);
  const written = new Set(chapter.topics.map((_, i) => i));
  const steps = chapter.map.kind === "strip" ? chapter.map.items : [];
  return (
    <div className="study-lesson grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)] xl:grid-cols-[14rem_minmax(0,1fr)_20rem]" style={{ ["--st-accent" as string]: "#c2410c" }}>
      <nav aria-label="Chapter topics" className="lg:sticky lg:top-24 lg:self-start">
        <p className="text-xs font-bold text-[var(--text-secondary)]">{chapter.subject}</p>
        <p className="font-display text-2xl font-extrabold text-[var(--text-primary)]">{chapter.title}</p>
        <ol className="relative mt-4 space-y-3 border-l-2 border-[var(--border)] pl-5">
          {steps.map((s, i) => {
            const ready = written.has(i);
            const inner = <><span className={`absolute -left-[9px] mt-1 h-4 w-4 rounded-full border-2 ${ready ? "border-[var(--st-accent)] bg-[var(--st-accent)]" : "border-[var(--border)] bg-[var(--background)]"}`} aria-hidden /><span className="block text-sm font-bold text-[var(--text-primary)]">{s.label}</span><span className="block text-xs text-[var(--text-secondary)]">{ready ? s.sub : `${s.sub}, being written`}</span></>;
            return <li key={i} className={ready ? "" : "opacity-60"}>{ready ? <a href={`#${chapter.topics[i].id}`} className="block">{inner}</a> : <span className="block">{inner}</span>}</li>;
          })}
        </ol>
      </nav>
      <div ref={attach} className="min-w-0 space-y-14">
        {chapter.topics.map((t, i) => <TopicView key={t.id} t={t} index={i} />)}
      </div>
      <div className="lg:col-span-2 xl:col-span-1">
        <LessonRail lesson={`${chapter.subject}: ${chapter.title}`} topic={chapter.topics[0]?.title ?? chapter.title} pyqTopic={chapter.pyqTopic} notes={list} />
      </div>
      {toolbar}
    </div>
  );
}
