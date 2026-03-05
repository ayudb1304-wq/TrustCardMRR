import Link from "next/link";
import { auth, signOut } from "@/auth";
import NavbarUserMenu from "./NavbarUserMenu";

async function signOutAction() {
  "use server";
  await signOut();
}

export default async function Navbar() {
  const session = await auth();

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
        <div className="flex items-center gap-0.5 sm:gap-1 flex-nowrap justify-end min-w-0 overflow-x-auto scrollbar-none" role="menubar">
          <Link
            href="/"
            className="btn btn-ghost btn-sm min-h-11 min-w-11 sm:min-h-10 sm:min-w-0 px-2 sm:px-3 shrink-0"
            role="menuitem"
          >
            Home
          </Link>
          <Link
            href="/integrations"
            className="btn btn-ghost btn-sm min-h-11 min-w-11 sm:min-h-10 sm:min-w-0 px-2 sm:px-3 shrink-0"
            role="menuitem"
          >
            <span className="hidden md:inline">Integrations</span>
            <span className="md:hidden">Apps</span>
          </Link>
          <Link
            href="/learn"
            className="btn btn-ghost btn-sm min-h-11 min-w-11 sm:min-h-10 sm:min-w-0 px-2 sm:px-3 shrink-0"
            role="menuitem"
          >
            Learn
          </Link>
          <a
            href="https://trustmrr.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm min-h-11 min-w-11 sm:min-h-10 sm:min-w-0 px-2 sm:px-3 shrink-0"
            role="menuitem"
          >
            <span className="hidden sm:inline">TrustMRR</span>
            <span className="sm:hidden">MRR</span>
          </a>
          {session?.user ? (
            <NavbarUserMenu user={session.user} signOutAction={signOutAction} />
          ) : (
            <Link
              href="/login"
              className="btn btn-primary btn-sm min-h-11 sm:min-h-10 px-2 sm:px-3 shrink-0"
              role="menuitem"
            >
              Sign in with X
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
