import { ChapterPage } from "@/components/study/chapter-page";

/** /study/data-link: rendered on the server with only the topics this viewer may open. */
export default function DataLinkChapter() {
  return <ChapterPage href="/study/data-link" />;
}
