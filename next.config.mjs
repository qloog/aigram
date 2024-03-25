/** @type {import('next').NextConfig} */
const nextConfig = {
  typeScript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com"
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev"
      }
    ]
  }
};

export default nextConfig;
