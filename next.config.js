/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
});

module.exports = withPWA({
  images: {
    domains: ['simple504minio.darkube.app'],
  },
  reactStrictMode: true,
});

