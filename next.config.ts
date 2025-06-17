import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "ik.imagekit.io",
  //       port: "",
  //     },
  //   ],
  // },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    // Suppress source map warnings from Firestore
    config.ignoreWarnings = [
      {
        module: /node_modules\/@firebase\/firestore/,
        message: /Failed to parse source map/,
      },
      {
        module: /node_modules\/@grpc\/grpc-js/,
        message: /Failed to parse source map/,
      },
    ];

    return config;
  },
};

export default nextConfig;
