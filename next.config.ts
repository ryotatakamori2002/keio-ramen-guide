import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 店舗データに imageUrl を入れた時に、許諾済みの外部写真を表示できるようにする。
    // 実写真を入れる際は、信頼できるホストに絞ることを推奨。
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
