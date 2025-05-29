import type { NextConfig } from 'next';

import { validateEnv } from '@/config/env';

validateEnv();

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    ppr: true,
    inlineCss: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.centraqa.com',
        pathname: '/client/dynamic/images/**',
      },
      {
        protocol: 'https',
        hostname: '*.centra.com',
        pathname: '/client/dynamic/images/**',
      },
    ],
  },
};

export default nextConfig;
