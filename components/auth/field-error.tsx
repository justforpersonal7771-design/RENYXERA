"use client";

import { AnimatePresence, motion } from "motion/react";
import { AlertCircle } from "lucide-react";

/** Inline field message in the app's style (replaces the browser's validation bubble). */
export function FieldError({ message }: { message?: string | null }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          role="alert"
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          transition={{ duration: 0.18 }}
          className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400 overflow-hidden"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
