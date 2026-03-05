"use client";

import TrustCard from "@/components/TrustCard";
import { useResponsiveCardWidth } from "@/hooks/useResponsiveCardWidth";
import type { TrustCardData } from "@/lib/trustmrr";

interface CardPageContentProps {
  data: TrustCardData;
}

export default function CardPageContent({ data }: CardPageContentProps) {
  const cardWidth = useResponsiveCardWidth();
  return <TrustCard data={data} width={cardWidth} />;
}
