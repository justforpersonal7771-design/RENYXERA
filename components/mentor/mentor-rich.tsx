"use client";

import { useMemo } from "react";
import { AstNodeRenderer } from "@/components/exam/ast-node-renderer";
import { AIResponseParser } from "@/lib/ai/ai-response-parser";
import { clean } from "@/components/mentor/use-mentor-chat";

// Anything that needs real formatting: math, code (fenced or inline), a table, bold, a heading, a list.
export const RICH = /\\\(|\\\[|```|\$\$|\*\*|`[^`\n]+`|^\s*#{1,4}\s|^\s*[-*]\s|^\s*\d+\.\s|^\s*\|.*\|\s*$/m;

/** A Mentor answer drawn at once: equations typeset, code in blocks, tables, bold and lists. Plain answers stay plain text. */
export function MentorRich({ text, className = "" }: { text: string; className?: string }) {
  const rich = RICH.test(text);
  const nodes = useMemo(() => (rich ? AIResponseParser.parse(text) : []), [rich, text]);
  if (!rich) return <p className={`whitespace-pre-wrap leading-relaxed ${className}`}>{clean(text)}</p>;
  return <div className={`mentor-rich leading-relaxed [&_.ast-content]:block [&_.ast-content]:items-start ${className}`}><AstNodeRenderer nodes={nodes} chat /></div>;
}
