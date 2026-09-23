import { useAnalyticsStore } from "@/store/use-analytics-store";
import { useCalendarStore } from "@/store/use-calendar-store";
import { useDataStore } from "@/store/use-data-store";
import { useExamRuntimeStore } from "@/store/use-exam-runtime-store";
import { useExamStore } from "@/store/use-exam-store";
import { useGoalSliderStore } from "@/store/use-goal-slider-store";
import { useStudyStore } from "@/store/use-study-store";
import { useToastStore } from "@/store/use-toast-store";
import { useTodoStore } from "@/store/use-todo-store";
import { useUiStore } from "@/store/use-ui-store";

/**
 * Resets every Zustand store to its initial (pre-hydration) in-memory state.
 *
 * Part of the FINDING-4 fix (master plan Module 4F-1): opening a differently-namespaced
 * IndexedDB (see IDBManager.setActiveNamespace) is only half the isolation guarantee —
 * without this, a fresh database for user B would still be read through store state that
 * user A's session already hydrated into memory (bookmarks, mistakes, analytics, exam
 * history, …), so B would see A's data on screen until something happened to trigger a
 * reload. This is exactly the "easy bug to ship" the master plan calls out by name.
 *
 * Uses zustand's `getInitialState()` (stable since v4.5) rather than hand-maintained
 * per-store reset actions — each store's action methods are defined once, in the same
 * object literal passed to `create()`, so the initial-state snapshot already contains
 * the real action closures alongside the original data shape. `setState(state, true)`
 * with `replace: true` swaps the whole state object back to that snapshot instead of
 * merging over the current (dirty) one.
 *
 * This does NOT re-fetch data for whichever namespace is active afterwards — callers are
 * expected to be about to unmount/remount the relevant views (or trigger their existing
 * mount-time loaders), which already re-populate each store from IDBManager against
 * whatever namespace is now active. There is no auth/sign-out flow calling this yet;
 * Release 4 wires it in.
 */
export function resetAllStores(): void {
  useAnalyticsStore.setState(useAnalyticsStore.getInitialState(), true);
  useCalendarStore.setState(useCalendarStore.getInitialState(), true);
  useDataStore.setState(useDataStore.getInitialState(), true);
  useExamRuntimeStore.setState(useExamRuntimeStore.getInitialState(), true);
  useExamStore.setState(useExamStore.getInitialState(), true);
  useGoalSliderStore.setState(useGoalSliderStore.getInitialState(), true);
  useStudyStore.setState(useStudyStore.getInitialState(), true);
  useToastStore.setState(useToastStore.getInitialState(), true);
  useTodoStore.setState(useTodoStore.getInitialState(), true);
  useUiStore.setState(useUiStore.getInitialState(), true);
}
