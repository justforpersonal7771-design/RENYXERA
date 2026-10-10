import "server-only";

type Json = Record<string, unknown>;
export type Button = { text: string; callback_data?: string; url?: string };

const token = () => process.env.TELEGRAM_BOT_TOKEN || "";
export const botConfigured = () => !!token();

/** Raw Bot API call. Never throws; returns { ok, result, error, code }. */
export async function tg<T = unknown>(method: string, body: Json = {}): Promise<{ ok: boolean; result?: T; error?: string; code?: number }> {
  if (!token()) return { ok: false, error: "Bot token not configured" };
  try {
    const r = await fetch(`https://api.telegram.org/bot${token()}/${method}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = (await r.json()) as { ok: boolean; result?: T; description?: string; error_code?: number };
    return j.ok ? { ok: true, result: j.result } : { ok: false, error: j.description, code: j.error_code };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
export const html = esc;

/** Send an HTML message, optionally with an inline keyboard. Returns "blocked" if the user blocked the bot. */
export async function send(chatId: number, text: string, buttons?: Button[][]): Promise<"ok" | "blocked" | "error"> {
  const r = await tg("sendMessage", { chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true, ...(buttons ? { reply_markup: { inline_keyboard: buttons } } : {}) });
  if (r.ok) return "ok";
  return r.code === 403 ? "blocked" : "error";
}

/** Ask the user to share their own phone number: Telegram shows a one-tap "Share my number" button. */
export async function askForContact(chatId: number, text: string) {
  return tg("sendMessage", { chat_id: chatId, text, parse_mode: "HTML", reply_markup: { keyboard: [[{ text: "📱 Share my number", request_contact: true }]], resize_keyboard: true, one_time_keyboard: true } });
}
export const removeKeyboard = (chatId: number, text: string) => tg("sendMessage", { chat_id: chatId, text, parse_mode: "HTML", reply_markup: { remove_keyboard: true } });

export const answerCallback = (id: string, text?: string) => tg("answerCallbackQuery", { callback_query_id: id, ...(text ? { text } : {}) });
export const clearButtons = (chatId: number, messageId: number) => tg("editMessageReplyMarkup", { chat_id: chatId, message_id: messageId, reply_markup: { inline_keyboard: [] } });

let botName: string | null = null;
/** The bot's @username (from env, else asked from Telegram once). */
export async function botUsername(): Promise<string | null> {
  if (process.env.TELEGRAM_BOT_USERNAME) return process.env.TELEGRAM_BOT_USERNAME.replace(/^@/, "");
  if (botName) return botName;
  const r = await tg<{ username?: string }>("getMe");
  botName = r.result?.username ?? null;
  return botName;
}

/** Is this Telegram user a member of the chat? null when it can't be verified (bot not admin / chat not found). */
export async function isMember(chat: string, userId: number): Promise<boolean | null> {
  const r = await tg<{ status: string }>("getChatMember", { chat_id: chat, user_id: userId });
  if (!r.ok || !r.result) return null;
  return ["creator", "administrator", "member", "restricted"].includes(r.result.status);
}
