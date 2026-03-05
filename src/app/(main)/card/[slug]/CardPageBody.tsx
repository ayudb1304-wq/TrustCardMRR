import type { TrustCardData } from "@/lib/trustmrr";
import CardPageContent from "./CardPageContent";
import { WebPageJsonLd } from "@/components/WebPageJsonLd";
import { OgImagePreload } from "@/components/OgImagePreload";

interface CardPageBodyProps {
  data: TrustCardData;
  slug: string;
  baseUrl: string;
  /** Use 'startup' for share URL so canonical/SEO uses /startup/[slug] */
  sharePath: "card" | "startup";
}

export default function CardPageBody({
  data,
  slug,
  baseUrl,
  sharePath,
}: CardPageBodyProps) {
  const shareBaseUrl = "https://trustcardmrr.com";
  const shareUrl = `${shareBaseUrl}/${sharePath}/${slug}`;
  const shareText = `Just verified my revenue with TrustCard! 🚀\n\n${data.mrrFormatted} MRR · ${data.growthFormatted} growth`;
  const twitterIntent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 sm:gap-6 bg-base-200 p-4 sm:p-6 w-full max-w-full overflow-x-hidden">
      <WebPageJsonLd data={data} slug={slug} baseUrl={baseUrl} pagePath={sharePath} />
      <OgImagePreload url={`${baseUrl}/api/og/${encodeURIComponent(slug)}`} />
      <div className="w-full flex justify-center min-w-0">
        <CardPageContent data={data} />
      </div>

      <div className="flex flex-col items-center gap-2 text-sm text-base-content/50 text-center">
        <p>
          {data.mrrFormatted} MRR · {data.growthFormatted} growth
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <a
            href={`${baseUrl}/claim?slug=${encodeURIComponent(slug)}`}
            className="btn btn-sm btn-outline gap-1.5 min-h-10 sm:min-h-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            This is mine — Claim & verify
          </a>
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
