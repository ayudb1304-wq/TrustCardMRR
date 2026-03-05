import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be signed in to view your startups." },
      { status: 401 },
    );
  }

  const startups = await db.startup.findMany({
    where: { ownerId: session.user.id },
    select: { slug: true, allowedDomains: true, isVerified: true },
    orderBy: { slug: "asc" },
  });

  return NextResponse.json({ startups });
}
