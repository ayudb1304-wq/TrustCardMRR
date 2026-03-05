import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  fetchTrustCardData,
  TrustMRRError,
} from "@/lib/trustmrr";
import CardPageBody from "@/app/(main)/card/[slug]/CardPageBody";

interface Props {
  params: Promise<{ slug: string }>;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const data = await fetchTrustCardData(slug);

    const ogImage = `/api/og/${encodeURIComponent(slug)}`;
    const description = `${data.name} verified revenue: ${data.mrrFormatted} MRR, ${data.activeSubscriptions} active subscribers. Verified by TrustMRR.`;

    return {
      title: `Verified ${data.mrrFormatted} MRR | Revenue Proof`,
      description,
      alternates: { canonical: `${BASE_URL}/startup/${slug}` },
      openGraph: {
        title: `${data.name} | ${data.mrrFormatted} MRR | Revenue Proof`,
        description: `${data.name} verified revenue, ${data.mrrFormatted} MRR, ${data.growthFormatted} growth. Verified by TrustMRR.`,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: `${data.name} TrustCard | ${data.mrrFormatted} MRR`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${data.name} | ${data.mrrFormatted} MRR | Revenue Proof`,
        description: `${data.name} verified revenue, ${data.mrrFormatted} MRR. Verified by TrustMRR.`,
        images: [ogImage],
      },
    };
  } catch {
    return {
      title: "Startup Not Found | TrustCard",
    };
  }
}

export default async function StartupPage({ params }: Props) {
  const { slug } = await params;

  let data;
  try {
    data = await fetchTrustCardData(slug);
  } catch (err) {
    if (err instanceof TrustMRRError && err.status === 404) {
      notFound();
    }
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200 p-4">
        <div className="card w-full max-w-md bg-base-100 shadow-lg">
          <div className="card-body items-center text-center">
            <h2 className="card-title text-error">Something went wrong</h2>
            <p className="text-base-content/60">
              We couldn&apos;t load data for <strong>{slug}</strong>. Please try
              again later.
            </p>
            <a href="/" className="btn btn-primary btn-sm mt-4">
              Go Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  return (
    <CardPageBody data={data} slug={slug} baseUrl={baseUrl} sharePath="startup" />
  );
}
