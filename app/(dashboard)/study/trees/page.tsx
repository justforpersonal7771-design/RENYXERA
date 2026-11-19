import { ChapterPage } from "@/components/study/chapter-page";

/** /study/trees: rendered on the server with only the topics this viewer may open. */
export default function TreesChapter() {
  return <ChapterPage href="/study/trees" />;
}
