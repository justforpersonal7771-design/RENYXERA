/**
 * Test integrity rules (All-India mocks and practice tests) — shared by the exam screen, the grader and the results
 * pages (and mirrored in SQL by public.attempt_disqualified, migration 0015).
 *
 * Built so honest candidates are never caught out: only leaving the exam window counts,
 * every time is warned about on screen, and the paper is submitted and disqualified only on
 * the MOCK_TAB_SWITCH_LIMIT-th time. Leaving full screen and answering fast are recorded
 * for context but never cost anyone their rank.
 */
export const MOCK_TAB_SWITCH_LIMIT = 5;

/** Flags that remove an attempt from ranking (it's kept, never deleted). */
export const DISQUALIFYING_FLAGS = ["disqualified", "tab_switches", "over_time", "question_set_mismatch", "no_start_token"] as const;

export type IntegrityFlag = { code: string; value?: number; reason?: string };

export const isDisqualified = (flags: IntegrityFlag[] | null | undefined) =>
  (flags ?? []).some((f) => (DISQUALIFYING_FLAGS as readonly string[]).includes(f.code));

export const FLAG_TEXT: Record<string, string> = {
  disqualified: "left the exam window too many times — the paper was submitted automatically",
  tab_switches: `left the exam window ${MOCK_TAB_SWITCH_LIMIT} or more times`,
  over_time: "submitted after the time limit",
  question_set_mismatch: "answers outside the mock's paper",
  no_start_token: "started without a server check-in",
  long_pause: "paused for a very long time",
  fullscreen_exits: "left full screen several times",
  rapid_answers: "many answers in under 5 seconds",
};
