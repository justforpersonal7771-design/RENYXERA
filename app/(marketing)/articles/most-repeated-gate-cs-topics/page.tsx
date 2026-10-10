import type { Metadata } from "next";
import { MostRepeatedArticle } from "@/components/seo/most-repeated-article";

export const metadata: Metadata = {
  title: "Most Repeated GATE CS Topics (2017–2026) — Data from Every Paper | RENYXERA",
  description: "Which GATE CS topics come every year? A ranking of topics by how many years they appeared in and the marks they carried, with a year-by-year heatmap and trends, computed from every official GATE CS paper since 2017.",
  alternates: { canonical: "/articles/most-repeated-gate-cs-topics" },
  openGraph: { title: "Most Repeated GATE CS Topics (2017–2026)", description: "Topics ranked by years appeared and marks, from every official paper.", type: "article" },
};

export default function MostRepeatedTopics() {
  return <MostRepeatedArticle code="CSE" />;
}
