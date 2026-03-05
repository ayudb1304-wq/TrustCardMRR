import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      className="navbar bg-base-100/80 backdrop-blur-md border-b border-base-200 sticky top-0 z-50 min-h-14 overflow-x-hidden"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-2 px-3 sm:px-4 min-w-0">
        <Link
          href="/"
          className="text-base font-extrabold tracking-tight sm:text-lg min-h-10 flex items-center shrink-0"
          aria-label="TrustCard home"
        >
          TrustCard
        </Link>
        <div className="flex items-center gap-0.5 sm:gap-1 flex-wrap justify-end min-w-0" role="menubar">
          <Link
            href="/"
            className="btn btn-ghost btn-sm min-h-10 min-w-10 sm:min-w-0 px-2 sm:px-3"
            role="menuitem"
          >
            Dashboard
          </Link>
          <a
            href="https://trustmrr.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm min-h-10 min-w-10 sm:min-w-0 px-2 sm:px-3"
            role="menuitem"
          >
            TrustMRR
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm min-h-10 min-w-10 px-2 sm:px-3"
            role="menuitem"
            aria-label="GitHub"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        </div>
      </div>
    </nav>
  );
}
