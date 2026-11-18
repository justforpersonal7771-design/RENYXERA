"use client";

/**
 * Game settings (GAME-DESIGN-MERGED.md section 1, "Settings"). Stored on this device only (lib/game/sound.ts).
 * Haptics is hidden where the browser cannot vibrate (iPhone Safari), with a note instead of a dead switch.
 */
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { buzz, canVibrate, sfx, useGameSettings, type GameSettings } from "@/lib/game/sound";

function Toggle({ label, note, on, onChange }: { label: string; note?: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-[var(--g-felt-deep)] px-4 py-3">
      <span className="min-w-0 flex-1"><span className="block font-extrabold text-[var(--g-text)]">{label}</span>{note && <span className="block text-sm text-[var(--g-muted)]">{note}</span>}</span>
      <input type="checkbox" role="switch" checked={on} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span aria-hidden className="relative h-8 w-14 shrink-0 rounded-full bg-[var(--g-surface-3)] shadow-[inset_0_2px_0_rgba(0,0,0,0.35)] transition-colors peer-checked:bg-[var(--g-brass)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--g-brass-hi)] after:absolute after:left-1 after:top-1 after:h-6 after:w-6 after:rounded-full after:bg-[var(--g-paper)] after:shadow-[0_2px_0_rgba(0,0,0,0.35)] after:transition-transform peer-checked:after:translate-x-6 motion-reduce:after:transition-none" />
    </label>
  );
}

function Slider({ label, value, disabled, onChange }: { label: string; value: number; disabled?: boolean; onChange: (v: number) => void }) {
  return (
    <label className={`block rounded-2xl bg-[var(--g-felt-deep)] px-4 py-3 ${disabled ? "opacity-50" : ""}`}>
      <span className="flex justify-between font-extrabold text-[var(--g-text)]"><span>{label}</span><span className="g-num">{Math.round(value * 100)}%</span></span>
      <input type="range" min={0} max={100} step={5} value={Math.round(value * 100)} disabled={disabled} onChange={(e) => onChange(Number(e.target.value) / 100)}
        className="mt-2 w-full accent-[var(--g-brass)]" aria-label={label} />
    </label>
  );
}

export function GameSettingsPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const s = useGameSettings();
  const reduce = useReducedMotion();
  const [vib, setVib] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- browser capability, known only after mount
  useEffect(() => setVib(canVibrate()), []);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
  const put = (p: Partial<GameSettings>) => { s.set(p); setTimeout(() => sfx("tap"), 20); };
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[70] flex items-end justify-center bg-[rgba(10,6,2,0.65)] sm:items-center sm:p-6" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
          <motion.div role="dialog" aria-modal="true" aria-label="Game settings" onClick={(e) => e.stopPropagation()}
            initial={reduce ? { opacity: 0 } : { y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reduce ? { opacity: 0 } : { y: 30, opacity: 0 }} transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="no-scrollbar max-h-[88dvh] w-full max-w-lg overflow-y-auto rounded-t-[26px] border-4 border-[var(--g-wood)] bg-[var(--g-felt-dark)] p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] sm:rounded-[26px]">
            <div className="mb-4 flex items-center justify-between">
              <p className="g-title text-2xl">Settings</p>
              <button type="button" onClick={onClose} aria-label="Close settings" className="g-orb !min-w-0" style={{ ["--c" as string]: "#c4412d" }}><span className="g-orb-face !h-10 !w-10 !rounded-xl"><X className="h-5 w-5" aria-hidden /></span></button>
            </div>
            <div className="space-y-2.5">
              <p className="pt-1 text-sm font-extrabold text-[var(--g-brass-hi)]">Sound</p>
              <Toggle label="Sound" note="A dholak and tabla groove with santoor riffs in the raag of the hour, made in your browser" on={s.sound} onChange={(v) => put({ sound: v })} />
              <Slider label="Music" value={s.music} disabled={!s.sound} onChange={(v) => s.set({ music: v })} />
              <Slider label="Effects" value={s.sfx} disabled={!s.sound} onChange={(v) => { s.set({ sfx: v }); sfx("coin"); }} />
              <p className="pt-3 text-sm font-extrabold text-[var(--g-brass-hi)]">Feel</p>
              {vib ? <Toggle label="Vibration" note="Short taps on answers and wins" on={s.haptics} onChange={(v) => { put({ haptics: v }); if (v) buzz(18); }} />
                : <p className="rounded-2xl bg-[var(--g-felt-deep)] px-4 py-3 text-sm text-[var(--g-muted)]">Vibration is not available in this browser. Every cue also has a sound and a visual.</p>}
              <Toggle label="Reduce motion" note="Fades instead of slides, shakes and flying coins" on={s.reducedMotion} onChange={(v) => put({ reducedMotion: v })} />
              <Toggle label="Battery saver" note="Stops the background music and moving scenery" on={s.lowPower} onChange={(v) => put({ lowPower: v })} />
            </div>
            <p className="mt-4 text-xs text-[var(--g-muted)]">Saved on this device.</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
