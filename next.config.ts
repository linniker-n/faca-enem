import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Required for Cloudflare Pages edge runtime
  experimental: {
    // no extra flags needed
  },
}

export default nextConfig
