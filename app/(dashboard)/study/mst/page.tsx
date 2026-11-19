import { ChapterPage } from "@/components/study/chapter-page";

/** /study/mst: rendered on the server with only the topics this viewer may open. */
export default function MstChapter() {
  return <ChapterPage href="/study/mst" />;
}
