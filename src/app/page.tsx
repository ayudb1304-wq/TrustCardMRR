import { fetchTrustCardData } from "@/lib/trustmrr";
import type { TrustCardData } from "@/lib/trustmrr";
import HomeClient from "./HomeClient";
import { FAQPageJsonLd } from "@/components/FAQPageJsonLd";

const FEATURED_SLUG = "stan";

async function getFeaturedCard(): Promise<TrustCardData | null> {
  try {
    return await fetchTrustCardData(FEATURED_SLUG);
  } catch {
    return null;
  }
}

interface Props {
  searchParams: Promise<{ slug?: string }>;
}

export default async function Home({ searchParams }: Props) {
  const { slug: slugParam } = await searchParams;
  const featuredCard = await getFeaturedCard();

  return (
    <>
      <FAQPageJsonLd />
      <HomeClient featuredCard={featuredCard} initialSlug={slugParam?.trim().toLowerCase() ?? ""} />
    </>
  );
}
