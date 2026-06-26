import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Eliminamos output: 'export' para usar SSR en Netlify
  // distDir: 'dist' también lo quitamos, usa .next por defecto
  images: {
    unoptimized: true,
  },
};

export default nextConfig;