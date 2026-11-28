"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, GripHorizontal, History, Maximize2, Minus, Trash2, X } from "lucide-react";
import { expressionText, initialCalc, liveResult, press, type AngleMode } from "@/lib/exam/calculator";

type Kind = "fn" | "op" | "num" | "eq" | "clear" | "mem";
/** One key placed on the grid: row/column are 1-based; the grid is 11 columns (6 function keys, 5 number keys) like the GATE calculator. */
type K = { k: string; l: string; kind?: Kind; r: number; c: number; cs?: number; rs?: number };

const fn = (k: string, l: string, r: number, c: number, kind: Kind = "fn"): K => ({ k, l, kind, r, c });
const SCI_ROWS: [string, string][][] = [
  [["sinh", "sinh"], ["cosh", "cosh"], ["tanh", "tanh"], ["EXP", "Exp"], ["(", "("], [")", ")"]],
  [["asinh", "sinh⁻¹"], ["acosh", "cosh⁻¹"], ["atanh", "tanh⁻¹"], ["log2", "log₂x"], ["ln", "ln"], ["log", "log"]],
  [["pi", "π"], ["e", "e"], ["fact", "n!"], ["logy", "log_yx"], ["exp", "eˣ"], ["pow10", "10ˣ"]],
  [["sin", "sin"], ["cos", "cos"], ["tan", "tan"], ["pow", "xʸ"], ["cube", "x³"], ["sq", "x²"]],
  [["asin", "sin⁻¹"], ["acos", "cos⁻¹"], ["atan", "tan⁻¹"], ["yroot", "ʸ√x"], ["cbrt", "∛x"], ["abs", "|x|"]],
];
const OPS = new Set(["(", ")", "pow", "logy", "yroot", "mod"]);
const KEYS: K[] = [
  fn("mod", "mod", 1, 1, "op"),
  ...(["MC", "MR", "MS", "M+", "M-"] as const).map((m, i) => fn(m, m === "M-" ? "M−" : m, 1, 7 + i, "mem")),
  ...SCI_ROWS.flatMap((row, ri) => row.map(([k, l], ci) => fn(k, l, ri + 2, ci + 1, OPS.has(k) ? "op" : "fn"))),
  { k: "⌫", l: "⌫", kind: "clear", r: 2, c: 7, cs: 2 }, fn("C", "C", 2, 9, "clear"), fn("±", "±", 2, 10, "num"), fn("sqrt", "√x", 2, 11),
  ...["7", "8", "9"].map((d, i) => fn(d, d, 3, 7 + i, "num")), fn("/", "÷", 3, 10, "op"), fn("pct", "%", 3, 11),
  ...["4", "5", "6"].map((d, i) => fn(d, d, 4, 7 + i, "num")), fn("*", "×", 4, 10, "op"), fn("inv", "1/x", 4, 11),
  ...["1", "2", "3"].map((d, i) => fn(d, d, 5, 7 + i, "num")), fn("-", "−", 5, 10, "op"), { k: "=", l: "=", kind: "eq", r: 5, c: 11, rs: 2 },
  { k: "0", l: "0", kind: "num", r: 6, c: 7, cs: 2 }, fn(".", ".", 6, 9, "num"), fn("+", "+", 6, 10, "op"),
];
const STYLE: Record<string, string> = {
  fn: "bg-[var(--surface-secondary)] text-[var(--text-primary)] hover:bg-violet-500/15",
  op: "bg-violet-500/12 text-violet-700 dark:text-violet-300 hover:bg-violet-500/25",
  num: "bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--surface-secondary)] font-bold",
  eq: "bg-gradient-to-br from-indigo-600 to-violet-600 text-white hover:brightness-110 font-extrabold",
  clear: "bg-rose-500/12 text-rose-600 dark:text-rose-300 hover:bg-rose-500/25",
  mem: "bg-sky-500/12 text-sky-700 dark:text-sky-300 hover:bg-sky-500/25",
};
const W = 560;
const HOLD_MS = 220;

/** The on-screen GATE scientific calculator, kept small so the question stays visible.
 *  Press and HOLD anywhere outside it to hide it while you look at the question (it returns on
 *  release); a quick click or tap outside closes it. It stays mounted while hidden so the
 *  display and memory survive. Mark the toggle button with data-calc-toggle. */
export function VirtualCalculator({ open, onClose, anchor = "top" }: { open: boolean; onClose: () => void; /** "bottom": open just above a bottom tool dock (lesson tools), like the other dock panels. */ anchor?: "top" | "bottom" }) {
  const [st, setSt] = useState(() => initialCalc("deg"));
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [mini, setMini] = useState(false);
  const [phone, setPhone] = useState(false);
  const [peek, setPeek] = useState(false);
  // History of finished calculations (newest first), kept while the calculator stays mounted; tap one to bring its answer back.
  const [hist, setHist] = useState<{ expr: string; res: string }[]>([]);
  const [showHist, setShowHist] = useState(false);
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fit = () => {
      const p = window.innerWidth < 640;
      setPhone(p);
      setPos((cur) => (p ? cur : { x: Math.max(8, Math.min(cur?.x ?? window.innerWidth - W - 16, window.innerWidth - W - 8)), y: Math.max(8, cur?.y ?? (anchor === "bottom" ? window.innerHeight - 380 - 96 : 68)) }));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [anchor]);

  useEffect(() => {
    if (!open) return;
    let timer: number | undefined;
    let active = false;
    let held = false;
    let sx = 0, sy = 0;
    const outside = (t: EventTarget | null) => t instanceof Element && !panel.current?.contains(t) && !t.closest("[data-calc-toggle]");
    const down = (e: PointerEvent) => {
      if (e.button > 0 || !outside(e.target)) return;
      active = true; held = false; sx = e.clientX; sy = e.clientY;
      timer = window.setTimeout(() => { held = true; setPeek(true); }, HOLD_MS);
    };
    const move = (e: PointerEvent) => { if (active && !held && Math.hypot(e.clientX - sx, e.clientY - sy) > 10) { window.clearTimeout(timer); active = false; } }; // scrolling: neither hide nor close
    const up = () => {
      if (!active) return;
      window.clearTimeout(timer);
      if (held) setPeek(false); else onClose();
      active = false; held = false;
    };
    const cancel = () => { window.clearTimeout(timer); if (held) setPeek(false); active = false; held = false; };
    const noMenu = (e: Event) => { if (held) e.preventDefault(); };
    document.addEventListener("pointerdown", down, true);
    document.addEventListener("pointermove", move, true);
    document.addEventListener("pointerup", up, true);
    document.addEventListener("pointercancel", cancel, true);
    document.addEventListener("contextmenu", noMenu);
    return () => {
      window.clearTimeout(timer);
      setPeek(false);
      document.removeEventListener("pointerdown", down, true);
      document.removeEventListener("pointermove", move, true);
      document.removeEventListener("pointerup", up, true);
      document.removeEventListener("pointercancel", cancel, true);
      document.removeEventListener("contextmenu", noMenu);
    };
  }, [open, onClose]);

  // the latest state lives in a ref so the history is written once per "=" (a state updater may run twice in development)
  const stRef = useRef(st);
  const key = useCallback((k: string) => {
    const s = stRef.current, n = press(s, k);
    if (k === "=" && n.last && !n.error && n.last !== s.last) setHist((h) => [{ expr: n.last as string, res: n.entry }, ...h].slice(0, 30));
    stRef.current = n; setSt(n);
  }, []);
  const recall = (res: string) => { const n = { ...initialCalc(stRef.current.mode), mem: stRef.current.mem, entry: res, fresh: true }; stRef.current = n; setSt(n); };
  // opening the history makes the panel taller: keep it fully on screen
  useEffect(() => {
    if (!showHist || phone) return;
    const h = panel.current?.offsetHeight ?? 0;
    setPos((c) => (c && h && c.y + h > window.innerHeight - 8 ? { ...c, y: Math.max(8, window.innerHeight - h - 8) } : c));
  }, [showHist, phone, hist.length]);
  const onDown = (e: React.PointerEvent) => {
    if (phone || !pos) return;
    drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const h = panel.current?.offsetHeight ?? 300;
    setPos({ x: Math.max(0, Math.min(window.innerWidth - W, e.clientX - drag.current.dx)), y: Math.max(0, Math.min(window.innerHeight - h, e.clientY - drag.current.dy)) });
  };

  const expr = expressionText(st);
  const exprBox = useRef<HTMLDivElement>(null);
  // A long calculation wraps over up to three lines and stays scrolled to the newest part; scroll up to see the start.
  useEffect(() => { const el = exprBox.current; if (el) el.scrollTop = el.scrollHeight; }, [st]);
  const result = liveResult(st);
  const style = phone ? undefined : { left: pos?.x ?? 16, top: pos?.y ?? 68, width: W };
  const keyBtn = (b: K, size: string, place?: React.CSSProperties) => (
    <button key={b.k} type="button" onClick={() => key(b.k)} data-k={b.k} aria-label={b.k === "⌫" ? "Backspace" : b.l}
      style={place ?? { gridRow: `${b.r} / span ${b.rs ?? 1}`, gridColumn: `${b.c} / span ${b.cs ?? 1}` }}
      className={`calc-key min-w-0 overflow-hidden whitespace-nowrap rounded-md px-0 font-semibold tracking-tight transition active:scale-95 cursor-pointer ${size} ${STYLE[b.kind ?? "fn"]}`}>
      {b.k === "⌫" ? <ArrowLeft className="mx-auto h-4 w-4" strokeWidth={2.5} aria-hidden /> : b.l}
    </button>
  );
  const angle = (
    <div role="radiogroup" aria-label="Angle mode" className="grid grid-cols-2 rounded-md border border-[var(--border)] bg-[var(--surface-secondary)] p-0.5">
      {(["deg", "rad"] as const).map((m) => (
        <button key={m} type="button" role="radio" aria-checked={st.mode === m} onClick={() => key(m)}
          className={`rounded text-[11px] font-bold transition cursor-pointer ${st.mode === m ? "bg-violet-600 text-white shadow-sm" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}>{m === "deg" ? "Deg" : "Rad"}</button>
      ))}
    </div>
  );
  // Phone layout: the 11-column desktop grid made every key about 30 px wide, so labels like sinh⁻¹ spilled out. Here the scientific keys
  // (6 columns) and the number pad (5 columns) are two separate blocks, with mode and memory in a row of their own.
  const memKeys = KEYS.filter((b) => b.kind === "mem");
  const modKey = KEYS.find((b) => b.k === "mod")!;
  const sciKeys = KEYS.filter((b) => b.c <= 6 && b.r >= 2);
  const padKeys = KEYS.filter((b) => b.c >= 7 && b.r >= 2);
  return (
    <div
      ref={panel}
      role="dialog"
      aria-label="Calculator"
      hidden={!open}
      style={style}
      className={`calc-root fixed z-[60] select-none rounded-xl border border-[var(--border)] bg-[var(--surface-elevated,var(--surface))] shadow-xl shadow-black/25 transition-opacity duration-100 ${phone ? `inset-x-1 ${anchor === "bottom" ? "bottom-[calc(5.75rem+env(safe-area-inset-bottom))]" : "bottom-1"} mx-auto max-w-[520px]` : ""} ${open ? "" : "hidden"} ${peek ? "pointer-events-none opacity-0" : "opacity-100"}`}
    >
      <div onPointerDown={onDown} onPointerMove={onMove} onPointerUp={() => (drag.current = null)} onPointerCancel={() => (drag.current = null)}
        className={`flex items-center gap-1.5 rounded-t-xl border-b border-[var(--border)] px-2 ${phone ? "py-0.5" : "py-1"} ${phone ? "" : "cursor-grab active:cursor-grabbing"}`} style={{ touchAction: "none" }}>
        {!phone && <GripHorizontal className="h-3.5 w-3.5 text-[var(--text-muted)]" aria-hidden />}
        <button type="button" aria-label="Calculation history" aria-expanded={showHist} title="History" onClick={() => setShowHist((v) => !v)} onPointerDown={(e) => e.stopPropagation()} className={`my-1 grid h-8 w-8 cursor-pointer place-items-center rounded-full border-2 border-[var(--text-primary)]/70 text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] ${showHist ? "bg-[var(--surface-secondary)]" : "bg-[var(--surface)]"}`}><History className="h-4 w-4" /></button><button type="button" aria-label={mini ? "Expand calculator" : "Minimise calculator"} title={mini ? "Expand" : "Minimise"} onClick={() => setMini((m) => !m)} onPointerDown={(e) => e.stopPropagation()} className="my-1 grid h-8 w-8 cursor-pointer place-items-center rounded-full border-2 border-[var(--text-primary)]/70 bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]">{mini ? <Maximize2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}</button><button type="button" aria-label="Close calculator" title="Close" onClick={onClose} onPointerDown={(e) => e.stopPropagation()} className="my-1 grid h-8 w-8 cursor-pointer place-items-center rounded-full border-2 border-[var(--text-primary)]/70 bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]"><X className="h-4 w-4" /></button>
        {mini && <span className="ml-1 min-w-0 flex-1 truncate text-right font-num text-sm font-extrabold text-[var(--text-primary)]">{result}</span>}
      </div>

      <div className={`${phone ? "px-1.5 pt-1" : "px-2 pt-1.5"} ${mini ? "hidden" : ""}`}>
        <div className={`rounded-lg bg-[var(--surface-secondary)] px-3 ${phone ? "py-0.5" : "py-1.5"}`} role="status" aria-live="polite">
          {/* Row 1: the expression as typed. Row 2: the running answer, updated after every key. */}
          <div ref={exprBox} className={`overflow-y-auto text-right ${phone ? "max-h-9 min-h-[1.25rem]" : "max-h-[3.75rem] min-h-[1.5rem]"}`} title={expr}><span className={`break-words font-semibold text-[var(--text-secondary)] font-num ${phone ? "text-sm leading-5" : "text-base leading-6"}`}>{expr || " "}</span></div>
          <div className="flex items-baseline justify-between gap-2 border-t border-[var(--border)]/60 pt-0.5">
            <span className="text-[9px] font-black text-sky-500">{st.mem !== 0 ? "M" : ""}</span>
            <span className={`truncate font-extrabold font-num ${phone ? "text-xl leading-7" : "text-2xl leading-8"} ${st.error ? "text-rose-500" : "text-[var(--text-primary)]"}`}>{result}</span>
          </div>
        </div>
        {showHist && (
          <div className="mt-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-1.5" aria-label="History">
            <div className="flex items-center justify-between px-1 pb-1 text-[11px] font-bold text-[var(--text-secondary)]"><span>History</span>{hist.length > 0 && <button type="button" onClick={() => setHist([])} className="inline-flex cursor-pointer items-center gap-1 hover:text-[var(--text-primary)]"><Trash2 className="h-3 w-3" aria-hidden /> Clear</button>}</div>
            {hist.length === 0 ? <p className="px-1 py-2 text-center text-xs text-[var(--text-muted)]">Finished calculations appear here.</p>
              : <ul className={`${phone ? "max-h-20" : "max-h-28"} space-y-0.5 overflow-y-auto`}>{hist.map((h, i) => <li key={i}><button type="button" onClick={() => recall(h.res)} title="Use this answer" className="flex w-full cursor-pointer items-baseline justify-between gap-3 rounded-md px-1.5 py-1 text-left hover:bg-[var(--surface-secondary)]"><span className="min-w-0 truncate font-num text-xs text-[var(--text-secondary)]">{h.expr}</span><span className="shrink-0 font-num text-sm font-extrabold text-[var(--text-primary)]">{h.res}</span></button></li>)}</ul>}
          </div>
        )}
      </div>

      {phone ? (
        <div className="space-y-1 p-1.5">
          <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(8, minmax(0, 1fr))" }}>
            <div style={{ gridColumn: "span 2" }} className="grid">{angle}</div>
            {[modKey, ...memKeys].map((b, i) => keyBtn(b, "h-[30px] text-[11px]", { gridColumn: `${3 + i} / span 1`, gridRow: 1 }))}
          </div>
          <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(6, minmax(0, 1fr))" }}>
            {sciKeys.map((b) => keyBtn(b, "h-[30px] text-[11px]", { gridRow: b.r - 1, gridColumn: b.c }))}
          </div>
          <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
            {padKeys.map((b) => keyBtn(b, "h-[34px] text-sm", { gridRow: `${b.r - 1} / span ${b.rs ?? 1}`, gridColumn: `${b.c - 6} / span ${b.cs ?? 1}` }))}
          </div>
        </div>
      ) : (
        <div className={`grid gap-1 p-2 ${mini ? "!hidden" : ""}`} style={{ gridTemplateColumns: "repeat(11, minmax(0, 1fr))", gridAutoRows: "minmax(2rem, 1fr)" }}>
          <div style={{ gridRow: 1, gridColumn: "2 / span 3" }} className="grid">{angle}</div>
          {KEYS.map((b) => keyBtn(b, `min-h-8 sm:min-h-9 ${b.l.length >= 5 ? "text-[10px]" : "text-xs"}`))}
        </div>
      )}
    </div>
  );
}
