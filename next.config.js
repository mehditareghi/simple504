/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    // Ignore TypeScript build errors
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["zzpwvmxqxsbsywowrsdd.supabase.co"],
  },
};

module.exports = nextConfig;
