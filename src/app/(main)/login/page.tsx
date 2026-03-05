import { signIn } from "@/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in | TrustCard",
  description: "Sign in with X to claim your startup and get your verified TrustCard.",
};

interface Props {
  searchParams: Promise<{ callbackUrl?: string }>;
}

export default async function LoginPage({ searchParams }: Props) {
  const { callbackUrl } = await searchParams;
  const redirectTo = callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-base-200 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body items-center text-center gap-4">
          <h1 className="card-title text-2xl">Sign in to TrustCard</h1>
          <p className="text-base-content/60 text-sm">
            We use X (Twitter) to verify that you own the startup. Only the X handle linked to your startup on TrustMRR can claim it.
          </p>
          <form
            action={async () => {
              "use server";
              await signIn("twitter", { redirectTo });
            }}
            className="w-full"
          >
            <button type="submit" className="btn btn-primary w-full gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Sign in with X (Twitter)
            </button>
          </form>
          <a href="/" className="link link-hover text-sm text-base-content/50">
            ← Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
