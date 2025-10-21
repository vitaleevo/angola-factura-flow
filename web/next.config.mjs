import withPWA from 'next-pwa';

const isProd = process.env.NODE_ENV === 'production';

const withPwa = withPWA({
  dest: 'public',
  disable: !isProd,
  register: true,
  skipWaiting: true,
});

export default withPwa({
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
});
