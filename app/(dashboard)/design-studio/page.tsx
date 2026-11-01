import { redirect } from "next/navigation";

/** The Design Studio lives in Profile now; the old address (and the navbar button's quick window) lead there. */
export default function DesignStudioMoved() {
  redirect("/profile?tab=design");
}
