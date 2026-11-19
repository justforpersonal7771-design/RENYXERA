import { ChapterPage } from "@/components/study/chapter-page";

/** /study/groups: rendered on the server with only the topics this viewer may open. */
export default function GroupsChapter() {
  return <ChapterPage href="/study/groups" />;
}
