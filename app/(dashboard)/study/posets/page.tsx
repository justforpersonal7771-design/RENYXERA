import { ChapterPage } from "@/components/study/chapter-page";

/** /study/posets: rendered on the server with only the topics this viewer may open. */
export default function PosetsChapter() {
  return <ChapterPage href="/study/posets" />;
}
