import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkUrlSafety } from "@/lib/urlSafety";
import { generateUniqueSlug } from "@/lib/slug";
import { createLink } from "@/lib/links";
import { getCurrentUser } from "@/lib/auth";
import { isRateLimited } from "@/lib/rateLimit";

const schema = z.object({
  url: z.string().min(1, "Paste a URL to shorten."),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (isRateLimited(`shorten:${ip}`)) {
    return NextResponse.json(
      { error: "Too many links created from this IP. Try again in a minute." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input." }, { status: 400 });
  }

  const safety = checkUrlSafety(parsed.data.url);
  if (!safety.ok) {
    return NextResponse.json({ error: safety.reason }, { status: 400 });
  }

  const user = await getCurrentUser();
  const slug = generateUniqueSlug();
  const link = createLink(slug, safety.normalized!, user?.id ?? null);

  const origin = req.nextUrl.origin;
  return NextResponse.json({
    id: link.id,
    slug: link.slug,
    shortUrl: `${origin}/${link.slug}`,
    destinationUrl: link.destination_url,
    createdAt: link.created_at,
  });
}
