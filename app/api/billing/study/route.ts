import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientKey } from "@/lib/security/rate-limiter";
import { isCrossOriginRequest } from "@/lib/security/origin-check";
import { getVerifiedClaims } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { BILLING_MODE } from "@/lib/billing/plans";
import { isDisposableEmail } from "@/lib/billing/server";
import { activeProvider } from "@/lib/billing/providers";
import { getUserBranch } from "@/lib/server/branch";
import { BUNDLES, PACKS, customPrice, productPacks, studyPlanId } from "@/lib/study/packs";
import { ownedPacks, stepUpCredit, studyValidUntil } from "@/lib/study/server";

export const runtime = "nodejs";

const schema = z.object({
  product: z.string().regex(/^(pack:[a-z]{2,6}|bundle:[a-z0-9]{3,10}|custom:[a-z,]{8,80})$/),
  acceptedTerms: z.literal(true),
});

/** Quote for the signed-in buyer: price after step-up credit, and packs they already own (shown before paying). */
async function quote(db: ReturnType<typeof createServiceRoleClient>, userId: string, product: string) {
  const p = productPacks(product);
  if (!p) return { error: "Unknown study product." } as const;
  const owned = await ownedPacks(db, userId);
  if (p.kind === "pack") {
    if (owned.includes(p.packs[0])) return { error: "You already have this pack." } as const;
    return { p, owned, price: PACKS.find((x) => x.id === p.packs[0])!.pricePaise, credit: 0 } as const;
  }
  if (p.kind === "custom") {
    if (p.packs.some((id) => owned.includes(id))) return { error: "Remove the packs you already own from your bundle." } as const;
    return { p, owned, price: customPrice(p.packs), credit: 0 } as const;
  }
  if (p.packs.every((id) => owned.includes(id))) return { error: "You already have every pack in this bundle." } as const;
  const price = BUNDLES.find((b) => `bundle:${b.id}` === product)!.pricePaise;
  return { p, owned, price, credit: Math.min(price - 100, await stepUpCredit(db, userId, p.packs)) } as const;
}

/** GET ?product=…: the price this account would pay (step-up credit applied) and its owned packs. */
export async function GET(req: NextRequest) {
  const claims = await getVerifiedClaims().catch(() => null);
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  if (!userId) return NextResponse.json({ signedIn: false, owned: [] }, { headers: { "Cache-Control": "no-store" } });
  const db = createServiceRoleClient();
  const product = req.nextUrl.searchParams.get("product");
  if (!product) return NextResponse.json({ signedIn: true, owned: await ownedPacks(db, userId) }, { headers: { "Cache-Control": "no-store" } });
  const q = await quote(db, userId, product);
  if ("error" in q) return NextResponse.json({ signedIn: true, error: q.error }, { status: 409, headers: { "Cache-Control": "no-store" } });
  return NextResponse.json({ signedIn: true, owned: q.owned, pricePaise: q.price, creditPaise: q.credit, amountPaise: Math.max(100, q.price - q.credit) }, { headers: { "Cache-Control": "no-store" } });
}

/**
 * Creates a payment order for a study pack, bundle or build-your-own set (migration 0063). Any signed-in student may buy;
 * study is separate from Plus and Pro. The price always comes from the server-side pack list. Packs are granted by
 * apply_paid_order when the payment is verified (webhook or /api/billing/verify), exactly once per order.
 */
export async function POST(req: NextRequest) {
  if (isCrossOriginRequest(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (BILLING_MODE === "interest") return NextResponse.json({ error: "Payments aren't open yet." }, { status: 409 });
  const provider = activeProvider();
  if (!provider) return NextResponse.json({ error: "Payments aren't configured yet." }, { status: 503 });
  if (!checkRateLimit(`study:ip:${getClientKey(req)}`, { limit: 5, windowMs: 10 * 60_000 }).allowed) {
    return NextResponse.json({ error: "Too many attempts. Please wait a few minutes." }, { status: 429 });
  }
  const claims = await getVerifiedClaims().catch(() => null);
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  if (!userId) return NextResponse.json({ error: "Sign in to buy study packs." }, { status: 401 });
  if (!checkRateLimit(`study:u:${userId}`, { limit: 5, windowMs: 60 * 60_000 }).allowed) {
    return NextResponse.json({ error: "Too many checkout attempts. Please try again later." }, { status: 429 });
  }
  const email = typeof claims?.email === "string" ? claims.email : null;
  if (isDisposableEmail(email)) return NextResponse.json({ error: "Please use a permanent email address." }, { status: 403 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Please accept the terms to continue." }, { status: 400 });

  const db = createServiceRoleClient();
  const q = await quote(db, userId, parsed.data.product);
  if ("error" in q) return NextResponse.json({ error: q.error }, { status: 409 });
  const amount = Math.max(100, q.price - q.credit);
  const planId = studyPlanId(parsed.data.product);
  const branch = await getUserBranch(db, userId);
  const validUntil = await studyValidUntil(db, userId);
  const periodDays = Math.max(1, Math.ceil((Date.parse(validUntil) - Date.now()) / 86400_000));

  const made = await provider.createOrder({ amountPaise: amount, receipt: `s_${userId.slice(0, 8)}_${Date.now()}`, notes: { user_id: userId, plan_id: planId, branch }, customer: { id: userId, email }, returnUrl: `${(process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin)}/study?paid=1` });
  if ("error" in made) return NextResponse.json({ error: made.error }, { status: 502 });
  const { error } = await db.from("billing_orders").insert({
    user_id: userId, plan_id: planId, amount_paise: amount, upgrade_credit_paise: q.credit, period_days: periodDays,
    razorpay_order_id: made.orderId, mode: BILLING_MODE, branch_code: branch, study_packs: q.p.packs, study_valid_until: validUntil,
  });
  if (error) {
    console.error("billing_orders insert (study) failed", error);
    return NextResponse.json({ error: "Couldn't start checkout. Please try again." }, { status: 503 });
  }
  return NextResponse.json({ orderId: made.orderId, amount, currency: "INR", keyId: made.checkout.kind === "razorpay" ? made.checkout.keyId : null, checkout: made.checkout, planName: `Study · ${q.p.name}`, email });
}
