import Link from "next/link";
import type { Metadata } from "next";
import {
  getIntegrationBySlug,
  getAllIntegrationSlugs,
} from "@/lib/integrations";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllIntegrationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const integration = getIntegrationBySlug(slug);
  if (!integration) {
    return { title: "Integration Not Found | TrustCard" };
  }
  return {
    title: `${integration.title} | TrustCard`,
    description: integration.description,
    openGraph: {
      title: `${integration.title} | TrustCard`,
      description: integration.description,
      url: `${BASE_URL}/integrations/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${integration.title} | TrustCard`,
      description: integration.description,
    },
    alternates: { canonical: `${BASE_URL}/integrations/${slug}` },
  };
}

export default async function IntegrationPage({ params }: Props) {
  const { slug } = await params;
  const integration = getIntegrationBySlug(slug);

  if (!integration) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200 p-4">
        <div className="card w-full max-w-md bg-base-100 shadow-lg">
          <div className="card-body items-center text-center">
            <h2 className="card-title">Integration not found</h2>
            <p className="text-base-content/60">
              We don&apos;t have a guide for <strong>{slug}</strong> yet.
            </p>
            <Link href="/integrations" className="btn btn-primary btn-sm mt-4">
              Browse integrations
            </Link>
            <Link href="/" className="btn btn-ghost btn-sm">
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-base-content/50 hover:text-base-content"
          >
            ← TrustCard
          </Link>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {integration.title}
        </h1>
        <p className="mt-2 text-base-content/70">{integration.description}</p>

        <div className="mt-8 rounded-xl bg-base-100 p-6 shadow-sm">
          <p className="text-base-content/80">{integration.bodyIntro}</p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary">
            Get your TrustCard →
          </Link>
          <p className="self-center text-sm text-base-content/60">
            Verify once, embed anywhere. Convert more visitors with proof they can trust.
          </p>
        </div>

        <div className="mt-12 border-t border-base-300 pt-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-base-content/50">
            Other integrations
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {getAllIntegrationSlugs()
              .filter((s) => s !== slug)
              .map((s) => {
                const entry = getIntegrationBySlug(s);
                return entry ? (
                  <li key={s}>
                    <Link
                      href={`/integrations/${s}`}
                      className="link link-hover text-sm"
                    >
                      {entry.platform === entry.provider
                        ? entry.platform
                        : `${entry.platform} + ${entry.provider}`}
                    </Link>
                  </li>
                ) : null;
              })}
          </ul>
        </div>
      </div>
    </div>
  );
}
