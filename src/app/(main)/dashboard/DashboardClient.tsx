"use client";

import { useEffect, useState } from "react";

interface StartupRow {
  slug: string;
  allowedDomains: string[];
  isVerified: boolean;
}

export default function DashboardClient() {
  const [startups, setStartups] = useState<StartupRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [domainInput, setDomainInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleSaveDomains = async (slug: string, domains: string[]) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/dashboard/startups/${encodeURIComponent(slug)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ allowedDomains: domains }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((body as { error?: string }).error ?? "Failed to save");
        return;
      }
      setStartups((prev) =>
        prev.map((s) =>
          s.slug === slug ? { ...s, allowedDomains: domains } : s,
        ),
      );
      setEditingSlug(null);
      setDomainInput("");
    } finally {
      setSaving(false);
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
            You haven’t claimed any startups yet. Claim your startup from the homepage to add embed domains and manage your TrustCard here.
          </p>
          <a href="/" className="btn btn-primary btn-sm w-fit">
            Claim Your Startup →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
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
            <p className="text-sm text-base-content/60">
              Allowed embed domains (leave empty to allow any domain):
            </p>
            {editingSlug === s.slug ? (
              <div className="flex flex-col gap-2">
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
              <div className="flex items-center gap-2 flex-wrap">
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
      ))}
    </div>
  );
}
