"use client";

import { useSyncExternalStore } from "react";
import { paperLabel } from "@/lib/branch/current";

const noop = () => () => {};

/** "CS", "EC", … — hydration-safe: "CS" on the server and the first client pass, then the real
 *  branch (React re-renders after hydration without a mismatch error). */
export function usePaperLabel(): string {
  return useSyncExternalStore(noop, paperLabel, () => "CS");
}
