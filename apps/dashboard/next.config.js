/** @type {import('next').NextConfig} */
// Reload triggered at 2026-02-03 00:21
const nextConfig = {
  reactStrictMode: true,

  // Disable TypeScript errors during build (optional)
  typescript: {
    ignoreBuildErrors: true,
  },

  // Disable ESLint during build (optional)
  eslint: {
    ignoreDuringBuilds: true,
  },

  webpack: (config, { isServer, dev }) => {
    // Fix for nodemailer fs module error
    if (!isServer) {
      // Don't resolve 'fs' module on the client to prevent this error
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        // Add these if needed for other modules
        stream: require.resolve('stream-browserify'),
        crypto: require.resolve('crypto-browserify'),
        zlib: require.resolve('browserify-zlib'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        path: require.resolve('path-browserify'),
        querystring: require.resolve('querystring-es3'),
        vm: require.resolve('vm-browserify'),
      };
    }

    // Fix for pg-native warnings
    if (isServer) {
      config.externals.push({
        'pg-native': 'commonjs pg-native',
      });
    }

    // Optional: Add alias for problematic modules
    config.resolve.alias = {
      ...config.resolve.alias,
      // Add any problematic module aliases here if needed
    };

    // Optional: Enable source maps in development
    if (dev) {
      config.devtool = 'eval-source-map';
    }

    return config;
  },

  // Experimental features (optional)
  experimental: {
    // Enable if you need server actions
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.vercel.app'],
    },
    // Improve build performance
    optimizeCss: false,
    // Next.js 14 features
    typedRoutes: true,
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

  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig