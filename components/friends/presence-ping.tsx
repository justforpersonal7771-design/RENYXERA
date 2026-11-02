"use client";

/**
 * Tells the server "this student is here" so friends can see an active dot (R29). One tiny request a minute, only while the
 * tab is visible and the student is signed in; nothing is sent in exams (presence there would only distract).
 */
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";

const EVERY_MS = 60_000;
let lastPing = 0; // shared, so a remount or a second effect never doubles the request

export function PresencePing() {
  const user = useAuthStore((s) => s.user);
  const pathname = usePathname();
  const inExam = pathname?.startsWith("/exam") ?? false;
  useEffect(() => {
    if (!user || inExam) return;
    const ping = () => {
      if (document.visibilityState !== "visible" || !navigator.onLine || Date.now() - lastPing < EVERY_MS - 2000) return;
      lastPing = Date.now();
      void fetch("/api/friends", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "ping" }), keepalive: true }).catch(() => {});
    };
    ping();
    const t = setInterval(ping, EVERY_MS);
    document.addEventListener("visibilitychange", ping);
    return () => { clearInterval(t); document.removeEventListener("visibilitychange", ping); };
  }, [user, inExam]);
  return null;
}
