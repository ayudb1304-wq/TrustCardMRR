/**
 * JSON-LD structured data for Organization and SoftwareApplication.
 * Rendered in root layout for all pages.
 */
export function OrganizationAndAppJsonLd() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://trustcard.vercel.app";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "TrustCard",
        url: baseUrl,
        logo: `${baseUrl}/icon.svg`,
        description:
          "TrustCard provides embeddable, verified MRR badges for founders. Generate Stripe-verified revenue cards for your landing page. Powered by TrustMRR.",
      },
      {
        "@type": "SoftwareApplication",
        name: "TrustCard",
        applicationCategory: "DeveloperApplication",
        description:
          "Generate embeddable, verified MRR badges for your landing page. Free Stripe revenue badge and trust seal for SaaS. Powered by TrustMRR.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        author: {
          "@type": "Organization",
          name: "TrustCard",
          url: baseUrl,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
