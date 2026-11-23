import { IDBManager } from "@/lib/repository/storage/idb-manager";

export interface ConversationHistoryMessage {
  role: "user" | "model";
  text: string;
  timestamp: string;
  data?: any; // Stores conceptual overview cards if model
  mode?: string;
  personality?: string;
}

export class ConversationMemory {
  /**
   * Save a question session conversation history into IndexedDB memory.
   */
  public static async saveConversation(
    questionId: string,
    history: Omit<ConversationHistoryMessage, "timestamp">[]
  ): Promise<void> {
    try {
      const formattedHistory: ConversationHistoryMessage[] = history.map(h => ({
        ...h,
        timestamp: (h as any).timestamp || new Date().toISOString()
      }));
      await IDBManager.saveAIMemory(`chat_history_${questionId}`, formattedHistory);
    } catch (e) {
      console.error(`Failed to save conversation for question ${questionId}`, e);
    }
  }

  /**
   * Get a question session conversation history from IndexedDB.
   */
  public static async getConversation(questionId: string): Promise<ConversationHistoryMessage[]> {
    try {
      const history = await IDBManager.getAIMemory(`chat_history_${questionId}`);
      return Array.isArray(history) ? history : [];
    } catch {
      return [];
    }
  }

  /** Past Tutor chats, newest first: the question, the last thing said and when. Only chats with a student message count. */
  public static async listConversations(): Promise<{ questionId: string; updatedAt: string; messages: number; lastUser: string; lastText: string }[]> {
    const rows = await IDBManager.listAIMemory("chat_history_");
    return rows.flatMap((r) => {
      const h = Array.isArray(r.value) ? (r.value as ConversationHistoryMessage[]) : [];
      if (!h.length) return [];
      const lastUser = [...h].reverse().find((m) => m.role === "user")?.text ?? "";
      const lastModel = [...h].reverse().find((m) => m.role === "model");
      const lastText = lastModel?.data?.concept ?? lastModel?.text ?? "";
      return [{ questionId: r.key.slice("chat_history_".length), updatedAt: r.updatedAt, messages: h.length, lastUser, lastText: String(lastText) }];
    });
  }

  /**
   * Clear conversation history.
   */
  public static async clearConversation(questionId: string): Promise<void> {
    try {
      await IDBManager.deleteAIMemory(`chat_history_${questionId}`);
    } catch {
      // Ignored
    }
  }
}
