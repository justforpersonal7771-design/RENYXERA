/**
 * Friendly wording for Supabase Auth errors and our own field checks, used by the
 * sign-in, sign-up and reset forms (which use `noValidate`, so the browser's built-in
 * bubbles never appear).
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function emailProblem(email: string): string | null {
  if (!email.trim()) return "Enter your email address.";
  if (!EMAIL_RE.test(email.trim())) return "That doesn't look like an email address.";
  return null;
}

export function passwordProblem(password: string, forNewPassword = false): string | null {
  if (!password) return "Enter your password.";
  if (forNewPassword) {
    const missing = PASSWORD_RULES.filter((r) => !r.test(password)).map((r) => r.label.toLowerCase());
    if (missing.length) return `Password needs ${missing.join(", ")}.`;
  }
  return null;
}

/** New-password rules (sign-up and password change). Shown as a live checklist. */
export const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "An uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "A lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "A number", test: (p: string) => /[0-9]/.test(p) },
  { label: "A special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("rate limit") && m.includes("email"))
    return "We can't send more emails right now — our email service has an hourly limit. Please try again in a little while, or continue with Google.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Too many attempts. Please wait a minute and try again.";
  if (m.includes("invalid login credentials")) return "Email or password is incorrect.";
  if (m.includes("email not confirmed")) return "Please confirm your email first — check your inbox for the link.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "An account with this email already exists. Try signing in instead.";
  if (m.includes("captcha")) return "The security check expired. Please wait for \"Verified\" and try again.";
  if (m.includes("password should be at least")) return "Use at least 8 characters for your password.";
  return message;
}
