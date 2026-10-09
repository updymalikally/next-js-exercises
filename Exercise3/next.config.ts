import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: "build",
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
