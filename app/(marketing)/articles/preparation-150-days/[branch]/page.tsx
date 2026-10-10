import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BRANCHES } from "@/lib/branches";
import { Plan150Article } from "@/components/seo/plan-150-article";

const NON_CS = () => BRANCHES.filter((b) => b.live && b.code !== "CSE");
const find = (slug: string) => NON_CS().find((b) => b.paper.toLowerCase() === slug);

export const dynamicParams = false;
export function generateStaticParams() { return NON_CS().map((b) => ({ branch: b.paper.toLowerCase() })); }

export async function generateMetadata({ params }: { params: Promise<{ branch: string }> }): Promise<Metadata> {
  const b = find((await params).branch);
  if (!b) return {};
  return {
    title: `How to Prepare for GATE ${b.paper} in 150 Days — A Data-Driven Plan | RENYXERA`,
    description: `A 150-day GATE ${b.paper} preparation plan built from the real weightage of the official papers in our bank: how many days each subject deserves, what to do in each phase, and when to start full mocks.`,
    alternates: { canonical: `/articles/preparation-150-days/${b.paper.toLowerCase()}` },
    openGraph: { title: `How to Prepare for GATE ${b.paper} in 150 Days`, description: "A day budget per subject from real past-paper weightage, in three phases.", type: "article" },
  };
}

export default async function Page({ params }: { params: Promise<{ branch: string }> }) {
  const b = find((await params).branch);
  if (!b) notFound();
  return <Plan150Article code={b.code} />;
}
