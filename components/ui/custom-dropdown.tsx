"use client";

import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Check } from "lucide-react";

interface Option {
  label: string;
  value: string;
  subLabel?: string;
}

interface CustomDropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function CustomDropdown({ options, value, onChange, placeholder = "Select...", className = "" }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [rect, setRect] = useState<{ top: number; left: number; width: number; openUp: boolean } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectedOption = options.find(o => o.value === value);

  useEffect(() => setMounted(true), []);

  // Popover list is rendered via a portal into <body> instead of inline, so it can never be
  // clipped by an ancestor's overflow-hidden or trapped under content in a different, higher
  // local stacking context (both bit us in practice — a fixed-position panel elsewhere on the
  // page painting over an inline-positioned list despite it having a higher z-index).
  const updatePosition = () => {
    const el = buttonRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const spaceBelow = window.innerHeight - r.bottom;
    const openUp = spaceBelow < 260 && r.top > spaceBelow;
    setRect({ top: openUp ? r.top : r.bottom, left: r.left, width: r.width, openUp });
  };

  useLayoutEffect(() => {
    if (!isOpen) return;
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (listRef.current?.contains(target)) return;
      setIsOpen(false);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const listRef = useRef<HTMLUListElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="w-full flex items-center justify-between px-4 py-3 card-glass hover:!border-[var(--border-strong)] rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-[var(--info)] transition-all cursor-pointer"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={`block truncate ${!selectedOption ? "text-[var(--text-muted)]" : "text-[var(--text-primary)] font-medium"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-[var(--text-secondary)] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && rect && (
            <motion.ul
              ref={listRef}
              initial={{ opacity: 0, y: rect.openUp ? 6 : -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: rect.openUp ? 6 : -6 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              style={{
                position: "fixed",
                top: rect.openUp ? undefined : rect.top + 8,
                bottom: rect.openUp ? window.innerHeight - rect.top + 8 : undefined,
                left: rect.left,
                width: rect.width,
              }}
              className="z-[200] bg-[var(--surface)] border border-[var(--border-subtle)] rounded-xl shadow-2xl max-h-60 overflow-auto custom-scrollbar focus:outline-none"
              role="listbox"
            >
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between px-4 py-2 cursor-pointer transition-colors ${
                      isSelected ? "bg-[var(--info)]/10 text-[var(--info)]" : "text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]"
                    }`}
                  >
                    <div className="flex flex-col min-w-0">
                      <span className={`block truncate ${isSelected ? "font-bold text-xs" : "font-medium text-xs text-[var(--text-primary)]"}`}>
                        {option.label}
                      </span>
                      {option.subLabel && (
                        <span className="block text-[10px] text-[var(--text-muted)] font-medium mt-0.5">
                          {option.subLabel}
                        </span>
                      )}
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[var(--info)] shrink-0" />}
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
