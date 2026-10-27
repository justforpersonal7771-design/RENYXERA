"use client";

/**
 * Forge (R11): original GATE-level questions. Free: Forge Mocks only. Plus: 10 a day, no archive, no X.
 * Pro: everything. Runs on sample data until the CS batches are seeded (lib/preview/features.ts).
 */
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Anvil, CalendarDays, Check, X, ChevronDown, Flame, Lock, Lightbulb, Trophy, TriangleAlert, Users } from "lucide-react";
import { PreviewFrame } from "@/components/preview/preview-frame";
import { FolderTabs, Segmented } from "@/components/ui/folder-tabs";
import { UPCOMING } from "@/lib/preview/features";
import { FORGE, type Tier } from "@/lib/billing/plans";
import { FORGE_DAILY, FORGE_ITEMS, FORGE_MOCKS, KIND_LABEL, type SampleForgeItem } from "@/lib/preview/sample-data";

const DIFF: Record<string, { label: string; tint: string }> = { E: { label: "Easy", tint: "mint" }, M: { label: "Medium", tint: "butter" }, H: { label: "Hard", tint: "rose" } };
type Tab = "daily" | "practice" | "mocks" | "archive";

export default function ForgePage() {
  return (
    <div className="space-y-6 pb-8">
      <PreviewFrame state={UPCOMING.forge} name="Forge" when="Original GATE-level questions, a Daily Forge and Forge Mocks. CS first, then every branch.">
        {(tier) => <Forge tier={tier} />}
      </PreviewFrame>
    </div>
  );
}

function Forge({ tier }: { tier: Tier }) {
  const [tab, setTab] = useState<Tab>("daily");
  const rules = FORGE[tier];
  return (
    <>
      <Hero tier={tier} />
      <FolderTabs label="Forge sections" value={tab} onChange={setTab} tabs={[
        { id: "daily", label: "Daily Forge" }, { id: "practice", label: "Practice" },
        { id: "mocks", label: "Forge Mocks" }, { id: "archive", label: <span className="inline-flex items-center gap-1.5">Archive {!rules.archive && <Lock className="h-3.5 w-3.5" />}</span> },
      ]}>
        {tab === "daily" && (rules.questions ? <Daily tier={tier} /> : <Locked plan="Plus" what="The Daily Forge and Forge practice questions come with Plus and Pro. Forge Mocks stay free for everyone." />)}
        {tab === "practice" && (rules.questions ? <Practice tier={tier} /> : <Locked plan="Plus" what="Practise Forge questions by subject, topic and difficulty with Plus or Pro." />)}
        {tab === "mocks" && <Mocks />}
        {tab === "archive" && (rules.archive ? <Practice tier={tier} archive /> : <Locked plan="Pro" what="Every past Daily Forge, plus the hardest X questions, is in the archive with Pro." />)}
      </FolderTabs>
    </>
  );
}

function Hero({ tier }: { tier: Tier }) {
  const d = FORGE_DAILY;
  const pct = Math.round((d.doneToday / d.total) * 100);
  return (
    <section className="card-pastel metal overflow-hidden p-6 sm:p-8" data-tint="peach" aria-label="Forge">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        <div>
          <span className="section-label"><Anvil className="h-3.5 w-3.5" /> Forge</span>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-[1.08] text-[var(--text-primary)] sm:text-5xl">New questions,<br />built like GATE.</h1>
          <p className="mt-3 max-w-xl text-[var(--text-secondary)]">Written from ten years of official papers: the same topics, weights and traps, with numbers you have never seen. Every answer is checked by code before it reaches you.</p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {FORGE[tier].questions
              ? <button type="button" className="btn-main"><Flame className="h-4 w-4" /> Continue today&apos;s Forge</button>
              : <Link href="/pro" className="btn-main"><Lock className="h-4 w-4" /> Unlock with Plus</Link>}
            <span className="pill-soft"><Users className="h-4 w-4" /> {d.boardSize.toLocaleString()} students today</span>
          </div>
        </div>
        <div className="card-inset grid grid-cols-3 gap-3 p-5 text-center">
          <Stat big={`${d.streak}`} unit="days" label="Streak" icon={<Flame className="h-4 w-4 text-orange-500" />} />
          <Stat big={`${d.doneToday}/${d.total}`} label="Today" />
          <Stat big={`#${d.boardRank}`} label="Board" icon={<Trophy className="h-4 w-4 text-[var(--tint-lilac-ink)]" />} />
          <div className="col-span-3 mt-1 h-2 overflow-hidden rounded-full bg-[var(--surface-secondary)]" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Today's progress">
            <div className="h-full rounded-full bg-orange-500" style={{ width: `${pct}%` }} />
          </div>
          <p className="col-span-3 text-xs text-[var(--text-muted)]">New set every day at 6:00 AM. Best streak {d.best} days.</p>
        </div>
      </div>
    </section>
  );
}

function Stat({ big, unit, label, icon }: { big: string; unit?: string; label: string; icon?: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-center gap-1">{icon}<span className="font-num text-2xl font-extrabold text-[var(--text-primary)]">{big}</span>{unit && <span className="text-xs text-[var(--text-muted)]">{unit}</span>}</div>
      <p className="text-xs font-semibold text-[var(--text-muted)]">{label}</p>
    </div>
  );
}

function Daily({ tier }: { tier: Tier }) {
  const limit = FORGE[tier].dailyLimit;
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
      <div className="space-y-3">
        {FORGE_ITEMS.map((q, i) => <ItemCard key={q.id} q={q} n={i + 1} done={i < FORGE_DAILY.doneToday} />)}
      </div>
      <aside className="space-y-3">
        <div className="card-pastel p-5" data-tint="butter">
          <p className="font-bold text-[var(--text-primary)]">Your plan</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{limit === null ? "Unlimited Forge questions, the archive and X questions." : `${limit} Forge questions a day. The archive and X questions come with Pro.`}</p>
          {limit !== null && <Link href="/pro" className="mt-3 inline-flex text-sm font-bold text-[var(--tint-butter-ink)] underline underline-offset-4">See Pro</Link>}
        </div>
        <div className="card-pastel p-5" data-tint="mint">
          <p className="font-bold text-[var(--text-primary)]">How Forge is made</p>
          <ol className="mt-2 space-y-2 text-sm text-[var(--text-secondary)]">
            {["Topic weights from every official paper", "Written to GATE's style and traps", "Answer re-computed by code", "Checked against PYQs so none is a copy"].map((s, i) => (
              <li key={s} className="flex gap-2"><span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--surface)] font-num text-xs font-bold">{i + 1}</span>{s}</li>
            ))}
          </ol>
        </div>
      </aside>
    </div>
  );
}

function ItemCard({ q, n, done }: { q: SampleForgeItem; n: number; done?: boolean }) {
  const [open, setOpen] = useState(false);
  const [pick, setPick] = useState<string | null>(null);
  const [nat, setNat] = useState("");
  const [checked, setChecked] = useState(false);
  const reduce = useReducedMotion();
  // NAT: right if within 0.5% of the key (GATE gives a range; the real items carry their own range).
  const right = q.type === "NAT" ? Math.abs(Number(nat) - Number(q.answer)) <= Math.abs(Number(q.answer)) * 0.005 + 1e-9 : pick === q.answer;
  const canCheck = q.type === "NAT" ? nat.trim() !== "" && !Number.isNaN(Number(nat)) : !!pick;
  const d = DIFF[q.difficulty];
  return (
    <article className="rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-5">
      <header className="flex flex-wrap items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--ink)] font-num text-xs font-bold text-[var(--background)]">{done ? <Check className="h-3.5 w-3.5" /> : n}</span>
        <span className="text-sm font-bold text-[var(--text-primary)]">{q.topic}</span>
        <span className="text-xs text-[var(--text-muted)]">{q.subject}</span>
        <span className="ml-auto flex flex-wrap gap-1.5">
          <Chip tint="peach">{KIND_LABEL[q.kind]}</Chip>
          <Chip tint={d.tint}>{d.label}</Chip>
          <Chip tint="sky">{q.type} · {q.marks} {q.marks === 1 ? "mark" : "marks"}</Chip>
        </span>
      </header>
      <p className="mt-3 leading-relaxed text-[var(--text-primary)]">{q.text}</p>
      {q.options && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label={`Options for question ${n}`}>
          {q.options.map((o, i) => {
            const id = "ABCD"[i];
            const sel = pick === id;
            // After checking: the key turns green, a wrong pick turns red. Before: the pick is a light-blue chip.
            const state = checked ? (id === q.answer ? "right" : sel ? "wrong" : "idle") : sel ? "picked" : "idle";
            const look = {
              right: "border-emerald-400 bg-[var(--tint-mint)] text-[var(--text-primary)]",
              wrong: "border-rose-400 bg-[var(--tint-rose)] text-[var(--text-primary)]",
              picked: "border-[var(--tint-lilac-ink)] bg-[var(--tint-lilac)] text-[var(--text-primary)]",
              idle: "border-[var(--border)] hover:border-[var(--text-secondary)]",
            }[state];
            return (
              <button key={id} type="button" role="radio" aria-checked={sel} disabled={checked} onClick={() => setPick(id)}
                className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left text-sm transition-colors disabled:cursor-default ${look}`}>
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg font-num text-xs font-bold ${state === "right" ? "bg-emerald-500 text-white" : state === "wrong" ? "bg-rose-500 text-white" : state === "picked" ? "bg-[var(--tint-lilac-ink)] text-white" : "border border-[var(--border)]"}`}>
                  {state === "right" ? <Check className="h-3.5 w-3.5" /> : state === "wrong" ? <X className="h-3.5 w-3.5" /> : id}</span>{o}
              </button>
            );
          })}
        </div>
      )}
      {q.type === "NAT" && (
        <label className="mt-3 flex max-w-sm items-center gap-2">
          <span className="sr-only">Your answer</span>
          <input inputMode="decimal" value={nat} disabled={checked} onChange={(e) => setNat(e.target.value.replace(/[^0-9.\-]/g, ""))} placeholder="Type your answer"
            className={`h-11 w-full rounded-2xl border-2 bg-[var(--surface)] px-4 font-num text-[var(--text-primary)] outline-none transition-colors ${checked ? (right ? "border-emerald-400 bg-[var(--tint-mint)]" : "border-rose-400 bg-[var(--tint-rose)]") : "border-[var(--border)] focus:border-[var(--tint-lilac-ink)]"}`} />
        </label>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {!checked
          ? <button type="button" disabled={!canCheck} onClick={() => { setChecked(true); setOpen(true); }} className="pill-ink disabled:opacity-40">Check answer</button>
          : <p role="status" className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold ${right ? "bg-[var(--tint-mint)] text-[var(--tint-mint-ink)]" : "bg-[var(--tint-rose)] text-[var(--tint-rose-ink)]"}`}>
              {right ? <><Check className="h-4 w-4" /> Correct</> : <><X className="h-4 w-4" /> Not quite: the answer is {q.answer}</>}</p>}
        {checked && <button type="button" onClick={() => { setChecked(false); setPick(null); setNat(""); }} className="text-sm font-semibold text-[var(--text-muted)] underline underline-offset-4">Try again</button>}
      </div>
      <footer className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
        <span>{q.solvedBy} solved · {q.accuracy}% right</span>
        <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="ml-auto inline-flex items-center gap-1 rounded-full bg-[var(--surface-secondary)] px-3 py-1.5 text-sm font-semibold text-[var(--text-primary)]">
          {open ? "Hide solution" : "Show solution"} <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </footer>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={reduce ? undefined : { height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="mt-4 space-y-3 rounded-2xl bg-[var(--surface-secondary)] p-4 text-sm">
              <p className="font-bold text-[var(--text-primary)]">Answer: <span className="font-num">{q.answer}</span></p>
              <ol className="space-y-1.5 text-[var(--text-secondary)]">{q.solution.steps.map((s, i) => <li key={i} className="flex gap-2"><span className="font-num font-bold text-[var(--text-primary)]">{i + 1}.</span>{s}</li>)}</ol>
              <p className="flex gap-2 text-[var(--text-secondary)]"><Lightbulb className="h-4 w-4 shrink-0 text-amber-500" /><span><b className="text-[var(--text-primary)]">Shortcut:</b> {q.solution.shortcut}</span></p>
              <p className="flex gap-2 text-[var(--text-secondary)]"><TriangleAlert className="h-4 w-4 shrink-0 text-rose-500" /><span><b className="text-[var(--text-primary)]">Trap:</b> {q.solution.trap}</span></p>
              <button type="button" className="text-xs font-semibold text-[var(--text-muted)] underline underline-offset-4">Report an issue</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

function Chip({ tint, children }: { tint: string; children: React.ReactNode }) {
  return <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: `var(--tint-${tint})`, color: `var(--tint-${tint}-ink)` }}>{children}</span>;
}

function Practice({ tier, archive }: { tier: Tier; archive?: boolean }) {
  const [diff, setDiff] = useState<"all" | "E" | "M" | "H">("all");
  const subjects = [...new Set(FORGE_ITEMS.map((q) => q.subject))];
  const [subject, setSubject] = useState<string>("all");
  const list = FORGE_ITEMS.filter((q) => (diff === "all" || q.difficulty === diff) && (subject === "all" || q.subject === subject));
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented label="Difficulty" value={diff} onChange={setDiff} options={[{ id: "all", label: "All" }, { id: "E", label: "Easy" }, { id: "M", label: "Medium" }, { id: "H", label: "Hard" }]} />
        <div className="flex flex-wrap gap-1.5">
          {["all", ...subjects].map((s) => (
            <button key={s} type="button" onClick={() => setSubject(s)} aria-pressed={subject === s}
              className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${subject === s ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--background)]" : "border-[var(--border)] text-[var(--text-secondary)]"}`}>{s === "all" ? "All subjects" : s}</button>
          ))}
        </div>
        {archive && <span className="ml-auto text-sm text-[var(--text-muted)]">{tier === "pro" ? "Includes X questions" : ""}</span>}
      </div>
      <div className="space-y-3">{list.map((q, i) => <ItemCard key={q.id} q={q} n={i + 1} />)}</div>
      {list.length === 0 && <p className="card-inset p-6 text-center text-sm text-[var(--text-secondary)]">No questions match these filters. Try another difficulty.</p>}
    </div>
  );
}

function Mocks() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {FORGE_MOCKS.map((m) => (
        <article key={m.id} className="card-pastel flex flex-col p-5" data-tint={m.state === "done" ? "mint" : "peri"}>
          <span className="section-label w-fit">{m.state === "done" ? "Finished" : "Upcoming"}</span>
          <h3 className="mt-3 font-display text-xl font-extrabold text-[var(--text-primary)]">{m.title}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--text-secondary)]"><CalendarDays className="h-4 w-4" /> {m.date}</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{m.questions} questions · {m.marks} marks · 3 hours</p>
          <div className="mt-auto pt-4">
            {m.state === "done"
              ? <p className="text-sm"><span className="font-num text-2xl font-extrabold text-[var(--text-primary)]">{m.score}</span> <span className="text-[var(--text-muted)]">marks · rank #{m.rank} of {m.registered}</span></p>
              : <button type="button" className="pill-ink">Register free · {m.registered.toLocaleString()} in</button>}
          </div>
        </article>
      ))}
    </div>
  );
}

function Locked({ plan, what }: { plan: string; what: string }) {
  return (
    <div className="relative overflow-hidden rounded-[22px]">
      <div aria-hidden className="pointer-events-none select-none space-y-3 blur-[5px] opacity-50">
        {FORGE_ITEMS.slice(0, 2).map((q, i) => <ItemCard key={q.id} q={q} n={i + 1} />)}
      </div>
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="card-pastel max-w-sm p-6 text-center" data-tint="butter">
          <Lock className="mx-auto h-6 w-6 text-[var(--tint-butter-ink)]" />
          <p className="mt-2 font-display text-xl font-extrabold text-[var(--text-primary)]">Included with {plan}</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{what}</p>
          <Link href="/pro" className="btn-main mt-4">See {plan}</Link>
        </div>
      </div>
    </div>
  );
}
