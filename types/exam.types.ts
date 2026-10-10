export type ExamType =
  | "GRAND_MOCK"
  | "YEAR_PAPER"
  | "SUBJECT_TEST"
  | "TOPIC_TEST"
  | "SECTION_TEST"
  | "CUSTOM_TEST";

export interface CustomTestBlock {
  id: string;
  yearShift?: string;
  section?: string;
  subject?: string;
  topic?: string;
  count: number;
  // When true (the default for new blocks), `count` always mirrors however
  // many questions currently match the block's filters — the block
  // represents its complete matching pool, per spec. Set to false once the
  // student manually types a specific count, to respect that override.
  includeAll?: boolean;
}

export interface CustomTestTemplate {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  blocks: CustomTestBlock[];
}

/** Tags a test/session as launched from the Focus Target syllabus-prioritizer, so the
 * origin (target % and what it bought the learner) can be surfaced anywhere that test's
 * data shows up later — results, dashboard history, mistakes, bookmarks, revision. */
export interface GoalTag {
  targetPercent: number;
  topicsCount: number;
  totalTopics: number;
  marksCaptured: number;
}

export interface TestConfig {
  examType: ExamType;
  yearShift?: string;
  subject?: string;
  section?: string;
  topics?: string[];
  difficulty?: string[];
  questionTypes?: string[];
  marks?: number[];
  questionCount?: number;
  seed?: number;
  customBlocks?: CustomTestBlock[];
  isAiGenerated?: boolean;
  goalTag?: GoalTag;
  /** "Beat my score": the friend's result this set was shared with. */
  challenge?: { score: number; max: number; by: string };
  // When Focus Target is active, the exact set of topics it currently recommends —
  // custom-block generation restricts every block's pool to this set, same as
  // Subject Mastery / Section Sprint already do. Undefined/omitted means unfiltered.
  focusTopics?: string[];
  /** All-India mock this test belongs to (Step 11 / 5E). */
  mockId?: string;
  /** Server-set time limit in seconds (mocks: shortened for late joiners). */
  timeLimitSeconds?: number;
  /** Wall-clock deadline (ISO). Mocks: the clock never stops, even if you leave the page. */
  deadlineAt?: string;
  title?: string;
}

export interface ExamQuestion {
  questionId: string;
  sequence: number;
}

export interface ExamSessionDraft {
  id: string;
  config: TestConfig;
  questions: ExamQuestion[];
  createdAt: string;
}
