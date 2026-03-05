import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { fetchStartup, TrustMRRError } from "@/lib/trustmrr";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "You must be signed in to claim a startup." },
      { status: 401 },
    );
  }

  const xHandle = (session.user as { xHandle?: string | null }).xHandle;
  if (!xHandle) {
    return NextResponse.json(
      {
        error:
          "We need your X (Twitter) handle to verify ownership. Sign in with X and try again.",
      },
      { status: 400 },
    );
  }

  const { slug } = await params;
  if (!slug?.trim()) {
    return NextResponse.json(
      { error: "Slug is required" },
      { status: 400 },
    );
  }

  const normalizedSlug = slug.trim().toLowerCase();

  let startupFromApi;
  try {
    startupFromApi = await fetchStartup(normalizedSlug);
  } catch (err) {
    if (err instanceof TrustMRRError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.status },
      );
    }
    return NextResponse.json(
      { error: "Could not load startup from TrustMRR." },
      { status: 502 },
    );
  }

  // TrustMRR can return startup xHandle or cofounders[].xHandle
  const apiXHandle =
    startupFromApi.xHandle ??
    startupFromApi.cofounders?.[0]?.xHandle ??
    null;
  if (!apiXHandle) {
    return NextResponse.json(
      {
        error:
          "This startup has no X handle linked on TrustMRR. We can only verify ownership via X.",
      },
      { status: 400 },
    );
  }

  const userHandle = xHandle.toLowerCase().replace(/^@/, "");
  const apiHandle = apiXHandle.toLowerCase().replace(/^@/, "");
  if (userHandle !== apiHandle) {
    return NextResponse.json(
      {
        error: `Ownership verification failed: your X handle (@${userHandle}) does not match the one linked to this startup on TrustMRR (@${apiHandle}).`,
      },
      { status: 403 },
    );
  }

  await db.startup.upsert({
    where: { slug: normalizedSlug },
    create: {
      slug: normalizedSlug,
      ownerId: session.user.id,
      isVerified: true,
      allowedDomains: [],
    },
    update: {
      ownerId: session.user.id,
      isVerified: true,
    },
  });

  return NextResponse.json(
    { success: true, message: "Startup claimed and verified." },
    { status: 200 },
  );
}
