import { InterviewGate } from "@/components/interview/interview-gate";
import { IvNav } from "@/components/interview/iv-nav";

export default function InterviewLayout({ children }: { children: React.ReactNode }) {
  return <InterviewGate><div className="w-full pb-8"><IvNav />{children}</div></InterviewGate>;
}
