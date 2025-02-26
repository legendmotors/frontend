import createNextIntlPlugin from 'next-intl/plugin';

// Wrap your existing Next.js configuration with the next-intl plugin
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Retain your existing configuration
  },
  async rewrites() {
    return [
      {
        source: '/clevertap/:path*',
        destination: 'https://api.clevertap.com/1/:path*', // CleverTap API proxy
      },
    ];
  },
};

// Export the updated configuration
export default withNextIntl(nextConfig);
