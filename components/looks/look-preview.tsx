/**
 * A small live screen drawn with the app's real classes under a Look's data-look attribute, so the preview is the Look itself, not a picture.
 * It follows the page's light or dark mode (the .dark class comes from <html>).
 */
export function LookPreview({ id, className = "" }: { id: string; className?: string }) {
  return (
    <div data-look={id === "classic" ? undefined : id} aria-hidden className={`ambient-gradient pointer-events-none relative isolate select-none overflow-hidden rounded-2xl p-3 text-[var(--text-primary)] ${className}`}>
      <div className="topbar-island flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-[10px] font-bold" style={{ borderRadius: 12 }}>
        <span className="h-3 w-3 rounded-full bg-[var(--tint-peri-ink)]" />
        <span>Dashboard</span><span className="text-[var(--text-muted)]">Test Centre</span><span className="text-[var(--text-muted)]">Study</span>
        <span className="flex-1" /><span className="h-3 w-3 rounded-full bg-[var(--tint-rose-ink)]" />
      </div>
      <div className="mt-2.5 grid grid-cols-5 gap-2">
        <div className="card-pastel col-span-3 p-2.5" data-tint="mint" style={{ borderRadius: "var(--card-radius)" }}>
          <p className="text-[11px] font-extrabold leading-tight">Build a test</p>
          <p className="mt-0.5 text-[9px] leading-snug text-[var(--text-secondary)]">Pick the questions, the length and the rules.</p>
          <span className="pill-ink mt-2 inline-flex !h-5 items-center !px-2 text-[9px]">Start</span>
        </div>
        <div className="col-span-2 flex flex-col gap-2">
          <div className="card-pastel p-2" data-tint="rose" style={{ borderRadius: "var(--card-radius)" }}><p className="text-[10px] font-extrabold">Practice</p></div>
          <div className="card-pastel p-2" data-tint="butter" style={{ borderRadius: "var(--card-radius)" }}><p className="text-[10px] font-extrabold">Mocks</p></div>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        <span className="pill-soft inline-flex !h-5 items-center !px-2 text-[9px]">History</span>
        <span className="pill-soft inline-flex !h-5 items-center !px-2 text-[9px]">Flashcards</span>
      </div>
    </div>
  );
}
