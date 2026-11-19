import { ChapterPage } from "@/components/study/chapter-page";

/** /study/files: rendered on the server with only the topics this viewer may open. */
export default function FilesChapter() {
  return <ChapterPage href="/study/files" />;
}
