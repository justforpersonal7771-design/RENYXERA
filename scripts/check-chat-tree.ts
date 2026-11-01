// Unit checks for lib/mentor/chat-tree.ts (run: npx tsx scripts/check-chat-tree.mts)
import { addNode, activePath, emptyChat, siblingInfo, switchSibling, removeBranch, chatFromFlat, autoTitle, mergeChats } from "../lib/mentor/chat-tree.ts";

let fail = 0;
const ok = (n: string, c: boolean) => { if (!c) fail++; console.log(`${c ? "PASS" : "FAIL"}  ${n}`); };
let t = 0;
const now = () => new Date(Date.UTC(2026, 10, 1, 0, 0, t++)).toISOString();
const ids = (c: ReturnType<typeof emptyChat>) => activePath(c).map((x) => x.id).join();

let c = emptyChat(now(), "c1");
c = addNode(c, { id: "u1", role: "user", text: "What should I study today?", parentId: null }, now());
c = addNode(c, { id: "m1", role: "model", text: "Revise TOC.", parentId: "u1" }, now());
c = addNode(c, { id: "u2", role: "user", text: "And tomorrow?", parentId: "m1" }, now());
c = addNode(c, { id: "m2", role: "model", text: "Networks.", parentId: "u2" }, now());
ok("path is u1 m1 u2 m2", ids(c) === "u1,m1,u2,m2");
ok("auto title from first message", c.title === "What should I study today?");

c = addNode(c, { id: "u2b", role: "user", text: "And the day after?", parentId: "m1" }, now());
c = addNode(c, { id: "m2b", role: "model", text: "OS.", parentId: "u2b" }, now());
ok("edit shows the new branch", ids(c) === "u1,m1,u2b,m2b");
ok("sibling info is 2 of 2", siblingInfo(c, "u2b").index === 1 && siblingInfo(c, "u2b").count === 2);
c = switchSibling(c, "u2b", -1, now());
ok("switch back restores the old branch down to its leaf", ids(c) === "u1,m1,u2,m2");
c = switchSibling(c, "u2", 1, now());
ok("switch forward", ids(c) === "u1,m1,u2b,m2b");
ok("switch past the end changes nothing", switchSibling(c, "u2b", 1, now()) === c);

c = addNode(c, { id: "m2c", role: "model", text: "DBMS.", parentId: "u2b" }, now());
ok("regenerate adds a sibling answer", siblingInfo(c, "m2c").count === 2 && activePath(c).at(-1)!.id === "m2c");

c = removeBranch(c, "u2b", now());
ok("deleting a branch removes the subtree and returns to the other branch", !c.nodes["m2b"] && !c.nodes["m2c"] && ids(c) === "u1,m1,u2,m2");

c = addNode(c, { id: "u1b", role: "user", text: "Plan my week", parentId: null }, now());
ok("editing the first message makes a sibling at the root", siblingInfo(c, "u1b").count === 2 && activePath(c).length === 1);
c = switchSibling(c, "u1b", -1, now());
ok("root switch restores the old conversation", ids(c) === "u1,m1,u2,m2");

ok("title is cut at 44 characters", autoTitle("x".repeat(80)).length === 44);
const f = chatFromFlat([{ id: "a", role: "user", text: "hi" }, { id: "b", role: "model", text: "hello" }], now());
ok("flat history migrates to one path", activePath(f).length === 2 && f.title === "hi");

// two devices edit the same chat
let d1 = emptyChat(now(), "x1");
d1 = addNode(d1, { id: "a1", role: "user", text: "hello", parentId: null }, now());
d1 = addNode(d1, { id: "a2", role: "model", text: "hi", parentId: "a1" }, now());
let d2 = JSON.parse(JSON.stringify(d1));
d1 = addNode(d1, { id: "a3", role: "user", text: "phone question", parentId: "a2" }, now());
d2 = addNode(d2, { id: "b3", role: "user", text: "laptop question", parentId: "a2" }, now());
d2.title = "Renamed on laptop"; d2.titled = true;
const merged = mergeChats(d1, d2);
ok("merge keeps messages from both devices", !!merged.nodes["a3"] && !!merged.nodes["b3"]);
ok("merge shows both as versions of the same turn", siblingInfo(merged, "b3").count === 2);
ok("merge keeps the newer copy's rename", merged.title === "Renamed on laptop" && merged.titled === true);
ok("merge is the same in either order (messages)", Object.keys(mergeChats(d2, d1).nodes).sort().join() === Object.keys(merged.nodes).sort().join());

console.log(fail ? `\n${fail} failed` : "\nall passed");
process.exit(fail ? 1 : 0);
