import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-base-200 bg-base-100 mt-auto">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div>
            <Link href="/" className="font-extrabold tracking-tight text-base-content">
              TrustCard
            </Link>
            <p className="mt-1 text-sm text-base-content/60 max-w-xs">
              Verified revenue badges for your site. Connect once, embed anywhere. Free.
            </p>
          </div>
          <nav className="flex flex-wrap gap-6 text-sm" aria-label="Footer navigation">
            <Link href="/" className="text-base-content/70 hover:text-base-content">
              Dashboard
            </Link>
            <Link href="/integrations" className="text-base-content/70 hover:text-base-content">
              Integrations
            </Link>
            <Link href="/learn" className="text-base-content/70 hover:text-base-content">
              Learn
            </Link>
            <a
              href="https://trustmrr.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base-content/70 hover:text-base-content"
            >
              Verify revenue at TrustMRR
            </a>
          </nav>
        </div>
        <p className="mt-6 text-xs text-base-content/50">
          TrustCard shows your verified MRR from TrustMRR. Add the badge to your landing page so visitors see proof, not promises.
        </p>
      </div>
    </footer>
  );
}
