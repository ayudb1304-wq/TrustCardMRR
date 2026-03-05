/**
 * Learn section: emotion-driven, conversion-focused content.
 * Sells TrustCard (trust, conversion) and is SEO-optimised.
 */

export interface LearnEntry {
  slug: string;
  title: string;
  description: string;
  content: string;
}

export const LEARN_PAGES: LearnEntry[] = [
  {
    slug: "why-verified-revenue-converts-visitors",
    title: "Why Verified Revenue Converts More Visitors Into Customers",
    description:
      "Visitors don't buy until they trust you. Learn why a verified MRR badge on your landing page increases conversions and how to add one in minutes.",
    content: `Your landing page has one job: turn visitors into customers. But most visitors leave because they don't trust you yet. They're thinking: "Is this real? Will I get value? Is this just another side project that'll disappear?"

Verified revenue changes that conversation. When you show your real MRR, verified by a third party and displayed in a TrustCard badge, visitors stop doubting and start considering. They see proof. They think: "This founder is transparent. This product is real. Others are paying."

That shift from skepticism to trust is what converts. No amount of copy or testimonials does it quite like a live, verified number that says "we're doing $X in MRR and here's the proof."

TrustCard lets you add that proof in minutes. Verify your revenue once (Stripe, LemonSqueezy, DodoPayment, Polar, or RevenueCat), then embed your badge anywhere: Framer, Webflow, your Next.js site. Your MRR and growth update automatically. No code to maintain. Just trust, working for you.`,
  },
  {
    slug: "why-visitors-dont-trust-unverified-screenshots",
    title: "Why Visitors Don't Trust Unverified Screenshots (And What to Use Instead)",
    description:
      "Unverified revenue screenshots hurt conversion. Learn why visitors ignore them and how a verified MRR badge builds trust and increases sales.",
    content: `A screenshot of your "revenue" or "MRR" is worthless to a skeptical visitor. Everyone knows screenshots can be faked. A few minutes in Figma or DevTools and anyone can show $50K MRR. So when visitors see an unverified number on your site, they don't think "impressive". They think "maybe fake." And that doubt kills conversion.

Verified revenue is different. When your MRR is verified by a platform that connects read-only to your payment provider (Stripe, LemonSqueezy, etc.), there's no room for doubt. A badge that says "Stripe Verified" or "LemonSqueezy Verified" next to your MRR tells visitors: a third party has confirmed this. It's real.

That's why founders who display verified revenue, via TrustCard or similar, see a real impact on conversion. Visitors stop asking "Is this real?" and start asking "Should I buy?" The badge does the trust work for you.

Add a verified revenue badge to your site in minutes. Connect your provider, grab your TrustCard embed code, and paste it on your landing page. Your live MRR and provider seal do the rest.`,
  },
  {
    slug: "what-is-mrr-and-why-show-it-on-your-site",
    title: "What Is MRR? And Why Showing It on Your Site Helps You Convert",
    description:
      "MRR (monthly recurring revenue) explained. Why displaying verified MRR on your landing page builds trust and converts more visitors. Free TrustCard embed.",
    content: `MRR stands for monthly recurring revenue: the predictable income your business earns each month from subscriptions. If you have 20 customers each paying $50/month, your MRR is $1,000. It's the number investors, acquirers, and serious customers care about.

But here's what most founders miss: MRR isn't just a metric to track. It's a conversion tool. When you show your MRR on your landing page, you're not bragging. You're answering the visitor's silent question: "Is this product real? Are people actually paying?" A live, verified MRR number says yes. It builds trust in seconds.

The catch: the number has to be verified. A random "We're at $10K MRR" with no proof is as convincing as a screenshot. Visitors have seen it all. What works is verification: your payment provider (Stripe, LemonSqueezy, DodoPayment, Polar, or RevenueCat) connected read-only to a verification platform, which then attests to your number. When you display that in a badge, e.g. with TrustCard, visitors see proof, not claims.

If you're already sharing revenue in public, put it on your site. Verify once, embed your TrustCard, and let your MRR turn skeptics into customers.`,
  },
];

const BY_SLUG = new Map(LEARN_PAGES.map((e) => [e.slug, e]));

export function getLearnBySlug(slug: string): LearnEntry | undefined {
  return BY_SLUG.get(slug);
}

export function getAllLearnSlugs(): string[] {
  return LEARN_PAGES.map((e) => e.slug);
}
