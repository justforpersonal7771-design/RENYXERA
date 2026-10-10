"use client";

import { BranchHub } from "@/components/seo/branch-hub";
import { syllabusHref } from "@/lib/seo/branch-links";

export default function SyllabusHub() {
  return <BranchHub kicker="Official syllabus · GATE 2027" title="GATE 2027 syllabus with topic-wise weightage" lead="Pick your paper. Each page shows the official syllabus section by section, with how many marks every subject and topic carried in past GATE papers." hrefFor={syllabusHref} />;
}
