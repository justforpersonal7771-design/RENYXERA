import type { Metadata } from "next";
import Link from "next/link";
import { ScorePredictor } from "@/components/seo/score-predictor";
import { AdSlot } from "@/components/ads/ad-slot";

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
    <div className="py-10 sm:py-14 max-w-4xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400">Free tool</p>
      <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">GATE CS score calculator &amp; rank predictor</h1>
      <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">Move the slider to your marks. You&apos;ll see your GATE score, the All-India Rank range students with those marks usually get, and whether you clear the qualifying mark for your category.</p>
      <div className="mt-8"><ScorePredictor /></div>
      <AdSlot />
      <section className="mt-4 space-y-4" aria-labelledby="faq">
        <h2 id="faq" className="text-xl font-extrabold text-[var(--text-primary)]">Frequently asked questions</h2>
        {FAQ.map((f) => (
          <details key={f.q} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <summary className="font-semibold text-[var(--text-primary)] cursor-pointer">{f.q}</summary>
            <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">{f.a}</p>
          </details>
        ))}
      </section>
      <p className="mt-8 text-sm text-[var(--text-secondary)]">Practise with real papers: <Link href="/pyq" className="font-semibold text-violet-600 dark:text-violet-400">every GATE CS PYQ since 2017</Link>.</p>
    </div>
  );
}
