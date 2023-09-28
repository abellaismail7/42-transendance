// Importing env files here to validate on build
//import "./src/env.mjs";
//import "@acme/auth/env.mjs";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ["ui"],
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placebeard.it",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default config;
