// Checks for lib/billing/ai-credits.ts, the Mentor token meter (run: npm run check:credits)
import { estimateTokens, formatTokens, MAX_TOKENS, MIN_TOKENS } from "../lib/billing/ai-credits.ts";

let fail = 0;
const ok = (n: string, c: boolean, d = "") => { if (!c) fail++; console.log(`${c ? "PASS" : "FAIL"}  ${n}${d ? "  [" + d + "]" : ""}`); };

const short = estimateTokens({ mode: "Ask", messageChars: 120, historyChars: 1500, briefChars: 1500 });
ok("a short question uses about 1.5K tokens", short >= 1000 && short <= 2000, String(short));
const longChat = estimateTokens({ mode: "Ask", messageChars: 300, historyChars: 7200, briefChars: 3000 });
ok("the same kind of question deep in a long chat costs more (the conversation is read again)", longChat > short, `${short} -> ${longChat}`);
const plan = estimateTokens({ mode: "Plan", messageChars: 200, historyChars: 3000, briefChars: 3000 });
ok("a full-week plan costs more than a short question", plan > short, `${short} -> ${plan}`);
const worst = estimateTokens({ mode: "Review", messageChars: 2000, historyChars: 36000, briefChars: 6000 });
ok("the largest allowed request stays under the ceiling", worst <= MAX_TOKENS, String(worst));
ok("nothing is cheaper than the minimum", estimateTokens({ mode: "Socratic", messageChars: 1, historyChars: 0, briefChars: 0 }) >= MIN_TOKENS);
ok("bigger input never costs less", estimateTokens({ mode: "Ask", messageChars: 2000, historyChars: 7200, briefChars: 6000 }) >= short);
const photo = estimateTokens({ mode: "Ask", messageChars: 200, historyChars: 1500, briefChars: 1500, attachments: { images: 2 } });
ok("two photos cost about 3K tokens more than text alone", photo - short >= 2500, `${short} -> ${photo}`);
ok("tokens are shown in a short form", formatTokens(2400) === "2.4K" && formatTokens(150000) === "150K" && formatTokens(1200000) === "1.2M");

console.log(fail ? `\n${fail} failed` : "\nall passed");
process.exit(fail ? 1 : 0);
