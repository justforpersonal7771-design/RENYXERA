import { ChapterPage } from "@/components/study/chapter-page";

/** /study/scheduling: rendered on the server with only the topics this viewer may open. */
export default function SchedulingChapter() {
  return <ChapterPage href="/study/scheduling" />;
}
