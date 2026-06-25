import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Keio Ramen Guide | 授業終わりに、外さない一杯を。",
  description:
    "日吉・三田・横浜エリアの慶應生向けミニラーメンガイド。シーンや気分で、今行くべき一杯を見つけられます。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <Header />
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-24 pt-4 sm:px-6 sm:pb-10">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
