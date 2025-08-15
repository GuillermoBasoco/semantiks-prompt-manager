/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true
  },
  images: {
    // Cloudflare Pages doesn't run Next's default image optimizer
    unoptimized: true
  }
};

export default nextConfig;

