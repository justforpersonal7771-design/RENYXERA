/**
 * A headline whose words rise in one after another: the "hero reveal" of the MadeToScale guide, done with CSS only.
 * The words are in the HTML from the first byte (search engines and slow phones see them at once), the whole thing is
 * under 1 s for a short line, it plays once on load, and html[data-motion="reduce"] / prefers-reduced-motion show it instantly.
 */
import { Fragment, type CSSProperties } from "react";

export function WordReveal({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`word-reveal${className ? ` ${className}` : ""}`}>
      {text.split(" ").map((w, i) => (
        <Fragment key={i}>
          <span style={{ "--i": i } as CSSProperties}>{w}</span>{" "}
        </Fragment>
      ))}
    </span>
  );
}
