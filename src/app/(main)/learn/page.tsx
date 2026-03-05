import Link from "next/link";
import type { Metadata } from "next";
import { LEARN_PAGES } from "@/lib/learn";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Learn | TrustCard. Convert More Visitors With Verified Revenue",
  description:
    "Why verified revenue converts visitors, why unverified screenshots fail, and what MRR is. Add a trust badge to your site and increase conversions.",
  alternates: { canonical: `${BASE_URL}/learn` },
};

export default function LearnIndexPage() {
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
          Learn
        </h1>
        <p className="mt-2 text-base-content/70">
          Why verified revenue converts visitors, how to build trust, and how to
          add a revenue badge to your site so more visitors become customers.
        </p>

        <ul className="mt-8 space-y-4">
          {LEARN_PAGES.map((entry) => (
            <li key={entry.slug}>
              <Link
                href={`/learn/${entry.slug}`}
                className="block rounded-xl bg-base-100 p-4 shadow-sm transition hover:shadow-md"
              >
                <span className="font-semibold">{entry.title}</span>
                <p className="mt-1 text-sm text-base-content/60">
                  {entry.description}
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
