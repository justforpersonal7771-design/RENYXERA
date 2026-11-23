"use client";

/**
 * Section bar for Test Centre screens. On phones it is a slim scrolling row (back to the hub plus the other doors).
 * On desktop it is hidden: the Test Centre item in the top bar opens a menu with every door (see topbar.tsx), so screens keep their full height.
 */
import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid } from "lucide-react";
import { TEST_CENTRE, TEST_CENTRE_HREF, isTestCentrePath } from "@/lib/test-centre/brand";

const ITEMS = [
  { href: "/test-centre/build", label: "Build a test", on: (p: string) => p.startsWith("/test-centre/build") || p.startsWith("/setup") || p.startsWith("/exam") },
  { href: "/test-centre/mocks", label: "Mocks", on: (p: string) => p.startsWith("/test-centre/mocks") || p.startsWith("/mocks") || p.startsWith("/fresh-mock") },
  { href: "/test-centre/practice", label: "Practice", on: (p: string) => p.startsWith("/test-centre/practice") || p.startsWith("/checkpoint") },
  { href: "/test-centre/history", label: "History", on: (p: string) => p.startsWith("/test-centre/history") },
  { href: "/citadel-clash", label: "Citadel Clash", on: (p: string) => p.startsWith("/citadel-clash") || p.startsWith("/challenge") },
];

export function TestCentreBar() {
  const p = usePathname() ?? "";
  const row = useRef<HTMLElement>(null);
  // keep the current section in view instead of clipped at the edge
  useEffect(() => {
    const el = row.current?.querySelector<HTMLElement>('[aria-current="page"]');
    const r = row.current;
    if (el && r) r.scrollTo({ left: el.offsetLeft - (r.clientWidth - el.offsetWidth) / 2, behavior: "auto" });
  }, [p]);
  if (p === TEST_CENTRE_HREF || !isTestCentrePath(p)) return null;
  return (
    <nav ref={row} aria-label={`${TEST_CENTRE} sections`} className="-mt-2 mb-1 flex shrink-0 items-center gap-1.5 overflow-x-auto px-3 py-1.5 [mask-image:linear-gradient(90deg,transparent,#000_14px,#000_calc(100%-14px),transparent)] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
      <Link href={TEST_CENTRE_HREF} className="btn-soft !h-9 shrink-0 !px-3 text-sm"><LayoutGrid className="h-4 w-4" /> {TEST_CENTRE}</Link>
      {ITEMS.map((i) => (
        <Link key={i.href} href={i.href} aria-current={i.on(p) ? "page" : undefined} className={`${i.on(p) ? "pill-ink" : "pill-soft"} shrink-0 whitespace-nowrap text-sm lg:hidden`}>{i.label}</Link>
      ))}
    </nav>
  );
}
