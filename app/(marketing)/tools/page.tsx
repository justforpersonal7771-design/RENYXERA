import { redirect } from "next/navigation";

// The tools area opens straight on its first tool (the syllabus with weightage); every
// tool is reachable from the bottom tools dock.
export default function ToolsIndex() {
  redirect("/gate-cs-syllabus");
}
