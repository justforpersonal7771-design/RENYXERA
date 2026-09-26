import type { MetadataRoute } from "next";
import { BRANCHES } from "@/lib/branches";
import { SITE_URL } from "@/lib/site";

// Public, crawlable pages only (the app itself is client-rendered and per-user).
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...BRANCHES.map((b) => ({ url: `${SITE_URL}/${b.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: b.live ? 0.9 : 0.7 })),
    ...["privacy", "terms"].map((p) => ({ url: `${SITE_URL}/${p}`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
}
