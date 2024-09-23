/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [
      '@node-rs/argon2',
      'yahoo-finance2',
      'jszip',
      'papaparse',
      '@react-pdf/renderer',
      'html-to-image',
    ],
  },
}

module.exports = nextConfig
