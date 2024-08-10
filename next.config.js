/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@node-rs/argon2', 'yahoo-finance2'],
  },
}

module.exports = nextConfig
