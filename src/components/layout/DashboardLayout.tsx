"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const APP_DRAWER_ID = "app-drawer";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "◉" },
  { href: "/integrations", label: "Integrations", icon: "◇" },
  { href: "/claim", label: "Claim", icon: "◆" },
] as const;

const placeholderItems = [
  { href: "#", label: "Analytics", icon: "▣", disabled: true },
  { href: "#", label: "Settings", icon: "⚙", disabled: true },
] as const;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="drawer md:drawer-open">
      <input
        id={APP_DRAWER_ID}
        type="checkbox"
        className="drawer-toggle"
        aria-label="Toggle app menu"
      />
      <div className="drawer-content flex min-h-screen flex-col">
        {/* Mobile: menu button */}
        <div className="sticky top-14 z-40 flex items-center border-b border-base-200 bg-base-100/95 backdrop-blur-sm md:hidden">
          <label
            htmlFor={APP_DRAWER_ID}
            className="btn btn-ghost btn-square drawer-button min-h-12 min-w-12 w-12 rounded-none touch-manipulation"
            aria-label="Open menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
          <span className="text-sm font-semibold text-base-content/70">
            TrustCard
          </span>
        </div>
        <main className="flex-1">{children}</main>
      </div>
      <div className="drawer-side z-50">
        <label
          htmlFor={APP_DRAWER_ID}
          className="drawer-overlay"
          aria-label="Close menu"
        />
        <aside className="flex min-h-full w-56 flex-col bg-base-200 border-r border-base-300 md:sticky md:top-14 md:h-[calc(100vh-3.5rem)] md:w-56">
          <ul className="menu gap-1 p-3 text-base">
            {navItems.map(({ href, label, icon }) => {
              const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
              return (
              <li key={href}>
                <Link
                  href={href}
                  className={`min-h-11 touch-manipulation ${isActive ? "active" : ""}`}
                  onClick={() => {
                    const el = document.getElementById(APP_DRAWER_ID) as HTMLInputElement | null;
                    if (el?.checked) el.checked = false;
                  }}
                >
                  <span className="opacity-70" aria-hidden>{icon}</span>
                  {label}
                </Link>
              </li>
              );
            })}
            <li className="menu-title mt-2 pt-2 border-t border-base-300">
              <span className="text-xs font-normal text-base-content/50">Coming soon</span>
            </li>
            {placeholderItems.map(({ href, label, icon, disabled }) => (
              <li key={label}>
                <Link
                  href={href}
                  className={`min-h-11 touch-manipulation ${disabled ? "disabled opacity-50" : ""}`}
                  aria-disabled={disabled}
                  onClick={(e) => disabled && e.preventDefault()}
                >
                  <span className="opacity-50" aria-hidden>{icon}</span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
