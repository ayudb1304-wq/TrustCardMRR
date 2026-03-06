import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const VALID_TEMPLATES = ["metallic", "pokemon"] as const;
const VALID_POKEMON_TYPES = ["fire", "water", "grass"] as const;

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

  const body = (await _request.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;

  const data: Record<string, unknown> = {};

  if ("allowedDomains" in body) {
    const raw = body.allowedDomains;
    if (!Array.isArray(raw)) {
      return NextResponse.json(
        { error: "allowedDomains must be an array" },
        { status: 400 },
      );
    }
    data.allowedDomains = (raw as string[])
      .filter((d) => typeof d === "string" && d.trim().length > 0)
      .map((d) => d.trim());
  }

  if ("template" in body) {
    const t = body.template;
    if (
      typeof t !== "string" ||
      !VALID_TEMPLATES.includes(t as (typeof VALID_TEMPLATES)[number])
    ) {
      return NextResponse.json(
        { error: `template must be one of: ${VALID_TEMPLATES.join(", ")}` },
        { status: 400 },
      );
    }
    data.template = t;
  }

  if ("pokemonType" in body) {
    const pt = body.pokemonType;
    if (
      typeof pt !== "string" ||
      !VALID_POKEMON_TYPES.includes(pt as (typeof VALID_POKEMON_TYPES)[number])
    ) {
      return NextResponse.json(
        {
          error: `pokemonType must be one of: ${VALID_POKEMON_TYPES.join(", ")}`,
        },
        { status: 400 },
      );
    }
    data.pokemonType = pt;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 400 },
    );
  }

  const updated = await db.startup.updateMany({
    where: {
      slug: slug.trim().toLowerCase(),
      ownerId: session.user.id,
    },
    data,
  });

  if (updated.count === 0) {
    return NextResponse.json(
      { error: "Startup not found or you are not the owner." },
      { status: 404 },
    );
  }

  return NextResponse.json({ success: true, ...data });
}
