/**
 * Static config for integration hub pages (pSEO).
 * Slug format: hyphenated. Covers platforms (Framer, Webflow, Next.js) and
 * payment providers (Stripe, LemonSqueezy, DodoPayment, Polar, RevenueCat).
 */

export interface IntegrationEntry {
  slug: string;
  platform: string;
  provider: string;
  title: string;
  description: string;
  bodyIntro: string;
}

export const INTEGRATIONS: IntegrationEntry[] = [
  {
    slug: "framer-stripe-badge",
    platform: "Framer",
    provider: "Stripe",
    title: "Stripe MRR Badge for Framer",
    description:
      "Add a Stripe-verified MRR badge to your Framer site. Free TrustCard embed. Convert more visitors with revenue proof they can trust.",
    bodyIntro:
      "Visitors don’t buy until they trust you. A Stripe-verified MRR badge on your Framer site shows real revenue, not a screenshot anyone could fake. Connect Stripe once, embed your TrustCard, and your live MRR and growth appear. That proof turns skeptics into customers.",
  },
  {
    slug: "framer-lemonsqueezy-badge",
    platform: "Framer",
    provider: "LemonSqueezy",
    title: "LemonSqueezy Verified Badge for Framer",
    description:
      "Add a LemonSqueezy-verified revenue badge to your Framer site. Free TrustCard embed. Convert more visitors with verified MRR proof.",
    bodyIntro:
      "Selling via LemonSqueezy? Put verified revenue on your Framer site so visitors trust you before they buy. Verify once, then embed your TrustCard. Your MRR, growth, and LemonSqueezy Verified seal show automatically. Visitors see real proof instead of empty claims, so they’re more likely to convert.",
  },
  {
    slug: "lemonsqueezy-verified-badge",
    platform: "LemonSqueezy",
    provider: "LemonSqueezy",
    title: "LemonSqueezy Verified Badge | Revenue Proof",
    description:
      "LemonSqueezy-verified revenue badge for your site. Free TrustCard embed. Build trust and convert more visitors with verified MRR.",
    bodyIntro:
      "When visitors see “LemonSqueezy Verified” and your real MRR, they stop wondering if you’re legit and start thinking about buying. TrustCard pulls your verified revenue and shows it in one clean badge. Add it to your landing page and let proof do the selling.",
  },
  {
    slug: "dodopayment-verified-badge",
    platform: "DodoPayment",
    provider: "DodoPayment",
    title: "DodoPayment Verified Badge | Revenue Proof",
    description:
      "DodoPayment-verified revenue badge for your site. Free TrustCard embed. Build trust and convert more visitors with verified MRR.",
    bodyIntro:
      "Visitors need a reason to believe you before they pay. A DodoPayment-verified badge with your real MRR gives them that. Verify once, embed your TrustCard, and show live revenue and growth. Trust turns browsers into customers.",
  },
  {
    slug: "polar-verified-badge",
    platform: "Polar",
    provider: "Polar",
    title: "Polar Verified Badge | Revenue Proof",
    description:
      "Polar-verified revenue badge for creators and devs. Free TrustCard embed. Convert more visitors with verified MRR and trust.",
    bodyIntro:
      "Creators and devs using Polar can prove their revenue without saying a word. Verify once, add your TrustCard to your site, and show your MRR and growth with a Polar Verified seal. Real numbers build trust and boost conversions.",
  },
  {
    slug: "revenuecat-verified-badge",
    platform: "RevenueCat",
    provider: "RevenueCat",
    title: "RevenueCat Verified Badge | Revenue Proof",
    description:
      "RevenueCat-verified revenue badge for your app or site. Free TrustCard embed. Build trust with investors and users via verified MRR.",
    bodyIntro:
      "Apps using RevenueCat can put verified subscription revenue front and center. Connect once, embed your TrustCard, and show your MRR and subscriber count with a RevenueCat Verified seal. Proof builds trust with users and investors alike.",
  },
];

const BY_SLUG = new Map(INTEGRATIONS.map((e) => [e.slug, e]));

export function getIntegrationBySlug(slug: string): IntegrationEntry | undefined {
  return BY_SLUG.get(slug);
}

export function getAllIntegrationSlugs(): string[] {
  return INTEGRATIONS.map((e) => e.slug);
}
