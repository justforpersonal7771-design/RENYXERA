import type { Metadata } from "next";
import { Plan150Article } from "@/components/seo/plan-150-article";

export const metadata: Metadata = {
  title: "How to Prepare for GATE CS in 150 Days — A Data-Driven Plan | RENYXERA",
  description: "A 150-day GATE CS preparation plan built from the real weightage of every official paper since 2017: how many days each subject deserves, what to do in each phase, and when to start full mocks.",
  alternates: { canonical: "/articles/gate-cs-preparation-150-days" },
  openGraph: { title: "How to Prepare for GATE CS in 150 Days", description: "A day budget per subject from real past-paper weightage, in three phases.", type: "article" },
};

export default function Plan150() {
  return <Plan150Article code="CSE" />;
}
