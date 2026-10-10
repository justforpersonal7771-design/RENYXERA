"use client";

import { BranchHub } from "@/components/seo/branch-hub";
import { plan150Href } from "@/lib/seo/branch-links";

export default function Plan150Hub() {
  return <BranchHub kicker="Study guide" title="How to prepare for GATE in 150 days, by paper" lead="A day budget for every subject, built from the real weightage of the official papers in our bank, in three phases. Pick your paper." hrefFor={plan150Href} />;
}
