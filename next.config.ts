import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma's query engine is a binary loaded at runtime rather than imported,
  // so it has to be named explicitly to reach the serverless bundle.
  outputFileTracingIncludes: {
    "/**/*": ["./lib/generated/prisma/**/*"],
  },
};

export default nextConfig;
