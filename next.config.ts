import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "image.thum.io" },
    ],
  },
  experimental: {
    optimizePackageImports: ["motion", "@phosphor-icons/react"],
  },
};

export default nextConfig;
