// Points the Telegram bot at the site and registers its command menu. Run once after setting the secrets:
//   node --env-file=.env.local scripts/telegram-set-webhook.mjs
// Needs TELEGRAM_BOT_TOKEN and TELEGRAM_WEBHOOK_SECRET (any long random string, the same value as the Cloudflare secret).
const SITE = (process.env.SITE_URL || "https://gate.renyxera.workers.dev").replace(/\/$/, "");
const token = process.env.TELEGRAM_BOT_TOKEN;
const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
if (!token || !secret) { console.error("Set TELEGRAM_BOT_TOKEN and TELEGRAM_WEBHOOK_SECRET first."); process.exit(1); }

const call = async (method, body) => {
  const r = await fetch(`https://api.telegram.org/bot${token}/${method}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const j = await r.json();
  console.log(method, j.ok ? "ok" : `FAILED: ${j.description}`);
  return j;
};

await call("setWebhook", { url: `${SITE}/api/telegram/webhook`, secret_token: secret, allowed_updates: ["message", "callback_query", "my_chat_member"], drop_pending_updates: true });
await call("setMyCommands", {
  commands: [
    { command: "today", description: "Countdown and today's plan" },
    { command: "timer", description: "Set a timer, e.g. /timer 25" },
    { command: "alarm", description: "Daily alarm, e.g. /alarm 06:00 (Plus, Pro)" },
    { command: "alarms", description: "List timers and alarms" },
    { command: "cancel", description: "Cancel timers or alarms" },
    { command: "digest", description: "Morning digest time (Plus, Pro)" },
    { command: "verify", description: "Verify your mobile number" },
    { command: "status", description: "Link and channel status" },
    { command: "help", description: "What I can do" },
    { command: "unlink", description: "Disconnect this chat" },
  ],
});
const info = await (await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`)).json();
console.log("webhook:", info.result?.url, "pending:", info.result?.pending_update_count, info.result?.last_error_message ? `last error: ${info.result.last_error_message}` : "");
const me = await (await fetch(`https://api.telegram.org/bot${token}/getMe`)).json();
console.log("bot:", me.result ? `@${me.result.username}` : "unknown");
