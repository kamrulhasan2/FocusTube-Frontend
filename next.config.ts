import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  experimental: {
    cacheComponents: true,
    optimizePackageImports: ["lucide-react"],
  },
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://192.168.0.102:3000",
    "http://192.168.0.101:3000",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      {
        protocol: "https",
        hostname: "*.backblazeb2.com",
      },
    ],
  },
};

export default nextConfig;
