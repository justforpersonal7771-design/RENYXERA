import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BRANCHES } from "@/lib/branches";
import { allPapers } from "@/lib/seo/pyq";
import { MostRepeatedArticle } from "@/components/seo/most-repeated-article";

const NON_CS = () => BRANCHES.filter((b) => b.live && b.code !== "CSE");
const find = (slug: string) => NON_CS().find((b) => b.paper.toLowerCase() === slug);

export const dynamicParams = false;
export function generateStaticParams() { return NON_CS().map((b) => ({ branch: b.paper.toLowerCase() })); }

export async function generateMetadata({ params }: { params: Promise<{ branch: string }> }): Promise<Metadata> {
  const b = find((await params).branch);
  if (!b) return {};
  const years = [...new Set(allPapers(b.code).map((p) => p.year))].sort();
  const span = years.length ? `${years[0]}–${years[years.length - 1]}` : "";
  return {
    title: `Most Repeated GATE ${b.paper} Topics (${span}) — Data from Every Paper | RENYXERA`,
    description: `Which GATE ${b.paper} topics come every year? A ranking of topics by how many years they appeared in and the marks they carried, computed from every official GATE ${b.paper} paper in our bank.`,
    alternates: { canonical: `/articles/most-repeated-topics/${b.paper.toLowerCase()}` },
    openGraph: { title: `Most Repeated GATE ${b.paper} Topics (${span})`, description: "Topics ranked by years appeared and marks, from every official paper.", type: "article" },
  };
}

export default async function Page({ params }: { params: Promise<{ branch: string }> }) {
  const b = find((await params).branch);
  if (!b) notFound();
  return <MostRepeatedArticle code={b.code} />;
}
