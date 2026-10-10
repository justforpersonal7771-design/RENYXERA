// Engine for the on-screen GATE scientific calculator. Pure and UI-free so it can be tested.
// Behaves like the official one: type a number FIRST, then press a function key (30, then cos),
// binary keys (+ − × ÷ xʸ ʸ√x mod) build an expression with the usual precedence, "=" evaluates.

export type AngleMode = "deg" | "rad" | "grad";
export type CalcState = {
  entry: string;       // what the main display shows (the number being typed, or the last result)
  tokens: string[];    // pending expression: numbers, operators, "(" and ")"
  fresh: boolean;      // next digit starts a new number
  afterOp: boolean;    // the last key pressed was a binary operator
  mem: number;
  mode: AngleMode;
  error: boolean;
};

export const initialCalc = (mode: AngleMode = "deg"): CalcState => ({ entry: "0", tokens: [], fresh: true, afterOp: false, mem: 0, mode, error: false });

export const BINARY = ["+", "-", "*", "/", "pow", "yroot", "mod", "logy"] as const;
export const UNARY = ["sin", "cos", "tan", "asin", "acos", "atan", "sinh", "cosh", "tanh", "asinh", "acosh", "atanh", "log", "log2", "ln", "pow10", "exp", "sq", "cube", "sqrt", "cbrt", "inv", "abs", "fact", "pct"] as const;
const SYMBOL: Record<string, string> = { "+": "+", "-": "−", "*": "×", "/": "÷", pow: "^", yroot: "ʸ√", mod: "mod", logy: "log_y" };
const PREC: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2, mod: 2, pow: 3, yroot: 3, logy: 3 };

const clean = (n: number) => Number(n.toPrecision(14));
const ERR = "Error";

export function fmt(n: number): string {
  if (!Number.isFinite(n)) return ERR;
  const v = clean(n);
  if (v === 0) return "0";
  const a = Math.abs(v);
  if (a >= 1e15 || a < 1e-9) return v.toExponential(9).replace(/\.?0+e/, "e");
  return String(Number(v.toPrecision(12)));
}

function toRad(x: number, mode: AngleMode) { return mode === "deg" ? (x * Math.PI) / 180 : mode === "grad" ? (x * Math.PI) / 200 : x; }
function fromRad(x: number, mode: AngleMode) { return mode === "deg" ? (x * 180) / Math.PI : mode === "grad" ? (x * 200) / Math.PI : x; }
const tiny = (v: number) => (Math.abs(v) < 1e-12 ? 0 : v); // sin 180° is 0, not 1.2e-16

export function applyUnary(fn: (typeof UNARY)[number], x: number, mode: AngleMode): number {
  switch (fn) {
    case "sin": return tiny(Math.sin(toRad(x, mode)));
    case "cos": return tiny(Math.cos(toRad(x, mode)));
    case "tan": { const c = Math.cos(toRad(x, mode)); return Math.abs(c) < 1e-12 ? NaN : tiny(Math.tan(toRad(x, mode))); }
    case "asin": return Math.abs(x) <= 1 ? fromRad(Math.asin(x), mode) : NaN;
    case "acos": return Math.abs(x) <= 1 ? fromRad(Math.acos(x), mode) : NaN;
    case "atan": return fromRad(Math.atan(x), mode);
    case "sinh": return Math.sinh(x);
    case "cosh": return Math.cosh(x);
    case "tanh": return Math.tanh(x);
    case "asinh": return Math.asinh(x);
    case "acosh": return x >= 1 ? Math.acosh(x) : NaN;
    case "atanh": return Math.abs(x) < 1 ? Math.atanh(x) : NaN;
    case "log": return x > 0 ? Math.log10(x) : NaN;
    case "log2": return x > 0 ? Math.log2(x) : NaN;
    case "ln": return x > 0 ? Math.log(x) : NaN;
    case "pow10": return Math.pow(10, x);
    case "exp": return Math.exp(x);
    case "sq": return x * x;
    case "cube": return x * x * x;
    case "sqrt": return x >= 0 ? Math.sqrt(x) : NaN;
    case "cbrt": return Math.cbrt(x);
    case "inv": return x !== 0 ? 1 / x : NaN;
    case "abs": return Math.abs(x);
    case "fact": { if (!Number.isInteger(x) || x < 0 || x > 170) return NaN; let r = 1; for (let i = 2; i <= x; i++) r *= i; return r; }
    case "pct": return x / 100;
  }
}

function applyBinary(op: string, a: number, b: number): number {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b !== 0 ? a / b : NaN;
    case "mod": return b !== 0 ? a - b * Math.floor(a / b) : NaN;
    case "pow": return Math.pow(a, b);
    // x log_y y: enter x, press the key, enter the base y — log of x to base y.
    case "logy": return a > 0 && b > 0 && b !== 1 ? Math.log(a) / Math.log(b) : NaN;
    case "yroot": return a < 0 && b % 2 !== 0 && Number.isInteger(b) ? -Math.pow(-a, 1 / b) : Math.pow(a, 1 / b);
  }
  return NaN;
}

/** Evaluate a token list (numbers as strings, operators, parentheses) with precedence. */
export function evaluate(tokens: string[]): number {
  const out: number[] = [];
  const ops: string[] = [];
  const reduce = () => { const op = ops.pop()!; const b = out.pop(); const a = out.pop(); if (a === undefined || b === undefined) throw new Error("bad"); out.push(applyBinary(op, a, b)); };
  for (const t of tokens) {
    if (t === "(") ops.push(t);
    else if (t === ")") { while (ops.length && ops[ops.length - 1] !== "(") reduce(); ops.pop(); }
    else if (t in PREC) {
      while (ops.length && ops[ops.length - 1] !== "(" && (PREC[ops[ops.length - 1]] > PREC[t] || (PREC[ops[ops.length - 1]] === PREC[t] && t !== "pow" && t !== "yroot"))) reduce();
      ops.push(t);
    } else out.push(Number(t));
  }
  while (ops.length) { if (ops[ops.length - 1] === "(") { ops.pop(); continue; } reduce(); }
  if (out.length !== 1) throw new Error("bad");
  return out[0];
}

const fail = (s: CalcState): CalcState => ({ ...s, entry: ERR, tokens: [], fresh: true, afterOp: false, error: true });

/** Human-readable pending expression for the small top display. */
export function expressionText(s: CalcState): string {
  return s.tokens.map((t) => SYMBOL[t] ?? t).join(" ");
}

export function press(s: CalcState, key: string): CalcState {
  if (s.error && key !== "C" && key !== "CE") return s;
  const num = () => Number(s.entry);

  if (/^[0-9]$/.test(key)) {
    const entry = s.fresh || s.entry === "0" ? key : s.entry.length >= 16 ? s.entry : s.entry + key;
    return { ...s, entry, fresh: false, afterOp: false };
  }
  switch (key) {
    case ".": return s.fresh ? { ...s, entry: "0.", fresh: false, afterOp: false } : s.entry.includes(".") || /e/i.test(s.entry) ? s : { ...s, entry: s.entry + "." };
    case "EXP": return s.fresh || /e/i.test(s.entry) ? s : { ...s, entry: s.entry + "e" };
    case "±": return s.entry === "0" || s.entry === ERR ? s : { ...s, entry: s.entry.startsWith("-") ? s.entry.slice(1) : "-" + s.entry };
    case "⌫": return s.fresh ? s : { ...s, entry: s.entry.length <= 1 || (s.entry.length === 2 && s.entry.startsWith("-")) ? "0" : s.entry.slice(0, -1) };
    case "C": return { ...initialCalc(s.mode), mem: s.mem };
    case "CE": return { ...s, entry: "0", fresh: true, error: false };
    case "pi": return { ...s, entry: fmt(Math.PI), fresh: true, afterOp: false };
    case "e": return { ...s, entry: fmt(Math.E), fresh: true, afterOp: false };
    case "deg": case "rad": case "grad": return { ...s, mode: key };
    case "MC": return { ...s, mem: 0 };
    case "MR": return { ...s, entry: fmt(s.mem), fresh: true, afterOp: false };
    case "MS": return { ...s, mem: num(), fresh: true };
    case "M+": return { ...s, mem: clean(s.mem + num()), fresh: true };
    case "M-": return { ...s, mem: clean(s.mem - num()), fresh: true };
    case "(": return { ...s, tokens: [...s.tokens, "("], fresh: true, afterOp: true };
    case ")": return s.tokens.filter((t) => t === "(").length > s.tokens.filter((t) => t === ")").length ? { ...s, tokens: [...s.tokens, s.afterOp ? "0" : s.entry, ")"], fresh: true, afterOp: false } : s;
    case "=": {
      if (!s.tokens.length) return s;
      try {
        const r = evaluate([...s.tokens, s.entry]);
        return Number.isFinite(r) ? { ...s, entry: fmt(r), tokens: [], fresh: true, afterOp: false } : fail(s);
      } catch { return fail(s); }
    }
  }
  if ((BINARY as readonly string[]).includes(key)) {
    const last = s.tokens[s.tokens.length - 1];
    if (s.afterOp && last && last in PREC) return { ...s, tokens: [...s.tokens.slice(0, -1), key] };
    const closing = last === ")" && s.afterOp === false && s.fresh;
    return { ...s, tokens: closing ? [...s.tokens, key] : [...s.tokens, s.entry, key], fresh: true, afterOp: true };
  }
  if ((UNARY as readonly string[]).includes(key)) {
    const r = applyUnary(key as (typeof UNARY)[number], num(), s.mode);
    return Number.isFinite(r) ? { ...s, entry: fmt(r), fresh: true, afterOp: false } : fail(s);
  }
  return s;
}
