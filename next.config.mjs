import { withNextVideo } from "next-video/process";
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["pixabay.com"],
  },
};

export default withNextVideo(nextConfig);