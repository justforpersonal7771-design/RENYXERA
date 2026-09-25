import { IDBManager } from "./idb-manager";

/**
 * Master plan Module 4D: "Guest data lives in the renyxera-guest IndexedDB namespace
 * and is migrated into the new account on signup, never discarded." Called from
 * components/system/auth-listener.tsx right before it switches the active namespace
 * away from guest, whenever a real guest session (not just "auth hasn't resolved yet")
 * transitions into a signed-in one — covers a fresh signup and an existing user who
 * happened to browse as a guest on this device/browser before signing in equally,
 * since both cases have real local-only data sitting in the guest namespace that
 * would otherwise be silently orphaned.
 *
 * Additive only: never deletes or overwrites anything in the target account's
 * namespace, and skips any guest record whose key already exists there — the
 * acceptance criterion is "zero loss and zero duplicates", not "guest wins".
 *
 * IDBManager is a static, single-namespace class (see its own file-level comment),
 * so this reads everything out of the guest namespace first, then switches namespace
 * and writes — there is no point where both are open at once, only sequential access
 * through IDBManager's existing public methods.
 */
export async function migrateGuestDataToAccount(targetUserId: string): Promise<void> {
  try {
    await IDBManager.setActiveNamespace(null);
    const [guestBookmarks, guestMistakes, guestTemplates, guestTodos, guestEvents] = await Promise.all([
      IDBManager.getAllBookmarks(),
      IDBManager.getAllMistakes(),
      IDBManager.getAllCustomTemplates(),
      IDBManager.getTodoItems(),
      IDBManager.getCalendarEvents(),
    ]);

    const hasAnything =
      guestBookmarks.length || guestMistakes.length || guestTemplates.length || guestTodos.length || guestEvents.length;
    if (!hasAnything) return;

    await IDBManager.setActiveNamespace(targetUserId);
    const [existingBookmarks, existingMistakes, existingTemplates, existingTodos, existingEvents] = await Promise.all([
      IDBManager.getAllBookmarks(),
      IDBManager.getAllMistakes(),
      IDBManager.getAllCustomTemplates(),
      IDBManager.getTodoItems(),
      IDBManager.getCalendarEvents(),
    ]);

    const existingBookmarkIds = new Set(existingBookmarks.map((b) => b.questionId));
    const existingMistakeIds = new Set(existingMistakes.map((m) => m.questionId));
    const existingTemplateIds = new Set(existingTemplates.map((t) => t.id));
    const existingTodoIds = new Set(existingTodos.map((t) => t.id));
    const existingEventIds = new Set(existingEvents.map((e) => e.id));

    await Promise.all([
      ...guestBookmarks.filter((b) => !existingBookmarkIds.has(b.questionId)).map((b) => IDBManager.saveBookmark(b)),
      ...guestMistakes.filter((m) => !existingMistakeIds.has(m.questionId)).map((m) => IDBManager.saveMistake(m)),
      ...guestTemplates.filter((t) => !existingTemplateIds.has(t.id)).map((t) => IDBManager.saveCustomTemplate(t)),
    ]);

    const newTodos = guestTodos.filter((t) => !existingTodoIds.has(t.id));
    if (newTodos.length) await IDBManager.saveTodoItems([...existingTodos, ...newTodos]);

    const newEvents = guestEvents.filter((e) => !existingEventIds.has(e.id));
    if (newEvents.length) await IDBManager.saveCalendarEvents([...existingEvents, ...newEvents]);
  } catch (err) {
    // Never let a migration failure block sign-in itself — the guest data stays put in
    // its own namespace either way (nothing here deletes it), so worst case is it
    // simply isn't copied over this time rather than the user being unable to sign in.
    console.warn("[guest-migration] failed, continuing without migrating guest data", err);
  }
}
