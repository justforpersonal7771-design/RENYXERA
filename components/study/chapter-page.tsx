import { notFound } from "next/navigation";
import { chapterForViewer } from "@/lib/study/serve";
import { toWire } from "@/lib/study/schema";
import { ChapterView } from "@/components/study/chapter-view";

/** Server component behind every chapter route: reads the viewer's access and sends only the topics they may open. */
export async function ChapterPage({ href }: { href: string }) {
  const ch = await chapterForViewer(href);
  if (!ch) notFound();
  return <ChapterView chapter={toWire(ch)} href={href} />;
}
