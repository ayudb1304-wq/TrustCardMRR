import { fetchTrustCardData } from "@/lib/trustmrr";
import type { TrustCardData } from "@/lib/trustmrr";
import HomeClient from "./HomeClient";

const FEATURED_SLUG = "stan";

async function getFeaturedCard(): Promise<TrustCardData | null> {
  try {
    return await fetchTrustCardData(FEATURED_SLUG);
  } catch {
    return null;
  }
}

export default async function Home() {
  const featuredCard = await getFeaturedCard();

  return <HomeClient featuredCard={featuredCard} />;
}
