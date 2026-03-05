"use client";

import { useEffect } from "react";

/**
 * Preloads the OG image for the card page to improve LCP.
 * Renders a link tag into the document head.
 */
export function OgImagePreload({ url }: { url: string }) {
  useEffect(() => {
    if (!url || typeof document === "undefined") return;
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = url;
    link.setAttribute("fetchpriority", "high");
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [url]);
  return null;
}
