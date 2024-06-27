import { withNextVideo } from "next-video/process";
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["pixabay.com","aceternity.com","images.pexels.com"],
  },
  eslint:{
    ignoreDuringBuilds: true,
  }
};

export default withNextVideo(nextConfig);