import Link from "next/link";
import type { Metadata } from "next";
import { INTEGRATIONS } from "@/lib/integrations";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Integrations | TrustCard. Stripe, LemonSqueezy, DodoPayment, Framer",
  description:
    "Add a verified MRR badge to your site. Works with Stripe, LemonSqueezy, DodoPayment, Polar, RevenueCat. Framer, Webflow, Next.js. Free trust badge generator.",
  alternates: { canonical: `${BASE_URL}/integrations` },
};

export default function IntegrationsIndexPage() {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Integrations
        </h1>
        <p className="mt-2 text-base-content/70">
          Add a verified revenue badge to your site. Choose your platform and
          payment provider. Each guide shows you how to embed and convert more visitors.
        </p>

        <ul className="mt-8 space-y-4">
          {INTEGRATIONS.map((entry) => (
            <li key={entry.slug}>
              <Link
                href={`/integrations/${entry.slug}`}
                className="block rounded-xl bg-base-100 p-4 shadow-sm transition hover:shadow-md"
              >
                <span className="font-semibold">
                  {entry.platform === entry.provider
                    ? entry.platform
                    : `${entry.platform} + ${entry.provider}`}
                </span>
                <p className="mt-1 text-sm text-base-content/60">
                  {entry.description.slice(0, 120)}…
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12">
          <Link href="/" className="btn btn-primary">
            Get your TrustCard →
          </Link>
        </div>
      </div>
    </div>
  );
}
