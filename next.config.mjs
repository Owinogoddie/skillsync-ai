import { withNextVideo } from "next-video/process";
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["pixabay.com"],
  },
  eslint:{
    ignoreDuringBuilds: true,
  }
};

export default withNextVideo(nextConfig);