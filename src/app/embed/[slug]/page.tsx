import { notFound } from "next/navigation";
import { fetchTrustCardData, TrustMRRError } from "@/lib/trustmrr";
import TrustCard from "@/components/TrustCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EmbedPage({ params }: Props) {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

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
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-transparent p-4">
      <TrustCard data={data} width={400} />

      <div className="flex items-center gap-3 text-xs text-base-content/40">
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
