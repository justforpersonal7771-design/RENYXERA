// Publishes due posts from content/calendar.json (status "approved", date+time IST has passed)
// to Instagram (Reels / single image, official Instagram API with Instagram Login) and the
// Telegram channel, then marks them "posted" with the returned ids. Run by
// .github/workflows/social-publish.yml every 30 minutes; safe to run by hand.
//
// Env: IG_USER_ID, IG_ACCESS_TOKEN (long-lived, refresh with --refresh), TELEGRAM_BOT_TOKEN, TELEGRAM_CHANNEL.
// Flags: --dry (show what would post), --refresh (print a refreshed IG token; store it as the secret).
import { readFileSync, writeFileSync } from "node:fs";

const G = "https://graph.instagram.com/v23.0";
const FILE = "content/calendar.json";
const dry = process.argv.includes("--dry");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function ig(path, params = {}, method = "POST") {
  const url = new URL(`${G}/${path}`);
  const body = new URLSearchParams({ ...params, access_token: process.env.IG_ACCESS_TOKEN });
  const res = method === "GET" ? await fetch(`${url}?${body}`) : await fetch(url, { method, body });
  const j = await res.json();
  if (!res.ok || j.error) throw new Error(`Instagram ${path}: ${j.error?.message ?? res.status}`);
  return j;
}

if (process.argv.includes("--refresh")) {
  const r = await fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${process.env.IG_ACCESS_TOKEN}`);
  const j = await r.json();
  console.log(j.access_token ? `New token (valid ${Math.round(j.expires_in / 86400)} days):\n${j.access_token}` : j);
  process.exit(0);
}

async function postInstagram(p) {
  const user = process.env.IG_USER_ID;
  const caption = [p.caption, (p.hashtags ?? []).join(" ")].filter(Boolean).join("\n\n");
  const isVideo = /\.mp4($|\?)/i.test(p.media_url);
  const c = await ig(`${user}/media`, isVideo
    ? { media_type: "REELS", video_url: p.media_url, caption, share_to_feed: "true", ...(p.cover_url ? { cover_url: p.cover_url } : {}) }
    : { image_url: p.media_url, caption });
  // Video containers are processed asynchronously: wait until FINISHED (up to ~5 min).
  for (let i = 0; isVideo && i < 30; i++) {
    const s = await ig(c.id, { fields: "status_code,status" }, "GET");
    if (s.status_code === "FINISHED") break;
    if (s.status_code === "ERROR" || s.status_code === "EXPIRED") throw new Error(`Instagram processing ${s.status_code}: ${s.status ?? ""}`);
    await sleep(10_000);
  }
  const pub = await ig(`${user}/media_publish`, { creation_id: c.id });
  return pub.id;
}

async function postTelegram(p) {
  const tok = process.env.TELEGRAM_BOT_TOKEN, chat = process.env.TELEGRAM_CHANNEL;
  const text = [p.caption, p.link].filter(Boolean).join("\n\n");
  const isVideo = /\.mp4($|\?)/i.test(p.media_url ?? "");
  const method = !p.media_url ? "sendMessage" : isVideo ? "sendVideo" : "sendPhoto";
  const body = { chat_id: chat, ...(p.media_url ? { [isVideo ? "video" : "photo"]: p.media_url, caption: text } : { text }) };
  const r = await fetch(`https://api.telegram.org/bot${tok}/${method}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const j = await r.json();
  if (!j.ok) throw new Error(`Telegram: ${j.description}`);
  return String(j.result.message_id);
}

const posts = JSON.parse(readFileSync(FILE, "utf8"));
const nowIst = new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM" in IST
let changed = false;
for (const p of posts) {
  if (p.status !== "approved" || `${p.date}T${p.time}` > nowIst) continue;
  p.posted = p.posted ?? {};
  for (const ch of p.channels ?? []) {
    if (p.posted[ch]) continue;
    if (dry) { console.log(`[dry] would post ${p.id} to ${ch}`); continue; }
    try {
      p.posted[ch] = ch === "instagram" ? await postInstagram(p) : ch === "telegram" ? await postTelegram(p) : null;
      console.log(`posted ${p.id} to ${ch}: ${p.posted[ch]}`);
    } catch (e) {
      p.error = `${ch}: ${e.message}`;
      console.error(`FAILED ${p.id} on ${ch}: ${e.message}`);
    }
    changed = true;
  }
  if ((p.channels ?? []).every((ch) => p.posted[ch])) { p.status = "posted"; delete p.error; }
}
if (changed) writeFileSync(FILE, JSON.stringify(posts, null, 2) + "\n");
