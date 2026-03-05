import type { TrustCardData } from "@/lib/trustmrr";

interface WebPageJsonLdProps {
  data: TrustCardData;
  slug: string;
  baseUrl: string;
  /** 'card' or 'startup' for the page URL in schema */
  pagePath?: "card" | "startup";
}

/**
 * JSON-LD WebPage schema for a startup TrustCard page.
 * Helps search engines understand the page content and image.
 */
export function WebPageJsonLd({ data, slug, baseUrl, pagePath = "card" }: WebPageJsonLdProps) {
  const pageUrl = `${baseUrl}/${pagePath}/${slug}`;
  const imageUrl = `${baseUrl}/api/og/${encodeURIComponent(slug)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${data.name} | ${data.mrrFormatted} MRR | Revenue Proof`,
    description: `${data.name} verified revenue: ${data.mrrFormatted} MRR, ${data.activeSubscriptions} active subscribers. Verified by TrustMRR.`,
    url: pageUrl,
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: imageUrl,
      width: 1200,
      height: 630,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
