import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { fetchTrustCardData } from "@/lib/trustmrr";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be signed in to view stats." },
      { status: 401 },
    );
  }

  const startups = await db.startup.findMany({
    where: { ownerId: session.user.id },
    select: { slug: true },
    orderBy: { slug: "asc" },
  });

  const cardCount = startups.length;

  if (cardCount === 0) {
    return NextResponse.json({
      cardCount: 0,
      totalMrrCents: 0,
      totalMrrFormatted: "—",
    });
  }

  const results = await Promise.allSettled(
    startups.map((s) => fetchTrustCardData(s.slug)),
  );

  let totalMrrCents = 0;
  for (const r of results) {
    if (r.status === "fulfilled" && r.value?.mrr != null) {
      totalMrrCents += r.value.mrr;
    }
  }

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const totalMrrFormatted =
    totalMrrCents > 0 ? formatter.format(totalMrrCents / 100) : "—";

  return NextResponse.json({
    cardCount,
    totalMrrCents,
    totalMrrFormatted,
  });
}
