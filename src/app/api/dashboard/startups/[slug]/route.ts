import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be signed in to update your startup." },
      { status: 401 },
    );
  }

  const { slug } = await params;
  if (!slug?.trim()) {
    return NextResponse.json(
      { error: "Slug is required" },
      { status: 400 },
    );
  }

  const body = await _request.json().catch(() => ({}));
  const raw = (body as { allowedDomains?: unknown }).allowedDomains;
  const allowedDomains = Array.isArray(raw)
    ? (raw as string[]).filter((d) => typeof d === "string" && d.trim().length > 0).map((d) => d.trim())
    : undefined;

  if (allowedDomains === undefined) {
    return NextResponse.json(
      { error: "allowedDomains array is required" },
      { status: 400 },
    );
  }

  const updated = await db.startup.updateMany({
    where: {
      slug: slug.trim().toLowerCase(),
      ownerId: session.user.id,
    },
    data: { allowedDomains },
  });

  if (updated.count === 0) {
    return NextResponse.json(
      { error: "Startup not found or you are not the owner." },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, allowedDomains });
}
