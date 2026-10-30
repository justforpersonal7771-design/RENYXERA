/**
 * One MathJax config for the whole app. better-react-mathjax downloads MathJax once per
 * page load, using whichever MathJaxContext mounts FIRST; every other context reuses it.
 * ClientLayout mounts a context with this config at app start, so the ~1–2 s download
 * happens while the learner is still on the dashboard instead of the moment a question
 * with formulas first appears (which showed blank space until the library arrived).
 * It's the union of what the pages asked for: the core TeX/CHTML pipeline plus the
 * [tex]/html extension the exam and review screens use.
 */
export const MATHJAX_CONFIG = {
  loader: { load: ["input/tex", "output/chtml", "[tex]/html"] },
  tex: {
    packages: { "[+]": ["html"] },
    // R16-A3: formulas from AI answers or notes must not be able to carry links or styles. MathJax 4 has no "safe" extension, so these four
    // macros are redefined to show only their text argument (the URL / class / style / id is ignored). No shipped content uses them.
    macros: { href: ["{#2}", 2], class: ["{#2}", 2], style: ["{#2}", 2], cssId: ["{#2}", 2] },
    // "\\(" in source is the two characters \( — the delimiters the dataset uses.
    inlineMath: [["\\(", "\\)"]],
    displayMath: [["\\[", "\\]"]],
  },
};
