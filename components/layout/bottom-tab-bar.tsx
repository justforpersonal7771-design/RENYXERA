"use client";

import { TEST_CENTRE, TEST_CENTRE_HREF, isTestCentrePath } from "@/lib/test-centre/brand";
import { MENTOR_HOME } from "@/lib/mentor/links";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SocialDot } from "@/components/friends/social-dot";
import { useInterviewAccess } from "@/components/interview/interview-gate";
import { Briefcase, BrainCircuit, Download, LayoutDashboard, Library, ListTree, Menu, PieChart, Settings, Wrench, X, BookOpenText, Swords } from "lucide-react";
import { isReviewPath, lastReviewHref } from "./review-tabs";
import { useAuthStore } from "@/store/use-auth-store";
import { TOOLS_HOME, isToolPath } from "@/lib/seo/tools";

/**
 * Phone/tablet tab bar (below lg): the four places a student goes most, within thumb reach. "More" slides a sheet up
 * from the bottom with only the pages that aren't already in the bar (Mocks, Analytics, Tools, Downloads).
 */
export function BottomTabBar() {
  const pathname = usePathname() ?? "";
  const signedIn = useAuthStore((s) => !!s.user);
  const interview = useInterviewAccess();   // only the allowed accounts get the Interview door
  const [reviewHref, setReviewHref] = useState("/mistakes");
  const [more, setMore] = useState(false);
  useEffect(() => { setReviewHref(lastReviewHref()); }, [pathname]);
  useEffect(() => { setMore(false); }, [pathname]);
  useEffect(() => {
    if (!more) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMore(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [more]);

  const on = "text-violet-600 dark:text-violet-400";
  const tabs = [
    { label: "Home", href: "/", icon: LayoutDashboard, active: pathname === "/" },
    { label: TEST_CENTRE, href: TEST_CENTRE_HREF, icon: Settings, active: isTestCentrePath(pathname) },
    { label: "Review", href: reviewHref, icon: Library, active: isReviewPath(pathname) },
    { label: "AI Mentor", href: MENTOR_HOME, icon: BrainCircuit, active: pathname.startsWith("/ai-mentor") },
  ];
  const rest = [
    ...(interview ? [{ label: "Interview", hint: "Books, flashcards, code lab, mock interviews", tint: "butter", wide: true, href: "/interview", icon: Briefcase, active: pathname.startsWith("/interview") }] : []),
    { label: "Battles", hint: "Challenge friends, climb the board", tint: "rose", wide: true, href: "/battles", icon: Swords, active: pathname.startsWith("/battles") },
    { label: "Study materials", hint: "Notes and formulas", tint: "mint", href: "/study", icon: BookOpenText, active: pathname.startsWith("/study") },
    { label: "Analytics", hint: "Your progress", tint: "peri", href: "/analytics", icon: PieChart, active: pathname.startsWith("/analytics") },
    { label: "Browse topics", hint: "Every topic, one tap", tint: "sky", href: "/browse", icon: ListTree, active: pathname.startsWith("/browse") },
    { label: "Tools", hint: "Calculators and plans", tint: "butter", href: TOOLS_HOME, icon: Wrench, active: isToolPath(pathname) },
    ...(signedIn ? [{ label: "Downloads", hint: "Your saved files", tint: "peach", href: "/downloads", icon: Download, active: pathname.startsWith("/downloads") }] : []),
  ];
  const oddRegular = rest.filter((r) => !("wide" in r && r.wide)).length % 2 === 1;   // an odd last tile spans the row, so no empty cell
  const moreActive = rest.some((r) => r.active);

  return (
    <>
      {/* Floating glass dock (research: a floating pill, 3 to 5 items, an expanding label on the active one, safe-area spacing). The active page is a dark
          pill that glides between items and shows its name; the rest are icons. */}
      <nav aria-label="Main" className={`bottom-dock lg:hidden fixed inset-x-3 ${more ? "z-[46]" : "z-40"}`} style={{ bottom: "calc(12px + env(safe-area-inset-bottom))" }}>
        <LayoutGroup id="bottom-dock">
          <ul className="bottom-dock__bar mx-auto flex max-w-md items-center justify-between gap-1 p-1.5">
            {tabs.map((t) => (
              <li key={t.label} className="min-w-0 shrink-0">
                <Link href={t.href} aria-label={t.label} aria-current={t.active ? "page" : undefined} data-active={t.active && !more ? "" : undefined} className="dock-item">
                  {t.active && !more && <motion.span layoutId="bottom-dock-pill" className="dock-pill" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                  <t.icon className="dock-icon h-[21px] w-[21px]" />
                  <span className="dock-label">{t.label}</span>
                </Link>
              </li>
            ))}
            <li className="min-w-0 shrink-0">
              <button type="button" aria-haspopup="dialog" aria-expanded={more} aria-label="More pages" onClick={() => setMore((o) => !o)} data-active={more || moreActive ? "" : undefined} className="dock-item cursor-pointer">
                {(more || moreActive) && <motion.span layoutId="bottom-dock-pill" className="dock-pill" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <span className="relative">{more ? <X className="dock-icon h-[21px] w-[21px]" /> : <Menu className="dock-icon h-[21px] w-[21px]" />}{!more ? <SocialDot plain className="absolute -right-1 -top-0.5" /> : null}</span>
                <span className="dock-label">More</span>
              </button>
            </li>
          </ul>
        </LayoutGroup>
      </nav>

      {more && typeof document !== "undefined" && createPortal(
        <div className="lg:hidden">
          <button type="button" aria-label="Close menu" className="fixed inset-0 z-[39] bg-black/40" onClick={() => setMore(false)} />
          <div className="pointer-events-none fixed inset-x-3 top-0 bottom-[calc(5.4rem+env(safe-area-inset-bottom))] z-[45] flex items-end overflow-hidden">
          <motion.div role="dialog" aria-label="More pages" drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.7 }} onDragEnd={(_, i) => { if (i.offset.y > 70 || i.velocity.y > 500) setMore(false); }} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 420, damping: 34 }} className="pointer-events-auto touch-pan-y mx-auto max-h-full w-full max-w-xl overflow-y-auto overscroll-contain rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.35)] animate-[sheet-up_0.22s_ease-out]">
            <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-[var(--text-muted)]/40" aria-hidden />
            <p className="mb-2.5 px-1 text-[11px] font-extrabold uppercase tracking-wide text-[var(--text-muted)]">More from RENYXERA</p>
            <ul className="grid grid-cols-2 gap-2.5 pb-1">
              {rest.map((r, i) => (
                <li key={r.label} className={r.wide || (i === rest.length - 1 && oddRegular) ? "col-span-2" : ""}>
                  <Link href={r.href} onClick={() => setMore(false)} aria-current={r.active ? "page" : undefined}
                    style={{ background: `var(--tint-${r.tint})`, color: `var(--tint-${r.tint}-ink)` }}
                    className={`relative flex h-full overflow-hidden rounded-2xl border border-[color-mix(in_srgb,currentColor_14%,transparent)] p-3.5 active:scale-[.98] transition-transform ${r.wide ? "items-center gap-3.5" : "flex-col gap-2.5"} ${r.active ? "ring-2 ring-current" : ""}`}>
                    <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--surface)] shadow-sm">
                      <r.icon className="h-5 w-5" aria-hidden />
                      {r.href === "/battles" ? <SocialDot className="absolute -right-1.5 -top-1.5" /> : null}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-extrabold leading-tight text-[var(--text-primary)]">{r.label}</span>
                      <span className="mt-0.5 block text-[11px] font-semibold leading-snug text-[var(--text-secondary)]">{r.hint}</span>
                    </span>
                    <r.icon aria-hidden className="pointer-events-none absolute bottom-1 right-1 h-12 w-12 -rotate-12 opacity-[0.08]" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
