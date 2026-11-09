/** How the 27 books are grouped for study: track, then book, then chapters. Books not listed fall into "More". */
export type Track = { id: string; title: string; blurb: string; tint: "sky" | "lilac" | "mint" | "peach" | "butter" | "rose"; books: string[] };
export const TRACKS: Track[] = [
  { id: "backend", title: "Backend and cloud", blurb: ".NET, SQL Server, Azure, DevOps and your codebase", tint: "sky", books: ["Book-00-complyia-codebase", "Book-01-dotnet", "Book-02-sql-server", "Book-03-azure", "Book-04-azure-devops", "Book-05-fullstack-integration", "Book-06-run-build-debug"] },
  { id: "frontend", title: "Frontend and product", blurb: "React, TypeScript and the RENYXERA guide", tint: "lilac", books: ["Book-07-react-typescript", "Book-08-renyxera"] },
  { id: "dsa", title: "Data structures and algorithms", blurb: "Patterns and problems in C# and C++", tint: "mint", books: ["DSA-1-foundations", "DSA-2-structures-graphs", "DSA-3-paradigms-problems"] },
  { id: "sd", title: "System design", blurb: "Scaling, data, messaging, reliability, HLD and LLD", tint: "peach", books: ["SD-1-fundamentals-scaling", "SD-2-data-distributed", "SD-3-messaging-async", "SD-4-reliability-security-ops", "SD-5-hld-case-studies", "SD-6-lld-oop"] },
  { id: "ai", title: "AI engineering", blurb: "GenAI, RAG, agents, LLMOps and AI-assisted coding", tint: "butter", books: ["AI-1-genai-foundations", "AI-2-ai-assisted-coding", "AI-2B-claude-power-user", "AI-3-rag-and-search", "AI-4-agents-mcp-orchestration", "AI-5-llmops-security-governance", "AI-6-career-interviews-road-ahead"] },
  { id: "people", title: "English and interviews", blurb: "Workplace English, the question bank, STAR stories and plans", tint: "rose", books: ["English-workplace", "Interview-bank"] },
];
export const trackOf = (book: string): Track => TRACKS.find((t) => t.books.includes(book)) ?? { id: "more", title: "More", blurb: "", tint: "sky", books: [] };
export const bookIdOf = (docId: string) => docId.split(":")[0];

export const KIND_GROUP: Record<string, { label: string; order: number }> = {
  chapter: { label: "Chapters", order: 0 }, revision: { label: "Back matter", order: 1 }, traps: { label: "Back matter", order: 1 },
  glossary: { label: "Back matter", order: 1 }, snippets: { label: "Back matter", order: 1 },
};
