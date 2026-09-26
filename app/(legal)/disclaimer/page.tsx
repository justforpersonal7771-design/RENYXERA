import Link from "next/link";

export const metadata = {
  title: "Disclaimer — RENYXERA",
  description: "RENYXERA's relationship to GATE, how our questions, answers, AI explanations and predictions should be used.",
};

const A = "text-[var(--accent)] font-semibold";
const H = "text-lg font-bold text-[var(--text-primary)] mb-2";

export default function DisclaimerPage() {
  return (
    <article>
      <h1 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)] mb-1">Disclaimer</h1>
      <p className="text-sm text-[var(--text-muted)] mb-8">Last updated: 26 September 2026</p>

      <div className="space-y-8 text-[var(--text-secondary)] leading-relaxed">
        <section>
          <h2 className={H}>1. Not affiliated with GATE</h2>
          <p>
            RENYXERA is an independent study tool. It is <strong className="text-[var(--text-primary)]">not affiliated with, endorsed by or
            connected to</strong> the Indian Institutes of Technology (IITs), the Indian Institute of Science (IISc), the
            GATE organising institutes, the National Coordination Board – GATE, or the Ministry of Education.
            &ldquo;GATE&rdquo; is used only to describe the exam our content helps you prepare for. For official information —
            dates, eligibility, syllabus, results — always rely on the official GATE website of the organising institute.
          </p>
        </section>

        <section>
          <h2 className={H}>2. Previous-year questions and answer keys</h2>
          <p>
            Previous-year questions are reproduced from the question papers released publicly by the organising
            institutes, for practice, with the year and session shown. Answers are taken from the official final answer
            keys, including cases where the official key accepts more than one answer or awards marks to everyone.
            We check carefully, but transcription errors can happen — if something looks wrong, please{" "}
            <Link href="/contact" className={A}>tell us</Link>.
          </p>
        </section>

        <section>
          <h2 className={H}>3. Explanations, AI Mentor and original content</h2>
          <p>
            Explanations, practice questions, notes and AI Mentor responses are written or generated to help you learn.
            AI-generated content in particular can be incomplete or wrong. Treat it as a study aid, cross-check anything
            important with standard textbooks, and prefer the official answer key where they differ.
          </p>
        </section>

        <section>
          <h2 className={H}>4. Scores, ranks and predictions</h2>
          <p>
            Scores in RENYXERA follow GATE&apos;s marking scheme, but your RENYXERA results, goal plans, and any rank,
            score or cut-off predictions are <strong className="text-[var(--text-primary)]">estimates</strong> based on past data and your practice.
            They are not an official result and do not guarantee any score, rank, admission or job. Actual GATE
            results depend on the paper, normalisation and the performance of all candidates.
          </p>
        </section>

        <section>
          <h2 className={H}>5. No guarantee of outcomes</h2>
          <p>
            We work hard to make RENYXERA accurate and useful, but we provide it &ldquo;as is&rdquo;. We are not responsible for
            exam outcomes or for decisions made based on the app. See our <Link href="/terms" className={A}>Terms</Link> for
            the full terms of use.
          </p>
        </section>

        <section>
          <h2 className={H}>6. External links</h2>
          <p>
            Links to other websites are provided for convenience. We don&apos;t control and aren&apos;t responsible for their content
            or privacy practices.
          </p>
        </section>
      </div>
    </article>
  );
}
