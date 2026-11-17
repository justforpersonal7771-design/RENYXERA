"use client";

import { useEffect, useState } from "react";
import { getCurrentBranch } from "@/lib/branch/current";
import { mostRepeatedHref, syllabusHref } from "@/lib/seo/branch-links";
import type { BranchCode } from "@/lib/branches";

/**
 * In-app links to a branch picker ("/syllabus", "/articles/most-repeated-topics") go straight to the learner's own
 * branch page, so the picker never flashes before redirecting. Server HTML keeps the hub URL (search engines);
 * the branch is read after mount (it lives on the device).
 */
export function useBranchHref(): (href: string) => string {
  const [code, setCode] = useState<BranchCode | null>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- device-only value, read once after mount
  useEffect(() => { setCode(getCurrentBranch()); }, []);
  return (href) => {
    if (!code) return href;
    if (href === "/syllabus") return syllabusHref(code);
    if (href === "/articles/most-repeated-topics") return mostRepeatedHref(code);
    return href;
  };
}
