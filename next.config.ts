import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bundles the SQLite file into serverless functions so the demo
  // deployment can read the catalog. This is a stopgap for previewing the
  // site only — SQLite does not persist writes on serverless hosting. Move
  // to a hosted Postgres database before accepting real orders (README.md).
  outputFileTracingIncludes: {
    "/*": ["./dev.db"],
  },
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
