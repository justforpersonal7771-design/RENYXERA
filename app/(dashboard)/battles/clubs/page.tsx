"use client";

/** Clubs (R31B-5): create or join with a code; the weekly club board. Reuses ClubPanel. */
import { ClubPanel } from "@/components/battles/clubs-coins";

export default function ClubsPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="g-title text-3xl sm:text-4xl">Clubs</h1>
        <p className="mt-1 g-text-2">Up to 30 friends. Every Arena point a member wins counts for the club.</p>
      </header>
      <ClubPanel />
    </div>
  );
}
