"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { useAuthModalStore } from "@/store/use-auth-modal-store";
import { generateAvatarDataUri } from "@/lib/avatar/generate-avatar";
import { isAvatarStyleId } from "@/lib/avatar/dicebear-styles";

/**
 * Topbar auth entry point — self-contained so it can sit in topbar.tsx's icon cluster
 * without adding to that file's own state/effects. Signed out: a compact "Sign In"
 * button that opens the AuthModal in place (no navigation away from whatever page
 * the user is on). Signed in: the user's DiceBear avatar (rendered from their stored
 * seed/style — zero extra network request, same as the profile picker), linking to
 * /profile. Deliberately no dropdown/sign-out menu here yet — that lives on the
 * profile page itself for now, to keep this component small; a proper menu is an easy
 * follow-up.
 */
export function AccountButton() {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const loading = useAuthStore((s) => s.loading);
  const openAuthModal = useAuthModalStore((s) => s.open);

  if (loading) {
    return <div className="w-8 h-8 rounded-lg bg-[var(--surface-secondary)] animate-pulse" aria-hidden="true" />;
  }

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => openAuthModal("login")}
        aria-label="Sign In"
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors"
      >
        <LogIn className="w-4 h-4" />
        <span className="hidden sm:inline lg:hidden 2xl:inline">Sign In</span>
      </button>
    );
  }

  const style = profile && isAvatarStyleId(profile.avatar_style) ? profile.avatar_style : "adventurer";
  const seed = profile?.avatar_seed || user.id;
  const avatarUri = generateAvatarDataUri(style, seed, { size: 64 });

  return (
    <Link
      href="/profile"
      className="block w-8 h-8 rounded-lg overflow-hidden border border-[var(--border)] hover:border-indigo-500 transition-colors shrink-0"
      title={profile?.display_name?.trim() ? `${profile.display_name.trim()} · Your profile` : "Your profile"}
      aria-label={profile?.display_name?.trim() ? `${profile.display_name.trim()} — open your profile` : "Open your profile"}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- data: URI */}
      <img src={avatarUri} alt="Your avatar" className="w-full h-full" width={64} height={64} />
    </Link>
  );
}
