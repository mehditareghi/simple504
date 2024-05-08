/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
});

module.exports = withPWA({
  images: {
    domains: ['simple504minio.darkube.app', 'localhost'],
  },
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
});
