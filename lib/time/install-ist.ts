/**
 * Side-effect module: makes Asia/Kolkata and en-IN the default for Date.toLocaleDateString / toLocaleTimeString / toLocaleString
 * on both the server and the browser. A call that passes its own timeZone (for example "UTC" for a date-only value) keeps it.
 * Imported once by the root layout (server) and the client shell, so shown dates and times can never differ between the two.
 */
import { IST } from "@/lib/time/ist";

type Patched = typeof Date.prototype & { __istPatched?: boolean };
const proto = Date.prototype as Patched;
if (!proto.__istPatched) {
  proto.__istPatched = true;
  for (const name of ["toLocaleDateString", "toLocaleTimeString", "toLocaleString"] as const) {
    const orig = proto[name] as (this: Date, l?: Intl.LocalesArgument, o?: Intl.DateTimeFormatOptions) => string;
    proto[name] = function (this: Date, locales?: Intl.LocalesArgument, options?: Intl.DateTimeFormatOptions) {
      return orig.call(this, locales ?? "en-IN", { timeZone: IST, ...options });
    } as never;
  }
}
