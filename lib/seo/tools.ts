// One registry for the free public tools and data pages, so the navbar, the bottom tools
// dock, the sitemap and cross-links all stay in sync. The first entry is where "Tools" opens.
export type ToolEntry = { href: string; title: string; short: string; blurb: string; kind: "tool" | "article"; icon: "calculator" | "chart" | "calendar" | "flame" | "book" | "file"; also?: string[] };

export const TOOLS: ToolEntry[] = [
  { href: "/gate-cs-syllabus", title: "Syllabus with weightage", short: "Syllabus", blurb: "The official GATE 2027 syllabus with the weightage of every section and topic.", kind: "tool", icon: "book" },
  { href: "/pyq", title: "Previous year questions", short: "PYQs", blurb: "Every official GATE CS paper since 2017, paper-wise and subject-wise.", kind: "tool", icon: "file", also: ["/pyq/", "/topics/"] },
  { href: "/articles/most-repeated-gate-cs-topics", title: "Most repeated topics", short: "Repeated topics", blurb: "Topics ranked by how many years they were asked and the marks they carried.", kind: "article", icon: "flame" },
  { href: "/articles/gate-cs-preparation-150-days", title: "150-day plan", short: "150-day plan", blurb: "A data-driven 150-day GATE CS plan with a day budget per subject.", kind: "article", icon: "calendar" },
  { href: "/tools/gate-score-calculator", title: "Score & rank predictor", short: "Rank predictor", blurb: "Turn your raw marks into an estimated GATE score, rank band and category cut-off check.", kind: "tool", icon: "calculator" },
  { href: "/tools/gate-cs-cutoff", title: "Cutoffs & marks vs rank", short: "Cutoffs", blurb: "Qualifying cut-offs by year and category, and what marks have meant for rank.", kind: "tool", icon: "chart" },
  { href: "/tools/gate-study-plan", title: "Study plan & countdown", short: "Study planner", blurb: "A week-by-week plan weighted by real past-paper weightage, with a live countdown.", kind: "tool", icon: "calendar" },
];

export const TOOLS_HOME = TOOLS[0].href;
export const isToolPath = (p: string | null | undefined) => !!p && TOOLS.some((t) => p === t.href || (t.also ?? []).some((a) => p.startsWith(a)));
