import { openDB, IDBPDatabase } from "idb";
import {
  DATABASE_NAME,
  DATABASE_VERSION,
  STORE_METADATA,
  STORE_QUESTION_CACHE,
  STORE_EXAM_SESSIONS,
  STORE_USER_MUTATIONS,
  STORE_ANALYTICS_SNAPSHOTS,
  STORE_STUDY_METRICS,
  STORE_MISTAKES,
  STORE_BOOKMARKS,
  STORE_CUSTOM_TEMPLATES,
  STORE_AI_RESPONSES,
  STORE_AI_GENERATED_QUESTIONS,
  STORE_AI_MEMORY,
} from "./cache-constants";
import {
  MetadataRecord,
  ExamSessionRecord,
  QuestionCacheRecord,
  GatePrepDB,
  AIResponseRecord,
  AIMemoryRecord,
} from "./cache-types";
import { CustomTestTemplate } from "@/types/exam.types";

export class IDBManager {
  private static dbPromise: Promise<IDBPDatabase<GatePrepDB>> | null = null;

  // Namespacing prep for per-user data isolation (master plan Module 4F-1, FINDING-4).
  // `null` (the default — nothing sets this today, since auth doesn't exist yet) means
  // "use the database exactly as it's named today": getDatabaseName() then returns the
  // original DATABASE_NAME unchanged, so every current user's existing IndexedDB data
  // stays exactly where it is. This is deliberate — silently renaming the physical
  // database would orphan every existing user's bookmarks/mistakes/sessions overnight,
  // since browsers do not migrate data between differently-named IndexedDB databases.
  // Once Release 4 auth exists, its sign-in/sign-out flow calls setActiveNamespace(userId
  // | null) to open a per-user database (e.g. "GatePrepOS_DB__<userId>") and
  // resetAllStores() (see lib/store/reset-all-stores.ts) to clear in-memory state —
  // together those two calls are the full fix for two students sharing one device seeing
  // each other's data.
  private static activeNamespace: string | null = null;

  private static getDatabaseName(): string {
    return this.activeNamespace ? `${DATABASE_NAME}__${this.activeNamespace}` : DATABASE_NAME;
  }

  /** Switches which physical IndexedDB database subsequent calls read/write. Closes the
   *  currently-open connection (if any) and drops the cached open-promise so the next
   *  call to any IDBManager method transparently reopens under the new namespace — every
   *  existing call site (28 files, all going through this class rather than calling
   *  openDB directly) picks this up with no changes on their part. Passing the same
   *  namespace that's already active is a no-op (avoids closing/reopening a connection
   *  that callers may still be mid-transaction against, e.g. on a redundant call). */
  // Nothing may open a database until the auth listener knows who is signed in —
  // otherwise a page loaded directly (refresh, deep link, offline reload) reads the
  // guest database before the switch and shows "not found". Opens after the first
  // resolve, or after NAMESPACE_WAIT_MS as a safety net so storage can never hang.
  private static namespaceResolved = false;
  private static resolveNamespaceGate: () => void = () => {};
  private static namespaceGate: Promise<void> | null = null;
  private static readonly NAMESPACE_WAIT_MS = 4000;

  private static waitForNamespace(): Promise<void> {
    if (this.namespaceResolved) return Promise.resolve();
    if (!this.namespaceGate) {
      this.namespaceGate = new Promise<void>((resolve) => {
        this.resolveNamespaceGate = resolve;
        setTimeout(() => this.markNamespaceResolved(), this.NAMESPACE_WAIT_MS);
      });
    }
    return this.namespaceGate;
  }

  /** Called by the auth listener once the first sign-in state is known (also for guests). */
  public static markNamespaceResolved(): void {
    if (this.namespaceResolved) return;
    this.namespaceResolved = true;
    this.resolveNamespaceGate();
  }

  public static async setActiveNamespace(namespace: string | null): Promise<void> {
    if (namespace === this.activeNamespace) return;
    if (!this.namespaceResolved) {
      // Nothing has actually opened yet (opens wait on the gate and read the name after
      // it), so just set the namespace and let the waiting opens proceed with it.
      this.activeNamespace = namespace;
      this.markNamespaceResolved();
      return;
    }
    if (this.dbPromise) {
      try {
        const db = await this.dbPromise;
        db.close();
      } catch {
        // Connection may already be in a bad state (e.g. blocked/erroring) — proceed to
        // drop it regardless so the next call opens a fresh one.
      }
    }
    this.activeNamespace = namespace;
    this.dbPromise = null;
  }

  public static async initializeDatabase(): Promise<IDBPDatabase<GatePrepDB>> {
    if (!this.dbPromise) {
      if (typeof window === "undefined") {
        return Promise.reject(
          new Error("IndexedDB is not available in non-browser environments."),
        );
      }

      this.dbPromise = this.waitForNamespace().then(() => openDB<GatePrepDB>(this.getDatabaseName(), DATABASE_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(STORE_METADATA)) {
            db.createObjectStore(STORE_METADATA, { keyPath: "key" });
          }
          if (!db.objectStoreNames.contains(STORE_QUESTION_CACHE)) {
            db.createObjectStore(STORE_QUESTION_CACHE, {
              keyPath: "question_id",
            });
          }
          if (!db.objectStoreNames.contains(STORE_EXAM_SESSIONS)) {
            db.createObjectStore(STORE_EXAM_SESSIONS, { keyPath: "id" });
          }
          if (!db.objectStoreNames.contains(STORE_USER_MUTATIONS)) {
            db.createObjectStore(STORE_USER_MUTATIONS, { keyPath: "id" });
          }
          if (!db.objectStoreNames.contains(STORE_ANALYTICS_SNAPSHOTS)) {
            db.createObjectStore(STORE_ANALYTICS_SNAPSHOTS, { keyPath: "id" });
          }
          if (!db.objectStoreNames.contains(STORE_STUDY_METRICS)) {
            db.createObjectStore(STORE_STUDY_METRICS, { keyPath: "id" });
          }
          if (!db.objectStoreNames.contains(STORE_MISTAKES)) {
            db.createObjectStore(STORE_MISTAKES, { keyPath: "questionId" });
          }
          if (!db.objectStoreNames.contains(STORE_BOOKMARKS)) {
            db.createObjectStore(STORE_BOOKMARKS, { keyPath: "questionId" });
          }
          if (!db.objectStoreNames.contains(STORE_CUSTOM_TEMPLATES)) {
            db.createObjectStore(STORE_CUSTOM_TEMPLATES, { keyPath: "id" });
          }
          if (!db.objectStoreNames.contains(STORE_AI_RESPONSES)) {
            db.createObjectStore(STORE_AI_RESPONSES, { keyPath: "promptHash" });
          }
          if (!db.objectStoreNames.contains(STORE_AI_GENERATED_QUESTIONS)) {
            db.createObjectStore(STORE_AI_GENERATED_QUESTIONS, {
              keyPath: "question_id",
            });
          }
          if (!db.objectStoreNames.contains(STORE_AI_MEMORY)) {
            db.createObjectStore(STORE_AI_MEMORY, { keyPath: "key" });
          }
        },
      }));
    }
    return this.dbPromise;
  }

  public static async getMetadata(
    key: string,
  ): Promise<MetadataRecord | undefined> {
    try {
      const db = await this.initializeDatabase();
      return await db.get(STORE_METADATA, key);
    } catch {
      return undefined;
    }
  }

  public static async setMetadata(
    key: string,
    value: string | number | boolean,
  ): Promise<void> {
    try {
      const db = await this.initializeDatabase();
      await db.put(STORE_METADATA, { key, value });
    } catch {
      // IndexedDB might fail (e.g. quota, private mode), suppress exceptions matching requirements
    }
  }

  public static async getQuestionCache(): Promise<QuestionCacheRecord[]> {
    try {
      const db = await this.initializeDatabase();
      return await db.getAll(STORE_QUESTION_CACHE);
    } catch {
      return [];
    }
  }

  public static async setQuestionCache(
    questions: QuestionCacheRecord[],
  ): Promise<void> {
    try {
      const db = await this.initializeDatabase();
      const tx = db.transaction(STORE_QUESTION_CACHE, "readwrite");

      for (const question of questions) {
        tx.store.put(question);
      }

      await tx.done;
    } catch {
      // Ignored for fallback to network strategy
    }
  }

  public static async clearQuestionCache(): Promise<void> {
    try {
      const db = await this.initializeDatabase();
      await db.clear(STORE_QUESTION_CACHE);
    } catch {
      // Ignored
    }
  }

  public static async saveExamSession(
    session: ExamSessionRecord,
  ): Promise<void> {
    try {
      const db = await this.initializeDatabase();
      await db.put(STORE_EXAM_SESSIONS, session);
    } catch {
      // Ignored
    }
  }

  public static async loadExamSession(
    id: string,
  ): Promise<ExamSessionRecord | undefined> {
    try {
      const db = await this.initializeDatabase();
      return await db.get(STORE_EXAM_SESSIONS, id);
    } catch {
      return undefined;
    }
  }

  public static async deleteExamSession(id: string): Promise<void> {
    try {
      const db = await this.initializeDatabase();
      await db.delete(STORE_EXAM_SESSIONS, id);
    } catch {
      // Ignored
    }
  }

  public static async getAnalyticsSnapshots(): Promise<import("@/types/analytics.types").AnalyticsSnapshot[]> {
    try {
      const db = await this.initializeDatabase();
      return await db.getAll(STORE_ANALYTICS_SNAPSHOTS);
    } catch {
      return [];
    }
  }

  public static async saveAnalyticsSnapshot(snapshot: import("@/types/analytics.types").AnalyticsSnapshot): Promise<void> {
    try {
      const db = await this.initializeDatabase();
      await db.put(STORE_ANALYTICS_SNAPSHOTS, snapshot);
    } catch {
      // Ignored
    }
  }

  public static async getStudyMetrics(): Promise<(import("@/types/analytics.types").StudyMetrics & { id: string }) | undefined> {
    try {
      const db = await this.initializeDatabase();
      return await db.get(STORE_STUDY_METRICS, "global_metrics");
    } catch {
      return undefined;
    }
  }

  public static async saveStudyMetrics(metrics: import("@/types/analytics.types").StudyMetrics): Promise<void> {
    try {
      const db = await this.initializeDatabase();
      await db.put(STORE_STUDY_METRICS, { id: "global_metrics", ...metrics });
    } catch {
      // Ignored
    }
  }

  public static async getAllExamSessions(): Promise<ExamSessionRecord[]> {
    try {
      const db = await this.initializeDatabase();
      return await db.getAll(STORE_EXAM_SESSIONS);
    } catch {
      return [];
    }
  }

  public static async getAllMistakes(): Promise<import("@/types/study.types").MistakeEntry[]> {
    try {
      const db = await this.initializeDatabase();
      return await db.getAll(STORE_MISTAKES);
    } catch {
      return [];
    }
  }

  public static async saveMistake(mistake: import("@/types/study.types").MistakeEntry): Promise<void> {
    try {
      const db = await this.initializeDatabase();
      await db.put(STORE_MISTAKES, mistake);
    } catch {
      // Ignored
    }
  }
  
  public static async removeMistake(questionId: string): Promise<void> {
    try {
      const db = await this.initializeDatabase();
      await db.delete(STORE_MISTAKES, questionId);
    } catch (e) {
      // Ignored
    }
  }

  public static async getAllBookmarks(): Promise<import("@/types/study.types").BookmarkEntry[]> {
    try {
      const db = await this.initializeDatabase();
      return await db.getAll(STORE_BOOKMARKS);
    } catch {
      return [];
    }
  }

  public static async saveBookmark(bookmark: import("@/types/study.types").BookmarkEntry): Promise<void> {
    try {
      const db = await this.initializeDatabase();
      await db.put(STORE_BOOKMARKS, bookmark);
    } catch {
      // Ignored
    }
  }

  public static async removeBookmark(questionId: string): Promise<void> {
    try {
      const db = await this.initializeDatabase();
      await db.delete(STORE_BOOKMARKS, questionId);
    } catch (e) {
      // Ignored
    }
  }

  // =========== Custom Test Templates ===========
  public static async saveCustomTemplate(template: import("@/types/exam.types").CustomTestTemplate): Promise<void> {
    try {
      const db = await this.initializeDatabase();
      await db.put(STORE_CUSTOM_TEMPLATES, template);
    } catch (e) {
      console.warn("Failed to save template", e);
    }
  }

  public static async getAllCustomTemplates(): Promise<import("@/types/exam.types").CustomTestTemplate[]> {
    try {
      const db = await this.initializeDatabase();
      return await db.getAll(STORE_CUSTOM_TEMPLATES);
    } catch (e) {
      return [];
    }
  }

  public static async deleteCustomTemplate(id: string): Promise<void> {
    try {
      const db = await this.initializeDatabase();
      await db.delete(STORE_CUSTOM_TEMPLATES, id);
    } catch (e) {
      console.warn("Failed to delete template", e);
    }
  }

  // =========== Calendar Events Helpers ===========
  public static async getCalendarEvents(): Promise<import("@/types/calendar.types").CalendarEvent[]> {
    const record = await this.getMetadata("calendar_events");
    if (record && record.value) {
      try {
        return JSON.parse(record.value as string);
      } catch {
        return [];
      }
    }
    return [];
  }

  public static async saveCalendarEvents(events: import("@/types/calendar.types").CalendarEvent[]): Promise<void> {
    await this.setMetadata("calendar_events", JSON.stringify(events));
  }

  // =========== To-Do List Helpers ===========
  public static async getTodoItems(): Promise<import("@/types/todo.types").TodoItem[]> {
    const record = await this.getMetadata("todo_items");
    if (record && record.value) {
      try {
        return JSON.parse(record.value as string);
      } catch {
        return [];
      }
    }
    return [];
  }

  public static async saveTodoItems(items: import("@/types/todo.types").TodoItem[]): Promise<void> {
    await this.setMetadata("todo_items", JSON.stringify(items));
  }

  // =========== AI Cache Helpers ===========
  public static async getAIResponse(promptHash: string): Promise<AIResponseRecord | undefined> {
    try {
      const db = await this.initializeDatabase();
      const record = await db.get(STORE_AI_RESPONSES, promptHash);
      if (record && record.ttl > Date.now()) {
        return record;
      }
      if (record) {
        // Purge expired record lazily
        await db.delete(STORE_AI_RESPONSES, promptHash);
      }
      return undefined;
    } catch {
      return undefined;
    }
  }

  public static async saveAIResponse(record: AIResponseRecord): Promise<void> {
    try {
      const db = await this.initializeDatabase();
      await db.put(STORE_AI_RESPONSES, record);
    } catch {
      // Ignored
    }
  }

  public static async purgeExpiredAIResponses(): Promise<void> {
    try {
      const db = await this.initializeDatabase();
      const tx = db.transaction(STORE_AI_RESPONSES, "readwrite");
      const store = tx.objectStore(STORE_AI_RESPONSES);
      const records = await store.getAll();
      const now = Date.now();
      for (const r of records) {
        if (r.ttl <= now) {
          await store.delete(r.promptHash);
        }
      }
      await tx.done;
    } catch {
      // Ignored
    }
  }

  public static async saveAIGeneratedQuestion(q: any): Promise<void> {
    try {
      const db = await this.initializeDatabase();
      await db.put(STORE_AI_GENERATED_QUESTIONS, q);
    } catch (e) {
      console.error("Failed to save AI Generated Question to IDB", e);
    }
  }

  public static async getAIGeneratedQuestions(): Promise<any[]> {
    try {
      const db = await this.initializeDatabase();
      return await db.getAll(STORE_AI_GENERATED_QUESTIONS);
    } catch (e) {
      console.error("Failed to get AI Generated Questions from IDB", e);
      return [];
    }
  }

  public static async clearAIGeneratedQuestions(): Promise<void> {
    try {
      const db = await this.initializeDatabase();
      await db.clear(STORE_AI_GENERATED_QUESTIONS);
    } catch (e) {
      console.error("Failed to clear AI Generated Questions in IDB", e);
    }
  }

  public static async saveAIMemory(key: string, value: any): Promise<void> {
    try {
      const db = await this.initializeDatabase();
      await db.put(STORE_AI_MEMORY, {
        key,
        value,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error(`Failed to save AI Memory for ${key}`, e);
    }
  }

  public static async getAIMemory(key: string): Promise<any | undefined> {
    try {
      const db = await this.initializeDatabase();
      const record = await db.get(STORE_AI_MEMORY, key);
      return record ? record.value : undefined;
    } catch (e) {
      console.error(`Failed to get AI Memory for ${key}`, e);
      return undefined;
    }
  }

  public static async deleteAIMemory(key: string): Promise<void> {
    try {
      const db = await this.initializeDatabase();
      await db.delete(STORE_AI_MEMORY, key);
    } catch (e) {
      console.error(`Failed to delete AI Memory for ${key}`, e);
    }
  }
}
