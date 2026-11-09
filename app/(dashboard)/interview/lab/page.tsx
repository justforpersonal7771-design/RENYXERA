"use client";

/** Code lab: a plain editor that runs C#, C++, Python, JavaScript and TypeScript on a free hosted compiler. Load a lab from the books and it is checked against the book's own output. */
import { useEffect, useMemo, useState } from "react";
import { Loader2, Play } from "lucide-react";
import { InterviewGate, ivPost, type IvDoc } from "@/components/interview/interview-gate";

const LANGS = { cpp: "C++17", csharp: "C#", python: "Python", javascript: "JavaScript", typescript: "TypeScript" } as const;
type Lang = keyof typeof LANGS;
const STARTER: Record<Lang, string> = {
  cpp: '#include <iostream>\nint main() {\n  std::cout << "Hello\\n";\n}\n',
  csharp: 'using System;\nclass P {\n  static void Main() {\n    Console.WriteLine("Hello");\n  }\n}\n',
  python: 'print("Hello")\n',
  javascript: 'console.log("Hello");\n',
  typescript: 'const x: number = 1;\nconsole.log("Hello", x);\n',
};
type Out = { exit: number; compileError: string; stdout: string; stderr: string } | { error: string };
const norm = (s: string) => s.replace(/\r/g, "").split("\n").map((l) => l.trimEnd()).join("\n").trim();
const lastLine = (s: string) => norm(s).split("\n").filter(Boolean).pop() ?? "";
/** Labs that import packages (React, jsdom, ...) or point at the local project cannot run on a plain hosted compiler. */
const needsLocal = (lang: string, code: string) => lang === "javascript" && /_runtime|createRequire|from\s+["'](?!node:)[^"']+["']|require\(["'](?!node:)/.test(code);
/** Node on the hosted runner loads the file as CommonJS; ES-module labs are wrapped in a dynamic import so their `import` lines work. */
const forRunner = (lang: string, code: string) => (lang === "javascript" && /^\s*(import|export)\s/m.test(code) ? `import("data:text/javascript;base64,${btoa(unescape(encodeURIComponent(code)))}").catch((e) => { console.error(e); process.exit(1); });` : code);

function Lab() {
  const [lang, setLang] = useState<Lang>("cpp");
  const [code, setCode] = useState(STARTER.cpp);
  const [stdin, setStdin] = useState("");
  const [out, setOut] = useState<Out | null>(null);
  const [busy, setBusy] = useState(false);
  const [labs, setLabs] = useState<IvDoc[]>([]);
  const [loaded, setLoaded] = useState<IvDoc | null>(null);
  const [verdict, setVerdict] = useState<"pass" | "fail" | null>(null);

  // "Run in lab" from a lesson hands its code over through the browser session
  // eslint-disable-next-line react-hooks/set-state-in-effect -- reads the code handed over from a lesson (browser session storage) after mount
  useEffect(() => { try { const s = sessionStorage.getItem("iv_lab_seed"); if (s) { sessionStorage.removeItem("iv_lab_seed"); const d = JSON.parse(s) as { lang: Lang; code: string }; if (d.lang in LANGS) { setLang(d.lang); setCode(d.code); } } } catch { /* ignore */ } }, []);
  useEffect(() => { void fetch("/api/interview/docs", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((d: { docs: IvDoc[] } | null) => { if (d) setLabs(d.docs.filter((x) => x.kind === "lab" && x.meta?.lang && x.meta.lang !== "sql")); }); }, []);
  const byBook = useMemo(() => { const m = new Map<string, IvDoc[]>(); for (const l of labs) m.set(l.book_title, [...(m.get(l.book_title) ?? []), l]); return [...m.entries()]; }, [labs]);

  const pickLang = (l: Lang) => { setLang(l); setLoaded(null); setVerdict(null); setOut(null); setCode(STARTER[l]); };
  const loadLab = async (id: string) => {
    if (!id) return;
    const r = await fetch(`/api/interview/docs?id=${encodeURIComponent(id)}`, { cache: "no-store" }); if (!r.ok) return;
    const d = (await r.json()) as IvDoc & { body: string };
    setLoaded(d); setLang((d.meta.lang as Lang) ?? "python"); setCode(d.body); setOut(null); setVerdict(null);
  };
  const run = async () => {
    setBusy(true); setOut(null); setVerdict(null);
    try {
      const r = await fetch("/api/interview/run", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lang, code: forRunner(lang, code), stdin }) });
      const d = (await r.json()) as Out; setOut(d);
      if ("exit" in d) {
        const expected = loaded?.meta?.expected ?? "";
        const pass = d.exit === 0 && !d.compileError.trim() && (!expected || norm(d.stdout).includes(lastLine(expected)));
        if (loaded) setVerdict(pass ? "pass" : "fail");
        void ivPost({ attempt: { kind: loaded ? "lab" : "code", id: loaded ? loaded.id : `free:${lang}`, ok: pass || (!loaded && d.exit === 0), detail: { lang, exit: d.exit, err: (d.compileError || d.stderr).slice(0, 300) } } });
      }
    } catch { setOut({ error: "Could not reach the runner." }); } finally { setBusy(false); }
  };
  const onTab = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") { e.preventDefault(); const t = e.currentTarget, s = t.selectionStart; setCode(code.slice(0, s) + "  " + code.slice(t.selectionEnd)); requestAnimationFrame(() => { t.selectionStart = t.selectionEnd = s + 2; }); }
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); void run(); }
  };

  return (
    <div className="w-full space-y-4">
      <section className="card-well flex flex-wrap items-center gap-3 p-4" data-tint="mint" aria-label="Code lab controls">
        <h1 className="mr-auto font-display text-xl font-extrabold">Code lab</h1>
        <label className="flex items-center gap-2 text-sm font-bold">Language
          <select value={lang} onChange={(e) => pickLang(e.target.value as Lang)} className="h-10 rounded-xl border-2 border-[var(--border)] bg-[var(--surface)] px-2">{(Object.keys(LANGS) as Lang[]).map((l) => <option key={l} value={l}>{LANGS[l]}</option>)}</select></label>
        <label className="flex items-center gap-2 text-sm font-bold">Book lab
          <select value={loaded?.id ?? ""} onChange={(e) => void loadLab(e.target.value)} className="h-10 max-w-[16rem] rounded-xl border-2 border-[var(--border)] bg-[var(--surface)] px-2"><option value="">Free editor</option>{byBook.map(([b, ls]) => <optgroup key={b} label={b}>{ls.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}</optgroup>)}</select></label>
        <button type="button" onClick={() => void run()} disabled={busy || needsLocal(lang, code)} className="btn-main !h-10 text-sm">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}Run <span className="hidden text-xs opacity-70 sm:inline">Ctrl+Enter</span></button>
      </section>
      <div className="grid gap-4 lg:grid-cols-2">
        <textarea value={code} onChange={(e) => setCode(e.target.value)} onKeyDown={onTab} spellCheck={false} aria-label="Code editor" className="card-pastel h-[60vh] w-full resize-none p-4 font-mono text-[13px] leading-relaxed outline-none" data-tint="sky" />
        <div className="space-y-3">
          <div className="card-pastel h-[calc(60vh-72px)] overflow-auto p-4 font-mono text-[13px]" data-tint="lilac" aria-live="polite">
            {busy && <p>Running…</p>}
            {out && "error" in out && <p className="text-rose-600">{out.error}</p>}
            {out && "exit" in out && (<>
              {out.compileError && <pre className="whitespace-pre-wrap text-rose-600">{out.compileError}</pre>}
              {out.stdout && <pre className="whitespace-pre-wrap">{out.stdout}</pre>}
              {out.stderr && <pre className="whitespace-pre-wrap text-rose-600">{out.stderr}</pre>}
              {!out.compileError && !out.stdout && !out.stderr && <p className="text-[var(--text-secondary)]">No output.</p>}
            </>)}
            {!busy && !out && <p className="text-[var(--text-secondary)]">Output appears here.</p>}
          </div>
          <input value={stdin} onChange={(e) => setStdin(e.target.value)} placeholder="Optional input (stdin)" aria-label="Standard input" className="h-11 w-full rounded-xl border-2 border-[var(--border)] bg-[var(--surface)] px-3 text-sm" />
          {needsLocal(lang, code) && <p role="status" className="rounded-xl bg-amber-500/15 px-3 py-2 text-sm font-bold text-amber-800">This lab needs its own project (it imports packages such as React or jsdom), so it cannot run here. Read it, then run it locally with <code>node --test</code>.</p>}
          {verdict && <p role="status" className={`rounded-xl px-3 py-2 text-sm font-extrabold ${verdict === "pass" ? "bg-emerald-500/15 text-emerald-700" : "bg-rose-500/15 text-rose-700"}`}>{verdict === "pass" ? "Matches the book's expected result." : "Does not match the book's expected result yet."}</p>}
        </div>
      </div>
      <p className="text-xs text-[var(--text-secondary)]">Runs on the free wandbox.org compiler: no files, no network, about 25 seconds, 20 runs a minute. Every run is saved to your progress.</p>
    </div>
  );
}
export default function LabPage() { return <InterviewGate><Lab /></InterviewGate>; }
