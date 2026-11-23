import { notFound } from "next/navigation";
import { chapterForViewer, studyOpenForBranch } from "@/lib/study/serve";
import { BranchSoon } from "@/components/branch/branch-soon";
import { toWire } from "@/lib/study/schema";
import { ChapterView } from "@/components/study/chapter-view";

/** Server component behind every chapter route: reads the viewer's access and sends only the topics they may open. */
export async function ChapterPage({ href }: { href: string }) {
  if (!(await studyOpenForBranch())) return <div className="p-4 sm:p-6"><BranchSoon feature="study" /></div>;
  const ch = await chapterForViewer(href, undefined, true);
  if (!ch) notFound();
  return <ChapterView chapter={toWire(ch)} href={href} />;
}
