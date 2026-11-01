import type { Metadata } from "next";
import { CompareAndFaq } from "@/components/marketing/compare-faq";

export const metadata: Metadata = {
  title: "How RENYXERA compares",
  description: "Free PYQ sites, PDFs and coaching each do part of the job. See how they compare with RENYXERA on what decides your GATE rank.",
  alternates: { canonical: "/compare" },
};

export default function ComparePage() {
  return <CompareAndFaq />;
}
