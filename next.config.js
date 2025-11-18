module.exports = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    domains: ['your-cdn.com', 'wp-siteground-domain.com', 'source.unsplash.com'],
  },
  env: {
    GRAPHQL_ENDPOINT: process.env.GRAPHQL_ENDPOINT,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  },
  async redirects() {
    return [
      {
        source: '/store/:category',
        destination: '/shop/:category',
        permanent: true,
      },
    ];
  },
};
