import type { Metadata } from "next";
import { Geist, Shippori_Mincho } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const shipporiMincho = Shippori_Mincho({
  variable: "--font-shippori-mincho",
  weight: ["500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Keio Ramen Guide | 授業終わりに、外さない一杯を。",
  description:
    "日吉・三田・横浜。慶應生の生活シーンに合わせてラーメン屋を選べる、編集されたミニガイド。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${shipporiMincho.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground antialiased">
        <Header />
        <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-16 pt-2 sm:px-8 sm:pt-4">{children}</main>
        <footer className="border-t border-border px-5 py-8 text-center text-xs text-muted sm:px-8">
          Keio Ramen Guide — 慶應生のための、日吉・三田・横浜ラーメン案内
        </footer>
      </body>
    </html>
  );
}
