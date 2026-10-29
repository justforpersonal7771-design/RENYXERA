import type { Metadata } from "next";
import { ToolsHub } from "@/components/seo/tools-hub";

export const metadata: Metadata = {
  title: "Free GATE tools",
  description: "Every free GATE OS tool in one place: syllabus weightage, past papers, rank predictor, cut-offs, a study planner and offline downloads.",
  alternates: { canonical: "/tools" },
};

export default function ToolsIndex() {
  return <ToolsHub />;
}
