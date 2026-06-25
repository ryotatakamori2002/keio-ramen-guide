import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Keio Ramen Guide | 授業終わり、どこ啜る？",
  description:
    "日吉・三田・横浜。慶應生のためのラーメン案内。今いる場所と気分から、今日行く一杯を選べる。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground antialiased">
        <Header />
        <main className="mx-auto w-full max-w-5xl flex-1 px-5 pb-16 pt-6 sm:px-8">{children}</main>
        <footer className="border-t border-border">
          <div className="mx-auto max-w-5xl px-5 py-8 text-xs text-muted sm:px-8">
            Keio Ramen Guide — 日吉・三田・横浜のラーメンを、慶應生目線で。
            <span className="mt-1 block">価格・営業時間は変動します。訪問前に各店の最新情報をご確認ください。</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
