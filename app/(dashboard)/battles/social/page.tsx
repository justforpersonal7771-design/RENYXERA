"use client";

/** Friends (R31B-4): add by username, requests, who is online, challenge. Reuses the live FriendsPanel. */
import { FriendsPanel } from "@/components/friends/friends-panel";

export default function SocialPage() {
  return (
    <div className="space-y-4">
      <header>
        <h1 className="g-title text-3xl sm:text-4xl">Friends</h1>
        <p className="mt-1 g-text-2">Add friends by username. You can challenge anyone on this list.</p>
      </header>
      <FriendsPanel />
    </div>
  );
}
