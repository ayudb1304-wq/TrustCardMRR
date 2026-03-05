"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import {
  useRef,
  useEffect,
  useState,
  useLayoutEffect,
  useCallback,
} from "react";

export interface NavbarUserMenuProps {
  user: {
    name?: string | null;
    image?: string | null;
    xHandle?: string | null;
  };
  signOutAction: () => Promise<void>;
}

interface DropdownPosition {
  top: number;
  right: number;
}

const DROPDOWN_GAP_PX = 8;
const DROPDOWN_Z_INDEX = 9999;

function getDropdownPosition(button: HTMLButtonElement | null): DropdownPosition | null {
  if (!button || typeof window === "undefined") return null;
  const rect = button.getBoundingClientRect();
  return {
    top: rect.bottom + DROPDOWN_GAP_PX,
    right: window.innerWidth - rect.right,
  };
}

export default function NavbarUserMenu({ user, signOutAction }: NavbarUserMenuProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<DropdownPosition | null>(null);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const xHandle = user.xHandle ?? null;
  const displayLabel = xHandle ? `@${xHandle}` : user.name ?? "Account";

  const updatePosition = useCallback(() => {
    const next = getDropdownPosition(buttonRef.current);
    if (next) setPosition(next);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  // Only run portal on client after mount to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // When dropdown opens, measure button position before paint and on scroll/resize
  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    const handleScrollOrResize = () => updatePosition();
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [open, updatePosition]);

  // Close on click outside or Escape
  useEffect(() => {
    if (!open) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (buttonRef.current?.contains(target)) return;
      if (dropdownRef.current?.contains(target)) return;
      close();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    // Defer listener so the click that opened the menu doesn't close it
    const id = requestAnimationFrame(() => {
      document.addEventListener("click", handleClick, true);
      document.addEventListener("keydown", handleKeyDown);
    });

    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, close]);

  const handleToggle = () => {
    if (!open) {
      const next = getDropdownPosition(buttonRef.current);
      if (next) setPosition(next);
    }
    setOpen((prev) => !prev);
  };

  const dropdownContent =
    mounted && open && position && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={dropdownRef}
            role="dialog"
            aria-label="Account menu"
            className="rounded-box border border-base-200 bg-base-100 p-2 shadow-xl w-56 min-w-[12rem] max-w-[calc(100vw-2rem)]"
            style={{
              position: "fixed",
              top: position.top,
              right: position.right,
              left: "auto",
              zIndex: DROPDOWN_Z_INDEX,
            }}
          >
            <ul className="menu" role="menu">
              <li className="menu-title flex flex-col items-stretch gap-1 border-b border-base-200/80 px-2 pb-2 pt-1">
                <div className="flex min-w-0 items-center gap-3">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-full"
                      width={40}
                      height={40}
                    />
                  ) : null}
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-semibold">
                      {user.name ?? "Signed in"}
                    </span>
                    {xHandle ? (
                      <span className="truncate text-xs text-base-content/60">
                        @{xHandle}
                      </span>
                    ) : null}
                  </div>
                </div>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="flex min-h-11 items-center sm:min-h-10"
                  onClick={close}
                >
                  My TrustCards
                </Link>
              </li>
              <li>
                <form action={signOutAction} className="contents">
                  <button
                    type="submit"
                    className="flex min-h-11 w-full cursor-pointer items-center border-none bg-transparent text-left sm:min-h-10"
                  >
                    Sign out
                  </button>
                </form>
              </li>
            </ul>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <div className="shrink-0" role="menuitem">
        <button
          ref={buttonRef}
          type="button"
          onClick={handleToggle}
          className="btn btn-ghost btn-sm flex min-h-11 min-w-11 gap-1.5 px-2 sm:min-h-10 sm:min-w-0 sm:gap-2 sm:px-3"
          aria-label="Account menu"
          aria-expanded={open}
          aria-haspopup="true"
        >
          {user.image ? (
            <img
              src={user.image}
              alt=""
              className="h-7 w-7 shrink-0 rounded-full sm:h-6 sm:w-6"
              width={28}
              height={28}
            />
          ) : (
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-base-300 text-xs font-semibold sm:h-6 sm:w-6">
              {(user.name ?? "?").charAt(0).toUpperCase()}
            </span>
          )}
          <span className="hidden max-w-[100px] truncate sm:inline md:max-w-[140px]">
            {displayLabel}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`hidden h-4 w-4 shrink-0 opacity-60 transition-transform sm:block ${
              open ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
      {dropdownContent}
    </>
  );
}
