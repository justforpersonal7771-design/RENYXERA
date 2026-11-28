import { ChapterPage } from "@/components/study/chapter-page";

/** /study/sequential: rendered on the server with only the topics this viewer may open. */
export default function SequentialChapter() {
  return <ChapterPage href="/study/sequential" />;
}
