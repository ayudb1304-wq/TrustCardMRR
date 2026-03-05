import { db } from "@/lib/db";

export interface VerifiedStartup {
  id: string;
  slug: string;
  ownerId: string;
  isVerified: boolean;
  allowedDomains: string[];
}

/**
 * Get the verified startup record for a slug, if any.
 * Returns null if the slug is not claimed or not verified.
 */
export async function getVerifiedStartup(
  slug: string,
): Promise<VerifiedStartup | null> {
  const startup = await db.startup.findUnique({
    where: { slug: slug.toLowerCase() },
  });
  if (!startup || !startup.isVerified) return null;
  return startup;
}

/**
 * Check if an embed request from `refererOrigin` is allowed for this startup.
 * If allowedDomains is empty, no domain restriction (allow all).
 * Otherwise the referer's host must match one of the allowed domains (protocol/path ignored).
 */
export function isDomainAllowed(
  allowedDomains: string[],
  refererOrigin: string | null,
): boolean {
  if (allowedDomains.length === 0) return true;
  if (!refererOrigin) return false;
  let refererHost: string;
  try {
    refererHost = new URL(refererOrigin).host.toLowerCase();
  } catch {
    return false;
  }
  return allowedDomains.some((d) => {
    const normalized = d.toLowerCase().trim().replace(/^https?:\/\//, "").split("/")[0] ?? "";
    const refHost = refererHost.replace(/^www\./, "");
    const normHost = normalized.replace(/^www\./, "");
    return normHost === refHost;
  });
}
