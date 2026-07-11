import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { listLinksForOwner } from "@/lib/links";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const links = listLinksForOwner(user.id);
  return NextResponse.json({ links });
}
