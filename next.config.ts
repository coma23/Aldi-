import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Seed photos are locally-generated placeholder SVGs (public/photos).
    // Replace them with real JPEG/WebP files and this can be removed —
    // see README.md.
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
