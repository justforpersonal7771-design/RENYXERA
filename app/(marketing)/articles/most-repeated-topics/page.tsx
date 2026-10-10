"use client";

import { BranchHub } from "@/components/seo/branch-hub";
import { mostRepeatedHref } from "@/lib/seo/branch-links";

export default function MostRepeatedHub() {
  return <BranchHub kicker="Data article" title="Most repeated GATE topics, by paper" lead="Which topics come back year after year, ranked by years asked and marks carried, from every official paper in our bank. Pick your paper." hrefFor={mostRepeatedHref} />;
}
