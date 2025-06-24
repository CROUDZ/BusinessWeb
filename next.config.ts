import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  compiler: {
    styledComponents: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  allowedDevOrigins: ['hubzenith.fr', '*.hubzenith.fr'], // :contentReference[oaicite:0]{index=0}

  webpack(config) {
    // support SVG via @svgr/webpack
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // assure la résolution de react/jsx-dev-runtime même hors de node_modules standard
    config.resolve.alias['react/jsx-dev-runtime'] = require.resolve(
      'react/jsx-dev-runtime'
    );

    // force la recherche de modules dans ./node_modules de la racine
    config.resolve.modules = [
      path.resolve(__dirname, 'node_modules'),
      'node_modules',
      ...(config.resolve.modules || []),
    ];

    config.cache = {
      type: 'filesystem',
      cacheDirectory: path.join(__dirname, '.webpack-cache'),
    };

    config.resolve.extensions.push('.ts', '.tsx');

    return config;
  },
}

export default nextConfig;
