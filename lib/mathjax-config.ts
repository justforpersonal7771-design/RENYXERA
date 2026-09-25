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
    inlineMath: [["\(", "\)"]],
    displayMath: [["\[", "\]"]],
  },
};
