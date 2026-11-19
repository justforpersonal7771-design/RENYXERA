import { ChapterPage } from "@/components/study/chapter-page";

/** /study/virtual-memory: rendered on the server with only the topics this viewer may open. */
export default function VirtualMemoryChapter() {
  return <ChapterPage href="/study/virtual-memory" />;
}
