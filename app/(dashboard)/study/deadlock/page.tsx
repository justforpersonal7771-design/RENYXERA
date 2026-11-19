import { ChapterPage } from "@/components/study/chapter-page";

/** /study/deadlock: rendered on the server with only the topics this viewer may open. */
export default function DeadlockChapter() {
  return <ChapterPage href="/study/deadlock" />;
}
