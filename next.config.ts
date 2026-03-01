import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: '(advisor\\.finpeace\\.cloud|advisor\\.localhost)',
          },
        ],
        destination: '/advisor/:path*',
      },
    ]
  },
};

export default nextConfig;
