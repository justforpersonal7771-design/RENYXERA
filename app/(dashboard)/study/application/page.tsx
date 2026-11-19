import { ChapterPage } from "@/components/study/chapter-page";

/** /study/application: rendered on the server with only the topics this viewer may open. */
export default function ApplicationChapter() {
  return <ChapterPage href="/study/application" />;
}
