"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import TrustCard from "@/components/TrustCard";
import TrustCardSkeleton from "@/components/TrustCardSkeleton";
import { useResponsiveCardWidth } from "@/hooks/useResponsiveCardWidth";
import type { TrustCardData, PokemonType } from "@/lib/trustmrr";
import { POKEMON_TYPES } from "@/lib/trustmrr";

type Tab = "iframe" | "script";
type Template = "metallic" | "pokemon";

interface FetchError {
  message: string;
  isRateLimit: boolean;
  isNotFound: boolean;
  isForbidden?: boolean; // 403 = not claimed
}

interface HomeClientProps {
  featuredCard: TrustCardData | null;
  initialSlug?: string;
}

export default function HomeClient({ featuredCard, initialSlug = "" }: HomeClientProps) {
  const cardWidth = useResponsiveCardWidth();
  const [slug, setSlug] = useState(initialSlug);
  const [data, setData] = useState<TrustCardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FetchError | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("iframe");
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [template, setTemplate] = useState<Template>("metallic");
  const [pokemonType, setPokemonType] = useState<PokemonType>("fire");
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
            isForbidden: res.status === 403,
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
            isForbidden: (err as FetchError).isForbidden ?? false,
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

  // When landing with ?slug=, fetch that card once
  const didInitialFetch = useRef(false);
  useEffect(() => {
    if (!initialSlug || didInitialFetch.current) return;
    didInitialFetch.current = true;
    fetchCard(initialSlug);
  }, [initialSlug, fetchCard]);

  const iframeSnippet = data
    ? `<iframe\n  src="${baseUrl}/card/${data.slug}"\n  width="450"\n  height="320"\n  style="border:none;border-radius:16px;overflow:hidden"\n  loading="lazy"\n  title="${data.name} TrustCard"\n></iframe>`
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

  const showHeroPreview = featuredCard && !data && !loading && !error;

  return (
    <div className="min-h-screen bg-base-200 overflow-x-hidden w-full">
      {/* Hero */}
      <div className="flex flex-col items-center gap-2 pt-6 pb-4 px-4 sm:pt-12 sm:pb-8 sm:px-6">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl text-center">
          TrustCard
        </h1>
        <p className="text-base-content/60 text-center max-w-md text-sm sm:text-base px-1 min-w-0">
          Only verified founders can display a TrustCard. Claim your startup with X to get your embeddable revenue badge.
        </p>
        <a href="/dashboard" className="link link-hover text-sm text-base-content/50 mt-1">
          Manage my TrustCards →
        </a>
      </div>

      {/* Featured Founder hero preview */}
      {showHeroPreview && (
        <div className="flex flex-col items-center gap-3 pb-6 sm:pb-8 px-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-base-content/40">
            Featured Founder
          </p>

          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              <button
                type="button"
                className={`btn btn-sm ${template === "metallic" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setTemplate("metallic")}
              >
                ✨ Metallic
              </button>
              <button
                type="button"
                className={`btn btn-sm ${template === "pokemon" ? "btn-primary" : "btn-ghost"}`}
                onClick={() => setTemplate("pokemon")}
              >
                ⚡ Pokémon
              </button>
            </div>
            {template === "pokemon" && (
              <div className="flex gap-2">
                {POKEMON_TYPES.map((pt) => (
                  <button
                    key={pt}
                    type="button"
                    className={`btn btn-sm ${pokemonType === pt ? "btn-secondary" : "btn-outline"}`}
                    onClick={() => setPokemonType(pt)}
                  >
                    {pt === "fire" ? "🔥" : pt === "water" ? "💧" : "🌿"}{" "}
                    {pt.charAt(0).toUpperCase() + pt.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <TrustCard data={featuredCard} width={cardWidth} template={template} pokemonType={pokemonType} />
          <p className="text-xs text-base-content/40 italic text-center px-2">
            Claim your startup to get a verified TrustCard like this.
          </p>
        </div>
      )}

      <div id="generate" className="mx-auto max-w-5xl px-3 sm:px-4 pb-12 sm:pb-20 w-full min-w-0">
        {/* Slug input */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mx-auto w-full max-w-md sm:max-w-xl md:max-w-2xl"
          aria-label="Claim Your Startup"
        >
          <div className="rounded-2xl bg-base-100 shadow-lg ring-1 ring-base-content/5 p-3 sm:p-4 flex flex-col sm:flex-row items-stretch gap-2.5 sm:gap-3">
            <label className="relative flex flex-1 min-w-0 items-center gap-1.5 sm:gap-2 rounded-xl bg-base-200/60 px-3 sm:px-4 py-2.5 sm:py-3 transition-colors focus-within:bg-base-200 focus-within:ring-2 focus-within:ring-primary/30">
              <span className="text-base-content/35 text-[11px] sm:text-sm whitespace-nowrap shrink-0 font-medium" aria-hidden="true">
                trustmrr.com/startup/
              </span>
              <input
                type="text"
                placeholder="your-slug"
                className="grow min-w-0 bg-transparent outline-none text-sm sm:text-base font-semibold text-base-content placeholder:font-normal placeholder:text-base-content/30"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                autoFocus
                aria-label="TrustCard startup slug"
                autoComplete="off"
                spellCheck={false}
              />
            </label>
            <button
              type="submit"
              className="btn btn-primary shrink-0 rounded-xl min-h-12 sm:min-h-0 sm:px-6 text-sm font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all"
              disabled={!slug.trim() || loading}
              aria-label={loading ? "Looking up…" : "Claim Your Startup"}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" aria-hidden="true" />
              ) : (
                "Claim Your Startup"
              )}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="mx-auto mt-4 w-full max-w-lg sm:max-w-xl md:max-w-2xl">
            <div
              role="alert"
              className={`alert ${error.isRateLimit ? "alert-warning" : error.isForbidden ? "alert-info" : error.isNotFound ? "alert-info" : "alert-error"}`}
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
              <div className="flex flex-col gap-2">
                <span className="font-semibold">
                  {error.isNotFound
                    ? "Startup not found"
                    : error.isForbidden
                      ? "Not claimed yet"
                      : error.isRateLimit
                        ? "Too many requests"
                        : "Something went wrong"}
                </span>
                <span className="text-xs opacity-80">
                  {error.isNotFound
                    ? "Double-check the slug and try again."
                    : error.isForbidden
                      ? error.message
                      : error.isRateLimit
                        ? "Please wait a moment and try again."
                        : error.message}
                </span>
                {error.isForbidden && slug.trim() && (
                  <a
                    href={`/claim?slug=${encodeURIComponent(slug.trim().toLowerCase())}`}
                    className="btn btn-primary btn-sm mt-2 w-fit"
                  >
                    This is mine — Verify with X
                  </a>
                )}
              </div>
              {!error.isNotFound && !error.isForbidden && (
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
          <div className="mt-8 sm:mt-10 flex justify-center w-full min-w-0 px-2">
            <TrustCardSkeleton width={cardWidth} />
          </div>
        )}

        {/* Results: preview + snippets side by side */}
        {data && (
          <div className="mt-8 sm:mt-10 grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2 w-full min-w-0">
            {/* Preview */}
            <div className="flex flex-col items-center gap-4 min-w-0">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-base-content/40">
                Live Preview
              </h2>

              {/* Card Style Selector */}
              <div className="flex flex-col items-center gap-2 w-full">
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={`btn btn-sm ${template === "metallic" ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => setTemplate("metallic")}
                  >
                    ✨ Metallic
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${template === "pokemon" ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => setTemplate("pokemon")}
                  >
                    ⚡ Pokémon
                  </button>
                </div>
                {template === "pokemon" && (
                  <div className="flex gap-2">
                    {POKEMON_TYPES.map((pt) => (
                      <button
                        key={pt}
                        type="button"
                        className={`btn btn-sm ${pokemonType === pt ? "btn-secondary" : "btn-outline"}`}
                        onClick={() => setPokemonType(pt)}
                      >
                        {pt === "fire" ? "🔥" : pt === "water" ? "💧" : "🌿"}{" "}
                        {pt.charAt(0).toUpperCase() + pt.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <TrustCard data={data} width={cardWidth} template={template} pokemonType={pokemonType} />
              <div className="flex flex-wrap items-center justify-center gap-2">
                <a
                  href={`/startup/${data.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link link-hover text-xs text-base-content/40 py-1"
                >
                  Open full page →
                </a>
                <button
                  onClick={handleDownloadPng}
                  className="btn btn-sm btn-outline gap-1.5 min-h-9"
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
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Just verified my revenue with TrustCard! 🚀\n\n${data.mrrFormatted} MRR · ${data.growthFormatted} growth`)}&url=${encodeURIComponent(`https://trustcardmrr.com/startup/${data.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm gap-1.5 min-h-9"
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
            <div className="flex flex-col gap-4 w-full min-w-0">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-base-content/40">
                Embed Code
              </h2>

              {/* Tabs */}
              <div role="tablist" className="tabs tabs-boxed w-full sm:w-fit flex-wrap" aria-label="Embed format">
                <button
                  role="tab"
                  aria-selected={activeTab === "iframe"}
                  className={`tab flex-1 sm:flex-none min-h-10 ${activeTab === "iframe" ? "tab-active" : ""}`}
                  onClick={() => setActiveTab("iframe")}
                >
                  iframe
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === "script"}
                  className={`tab flex-1 sm:flex-none min-h-10 ${activeTab === "script" ? "tab-active" : ""}`}
                  onClick={() => setActiveTab("script")}
                >
                  Script Tag
                </button>
              </div>

              {/* Snippet */}
              <div className="relative w-full min-w-0">
                <pre className="overflow-x-auto overflow-y-hidden rounded-xl bg-base-300 p-3 sm:p-4 text-xs leading-relaxed max-h-40 sm:max-h-none touch-pan-x">
                  <code className="block min-w-max">{currentSnippet}</code>
                </pre>
                <button
                  onClick={handleCopy}
                  className="btn btn-sm btn-ghost absolute top-2 right-2 min-h-8 min-w-8 p-0 flex items-center justify-center"
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
                  ? "Paste this revenue embed code anywhere on your site. Works in Framer, Webflow, WordPress, and plain HTML. Your card shows your verified provider (Stripe, LemonSqueezy, DodoPayment, etc.)."
                  : "Add the div where you want the card, and include the script once per page. It auto-injects the iframe."}
              </p>

              {/* Tier legend */}
              <div className="mt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-base-content/40">
                  Metal Tiers
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 rounded-lg bg-base-200 px-2 py-2 sm:px-3">
                    <span className="inline-block h-3 w-3 shrink-0 rounded-full bg-amber-700" />
                    <span className="truncate">Bronze · $0–$499</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-base-200 px-2 py-2 sm:px-3">
                    <span className="inline-block h-3 w-3 shrink-0 rounded-full bg-gray-400" />
                    <span className="truncate">Silver · $500–$2.5K</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-base-200 px-2 py-2 sm:px-3">
                    <span className="inline-block h-3 w-3 shrink-0 rounded-full bg-yellow-400" />
                    <span className="truncate">Gold · $2.5K–$10K</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-base-200 px-2 py-2 sm:px-3">
                    <span className="inline-block h-3 w-3 shrink-0 rounded-full bg-white border border-base-300" />
                    <span className="truncate">Platinum · $10K+</span>
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
