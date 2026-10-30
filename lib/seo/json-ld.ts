/**
 * Serialise a JSON-LD object for a <script type="application/ld+json"> tag (R16-A3). JSON.stringify alone does not escape "<", so a value
 * containing "</script><script>..." would break out of the tag. Escaping "<" (and the two line-separator characters) keeps it inert
 * while the JSON stays identical for crawlers.
 */
const LINE_SEP = new RegExp(String.fromCharCode(0x2028), "g");
const PARA_SEP = new RegExp(String.fromCharCode(0x2029), "g");

export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c").replace(LINE_SEP, "\\u2028").replace(PARA_SEP, "\\u2029");
}
