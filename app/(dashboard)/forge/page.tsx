import { redirect } from "next/navigation";

// Forge now lives inside Exam Setup (question source "Forge").
export default function ForgePage() {
  redirect("/setup?source=forge");
}
