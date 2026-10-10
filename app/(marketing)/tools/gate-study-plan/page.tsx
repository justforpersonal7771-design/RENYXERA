import type { Metadata } from "next";
import { subjects } from "@/lib/seo/pyq";
import { SYLLABUS } from "@/lib/seo/syllabus";
import { branchSyllabusStats, SYLLABUS_PAGE_BRANCHES } from "@/lib/seo/branch-syllabus";
import { branchByCode, type BranchCode } from "@/lib/branches";
import { StudyPlanTool } from "@/components/seo/study-plan-tool";
import { SponsorSlot } from "@/components/ads/sponsor-slot";
import { ToolHeader } from "@/components/seo/tool-shell";

export const metadata: Metadata = {
  title: "GATE Study Plan Generator & Countdown (Free, Weightage-based, All Branches) | RENYXERA",
  description: "Make a week-by-week GATE study plan for your paper from your hours per day and weak subjects. Time per section follows real past-paper weightage, with revision and full-mock phases and a live countdown to your exam date.",
  alternates: { canonical: "/tools/gate-study-plan" },
  openGraph: { title: "GATE Study Plan Generator", description: "A week-by-week plan weighted by real GATE weightage, for every paper.", type: "website" },
};

export default function StudyPlanPage() {
  const subs = subjects();
  const by = new Map(subs.map((s) => [s.name, s.marks]));
  const total = subs.reduce((n, s) => n + s.marks, 0) || 1;
  const byBranch: Partial<Record<BranchCode, { title: string; share: number }[]>> = {
    CSE: SYLLABUS.map((s) => ({ title: s.title, share: s.subjects.reduce((n, x) => n + (by.get(x) ?? 0), 0) / total })),
  };
  for (const code of SYLLABUS_PAGE_BRANCHES) {
    if (!branchByCode(code)?.live) continue;
    const st = branchSyllabusStats(code);
    if (st) byBranch[code] = st.sections.map((s) => ({ title: s.title, share: s.share / 100 }));
  }
  return (
    <>
      <ToolHeader
        kicker="Planner"
        title="GATE study plan & countdown"
        lead="Pick your paper and check your exam date (it is set from your target year). Choose your daily hours and weak sections. You get a live countdown, hours for every section weighted by the marks it has carried in real GATE papers, and a week-by-week plan that ends with revision and full mocks. Plus and Pro members can place the whole plan in their Study Planner in one step."
      />
      <StudyPlanTool byBranch={byBranch} />
      <SponsorSlot context="algorithms" seed={4} />
    </>
  );
}
