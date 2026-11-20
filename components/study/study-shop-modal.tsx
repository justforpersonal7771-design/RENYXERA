"use client";

/** The study packs and bundles window, shown over any page (same shell as the Plans window). Mounted once in the layout. */
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { BookOpenText, X } from "lucide-react";
import { useStudyShopStore } from "@/store/use-study-shop-store";
import { useStudyAccess } from "@/lib/study/use-study-access";
import { clearChapterCache } from "@/lib/study/chapters";
import { StudyPlans } from "@/components/study/study-plans";
import { track } from "@/lib/growth/track";

const slug = (s: string | null) => (s ?? "menu").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 40);

export function StudyShopHost() {
  const { open, view, reason, close } = useStudyShopStore();
  const access = useStudyAccess();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, close]);
  useEffect(() => { if (open) track("upgrade_clicked", null, `study_shop_${slug(reason)}`); }, [open, reason]);
  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <div className="fixed inset-0 z-[250] grid place-items-center p-3 sm:p-6">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={close} />
      <div role="dialog" aria-modal="true" aria-label="Study packs and bundles" className="plan-peri relative flex max-h-[94dvh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-[color-mix(in_srgb,var(--m2)_45%,transparent)] shadow-2xl" style={{ background: "linear-gradient(180deg, color-mix(in srgb, var(--wash) 14%, var(--background)) 0%, var(--background) 45%)" }}>
        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1.5" style={{ background: "linear-gradient(90deg, var(--m3), var(--m1) 30%, var(--m2) 60%, var(--m3))" }} />
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface)] px-5 py-3">
          <p className="inline-flex min-w-0 items-center gap-2 text-sm font-extrabold text-[var(--text-primary)]"><BookOpenText className="plan-kicker h-4 w-4 shrink-0" aria-hidden /> <span className="truncate">{reason ?? "Study packs and bundles"}</span></p>
          <button type="button" onClick={close} aria-label="Close" className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)] cursor-pointer"><X className="h-4 w-4" /></button>
        </div>
        <div className="custom-scrollbar overflow-y-auto overscroll-contain p-4 sm:p-6">
          <StudyPlans key={view} owned={access.packs} all={access.all} initialView={view} onBought={() => { clearChapterCache(); access.refresh(); }} />
        </div>
      </div>
    </div>,
    document.body,
  );
}
