/**
 * Allow-list HTML sanitiser for the `html` nodes of the question AST (R16-A3). No dependency, works on the server and in the browser.
 * Anything not on the list is dropped: unknown tags (script, style, iframe, img, svg, a, form, ...) disappear, EVERY attribute is removed
 * (so no on* handlers, no javascript: URLs, no style), and stray < > in text are escaped. The shipped bank has no `html` nodes today;
 * this keeps it that way if one ever appears (an import, an AI-parsed question, an edit).
 */
const ALLOWED = new Set(["b", "i", "u", "em", "strong", "sub", "sup", "br", "p", "span", "code", "pre", "ul", "ol", "li", "small", "mark"]);
const VOID = new Set(["br"]);
const TOKEN = /<\/?([a-zA-Z][a-zA-Z0-9]*)(?:\s[^<>]*)?\/?>|<!--[\s\S]*?-->|[^<]+|</g;

const escapeText = (t: string) => t.replace(/&(?!#?[a-zA-Z0-9]+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function sanitizeHtml(input: string): string {
  let out = "";
  const open: string[] = [];
  for (const m of input.matchAll(TOKEN)) {
    const tok = m[0];
    if (tok.startsWith("<!--")) continue;
    if (tok === "<") { out += "&lt;"; continue; }
    if (tok[0] !== "<") { out += escapeText(tok); continue; }
    const name = m[1]?.toLowerCase();
    if (!name || !ALLOWED.has(name)) continue; // unknown tag: dropped, its text content stays as plain text
    if (tok.startsWith("</")) {
      const i = open.lastIndexOf(name);
      if (i >= 0) { while (open.length > i) out += `</${open.pop()}>`; }
    } else if (VOID.has(name)) out += `<${name}>`;
    else { open.push(name); out += `<${name}>`; }
  }
  while (open.length) out += `</${open.pop()}>`;
  return out;
}
