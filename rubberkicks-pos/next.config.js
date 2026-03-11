/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  
  // Image optimization
  images: {
    domains: [],
    formats: ['image/webp'],
  },
  
  // Performance
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

module.exports = nextConfig
