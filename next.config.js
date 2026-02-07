/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  // CRITICAL: Add output standalone
  output: 'standalone',

  // Fix: Specify correct project root to silence lockfile warning
  outputFileTracingRoot: __dirname,

  // CRITICAL: Disable redirect since you have app/page.tsx
  // Remove or comment out the redirects section

  reactStrictMode: true,

  // Disable TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Simplify webpack config
  webpack: (config, { isServer }) => {
    // Fix for nodemailer fs module error
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Fix for pg-native
    if (isServer) {
      config.externals.push('pg-native');
    }

    return config;
  },

  // Images configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/docs',
        destination: '/docs.html',
      },
      {
        source: '/compliance',
        destination: '/compliance.html',
      },
      {
        source: '/support-hub',
        destination: '/support.html',
      },
    ]
  },
}

module.exports = nextConfig;