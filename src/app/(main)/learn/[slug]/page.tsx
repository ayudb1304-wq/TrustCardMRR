import Link from "next/link";
import type { Metadata } from "next";
import { getLearnBySlug, getAllLearnSlugs } from "@/lib/learn";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllLearnSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getLearnBySlug(slug);
  if (!entry) {
    return { title: "Not Found | TrustCard" };
  }
  return {
    title: `${entry.title} | TrustCard`,
    description: entry.description,
    openGraph: {
      title: `${entry.title} | TrustCard`,
      description: entry.description,
      url: `${BASE_URL}/learn/${slug}`,
    },
    twitter: {
      card: "summary",
      title: `${entry.title} | TrustCard`,
      description: entry.description,
    },
    alternates: { canonical: `${BASE_URL}/learn/${slug}` },
  };
}

export default async function LearnPage({ params }: Props) {
  const { slug } = await params;
  const entry = getLearnBySlug(slug);

  if (!entry) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200 p-4">
        <div className="card w-full max-w-md bg-base-100 shadow-lg">
          <div className="card-body items-center text-center">
            <h2 className="card-title">Article not found</h2>
            <Link href="/learn" className="btn btn-primary btn-sm mt-4">
              Browse articles
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
      <article className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
        <div className="mb-8">
          <Link
            href="/learn"
            className="text-sm text-base-content/50 hover:text-base-content"
          >
            ← Learn
          </Link>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {entry.title}
        </h1>
        <p className="mt-2 text-base-content/70">{entry.description}</p>

        <div className="mt-8 whitespace-pre-line rounded-xl bg-base-100 p-6 text-base leading-relaxed shadow-sm">
          {entry.content}
        </div>

        <div className="mt-12 rounded-xl bg-primary/10 p-6 text-center">
          <p className="mb-4 font-medium text-base-content/90">
            Ready to convert more visitors? Add your verified revenue badge in minutes.
          </p>
          <Link href="/" className="btn btn-primary">
            Get your TrustCard →
          </Link>
        </div>
      </article>
    </div>
  );
}
