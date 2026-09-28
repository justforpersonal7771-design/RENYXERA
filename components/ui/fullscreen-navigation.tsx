"use client";

import { useFullscreenState } from "@/components/ui/fullscreen-toggle";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FullscreenNavigationProps {
  onPrev?: () => void;
  onNext?: () => void;
  isPrevDisabled?: boolean;
  isNextDisabled?: boolean;
}

export function FullscreenNavigation({
  onPrev,
  onNext,
  isPrevDisabled = false,
  isNextDisabled = false,
}: FullscreenNavigationProps) {
  const isFullscreen = useFullscreenState();

  if (!isFullscreen) return null;

  return (
    <AnimatePresence>
      <div className="absolute inset-y-0 inset-x-0 pointer-events-none z-50 flex items-center justify-between px-4">
        {/* Left Nav Button */}
        {!isPrevDisabled && onPrev && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onPrev}
            className="pointer-events-auto w-12 h-12 rounded-full backdrop-blur-md bg-black/45 hover:bg-black/65 text-white border border-white/20 shadow-lg flex items-center justify-center transition-colors active:scale-95 focus:outline-none cursor-pointer"
            title="Previous question" aria-label="Previous question"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </motion.button>
        )}

        {/* Spacer if left is disabled to keep right on the right */}
        {(isPrevDisabled || !onPrev) && <div />}

        {/* Right Nav Button */}
        {!isNextDisabled && onNext && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onNext}
            className="pointer-events-auto w-12 h-12 rounded-full backdrop-blur-md bg-black/45 hover:bg-black/65 text-white border border-white/20 shadow-lg flex items-center justify-center transition-colors active:scale-95 focus:outline-none cursor-pointer"
            title="Next question" aria-label="Next question"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </motion.button>
        )}
      </div>
    </AnimatePresence>
  );
}
