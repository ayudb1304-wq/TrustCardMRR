import { ImageResponse } from "next/og";
import { fetchTrustCardData, getMetalTier, formatProvider, formatGrowth } from "@/lib/trustmrr";
import type { MetalTier } from "@/lib/trustmrr";
import { getVerifiedStartup } from "@/lib/startup-db";
import { db } from "@/lib/db";

export const runtime = "nodejs";

const playwriteNZFont = fetch(
  "https://fonts.gstatic.com/s/playwritenz/v12/d6lakaOxRsyr_zZDmUYvh2TW3NCQVvjKPjPjngAUeRs.ttf",
).then((res) => res.arrayBuffer());

const interFont = fetch(
  "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjQ.ttf",
).then((res) => res.arrayBuffer());

const METAL: Record<
  MetalTier,
  {
    bg: string;
    gradLight: string;
    gradDark: string;
    sheen: string;
    ink: string;
    sub: string;
    border: string;
  }
> = {
  bronze: {
    bg: "#df9070",
    gradLight: "#e8a88a",
    gradDark: "#b06840",
    sheen: "rgba(255,200,165,0.35)",
    ink: "#2a1508",
    sub: "#5c3420",
    border: "rgba(255,255,255,0.25)",
  },
  silver: {
    bg: "#dddde0",
    gradLight: "#eeeeef",
    gradDark: "#b0b0b8",
    sheen: "rgba(255,255,255,0.4)",
    ink: "#1a1a2e",
    sub: "#4a4a5a",
    border: "rgba(255,255,255,0.35)",
  },
  gold: {
    bg: "#ffcc70",
    gradLight: "#ffe0a0",
    gradDark: "#c89830",
    sheen: "rgba(255,235,200,0.4)",
    ink: "#2a1f00",
    sub: "#5c4a10",
    border: "rgba(255,255,255,0.3)",
  },
  platinum: {
    bg: "#f0f0f5",
    gradLight: "#ffffff",
    gradDark: "#c8c8d5",
    sheen: "rgba(255,255,255,0.45)",
    ink: "#0f0f1a",
    sub: "#3a3a50",
    border: "rgba(255,255,255,0.4)",
  },
};

const POKEMON_OG_COLORS: Record<string, { accent: string; label: string; bannerInk: string; hpColor: string }> = {
  fire: { accent: "#ef4444", label: "FIRE", bannerInk: "#1a1a1a", hpColor: "#b91c1c" },
  water: { accent: "#3b82f6", label: "WATER", bannerInk: "#0f172a", hpColor: "#1d4ed8" },
  grass: { accent: "#22c55e", label: "GRASS", bannerInk: "#14532d", hpColor: "#15803d" },
};

function ogMrrPoints(mrrCents: number, growth30d: number | null): number[] {
  const rate = Math.max(-0.5, Math.min(0.5, (growth30d ?? 0) / 100));
  const d = 1 + rate;
  return [
    mrrCents / (d * d * d),
    mrrCents / (d * d),
    mrrCents / d,
    mrrCents,
    mrrCents * d,
    mrrCents * d * d,
  ].map((v) => Math.max(0, v));
}

function ogSparklineSvg(points: number[], accent: string, w: number, h: number): string {
  const px = w * 0.06;
  const pt = h * 0.1;
  const pb = h * 0.22;
  const cw = w - px * 2;
  const ch = h - pt - pb;
  const mn = Math.min(...points);
  const mx = Math.max(...points);
  const rng = mx - mn || 1;

  const coords = points.map((v, i) => ({
    x: Math.round(px + (i / (points.length - 1)) * cw),
    y: Math.round(pt + ch - ((v - mn) / rng) * ch),
  }));

  const actual = coords.slice(0, 4);
  const proj = coords.slice(3);

  const areaD = actual.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ")
    + ` L${actual[3].x} ${pt + ch} L${actual[0].x} ${pt + ch} Z`;
  const lineD = actual.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");
  const projD = proj.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");

  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">`
    + `<defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">`
    + `<stop offset="0%" stop-color="${accent}" stop-opacity="0.3"/>`
    + `<stop offset="100%" stop-color="${accent}" stop-opacity="0.05"/>`
    + `</linearGradient></defs>`
    + `<path d="${areaD}" fill="url(#sg)"/>`
    + `<path d="${lineD}" fill="none" stroke="${accent}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`
    + `<path d="${projD}" fill="none" stroke="${accent}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="8 5" opacity="0.5"/>`
    + `<circle cx="${coords[3].x}" cy="${coords[3].y}" r="4.5" fill="${accent}" stroke="#fff" stroke-width="2"/>`
    + `</svg>`;
}

function renderMetallicOG(
  data: { name: string; mrrFormatted: string; growthFormatted: string; activeSubscriptions: number; icon: string | null },
  m: (typeof METAL)[MetalTier],
  provider: string,
) {
  const CARD_W = 840;
  const CARD_H = Math.round(CARD_W / 1.586);

  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#111",
        fontFamily: "Playwrite NZ, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          position: "relative",
          width: CARD_W,
          height: CARD_H,
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: `0 25px 80px rgba(0,0,0,0.5), 0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 ${m.border}, inset 0 -1px 0 rgba(0,0,0,0.15)`,
          background: `linear-gradient(145deg, ${m.gradLight} 0%, ${m.bg} 40%, ${m.gradDark} 100%)`,
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${m.sheen} 0%, transparent 50%)`,
            borderRadius: 20,
          }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(315deg, rgba(0,0,0,0.2) 0%, transparent 60%)",
            borderRadius: 20,
          }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 12,
            left: 12,
            right: 12,
            bottom: 12,
            borderRadius: 12,
            border: `1px solid rgba(255,255,255,0.12)`,
            background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            padding: "36px 42px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {data.icon ? (
              <img
                src={data.icon}
                width={44}
                height={44}
                style={{ borderRadius: 10, objectFit: "cover", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
              />
            ) : (
              <div style={{ display: "flex", width: 44, height: 44 }} />
            )}
          </div>
          <div style={{ display: "flex", flexGrow: 1 }} />
          <span style={{ fontSize: 38, fontWeight: 800, color: m.ink, lineHeight: 1.15, letterSpacing: "0.01em" }}>
            {data.name}
          </span>
          <span style={{ fontSize: 32, fontWeight: 800, color: m.ink, lineHeight: 1.3, letterSpacing: "0.02em" }}>
            {data.mrrFormatted} MRR
          </span>
          <span
            style={{
              fontSize: 27,
              fontWeight: 700,
              color: m.ink,
              lineHeight: 1.2,
              marginTop: 2,
              textTransform: "uppercase" as const,
              letterSpacing: "0.01em",
            }}
          >
            {data.growthFormatted} growth (30d)
          </span>
          <div style={{ display: "flex", width: "100%", height: 1, background: "rgba(0,0,0,0.12)", marginTop: 18, marginBottom: 14 }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: m.ink, letterSpacing: "0.015em" }}>
                {data.activeSubscriptions} active subscribers
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="12" fill="#16a34a" />
                  <path d="M7 12.5l3 3 7-7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontSize: 16, fontWeight: 700, color: m.ink, letterSpacing: "0.015em" }}>
                  {provider} Verified
                </span>
              </div>
            </div>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "Inter, system-ui, sans-serif",
                color: m.sub,
                letterSpacing: "0.04em",
                textTransform: "uppercase" as const,
                opacity: 0.75,
              }}
            >
              Verified by TrustMRR
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderPokemonOG(
  data: { name: string; mrrFormatted: string; growth30d: number | null; activeSubscriptions: number; icon: string | null; mrr: number },
  pokemonType: string,
  baseUrl: string,
) {
  const typeConfig = POKEMON_OG_COLORS[pokemonType] ?? POKEMON_OG_COLORS.fire;
  const growthStr = formatGrowth(data.growth30d);

  const CARD_W = 420;
  const CARD_H = Math.round(CARD_W * (3.5 / 2.5));

  const points = ogMrrPoints(data.mrr, data.growth30d);
  const chartW = Math.round(CARD_W * 0.85);
  const chartH = Math.round(CARD_H * 0.41);
  const sparkSvg = ogSparklineSvg(points, typeConfig.accent, chartW, chartH);
  const sparkDataUri = `data:image/svg+xml;base64,${Buffer.from(sparkSvg).toString("base64")}`;

  const nameTop = Math.round(CARD_H * 0.06);
  const artTop = Math.round(CARD_H * 0.125);
  const artLeft = Math.round(CARD_W * 0.085);
  const artW = Math.round(CARD_W * 0.83);
  const artH = Math.round(CARD_H * 0.41);
  const statsTop = Math.round(CARD_H * 0.6);
  const statsH = Math.round(CARD_H * 0.19);
  const footerTop = Math.round(CARD_H * 0.87);

  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#111",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          position: "relative",
          width: CARD_W,
          height: CARD_H,
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 25px 80px rgba(0,0,0,0.5), 0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        <img
          src={`${baseUrl}/assets/${pokemonType}card.${pokemonType === "grass" ? "png" : "jpeg"}`}
          width={CARD_W}
          height={CARD_H}
          style={{ position: "absolute", top: 0, left: 0, width: CARD_W, height: CARD_H, objectFit: "cover" }}
        />

        {/* Name banner */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: nameTop,
            left: Math.round(CARD_W * 0.1),
            right: Math.round(CARD_W * 0.06),
            height: Math.round(CARD_H * 0.052),
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 800, color: typeConfig.bannerInk, lineHeight: 1 }}>
            {data.name}
          </span>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 3 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: typeConfig.hpColor, textTransform: "uppercase" as const, letterSpacing: "0.04em", lineHeight: 1 }}>
              HP
            </span>
            <span style={{ fontSize: 16, fontWeight: 800, color: typeConfig.hpColor, lineHeight: 1 }}>
              {data.mrrFormatted}
            </span>
          </div>
        </div>

        {/* Art window: white bg + sparkline chart */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: artTop,
            left: artLeft,
            width: artW,
            height: artH,
            background: "#fff",
            borderRadius: 3,
          }}
        >
          <img
            src={sparkDataUri}
            width={artW}
            height={artH}
            style={{ position: "absolute", top: 0, left: 0, width: artW, height: artH }}
          />
          {/* MRR value overlay bottom-left */}
          <div
            style={{
              display: "flex",
              position: "absolute",
              bottom: 8,
              left: 10,
              alignItems: "baseline",
              gap: 3,
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}>
              {data.mrrFormatted}
            </span>
            <span style={{ fontSize: 10, fontWeight: 600, color: "#888" }}>
              /mo
            </span>
          </div>
          {/* Growth badge bottom-right */}
          <div
            style={{
              display: "flex",
              position: "absolute",
              bottom: 8,
              right: 10,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: (data.growth30d ?? 0) >= 0 ? "#16a34a" : "#dc2626",
                background: (data.growth30d ?? 0) >= 0 ? "#dcfce7" : "#fef2f2",
                padding: "2px 7px",
                borderRadius: 8,
              }}
            >
              {growthStr}
            </span>
          </div>
          {/* MRR Trend label top-right */}
          <span
            style={{
              position: "absolute",
              top: 8,
              right: 10,
              fontSize: 9,
              fontWeight: 700,
              color: "#999",
              textTransform: "uppercase" as const,
              letterSpacing: "0.08em",
            }}
          >
            MRR Trend
          </span>
          {/* Small logo top-left */}
          {data.icon ? (
            <img
              src={data.icon}
              width={28}
              height={28}
              style={{
                position: "absolute",
                top: 8,
                left: 8,
                borderRadius: 6,
                objectFit: "cover",
                boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
              }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                position: "absolute",
                top: 8,
                left: 8,
                width: 28,
                height: 28,
                borderRadius: 6,
                background: typeConfig.accent + "22",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 800,
                color: typeConfig.accent,
              }}
            >
              {data.name.charAt(0)}
            </div>
          )}
        </div>

        {/* Stat block */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            top: statsTop,
            left: Math.round(CARD_W * 0.08),
            right: Math.round(CARD_W * 0.08),
            height: statsH,
            justifyContent: "center",
            padding: "8px 14px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 9, height: 9, borderRadius: 5, background: typeConfig.accent, boxShadow: `0 0 4px ${typeConfig.accent}` }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>
                Growth Blast
              </span>
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a" }}>{growthStr}</span>
          </div>
          <div style={{ display: "flex", width: "100%", height: 1, background: "rgba(0,0,0,0.1)", marginBottom: 7 }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 9, height: 9, borderRadius: 5, background: typeConfig.accent, boxShadow: `0 0 4px ${typeConfig.accent}` }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>
                Sub Summon
              </span>
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a" }}>{data.activeSubscriptions}</span>
          </div>
        </div>

        {/* Footer: retreat zone */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: footerTop,
            left: Math.round(CARD_W * 0.08),
            right: Math.round(CARD_W * 0.08),
            height: Math.round(CARD_H * 0.035),
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#16a34a" />
              <path d="M7 12.5l3 3 7-7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 8, fontWeight: 600, color: "#555", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
              Verified by TrustMRR
            </span>
          </div>
          <span style={{ fontSize: 8, fontWeight: 700, color: "#555", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
            {typeConfig.label}
          </span>
        </div>
      </div>
    </div>
  );
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  if (slug.startsWith("@")) {
    return new ImageResponse(
      (
        <div
          style={{
            width: 1200,
            height: 630,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#111",
            color: "#fff",
            fontSize: 28,
            fontFamily: "system-ui, sans-serif",
            textAlign: "center",
            padding: 48,
          }}
        >
          <span>TrustCard | Founder portfolio cards require Twitter verification.</span>
        </div>
      ),
      { width: 1200, height: 630, status: 403 },
    );
  }

  const startupRecord = await getVerifiedStartup(slug);
  if (!startupRecord) {
    return new ImageResponse(
      (
        <div
          style={{
            width: 1200,
            height: 630,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#111",
            color: "#fff",
            fontSize: 28,
            fontFamily: "system-ui, sans-serif",
            textAlign: "center",
            padding: 48,
          }}
        >
          <span>TrustCard | This startup has not been claimed yet. Claim your startup to get a shareable card.</span>
        </div>
      ),
      { width: 1200, height: 630, status: 403 },
    );
  }

  try {
    const [playwriteData, interData] = await Promise.all([
      playwriteNZFont,
      interFont,
    ]);

    const data = await fetchTrustCardData(slug);

    const dbRecord = await db.startup.findUnique({
      where: { slug: slug.toLowerCase() },
      select: { template: true, pokemonType: true },
    });

    const template = dbRecord?.template ?? "metallic";
    const pokemonType = dbRecord?.pokemonType ?? "fire";

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
      ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const jsx =
      template === "pokemon"
        ? renderPokemonOG(data, pokemonType, baseUrl)
        : renderMetallicOG(
            data,
            METAL[getMetalTier(data.mrr)],
            formatProvider(data.paymentProvider),
          );

    return new ImageResponse(jsx, {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Playwrite NZ", data: playwriteData, style: "normal", weight: 400 },
        { name: "Inter", data: interData, style: "normal", weight: 600 },
      ],
      headers: {
        "Cache-Control":
          "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return new ImageResponse(
      (
        <div
          style={{
            width: 1200,
            height: 630,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#111",
            color: "#fff",
            fontSize: 36,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <span>TrustCard | Startup not found</span>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        status: 404,
      },
    );
  }
}
