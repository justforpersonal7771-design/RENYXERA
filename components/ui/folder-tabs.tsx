"use client";

/**
 * R18 U2 kit. FolderTabs: index-card tabs joined to the panel below (Analytics, Profile, Setup, Review).
 * Segmented: short switches with a sliding thumb (days per week, theme, ranges).
 */
import { useId, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

export function FolderTabs<T extends string>({ tabs, value, onChange, children, label }: {
  tabs: { id: T; label: ReactNode; tint?: string }[]; value: T; onChange: (id: T) => void; children: ReactNode; label: string;
}) {
  const activeTint = tabs.find((t) => t.id === value)?.tint;
  const id = useId();
  const move = (dir: number) => {
    const i = tabs.findIndex((t) => t.id === value);
    const next = tabs[(i + dir + tabs.length) % tabs.length];
    onChange(next.id);
    document.getElementById(`${id}-${next.id}`)?.focus();
  };
  return (
    <div className="folder-wrap min-w-0">
      <div role="tablist" aria-label={label} className="folder-tabs"
        onKeyDown={(e) => { if (e.key === "ArrowRight") move(1); if (e.key === "ArrowLeft") move(-1); }}>
        {tabs.map((t) => (
          <button key={t.id} id={`${id}-${t.id}`} role="tab" type="button" aria-selected={t.id === value}
            aria-controls={`${id}-panel`} tabIndex={t.id === value ? 0 : -1} className="folder-tab" data-tint={t.tint} onClick={() => onChange(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-${value}`} className="folder-panel custom-scrollbar" data-tint={activeTint}>{children}</div>
    </div>
  );
}

export function Segmented<T extends string>({ options, value, onChange, label }: {
  options: { id: T; label: ReactNode }[]; value: T; onChange: (id: T) => void; label: string;
}) {
  const id = useId();
  const reduce = useReducedMotion();
  return (
    <div role="radiogroup" aria-label={label} className="segmented isolate">
      {options.map((o) => (
        <button key={o.id} type="button" role="radio" aria-checked={o.id === value} onClick={() => onChange(o.id)}>
          {o.id === value && <motion.span layoutId={`${id}-thumb`} className="thumb" transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 38 }} />}
          {o.label}
        </button>
      ))}
    </div>
  );
}
