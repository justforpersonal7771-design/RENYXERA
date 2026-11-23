import { ChapterPage } from "@/components/study/chapter-page";

/** /study/main-memory: rendered on the server with only the topics this viewer may open. */
export default function MainMemoryChapter() {
  return <ChapterPage href="/study/main-memory" />;
}
