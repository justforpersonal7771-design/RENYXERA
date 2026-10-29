/** Test Centre: the one section for building tests, mocks, practice and attempts. The name is set here only. */
export const TEST_CENTRE = "Test Centre";
export const TEST_CENTRE_HREF = "/test-centre";

// Every route that belongs to the section, so the navbar and bottom bar stay highlighted on all of them.
const PREFIXES = ["/test-centre", "/setup", "/mocks", "/fresh-mock", "/exam", "/challenge", "/checkpoint"];
export const isTestCentrePath = (p: string | null | undefined): boolean => !!p && PREFIXES.some((x) => p === x || p.startsWith(x + "/"));
