"use client";

/** SQL practice: write a query, Check runs it and the reference answer on the same sample data and compares the rows. */
import { useState } from "react";
import { Check, Eye, Loader2, Play } from "lucide-react";
import { InterviewGate, ivPost } from "@/components/interview/interview-gate";
import { SQL_EXERCISES, SQL_SETUP, toSqlite } from "@/lib/interview/sql-exercises";

type R = { exit: number; compileError: string; stdout: string; stderr: string } | { error: string };
const exec = async (q: string): Promise<R> => {
  const r = await fetch("/api/interview/run", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lang: "sql", code: SQL_SETUP + "\n" + toSqlite(q) }) });
  return (await r.json()) as R;
};
const rows = (r: R) => ("exit" in r ? r.stdout.replace(/\r/g, "").split("\n").filter(Boolean) : []);
const errOf = (r: R) => ("error" in r ? r.error : r.compileError || r.stderr);

function Sql() {
  const [i, setI] = useState(0);
  const [q, setQ] = useState("");
  const [out, setOut] = useState<R | null>(null);
  const [verdict, setVerdict] = useState<null | { ok: boolean; note: string }>(null);
  const [busy, setBusy] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const ex = SQL_EXERCISES[i];

  const pick = (n: number) => { setI(n); setQ(""); setOut(null); setVerdict(null); setReveal(false); };
  const run = async () => { setBusy(true); setVerdict(null); setOut(await exec(q)); setBusy(false); };
  const check = async () => {
    setBusy(true); setVerdict(null);
    const [mine, ref] = await Promise.all([exec(q), exec(ex.ref)]); setOut(mine);
    let ok = false, note = "";
    if (errOf(mine)) note = "Your query has an error.";
    else {
      const a = rows(mine), b = rows(ref);
      ok = ex.ordered ? a.join("\n") === b.join("\n") : [...a].sort().join("\n") === [...b].sort().join("\n");
      note = ok ? "Correct. Same rows as the reference." : a.length !== b.length ? `Your query returned ${a.length} rows; ${b.length} expected.` : "Right number of rows, but some values or the order differ.";
    }
    setVerdict({ ok, note }); if (ok) setSolved((s) => new Set(s).add(ex.id));
    void ivPost({ attempt: { kind: "sql", id: ex.id, ok, detail: { note, err: errOf(mine).slice(0, 200) } } });
    setBusy(false);
  };

  return (
    <div className="grid w-full gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="card-pastel p-3" data-tint="peach" aria-label="Exercises">
        <p className="px-2 pb-2 text-sm font-extrabold">SQL practice <span className="font-num text-xs text-[var(--text-secondary)]">{solved.size}/{SQL_EXERCISES.length}</span></p>
        <ul className="space-y-0.5">{SQL_EXERCISES.map((e, n) => (
          <li key={e.id}><button type="button" onClick={() => pick(n)} aria-current={n === i ? "true" : undefined} className={`flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-left text-sm ${n === i ? "bg-[var(--surface)] font-extrabold shadow-sm" : "hover:bg-[var(--surface)]/60"}`}>{solved.has(e.id) ? <Check className="h-4 w-4 text-emerald-600" /> : <span className="font-num w-4 text-xs text-[var(--text-secondary)]">{n + 1}</span>}<span className="truncate">{e.title}</span></button></li>))}</ul>
      </aside>
      <section className="space-y-3">
        <div className="card-pastel p-5" data-tint="butter">
          <h1 className="font-display text-xl font-extrabold">{ex.title}</h1>
          <p className="mt-1 text-[var(--text-primary)]">{ex.ask}</p>
          <p className="mt-2 text-xs text-[var(--text-secondary)]">Tables: Customer(CustomerId, Name, City) · Orders(OrderId, CustomerId, OrderDate, Total) · OrderLine(OrderId, Line, Product, Qty, Price)</p>
        </div>
        <textarea value={q} onChange={(e) => setQ(e.target.value)} spellCheck={false} placeholder="SELECT ..." aria-label="SQL query" className="card-pastel h-44 w-full resize-y p-4 font-mono text-[13px] outline-none" data-tint="sky" />
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={busy || !q.trim()} onClick={() => void run()} className="btn-soft !h-10 text-sm">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}Run</button>
          <button type="button" disabled={busy || !q.trim()} onClick={() => void check()} className="btn-main !h-10 text-sm"><Check className="h-4 w-4" />Check answer</button>
          <button type="button" onClick={() => setReveal((v) => !v)} className="btn-soft !h-10 text-sm"><Eye className="h-4 w-4" />{reveal ? "Hide" : "Hint and answer"}</button>
        </div>
        {verdict && <p role="status" className={`rounded-xl px-3 py-2 text-sm font-extrabold ${verdict.ok ? "bg-emerald-500/15 text-emerald-700" : "bg-rose-500/15 text-rose-700"}`}>{verdict.note}</p>}
        {out && <pre className="card-pastel overflow-auto p-4 font-mono text-[13px]" data-tint="lilac">{errOf(out) ? errOf(out) : rows(out).join("\n") || "(no rows)"}</pre>}
        {reveal && (
          <div className="card-pastel space-y-2 p-4 text-sm" data-tint="mint">
            <p><b>Hint.</b> {ex.hint}</p>
            <p className="font-bold">Answer here (SQLite)</p><pre className="overflow-auto font-mono text-[13px]">{ex.ref}</pre>
            <p><b>SQL Server.</b> {ex.tsql}</p>
          </div>
        )}
        <p className="text-xs text-[var(--text-secondary)]">Runs on SQLite. A small translator accepts dbo., [brackets], ISNULL, LEN, GETDATE and SELECT TOP n. Real T-SQL-only features (variables, temp tables, MERGE, PIVOT) are not available here; the SQL Server notes show the difference.</p>
      </section>
    </div>
  );
}
export default function SqlPage() { return <InterviewGate><Sql /></InterviewGate>; }
