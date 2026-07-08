import type { Metadata } from "next";
import Link from "next/link";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import MotionProvider from "@/components/motion/MotionProvider";
import { copy } from "@/content/site-copy";
import { container } from "@/lib/design";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// OG画像などの絶対URLの基準。Vercel上では本番URLが自動で入る。
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: copy.metadata.title,
    template: "%s",
  },
  description: copy.metadata.description,
  applicationName: copy.serviceName,
  openGraph: {
    type: "website",
    siteName: copy.serviceName,
    title: copy.metadata.ogTitle,
    description: copy.metadata.ogDescription,
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: copy.metadata.ogTitle,
    description: copy.metadata.ogDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground antialiased">
        <MotionProvider>
          <Header />
          <main className={`${container} flex-1 pb-20 pt-6`}>{children}</main>
          <footer className="border-t border-border">
            <div className={`${container} py-10`}>
              <nav aria-label="フッター">
                <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
                  {[
                    { href: "/shops", label: copy.nav.shops },
                    { href: "/map", label: copy.nav.map },
                    { href: "/quiz", label: copy.nav.quiz },
                    { href: "/post", label: copy.nav.post },
                    { href: "/insights", label: copy.nav.insights },
                    { href: "/saved", label: copy.nav.saved },
                    { href: "/shops/request", label: copy.request.title },
                  ].map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="text-muted transition-colors hover:text-foreground">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <p className="mt-5 text-xs leading-relaxed text-muted">{copy.footer}</p>
            </div>
          </footer>
        </MotionProvider>
      </body>
    </html>
  );
}
