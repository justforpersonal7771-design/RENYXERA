// XSS payload tests for lib/security/sanitize-html.ts and lib/seo/json-ld.ts (R16-A3).
//   npm run check:sanitize
import { sanitizeHtml } from "../lib/security/sanitize-html.ts";
import { jsonLd } from "../lib/seo/json-ld.ts";

let failed = 0;
function eq(name: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : `  got ${JSON.stringify(got)} want ${JSON.stringify(want)}`}`);
}
const has = (s: string, re: RegExp) => re.test(s);
function ok(name: string, cond: boolean, got?: string) {
  if (!cond) failed++;
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${cond ? "" : `  got ${got}`}`);
}

// Harmless formatting survives, attributes do not
eq("keeps b/i/sub/sup", sanitizeHtml("x<sub>1</sub> + <b>y</b><sup>2</sup>"), "x<sub>1</sub> + <b>y</b><sup>2</sup>");
eq("drops attributes on allowed tags", sanitizeHtml('<b onclick="alert(1)" style="x:y">hi</b>'), "<b>hi</b>");
eq("br stays void", sanitizeHtml("a<br/>b<br>c"), "a<br>b<br>c");
eq("closes unclosed tags", sanitizeHtml("<b>bold <i>both"), "<b>bold <i>both</i></b>");
eq("ignores a stray closing tag", sanitizeHtml("text</b> more"), "text more");
eq("escapes text angle brackets", sanitizeHtml("a < b and c > d"), "a &lt; b and c &gt; d");
eq("keeps existing entities", sanitizeHtml("&amp; &lt; &#65;"), "&amp; &lt; &#65;");
eq("escapes a bare ampersand", sanitizeHtml("Q&A"), "Q&amp;A");

// Classic payloads: no executable markup may survive
const payloads = [
  "<script>alert(1)</script>", "<img src=x onerror=alert(1)>", "<svg onload=alert(1)>", "<iframe src=javascript:alert(1)></iframe>",
  "<a href=\"javascript:alert(1)\">x</a>", "<body onload=alert(1)>", "<style>@import 'x'</style>", "<math><mi xlink:href=\"javascript:alert(1)\">",
  "<b><script>alert(1)</script></b>", "<scr<script>ipt>alert(1)</scr</script>ipt>", "<form action=//evil><input name=x></form>", "<object data=x></object>",
  "<!--<script>-->alert(1)<!---->", "<IMG SRC=JaVaScRiPt:alert(1)>", "<b onmouseover=alert(1)>x</b>", "<details open ontoggle=alert(1)>", "<link rel=stylesheet href=//evil>",
];
for (const p of payloads) {
  const out = sanitizeHtml(p);
  ok(`payload neutralised: ${p.slice(0, 40)}`, !has(out, /<\s*(script|img|svg|iframe|a|body|style|math|form|input|object|link|details)\b/i) && !has(out, /\son\w+\s*=/i) && !has(out, /javascript:/i), out);
}
// Output contains only allow-listed tags and no attributes at all
const tagsOnly = sanitizeHtml('<p class="a" id="b">x<span style="color:red">y</span><b>z</b></p>');
ok("no attributes in output", !has(tagsOnly, /<[a-z]+\s+[^>]*=/i), tagsOnly);

// JSON-LD cannot close its script tag
const bad = jsonLd({ name: "x</script><script>alert(1)</script>", n: 1 });
ok("json-ld has no raw <", !bad.includes("<"), bad);
eq("json-ld round-trips", JSON.parse(bad), { name: "x</script><script>alert(1)</script>", n: 1 });

if (failed) { console.log(`\n${failed} check(s) FAILED`); process.exit(1); }
console.log("\nAll sanitiser checks passed");
