import { SponsorSlot } from "@/components/ads/sponsor-slot";
import Link from "next/link";
import { ReportIssueButton } from "@/components/ui/report-issue-button";
import { ShareQuestion } from "@/components/seo/share-question";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { allPapers, allQuestions, paperBySlug, paperOfQuestion, paperQuestions, plainText, subjectSlug } from "@/lib/seo/pyq";
import { SITE_URL } from "@/lib/site";
import { PyqBody } from "@/components/seo/pyq-body";

export const dynamicParams = false;
export function generateStaticParams() {
  return allPapers().flatMap((p) => paperQuestions(p.slug).map((q) => ({ paper: p.slug, q: `q${q.question_no}` })));
}

function find(paper: string, q: string) {
  const p = paperBySlug(paper);
  if (!p) return null;
  const n = Number(q.replace(/^q/, ""));
  const qs = paperQuestions(p.slug);
  const i = qs.findIndex((x) => Number(x.question_no) === n);
  return i < 0 ? null : { p, qs, i, question: qs[i] };
}

export async function generateMetadata({ params }: { params: Promise<{ paper: string; q: string }> }): Promise<Metadata> {
  const { paper, q } = await params;
  const f = find(paper, q);
  if (!f) return {};
  const title = `${f.p.label} Q${f.question.question_no}: ${plainText(f.question, 70)} | RENYXERA`;
  const description = `${plainText(f.question, 120)} — ${f.question.subject}, ${f.question.topic}. Check the official answer and practise the full paper free.`;
  return { title, description, alternates: { canonical: `/pyq/${f.p.slug}/q${f.question.question_no}` }, openGraph: { title, description, type: "article" } };
}

export default async function QuestionPage({ params }: { params: Promise<{ paper: string; q: string }> }) {
  const { paper, q } = await params;
  const f = find(paper, q);
  if (!f) notFound();
  const { p, qs, i, question } = f;
  const prev = qs[i - 1], next = qs[i + 1];
  const related = allQuestions(p.branch).filter((x) => x.topic === question.topic && x.question_id !== question.question_id).slice(0, 6);
  const url = `${SITE_URL}/pyq/${p.slug}/q${question.question_no}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: `GATE ${p.paperCode} PYQs`, item: `${SITE_URL}/pyq` },
      { "@type": "ListItem", position: 2, name: p.label, item: `${SITE_URL}/pyq/${p.slug}` },
      { "@type": "ListItem", position: 3, name: `Question ${question.question_no}`, item: url },
    ],
  };

  return (
    <div className="py-8 sm:py-12 max-w-3xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="text-sm flex flex-wrap items-center gap-1 text-[var(--text-secondary)]">
        <Link href="/pyq" className="hover:text-violet-600">GATE {p.paperCode} PYQs</Link><span aria-hidden="true">/</span>
        <Link href={`/pyq/${p.slug}`} className="hover:text-violet-600">{p.label}</Link><span aria-hidden="true">/</span>
        <span className="text-[var(--text-primary)] font-semibold">Q{question.question_no}</span>
      </nav>

      <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">{p.label} — Question {question.question_no}</h1>
      <p className="mt-2 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-wide">
        <Link href={`/topics/${subjectSlug(question.subject || "")}`} className="px-2 py-1 rounded-md bg-violet-500/10 text-violet-700 dark:text-violet-300 hover:bg-violet-500/20">{question.subject}</Link>
        <span className="px-2 py-1 rounded-md bg-[var(--surface-secondary)] text-[var(--text-secondary)] normal-case">{question.topic}</span>
        <span className="px-2 py-1 rounded-md bg-[var(--surface-secondary)] text-[var(--text-secondary)]">{question.question_type}</span>
        <span className="px-2 py-1 rounded-md bg-[var(--surface-secondary)] text-[var(--text-secondary)]">{question.marks} mark{Number(question.marks) > 1 ? "s" : ""}{question.question_type === "MCQ" ? ` · −${Number(question.marks) === 2 ? "2/3" : "1/3"} if wrong` : ""}</span>
        {question.difficulty && <span className="px-2 py-1 rounded-md bg-[var(--surface-secondary)] text-[var(--text-secondary)]">{question.difficulty}</span>}
      </p>

      <article className="mt-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-8">
        <PyqBody id={question.question_id} type={question.question_type} question={question.contentAst} options={(question.options ?? []).map((o) => ({ option_id: o.option_id, contentAst: o.contentAst }))} paperYearShift={p.yearShift} />
      </article>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2"><ShareQuestion url={url} label={`${p.label}, Q${question.question_no}`} /><ReportIssueButton questionId={question.question_id} source="public" /></div>

      <SponsorSlot context={`${question.subject} ${question.topic}`} seed={Number(question.question_no)} />

      <nav aria-label="More questions" className="mt-6 grid grid-cols-2 gap-3">
        {prev ? <Link href={`/pyq/${p.slug}/q${prev.question_no}`} className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] p-3 text-sm font-semibold text-[var(--text-primary)] hover:border-violet-500/50"><ArrowLeft className="w-4 h-4" /> Q{prev.question_no}</Link> : <span />}
        {next ? <Link href={`/pyq/${p.slug}/q${next.question_no}`} className="inline-flex items-center justify-end gap-2 rounded-xl border border-[var(--border)] p-3 text-sm font-semibold text-[var(--text-primary)] hover:border-violet-500/50">Q{next.question_no} <ArrowRight className="w-4 h-4" /></Link> : <span />}
      </nav>

      {related.length > 0 && (
        <section className="mt-10" aria-labelledby="related">
          <h2 id="related" className="text-lg font-extrabold text-[var(--text-primary)] mb-3">More on {question.topic}</h2>
          <ul className="space-y-2">
            {related.map((r) => {
              const rp = paperOfQuestion(r.question_id);
              return rp ? (
                <li key={r.question_id}>
                  <Link href={`/pyq/${rp.slug}/q${r.question_no}`} className="block rounded-xl border border-[var(--border)] p-3 hover:border-violet-500/50">
                    <span className="text-xs font-bold text-violet-600 dark:text-violet-400">{rp.label} · Q{r.question_no}</span>
                    <span className="block text-sm text-[var(--text-primary)] line-clamp-2">{plainText(r, 140) || "Question with a figure"}</span>
                  </Link>
                </li>
              ) : null;
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
