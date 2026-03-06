import { NextResponse } from "next/server";
import {
  fetchTrustCardData,
  TrustMRRError,
} from "@/lib/trustmrr";
import { getVerifiedStartup } from "@/lib/startup-db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json(
      { error: "Slug is required" },
      { status: 400 },
    );
  }

  if (slug.startsWith("@")) {
    return NextResponse.json(
      {
        error:
          "Founder portfolio cards require Twitter verification. Log in and verify your handle from the dashboard.",
      },
      { status: 403 },
    );
  }

  const startupRecord = await getVerifiedStartup(slug);
  if (!startupRecord) {
    return NextResponse.json(
      {
        error:
          "This startup has not been claimed by its owner. Claim your startup to get an embeddable TrustCard.",
      },
      { status: 403 },
    );
  }

  try {
    const data = await fetchTrustCardData(slug);

    return NextResponse.json(
      { data },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (err) {
    if (err instanceof TrustMRRError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.status },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
