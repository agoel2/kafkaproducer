/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    data: require('./public/samples.json'),
  },
}

module.exports = nextConfig
