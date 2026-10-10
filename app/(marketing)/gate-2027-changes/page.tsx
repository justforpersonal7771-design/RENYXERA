import { permanentRedirect } from "next/navigation";

// The page was renamed "GATE updates"; old links keep working.
export default function OldGateChanges() {
  permanentRedirect("/gate-updates");
}
