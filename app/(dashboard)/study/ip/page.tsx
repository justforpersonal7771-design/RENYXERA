import { ChapterPage } from "@/components/study/chapter-page";

/** /study/ip: rendered on the server with only the topics this viewer may open. */
export default function IpChapter() {
  return <ChapterPage href="/study/ip" />;
}
