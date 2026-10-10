"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, GripHorizontal, X } from "lucide-react";
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
export function VirtualCalculator({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [st, setSt] = useState(() => initialCalc("deg"));
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [phone, setPhone] = useState(false);
  const [peek, setPeek] = useState(false);
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fit = () => {
      const p = window.innerWidth < 640;
      setPhone(p);
      setPos((cur) => (p ? cur : { x: Math.max(8, Math.min(cur?.x ?? window.innerWidth - W - 16, window.innerWidth - W - 8)), y: Math.max(8, cur?.y ?? 68) }));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    if (!open) { setPeek(false); return; }
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
      document.removeEventListener("pointerdown", down, true);
      document.removeEventListener("pointermove", move, true);
      document.removeEventListener("pointerup", up, true);
      document.removeEventListener("pointercancel", cancel, true);
      document.removeEventListener("contextmenu", noMenu);
    };
  }, [open, onClose]);

  const key = useCallback((k: string) => setSt((s) => press(s, k)), []);
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
  return (
    <div
      ref={panel}
      role="dialog"
      aria-label="Calculator"
      hidden={!open}
      style={style}
      className={`fixed z-[60] select-none rounded-xl border border-[var(--border)] bg-[var(--surface-elevated,var(--surface))] shadow-xl shadow-black/25 transition-opacity duration-100 ${phone ? "inset-x-1 bottom-1 mx-auto max-w-[520px]" : ""} ${open ? "" : "hidden"} ${peek ? "pointer-events-none opacity-0" : "opacity-100"}`}
    >
      <div onPointerDown={onDown} onPointerMove={onMove} onPointerUp={() => (drag.current = null)} onPointerCancel={() => (drag.current = null)}
        className={`flex items-center gap-1.5 rounded-t-xl border-b border-[var(--border)] px-2 py-1 ${phone ? "" : "cursor-grab active:cursor-grabbing"}`} style={{ touchAction: "none" }}>
        {!phone && <GripHorizontal className="h-3.5 w-3.5 text-[var(--text-muted)]" aria-hidden />}
        <button type="button" aria-label="Close calculator" onClick={onClose} onPointerDown={(e) => e.stopPropagation()} className="ml-auto rounded p-0.5 text-[var(--text-muted)] transition hover:text-[var(--text-primary)] cursor-pointer"><X className="h-3.5 w-3.5" /></button>
      </div>

      <div className="px-2 pt-1.5">
        <div className="rounded-lg bg-[var(--surface-secondary)] px-3 py-1.5" role="status" aria-live="polite">
          {/* Row 1: the expression as typed. Row 2: the running answer, updated after every key. */}
          <div ref={exprBox} className="max-h-[3.75rem] min-h-[1.5rem] overflow-y-auto text-right" title={expr}><span className="break-words text-base font-semibold leading-6 text-[var(--text-secondary)] font-num">{expr || " "}</span></div>
          <div className="flex items-baseline justify-between gap-2 border-t border-[var(--border)]/60 pt-0.5">
            <span className="text-[9px] font-black text-sky-500">{st.mem !== 0 ? "M" : ""}</span>
            <span className={`truncate text-2xl font-extrabold leading-8 font-num ${st.error ? "text-rose-500" : "text-[var(--text-primary)]"}`}>{result}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-1 p-2" style={{ gridTemplateColumns: "repeat(11, minmax(0, 1fr))", gridAutoRows: "minmax(2rem, 1fr)" }}>
        {/* Deg / Rad: one switch instead of two radio buttons */}
        <div role="radiogroup" aria-label="Angle mode" style={{ gridRow: 1, gridColumn: "2 / span 3" }} className="grid grid-cols-2 rounded-md border border-[var(--border)] bg-[var(--surface-secondary)] p-0.5">
          {(["deg", "rad"] as const).map((m) => (
            <button key={m} type="button" role="radio" aria-checked={st.mode === m} onClick={() => key(m)}
              className={`rounded text-[11px] font-bold transition cursor-pointer ${st.mode === m ? "bg-violet-600 text-white shadow-sm" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}>{m === "deg" ? "Deg" : "Rad"}</button>
          ))}
        </div>
        {KEYS.map((b) => (
          <button key={b.k} type="button" onClick={() => key(b.k)} aria-label={b.k === "⌫" ? "Backspace" : b.l}
            style={{ gridRow: `${b.r} / span ${b.rs ?? 1}`, gridColumn: `${b.c} / span ${b.cs ?? 1}` }}
            className={`min-h-8 min-w-0 rounded-md px-0 font-semibold tracking-tight transition active:scale-95 cursor-pointer sm:min-h-9 sm:text-xs ${b.l.length >= 5 ? "text-[9px]" : "text-[11px]"} ${STYLE[b.kind ?? "fn"]}`}>
            {b.k === "⌫" ? <ArrowLeft className="mx-auto h-4 w-4" strokeWidth={2.5} aria-hidden /> : b.l}
          </button>
        ))}
      </div>
    </div>
  );
}
