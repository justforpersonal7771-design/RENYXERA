import { ChapterPage } from "@/components/study/chapter-page";

/** /study/transactions: rendered on the server with only the topics this viewer may open. */
export default function TransactionsChapter() {
  return <ChapterPage href="/study/transactions" />;
}
