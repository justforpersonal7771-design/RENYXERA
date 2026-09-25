"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "motion/react";
import { Minus, Plus } from "lucide-react";

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  id?: string;
  ariaLabel?: string;
  size?: "sm" | "md";
  className?: string;
  /** Formats the displayed number when not being typed into (e.g. decimals). */
  decimals?: number;
}

/**
 * Premium replacement for <input type="number">: − / + buttons either side of a centred
 * value that slides when it changes, hold-to-repeat on the buttons, ↑/↓ (Shift = ×10)
 * on the keyboard, and the value clamped to [min, max]. The field itself is still a real
 * text input, so typing a number works as before.
 */
export function NumberStepper({
  value, onChange, min = -Infinity, max = Infinity, step = 1, id, ariaLabel, size = "md", className = "", decimals = 0,
}: NumberStepperProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const round = (n: number) => Number(n.toFixed(Math.max(decimals, 0)));
  const [draft, setDraft] = useState<string | null>(null);
  const [dir, setDir] = useState<1 | -1>(1);
  // Every step flashes the field: a brand wash sweeps in from the side that was
  // pressed and the border glows. Hitting min/max instead gives a small shake.
  const [pulse, setPulse] = useState<{ key: number; dir: 1 | -1 }>({ key: 0, dir: 1 });
  const shell = useAnimationControls();
  const flash = (d: 1 | -1) => {
    setPulse((p) => ({ key: p.key + 1, dir: d }));
  };
  const refuse = () => shell.start({ x: [0, -5, 5, -3, 3, 0], transition: { duration: 0.35 } });
  const holdRef = useRef<{ t?: ReturnType<typeof setTimeout>; i?: ReturnType<typeof setInterval> }>({});
  const valueRef = useRef(value);
  valueRef.current = value;

  const bump = (delta: number) => {
    const next = round(clamp(valueRef.current + delta));
    if (next === valueRef.current) {
      refuse();
      return;
    }
    setDir(delta > 0 ? 1 : -1);
    flash(delta > 0 ? 1 : -1);
    valueRef.current = next;
    onChange(next);
  };

  const stopHold = () => {
    clearTimeout(holdRef.current.t);
    clearInterval(holdRef.current.i);
  };
  const startHold = (delta: number) => {
    bump(delta);
    stopHold();
    holdRef.current.t = setTimeout(() => {
      holdRef.current.i = setInterval(() => bump(delta), 60);
    }, 380);
  };
  useEffect(() => stopHold, []);

  const commitDraft = () => {
    if (draft === null) return;
    const n = parseFloat(draft);
    if (!Number.isNaN(n)) {
      const next = round(clamp(n));
      setDir(next >= value ? 1 : -1);
      if (next !== value) flash(next > value ? 1 : -1);
      onChange(next);
    }
    setDraft(null);
  };

  const atMin = value <= min;
  const atMax = value >= max;
  const h = size === "sm" ? "h-10" : "h-11";
  const shown = decimals > 0 ? value.toFixed(decimals) : String(value);

  const btn =
    "relative z-10 flex items-center justify-center w-9 shrink-0 rounded-lg text-[var(--text-secondary)] transition-all duration-200 cursor-pointer " +
    "hover:text-white hover:bg-gradient-to-br hover:from-indigo-500 hover:to-violet-600 hover:shadow-md hover:shadow-indigo-500/30 " +
    "active:scale-90 data-[limit]:opacity-35 data-[limit]:hover:bg-none data-[limit]:hover:text-[var(--text-secondary)] data-[limit]:hover:shadow-none select-none";

  return (
    <motion.div
      animate={shell}
      className={`stepper group/stepper relative isolate overflow-hidden flex items-center gap-1 p-1 ${h} rounded-xl border border-[var(--border)] bg-[var(--surface)] transition-[border-color,box-shadow] duration-200 ` +
        `focus-within:border-violet-500/70 focus-within:shadow-[0_0_0_4px_rgba(124,58,237,0.14),0_8px_24px_-10px_rgba(124,58,237,0.45)] ${className}`}
    >
      <AnimatePresence>
        {pulse.key > 0 && (
          <motion.span
            key={pulse.key}
            aria-hidden="true"
            initial={{ x: pulse.dir > 0 ? "60%" : "-60%", opacity: 0.55 }}
            animate={{ x: pulse.dir > 0 ? "-60%" : "60%", opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-violet-500/30 to-transparent"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {pulse.key > 0 && (
          <motion.span
            key={`ring-${pulse.key}`}
            aria-hidden="true"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-inset ring-violet-500/60 shadow-[inset_0_0_14px_rgba(124,58,237,0.35)]"
          />
        )}
      </AnimatePresence>
      <button
        type="button"
        tabIndex={-1}
        aria-label="Decrease"
        aria-disabled={atMin}
        data-limit={atMin || undefined}
        onPointerDown={(e) => { e.preventDefault(); startHold(-step); }}
        onPointerUp={stopHold}
        onPointerLeave={stopHold}
        className={`${btn} h-full`}
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <div className="relative flex-1 min-w-0 h-full overflow-hidden">
        <input
          id={id}
          aria-label={ariaLabel}
          inputMode={decimals > 0 ? "decimal" : "numeric"}
          role="spinbutton"
          aria-valuenow={value}
          aria-valuemin={Number.isFinite(min) ? min : undefined}
          aria-valuemax={Number.isFinite(max) ? max : undefined}
          value={draft ?? shown}
          onChange={(e) => setDraft(e.target.value.replace(/[^0-9.\-]/g, ""))}
          onBlur={commitDraft}
          onFocus={(e) => e.currentTarget.select()}
          onKeyDown={(e) => {
            if (e.key === "ArrowUp" || e.key === "ArrowDown") {
              e.preventDefault();
              commitDraft();
              bump((e.key === "ArrowUp" ? 1 : -1) * step * (e.shiftKey ? 10 : 1));
            } else if (e.key === "Enter") {
              commitDraft();
            }
          }}
          className={`absolute inset-0 w-full h-full bg-transparent text-center font-num font-semibold text-sm text-[var(--text-primary)] outline-none selection:bg-violet-500/25 ${
            draft === null ? "text-transparent caret-transparent" : ""
          }`}
        />
        {/* Animated display layer; hidden while the user is typing a value. */}
        {draft === null && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="popLayout" initial={false} custom={dir}>
              <motion.span
                key={shown}
                custom={dir}
                initial={{ y: dir * 14, opacity: 0, filter: "blur(2px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: dir * -14, opacity: 0, filter: "blur(2px)" }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="font-num font-semibold text-sm text-[var(--text-primary)]"
              >
                {shown}
              </motion.span>
            </AnimatePresence>
          </div>
        )}
      </div>

      <button
        type="button"
        tabIndex={-1}
        aria-label="Increase"
        aria-disabled={atMax}
        data-limit={atMax || undefined}
        onPointerDown={(e) => { e.preventDefault(); startHold(step); }}
        onPointerUp={stopHold}
        onPointerLeave={stopHold}
        className={`${btn} h-full`}
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}
