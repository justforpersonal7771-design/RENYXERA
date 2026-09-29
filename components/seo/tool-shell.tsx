"use client";

import { usePathname } from "next/navigation";
import { BookOpen, Calculator, CalendarDays, Flame, LineChart } from "lucide-react";
import { TOOLS, type ToolEntry } from "@/lib/seo/tools";
import { SubNav } from "@/components/seo/sub-nav";

export const TOOL_ICONS: Record<ToolEntry["icon"], typeof Calculator> = { calculator: Calculator, chart: LineChart, calendar: CalendarDays, flame: Flame, book: BookOpen };
const TOOL_ITEMS = TOOLS.map((t) => ({ href: t.href, label: t.title, icon: TOOL_ICONS[t.icon] }));

/** Tool pages: the adaptive tools menu under the header, then the tool. The /tools hub is the full grid. */
export function ToolsFrame({ children }: { children: React.ReactNode }) {
  const path = usePathname() ?? "";
  if (path === "/tools") return <>{children}</>;
  return (
    <>
      <SubNav items={TOOL_ITEMS} label="Tools" />
      <div className="min-w-0 pt-4 pb-8 space-y-6">{children}</div>
    </>
  );
}

export function ToolHeader({ kicker, title, lead }: { kicker: string; title: string; lead: string }) {
  return (
    <header className="max-w-3xl">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400">Free tool · {kicker}</p>
      <h1 className="mt-1.5 text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">{title}</h1>
      <p className="mt-2 text-[var(--text-secondary)] leading-relaxed">{lead}</p>
    </header>
  );
}
