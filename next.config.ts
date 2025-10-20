import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // 禁用 Next.js 热重载，由 nodemon 处理重编译
  reactStrictMode: false,
  webpack: (config, { dev }) => {
    if (dev) {
      // 禁用 webpack 的热模块替换
      config.watchOptions = {
        ignored: ['**/*'], // 忽略所有文件变化
      };
    }
    return config;
  },
  eslint: {
    // 构建时忽略ESLint错误
    ignoreDuringBuilds: true,
  },
  // Configuration pour le développement avec API routes
  // Pas d'export statique en développement pour permettre les API routes
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Décommentez ces lignes si vous déployez sur GitHub Pages
  // avec un repository nommé "master-lab"
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/master-lab/' : '',
  // basePath: process.env.NODE_ENV === 'production' ? '/master-lab' : '',
};

export default nextConfig;
