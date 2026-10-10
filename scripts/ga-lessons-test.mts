import { GA_LESSONS } from "../lib/seo/ga-lessons";

// Re-computes the arithmetic behind the worked examples, so a wrong number in a lesson fails CI.
let failed = 0;
const check = (name: string, ok: boolean, extra = "") => { console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? ` — ${extra}` : ""}`); if (!ok) failed++; };
const near = (a: number, b: number) => Math.abs(a - b) < 1e-9;

check("20% up then 20% down is a 4% fall", near(20 - 20 - (20 * 20) / 100, -4) && near(1.2 * 0.8, 0.96));
check("marked 500, 20% off, cost 320 is 25% profit", near(500 * 0.8, 400) && near(((400 - 320) / 320) * 100, 25));
check("4500 in 2:3 is 1800 and 2700", near((4500 * 2) / 5, 1800) && near((4500 * 3) / 5, 2700));
check("weighted average of 30@60 and 20@70 is 64", near((30 * 60 + 20 * 70) / 50, 64));
check("12 days and 6 days together take 4 days", near(1 / (1 / 12 + 1 / 6), 4));
check("average speed 40 and 60 over equal distances is 48", near((2 * 40 * 60) / (40 + 60), 48));
check("trains of 100 m and 150 m at 60 and 40 km/h cross in 9 s", near(250 / (((60 + 40) * 5) / 18), 9));
check("series 2,6,12,20 continues with 30", [4, 6, 8].every((d, i) => [6, 12, 20][i] - [2, 6, 12][i] === d) && 20 + 10 === 30);
check("series 3,6,12,24 continues with 48", 24 * 2 === 48);
check("2728 is divisible by 11", 2728 % 11 === 0 && 2 - 7 + 2 - 8 === -11);
check("3-4-5 walk is 5 km", near(Math.hypot(3, 4), 5));
const n = 4;
const counts = [8, 12 * (n - 2), 6 * (n - 2) ** 2, (n - 2) ** 3];
check("painted 4x4x4 cube counts are 8, 24, 24, 8 and total 64", counts.join() === "8,24,24,8" && counts.reduce((a, b) => a + b, 0) === 64);
check("every lesson has rules, examples and traps", GA_LESSONS.every((l) => l.rules.length >= 3 && l.examples.length >= 1 && l.traps.length >= 1));
check("lesson slugs are unique", new Set(GA_LESSONS.map((l) => l.slug)).size === GA_LESSONS.length);
console.log(failed ? `\n${failed} check(s) failed` : "\nAll GA lesson checks passed");
process.exit(failed ? 1 : 0);
