"use client";

import MetallicBusinessCard from "@/components/ui/metallic-business-card";
import type { TrustCardData } from "@/lib/trustmrr";
import { getMetalTier, formatProvider } from "@/lib/trustmrr";

export interface TrustCardProps {
  data: TrustCardData;
  width?: number;
}

export default function TrustCard({ data, width = 420 }: TrustCardProps) {
  const metal = getMetalTier(data.mrr);
  const provider = formatProvider(data.paymentProvider);

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
      align="left"
      className="font-card"
    />
  );
}
