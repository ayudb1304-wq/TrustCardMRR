import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "files.stripe.com" },
      { protocol: "https", hostname: "cdn.trustmrr.com" },
    ],
  },
};

export default nextConfig;
