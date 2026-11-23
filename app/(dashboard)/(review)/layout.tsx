import { ReviewTabs } from "@/components/layout/review-tabs";

/** The Review tab bar lives in this layout, so it stays mounted while you move between Mistakes, Bookmarks, Notes and Revision: only the content under it changes. */
export default function ReviewLayout({ children }: { children: React.ReactNode }) {
  return <><ReviewTabs />{children}</>;
}
