// ads.txt (6B/6C): declares the authorised ad seller once an ad account exists. Returns 404
// until NEXT_PUBLIC_ADSENSE_CLIENT is set. (Ad networks read it from the domain root, so it
// only helps on an owned domain — see checklist backlog.)
export const dynamic = "force-static";

export function GET() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (!client) return new Response("Not found", { status: 404 });
  const pub = client.replace(/^ca-/, "");
  return new Response(`google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
