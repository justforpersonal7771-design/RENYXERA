"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { Shuffle, Check } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import { AVATAR_STYLES, type AvatarStyleId } from "@/lib/avatar/dicebear-styles";
import { generateAvatarDataUri, randomAvatarSeed } from "@/lib/avatar/generate-avatar";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface AvatarValue {
  style: AvatarStyleId;
  seed: string;
}

interface AvatarPickerProps {
  value: AvatarValue;
  onChange: (value: AvatarValue) => void;
  className?: string;
}

/**
 * Pre-populated avatar picker (master plan Module 4E-1) — every option is a DiceBear
 * SVG generated locally from {style, seed}, never an uploaded image. Selecting an
 * avatar here should only ever result in persisting that pair of short strings; it's
 * the caller's job to actually save `value` (there's no account system yet for this to
 * write to — see the profile page once Module 4C ships).
 */
export function AvatarPicker({ value, onChange, className }: AvatarPickerProps) {
  // Regenerating every style's preview on each render (rather than only the selected
  // one) is deliberate — the whole point of the grid is letting someone compare styles
  // side by side before committing, not just see the current choice.
  const previews = useMemo(
    () =>
      AVATAR_STYLES.map((s) => ({
        ...s,
        dataUri: generateAvatarDataUri(s.id, value.seed, { size: 96 }),
      })),
    [value.seed]
  );

  const selectedPreview = previews.find((p) => p.id === value.style) ?? previews[0];

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface-secondary)] shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element -- data: URI, not a fetchable asset next/image can optimize */}
          <img
            src={selectedPreview.dataUri}
            alt="Selected avatar preview"
            className="w-full h-full"
            width={96}
            height={96}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[var(--text-primary)]">{selectedPreview.label}</p>
          <p className="text-xs text-[var(--text-muted)] truncate">seed: {value.seed}</p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => onChange({ ...value, seed: randomAvatarSeed() })}
        >
          <Shuffle className="w-3.5 h-3.5 mr-1.5" />
          Shuffle
        </Button>
      </div>

      <div
        role="radiogroup"
        aria-label="Avatar style"
        className="grid grid-cols-4 sm:grid-cols-8 gap-2.5"
      >
        {previews.map((p) => {
          const selected = p.id === value.style;
          return (
            <motion.button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={p.label}
              title={p.label}
              onClick={() => onChange({ ...value, style: p.id })}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className={cn(
                "relative aspect-square rounded-xl overflow-hidden border-2 bg-[var(--surface-secondary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]",
                selected ? "border-[var(--accent)]" : "border-transparent hover:border-[var(--border)]"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- data: URI */}
              <img src={p.dataUri} alt="" aria-hidden="true" className="w-full h-full" width={96} height={96} />
              {selected && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] flex items-center justify-center">
                  <Check className="w-2.5 h-2.5" strokeWidth={3} />
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
