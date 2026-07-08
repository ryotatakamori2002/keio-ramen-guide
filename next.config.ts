import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 店舗データに imageUrl を入れた時に、許諾済みの外部写真を表示できるようにする。
    // 実写真を入れる際は、信頼できるホストに絞ることを推奨。
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  experimental: {
    serverActions: {
      // 投稿写真は6MBまで許可しているため、Server Actionの既定上限(1MB)を引き上げる。
      // これが1MBのままだと、写真付き投稿がアクション実行前に拒否されて本番で500になる。
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
