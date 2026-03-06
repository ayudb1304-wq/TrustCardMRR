"use client";

import { useState } from "react";
import MetallicBusinessCard from "@/components/ui/metallic-business-card";
import PokemonCard from "@/components/ui/pokemon-card";
import type { TrustCardData, PokemonType } from "@/lib/trustmrr";
import { getMetalTier, formatProvider } from "@/lib/trustmrr";

export interface TrustCardProps {
  data: TrustCardData;
  width?: number;
  template?: "metallic" | "pokemon";
  pokemonType?: PokemonType;
}

const RAMEN_THRESHOLD_CENTS = 200_000; // $2,000

function RamenBadge({ tweetHref }: { tweetHref: string }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="group relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <a
        href={tweetHref}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex animate-ramen-glow rounded-full"
        aria-label="Share Ramen Profitability achievement on X"
      >
        <span className="text-3xl leading-none select-none transition-transform group-hover:scale-110">
          🍜
        </span>
      </a>
      {hover && (
        <span className="absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded-lg border border-white/20 bg-black/80 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md shadow-lg shadow-orange-500/15">
          Share on 𝕏
        </span>
      )}
    </div>
  );
}

export default function TrustCard({
  data,
  width = 420,
  template = "metallic",
  pokemonType = "fire",
}: TrustCardProps) {
  if (template === "pokemon") {
    return (
      <PokemonCard
        data={data}
        pokemonType={pokemonType}
        isFounder={data.isFounder}
        width={width}
      />
    );
  }

  const metal = getMetalTier(data.mrr);
  const provider = formatProvider(data.paymentProvider);
  const isRamen = data.mrr >= RAMEN_THRESHOLD_CENTS;

  const shareText = `Just hit Ramen Profitability! 🍜\n\n${data.mrrFormatted} MRR · ${data.growthFormatted} growth\n\nVerified by @TrustMRR`;
  const shareUrl = `https://trustcardmrr.com/startup/${data.slug}`;
  const tweetHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <MetallicBusinessCard
      metal={metal}
      width={width}
      name={data.name}
      role={`${data.mrrFormatted} MRR`}
      company={`${data.growthFormatted} growth (30d)`}
      email={`${data.activeSubscriptions} active subscribers`}
      phone={`${provider} Verified ✓`}
      website="Verified by TrustMRR"
      logoSrc={data.icon ?? undefined}
      logoAlt={`${data.name} logo`}
      badge={isRamen ? <RamenBadge tweetHref={tweetHref} /> : undefined}
      align="left"
      className="font-card"
    />
  );
}
