/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     config.resolve.fallback.fs = false;
  //   }
  //   return config;
  // },
  swcMinify: true,
  images: {
    domains: ["images.unsplash.com", "thrangra.sirv.com"],
  },
};

module.exports = nextConfig;
