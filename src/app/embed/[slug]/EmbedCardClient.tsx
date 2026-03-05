"use client";

import TrustCard from "@/components/TrustCard";
import { useResponsiveCardWidth } from "@/hooks/useResponsiveCardWidth";
import type { TrustCardData } from "@/lib/trustmrr";

interface EmbedCardClientProps {
  data: TrustCardData;
}

export default function EmbedCardClient({ data }: EmbedCardClientProps) {
  const cardWidth = useResponsiveCardWidth();
  return <TrustCard data={data} width={cardWidth} />;
}
