import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  fetchTrustCardData,
  TrustMRRError,
  getMetalTier,
} from "@/lib/trustmrr";
import CardPageContent from "./CardPageContent";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const data = await fetchTrustCardData(slug);
    const tier = getMetalTier(data.mrr);

    const ogImage = `/api/og/${encodeURIComponent(slug)}`;
    const description = `${data.name} is a verified ${tier}-tier startup with ${data.mrrFormatted} MRR and ${data.activeSubscriptions} active subscribers. Verified by TrustMRR.`;

    return {
      title: `${data.name} — ${data.mrrFormatted} MRR | TrustCard`,
      description,
      openGraph: {
        title: `${data.name} — ${data.mrrFormatted} MRR`,
        description: `${data.growthFormatted} growth · ${data.activeSubscriptions} subscribers · Verified by TrustMRR`,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: `${data.name} TrustCard — ${data.mrrFormatted} MRR`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${data.name} — ${data.mrrFormatted} MRR`,
        description: `${data.growthFormatted} growth · ${data.activeSubscriptions} subscribers · Verified by TrustMRR`,
        images: [ogImage],
      },
    };
  } catch {
    return {
      title: "Startup Not Found | TrustCard",
    };
  }
}

export default async function CardPage({ params }: Props) {
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
  const shareText = `Just verified my revenue with @TrustMRR! 🚀\n\n${data.mrrFormatted} MRR · ${data.growthFormatted} growth`;
  const shareUrl = `${baseUrl}/card/${slug}`;
  const twitterIntent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 sm:gap-6 bg-base-200 p-4 sm:p-6 w-full max-w-full overflow-x-hidden">
      <div className="w-full flex justify-center min-w-0">
        <CardPageContent data={data} />
      </div>

      <div className="flex flex-col items-center gap-2 text-sm text-base-content/50 text-center">
        <p>
          {data.mrrFormatted} MRR · {data.growthFormatted} growth
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <a
            href={`https://trustmrr.com/startup/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="link link-hover text-xs"
          >
            View on TrustMRR →
          </a>
          <a
            href={twitterIntent}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm gap-1.5 min-h-10 sm:min-h-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share to X
          </a>
        </div>
      </div>

      <a
        href={`${baseUrl}/?utm_source=embed&utm_medium=trustcard&utm_campaign=${slug}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-base-content/30 hover:text-base-content/50 transition-colors"
      >
        Powered by TrustCard · Get yours →
      </a>
    </div>
  );
}
