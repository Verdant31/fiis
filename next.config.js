/** @type {import('next').NextConfig} */

const nextConfig = {
  rewrites: () => {
    return [
      {
        source: '/api/:path*',
        destination: 'https://finance.yahoo.com/:path*',
      },
    ]
  },
  experimental: {
    serverComponentsExternalPackages: ['@node-rs/argon2', 'yahoo-finance2'],
  },
}

module.exports = nextConfig
