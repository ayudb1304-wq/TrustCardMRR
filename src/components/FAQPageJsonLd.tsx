/**
 * JSON-LD FAQPage schema for the landing page.
 * Helps capture rich snippets in AI-driven search and Google answer cards.
 */
export function FAQPageJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is TrustCard?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "TrustCard is a free tool that generates embeddable, verified MRR (monthly recurring revenue) badges for founders. You can add a Stripe-verified revenue badge to your landing page to build trust with visitors. It is powered by TrustMRR for revenue verification.",
        },
      },
      {
        "@type": "Question",
        name: "How do I add a revenue badge to my site?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Enter your TrustMRR startup slug on the TrustCard homepage, generate your card, then copy the embed code (iframe or script tag). Paste it anywhere on your site, Framer, Webflow, WordPress, or plain HTML. The badge shows your verified MRR and updates when your revenue data updates on TrustMRR.",
        },
      },
      {
        "@type": "Question",
        name: "What is TrustMRR?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "TrustMRR is a verified startup revenue database. Founders connect their payment provider (Stripe, LemonSqueezy, Polar, etc.) for read-only verification. TrustCard uses TrustMRR's API to display your verified MRR, growth, and subscriber count on your TrustCard badge.",
        },
      },
      {
        "@type": "Question",
        name: "Which payment providers are supported?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "TrustCard supports all payment providers verified by TrustMRR: Stripe, LemonSqueezy, Polar, RevenueCat, and DodoPayment. Your card will show the provider name (e.g. Stripe Verified) and your verified MRR and metrics.",
        },
      },
      {
        "@type": "Question",
        name: "Is TrustCard free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. TrustCard is free to use. You need a TrustMRR account to verify your revenue; once verified, you can generate and embed your TrustCard badge on any site at no cost.",
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
