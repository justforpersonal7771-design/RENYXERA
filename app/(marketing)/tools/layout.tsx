import { ToolsFrame } from "@/components/seo/tool-shell";

// Every free tool shares one area: a sticky tools rail beside the tool on desktop, a
// switcher above it on phones. The /tools hub shows the full grid instead.
export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <ToolsFrame>{children}</ToolsFrame>;
}
