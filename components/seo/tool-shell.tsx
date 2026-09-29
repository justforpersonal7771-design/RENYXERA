"use client";

import { usePathname } from "next/navigation";
import { BookOpen, Calculator, CalendarDays, FileText, Flame, LineChart } from "lucide-react";
import { TOOLS, isToolPath, type ToolEntry } from "@/lib/seo/tools";
import { SubNav } from "@/components/seo/sub-nav";

export const TOOL_ICONS: Record<ToolEntry["icon"], typeof Calculator> = { calculator: Calculator, chart: LineChart, calendar: CalendarDays, flame: Flame, book: BookOpen, file: FileText };
const TOOL_ITEMS = TOOLS.map((t) => ({ href: t.href, label: t.title, short: t.short, icon: TOOL_ICONS[t.icon], also: t.also }));

/** Tool pages get the adaptive tools dock at the bottom of the screen; other public pages don't. */
export function ToolsFrame({ children }: { children: React.ReactNode }) {
  const path = usePathname() ?? "";
  if (!isToolPath(path)) return <>{children}</>;
  return (
    <>
      <div className="min-w-0 pb-24 space-y-6">{children}</div>
      <SubNav items={TOOL_ITEMS} label="Tools" />
    </>
  );
}

export function ToolHeader({ kicker, title, lead }: { kicker: string; title: string; lead: string }) {
  return (
    <header className="max-w-4xl">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400">Free tool · {kicker}</p>
      <h1 className="mt-1.5 text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">{title}</h1>
      <p className="mt-2 text-[var(--text-secondary)] leading-relaxed">{lead}</p>
    </header>
  );
}
