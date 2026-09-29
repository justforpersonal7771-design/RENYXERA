import type { Metadata } from "next";
import { subjects } from "@/lib/seo/pyq";
import { SYLLABUS } from "@/lib/seo/syllabus";
import { StudyPlanTool } from "@/components/seo/study-plan-tool";
import { SponsorSlot } from "@/components/ads/sponsor-slot";
import { ToolHeader } from "@/components/seo/tool-shell";

export const metadata: Metadata = {
  title: "GATE CS Study Plan Generator & Countdown (Free, Weightage-based) | RENYXERA",
  description: "Make a week-by-week GATE CS study plan from your hours per day and weak subjects. Time per section follows real past-paper weightage, with revision and full-mock phases and a live countdown.",
  alternates: { canonical: "/tools/gate-study-plan" },
  openGraph: { title: "GATE CS Study Plan Generator", description: "A week-by-week plan weighted by real GATE CS weightage.", type: "website" },
};

export default function StudyPlanPage() {
  const subs = subjects();
  const by = new Map(subs.map((s) => [s.name, s.marks]));
  const total = subs.reduce((n, s) => n + s.marks, 0) || 1;
  const sections = SYLLABUS.map((s) => ({ title: s.title, share: s.subjects.reduce((n, x) => n + (by.get(x) ?? 0), 0) / total }));
  return (
    <>
      <ToolHeader kicker="Planner" title="GATE CS study plan & countdown" lead="Set your exam date, daily hours and weak subjects. You get a live countdown, hours for every subject weighted by how many marks it has carried in real GATE CS papers, and a week-by-week plan that ends with revision and full mocks." />
      <StudyPlanTool sections={sections} />
      <SponsorSlot context="algorithms" seed={4} />
    </>
  );
}
