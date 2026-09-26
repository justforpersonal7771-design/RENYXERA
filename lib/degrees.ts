/**
 * Degrees for the profile's Degree picker. GATE (from 2023) accepts candidates in the 3rd
 * or higher year of any undergraduate programme, or who have completed any
 * government-approved degree in Engineering / Technology / Architecture / Science /
 * Commerce / Arts / Humanities — so the list is broad, not just B.Tech.
 *
 * `exams` tags which entrance exams each degree is relevant to — the hook for the
 * planned cascading filter (pick an exam → see only its eligible degrees). Backlog.
 */
export type ExamCode = "GATE";

export interface DegreeOption {
  value: string;
  group: string;
  keywords?: string;
  exams: ExamCode[];
}

const G: ExamCode[] = ["GATE"];

/** Common short forms: "Computer Science & Engineering" → "cse cs", "Information Technology" → "it". */
function abbrev(name: string): string {
  const words = name.split(/[\s&,()/-]+/).filter((w) => w && !/^(and|of|the)$/i.test(w));
  const initials = words.map((w) => w[0]).join("").toLowerCase();
  const noEngg = words.filter((w) => !/^engineering$/i.test(w)).map((w) => w[0]).join("").toLowerCase();
  return [initials, noEngg].filter((x) => x.length >= 2).join(" ");
}

const engg = [
  "Computer Science & Engineering", "Information Technology", "Computer Engineering", "Artificial Intelligence & Machine Learning",
  "Artificial Intelligence & Data Science", "Data Science", "Cyber Security", "Internet of Things", "Electronics & Communication Engineering",
  "Electronics & Instrumentation Engineering", "Electronics & Telecommunication Engineering", "Electrical Engineering",
  "Electrical & Electronics Engineering", "Instrumentation & Control Engineering", "Mechanical Engineering", "Mechatronics",
  "Automobile Engineering", "Aeronautical Engineering", "Aerospace Engineering", "Civil Engineering", "Environmental Engineering",
  "Chemical Engineering", "Biotechnology", "Biomedical Engineering", "Metallurgical & Materials Engineering", "Mining Engineering",
  "Petroleum Engineering", "Production & Industrial Engineering", "Textile Engineering", "Agricultural Engineering",
  "Marine Engineering", "Naval Architecture", "Food Technology", "Ceramic Engineering", "Polymer Engineering",
];

export const DEGREES: DegreeOption[] = [
  ...engg.map((b) => ({ value: `B.Tech – ${b}`, group: "Engineering (B.Tech)", keywords: `btech b.tech be bachelor of technology ${b} ${abbrev(b)}`, exams: G })),
  ...engg.slice(0, 20).map((b) => ({ value: `B.E. – ${b}`, group: "Engineering (B.E.)", keywords: `be b.e. bachelor of engineering ${b} ${abbrev(b)}`, exams: G })),
  { value: "B.Tech (Lateral Entry, after Diploma)", group: "Engineering (B.Tech)", keywords: "lateral diploma", exams: G },
  { value: "AMIE (Institution of Engineers)", group: "Professional society (equivalent to B.E.)", keywords: "amie ie india", exams: G },
  { value: "AMIETE (IETE)", group: "Professional society (equivalent to B.E.)", keywords: "amiete iete", exams: G },
  { value: "Grad IETE", group: "Professional society (equivalent to B.E.)", keywords: "iete", exams: G },
  { value: "AMICE / AMIChE / AMIIM (other professional bodies)", group: "Professional society (equivalent to B.E.)", keywords: "professional society", exams: G },
  { value: "B.Arch", group: "Architecture & Planning", keywords: "architecture", exams: G },
  { value: "B.Planning", group: "Architecture & Planning", keywords: "planning", exams: G },
  { value: "B.Pharm", group: "Pharmacy & Health", keywords: "pharmacy", exams: G },
  { value: "Pharm.D", group: "Pharmacy & Health", keywords: "pharmacy doctor", exams: G },
  { value: "MBBS", group: "Pharmacy & Health", keywords: "medicine", exams: G },
  { value: "BDS", group: "Pharmacy & Health", keywords: "dental", exams: G },
  { value: "B.V.Sc & AH", group: "Pharmacy & Health", keywords: "veterinary", exams: G },
  { value: "B.Sc Nursing", group: "Pharmacy & Health", keywords: "nursing", exams: G },
  { value: "B.P.T (Physiotherapy)", group: "Pharmacy & Health", keywords: "physiotherapy", exams: G },
  ...["Computer Science", "Information Technology", "Physics", "Chemistry", "Mathematics", "Statistics", "Electronics", "Data Science", "Biotechnology", "Microbiology", "Biochemistry", "Life Sciences", "Botany", "Zoology", "Geology", "Environmental Science", "Agriculture", "Horticulture", "Forestry", "Fisheries Science", "Home Science"].map((s) => ({ value: `B.Sc – ${s}`, group: "Science (B.Sc / BS)", keywords: `bsc b.sc bachelor of science ${s} ${abbrev(s)}`, exams: G })),
  { value: "B.Sc (Research) / BS (4-year)", group: "Science (B.Sc / BS)", keywords: "bs research iiser iisc", exams: G },
  { value: "B.Sc (Hons) – other subject", group: "Science (B.Sc / BS)", keywords: "hons", exams: G },
  { value: "BCA", group: "Computer Applications", keywords: "bachelor of computer applications", exams: G },
  { value: "B.Voc (IT / Software)", group: "Computer Applications", keywords: "vocational", exams: G },
  { value: "B.Com", group: "Commerce, Arts & Humanities", keywords: "commerce", exams: G },
  { value: "BBA / BMS", group: "Commerce, Arts & Humanities", keywords: "business management", exams: G },
  { value: "B.A. – Economics", group: "Commerce, Arts & Humanities", keywords: "arts", exams: G },
  { value: "B.A. – Mathematics", group: "Commerce, Arts & Humanities", keywords: "arts", exams: G },
  { value: "B.A. – other subject", group: "Commerce, Arts & Humanities", keywords: "arts humanities", exams: G },
  { value: "B.Des (Design)", group: "Commerce, Arts & Humanities", keywords: "design", exams: G },
  { value: "LLB / BA LLB", group: "Commerce, Arts & Humanities", keywords: "law", exams: G },
  { value: "Integrated M.Tech / Dual degree (B.Tech + M.Tech)", group: "Integrated & dual degrees", keywords: "dual integrated", exams: G },
  { value: "Integrated M.Sc (5-year)", group: "Integrated & dual degrees", keywords: "integrated msc", exams: G },
  { value: "Integrated MCA (BCA + MCA)", group: "Integrated & dual degrees", keywords: "integrated mca", exams: G },
  { value: "Integrated B.S–M.S", group: "Integrated & dual degrees", keywords: "bs ms iiser", exams: G },
  { value: "M.Tech / M.E.", group: "Postgraduate", keywords: "masters engineering", exams: G },
  { value: "M.Sc – Computer Science", group: "Postgraduate", keywords: "msc", exams: G },
  { value: "M.Sc – Mathematics / Statistics", group: "Postgraduate", keywords: "msc", exams: G },
  { value: "M.Sc – Physics / Chemistry / Electronics", group: "Postgraduate", keywords: "msc", exams: G },
  { value: "M.Sc – other subject", group: "Postgraduate", keywords: "msc", exams: G },
  { value: "MCA", group: "Postgraduate", keywords: "master of computer applications", exams: G },
  { value: "M.A. (any subject)", group: "Postgraduate", keywords: "masters arts", exams: G },
  { value: "M.Com", group: "Postgraduate", keywords: "commerce", exams: G },
  { value: "MBA", group: "Postgraduate", keywords: "business", exams: G },
  { value: "M.Pharm", group: "Postgraduate", keywords: "pharmacy", exams: G },
  { value: "M.Arch / M.Planning", group: "Postgraduate", keywords: "architecture planning", exams: G },
  { value: "Ph.D (any discipline)", group: "Postgraduate", keywords: "doctorate phd", exams: G },
];

const CUSTOM_KEY = "renyxera_custom_degrees";

/** Degrees the user added on this device (shown in the picker next time). */
export function customDegrees(): string[] {
  try { return JSON.parse(localStorage.getItem(CUSTOM_KEY) || "[]").filter((d: unknown) => typeof d === "string"); } catch { return []; }
}
export function rememberCustomDegree(value: string) {
  try {
    const list = customDegrees().filter((d) => d.toLowerCase() !== value.toLowerCase());
    localStorage.setItem(CUSTOM_KEY, JSON.stringify([value, ...list].slice(0, 20)));
  } catch {}
}
