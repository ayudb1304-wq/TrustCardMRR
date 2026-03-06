"use client";

import { useId } from "react";
import Image from "next/image";
import type { TrustCardData, PokemonType } from "@/lib/trustmrr";

export interface PokemonCardProps {
  data: TrustCardData;
  pokemonType?: PokemonType;
  isFounder?: boolean;
  width?: number;
}

const TYPE_CONFIG: Record<
  PokemonType,
  { bg: string; accent: string; label: string; bannerInk: string; hpColor: string }
> = {
  fire: { bg: "/assets/firecard.jpeg", accent: "#ef4444", label: "FIRE", bannerInk: "#1a1a1a", hpColor: "#b91c1c" },
  water: { bg: "/assets/watercard.jpeg", accent: "#3b82f6", label: "WATER", bannerInk: "#0f172a", hpColor: "#1d4ed8" },
  grass: { bg: "/assets/grasscard.png", accent: "#22c55e", label: "GRASS", bannerInk: "#14532d", hpColor: "#15803d" },
};

function generateMrrPoints(mrrCents: number, growth30d: number | null): number[] {
  const rate = (growth30d ?? 0) / 100;
  const clampedRate = Math.max(-0.5, Math.min(0.5, rate));
  const d = 1 + clampedRate;
  return [
    mrrCents / (d * d * d),
    mrrCents / (d * d),
    mrrCents / d,
    mrrCents,
    mrrCents * d,
    mrrCents * d * d,
  ].map((v) => Math.max(0, v));
}

function MrrSparkline({
  points,
  accent,
  svgWidth,
  svgHeight,
  id,
}: {
  points: number[];
  accent: string;
  svgWidth: number;
  svgHeight: number;
  id: string;
}) {
  const padX = svgWidth * 0.08;
  const padTop = svgHeight * 0.12;
  const padBottom = svgHeight * 0.18;
  const chartW = svgWidth - padX * 2;
  const chartH = svgHeight - padTop - padBottom;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const coords = points.map((v, i) => ({
    x: padX + (i / (points.length - 1)) * chartW,
    y: padTop + chartH - ((v - min) / range) * chartH,
  }));

  const actualLine = coords.slice(0, 4);
  const projectedLine = coords.slice(3);

  const actualPath = actualLine.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const projectedPath = projectedLine.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

  const areaPath =
    actualLine.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") +
    ` L${actualLine[actualLine.length - 1].x},${padTop + chartH}` +
    ` L${actualLine[0].x},${padTop + chartH} Z`;

  const gradId = `spark-grad-${id}`;

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <polyline
        points={actualLine.map((p) => `${p.x},${p.y}`).join(" ")}
        fill="none"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points={projectedLine.map((p) => `${p.x},${p.y}`).join(" ")}
        fill="none"
        stroke={accent}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="6 4"
        opacity="0.5"
      />
      {coords[3] && (
        <circle cx={coords[3].x} cy={coords[3].y} r="3.5" fill={accent} stroke="#fff" strokeWidth="1.5" />
      )}
    </svg>
  );
}

export default function PokemonCard({
  data,
  pokemonType = "fire",
  isFounder = false,
  width = 300,
}: PokemonCardProps) {
  const height = Math.round(width * (3.5 / 2.5));
  const config = TYPE_CONFIG[pokemonType];
  const s = width / 300;
  const sparkId = useId().replace(/:/g, "");

  const attack1Label = isFounder ? "Portfolio Synergy" : "Growth Blast";
  const attack2Label = isFounder ? "Empire Growth" : "Sub Summon";
  const attack1Value = data.growthFormatted;
  const attack2Value = `${data.activeSubscriptions}`;

  const mrrPoints = generateMrrPoints(data.mrr, data.growth30d);

  /* Zone positions as % of card height, tuned to sit inside each template zone */
  const nameTop = height * 0.06;
  const nameH = height * 0.052;
  const artTop = height * 0.125;
  const artH = height * 0.41;
  const artLeft = width * 0.085;
  const artW = width * 0.83;
  const statsTop = height * 0.6;
  const statsH = height * 0.19;
  const footerTop = height * 0.87;

  return (
    <div
      className="relative overflow-hidden select-none"
      style={{
        width,
        height,
        borderRadius: 10 * s,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)",
      }}
    >
      <Image
        src={config.bg}
        alt={`${config.label} type card background`}
        fill
        className="object-cover"
        priority
        sizes={`${width}px`}
      />

      {/* ── Name banner ── */}
      <div
        className="absolute flex items-baseline justify-between"
        style={{
          top: nameTop,
          left: width * 0.22,
          right: width * 0.06,
          height: nameH,
        }}
      >
        <div className="flex items-baseline gap-1 min-w-0 flex-1">
          <span
            className="font-extrabold truncate"
            style={{
              fontSize: 11.5 * s,
              color: config.bannerInk,
              lineHeight: 1,
            }}
          >
            {data.name}
          </span>
          {isFounder && (
            <span
              className="shrink-0 rounded-full bg-yellow-400/90 text-black font-bold uppercase"
              style={{
                fontSize: 6 * s,
                padding: `${1 * s}px ${4 * s}px`,
                letterSpacing: "0.05em",
              }}
            >
              Founder
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-0.5 shrink-0">
          <span
            className="font-bold uppercase"
            style={{
              fontSize: 7 * s,
              color: config.hpColor,
              letterSpacing: "0.04em",
              lineHeight: 1,
            }}
          >
            HP
          </span>
          <span
            className="font-extrabold"
            style={{
              fontSize: 11.5 * s,
              color: config.hpColor,
              lineHeight: 1,
            }}
          >
            {data.mrrFormatted}
          </span>
        </div>
      </div>

      {/* ── Art window (12-55% zone): MRR Chart ── */}
      <div
        className="absolute overflow-hidden"
        style={{
          top: artTop,
          left: artLeft,
          width: artW,
          height: artH,
          background: "#fff",
          borderRadius: 2 * s,
        }}
      >
        {/* Small logo in top-left corner */}
        <div
          className="absolute z-10"
          style={{
            top: 6 * s,
            left: 6 * s,
            width: 22 * s,
            height: 22 * s,
            borderRadius: 5 * s,
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
          }}
        >
          {data.icon ? (
            <Image
              src={data.icon}
              alt={`${data.name} logo`}
              fill
              className="object-cover"
              sizes={`${Math.round(22 * s)}px`}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center font-extrabold"
              style={{
                background: config.accent + "22",
                color: config.accent,
                fontSize: 10 * s,
              }}
            >
              {data.name.charAt(0)}
            </div>
          )}
        </div>

        {/* MRR label */}
        <div
          className="absolute z-10"
          style={{
            top: 6 * s,
            right: 8 * s,
          }}
        >
          <span
            className="font-bold uppercase"
            style={{
              fontSize: 7 * s,
              color: "#999",
              letterSpacing: "0.08em",
            }}
          >
            MRR Trend
          </span>
        </div>

        {/* Sparkline fills the art window, bottom padding keeps chart above the bottom frame */}
        <div className="absolute inset-0" style={{ padding: `${22 * s}px ${4 * s}px ${28 * s}px` }}>
          <MrrSparkline
            points={mrrPoints}
            accent={config.accent}
            svgWidth={200}
            svgHeight={120}
            id={sparkId}
          />
        </div>

        {/* Current MRR value overlay */}
        <div
          className="absolute z-10"
          style={{
            bottom: 6 * s,
            left: 8 * s,
          }}
        >
          <span
            className="font-extrabold"
            style={{
              fontSize: 11 * s,
              color: "#1a1a1a",
            }}
          >
            {data.mrrFormatted}
          </span>
          <span
            className="font-semibold"
            style={{
              fontSize: 7 * s,
              color: "#888",
              marginLeft: 3 * s,
            }}
          >
            /mo
          </span>
        </div>

        {/* Growth badge */}
        <div
          className="absolute z-10"
          style={{
            bottom: 6 * s,
            right: 8 * s,
          }}
        >
          <span
            className="font-bold rounded-full"
            style={{
              fontSize: 7.5 * s,
              color: (data.growth30d ?? 0) >= 0 ? "#16a34a" : "#dc2626",
              background: (data.growth30d ?? 0) >= 0 ? "#dcfce7" : "#fef2f2",
              padding: `${1.5 * s}px ${5 * s}px`,
            }}
          >
            {data.growthFormatted}
          </span>
        </div>
      </div>

      {/* ── Stat block (60-82% zone) ── */}
      <div
        className="absolute flex flex-col justify-center"
        style={{
          top: statsTop,
          left: width * 0.08,
          right: width * 0.08,
          height: statsH,
          padding: `${4 * s}px ${10 * s}px`,
        }}
      >
        {/* Attack 1 */}
        <div className="flex items-center justify-between" style={{ marginBottom: 5 * s }}>
          <div className="flex items-center" style={{ gap: 4 * s }}>
            <span
              className="inline-block rounded-full"
              style={{
                width: 7 * s,
                height: 7 * s,
                background: config.accent,
                boxShadow: `0 0 4px ${config.accent}`,
              }}
            />
            <span
              className="font-bold uppercase"
              style={{
                fontSize: 8.5 * s,
                color: "#1a1a1a",
                letterSpacing: "0.05em",
              }}
            >
              {attack1Label}
            </span>
          </div>
          <span
            className="font-extrabold"
            style={{ fontSize: 11 * s, color: "#1a1a1a" }}
          >
            {attack1Value}
          </span>
        </div>

        <div
          style={{
            height: 1,
            background: "rgba(0,0,0,0.1)",
            marginBottom: 5 * s,
          }}
        />

        {/* Attack 2 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center" style={{ gap: 4 * s }}>
            <span
              className="inline-block rounded-full"
              style={{
                width: 7 * s,
                height: 7 * s,
                background: config.accent,
                boxShadow: `0 0 4px ${config.accent}`,
              }}
            />
            <span
              className="font-bold uppercase"
              style={{
                fontSize: 8.5 * s,
                color: "#1a1a1a",
                letterSpacing: "0.05em",
              }}
            >
              {attack2Label}
            </span>
          </div>
          <span
            className="font-extrabold"
            style={{ fontSize: 11 * s, color: "#1a1a1a" }}
          >
            {attack2Value}
          </span>
        </div>
      </div>

      {/* ── Footer (88-93% zone): retreat area ── */}
      <div
        className="absolute flex items-center justify-between"
        style={{
          top: footerTop,
          left: width * 0.08,
          right: width * 0.08,
          height: height * 0.035,
        }}
      >
        <div className="flex items-center" style={{ gap: 2 * s }}>
          <svg
            width={8 * s}
            height={8 * s}
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
            className="font-semibold uppercase"
            style={{
              fontSize: 6 * s,
              color: "#555",
              letterSpacing: "0.06em",
            }}
          >
            Verified by TrustMRR
          </span>
        </div>
        <span
          className="font-bold uppercase"
          style={{
            fontSize: 6 * s,
            color: "#555",
            letterSpacing: "0.06em",
          }}
        >
          {config.label}
        </span>
      </div>
    </div>
  );
}
