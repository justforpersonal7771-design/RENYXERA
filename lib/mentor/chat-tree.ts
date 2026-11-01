/**
 * Mentor chats as trees (the way ChatGPT keeps them): every message knows its parent, so editing an earlier message or asking
 * for another answer adds a *sibling* instead of overwriting. The conversation on screen is one path from the root to `leafId`;
 * the "2 / 3" pager on a message switches between its siblings. Pure functions only (no storage, no React) so they can be tested.
 */
export interface TreeMsg {
  id: string; role: "user" | "model"; text: string; parentId: string | null; at: string;
  cards?: unknown[]; followUps?: string[]; warn?: string[]; flagged?: boolean; liked?: boolean;
}
export interface Chat {
  id: string; title: string; createdAt: string; updatedAt: string;
  nodes: Record<string, TreeMsg>;
  /** The last message of the path currently shown. */
  leafId: string | null;
  /** For a message with several children, which child the shown path follows. */
  pick: Record<string, string>;
  /** User-set title: stops the automatic title from the first message. */
  titled?: boolean;
}
export interface ChatMeta { id: string; title: string; createdAt: string; updatedAt: string; pinned?: boolean }

const ROOT = "__root__";
export const newId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

export function emptyChat(now: string, id = newId()): Chat {
  return { id, title: "New chat", createdAt: now, updatedAt: now, nodes: {}, leafId: null, pick: {} };
}

/** Children of a node (or of the root when parentId is null), oldest first. */
export function childrenOf(chat: Chat, parentId: string | null): TreeMsg[] {
  return Object.values(chat.nodes).filter((n) => n.parentId === parentId).sort((a, b) => a.at.localeCompare(b.at) || a.id.localeCompare(b.id));
}

/** The messages on screen: from the first message down to the leaf. */
export function activePath(chat: Chat): TreeMsg[] {
  const out: TreeMsg[] = [];
  let id = chat.leafId;
  const seen = new Set<string>();
  while (id && chat.nodes[id] && !seen.has(id)) { seen.add(id); out.push(chat.nodes[id]); id = chat.nodes[id].parentId; }
  return out.reverse();
}

/** Follow the picked (or latest) child downwards from a node to find the leaf of the branch. */
export function deepestLeaf(chat: Chat, fromId: string): string {
  let id = fromId;
  for (let i = 0; i < 1000; i++) {
    const kids = childrenOf(chat, id);
    if (!kids.length) return id;
    const picked = chat.pick[id] ? kids.find((k) => k.id === chat.pick[id]) : undefined;
    id = (picked ?? kids[kids.length - 1]).id;
  }
  return id;
}

export function autoTitle(text: string): string {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= 44 ? t || "New chat" : t.slice(0, 43).trimEnd() + "…";
}

/** Add a message under `parentId`, make it the picked child, and move the leaf to it. */
export function addNode(chat: Chat, msg: Omit<TreeMsg, "at">, now: string): Chat {
  const node: TreeMsg = { ...msg, at: now };
  const first = Object.keys(chat.nodes).length === 0;
  const title = !chat.titled && first && msg.role === "user" ? autoTitle(msg.text) : chat.title;
  return { ...chat, title, updatedAt: now, nodes: { ...chat.nodes, [node.id]: node }, leafId: node.id, pick: { ...chat.pick, [msg.parentId ?? ROOT]: node.id } };
}

/** Siblings of a message (itself included) and its place among them. */
export function siblingInfo(chat: Chat, id: string): { index: number; count: number; ids: string[] } {
  const n = chat.nodes[id];
  if (!n) return { index: 0, count: 1, ids: [id] };
  const sibs = childrenOf(chat, n.parentId);
  return { index: Math.max(0, sibs.findIndex((s) => s.id === id)), count: sibs.length, ids: sibs.map((s) => s.id) };
}

/** Show the previous (-1) or next (+1) version of a message, continuing down that branch. */
export function switchSibling(chat: Chat, id: string, dir: -1 | 1, now: string): Chat {
  const { index, ids } = siblingInfo(chat, id);
  const target = ids[index + dir];
  if (!target) return chat;
  const n = chat.nodes[target];
  return { ...chat, updatedAt: now, leafId: deepestLeaf(chat, target), pick: { ...chat.pick, [n.parentId ?? ROOT]: target } };
}

/** Remove a branch: the message and everything under it. The leaf moves to the last remaining sibling or the parent. */
export function removeBranch(chat: Chat, id: string, now: string): Chat {
  const n = chat.nodes[id];
  if (!n) return chat;
  const gone = new Set<string>([id]);
  let grew = true;
  while (grew) { grew = false; for (const m of Object.values(chat.nodes)) if (m.parentId && gone.has(m.parentId) && !gone.has(m.id)) { gone.add(m.id); grew = true; } }
  const nodes = Object.fromEntries(Object.entries(chat.nodes).filter(([k]) => !gone.has(k)));
  const next: Chat = { ...chat, nodes, updatedAt: now, pick: Object.fromEntries(Object.entries(chat.pick).filter(([k, v]) => !gone.has(k) && !gone.has(v))) };
  const sibs = childrenOf(next, n.parentId);
  const leaf = sibs.length ? deepestLeaf(next, sibs[sibs.length - 1].id) : n.parentId;
  return { ...next, leafId: leaf };
}

export const metaOf = (c: Chat, pinned?: boolean): ChatMeta => ({ id: c.id, title: c.title, createdAt: c.createdAt, updatedAt: c.updatedAt, pinned });

/** Build a one-branch chat from an old flat message list (the previous single-thread format). */
export function chatFromFlat(msgs: { id?: string; role: "user" | "model"; text: string }[], now: string): Chat {
  let chat = emptyChat(now);
  let parent: string | null = null;
  msgs.forEach((m, i) => {
    const id = m.id ?? newId();
    chat = addNode(chat, { ...(m as object), id, role: m.role, text: m.text, parentId: parent } as Omit<TreeMsg, "at">, new Date(Date.parse(now) + i).toISOString());
    parent = id;
  });
  const firstUser = msgs.find((m) => m.role === "user");
  chat.title = firstUser ? autoTitle(firstUser.text) : "Earlier conversation";
  return chat;
}
