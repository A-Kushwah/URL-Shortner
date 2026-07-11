import { NextRequest, NextResponse } from "next/server";
import { getLinkBySlug, recordClick } from "@/lib/links";
import { deviceFromUserAgent, countryFromHeaders, hostFromReferer } from "@/lib/request";

// This is the hot path. In the target architecture it runs as a Cloudflare
// Worker reading from an edge KV cache in front of Postgres, with click
// events shipped to Kafka for async aggregation. Here it's a single Next.js
// route reading SQLite directly and writing the click inline -- functionally
// equivalent for a demo's traffic, but without the edge cache or async
// ingestion pipeline. See README "Scaling this up."
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

  // 302 rather than the perf-optimal 301 (see architecture doc §5) so that a
  // link edited or disabled later isn't stuck cached in visitors' browsers --
  // the simpler, more forgiving choice for a small-scale MVP.
  return NextResponse.redirect(link.destination_url, { status: 302 });
}
