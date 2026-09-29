// One registry for the free public tools and data articles, so the header, the /tools hub,
// the sitemap and cross-links all stay in sync when a tool is added.
export type ToolEntry = { href: string; title: string; blurb: string; kind: "tool" | "article"; icon: "calculator" | "chart" | "calendar" | "flame" | "book" };

export const TOOLS: ToolEntry[] = [
  { href: "/tools/gate-score-calculator", title: "Score & rank predictor", blurb: "Turn your raw marks into an estimated GATE score, rank band and category cut-off check.", kind: "tool", icon: "calculator" },
  { href: "/tools/gate-cs-cutoff", title: "Cutoffs & marks vs rank", blurb: "Qualifying cut-offs by year and category, and what marks have meant for rank.", kind: "tool", icon: "chart" },
  { href: "/tools/gate-study-plan", title: "Study plan & countdown", blurb: "A week-by-week plan weighted by real past-paper weightage, with a live countdown.", kind: "tool", icon: "calendar" },
  { href: "/gate-cs-syllabus", title: "Syllabus with weightage", blurb: "The official GATE 2027 syllabus with the weightage of every section and topic.", kind: "tool", icon: "book" },
  { href: "/articles/most-repeated-gate-cs-topics", title: "Most repeated topics", blurb: "Topics ranked by how many years they were asked and the marks they carried.", kind: "article", icon: "flame" },
];

export const PUBLIC_NAV = [
  { href: "/pyq", label: "PYQs" },
  { href: "/gate-cs-syllabus", label: "Syllabus" },
  { href: "/tools", label: "Tools" },
] as const;
