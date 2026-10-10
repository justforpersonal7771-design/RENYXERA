// Facts about GATE 2027, each with where it comes from and when we last checked it.
// Rule: only what the official site states goes here — anything it doesn't state is listed under
// NOT_STATED rather than guessed. Re-check against the source before each update to CHECKED_ON.

export const OFFICIAL_SITE = "https://gate2027.iitm.ac.in";
export const CHECKED_ON = "2026-10-10";

export type Fact = { label: string; value: string; note?: string };

export const KEY_DATES: Fact[] = [
  { label: "Registration opened", value: "2 September 2026", note: "On the GOAPS portal." },
  { label: "Registration with late fee", value: "Open until 12 October 2026", note: "The official page says dates are liable to change." },
  { label: "Admit card", value: "4 January 2027" },
  { label: "Exam days", value: "6 & 7 Feb · 13 & 14 Feb · 20 & 21 Feb 2027", note: "Three weekends, two days each." },
  { label: "Results", value: "19 March 2027" },
];

export const WHATS_CHANGED: Fact[] = [
  { label: "New paper: Robotics and Automation (RA)", value: "GATE 2027 adds a Robotics and Automation test paper." },
  { label: "Revised syllabi", value: "The official site states that the syllabi of the GATE 2027 test papers have been revised. Open your paper's official PDF and compare it with the one you used before." },
  { label: "Changed codes for XE, XH and XL sections", value: "The sectional paper codes for XE, XH and XL have changed." },
  { label: "DigiLocker is mandatory", value: "Registration through DigiLocker is mandatory for all Indian nationals." },
  { label: "Organising institute", value: "IIT Madras (conducted jointly by IISc and the IITs for the National Coordination Board)." },
];

/** Things students ask about that the official home page does not state — shown so we never imply otherwise. */
export const NOT_STATED = [
  "Application fee changes",
  "Changes to the question paper pattern (marks, sections, question types)",
  "City allotment date (listed as to be announced) and the correction window",
];
