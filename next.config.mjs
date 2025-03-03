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

export default nextConfig;
