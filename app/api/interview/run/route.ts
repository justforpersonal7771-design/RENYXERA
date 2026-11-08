import { NextRequest, NextResponse } from "next/server";
import { interviewAccess } from "@/lib/server/interview";
import { checkRateLimit } from "@/lib/security/rate-limiter";

export const runtime = "nodejs";
// Free public compiler (wandbox.org). Code runs on their sandbox, never on our server.
const COMPILERS: Record<string, { compiler: string; options?: string }> = {
  cpp: { compiler: "gcc-13.2.0", options: "c++17" },
  csharp: { compiler: "mono-6.12.0.199" },
  python: { compiler: "cpython-3.14.0" },
  javascript: { compiler: "nodejs-20.17.0" },
  typescript: { compiler: "typescript-5.6.2" },
  sql: { compiler: "sqlite-3.46.1" },
};

export async function POST(req: NextRequest) {
  const { ok, userId } = await interviewAccess();
  if (!ok || !userId) return new NextResponse(null, { status: 404 });
  const rl = checkRateLimit(`iv-run:${userId}`, { limit: 20, windowMs: 60_000 }) as unknown as { allowed?: boolean; ok?: boolean };
  if (rl.allowed === false || rl.ok === false) return NextResponse.json({ error: "Slow down: 20 runs a minute." }, { status: 429 });
  const b = (await req.json().catch(() => null)) as { lang?: string; code?: string; stdin?: string } | null;
  const c = b?.lang ? COMPILERS[b.lang] : undefined;
  if (!c || typeof b?.code !== "string" || b.code.length > 30_000) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  try {
    const r = await fetch("https://wandbox.org/api/compile.json", {
      method: "POST", headers: { "Content-Type": "application/json" }, signal: AbortSignal.timeout(25_000),
      body: JSON.stringify({ compiler: c.compiler, code: b.code, options: c.options ?? "", stdin: String(b.stdin ?? "").slice(0, 5000) }),
    });
    if (!r.ok) return NextResponse.json({ error: "The compiler service is busy. Try again in a moment." }, { status: 502 });
    const d = (await r.json()) as { status?: string; compiler_error?: string; program_output?: string; program_error?: string };
    return NextResponse.json({ exit: Number(d.status ?? 0), compileError: (d.compiler_error ?? "").slice(0, 6000), stdout: (d.program_output ?? "").slice(0, 20000), stderr: (d.program_error ?? "").slice(0, 6000) }, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "The compiler service did not answer. Try again." }, { status: 504 }); }
}
