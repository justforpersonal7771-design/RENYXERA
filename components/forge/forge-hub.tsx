"use client";

/**
 * Forge hub (R11): original GATE-level questions. Free: Forge Mocks only. Plus: 10 a day + bookmarks, no X.
 * Pro: everything. Runs on sample data until the CS batches are seeded (lib/preview/features.ts).
 */
import { useEffect, useState, useSyncExternalStore } from "react";
import { MathJax } from "better-react-mathjax";
import { isNatCorrect, isOptionsCorrect } from "@/lib/grading";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Anvil, Bookmark, BookmarkCheck, CalendarDays, Check, X, ChevronDown, Flame, Lock, Lightbulb, Trophy, TriangleAlert, Users } from "lucide-react";
import { PreviewFrame } from "@/components/preview/preview-frame";
import { PlanCompare } from "@/components/preview/plan-compare";
import { FolderTabs, Segmented } from "@/components/ui/folder-tabs";
import { UPCOMING } from "@/lib/preview/features";
import { FORGE, type Tier } from "@/lib/billing/plans";
import { FORGE_DAILY, FORGE_ITEMS, FORGE_MOCKS, KIND_LABEL, type SampleForgeItem } from "@/lib/preview/sample-data";

/** A Forge question as the hub shows it. Preview items carry their answer; live items don't until the student checks (answers stay on the server). */
type Q = Omit<SampleForgeItem, "answer" | "solution" | "solvedBy" | "accuracy" | "difficulty" | "type"> & {
  type: "MCQ" | "MSQ" | "NAT"; difficulty: "E" | "M" | "H" | "X"; answer?: string; solution?: SampleForgeItem["solution"]; solvedBy?: number; accuracy?: number;
};
const LIVE = UPCOMING.forge === "live";
type Row = { id: string; subject: string; topic: string; kind: Q["kind"]; difficulty: Q["difficulty"]; question_type: "MCQ" | "MSQ" | "NAT"; marks: 1 | 2; question_text: string; options: { option_id: string; text: string }[] };
const fromRow = (r: Row): Q => ({ id: r.id, subject: r.subject, topic: r.topic, kind: r.kind, difficulty: r.difficulty, type: r.question_type, marks: r.marks, text: r.question_text, options: r.options?.length ? r.options.map((o) => o.text) : undefined });
type Locked = { id: string; subject: string; topic: string; difficulty: Q["difficulty"]; question_type: "MCQ" | "MSQ" | "NAT"; marks: number };
type FeedData = { items: Q[]; state: "loading" | "ready" | "error"; locked?: Locked[] };

/** Live: the questions the API releases to this account for today (set=daily) or for practice. Preview: the sample items. */
function useItems(set: "daily" | "practice"): FeedData {
  const [res, setRes] = useState<FeedData>({ items: LIVE ? [] : FORGE_ITEMS, state: LIVE ? "loading" : "ready" });
  useEffect(() => {
    if (!LIVE) return;
    let off = false;
    fetch(`/api/forge/items?set=${set}`).then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j: { items: Row[]; locked?: Locked[] }) => { if (!off) setRes({ items: (j.items ?? []).map(fromRow), state: "ready", locked: j.locked }); })
      .catch(() => { if (!off) setRes({ items: [], state: "error" }); });
    return () => { off = true; };
  }, [set]);
  return res;
}

/** Question text: ``` fences become a code block (C snippets); everything else is typeset with MathJax. */
function Body({ text }: { text: string }) {
  return <>{text.split(/```\n?/).map((part, i) => i % 2
    ? <pre key={i} className="my-3 overflow-x-auto rounded-xl bg-[var(--surface-secondary)] p-3 font-mono text-sm leading-snug text-[var(--text-primary)]">{part.replace(/\n$/, "")}</pre>
    : part.trim() ? <Tex key={i}>{part}</Tex> : null)}</>;
}
// Only text that actually contains maths waits for MathJax; plain text shows at once (no blank flash while the library loads).
const HAS_TEX = /\\\(|\\\[|\$\$/;
const Tex = ({ children }: { children: string }) => (HAS_TEX.test(children) ? <MathJax dynamic inline hideUntilTypeset="every">{children}</MathJax> : <>{children}</>);

const DIFF: Record<string, { label: string; tint: string }> = { E: { label: "Easy", tint: "mint" }, M: { label: "Medium", tint: "butter" }, H: { label: "Hard", tint: "rose" }, X: { label: "X", tint: "lilac" } };
type Tab = "daily" | "practice" | "mocks" | "bookmarks";

// Bookmarked Forge question ids, per device (preview); one store so every card and the tab agree.
const BM_KEY = "renyxera_forge_bookmarks";
const bmListeners = new Set<() => void>();
const readBm = (): string[] => { try { return JSON.parse(localStorage.getItem(BM_KEY) ?? "[]"); } catch { return []; } };
let bmCache: string[] | null = null;
const getBm = () => (bmCache ??= typeof window === "undefined" ? [] : readBm());
const EMPTY: string[] = [];
function toggleBm(id: string) {
  const cur = getBm();
  bmCache = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
  try { localStorage.setItem(BM_KEY, JSON.stringify(bmCache)); } catch { /* private mode */ }
  bmListeners.forEach((f) => f());
}
function useBookmarks() {
  return useSyncExternalStore((f) => { bmListeners.add(f); return () => bmListeners.delete(f); }, getBm, () => EMPTY);
}

/** Forge hub: shown inside Exam Setup when the question source is Forge (and at /forge, which redirects there). */
export function ForgeHub() {
  return (
    <div className="space-y-6">
      <PreviewFrame state={UPCOMING.forge} name="Forge" when="Original GATE-level questions, a Daily Forge and Forge Mocks. CS first, then every branch.">
        {(tier) => <Forge tier={tier} />}
      </PreviewFrame>
    </div>
  );
}

function Forge({ tier }: { tier: Tier }) {
  const [tab, setTab] = useState<Tab>("daily");
  const rules = FORGE[tier];
  const daily = useItems("daily");
  return (
    <>
      <Hero tier={tier} count={LIVE ? (rules.questions ? daily.items.length : -daily.items.length) : undefined} />
      <FolderTabs label="Forge sections" value={tab} onChange={setTab} tabs={[
        { id: "daily", label: "Daily Forge", tint: "peach" }, { id: "practice", label: "Practice", tint: "mint" },
        { id: "mocks", label: "Forge Mocks", tint: "peri" }, { id: "bookmarks", label: <span className="inline-flex items-center gap-1.5"><Bookmark className="h-3.5 w-3.5" /> Bookmarks</span>, tint: "rose" },
      ]}>
        {tab === "daily" && (rules.questions ? <Daily tier={tier} data={daily} /> : <Taster data={daily} />)}
        {tab === "practice" && (rules.questions ? <Practice tier={tier} /> : <Taster data={daily} />)}
        {tab === "mocks" && <Mocks />}
        {tab === "bookmarks" && (rules.questions ? <Bookmarks /> : <Locked plan="Plus" what="Bookmark Forge questions to revise later with Plus or Pro." />)}
      </FolderTabs>
      <PlanCompare rows={[
        ["Forge Mocks (full papers, ranked)", "✓", "✓", "✓"],
        ["Forge questions", "10 to try", "10 a day", "Unlimited"],
        ["Worked solutions, shortcuts and traps", "—", "✓", "✓"],
        ["Practice by subject, topic, difficulty", "—", "Within 10 a day", "Unlimited"],
        ["Bookmarks", "—", "✓", "✓"],
        ["X questions (hardest set)", "—", "—", "✓"],
        ["Every past Daily Forge", "—", "—", "✓"],
      ]} />
    </>
  );
}

function Hero({ tier, count }: { tier: Tier; count?: number }) {
  const d = FORGE_DAILY;
  const pct = Math.round((d.doneToday / d.total) * 100);
  return (
    <section className="card-pastel overflow-hidden p-6 sm:p-8" data-tint="peach" aria-label="Forge">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        <div>
          <span className="section-label"><Anvil className="h-3.5 w-3.5" /> Forge</span>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-[1.08] text-[var(--text-primary)] sm:text-5xl">New questions,<br />built like GATE.</h1>
          <p className="mt-3 max-w-xl text-[var(--text-secondary)]">Written from ten years of official papers: the same topics, weights and traps, with numbers you have never seen. Every answer is checked by code before it reaches you.</p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {FORGE[tier].questions
              ? <button type="button" className="btn-main"><Flame className="h-4 w-4" /> Continue today&apos;s Forge</button>
              : <Link href="/pro" className="btn-main"><Lock className="h-4 w-4" /> Unlock all with Plus</Link>}
            {count === undefined && <span className="pill-soft"><Users className="h-4 w-4" /> {d.boardSize.toLocaleString()} students today</span>}
          </div>
        </div>
        {count !== undefined ? (
          <div className="card-inset p-5 text-center">
            <span className="font-num text-4xl font-extrabold text-[var(--text-primary)]">{Math.abs(count)}</span>
            <p className="text-xs font-semibold text-[var(--text-muted)]">{count < 0 ? "free questions to try" : count === 1 ? "question today" : "questions today"}</p>
            <p className="mt-2 text-xs text-[var(--text-muted)]">New questions are added as they pass our checks.</p>
          </div>
        ) : (
        <div className="card-inset grid grid-cols-3 gap-3 p-5 text-center">
          <Stat big={`${d.streak}`} unit="days" label="Streak" icon={<Flame className="h-4 w-4 text-orange-500" />} />
          <Stat big={`${d.doneToday}/${d.total}`} label="Today" />
          <Stat big={`#${d.boardRank}`} label="Board" icon={<Trophy className="h-4 w-4 text-[var(--tint-lilac-ink)]" />} />
          <div className="col-span-3 mt-1 h-2 overflow-hidden rounded-full bg-[var(--surface-secondary)]" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Today's progress">
            <div className="h-full rounded-full bg-orange-500" style={{ width: `${pct}%` }} />
          </div>
          <p className="col-span-3 text-xs text-[var(--text-muted)]">New set every day at 6:00 AM. Best streak {d.best} days.</p>
        </div>
        )}
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

/** Free: playable taster questions (answer checked, worked solution locked), then the rest as locked cards with one clear way to subscribe. */
function Taster({ data }: { data: FeedData }) {
  const locked = data.locked ?? [];
  return (
    <div className="space-y-3">
      <div className="card-pastel flex flex-wrap items-center justify-between gap-3 p-4" data-tint="butter">
        <p className="text-sm text-[var(--text-secondary)]"><b className="text-[var(--text-primary)]">Try Forge free.</b> These questions are yours to play. Plus unlocks every question with its worked solution, shortcut and trap.</p>
        <Link href="/pro" className="pill-ink shrink-0">See Plus</Link>
      </div>
      <Feed data={data} empty="Forge questions are on the way.">{(q, i) => <ItemCard key={q.id} q={q} n={i + 1} taster />}</Feed>
      {locked.map((l) => (
        <Link key={l.id} href="/pro" className="group relative flex items-center gap-3 overflow-hidden rounded-[22px] border border-[var(--border)] bg-[var(--surface)] p-5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--tint-butter)] text-[var(--tint-butter-ink)]"><Lock className="h-4 w-4" /></span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold text-[var(--text-primary)]">{l.topic}</span>
            <span className="block text-xs text-[var(--text-muted)]">{l.subject} · {DIFF[l.difficulty]?.label} · {l.question_type} · {l.marks} {l.marks === 1 ? "mark" : "marks"}</span>
            <span aria-hidden className="mt-2 block space-y-1.5 blur-[3px]"><span className="block h-2.5 w-11/12 rounded-full bg-[var(--surface-secondary)]" /><span className="block h-2.5 w-7/12 rounded-full bg-[var(--surface-secondary)]" /></span>
          </span>
          <span className="shrink-0 rounded-full bg-[var(--tint-butter)] px-3 py-1.5 text-xs font-bold text-[var(--tint-butter-ink)] group-hover:bg-[var(--ink)] group-hover:text-[var(--background)]">Unlock with Plus</span>
        </Link>
      ))}
    </div>
  );
}

function Feed({ data, empty, children }: { data: FeedData; empty: string; children: (q: Q, i: number) => React.ReactNode }) {
  if (data.state === "loading") return <p className="card-inset p-6 text-center text-sm text-[var(--text-secondary)]" role="status">Loading questions…</p>;
  if (data.state === "error") return <p className="card-inset p-6 text-center text-sm text-[var(--text-secondary)]" role="alert">Couldn&apos;t load Forge questions. Check your connection and reopen this tab.</p>;
  if (!data.items.length) return <p className="card-inset p-6 text-center text-sm text-[var(--text-secondary)]">{empty}</p>;
  return <>{data.items.map(children)}</>;
}

function Daily({ tier, data }: { tier: Tier; data: FeedData }) {
  const limit = FORGE[tier].dailyLimit;
  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <Feed data={data} empty="Today's Forge questions are on the way. Practice has everything released so far.">
          {(q, i) => <ItemCard key={q.id} q={q} n={i + 1} done={!LIVE && i < FORGE_DAILY.doneToday} />}
        </Feed>
      </div>
      <aside className="grid gap-3 md:grid-cols-2">
        <div className="card-pastel p-5" data-tint="butter">
          <p className="font-bold text-[var(--text-primary)]">Your plan</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{limit === null ? "Unlimited Forge questions, every past Daily Forge and the X questions." : `${limit} Forge questions a day. Past Daily Forges and X questions come with Pro.`}</p>
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

function ItemCard({ q, n, done, taster }: { q: Q; n: number; done?: boolean; taster?: boolean }) {
  const [open, setOpen] = useState(false);
  const [picks, setPicks] = useState<string[]>([]);
  const pick = picks[0] ?? null;
  const [nat, setNat] = useState("");
  const [checked, setChecked] = useState(false);
  const [key, setKey] = useState<{ right: boolean; answer: string; solution?: Q["solution"] } | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const reduce = useReducedMotion();
  // Preview: right if within 0.5% of the sample key. Live: the key and its range come from the server when the answer is checked.
  const right = key ? key.right : q.type === "NAT" ? Math.abs(Number(nat) - Number(q.answer)) <= Math.abs(Number(q.answer)) * 0.005 + 1e-9 : q.type === "MSQ" ? [...picks].sort().join(", ") === q.answer : pick === q.answer;
  const [peek, setPeek] = useState<{ answer: string; solution?: Q["solution"] } | null>(null);
  const answer = key?.answer ?? peek?.answer ?? q.answer ?? "";
  const solution = key?.solution ?? peek?.solution ?? q.solution;
  // "Show solution" before checking: fetch the key first (otherwise the box would open empty).
  const reveal = async () => {
    if (open) { setOpen(false); return; }
    if (q.answer || key || peek) { setOpen(true); return; }
    setBusy(true); setErr(null);
    try {
      const r = await fetch("/api/answers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question_ids: [q.id] }) });
      const a = ((await r.json()) as { answers?: Record<string, { c: string[]; n: [number, number][] | null; s?: Q["solution"] }> }).answers?.[q.id];
      if (!r.ok || !a) throw new Error("no key");
      setPeek({ answer: q.type === "NAT" ? String(a.n?.[0]?.[0] ?? "") : a.c.join(", "), solution: a.s });
      setOpen(true);
    } catch { setErr("Couldn't load the solution. Try again."); } finally { setBusy(false); }
  };
  const check = async () => {
    if (q.answer) { setChecked(true); setOpen(true); return; }
    setBusy(true); setErr(null);
    try {
      const r = await fetch("/api/answers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question_ids: [q.id] }) });
      const a = ((await r.json()) as { answers?: Record<string, { c: string[]; n: [number, number][] | null; s?: Q["solution"] }> }).answers?.[q.id];
      if (!r.ok || !a) throw new Error("no key");
      const ok = q.type === "NAT" ? isNatCorrect(nat, (a.n ?? []).map(([min, max]) => ({ min, max }))) : isOptionsCorrect(q.type === "MSQ" ? "MSQ" : "MCQ", picks, a.c);
      setKey({ right: ok, answer: q.type === "NAT" ? String(a.n?.[0]?.[0] ?? "") : a.c.join(", "), solution: a.s });
      setChecked(true); setOpen(true);
    } catch { setErr("Couldn't check this answer. Try again."); } finally { setBusy(false); }
  };
  const canCheck = q.type === "NAT" ? nat.trim() !== "" && !Number.isNaN(Number(nat)) : picks.length > 0;
  const d = DIFF[q.difficulty];
  const saved = useBookmarks().includes(q.id);
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
          <button type="button" onClick={() => toggleBm(q.id)} aria-pressed={saved} aria-label={saved ? "Remove bookmark" : "Bookmark this question"}
            className={`grid h-7 w-7 place-items-center rounded-full transition-colors ${saved ? "bg-[var(--tint-rose)] text-[var(--tint-rose-ink)]" : "text-[var(--text-muted)] hover:bg-[var(--surface-secondary)]"}`}>
            {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          </button>
        </span>
      </header>
      <div className="mt-3 leading-relaxed text-[var(--text-primary)]"><Body text={q.text} /></div>
      {q.type === "MSQ" && <p className="mt-3 text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">Select all that apply</p>}
      {q.options && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2" role={q.type === "MSQ" ? "group" : "radiogroup"} aria-label={q.type === "MSQ" ? `Options for question ${n}: select all that apply` : `Options for question ${n}`}>
          {q.options.map((o, i) => {
            const id = "ABCD"[i];
            const sel = picks.includes(id);
            // After checking: the key turns green, a wrong pick turns red. Before: the pick is a light-blue chip.
            const state = checked ? (answer.split(", ").includes(id) ? "right" : sel ? "wrong" : "idle") : sel ? "picked" : "idle";
            const look = {
              right: "border-emerald-400 bg-[var(--tint-mint)] text-[var(--text-primary)]",
              wrong: "border-rose-400 bg-[var(--tint-rose)] text-[var(--text-primary)]",
              picked: "border-[var(--tint-lilac-ink)] bg-[var(--tint-lilac)] text-[var(--text-primary)]",
              idle: "border-[var(--border)] hover:border-[var(--text-secondary)]",
            }[state];
            return (
              <button key={id} type="button" role={q.type === "MSQ" ? "checkbox" : "radio"} aria-checked={sel} disabled={checked} onClick={() => setPicks(q.type === "MSQ" ? (picks.includes(id) ? picks.filter((x) => x !== id) : [...picks, id]) : [id])}
                className={`opt-tile flex items-center gap-3 rounded-2xl border-2 p-3 text-left text-sm transition-colors disabled:cursor-default ${look}`}>
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg font-num text-xs font-bold ${state === "right" ? "bg-emerald-500 text-white" : state === "wrong" ? "bg-rose-500 text-white" : state === "picked" ? "bg-[var(--tint-lilac-ink)] text-white" : "border border-[var(--border)]"}`}>
                  {state === "right" ? <Check className="h-3.5 w-3.5" /> : state === "wrong" ? <X className="h-3.5 w-3.5" /> : id}</span><Tex>{o}</Tex>
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
          ? <button type="button" disabled={!canCheck || busy} onClick={check} className="pill-ink disabled:opacity-40">{busy ? "Checking…" : "Check answer"}</button>
          : <p role="status" className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold ${right ? "bg-[var(--tint-mint)] text-[var(--tint-mint-ink)]" : "bg-[var(--tint-rose)] text-[var(--tint-rose-ink)]"}`}>
              {right ? <><Check className="h-4 w-4" /> Correct</> : <><X className="h-4 w-4" /> Not quite: the answer is {answer}</>}</p>}
        {checked && <button type="button" onClick={() => { setChecked(false); setPicks([]); setNat(""); setOpen(false); setKey(null); setPeek(null); }} className="text-sm font-semibold text-[var(--text-muted)] underline underline-offset-4">Try again</button>}
      </div>
      <footer className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">
        {err && <span role="alert" className="font-semibold text-rose-600">{err}</span>}
        {q.solvedBy !== undefined && <span>{q.solvedBy} solved · {q.accuracy}% right</span>}
        <button type="button" onClick={reveal} disabled={busy} aria-expanded={open} className="ml-auto inline-flex items-center gap-1 rounded-full bg-[var(--surface-secondary)] px-3 py-1.5 text-sm font-semibold text-[var(--text-primary)]">
          {open ? "Hide solution" : taster ? "Solution (Plus)" : "Show solution"} <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </footer>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={reduce ? undefined : { height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="mt-4 space-y-3 rounded-2xl bg-[var(--surface-secondary)] p-4 text-sm">
              <p className="font-bold text-[var(--text-primary)]">Answer: <span className="font-num">{answer}</span></p>
              {taster && !solution && (
                <p className="flex flex-wrap items-center gap-2 rounded-xl bg-[var(--tint-butter)] p-3 text-[var(--tint-butter-ink)]"><Lock className="h-4 w-4 shrink-0" /><span className="flex-1">The worked solution, shortcut and trap come with Plus.</span><Link href="/pro" className="font-bold underline underline-offset-4">See Plus</Link></p>
              )}
              {solution && <>
                <ol className="space-y-1.5 text-[var(--text-secondary)]">{solution.steps.map((s, i) => <li key={i} className="flex gap-2"><span className="font-num font-bold text-[var(--text-primary)]">{i + 1}.</span><Tex>{s}</Tex></li>)}</ol>
                <p className="flex gap-2 text-[var(--text-secondary)]"><Lightbulb className="h-4 w-4 shrink-0 text-amber-500" /><span><b className="text-[var(--text-primary)]">Shortcut:</b> <Tex>{solution.shortcut}</Tex></span></p>
                <p className="flex gap-2 text-[var(--text-secondary)]"><TriangleAlert className="h-4 w-4 shrink-0 text-rose-500" /><span><b className="text-[var(--text-primary)]">Trap:</b> <Tex>{solution.trap}</Tex></span></p>
              </>}
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

function Bookmarks() {
  const ids = useBookmarks();
  const { items } = useItems("practice");
  const list = items.filter((q) => ids.includes(q.id));
  if (!list.length) return (
    <div className="rounded-[22px] bg-[var(--surface)] p-8 text-center">
      <Bookmark className="mx-auto h-6 w-6 text-[var(--tint-rose-ink)]" />
      <p className="mt-2 font-bold text-[var(--text-primary)]">No bookmarks yet</p>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">Tap the bookmark on any Forge question to keep it here for revision.</p>
    </div>
  );
  return <div className="space-y-3">{list.map((q, i) => <ItemCard key={q.id} q={q} n={i + 1} />)}</div>;
}

function Practice({ tier, archive }: { tier: Tier; archive?: boolean }) {
  const [diff, setDiff] = useState<"all" | "E" | "M" | "H">("all");
  const { items, state } = useItems("practice");
  const subjects = [...new Set(items.map((q) => q.subject))];
  const [subject, setSubject] = useState<string>("all");
  const list = items.filter((q) => (diff === "all" || q.difficulty === diff) && (subject === "all" || q.subject === subject));
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
      <div className="space-y-3">{state === "loading" ? <p className="card-inset p-6 text-center text-sm text-[var(--text-secondary)]" role="status">Loading questions…</p> : list.map((q, i) => <ItemCard key={q.id} q={q} n={i + 1} />)}</div>
      {state === "ready" && list.length === 0 && <p className="card-inset p-6 text-center text-sm text-[var(--text-secondary)]">No questions match these filters. Try another difficulty.</p>}
    </div>
  );
}

function Mocks() {
  if (LIVE) return (
    <div className="card-pastel p-8 text-center" data-tint="peri">
      <CalendarDays className="mx-auto h-6 w-6 text-[var(--tint-peri-ink)]" />
      <p className="mt-2 font-display text-xl font-extrabold text-[var(--text-primary)]">The first Forge Mock is being prepared</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-[var(--text-secondary)]">Forge Mocks are free for everyone. We open one once the question bank is large enough to fill a full paper, and announce it here and on Telegram.</p>
    </div>
  );
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
