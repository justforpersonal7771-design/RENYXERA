"use client";

/**
 * The book renderer: real Markdown (tables, quotes as callouts, task lists), code blocks you can copy / run in the lab / ask the tutor about,
 * and Mermaid flowcharts drawn as a tidy layered diagram. Headings get ids so the outline can jump to them.
 */
import { Children, isValidElement, memo, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Play, Sparkles } from "lucide-react";
import { ClassDiagram, SequenceDiagram } from "./iv-diagrams";

export const slug = (s: string) => s.toLowerCase().replace(/[`*_]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const textOf = (n: ReactNode): string => Children.toArray(n).map((c) => (typeof c === "string" || typeof c === "number" ? String(c) : isValidElement(c) ? textOf((c.props as { children?: ReactNode }).children) : "")).join("");

export type TocItem = { id: string; text: string; level: 2 | 3 };
export function extractToc(body: string): TocItem[] {
  const out: TocItem[] = []; let fence = false;
  for (const line of body.split("\n")) {
    if (/^```/.test(line)) { fence = !fence; continue; }
    if (fence) continue;
    const m = line.match(/^(#{2,3})\s+(.+?)\s*$/);
    if (m) out.push({ id: slug(m[2]), text: m[2].replace(/[`*_]/g, ""), level: m[1].length as 2 | 3 });
  }
  return out;
}

/** Mermaid flowchart -> layers of boxes. Anything that is not a simple flowchart is shown as its source. */
function parseFlow(code: string) {
  if (!/^\s*(flowchart|graph)\b/.test(code)) return null;
  const label = new Map<string, string>(); const edges: [string, string, string][] = []; const order: string[] = [];
  const node = (raw: string) => { const m = raw.trim().match(/^([A-Za-z0-9_]+)\s*(?:\[\[?"?(.*?)"?\]?\]|\(\(?"?(.*?)"?\)?\)|\{"?(.*?)"?\})?$/); if (!m) return null; const id = m[1]; const l = m[2] ?? m[3] ?? m[4]; if (l) label.set(id, l); if (!order.includes(id)) order.push(id); return id; };
  for (const line of code.split("\n").slice(1)) {
    const parts = line.split(/\s*(?:-->|---|==>|-\.->)\s*(?:\|([^|]*)\|\s*)?/);
    if (parts.length < 2) { node(line.replace(/;$/, "")); continue; }
    for (let i = 0; i + 2 < parts.length + 1; i += 2) {
      const a = node((parts[i] ?? "").replace(/;$/, "")), b = node((parts[i + 2] ?? "").replace(/;$/, ""));
      if (a && b) edges.push([a, b, parts[i + 1] ?? ""]);
    }
  }
  if (!order.length) return null;
  const depth = new Map<string, number>(order.map((o) => [o, 0]));
  for (let pass = 0; pass < order.length; pass++) for (const [a, b] of edges) if ((depth.get(b) ?? 0) <= (depth.get(a) ?? 0) && depth.get(a)! < order.length) depth.set(b, depth.get(a)! + 1);
  const layers: string[][] = []; for (const o of order) (layers[depth.get(o)!] ??= []).push(o);
  return { layers: layers.filter(Boolean), label, edges };
}
function Flow({ code }: { code: string }) {
  const f = parseFlow(code);
  if (!f) return <pre className="iv-pre"><code>{code}</code></pre>;
  return (
    <figure className="iv-flow" aria-label="Diagram">
      {f.layers.map((row, i) => (
        <div key={i} className="iv-flow__layer">
          {i > 0 && <span className="iv-flow__arrow" aria-hidden>↓</span>}
          <div className="iv-flow__row">{row.map((id) => <span key={id} className="iv-flow__node">{f.label.get(id) ?? id}</span>)}</div>
        </div>
      ))}
    </figure>
  );
}

const LANG_LABEL: Record<string, string> = { csharp: "C#", cs: "C#", cpp: "C++", "c++": "C++", python: "Python", py: "Python", javascript: "JavaScript", js: "JavaScript", typescript: "TypeScript", ts: "TypeScript", tsx: "TSX", sql: "SQL", bash: "Shell", yaml: "YAML", json: "JSON", text: "Text", result: "Output" };
const RUNNABLE: Record<string, string> = { csharp: "csharp", cs: "csharp", cpp: "cpp", "c++": "cpp", python: "python", py: "python", javascript: "javascript", js: "javascript", typescript: "typescript", ts: "typescript", sql: "sql" };

type Handlers = { onRun?: (lang: string, code: string) => void; onAsk?: (code: string) => void };
function makeComponents(h: Handlers): Components {
  const head = (Tag: "h1" | "h2" | "h3" | "h4") => function H({ children }: { children?: ReactNode }) { return <Tag id={slug(textOf(children))} className={`iv-${Tag}`}>{children}</Tag>; };
  return {
    h1: head("h1"), h2: head("h2"), h3: head("h3"), h4: head("h4"),
    blockquote: ({ children }) => <blockquote className="iv-callout">{children}</blockquote>,
    table: ({ children }) => <div className="iv-table"><table>{children}</table></div>,
    a: ({ href, children }) => <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer noopener" className="iv-link">{children}</a>,
    code: ({ children, className }) => <code className={className ?? "iv-code"}>{children}</code>,
    pre: ({ children }) => {
      const el = Children.toArray(children)[0];
      const cls = isValidElement(el) ? String((el.props as { className?: string }).className ?? "") : "";
      const lang = cls.replace("language-", "").trim().toLowerCase();
      const code = textOf(isValidElement(el) ? (el.props as { children?: ReactNode }).children : children).replace(/\n$/, "");
      if (lang === "mermaid") { const kind = code.trim().split(/\s/)[0]; return kind === "sequenceDiagram" ? <SequenceDiagram code={code.trim()} /> : kind === "classDiagram" ? <ClassDiagram code={code.trim()} /> : <Flow code={code} />; }
      const run = RUNNABLE[lang];
      return (
        <div className={`iv-codeblock ${lang === "result" ? "is-output" : ""}`}>
          <div className="iv-codeblock__bar">
            <span>{LANG_LABEL[lang] ?? (lang || "Code")}</span>
            <span className="iv-codeblock__acts">
              <button type="button" data-copy={code} aria-label="Copy code"><Copy className="h-3.5 w-3.5" />Copy</button>
              {run && h.onRun && <button type="button" onClick={() => h.onRun!(run, code)} aria-label="Run in the code lab"><Play className="h-3.5 w-3.5" />Run in lab</button>}
              {h.onAsk && lang !== "result" && <button type="button" onClick={() => h.onAsk!(code)} aria-label="Ask the tutor about this code"><Sparkles className="h-3.5 w-3.5" />Ask tutor</button>}
            </span>
          </div>
          <pre><code>{code}</code></pre>
        </div>
      );
    },
  };
}

/**
 * The books hide self-check answers in <details><summary>Answers</summary>...</details>. Markdown alone would print those tags as text,
 * so they are cut out first and drawn as real collapsible panels (their inside is Markdown too). Fenced code is never touched.
 */
type Part = { t: "md"; s: string } | { t: "det"; sum: string; s: string };
function splitDetails(body: string): Part[] {
  const fences: [number, number][] = [];
  for (const m of body.matchAll(/^```[\s\S]*?^```/gm)) fences.push([m.index!, m.index! + m[0].length]);
  const parts: Part[] = []; let last = 0;
  for (const m of body.matchAll(/<details[^>]*>\s*<summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g)) {
    const at = m.index!;
    if (fences.some(([a, b]) => at >= a && at < b)) continue;
    if (at > last) parts.push({ t: "md", s: body.slice(last, at) });
    parts.push({ t: "det", sum: m[1].replace(/<[^>]+>/g, "").trim() || "Show", s: m[2] });
    last = at + m[0].length;
  }
  if (last < body.length) parts.push({ t: "md", s: body.slice(last) });
  return parts;
}

export const IvMarkdown = memo(function IvMarkdown({ body, onRun, onAsk }: { body: string } & Handlers) {
  const comps = makeComponents({ onRun, onAsk });
  return (
    <div className="iv-md" onClick={(e) => { const b = (e.target as HTMLElement).closest("button[data-copy]") as HTMLElement | null; if (b) void navigator.clipboard?.writeText(b.dataset.copy ?? ""); }}>
      {splitDetails(body).map((p, i) => p.t === "md"
        ? <ReactMarkdown key={i} remarkPlugins={[remarkGfm]} components={comps}>{p.s}</ReactMarkdown>
        : <details key={i} className="iv-details"><summary>{p.sum}</summary><div><ReactMarkdown remarkPlugins={[remarkGfm]} components={comps}>{p.s}</ReactMarkdown></div></details>)}
    </div>
  );
});
