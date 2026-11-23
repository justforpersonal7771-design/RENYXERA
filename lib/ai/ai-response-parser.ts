import { RenderNode, TableNode } from "@/types/ast.types";
import { FsmTokenizer } from "@/lib/repository/transformers/fsm-tokenizer";
import { splitTableSegments } from "@/lib/repository/transformers/table-extractor";

export class AIResponseParser {
  /**
   * Parse raw text/markdown from Gemini into an array of RenderNodes.
   * Leverages the existing FsmTokenizer; tables are split out before tokenizing since a
   * table row containing inline LaTeX would otherwise get fragmented across separate
   * text/math tokens before any table detection could run.
   */
  public static parse(text: string): RenderNode[] {
    if (!text) return [];

    // A model sometimes double-escapes line breaks, so the text arrives with a literal backslash and n. Turn those into real line breaks,
    // but never touch LaTeX commands that start with n (\neq, \ne, \nu, \nabla, \not, \notin, \nexists, \nless, \ngtr, \nleq, \ngeq, \nmid, \ni).
    text = text.replace(/\\n(?!eq|e\b|u\b|abla|ot|exists|i\b|less|gtr|leq|geq|mid|parallel|subset|supset|rightarrow|leftarrow|to\b|ewline)/g, "\n");

    // Normalize LaTeX delimiters (e.g. converting "\ [" to "\[")
    let cleaned = text;
    cleaned = cleaned.replace(/\\\s*\[/g, '\\[');
    cleaned = cleaned.replace(/\\\s*\]/g, '\\]');
    cleaned = cleaned.replace(/\\\s*\(/g, '\\(');
    cleaned = cleaned.replace(/\\\s*\)/g, '\\)');

    const parsedNodes: RenderNode[] = [];
    const segments = splitTableSegments(cleaned);

    for (const segment of segments) {
      if (segment.type === "table") {
        parsedNodes.push({ type: "table", rows: segment.rows } as TableNode);
        continue;
      }
      const tokens = FsmTokenizer.tokenize(segment.content);
      parsedNodes.push(...tokens);
    }

    return parsedNodes;
  }
}
