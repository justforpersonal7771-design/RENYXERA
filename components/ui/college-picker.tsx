"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, Plus, Search, X } from "lucide-react";
import type { CollegeData } from "@/lib/colleges";

/**
 * One integrated college picker. A single search box in a popover; State and District narrow the list as removable chips above the results
 * (pick a state, then its districts appear). Typing matches the name, district and state together. Not listed: "Add" keeps your own entry.
 */
export function CollegePicker({ value, onChange, data, mine, onAddCustom }: {
  value: string; onChange: (v: string) => void; data: CollegeData | null; mine: string[]; onAddCustom: (v: string) => void;
}) {
  const btn = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [st, setSt] = useState("");
  const [di, setDi] = useState("");
  const [active, setActive] = useState(0);
  const [rect, setRect] = useState<{ top: number; left: number; width: number; up: boolean } | null>(null);

  const place = () => {
    const r = btn.current?.getBoundingClientRect();
    if (!r) return;
    const up = window.innerHeight - r.bottom < 420 && r.top > 420;
    setRect({ top: up ? r.top - 8 : r.bottom + 8, left: r.left, width: Math.min(Math.max(r.width, 360), window.innerWidth - 16), up });
  };
  useEffect(() => {
    if (!open) return;
    place();
    setTimeout(() => input.current?.focus(), 30);
    const down = (e: MouseEvent) => { const t = e.target as Element; if (!btn.current?.contains(t) && !t.closest?.("[data-college-pop]")) setOpen(false); };
    document.addEventListener("mousedown", down); window.addEventListener("resize", place);
    return () => { document.removeEventListener("mousedown", down); window.removeEventListener("resize", place); };
  }, [open]);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setActive(0); }, [q, st, di]);

  const districts = useMemo(() => (st ? data?.districts.get(st) ?? [] : []), [data, st]);
  const matches = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const out: { value: string; name: string; sub: string }[] = [];
    for (const v of mine) if (words.every((w) => v.toLowerCase().includes(w))) out.push({ value: v, name: v, sub: "Added by you" });
    let total = out.length;
    for (const r of data?.rows ?? []) {
      if ((st && r.state !== st) || (di && r.district !== di)) continue;
      if (words.length && !words.every((w) => `${r.name} ${r.district} ${r.state}`.toLowerCase().includes(w))) continue;
      total++;
      if (out.length < 60) out.push({ value: r.value, name: r.name, sub: `${r.district}, ${r.state}` });
    }
    return { out, total };
  }, [data, mine, q, st, di]);
  const canAdd = q.trim().length >= 3 && !matches.out.some((m) => m.value.toLowerCase() === q.trim().toLowerCase());
  const rows = [...matches.out, ...(canAdd ? [{ value: q.trim(), name: q.trim(), sub: "add" }] : [])];

  const choose = (i: number) => {
    const r = rows[i]; if (!r) return;
    if (r.sub === "add") onAddCustom(r.value);
    onChange(r.value); setOpen(false); setQ("");
  };
  const key = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, rows.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); choose(active); }
    else if (e.key === "Escape") { setOpen(false); btn.current?.focus(); }
  };
  const chip = "inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors";
  const shown = value.split(", ")[0];

  return (
    <>
      <button ref={btn} type="button" aria-haspopup="listbox" aria-expanded={open} aria-label="College or university" onClick={() => setOpen((o) => !o)}
        className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border bg-[var(--surface)] px-3.5 py-2.5 text-left text-sm transition-colors ${open ? "border-violet-500 ring-2 ring-violet-500/25" : "border-[var(--border)]"}`}>
        <span className="min-w-0">
          <span className={`block truncate ${value ? "font-medium text-[var(--text-primary)]" : "text-[var(--text-muted)]"}`}>{value ? shown : "Choose your college"}</span>
          {value && value !== shown && <span className="block truncate text-xs text-[var(--text-muted)]">{value.slice(shown.length + 2)}</span>}
        </span>
        <span className="flex shrink-0 items-center gap-1">
          {value && <span role="button" tabIndex={-1} aria-label="Clear" onClick={(e) => { e.stopPropagation(); onChange(""); }} className="rounded-md p-0.5 text-[var(--text-muted)] hover:text-[var(--text-primary)]"><X className="h-3.5 w-3.5" /></span>}
          <ChevronDown className={`h-4 w-4 text-[var(--text-muted)] transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
      </button>
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {open && rect && (
            <motion.div data-college-pop data-portal-popover="true" initial={{ opacity: 0, y: rect.up ? 6 : -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.14 }}
              style={{ position: "fixed", left: Math.max(8, Math.min(rect.left, window.innerWidth - rect.width - 8)), width: rect.width, ...(rect.up ? { bottom: window.innerHeight - rect.top } : { top: rect.top }) }}
              className="popover-surface z-[400] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
              <div className="space-y-2 border-b border-[var(--border-subtle)] p-2.5">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={key} placeholder="Search by name, district or state, e.g. NIT Trichy"
                    className="search-input h-9 w-full rounded-lg border border-transparent bg-[var(--surface-secondary)] pl-8 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]" />
                </div>
                <div className="no-scrollbar flex max-h-[5.2rem] flex-wrap gap-1.5 overflow-y-auto" aria-label="Filter by state and district">
                  {st && <button type="button" className={`${chip} border-violet-500/40 bg-violet-500/10 text-[var(--text-primary)]`} onClick={() => { setSt(""); setDi(""); }}>{st}<X className="h-3 w-3" /></button>}
                  {di && <button type="button" className={`${chip} border-violet-500/40 bg-violet-500/10 text-[var(--text-primary)]`} onClick={() => setDi("")}>{di}<X className="h-3 w-3" /></button>}
                  {!st && (data?.states ?? []).map((s) => <button key={s} type="button" className={`${chip} border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]`} onClick={() => setSt(s)}>{s}</button>)}
                  {st && !di && districts.map((d) => <button key={d} type="button" className={`${chip} border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]`} onClick={() => setDi(d)}>{d}</button>)}
                  {!data && <span className="text-xs text-[var(--text-muted)]">Loading colleges…</span>}
                </div>
                <p className="px-0.5 text-[11px] text-[var(--text-muted)]">{matches.total.toLocaleString("en-IN")} {matches.total === 1 ? "college" : "colleges"}{!st ? ". Pick a state to narrow" : !di ? ". Pick a district to narrow" : ""}</p>
              </div>
              <div role="listbox" className="custom-scrollbar max-h-64 overflow-y-auto p-1.5">
                {rows.length === 0 && <p className="px-3 py-6 text-center text-xs text-[var(--text-muted)]">Nothing matches. Type the full name to add your own.</p>}
                {rows.map((r, i) => (
                  <button key={r.sub + r.value} type="button" role="option" aria-selected={r.value === value} onMouseEnter={() => setActive(i)} onClick={() => choose(i)}
                    className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${active === i ? "bg-violet-500/10" : ""}`}>
                    {r.sub === "add"
                      ? <><span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-violet-600 text-white"><Plus className="h-3.5 w-3.5" /></span><span className="font-semibold">Add &ldquo;{r.value}&rdquo; as other college</span></>
                      : <><span className="min-w-0 flex-1"><span className="block truncate text-[var(--text-primary)]">{r.name}</span><span className="block truncate text-xs text-[var(--text-muted)]">{r.sub}</span></span>{r.value === value && <Check className="h-4 w-4 shrink-0 text-violet-600" />}</>}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>, document.body)}
    </>
  );
}
