import { planById, seasonPlan, seasonYears, upcomingSeasonYear, seasonEndMs } from "../lib/billing/plans";

let failed = 0;
const check = (name: string, ok: boolean, extra = "") => { console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? ` — ${extra}` : ""}`); if (!ok) failed++; };

const oct10 = Date.UTC(2026, 9, 10, 12);
check("upcoming season year on 10 Oct 2026 is 2027", upcomingSeasonYear(oct10) === 2027);
check("after 31 Mar 2027 IST the next season is 2028", upcomingSeasonYear(seasonEndMs(2027) + 1000) === 2028);
check("five selectable years", seasonYears(oct10).join() === "2027,2028,2029,2030,2031");

const p27 = seasonPlan("plus", 2027, oct10)!, q27 = seasonPlan("pro", 2027, oct10)!;
check("Plus 2027 pass ends in 9 and is about ₹149", p27.pricePaise === 14900, String(p27.pricePaise! / 100));
check("Pro 2027 pass is about ₹499", q27.pricePaise === 49900, String(q27.pricePaise! / 100));
check("2027 pass runs to 31 Mar 2027", p27.periodDays >= 170 && p27.periodDays <= 175, String(p27.periodDays));

const p28 = seasonPlan("plus", 2028, oct10)!, p29 = seasonPlan("plus", 2029, oct10)!, p31 = seasonPlan("pro", 2031, oct10)!;
check("longer passes cost more", p28.pricePaise! > p27.pricePaise! && p29.pricePaise! > p28.pricePaise!, `${p27.pricePaise! / 100} < ${p28.pricePaise! / 100} < ${p29.pricePaise! / 100}`);
check("per-month cost falls with length", p29.pricePaise! / p29.periodDays < p27.pricePaise! / p27.periodDays);
check("a short pass never exceeds the yearly plan", seasonPlan("plus", 2027, Date.UTC(2026, 6, 1))!.pricePaise! <= 24900);
check("2031 Pro pass has period within the DB cap", p31.periodDays <= 2200, String(p31.periodDays));
check("all prices end in 9", [p27, q27, p28, p29, p31].every((p) => (p.pricePaise! / 100) % 10 === 9));

check("rejects a year in the past", seasonPlan("plus", 2026, oct10) === null);
check("rejects a year too far ahead", seasonPlan("plus", 2032, oct10) === null);
check("planById resolves a season id", planById("pro_season_2029", oct10)?.tier === "pro");
check("planById rejects junk ids", planById("plus_season_20x9", oct10) === null && planById("lifetime", oct10) === null);

console.log(failed ? `\n${failed} check(s) failed` : "\nAll season-pass checks passed");
process.exit(failed ? 1 : 0);
