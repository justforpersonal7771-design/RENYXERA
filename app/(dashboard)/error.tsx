"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { isStaleDeployError, reloadForNewVersion } from "@/lib/stale-deploy";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const stale = isStaleDeployError(error);
  const [reloading, setReloading] = useState(stale);

  useEffect(() => {
    console.error(error);
    // A new version was deployed while this tab was open — load it instead of erroring.
    if (stale && !reloadForNewVersion()) setReloading(false);
  }, [error, stale]);

  if (reloading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-center">
        <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
        <p className="text-sm font-semibold text-[var(--text-primary)]">Updating to the latest version…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 px-4 text-center">
      <h2 className="text-xl font-bold text-[var(--text-primary)]">{stale ? "A new version is available" : "Something went wrong"}</h2>
      <p className="text-sm text-[var(--text-secondary)] max-w-md">
        {stale ? "Reload to continue — your data is saved on this device." : "This page hit an unexpected problem. Your data is safe; try again or reload the page."}
      </p>
      <div className="flex gap-2">
        {!stale && (
          <button onClick={() => reset()} className="px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-semibold text-[var(--text-primary)] cursor-pointer">Try again</button>
        )}
        <button onClick={() => window.location.reload()} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold cursor-pointer">
          <RefreshCw className="w-4 h-4" /> Reload
        </button>
      </div>
    </div>
  );
}
