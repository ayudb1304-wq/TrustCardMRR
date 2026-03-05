import { ImageResponse } from "next/og";
import { fetchTrustCardData, getMetalTier, formatProvider } from "@/lib/trustmrr";
import type { MetalTier } from "@/lib/trustmrr";

export const runtime = "edge";

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


export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const [playwriteData, interData] = await Promise.all([
      playwriteNZFont,
      interFont,
    ]);

    const data = await fetchTrustCardData(slug);
    const metal = getMetalTier(data.mrr);
    const provider = formatProvider(data.paymentProvider);
    const m = METAL[metal];

    const CARD_W = 840;
    const CARD_H = Math.round(CARD_W / 1.586);

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
            fontFamily: "Playwrite NZ, system-ui, sans-serif",
          }}
        >
          {/* Card outer: simulates metallic surface with layered gradients */}
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
            {/* Sheen overlay: top-left highlight to simulate light reflection */}
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

            {/* Dark vignette: bottom-right to add depth */}
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

            {/* Inner glass panel */}
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

            {/* Content layer */}
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
              {/* Logo: top right */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                {data.icon ? (
                  <img
                    src={data.icon}
                    width={44}
                    height={44}
                    style={{
                      borderRadius: 10,
                      objectFit: "cover",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                    }}
                  />
                ) : (
                  <div style={{ display: "flex", width: 44, height: 44 }} />
                )}
              </div>

              {/* Spacer pushes text block to bottom */}
              <div style={{ display: "flex", flexGrow: 1 }} />

              {/* Name */}
              <span
                style={{
                  fontSize: 38,
                  fontWeight: 800,
                  color: m.ink,
                  lineHeight: 1.15,
                  letterSpacing: "0.01em",
                }}
              >
                {data.name}
              </span>

              {/* MRR: the hero number */}
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: m.ink,
                  lineHeight: 1.3,
                  letterSpacing: "0.02em",
                }}
              >
                {data.mrrFormatted} MRR
              </span>

              {/* Growth */}
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

              {/* Divider line */}
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  height: 1,
                  background: "rgba(0,0,0,0.12)",
                  marginTop: 18,
                  marginBottom: 14,
                }}
              />

              {/* Bottom row: subs, provider, verified */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                  }}
                >
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: m.ink,
                      letterSpacing: "0.015em",
                    }}
                  >
                    {data.activeSubscriptions} active subscribers
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle cx="12" cy="12" r="12" fill="#16a34a" />
                      <path
                        d="M7 12.5l3 3 7-7"
                        stroke="#fff"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: m.ink,
                        letterSpacing: "0.015em",
                      }}
                    >
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
      ),
      {
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
      },
    );
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
