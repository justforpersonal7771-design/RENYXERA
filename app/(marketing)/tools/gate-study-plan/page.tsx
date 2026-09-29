import type { Metadata } from "next";
import { subjects } from "@/lib/seo/pyq";
import { SYLLABUS } from "@/lib/seo/syllabus";
import { StudyPlanTool } from "@/components/seo/study-plan-tool";
import { SponsorSlot } from "@/components/ads/sponsor-slot";

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
    <div className="py-10 sm:py-14 max-w-5xl">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400">Free tool</p>
      <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">GATE CS study plan generator</h1>
      <p className="mt-3 mb-8 text-[var(--text-secondary)] leading-relaxed max-w-3xl">Set your exam date, daily hours and weak sections. You get a countdown, hours for every syllabus section based on how many marks it has carried in real GATE CS papers, and a week-by-week plan that ends with revision and full mocks.</p>
      <StudyPlanTool sections={sections} />
      <SponsorSlot context="algorithms" seed={4} />
    </div>
  );
}
