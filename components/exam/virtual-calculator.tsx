"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GripHorizontal, X } from "lucide-react";
import { expressionText, initialCalc, press, type AngleMode } from "@/lib/exam/calculator";

type K = { k: string; l: string; kind?: "fn" | "op" | "num" | "eq" | "clear" | "mem" };

const SCI: K[][] = [
  [{ k: "sinh", l: "sinh" }, { k: "cosh", l: "cosh" }, { k: "tanh", l: "tanh" }, { k: "abs", l: "|x|" }],
  [{ k: "asinh", l: "sinh⁻¹" }, { k: "acosh", l: "cosh⁻¹" }, { k: "atanh", l: "tanh⁻¹" }, { k: "fact", l: "n!" }],
  [{ k: "sin", l: "sin" }, { k: "cos", l: "cos" }, { k: "tan", l: "tan" }, { k: "inv", l: "1/x" }],
  [{ k: "asin", l: "sin⁻¹" }, { k: "acos", l: "cos⁻¹" }, { k: "atan", l: "tan⁻¹" }, { k: "sq", l: "x²" }],
  [{ k: "log", l: "log" }, { k: "ln", l: "ln" }, { k: "cube", l: "x³" }, { k: "pow", l: "xʸ", kind: "op" }],
  [{ k: "pow10", l: "10ˣ" }, { k: "exp", l: "eˣ" }, { k: "sqrt", l: "√x" }, { k: "yroot", l: "ʸ√x", kind: "op" }],
  [{ k: "pi", l: "π" }, { k: "e", l: "e" }, { k: "EXP", l: "EXP" }, { k: "pct", l: "%" }],
];
const BASIC: K[][] = [
  [{ k: "MC", l: "MC", kind: "mem" }, { k: "MR", l: "MR", kind: "mem" }, { k: "MS", l: "MS", kind: "mem" }, { k: "M+", l: "M+", kind: "mem" }],
  [{ k: "M-", l: "M−", kind: "mem" }, { k: "C", l: "C", kind: "clear" }, { k: "CE", l: "CE", kind: "clear" }, { k: "⌫", l: "⌫", kind: "clear" }],
  [{ k: "7", l: "7", kind: "num" }, { k: "8", l: "8", kind: "num" }, { k: "9", l: "9", kind: "num" }, { k: "/", l: "÷", kind: "op" }],
  [{ k: "4", l: "4", kind: "num" }, { k: "5", l: "5", kind: "num" }, { k: "6", l: "6", kind: "num" }, { k: "*", l: "×", kind: "op" }],
  [{ k: "1", l: "1", kind: "num" }, { k: "2", l: "2", kind: "num" }, { k: "3", l: "3", kind: "num" }, { k: "-", l: "−", kind: "op" }],
  [{ k: "0", l: "0", kind: "num" }, { k: ".", l: ".", kind: "num" }, { k: "±", l: "±", kind: "num" }, { k: "+", l: "+", kind: "op" }],
  [{ k: "(", l: "(", kind: "op" }, { k: ")", l: ")", kind: "op" }, { k: "mod", l: "mod", kind: "op" }, { k: "=", l: "=", kind: "eq" }],
];
const STYLE: Record<string, string> = {
  fn: "bg-[var(--surface-secondary)] text-[var(--text-primary)] hover:bg-violet-500/15",
  op: "bg-violet-500/12 text-violet-700 dark:text-violet-300 hover:bg-violet-500/25",
  num: "bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--surface-secondary)] font-bold",
  eq: "bg-gradient-to-br from-indigo-600 to-violet-600 text-white hover:brightness-110 font-extrabold",
  clear: "bg-rose-500/12 text-rose-600 dark:text-rose-300 hover:bg-rose-500/25",
  mem: "bg-sky-500/12 text-sky-700 dark:text-sky-300 hover:bg-sky-500/25",
};
const W = 372;
const HOLD_MS = 220;
const MODES: [AngleMode, string][] = [["deg", "Deg"], ["rad", "Rad"], ["grad", "Grad"]];

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
  const style = phone ? undefined : { left: pos?.x ?? 16, top: pos?.y ?? 68, width: W };
  return (
    <div
      ref={panel}
      role="dialog"
      aria-label="Calculator"
      hidden={!open}
      style={style}
      className={`fixed z-[60] select-none rounded-xl border border-[var(--border)] bg-[var(--surface-elevated,var(--surface))] shadow-xl shadow-black/25 transition-opacity duration-100 ${phone ? "inset-x-1 bottom-1 mx-auto max-w-[400px]" : ""} ${open ? "" : "hidden"} ${peek ? "pointer-events-none opacity-0" : "opacity-100"}`}
    >
      <div onPointerDown={onDown} onPointerMove={onMove} onPointerUp={() => (drag.current = null)} onPointerCancel={() => (drag.current = null)}
        className={`flex items-center gap-1.5 rounded-t-xl border-b border-[var(--border)] px-2 py-1 ${phone ? "" : "cursor-grab active:cursor-grabbing"}`} style={{ touchAction: "none" }}>
        {!phone && <GripHorizontal className="h-3.5 w-3.5 text-[var(--text-muted)]" aria-hidden />}
        <div className="flex items-center gap-0.5" role="radiogroup" aria-label="Angle mode" onPointerDown={(e) => e.stopPropagation()}>
          {MODES.map(([m, label]) => (
            <button key={m} type="button" role="radio" aria-checked={st.mode === m} onClick={() => key(m)}
              className={`rounded px-1.5 py-px text-[10px] font-bold transition cursor-pointer ${st.mode === m ? "bg-violet-600 text-white" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}>{label}</button>
          ))}
        </div>
        <button type="button" aria-label="Close calculator" onClick={onClose} onPointerDown={(e) => e.stopPropagation()} className="ml-auto rounded p-0.5 text-[var(--text-muted)] transition hover:text-[var(--text-primary)] cursor-pointer"><X className="h-3.5 w-3.5" /></button>
      </div>

      <div className="px-2 pt-1.5">
        <div className="rounded-lg bg-[var(--surface-secondary)] px-2 py-1 text-right" role="status" aria-live="polite">
          <div className="h-3 truncate text-[10px] leading-3 text-[var(--text-muted)] font-num" title={expr}>{expr || " "}</div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[9px] font-black text-sky-500">{st.mem !== 0 ? "M" : ""}</span>
            <span className={`truncate text-lg font-extrabold leading-6 font-num ${st.error ? "text-rose-500" : "text-[var(--text-primary)]"}`}>{st.entry}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 p-2">
        {[SCI, BASIC].map((rows, i) => (
          <div key={i} className="grid grid-cols-4 gap-0.5">
            {rows.flat().map((b) => (
              <button key={b.k} type="button" onClick={() => key(b.k)} aria-label={b.l}
                className={`h-6 min-w-0 rounded-md px-0 text-[10px] font-semibold transition active:scale-95 cursor-pointer sm:h-[26px] ${STYLE[b.kind ?? "fn"]}`}>{b.l}</button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
