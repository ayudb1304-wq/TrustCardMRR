"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ClaimStartupClientProps {
  slug: string;
}

export default function ClaimStartupClient({ slug }: ClaimStartupClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleClaim = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/claim/${encodeURIComponent(slug)}`, {
        method: "POST",
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((body as { error?: string }).error ?? "Verification failed.");
        return;
      }
      setSuccess(true);
      router.refresh();
      setTimeout(() => {
        router.push(`/?slug=${encodeURIComponent(slug)}`);
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body items-center text-center gap-4">
          <div className="text-success text-5xl">✓</div>
          <h1 className="card-title text-2xl text-success">Startup claimed!</h1>
          <p className="text-base-content/60">
            Redirecting you to your TrustCard…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card w-full max-w-md bg-base-100 shadow-xl">
      <div className="card-body items-center text-center gap-4">
        <h1 className="card-title text-2xl">Verify ownership</h1>
        <p className="text-base-content/60 text-sm">
          We’ll check that your X account matches the one linked to{" "}
          <strong>{slug}</strong> on TrustMRR. Only the owner can claim this startup.
        </p>
        {error && (
          <div className="alert alert-error text-left w-full text-sm">
            {error}
          </div>
        )}
        <button
          type="button"
          onClick={handleClaim}
          disabled={loading}
          className="btn btn-primary w-full gap-2"
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Verify with X & claim
            </>
          )}
        </button>
        <a href="/" className="link link-hover text-sm text-base-content/50">
          ← Back to home
        </a>
      </div>
    </div>
  );
}
