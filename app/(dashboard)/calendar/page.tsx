"use client";

import dynamic from "next/dynamic";
import { Calendar } from "lucide-react";
import { PlanManager, TelegramStatusChip } from "@/components/planner/plan-manager";
import { PlanInsights } from "@/components/planner/plan-insights";

const StudyPlanner = dynamic(() => import("@/components/dashboard/study-planner").then(m => m.StudyPlanner), {
  ssr: false,
  loading: () => <div className="skeleton-shimmer h-[560px] rounded-3xl" />
});

export default function CalendarPage() {
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-md">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[var(--text-primary)] tracking-tight">Study Planner</h1>
            <p className="text-xs font-semibold text-[var(--text-secondary)]">Schedule revisions, mocks, and practice. Quick access from the top bar too.</p>
          </div>
        </div>
        <TelegramStatusChip />
      </div>

      <PlanManager />
      <PlanInsights />
      <StudyPlanner />
    </div>
  );
}
