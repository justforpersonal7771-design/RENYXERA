// Edge-case tests for lib/grading.ts (the single source of truth for correctness + marks).
//   npm run check:grading
import { parseNatRanges, parseNatValue, isNatCorrect, isOptionsCorrect, isResponseCorrect, marksFor, formatNatAnswer } from "../lib/grading.ts";

let failed = 0;
function eq(name: string, got: unknown, want: unknown) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok ? "" : `  got ${JSON.stringify(got)} want ${JSON.stringify(want)}`}`);
}

// NAT key parsing
eq("range", parseNatRanges("3 to 3"), [{ min: 3, max: 3 }]);
eq("decimal range", parseNatRanges("3.7 to 3.8"), [{ min: 3.7, max: 3.8 }]);
eq("OR ranges", parseNatRanges("819 to 820 OR 1 to 1"), [{ min: 819, max: 820 }, { min: 1, max: 1 }]);
eq("lowercase or", parseNatRanges("1 to 2 or 5 to 6").length, 2);
eq("negative range", parseNatRanges("-2.5 to -1.5"), [{ min: -2.5, max: -1.5 }]);
eq("reversed range normalised", parseNatRanges("5 to 3"), [{ min: 3, max: 5 }]);
eq("single number", parseNatRanges("42"), [{ min: 42, max: 42 }]);
eq("garbage", parseNatRanges("abc"), []);
eq("null", parseNatRanges(null), []);

// NAT typed values
eq("zero is an answer", parseNatValue("0"), 0);
eq("trailing dot", parseNatValue("3."), 3);
eq("leading dot", parseNatValue(".5"), 0.5);
eq("spaces trimmed", parseNatValue("  7 "), 7);
eq("empty rejected", parseNatValue(""), null);
eq("exponent rejected", parseNatValue("1e3"), null);
eq("text rejected", parseNatValue("12abc"), null);
eq("NaN number rejected", parseNatValue(NaN), null);

// NAT grading
const r = parseNatRanges("3.7 to 3.8 OR 0.37 to 0.38");
eq("in first range", isNatCorrect("3.75", r), true);
eq("in second range", isNatCorrect("0.375", r), true);
eq("between ranges", isNatCorrect("1", r), false);
eq("inclusive edge", isNatCorrect("3.8", r), true);
eq("float noise at edge", isNatCorrect(0.1 + 0.2, [{ min: 0.3, max: 0.3 }]), true);
eq("zero correct", isNatCorrect("0", [{ min: 0, max: 0 }]), true);
eq("empty never correct", isNatCorrect("", [{ min: 0, max: 0 }]), false);
eq("no key never correct", isNatCorrect("3", []), false);

// Options
eq("MCQ right", isOptionsCorrect("MCQ", ["B"], ["B"]), true);
eq("MCQ wrong", isOptionsCorrect("MCQ", ["A"], ["B"]), false);
eq("MCQ two accepted, pick C", isOptionsCorrect("MCQ", ["C"], ["C", "D"]), true);
eq("MCQ two accepted, pick D", isOptionsCorrect("MCQ", ["D"], ["C", "D"]), true);
eq("MCQ marks-to-all, any pick", isOptionsCorrect("MCQ", ["A"], ["A", "B", "C", "D"]), true);
eq("MCQ two picks invalid", isOptionsCorrect("MCQ", ["C", "D"], ["C", "D"]), false);
eq("MCQ nothing picked", isOptionsCorrect("MCQ", [], ["B"]), false);
eq("MSQ exact", isOptionsCorrect("MSQ", ["D", "A"], ["A", "D"]), true);
eq("MSQ partial = wrong", isOptionsCorrect("MSQ", ["A"], ["A", "D"]), false);
eq("MSQ extra = wrong", isOptionsCorrect("MSQ", ["A", "B", "D"], ["A", "D"]), false);
eq("MSQ duplicate picks", isOptionsCorrect("MSQ", ["A", "A", "D"], ["A", "D"]), true);
eq("no key never correct", isOptionsCorrect("MSQ", ["A"], []), false);
const frozen = Object.freeze(["B", "A"]);
eq("frozen selection not mutated", (isOptionsCorrect("MSQ", frozen, ["A", "B"]), frozen.join()), "B,A");

// Whole question
eq("question MCQ", isResponseCorrect({ question_type: "MCQ", options: [{ option_id: "A" }, { option_id: "B", is_correct: true }] }, ["B"], undefined), true);
eq("question NAT with alternatives", isResponseCorrect({ question_type: "NAT", nat_answer_range: { min: 3.7, max: 3.8, ranges: r } }, undefined, "0.37"), true);
eq("question NAT legacy shape", isResponseCorrect({ question_type: "NAT", nat_answer_range: { min: 2, max: 2 } }, undefined, "2"), true);
eq("format alternatives", formatNatAnswer({ min: 3.7, max: 3.8, ranges: r }), "3.7 to 3.8 or 0.37 to 0.38");
eq("format exact", formatNatAnswer({ min: 2, max: 2 }), "2");
eq("format missing", formatNatAnswer(undefined), "N/A");

// GATE marks
eq("MCQ 1-mark wrong", marksFor("MCQ", 1, true, false), -1 / 3);
eq("MCQ 2-mark wrong", marksFor("MCQ", 2, true, false), -2 / 3);
eq("MSQ wrong no negative", marksFor("MSQ", 2, true, false), 0);
eq("NAT wrong no negative", marksFor("NAT", 2, true, false), 0);
eq("unattempted zero", marksFor("MCQ", 2, false, false), 0);
eq("correct full", marksFor("MSQ", 2, true, true), 2);

console.log(failed ? `\n${failed} FAILED` : "\nAll grading edge cases pass");
process.exitCode = failed ? 1 : 0;
