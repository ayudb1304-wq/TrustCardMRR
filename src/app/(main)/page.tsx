"use client";

import { useState, useCallback, useRef } from "react";
import TrustCard from "@/components/TrustCard";
import TrustCardSkeleton from "@/components/TrustCardSkeleton";
import type { TrustCardData } from "@/lib/trustmrr";

type Tab = "iframe" | "script";

interface FetchError {
  message: string;
  isRateLimit: boolean;
  isNotFound: boolean;
}

export default function Home() {
  const [slug, setSlug] = useState("");
  const [data, setData] = useState<TrustCardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FetchError | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("iframe");
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "";

  const fetchCard = useCallback(
    async (targetSlug: string) => {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const res = await fetch(`/api/verify/${encodeURIComponent(targetSlug)}`);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          const msg =
            (body as { error?: string }).error ?? `Not found (${res.status})`;
          throw {
            message: msg,
            isRateLimit: res.status === 429,
            isNotFound: res.status === 404,
          } as FetchError;
        }
        const json = (await res.json()) as { data: TrustCardData };
        setData(json.data);
      } catch (err) {
        if ((err as FetchError).isRateLimit !== undefined) {
          setError(err as FetchError);
        } else {
          setError({
            message:
              err instanceof Error ? err.message : "Network error. Check your connection and try again.",
            isRateLimit: false,
            isNotFound: false,
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = slug.trim().toLowerCase();
      if (!trimmed) return;
      await fetchCard(trimmed);
    },
    [slug, fetchCard],
  );

  const handleRetry = useCallback(() => {
    const trimmed = slug.trim().toLowerCase();
    if (trimmed) fetchCard(trimmed);
  }, [slug, fetchCard]);

  const iframeSnippet = data
    ? `<iframe\n  src="${baseUrl}/embed/${data.slug}"\n  width="450"\n  height="320"\n  style="border:none;border-radius:16px;overflow:hidden"\n  loading="lazy"\n  title="${data.name} TrustCard"\n></iframe>`
    : "";

  const scriptSnippet = data
    ? `<div data-trustcard-slug="${data.slug}"></div>\n<script src="${baseUrl}/embed.js" defer></script>`
    : "";

  const currentSnippet = activeTab === "iframe" ? iframeSnippet : scriptSnippet;

  const handleCopy = useCallback(async () => {
    if (!currentSnippet) return;
    await navigator.clipboard.writeText(currentSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [currentSnippet]);

  const handleDownloadPng = useCallback(async () => {
    if (!data) return;
    setDownloading(true);
    try {
      const res = await fetch(`/api/og/${encodeURIComponent(data.slug)}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${data.slug}-trustcard.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }, [data]);

  return (
    <div className="min-h-screen bg-base-200">
      {/* Hero */}
      <div className="flex flex-col items-center gap-2 pt-12 pb-8 px-4">
        <h1 className="text-4xl font-extrabold tracking-tight">TrustCard</h1>
        <p className="text-base-content/60 text-center max-w-md">
          Generate embeddable, verified MRR badges for your landing page.
          Powered by TrustMRR.
        </p>
      </div>

      <div id="generate" className="mx-auto max-w-5xl px-4 pb-20">
        {/* Slug input */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-lg items-center gap-2"
          aria-label="Generate TrustCard"
        >
          <label className="input input-bordered flex flex-1 items-center gap-2">
            <span className="text-base-content/40 text-sm whitespace-nowrap" aria-hidden="true">
              trustmrr.com/startup/
            </span>
            <input
              type="text"
              placeholder="your-slug"
              className="grow bg-transparent outline-none"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              autoFocus
              aria-label="TrustMRR startup slug"
              autoComplete="off"
              spellCheck={false}
            />
          </label>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!slug.trim() || loading}
            aria-label={loading ? "Generating card" : "Generate TrustCard"}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm" aria-hidden="true" />
            ) : (
              "Generate"
            )}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mx-auto mt-4 max-w-lg">
            <div
              role="alert"
              className={`alert ${error.isRateLimit ? "alert-warning" : error.isNotFound ? "alert-info" : "alert-error"}`}
            >
              {error.isNotFound ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              ) : error.isRateLimit ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <div className="flex flex-col">
                <span className="font-semibold">
                  {error.isNotFound
                    ? "Startup not found"
                    : error.isRateLimit
                      ? "Too many requests"
                      : "Something went wrong"}
                </span>
                <span className="text-xs opacity-80">
                  {error.isNotFound
                    ? "Double-check the slug and try again."
                    : error.isRateLimit
                      ? "Please wait a moment and try again."
                      : error.message}
                </span>
              </div>
              {!error.isNotFound && (
                <button
                  onClick={handleRetry}
                  className="btn btn-sm btn-ghost"
                  disabled={loading}
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="mt-10 flex justify-center">
            <TrustCardSkeleton />
          </div>
        )}

        {/* Results: preview + snippets side by side */}
        {data && (
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Preview */}
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-base-content/40">
                Live Preview
              </h2>
              <TrustCard data={data} width={400} />
              <div className="flex flex-wrap items-center justify-center gap-2">
                <a
                  href={`/card/${data.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-hover text-xs text-base-content/40"
                >
                  Open full page →
                </a>
                <button
                  onClick={handleDownloadPng}
                  className="btn btn-sm btn-outline gap-1.5"
                  disabled={downloading}
                  aria-label="Download card as PNG image"
                >
                  {downloading ? (
                    <span className="loading loading-spinner loading-xs" aria-hidden="true" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  )}
                  Download PNG
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Just verified my revenue with TrustCard! 🚀\n\n${data.mrrFormatted} MRR · ${data.growthFormatted} growth`)}&url=${encodeURIComponent(`https://trustcardmrr.com/card/${data.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm gap-1.5"
                  aria-label="Share TrustCard to X (Twitter)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Share to X
                </a>
              </div>
            </div>

            {/* Embed snippets */}
            <div className="flex flex-col gap-4">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-base-content/40">
                Embed Code
              </h2>

              {/* Tabs */}
              <div role="tablist" className="tabs tabs-boxed w-fit" aria-label="Embed format">
                <button
                  role="tab"
                  aria-selected={activeTab === "iframe"}
                  className={`tab ${activeTab === "iframe" ? "tab-active" : ""}`}
                  onClick={() => setActiveTab("iframe")}
                >
                  iframe
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === "script"}
                  className={`tab ${activeTab === "script" ? "tab-active" : ""}`}
                  onClick={() => setActiveTab("script")}
                >
                  Script Tag
                </button>
              </div>

              {/* Snippet */}
              <div className="relative">
                <pre className="overflow-x-auto rounded-xl bg-base-300 p-4 text-xs leading-relaxed">
                  <code>{currentSnippet}</code>
                </pre>
                <button
                  onClick={handleCopy}
                  className="btn btn-sm btn-ghost absolute top-2 right-2"
                  aria-label={copied ? "Copied to clipboard" : "Copy embed code"}
                >
                  {copied ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-success"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {/* Hint */}
              <p className="text-xs text-base-content/40">
                {activeTab === "iframe"
                  ? "Paste this HTML anywhere on your site. Works in Framer, Webflow, WordPress, and plain HTML."
                  : "Add the div where you want the card, and include the script once per page. It auto-injects the iframe."}
              </p>

              {/* Tier legend */}
              <div className="mt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-base-content/40">
                  Metal Tiers
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 rounded-lg bg-base-200 px-3 py-2">
                    <span className="inline-block h-3 w-3 rounded-full bg-amber-700" />
                    <span>Bronze · $0–$499</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-base-200 px-3 py-2">
                    <span className="inline-block h-3 w-3 rounded-full bg-gray-400" />
                    <span>Silver · $500–$2.5K</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-base-200 px-3 py-2">
                    <span className="inline-block h-3 w-3 rounded-full bg-yellow-400" />
                    <span>Gold · $2.5K–$10K</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-base-200 px-3 py-2">
                    <span className="inline-block h-3 w-3 rounded-full bg-white border border-base-300" />
                    <span>Platinum · $10K+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
