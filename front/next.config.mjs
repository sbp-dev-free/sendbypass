/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        hostname: 'api-dev.sendbypass.com',
      },
      {
        hostname: 'api.sendbypass.com',
      },
      {
        hostname: 'sendbypass.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/search',
        destination: '/search/send',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
