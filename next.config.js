/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.sanity.io"],
  },
  env: {
    LANGUAGE: process.env.LANGUAGE,
  },
};

module.exports = nextConfig;
