"use client";

import { memo, useContext, useEffect, useRef } from "react";
import { RenderNode } from "@/types/ast.types";
import { MathJax, MathJaxBaseContext } from "better-react-mathjax";

import { CodeBlock } from "@/components/ui/code-block";
import { ImageThemeAdapter } from "./image-theme-adapter";

import { PremiumImageGallery } from "./premium-image-gallery";

interface AstNodeRendererProps {
  nodes: RenderNode[];
  className?: string; // Additional classes for the container
}

function formatMarkdownText(text: string): React.ReactNode {
  if (!text) return "";
  
  // Split by bold (**bold**)
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const boldText = part.slice(2, -2);
      return <strong key={idx} className="font-extrabold text-[var(--text-primary)]">{boldText}</strong>;
    }
    
    // Split by italic (*italic*)
    const italicParts = part.split(/(\*[^*]+\*)/g);
    return italicParts.map((subPart, subIdx) => {
      if (subPart.startsWith("*") && subPart.endsWith("*")) {
        return <em key={subIdx} className="italic text-[var(--text-secondary)]">{subPart.slice(1, -1)}</em>;
      }
      return subPart;
    });
  });
}

// A stable id per parsed node array, so the body remounts (fresh DOM) whenever the
// content changes — see the typesetting note in AstBody.
const nodeIds = new WeakMap<RenderNode[], number>();
let nextNodeId = 1;
function idFor(nodes: RenderNode[]): number {
  let id = nodeIds.get(nodes);
  if (!id) { id = nextNodeId++; nodeIds.set(nodes, id); }
  return id;
}

// Unwrapped TeX in text: "\(" or "\[" delimiters (what the dataset uses).
const RAW_MATH = /\\\(|\\\[/;

export const AstNodeRenderer = memo(function AstNodeRenderer({
  nodes,
  className = "",
}: AstNodeRendererProps) {
  if (!nodes || nodes.length === 0) return null;
  return <AstBody key={idFor(nodes)} nodes={nodes} className={className} />;
});

function AstBody({ nodes, className = "" }: AstNodeRendererProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mathJax = useContext(MathJaxBaseContext);

  // Some questions carry formulas inside plain text (e.g. "\( f_1 \in F \)") rather than
  // as latex nodes. <MathJax> components only typeset their own children, so that text
  // used to render only by luck — MathJax's one-time whole-page scan on first load. Now
  // that MathJax loads at app start (before any question is on screen), typeset this
  // body explicitly once MathJax is ready. The body is keyed by its content (above), so
  // React never has to patch DOM that MathJax has rewritten.
  const hasRawMath = nodes.some((n) => (n.type === "text" || n.type === "html") && RAW_MATH.test(n.content));
  useEffect(() => {
    if (!hasRawMath || !mathJax?.promise) return;
    let cancelled = false;
    mathJax.promise
      .then((MJ: any) => (MJ?.startup?.promise ?? Promise.resolve()).then(() => MJ))
      .then((MJ: any) => {
        if (cancelled || !ref.current || typeof MJ?.typesetPromise !== "function") return;
        return MJ.typesetPromise([ref.current]);
      })
      .catch(() => { /* leave the raw text readable rather than break the question */ });
    return () => { cancelled = true; };
  }, [hasRawMath, mathJax]);

  return (
    <div
      ref={ref}
      className={`ast-content ${className} items-center font-sans text-[var(--text-primary)]`}
    >
      {nodes.map((node, i) => {
        switch (node.type) {
          case "text":
            return (
              <span key={i} className="whitespace-pre-wrap">
                {formatMarkdownText(node.content)}
              </span>
            );
          case "latex-inline":
            return (
              <span key={i} className="inline-block px-1 pointer-events-none">
                <MathJax inline dynamic hideUntilTypeset="every">{`\\(${node.content}\\)`}</MathJax>
              </span>
            );
          case "latex-display":
            return (
              <div key={i} className="my-2 overflow-x-auto pointer-events-none">
                <MathJax dynamic hideUntilTypeset="every">{`\\[${node.content}\\]`}</MathJax>
              </div>
            );
          case "image":
            const urls = (node.resolvedUrls?.length ? node.resolvedUrls : [node.resolvedUrl]).filter(Boolean) as string[];
            return (
              <PremiumImageGallery
                key={i}
                urls={urls}
                altText={node.altText || "Question Content"}
              />
            );
          case "html":
            return (
              <span
                key={i}
                dangerouslySetInnerHTML={{ __html: node.content }}
                className="inline-block"
              />
            );
          case "table":
            return (
              <div key={i} className="overflow-x-auto my-2">
                <table className="table-auto border-collapse border border-[var(--border)]">
                  <tbody>
                    {node.rows.map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, c) => (
                          <td
                            key={c}
                            className="border border-[var(--border)] px-3 py-1"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "code":
            return (
              <CodeBlock
                key={i}
                language={node.language}
                content={node.content}
              />
            );
          case "reference":
            return (
              <span
                key={i}
                className="text-indigo-600 dark:text-indigo-400 font-semibold cursor-help"
                title={`Reference: ${node.targetId}`}
              >
                [{node.targetId}]
              </span>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
