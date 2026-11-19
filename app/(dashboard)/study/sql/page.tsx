import { ChapterPage } from "@/components/study/chapter-page";

/** /study/sql: rendered on the server with only the topics this viewer may open. */
export default function SqlChapter() {
  return <ChapterPage href="/study/sql" />;
}
