import { ChapterPage } from "@/components/study/chapter-page";

/** /study/counting: rendered on the server with only the topics this viewer may open. */
export default function CountingChapter() {
  return <ChapterPage href="/study/counting" />;
}
