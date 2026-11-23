"use client";

import { useBranchHref } from "@/lib/seo/use-branch-href";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { BookOpen, Calculator, CalendarDays, Download, FileText, Flame, LineChart } from "lucide-react";
import { TOOLS, TOOL_GROUPS, isToolPath, type ToolEntry } from "@/lib/seo/tools";
import { useAuthStore } from "@/store/use-auth-store";
import { SubNav } from "@/components/seo/sub-nav";

export const TOOL_ICONS: Record<ToolEntry["icon"], typeof Calculator> = { calculator: Calculator, chart: LineChart, calendar: CalendarDays, flame: Flame, book: BookOpen, file: FileText };
/** Every tool in the Tools hub's order and groups; Downloads (offline packs) is one of them for signed-in members. */
function toolItems(signedIn: boolean) {
  return TOOL_GROUPS.flatMap((g) => g.hrefs.map((h) => {
    if (h === "/downloads") return signedIn ? [{ href: "/downloads", label: "Downloads", short: "Downloads", icon: Download, also: ["/downloads"], group: g.id }] : [];
    const t = TOOLS.find((x) => x.href === h);
    return t ? [{ href: t.href, label: t.title, short: t.short, icon: TOOL_ICONS[t.icon], also: t.also, group: g.id }] : [];
  }).flat());
}

/** The tools dock on its own (the Downloads screen lives in the app shell, so it brings the dock with it). */
export function ToolsDock() {
  const bh = useBranchHref();
  const signedIn = useAuthStore((s) => !!s.user);
  return <SubNav items={toolItems(signedIn).map((i) => ({ ...i, href: i.href === "/downloads" ? i.href : bh(i.href) }))} label="Tools" home="/tools" />;
}

/** Tool pages get the adaptive tools dock at the bottom of the screen; other public pages don't. */
export function ToolsFrame({ children }: { children: React.ReactNode }) {
  const path = usePathname() ?? "";
  // The app scrolls inside <main>, not the window, so a new tool would otherwise open
  // at the previous tool's scroll position.
  useEffect(() => {
    const top = () => { document.querySelector("main")?.scrollTo({ top: 0 }); window.scrollTo({ top: 0 }); };
    top();
    const r = requestAnimationFrame(top);
    const t = setTimeout(top, 120);
    return () => { cancelAnimationFrame(r); clearTimeout(t); };
  }, [path]);
  if (!isToolPath(path)) return <>{children}</>;
  // The /tools landing already lists every tool; the dock is only for moving between tools.
  if (path === "/tools") return <div className="min-w-0 space-y-6">{children}</div>;
  return (
    <>
      <div className="tool-pastel min-w-0 pb-24 space-y-6">{children}</div>
      <ToolsDock />
    </>
  );
}

export function ToolHeader({ kicker, title, lead }: { kicker: string; title: string; lead: string }) {
  return (
    <header className="w-full">
      <p className="text-xs font-black tracking-normal text-violet-600 dark:text-violet-400">Free tool · {kicker}</p>
      <h1 className="mt-1.5 text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">{title}</h1>
      <p className="mt-2 max-w-6xl text-[var(--text-secondary)] leading-relaxed">{lead}</p>
    </header>
  );
}
