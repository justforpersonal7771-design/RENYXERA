/** Test Centre: the one section for building tests, mocks, practice and attempts. The name is set here only. */
export const TEST_CENTRE = "Test Centre";
export const TEST_CENTRE_HREF = "/test-centre";

// Every route that belongs to the section, so the navbar and bottom bar stay highlighted on all of them.
const PREFIXES = ["/test-centre", "/setup", "/mocks", "/fresh-mock", "/exam", "/challenge", "/checkpoint"];
/** Each screen takes the colour of its tile on the hub, so the page and the navbar wash match the door you opened. */
const TINTS: [string, string][] = [
  ["/test-centre/practice", "rose"], ["/revision", "rose"], ["/checkpoint", "rose"], ["/test-centre/mocks", "peri"], ["/mocks", "peri"], ["/fresh-mock", "peri"],
  ["/test-centre/history", "sky"], ["/challenge", "lilac"], ["/test-centre/build", "mint"], ["/setup", "mint"], ["/exam", "mint"], ["/test-centre", "mint"],
];
export const testCentreTint = (p: string | null | undefined): string | null => TINTS.find(([k]) => !!p && (p === k || p.startsWith(k + "/")))?.[1] ?? null;
export const isTestCentrePath = (p: string | null | undefined): boolean => !!p && PREFIXES.some((x) => p === x || p.startsWith(x + "/"));
