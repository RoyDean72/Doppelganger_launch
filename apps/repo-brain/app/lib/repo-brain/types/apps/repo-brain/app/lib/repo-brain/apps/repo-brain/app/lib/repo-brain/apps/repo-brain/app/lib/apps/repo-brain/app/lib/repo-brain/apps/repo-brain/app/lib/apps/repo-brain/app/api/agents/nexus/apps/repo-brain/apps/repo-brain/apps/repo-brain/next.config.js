/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  env: {
    // These are available at build time
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
    NEXUS_AGENT_ID: process.env.NEXUS_AGENT_ID,
    DNA_SCANNER_AGENT_ID: process.env.DNA_SCANNER_AGENT_ID
  }
}

module.exports = nextConfig
