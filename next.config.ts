import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["*"],
  images: {
    domains: [
      "i.ibb.co.com",
      "10.10.7.47",
      "76.13.5.2",
      "example.com",
      "api.instantlabour.co.uk"
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
// https://example.com/images/company1.jpg


// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "http",
//         hostname: "76.13.5.2",
//         port:"5000",
//         pathname: "/images/**",
//       },
//       {
//         protocol: "https",
//         hostname: "76.13.5.2",
//         port: "5000",
//         pathname: "/images/**",
//       },
//     ],
//   },
// };

// export default nextConfig;
