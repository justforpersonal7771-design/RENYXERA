import type { MetadataRoute } from "next";
import { BRANCHES } from "@/lib/branches";
import { SITE_URL } from "@/lib/site";
import { allPapers, paperQuestions, subjects } from "@/lib/seo/pyq";

// Public, crawlable pages only (the app itself is client-rendered and per-user).
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...BRANCHES.map((b) => ({ url: `${SITE_URL}/${b.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: b.live ? 0.9 : 0.7 })),
    // 6A: previous-year questions — index, papers, every question, subject hubs.
    { url: `${SITE_URL}/pyq`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${SITE_URL}/tools/gate-score-calculator`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
    ...allPapers().map((p) => ({ url: `${SITE_URL}/pyq/${p.slug}`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.8 })),
    ...allPapers().flatMap((p) => paperQuestions(p.slug).map((q) => ({ url: `${SITE_URL}/pyq/${p.slug}/q${q.question_no}`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.6 }))),
    ...subjects().map((s) => ({ url: `${SITE_URL}/topics/${s.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...["privacy", "terms", "cookies", "refunds", "disclaimer", "contact"].map((p) => ({ url: `${SITE_URL}/${p}`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
}
