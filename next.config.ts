import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["res.cloudinary.com"], // ✅ Cho phép ảnh từ Cloudinary
  },
  experimental: {
    serverActions: {},
  },
};

export default nextConfig;
