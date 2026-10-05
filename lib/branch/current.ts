/**
 * The branch this browser is working in (docs/MULTI_BRANCH_DESIGN.md §3).
 *
 * - Signed-in: the account's branch is profiles.target_branch (server truth). It is cached
 *   per account in localStorage so the very first IndexedDB open on a page load already
 *   uses the right branch database, before the profile request returns.
 * - Guests: free to switch any number of times; the choice lives in localStorage and a
 *   cookie (the cookie lets server routes see a guest's branch).
 *
 * Read synchronously everywhere (data store, IDB name, image base). Changing it always
 * reloads the page, so nothing mounted can keep reading the previous branch's data.
 */
import { branchByCode, DEFAULT_BRANCH, isAvailableBranch, isBranchCode, type BranchCode } from "@/lib/branches";

const GUEST_KEY = "renyxera_branch";
const accountKey = (userId: string) => `renyxera_branch:${userId}`;
export const BRANCH_COOKIE = "renyxera_branch";

let current: BranchCode | null = null;

function read(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function write(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { /* storage blocked */ }
}
function setCookie(code: BranchCode) {
  try { document.cookie = `${BRANCH_COOKIE}=${code}; path=/; max-age=31536000; samesite=lax`; } catch { /* ignore */ }
}

/** First guess on page load, before auth resolves: the guest choice (also the last value
 *  an account mirrored, see setAccountBranch), a ?branch= deep link for guests, else CSE. */
function initialGuess(): BranchCode {
  if (typeof window === "undefined") return DEFAULT_BRANCH;
  const fromUrl = new URLSearchParams(window.location.search).get("branch")?.toUpperCase();
  if (isAvailableBranch(fromUrl)) {
    write(GUEST_KEY, fromUrl);
    return fromUrl;
  }
  const g = read(GUEST_KEY);
  return isAvailableBranch(g) ? g : DEFAULT_BRANCH;
}

export function getCurrentBranch(): BranchCode {
  if (!current) current = initialGuess();
  return current;
}

/** Called by the auth listener before any database opens. Returns the branch to use for
 *  this account on this device (cached profile value; CSE for an account never seen). */
export function resolveBranchForUser(userId: string | null): BranchCode {
  if (!userId) {
    current = initialGuess();
  } else {
    const cached = read(accountKey(userId));
    current = isBranchCode(cached) ? cached : DEFAULT_BRANCH;
  }
  setCookie(current);
  return current;
}

/** The profile arrived. If its branch differs from the cached one this device opened, cache
 *  the truth and report that a reload is needed (the caller reloads). */
export function syncAccountBranch(userId: string, profileBranch: string | null | undefined): boolean {
  const truth: BranchCode = isBranchCode(profileBranch) ? profileBranch : DEFAULT_BRANCH;
  write(accountKey(userId), truth);
  setCookie(truth);
  if (truth !== current) {
    current = truth;
    return true;
  }
  return false;
}

/** Guests only: switch freely. Reloads into the new branch. */
export function switchGuestBranch(code: BranchCode) {
  if (!isAvailableBranch(code)) return;
  write(GUEST_KEY, code);
  setCookie(code);
  current = code;
  try { new BroadcastChannel("renyxera-branch").postMessage(code); } catch { /* old browser */ }
  window.location.reload();
}

/** After the account's branch changed on the server (onboarding pick or the final change). */
export function applyAccountBranch(userId: string, code: BranchCode) {
  write(accountKey(userId), code);
  setCookie(code);
  current = code;
  try { new BroadcastChannel("renyxera-branch").postMessage(code); } catch { /* old browser */ }
  window.location.reload();
}

/** Other tabs follow a switch made in this one (design E3). */
export function listenForBranchChanges() {
  try {
    const ch = new BroadcastChannel("renyxera-branch");
    ch.onmessage = (e) => { if (e.data !== current) window.location.reload(); };
    return () => ch.close();
  } catch {
    return () => {};
  }
}

/** "CS", "EC", … for copy such as "your GATE EC study engine" (client; "CS" during SSR). */
export function paperLabel(): string {
  return branchByCode(getCurrentBranch())?.paper ?? "CS";
}
