import { redirect } from "next/navigation";

/** The old Coach insights screen no longer exists: its parts now live on Analytics and the AI Mentor. Old links and bookmarks land on Analytics. */
export default function CoachMoved() {
  redirect("/analytics");
}
