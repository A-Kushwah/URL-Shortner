import { NextRequest, NextResponse } from "next/server";
import { getLinkBySlug, recordClick } from "@/lib/links";
import { deviceFromUserAgent, countryFromHeaders, hostFromReferer } from "@/lib/request";

// This is the main redirect path for the app. For this version it just reads
// from SQLite and records a click right away, which keeps the whole project
// simple enough to build and explain.
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const link = getLinkBySlug(slug);

  if (!link || link.disabled) {
    return NextResponse.redirect(new URL(`/gone?slug=${slug}`, req.url), { status: 302 });
  }

  const referer = req.headers.get("referer");
  recordClick(
    link.id,
    hostFromReferer(referer),
    countryFromHeaders(req.headers),
    deviceFromUserAgent(req.headers.get("user-agent"))
  );

  // I used a 302 redirect here so a link can be changed or disabled later
  // without leaving old visitors stuck on a cached destination.
  return NextResponse.redirect(link.destination_url, { status: 302 });
}
