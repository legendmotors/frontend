import createNextIntlPlugin from 'next-intl/plugin';

// Wrap your existing Next.js configuration with the next-intl plugin
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Retain your existing configuration
  },
};

// Export the updated configuration
export default withNextIntl(nextConfig);
