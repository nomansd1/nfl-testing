/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nfl.cloudtenants.com',
        port: '',
        pathname: '/Upload/Attachment/44/**',
      }
    ],
  },
  output: 'standalone', // for Next.js 13+ to enable standalone build
}

module.exports = nextConfig