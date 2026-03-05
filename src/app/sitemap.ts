import type { MetadataRoute } from "next";
import { listAllStartupSlugs } from "@/lib/trustmrr";
import { getAllIntegrationSlugs } from "@/lib/integrations";
import { getAllLearnSlugs } from "@/lib/learn";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await listAllStartupSlugs();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/integrations`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/learn`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const integrationEntries: MetadataRoute.Sitemap =
    getAllIntegrationSlugs().map((slug) => ({
      url: `${BASE_URL}/integrations/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  const learnEntries: MetadataRoute.Sitemap = getAllLearnSlugs().map((slug) => ({
    url: `${BASE_URL}/learn/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const cardEntries: MetadataRoute.Sitemap = slugs.map((item) => ({
    url: `${BASE_URL}/card/${item.slug}`,
    lastModified:
      item.onSale && item.firstListedForSaleAt
        ? new Date(item.firstListedForSaleAt)
        : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const startupEntries: MetadataRoute.Sitemap = slugs.map((item) => ({
    url: `${BASE_URL}/startup/${item.slug}`,
    lastModified:
      item.onSale && item.firstListedForSaleAt
        ? new Date(item.firstListedForSaleAt)
        : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...integrationEntries, ...learnEntries, ...cardEntries, ...startupEntries];
}
