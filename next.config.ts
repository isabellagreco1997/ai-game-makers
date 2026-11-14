import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages. NEXT_PUBLIC_BASE_PATH is the repo path
 * (e.g. "/ai-game-makers") when served from username.github.io/<repo>;
 * leave it empty when the site has its own domain.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  trailingSlash: true,
  poweredByHeader: false,
  images: { unoptimized: true },
};

export default nextConfig;
