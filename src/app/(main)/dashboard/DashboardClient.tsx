"use client";

import { useEffect, useState } from "react";
import PokemonCard from "@/components/ui/pokemon-card";
import type { TrustCardData } from "@/lib/trustmrr";

interface StartupRow {
  slug: string;
  allowedDomains: string[];
  isVerified: boolean;
  template: string;
  pokemonType: string;
}

type Template = "metallic" | "pokemon";
type PokemonType = "fire" | "water" | "grass";

const POKEMON_TYPES: { value: PokemonType; label: string; emoji: string }[] = [
  { value: "fire", label: "Fire", emoji: "🔥" },
  { value: "water", label: "Water", emoji: "💧" },
  { value: "grass", label: "Grass", emoji: "🌿" },
];

const STAN_PREVIEW: TrustCardData = {
  name: "Stan",
  slug: "stan",
  icon: "https://files.stripe.com/links/MDB8YWNjdF8xTXlnNkdDY0N2cGd5d1RufGZsX2xpdmVfcHNxOEVSNTVDMWxEU29pMkxkb3NSMHBI00uyTGhqwp",
  mrr: 350173100,
  mrrFormatted: "$3,501,731",
  growth30d: 11.3,
  growthFormatted: "+11.3%",
  activeSubscriptions: 99174,
  paymentProvider: "stripe",
};

export default function DashboardClient() {
  const [startups, setStartups] = useState<StartupRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [domainInput, setDomainInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<PokemonType>("fire");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/dashboard/startups");
        if (!res.ok) throw new Error("Failed to load");
        const json = await res.json();
        if (!cancelled) setStartups((json as { startups: StartupRow[] }).startups);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const patchStartup = async (
    slug: string,
    patch: Record<string, unknown>,
  ) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/dashboard/startups/${encodeURIComponent(slug)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        },
      );
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((body as { error?: string }).error ?? "Failed to save");
        return false;
      }
      return true;
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDomains = async (slug: string, domains: string[]) => {
    const ok = await patchStartup(slug, { allowedDomains: domains });
    if (ok) {
      setStartups((prev) =>
        prev.map((s) =>
          s.slug === slug ? { ...s, allowedDomains: domains } : s,
        ),
      );
      setEditingSlug(null);
      setDomainInput("");
    }
  };

  const handleTemplateChange = async (slug: string, template: Template) => {
    const ok = await patchStartup(slug, { template });
    if (ok) {
      setStartups((prev) =>
        prev.map((s) => (s.slug === slug ? { ...s, template } : s)),
      );
    }
  };

  const handlePokemonTypeChange = async (
    slug: string,
    pokemonType: PokemonType,
  ) => {
    const ok = await patchStartup(slug, { pokemonType });
    if (ok) {
      setStartups((prev) =>
        prev.map((s) => (s.slug === slug ? { ...s, pokemonType } : s)),
      );
    }
  };

  if (loading) {
    return <div className="loading loading-spinner loading-lg" />;
  }

  if (error) {
    return (
      <div className="alert alert-error">
        {error}
      </div>
    );
  }

  if (startups.length === 0) {
    return (
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <p className="text-base-content/60">
            You haven&apos;t claimed any startups yet. Claim your startup from the homepage to add embed domains and manage your TrustCard here.
          </p>
          <a href="/" className="btn btn-primary btn-sm w-fit">
            Claim Your Startup →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {startups.map((s) => (
        <div key={s.slug} className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex items-center justify-between gap-2">
              <h2 className="card-title text-lg">
                {s.slug}
                {s.isVerified && (
                  <span className="badge badge-success badge-sm">Verified</span>
                )}
              </h2>
              <a
                href={`/startup/${s.slug}`}
                className="link link-hover text-sm"
              >
                View card →
              </a>
            </div>

            {/* Card Theme Selector */}
            <div className="mt-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-base-content/40 mb-2">
                Card Theme
              </p>
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  className={`btn btn-sm ${s.template === "metallic" ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => handleTemplateChange(s.slug, "metallic")}
                  disabled={saving}
                >
                  ✨ Metallic
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${s.template === "pokemon" ? "btn-primary" : "btn-ghost"}`}
                  onClick={() => handleTemplateChange(s.slug, "pokemon")}
                  disabled={saving}
                >
                  ⚡ Pokémon
                </button>
              </div>

              {s.template === "pokemon" && (
                <div className="mt-2 flex gap-2 flex-wrap">
                  {POKEMON_TYPES.map((pt) => (
                    <button
                      key={pt.value}
                      type="button"
                      className={`btn btn-sm ${s.pokemonType === pt.value ? "btn-secondary" : "btn-outline"}`}
                      onClick={() =>
                        handlePokemonTypeChange(s.slug, pt.value)
                      }
                      disabled={saving}
                    >
                      {pt.emoji} {pt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Allowed Domains */}
            <div className="mt-2">
              <p className="text-sm text-base-content/60">
                Allowed embed domains (leave empty to allow any domain):
              </p>
              {editingSlug === s.slug ? (
                <div className="flex flex-col gap-2 mt-1">
                  <div className="flex flex-wrap gap-2">
                    {s.allowedDomains.map((d) => (
                      <span
                        key={d}
                        className="badge badge-outline gap-1"
                      >
                        {d}
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs"
                          onClick={() =>
                            handleSaveDomains(
                              s.slug,
                              s.allowedDomains.filter((x) => x !== d),
                            )
                          }
                          disabled={saving}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <input
                      type="text"
                      placeholder="e.g. mysaas.com"
                      className="input input-bordered input-sm flex-1 min-w-0 max-w-xs"
                      value={domainInput}
                      onChange={(e) => setDomainInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const v = domainInput.trim();
                          if (v && !s.allowedDomains.includes(v)) {
                            handleSaveDomains(s.slug, [...s.allowedDomains, v]);
                            setDomainInput("");
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      disabled={saving || !domainInput.trim()}
                      onClick={() => {
                        const v = domainInput.trim();
                        if (v && !s.allowedDomains.includes(v)) {
                          handleSaveDomains(s.slug, [...s.allowedDomains, v]);
                          setDomainInput("");
                        }
                      }}
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        setEditingSlug(null);
                        setDomainInput("");
                      }}
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-wrap mt-1">
                  {s.allowedDomains.length === 0 ? (
                    <span className="text-base-content/40 text-sm">Any domain</span>
                  ) : (
                    s.allowedDomains.map((d) => (
                      <span key={d} className="badge badge-ghost">{d}</span>
                    ))
                  )}
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setEditingSlug(s.slug)}
                  >
                    Edit domains
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Pokemon Card Preview */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title text-lg">Pokemon Card Preview</h2>
          <p className="text-sm text-base-content/60">
            Preview how the Pokemon card looks with Stan&apos;s data. Select a type to see different styles.
          </p>
          <div className="flex gap-2 flex-wrap mt-2">
            {POKEMON_TYPES.map((pt) => (
              <button
                key={pt.value}
                type="button"
                className={`btn btn-sm ${previewType === pt.value ? "btn-secondary" : "btn-outline"}`}
                onClick={() => setPreviewType(pt.value)}
              >
                {pt.emoji} {pt.label}
              </button>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <PokemonCard
              data={STAN_PREVIEW}
              pokemonType={previewType}
              width={300}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
