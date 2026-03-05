import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { fetchTrustCardData, TrustMRRError } from "@/lib/trustmrr";
import { getVerifiedStartup, isDomainAllowed } from "@/lib/startup-db";
import EmbedCardClient from "./EmbedCardClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EmbedPage({ params }: Props) {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  const startupRecord = await getVerifiedStartup(slug);
  if (!startupRecord) {
    return (
      <div className="flex h-screen items-center justify-center bg-transparent">
        <p className="text-sm text-base-content/50">
          This startup has not been claimed. Claim your startup to embed your TrustCard.
        </p>
      </div>
    );
  }

  const headersList = await headers();
  const referer = headersList.get("referer") ?? null;
  if (!isDomainAllowed(startupRecord.allowedDomains, referer)) {
    return (
      <div className="flex h-screen items-center justify-center bg-transparent">
        <p className="text-sm text-base-content/50">
          Embed is not allowed from this domain. Add this site in your TrustCard dashboard.
        </p>
      </div>
    );
  }

  let data;
  try {
    data = await fetchTrustCardData(slug);
  } catch (err) {
    if (err instanceof TrustMRRError && err.status === 404) {
      notFound();
    }
    return (
      <div className="flex h-screen items-center justify-center bg-transparent">
        <p className="text-sm text-base-content/50">
          Could not load TrustCard.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-transparent p-4 w-full max-w-full overflow-x-hidden">
      <div className="w-full flex justify-center min-w-0">
        <EmbedCardClient data={data} />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-base-content/40 text-center">
        <a
          href={`https://trustmrr.com/startup/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-base-content/60 transition-colors"
        >
          View on TrustMRR →
        </a>
        <span className="text-base-content/20">·</span>
        <a
          href={`${baseUrl}/?utm_source=embed&utm_medium=trustcard&utm_campaign=${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-base-content/60 transition-colors"
        >
          Powered by TrustCard
        </a>
      </div>
    </div>
  );
}
