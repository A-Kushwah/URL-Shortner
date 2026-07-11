import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { getLinkById } from "@/lib/links";

// Public by design: a short link is already shareable, so its QR code
// doesn't need to be gated behind ownership -- anyone with the slug can
// already visit it.
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const link = getLinkById(id);
  if (!link) return NextResponse.json({ error: "Link not found." }, { status: 404 });

  const shortUrl = `${req.nextUrl.origin}/${link.slug}`;
  const png = await QRCode.toBuffer(shortUrl, {
    width: 480,
    margin: 2,
    color: { dark: "#1B2A20", light: "#F5F7F1" },
  });

  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400",
      "Content-Disposition": `inline; filename="${link.slug}-qr.png"`,
    },
  });
}
