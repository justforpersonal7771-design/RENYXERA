"use client";

import { memo } from "react";
import { RenderableOption } from "@/types/question.types";
import { AstNodeRenderer } from "./ast-node-renderer";
import { Check } from "lucide-react";
import { motion } from "motion/react";

interface OptionRendererProps {
  option: RenderableOption;
  index: number;
  isSelected: boolean;
  onSelect: (optionId: string) => void;
  type: "MCQ" | "MSQ";
}

export const OptionRenderer = memo(function OptionRenderer({
  option,
  index,
  isSelected,
  onSelect,
  type,
}: OptionRendererProps) {
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const label = letters[index] || (index + 1).toString();

  return (
    <motion.button
      onClick={() => onSelect(option.option_id)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
      animate={isSelected ? { scale: [1, 1.015, 1] } : { scale: 1 }}
      transition={{ duration: 0.25 }}
      aria-pressed={isSelected}
      className={`
        relative w-full flex items-start gap-3 p-3 rounded-2xl border-[2px] transition-colors text-left group overflow-hidden
        ${
          isSelected
            ? "border-[var(--option-border-selected)] bg-[var(--option-selected)] shadow-[0_8px_24px_-12px_rgba(99,102,241,0.55)]"
            : "border-[var(--option-border)] bg-[var(--option-surface)] hover:border-[var(--option-border-selected)] hover:bg-[var(--option-hover)] hover:shadow-[0_8px_20px_-14px_rgba(99,102,241,0.5)]"
        }
      `}
    >
      {isSelected && (
        <motion.span
          aria-hidden="true"
          initial={{ opacity: 0.5, scale: 0 }}
          animate={{ opacity: 0, scale: 2.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="pointer-events-none absolute left-6 top-1/2 -mt-10 w-20 h-20 rounded-full bg-indigo-400/40"
        />
      )}
      <div
        className={`
        relative flex-shrink-0 w-8 h-8 rounded flex items-center justify-center font-bold text-sm transition-all duration-300 mt-0.5
        ${
          isSelected
            ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/40"
            : "bg-[var(--surface-secondary)] text-[var(--text-secondary)] group-hover:bg-[var(--info)]/20 group-hover:scale-105 shadow-sm"
        }
        ${type === "MCQ" ? "rounded-full" : "rounded-md"}
      `}
      >
        {label}
      </div>

      <div className="flex-1 mt-0.5 overflow-hidden break-words text-[var(--question-text)] font-medium">
        <AstNodeRenderer nodes={option.contentAst} className="inline-block max-w-full" />
      </div>

      <div className="flex-shrink-0 ml-2 mt-1.5 transition-opacity">
        {type === "MCQ" ? (
          <div
             className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-[var(--info)]" : "border-[var(--border)]"}`}
          >
            {isSelected && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 600, damping: 20 }} className="w-2.5 h-2.5 rounded-full bg-[var(--info)]" />
            )}
          </div>
        ) : (
          <div
             className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isSelected ? "border-[var(--info)] bg-[var(--info)]" : "border-[var(--border)]"}`}
          >
            {isSelected && (
              <motion.span initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 600, damping: 18 }}>
                <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              </motion.span>
            )}
          </div>
        )}
      </div>
    </motion.button>
  );
});
