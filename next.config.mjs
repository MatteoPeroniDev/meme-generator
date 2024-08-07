/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "i.imgflip.com",
      },
    ],
  },
};

export default nextConfig;
