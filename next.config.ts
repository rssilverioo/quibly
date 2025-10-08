import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./next-intl.config.ts");

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "fal.media",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "quibly.s3.sa-east-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
