import type { Metadata } from "next";
import { ScorePredictor } from "@/components/seo/score-predictor";
import { SponsorSlot } from "@/components/ads/sponsor-slot";
import { ToolHeader } from "@/components/seo/tool-shell";

export const metadata: Metadata = {
  title: "GATE CS Score Calculator & Rank Predictor (Marks vs Rank) | RENYXERA",
  description: "Enter your GATE CS marks to see your GATE score, likely All-India Rank range and whether you qualify for your category — based on published GATE CS results.",
  alternates: { canonical: "/tools/gate-score-calculator" },
  openGraph: { title: "GATE CS Score Calculator & Rank Predictor", description: "Marks → GATE score, likely AIR and qualifying status.", type: "website" },
};

const FAQ = [
  { q: "How is the GATE score calculated?", a: "GATE uses a normalised formula: Score = Sq + (St − Sq) × (M − Mq) / (Mt − Mq), where M is your marks, Mq the General qualifying mark, Mt the mean marks of the top 0.1% of candidates, Sq = 350 and St = 900. The score is issued only to qualified candidates." },
  { q: "What are the GATE CS qualifying marks?", a: "The General qualifying mark is the higher of 25 and the mean plus standard deviation of all candidates' marks. OBC-NCL and EWS candidates need 90% of it, and SC, ST and PwD candidates two-thirds." },
  { q: "How accurate is the rank prediction?", a: "It blends published marks-vs-rank tables from recent GATE CS results into a median with a range. Ranks move a little each year with paper difficulty and the number of candidates, so treat it as a range, not a promise." },
];

export default function ScoreCalculatorPage() {
  const jsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolHeader kicker="Predictor" title="GATE CS score & rank predictor" lead="Move the slider to your marks and pick your category. You'll see your GATE score, where you land on the real marks-vs-rank curve, and whether you clear the qualifying mark." />
      <ScorePredictor />
      <SponsorSlot context="aptitude" seed={1} />
      <section className="space-y-3" aria-labelledby="faq">
        <h2 id="faq" className="text-xl font-extrabold text-[var(--text-primary)]">Frequently asked questions</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {FAQ.map((f) => (
            <details key={f.q} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 h-fit">
              <summary className="font-semibold text-[var(--text-primary)] cursor-pointer">{f.q}</summary>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
