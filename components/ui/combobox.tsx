"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, Plus, Search, X } from "lucide-react";

export interface ComboOption {
  value: string;
  group?: string;
  keywords?: string;
}

/**
 * Searchable, grouped picker with "add your own". Type to filter (matches value, group
 * and keywords), arrows + Enter to choose, Esc to close. When nothing matches exactly,
 * an "Add “…”" row lets the user keep a custom value. Portaled above every overlay.
 */
export function Combobox({
  value, onChange, options, placeholder = "Select…", addLabel = "Add", onAddCustom, ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  options: ComboOption[];
  placeholder?: string;
  addLabel?: string;
  onAddCustom?: (v: string) => void;
  ariaLabel?: string;
}) {
  const btn = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [rect, setRect] = useState<{ top: number; left: number; width: number; up: boolean } | null>(null);

  const place = () => {
    const r = btn.current?.getBoundingClientRect();
    if (!r) return;
    const up = window.innerHeight - r.bottom < 340 && r.top > 340;
    setRect({ top: up ? r.top - 8 : r.bottom + 8, left: r.left, width: Math.max(r.width, 300), up });
  };

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return options;
    const words = t.split(/\s+/);
    return options.filter((o) => {
      const hay = `${o.value} ${o.group ?? ""} ${o.keywords ?? ""}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
  }, [q, options]);
  const exact = options.some((o) => o.value.toLowerCase() === q.trim().toLowerCase());
  const canAdd = !!onAddCustom && q.trim().length >= 2 && !exact;
  const rows = useMemo(() => [...filtered.map((o) => ({ kind: "opt" as const, o })), ...(canAdd ? [{ kind: "add" as const, o: { value: q.trim() } }] : [])], [filtered, canAdd, q]);

  useEffect(() => { setActive(0); }, [q]);
  useEffect(() => {
    if (!open) return;
    place();
    setTimeout(() => input.current?.focus(), 30);
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!btn.current?.contains(t) && !list.current?.contains(t)) setOpen(false);
    };
    const onScroll = (e: Event) => { if (!list.current?.contains(e.target as Node)) place(); };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("resize", place);
    document.addEventListener("scroll", onScroll, true);
    return () => { document.removeEventListener("mousedown", onDown); window.removeEventListener("resize", place); document.removeEventListener("scroll", onScroll, true); };
  }, [open]);

  useEffect(() => {
    list.current?.querySelector(`[data-row="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const choose = (i: number) => {
    const r = rows[i];
    if (!r) return;
    if (r.kind === "add") onAddCustom?.(r.o.value);
    onChange(r.o.value);
    setOpen(false);
    setQ("");
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, rows.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); choose(active); }
    else if (e.key === "Escape") { e.preventDefault(); setOpen(false); btn.current?.focus(); }
  };

  const highlight = (text: string) => {
    const t = q.trim();
    if (!t) return text;
    const i = text.toLowerCase().indexOf(t.toLowerCase());
    if (i < 0) return text;
    return <>{text.slice(0, i)}<mark className="bg-violet-500/20 text-inherit rounded px-0.5">{text.slice(i, i + t.length)}</mark>{text.slice(i + t.length)}</>;
  };

  let lastGroup: string | undefined;

  return (
    <>
      <button ref={btn} type="button" aria-haspopup="listbox" aria-expanded={open} aria-label={ariaLabel} onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-sm text-left transition-colors cursor-pointer bg-[var(--surface)] ${open ? "border-violet-500 ring-2 ring-violet-500/25" : "border-[var(--border)] hover:border-violet-500/40"}`}>
        <span className={`truncate ${value ? "text-[var(--text-primary)] font-medium" : "text-[var(--text-muted)]"}`}>{value || placeholder}</span>
        <span className="flex items-center gap-1 shrink-0">
          {value && <span role="button" tabIndex={-1} aria-label="Clear" onClick={(e) => { e.stopPropagation(); onChange(""); }} className="p-0.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]"><X className="w-3.5 h-3.5" /></span>}
          <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
      </button>

      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {open && rect && (
            <motion.div ref={list} initial={{ opacity: 0, y: rect.up ? 6 : -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.14 }}
              style={{ position: "fixed", left: rect.left, width: rect.width, ...(rect.up ? { bottom: window.innerHeight - rect.top } : { top: rect.top }) }}
              className="z-[400] rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl overflow-hidden" data-portal-popover="true">
              <div className="p-2 border-b border-[var(--border-subtle)]">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} placeholder="Search degrees… e.g. btech cse, bsc, mca"
                    className="w-full h-9 rounded-lg bg-[var(--surface-secondary)] pl-8 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none" />
                </div>
                <p className="mt-1.5 px-1 text-[10px] text-[var(--text-muted)]">{filtered.length} match{filtered.length === 1 ? "" : "es"}{onAddCustom ? " · not listed? type it and add it" : ""}</p>
              </div>
              <div role="listbox" className="max-h-72 overflow-y-auto custom-scrollbar p-1.5">
                {rows.length === 0 && <p className="px-3 py-6 text-center text-xs text-[var(--text-muted)]">Nothing matches — keep typing to add your own.</p>}
                {rows.map((r, i) => {
                  const header = r.kind === "opt" && r.o.group !== lastGroup ? (lastGroup = r.o.group) : null;
                  const selected = r.kind === "opt" && r.o.value === value;
                  return (
                    <div key={r.kind + r.o.value}>
                      {header && <p className="px-2.5 pt-2.5 pb-1 text-[10px] font-black uppercase tracking-[0.12em] text-[var(--text-muted)]">{header}</p>}
                      <button type="button" role="option" aria-selected={selected} data-row={i} onMouseEnter={() => setActive(i)} onClick={() => choose(i)}
                        className={`w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-all cursor-pointer ${active === i ? "bg-violet-500/10 text-[var(--text-primary)] translate-x-0.5" : "text-[var(--text-secondary)]"}`}>
                        {r.kind === "add" ? (
                          <><span className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center shrink-0"><Plus className="w-3.5 h-3.5" /></span><span className="font-semibold">{addLabel} “{r.o.value}”</span></>
                        ) : (
                          <><span className="flex-1 min-w-0 truncate">{highlight(r.o.value)}</span>{selected && <Check className="w-4 h-4 text-violet-600 shrink-0" />}</>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
