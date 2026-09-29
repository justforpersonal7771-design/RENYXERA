"use client";

import { SubNav } from "@/components/seo/sub-nav";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Cookie, FileText, Mail, ReceiptText, Scale, ShieldCheck } from "lucide-react";

export const LEGAL_PAGES = [
  { href: "/terms", label: "Terms of Service", icon: Scale },
  { href: "/privacy", label: "Privacy Policy", icon: ShieldCheck },
  { href: "/cookies", label: "Cookie Policy", icon: Cookie },
  { href: "/refunds", label: "Refunds", icon: ReceiptText },
  { href: "/disclaimer", label: "Disclaimer", icon: FileText },
  { href: "/contact", label: "Contact", icon: Mail },
];

/** The adaptive legal menu under the header. */
export function LegalNav() {
  return <SubNav items={LEGAL_PAGES} label="Legal" />;
}

/** Right rail: "On this page", built from the article's h2 headings, with scroll-spy. */
export function LegalToc() {
  const path = usePathname();
  const [items, setItems] = useState<{ id: string; text: string }[]>([]);
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const hs = [...document.querySelectorAll<HTMLHeadingElement>("#legal-article h2")];
    hs.forEach((h, i) => { if (!h.id) h.id = `s-${i + 1}-${(h.textContent ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`; h.classList.add("scroll-mt-24"); });
    setItems(hs.map((h) => ({ id: h.id, text: h.textContent ?? "" })));
    const io = new IntersectionObserver((es) => { const v = es.filter((e) => e.isIntersecting)[0]; if (v) setActive(v.target.id); }, { rootMargin: "-80px 0px -70% 0px" });
    hs.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [path]);
  if (items.length < 3) return null;
  return (
    <nav aria-label="On this page" className="hidden xl:block sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto custom-scrollbar">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--text-muted)] mb-2">On this page</p>
      <ul className="space-y-1 border-l border-[var(--border)]">
        {items.map((it) => <li key={it.id}><a href={`#${it.id}`} className={`block -ml-px pl-3 py-0.5 border-l-2 text-[13px] leading-snug transition-colors ${active === it.id ? "border-violet-500 text-violet-700 dark:text-violet-300 font-semibold" : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}>{it.text}</a></li>)}
      </ul>
    </nav>
  );
}
