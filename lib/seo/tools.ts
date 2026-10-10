// One registry for the free public tools and data pages, so the navbar, the bottom tools
// dock, the sitemap and cross-links all stay in sync. The first entry is where "Tools" opens.
export type ToolEntry = { href: string; title: string; short: string; blurb: string; kind: "tool" | "article"; icon: "calculator" | "chart" | "calendar" | "flame" | "book" | "file"; also?: string[] };

export const TOOLS: ToolEntry[] = [
  { href: "/syllabus", title: "Syllabus with weightage", short: "Syllabus", blurb: "The official GATE 2027 syllabus with the weightage of every section and topic, for your branch.", kind: "tool", icon: "book", also: ["/gate-cs-syllabus", "/gate-ec-syllabus", "/gate-ee-syllabus", "/gate-me-syllabus", "/gate-da-syllabus"] },
  { href: "/gate-2027-changes", title: "GATE 2027 changes", short: "2027 changes", blurb: "What changed for GATE 2027 and the dates that matter, with the official source for each.", kind: "article", icon: "file" },
  { href: "/pyq", title: "Previous year questions", short: "PYQs", blurb: "Official GATE papers for CS, DA, EC, EE and ME, paper-wise and topic-wise.", kind: "tool", icon: "file", also: ["/pyq/", "/topics/"] },
  { href: "/articles/most-repeated-topics", title: "Most repeated topics", short: "Repeated topics", blurb: "Topics ranked by how many years they were asked and the marks they carried, for your paper.", kind: "article", icon: "flame", also: ["/articles/most-repeated-gate-cs-topics", "/articles/most-repeated-topics/"] },
  { href: "/articles/preparation-150-days", title: "150-day plan", short: "150-day plan", blurb: "A data-driven 150-day plan for your paper, with a day budget per subject.", kind: "article", icon: "calendar", also: ["/articles/gate-cs-preparation-150-days", "/articles/preparation-150-days/"] },
  { href: "/tools/gate-score-calculator", title: "Score & rank predictor", short: "Rank predictor", blurb: "Turn your raw marks into an estimated GATE score, rank band and category cut-off check.", kind: "tool", icon: "calculator" },
  { href: "/tools/gate-cs-cutoff", title: "Cutoffs & marks vs rank", short: "Cutoffs", blurb: "Qualifying cut-offs by year and category, and what marks have meant for rank.", kind: "tool", icon: "chart" },
  { href: "/tools/gate-study-plan", title: "Study plan & countdown", short: "Study planner", blurb: "A week-by-week plan weighted by real past-paper weightage, with a live countdown.", kind: "tool", icon: "calendar" },
];

export const TOOLS_HOME = "/tools";
export const isToolPath = (p: string | null | undefined) => !!p && (p === "/tools" || TOOLS.some((t) => p === t.href || (t.also ?? []).some((a) => p.startsWith(a))));
