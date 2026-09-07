/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.sanity.io"],
  },
  env: {
    LANGUAGE: process.env.LANGUAGE,
  },
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

module.exports = nextConfig;
