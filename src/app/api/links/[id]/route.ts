import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { checkUrlSafety } from "@/lib/urlSafety";
import {
  getLinkById,
  updateLinkDestination,
  setLinkDisabled,
  getTotalClicks,
  getClicksByDay,
  getTopReferrers,
  getTopCountries,
  getDeviceBreakdown,
} from "@/lib/links";

async function requireOwnedLink(id: string) {
  const user = await getCurrentUser();
  if (!user) return { error: NextResponse.json({ error: "Sign in required." }, { status: 401 }) };

  const link = getLinkById(id);
  if (!link || link.owner_id !== user.id) {
    return { error: NextResponse.json({ error: "Link not found." }, { status: 404 }) };
  }
  return { link, user };
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await requireOwnedLink(id);
  if (result.error) return result.error;
  const { link } = result;

  return NextResponse.json({
    link,
    analytics: {
      totalClicks: getTotalClicks(link.id),
      clicksByDay: getClicksByDay(link.id, 30),
      topReferrers: getTopReferrers(link.id),
      topCountries: getTopCountries(link.id),
      deviceBreakdown: getDeviceBreakdown(link.id),
    },
  });
}

const patchSchema = z.object({
  destinationUrl: z.string().min(1),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await requireOwnedLink(id);
  if (result.error) return result.error;

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "A destination URL is required." }, { status: 400 });
  }

  const safety = checkUrlSafety(parsed.data.destinationUrl);
  if (!safety.ok) {
    return NextResponse.json({ error: safety.reason }, { status: 400 });
  }

  updateLinkDestination(id, safety.normalized!);
  return NextResponse.json({ link: getLinkById(id) });
}

const patchStateSchema = z.object({
  disabled: z.boolean(),
});

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await requireOwnedLink(id);
  if (result.error) return result.error;

  // Soft-delete: DELETE toggles the link to disabled rather than removing
  // the row, so click history and the ability to re-enable are preserved.
  let disabled = true;
  const body = await req.json().catch(() => null);
  const parsed = patchStateSchema.safeParse(body);
  if (parsed.success) disabled = parsed.data.disabled;

  setLinkDisabled(id, disabled);
  return NextResponse.json({ link: getLinkById(id) });
}
