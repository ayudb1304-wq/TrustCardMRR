import { NextResponse } from "next/server";
import {
  fetchTrustCardData,
  TrustMRRError,
} from "@/lib/trustmrr";

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
