/**
 * House promotions (6C, Layer 2). Shown when no vetted ad network is configured, or when
 * an ad blocker removed the network's slot. Everything here is either our own feature or a
 * standard-textbook affiliate link — academic, static, no tracking scripts, no animation.
 *
 * Affiliate items only appear when NEXT_PUBLIC_AMAZON_TAG (an Amazon Associates India
 * tracking id) is set; until then only our own promos show. Links are plain first-party
 * <a> tags with rel="sponsored", matched to the subject the student is reading.
 */
export type Promo = {
  id: string;
  kind: "house" | "affiliate";
  title: string;
  blurb: string;
  cta: string;
  href: string;
  /** Lower-case keywords matched against the page's subject/topic. Empty = general. */
  subjects: string[];
  tone: "violet" | "emerald" | "amber" | "sky";
};

const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_TAG;
const book = (q: string) => `https://www.amazon.in/s?k=${encodeURIComponent(q)}${AMAZON_TAG ? `&tag=${encodeURIComponent(AMAZON_TAG)}` : ""}`;

const BOOKS: Omit<Promo, "kind" | "tone">[] = [
  { id: "clrs", title: "Introduction to Algorithms (CLRS)", blurb: "The standard reference behind most GATE algorithm questions.", cta: "View the book", href: book("Introduction to Algorithms Cormen"), subjects: ["algorithm", "data structure", "graph", "sorting"] },
  { id: "rosen", title: "Discrete Mathematics and Its Applications (Rosen)", blurb: "Logic, sets, relations, combinatorics and graph theory, with worked examples.", cta: "View the book", href: book("Discrete Mathematics and Its Applications Rosen"), subjects: ["discrete", "graph theory", "combinator", "logic", "set theory"] },
  { id: "korth", title: "Database System Concepts (Korth)", blurb: "Normalisation, SQL, transactions and indexing — the DBMS syllabus in one book.", cta: "View the book", href: book("Database System Concepts Korth"), subjects: ["database", "dbms", "sql", "normal", "transaction"] },
  { id: "galvin", title: "Operating System Concepts (Galvin)", blurb: "Scheduling, synchronisation, deadlocks, memory and file systems.", cta: "View the book", href: book("Operating System Concepts Galvin"), subjects: ["operating system", "scheduling", "deadlock", "paging", "memory"] },
  { id: "tanenbaum", title: "Computer Networks (Tanenbaum)", blurb: "Layers, routing, TCP/IP and error control, explained clearly.", cta: "View the book", href: book("Computer Networks Tanenbaum"), subjects: ["network", "tcp", "routing", "ip "] },
  { id: "dragon", title: "Compilers: Principles, Techniques & Tools", blurb: "The \"Dragon Book\" for parsing, syntax-directed translation and code generation.", cta: "View the book", href: book("Compilers Principles Techniques and Tools Aho"), subjects: ["compiler", "parsing", "lexical", "syntax"] },
  { id: "hopcroft", title: "Introduction to Automata Theory (Hopcroft & Ullman)", blurb: "Regular languages, CFGs, pushdown automata and Turing machines.", cta: "View the book", href: book("Introduction to Automata Theory Hopcroft Ullman"), subjects: ["theory of computation", "automata", "regular", "context-free", "toc"] },
  { id: "patterson", title: "Computer Organization and Design (Patterson & Hennessy)", blurb: "Pipelining, caches, memory hierarchy and instruction sets.", cta: "View the book", href: book("Computer Organization and Design Patterson Hennessy"), subjects: ["computer organization", "architecture", "coa", "pipelin", "cache"] },
  { id: "mano", title: "Digital Design (Morris Mano)", blurb: "Boolean algebra, combinational and sequential circuits.", cta: "View the book", href: book("Digital Design Morris Mano"), subjects: ["digital", "logic", "boolean", "combinational", "sequential"] },
  { id: "grewal", title: "Higher Engineering Mathematics (B.S. Grewal)", blurb: "Linear algebra, calculus and probability for the maths section.", cta: "View the book", href: book("Higher Engineering Mathematics B S Grewal"), subjects: ["linear algebra", "calculus", "probability", "statistics", "mathematic"] },
  { id: "aptitude", title: "Quantitative Aptitude (R.S. Aggarwal)", blurb: "Practice for GATE's General Aptitude section.", cta: "View the book", href: book("Quantitative Aptitude R S Aggarwal"), subjects: ["aptitude", "verbal", "quantitative", "analytical", "spatial"] },
];

const HOUSE: Promo[] = [
  { id: "mock", kind: "house", title: "Free All-India Mock — every Sunday", blurb: "A full GATE CS paper, exactly 180 minutes, ranked across India with your GATE score.", cta: "See the schedule", href: "/mocks", subjects: [], tone: "violet" },
  { id: "calculator", kind: "house", title: "What rank do your marks get?", blurb: "GATE score, likely All-India Rank and qualifying marks for your category.", cta: "Try the calculator", href: "/tools/gate-score-calculator", subjects: [], tone: "emerald" },
  { id: "challenge", kind: "house", title: "This week's 10-question challenge", blurb: "Same 10 past-GATE questions for everyone this week — see where you stand.", cta: "Take the challenge", href: "/mocks#challenge", subjects: [], tone: "amber" },
  { id: "practice", kind: "house", title: "Practise this subject in the exam simulator", blurb: "Timed, GATE-style tests with analytics that find your weak topics.", cta: "Start practising", href: "/setup", subjects: [], tone: "sky" },
];

const TONES: Promo["tone"][] = ["violet", "emerald", "amber", "sky"];

/** Best promo for a page: a subject-matched book (if affiliate is on), else a house promo. */
export function pickPromo(context: string, seed = 0): Promo {
  const ctx = context.toLowerCase();
  if (AMAZON_TAG) {
    const hit = BOOKS.find((b) => b.subjects.some((k) => ctx.includes(k)));
    if (hit) return { ...hit, kind: "affiliate", tone: TONES[seed % TONES.length] };
  }
  return HOUSE[Math.abs(seed) % HOUSE.length];
}
