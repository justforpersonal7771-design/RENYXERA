import type { Doc } from "@/lib/desk/store";

/** One notebook for everything the student writes or keeps. `source` says where it came from and decides its colour and its link back. */
export type NoteSource = "study" | "test" | "bookmark" | "tutor" | "mentor" | "mine";
export type NoteColor = "none" | "yellow" | "green" | "pink" | "blue";
export type Note = Doc & {
  source: NoteSource;
  /** A question id (test, bookmark, tutor) or a study lesson id. */
  refId?: string;
  kind: "note" | "shortcut" | "formula";
  title: string;
  body: string;
  quote?: string;
  subject?: string;
  topic?: string;
  tags: string[];
  color: NoteColor;
  pinned: boolean;
  /** Put this note in the Revision queue. */
  revise: boolean;
  createdAt: string;
};

export const SOURCE_LABEL: Record<NoteSource, string> = { study: "Study", test: "Tests", bookmark: "Bookmarks", tutor: "Tutor", mentor: "Mentor", mine: "My notes" };
export const SOURCE_TINT: Record<NoteSource, string> = { study: "mint", test: "rose", bookmark: "butter", tutor: "sky", mentor: "lilac", mine: "peach" };

/** The schedule state of one thing being revised: a question (mistake, bookmark, Tutor question) or a note. */
export type RevItem = Doc & {
  kind: "question" | "note";
  refId: string;
  source: string;
  title: string;
  subject?: string;
  topic?: string;
  /** Next review day, YYYY-MM-DD in IST. */
  due: string;
  interval: number;
  ease: number;
  reps: number;
  lapses: number;
  lastRating?: 1 | 2 | 3 | 4;
  lastAt?: string;
  added: string;
  suspended?: boolean;
};

export type Queue = Doc & { name: string; ids: string[]; createdAt: string };
