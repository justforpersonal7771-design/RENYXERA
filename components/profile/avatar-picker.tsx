"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shuffle, Check, RefreshCw, Sparkles } from "lucide-react";
import { AVATAR_STYLES, type AvatarStyleId } from "@/lib/avatar/dicebear-styles";
import { generateAvatarDataUri, randomAvatarSeed } from "@/lib/avatar/generate-avatar";

export interface AvatarValue {
  style: AvatarStyleId;
  seed: string;
}

/**
 * Avatar studio (Module 4E-1). Every option is a DiceBear SVG generated locally from
 * {style, seed} — never an uploaded image; the caller persists just those two strings.
 * Big animated preview on the left; on the right, the eight styles (compare side by
 * side) and six fresh variations of the current style to pick from.
 */
export function AvatarPicker({ value, onChange, className = "" }: { value: AvatarValue; onChange: (value: AvatarValue) => void; className?: string }) {
  const [spin, setSpin] = useState(0);
  const [variationSeeds, setVariationSeeds] = useState<string[]>(() => Array.from({ length: 6 }, randomAvatarSeed));

  const styles = useMemo(
    () => AVATAR_STYLES.map((s) => ({ ...s, dataUri: generateAvatarDataUri(s.id, value.seed, { size: 96 }) })),
    [value.seed]
  );
  const variations = useMemo(
    () => variationSeeds.map((seed) => ({ seed, dataUri: generateAvatarDataUri(value.style, seed, { size: 96 }) })),
    [variationSeeds, value.style]
  );
  const current = styles.find((p) => p.id === value.style) ?? styles[0];
  const big = useMemo(() => generateAvatarDataUri(value.style, value.seed, { size: 192 }), [value.style, value.seed]);

  const shuffle = () => {
    setSpin((n) => n + 1);
    onChange({ ...value, seed: randomAvatarSeed() });
  };

  return (
    <div className={`flex flex-col md:flex-row gap-6 md:gap-8 ${className}`}>
      {/* Preview */}
      <div className="flex md:flex-col items-center gap-4 md:w-52 shrink-0">
        <div className="hero-avatar relative w-28 h-28 md:w-40 md:h-40 shrink-0">
          <motion.span aria-hidden="true" className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-cyan-400/40 via-violet-500/40 to-fuchsia-500/40 blur-2xl"
            animate={{ opacity: [0.55, 0.9, 0.55] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
          <span className="hero-avatar-ring" style={{ borderRadius: 30 }} aria-hidden="true" />
          <div className="relative w-full h-full rounded-[1.6rem] overflow-hidden bg-[var(--surface-secondary)] border border-[var(--border)] shadow-xl">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.img key={value.style + value.seed} src={big} alt="Your avatar" width={192} height={192} className="w-full h-full"
                initial={{ opacity: 0, scale: 0.7, rotate: -12 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 1.15, rotate: 10 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }} />
            </AnimatePresence>
          </div>
        </div>
        <div className="flex-1 md:flex-none md:text-center min-w-0">
          <p className="text-base font-extrabold text-[var(--text-primary)]">{current.label}</p>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5">Generated just for you — never an uploaded photo.</p>
          <motion.button type="button" onClick={shuffle} whileTap={{ scale: 0.95 }}
            className="mt-3 inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white text-sm font-semibold shadow-md shadow-violet-500/30 cursor-pointer">
            <motion.span animate={{ rotate: spin * 360 }} transition={{ duration: 0.5, ease: "easeOut" }} className="inline-flex"><Shuffle className="w-4 h-4" /></motion.span>
            Shuffle
          </motion.button>
        </div>
      </div>

      <div className="flex-1 min-w-0 space-y-5">
        {/* Styles */}
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[var(--text-muted)] mb-2.5">Style</p>
          <div role="radiogroup" aria-label="Avatar style" className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
            {styles.map((p, i) => {
              const selected = p.id === value.style;
              return (
                <motion.button key={p.id} type="button" role="radio" aria-checked={selected} aria-label={p.label} title={p.label}
                  onClick={() => onChange({ ...value, style: p.id })}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  whileHover={{ y: -4, rotate: -2, scale: 1.04 }} whileTap={{ scale: 0.95 }}
                  className="group flex flex-col items-center gap-1 cursor-pointer focus-visible:outline-none">
                  <span className={`relative w-full aspect-square rounded-2xl overflow-hidden border-2 bg-[var(--surface-secondary)] transition-all ${selected ? "border-violet-500 shadow-lg shadow-violet-500/30" : "border-transparent group-hover:border-[var(--border)] group-focus-visible:ring-2 group-focus-visible:ring-violet-500"}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- data: URI */}
                    <img src={p.dataUri} alt="" aria-hidden="true" className="w-full h-full" width={96} height={96} />
                    {selected && (
                      <motion.span layoutId="avatar-style-check" className="absolute top-1 right-1 w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center shadow">
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </motion.span>
                    )}
                  </span>
                  <span className={`text-[10px] font-semibold truncate max-w-full ${selected ? "text-violet-600 dark:text-violet-300" : "text-[var(--text-muted)]"}`}>{p.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Variations of the current style */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[var(--text-muted)] inline-flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-violet-500" /> More {current.label} looks</p>
            <button type="button" onClick={() => setVariationSeeds(Array.from({ length: 6 }, randomAvatarSeed))}
              className="group inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 cursor-pointer">
              <RefreshCw className="w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-180" /> More
            </button>
          </div>
          <div className="grid grid-cols-6 gap-2.5">
            <AnimatePresence mode="popLayout">
              {variations.map((v, i) => (
                <motion.button key={v.seed} type="button" onClick={() => onChange({ ...value, seed: v.seed })} aria-label={`Use variation ${i + 1}`}
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ delay: i * 0.04 }}
                  whileHover={{ y: -4, scale: 1.06 }} whileTap={{ scale: 0.94 }}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 bg-[var(--surface-secondary)] cursor-pointer ${v.seed === value.seed ? "border-violet-500" : "border-transparent hover:border-[var(--border)]"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- data: URI */}
                  <img src={v.dataUri} alt="" aria-hidden="true" className="w-full h-full" width={96} height={96} />
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
