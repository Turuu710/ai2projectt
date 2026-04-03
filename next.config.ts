import type { NextConfig } from "next";
// LAST
const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  env: {
    CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  },
};
