"use client";

import { useRef, useState } from "react";

/**
 * One-line text that reveals the full value on hover/focus/tap — but only when it is
 * actually cut off. Text that already fits never reacts. Expands in place (wraps) instead
 * of a floating tooltip, so it can't be clipped by a scrolling/overflow-hidden panel.
 */
export function SmartTruncate({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const overflowing = () => !!ref.current && ref.current.scrollWidth > ref.current.clientWidth + 1;
  const show = () => { if (!open && overflowing()) setOpen(true); };
  const hide = () => setOpen(false);
  return (
    <span
      ref={ref}
      tabIndex={0}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onClick={() => (open ? hide() : show())}
      className={`block outline-none transition-[color] ${open ? "whitespace-normal break-words text-indigo-600 dark:text-indigo-300" : "truncate"} ${className}`}
    >
      {text}
    </span>
  );
}
