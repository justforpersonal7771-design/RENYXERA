import type { Metadata } from "next";
import { BranchCutoffs } from "@/components/seo/branch-cutoffs";
import { ToolHeader } from "@/components/seo/tool-shell";

export const metadata: Metadata = {
  title: "GATE 2026 Cut-off for CS, EC, EE, ME, CE, DA (All Categories) & Score Calculator | RENYXERA",
  description: "Official GATE 2026 qualifying marks for General, OBC-NCL/EWS and SC/ST/PwD in six papers, with candidates appeared and qualified, and a marks to GATE score calculator.",
  alternates: { canonical: "/tools/gate-branch-cutoffs" },
  openGraph: { title: "GATE 2026 cut-offs by branch", description: "Official qualifying marks and a GATE score calculator for CS, EC, EE, ME, CE and DA.", type: "website" },
};

export default function BranchCutoffsPage() {
  return (
    <>
      <ToolHeader kicker="Cut-offs" title="GATE 2026 cut-offs by branch" lead="Official qualifying marks for six papers, how many candidates appeared and qualified, and a calculator that turns your marks into a GATE score. Figures are from the IIT Guwahati statistical report." />
      <BranchCutoffs />
    </>
  );
}
