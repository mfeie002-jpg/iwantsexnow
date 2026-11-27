/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: process.cwd(),
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true }, // lint is a separate explicit verification step
  typescript: { ignoreBuildErrors: false },
  async redirects() {
    return [
      { source: "/catalogue/:path*", destination: "/search", permanent: false },
      { source: "/demo-accounts", destination: "/", permanent: false },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" }
    ],
  },
};
export default nextConfig;
