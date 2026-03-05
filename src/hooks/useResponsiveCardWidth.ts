"use client";

import { useState, useEffect } from "react";

const MIN_CARD_WIDTH = 280;
const MAX_CARD_WIDTH = 420;
const HORIZONTAL_PADDING = 32;

/**
 * Returns a card width that fits the viewport (for TrustCard / metallic card).
 * Use for mobile/tablet optimization.
 */
export function useResponsiveCardWidth(): number {
  const [width, setWidth] = useState(MAX_CARD_WIDTH);

  useEffect(() => {
    const update = () => {
      const available =
        typeof window !== "undefined"
          ? window.innerWidth - HORIZONTAL_PADDING
          : MAX_CARD_WIDTH;
      setWidth(Math.min(MAX_CARD_WIDTH, Math.max(MIN_CARD_WIDTH, available)));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return width;
}
