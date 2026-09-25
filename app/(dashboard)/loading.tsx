import { BrandMark } from "@/components/brand/wordmark";

/**
 * Shown while a dashboard route's code/data is being fetched on navigation. Kept quiet
 * and brand-consistent (breathing mark + a thin gradient bar) instead of a spinner with
 * "Loading dashboard…" text — which was also wrong on every non-dashboard page.
 */
export default function DashboardLoading() {
  return (
    <div className="flex h-[50vh] items-center justify-center" role="status" aria-label="Loading">
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <span className="absolute inset-0 rounded-full bg-violet-500/25 blur-xl animate-pulse" />
          <span className="relative block animate-pulse">
            <BrandMark className="h-12 w-12" />
          </span>
        </div>
        <div className="relative w-28 h-[3px] rounded-full bg-[var(--border)] overflow-hidden">
          <span className="absolute inset-y-0 w-1/2 rounded-full bg-gradient-to-r from-[#06c2fb] via-[#5b21e0] to-[#dd42fb] animate-[loader-slide_1.1s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}
