"use client";

import { useEffect, useRef } from "react";
import { useAuthStore, type Profile } from "@/store/use-auth-store";
import { IDBManager } from "@/lib/repository/storage/idb-manager";
import { resetAllStores } from "@/lib/store/reset-all-stores";
import { migrateGuestDataToAccount } from "@/lib/repository/storage/guest-migration";

/**
 * Mounted once in the root layout (matching ScrollbarActivity's pattern) — subscribes
 * to Supabase's auth state, mirrors it into useAuthStore, and drives the two isolation
 * mechanisms built earlier (IDBManager.setActiveNamespace, resetAllStores) whenever the
 * signed-in user actually changes. This is the first thing that calls either of them —
 * up to this point they were proven-working machinery with nothing wired to them.
 *
 * Gracefully no-ops if Supabase isn't configured (createClient() throws when the env
 * vars are missing) — the app stays in pure guest mode exactly as it always has,
 * matching every other Supabase call site's fallback behavior this project has used.
 *
 * Known, deliberate scope limit: on first page load with an *existing* session, this
 * resolves asynchronously (a Supabase local-storage read + a network round trip for the
 * profile), while page components mount and fire their own IndexedDB load effects in
 * the same tick — there's a real, small race where a component could read from the
 * about-to-be-replaced namespace before this finishes switching it. Left as-is: for an
 * actual sign-in/sign-out *during* a session (the common, real case), this reloads the
 * page after switching, which sidesteps the race entirely by remounting everything
 * fresh; first-load races only matter once a route builds meaningfully on a signed-in
 * user's local data, which /profile and the 4D guest locks now do — worth revisiting
 * if it ever shows up as a real bug rather than a theoretical one.
 */
export function AuthListener() {
  const setSession = useAuthStore((s) => s.setSession);
  const setProfile = useAuthStore((s) => s.setProfile);
  const setLoading = useAuthStore((s) => s.setLoading);
  const previousUserId = useRef<string | null | undefined>(undefined); // undefined = not yet resolved once

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      let supabase;
      try {
        const { createClient } = await import("@/lib/supabase/client");
        supabase = createClient();
      } catch {
        // Not configured — stay in guest mode.
        IDBManager.markNamespaceResolved();
        if (!cancelled) setLoading(false);
        return;
      }

      // Never throws: offline or on a network error the profile is just unknown for now,
      // and sign-in state still resolves (otherwise the app waits on auth forever).
      const fetchProfile = async (userId: string): Promise<Profile | null> => {
        try {
          const { data } = await supabase
            .from("profiles")
            .select("id, username, display_name, avatar_seed, avatar_style, target_branch, target_year, target_rank, target_score, daily_study_hours, tier")
            .eq("id", userId)
            .single();
          return (data as Profile) ?? null;
        } catch {
          return null;
        }
      };

      /** Applies the isolation mechanisms when the signed-in user id actually changes.
       *  `isFirstResolve` distinguishes "the page just loaded and we found out who's
       *  signed in" (namespace switch only, no reload — the page is already fresh) from
       *  a genuine sign-in/sign-out happening live (switch + reload, to guarantee every
       *  mounted component re-reads against the new namespace instead of racing it).
       *
       *  Critical case, caught by testing rather than assumed: the very first resolve
       *  for a GUEST (userId null) must be a true no-op. `previousUserId.current` starts
       *  as `undefined`, so `null !== undefined` looked like "a real change" and this
       *  used to call resetAllStores() on every single guest page load — which is the
       *  overwhelming majority of traffic today (nobody has signed in through the real
       *  app yet). That reset landed mid-flight against useDataStore's own one-time
       *  question-bank load effect, sometimes winning the race and stomping
       *  isInitialized back to false right after it had just been set true — with
       *  nothing left to ever set it true again, permanently stuck on the loading
       *  screen. The default IDBManager state (no namespace set) already IS the guest
       *  database, so a guest's first resolve has nothing to switch to or reset for. */
      const applyUserChange = async (userId: string | null, isFirstResolve: boolean) => {
        if (userId === previousUserId.current) return;
        const isNoOpGuestFirstResolve = isFirstResolve && userId === null;
        const isRealChange = previousUserId.current !== undefined;
        // A real guest session (not just "auth hasn't resolved yet", which is
        // `undefined`) becoming signed-in — covers a fresh signup and an existing
        // user who browsed as a guest on this device before signing in equally.
        const wasGuest = previousUserId.current === null;
        const signedOutFrom = !isFirstResolve && userId === null ? previousUserId.current : null;
        previousUserId.current = userId;

        // Step 6b: signing out removes that account's protected offline packs + key.
        if (signedOutFrom) {
          try {
            const { wipeVault } = await import("@/lib/vault/vault");
            await wipeVault(signedOutFrom);
          } catch {
            // best effort — the packs stay encrypted and need the account's key anyway
          }
        }

        if (isNoOpGuestFirstResolve) return;

        // Must run before setActiveNamespace switches away from the guest database —
        // see guest-migration.ts (master plan Module 4D: guest data is migrated into
        // the new account on signup, never discarded).
        if (userId && wasGuest) {
          await migrateGuestDataToAccount(userId);
        }

        await IDBManager.setActiveNamespace(userId);
        resetAllStores();

        if (isRealChange && !isFirstResolve) {
          // Signing out lands on the dashboard (not a reload of e.g. /profile,
          // which is meaningless once signed out); signing in stays put.
          if (userId === null) window.location.replace("/");
          else window.location.reload();
        }
      };

      let session = null;
      try {
        ({ data: { session } } = await supabase.auth.getSession());
      } catch {
        // Unreadable session: continue as a guest rather than leaving storage locked.
      }
      if (cancelled) return;

      const user = session?.user ? { id: session.user.id, email: session.user.email ?? null } : null;
      setSession(user);
      await applyUserChange(user?.id ?? null, true);
      IDBManager.markNamespaceResolved();
      if (user) setProfile(await fetchProfile(user.id));
      setLoading(false);

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (_event, session) => {
        const user = session?.user ? { id: session.user.id, email: session.user.email ?? null } : null;
        setSession(user);
        await applyUserChange(user?.id ?? null, false);
        setProfile(user ? await fetchProfile(user.id) : null);
      });
      unsubscribe = () => subscription.unsubscribe();
    })();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
