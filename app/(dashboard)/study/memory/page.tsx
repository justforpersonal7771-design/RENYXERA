import { ChapterPage } from "@/components/study/chapter-page";

/** /study/memory: rendered on the server with only the topics this viewer may open. */
export default function MemoryChapter() {
  return <ChapterPage href="/study/memory" />;
}
