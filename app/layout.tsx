import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import PageProgress from "@/components/motion/PageProgress";
import { copy } from "@/content/site-copy";
import { container } from "@/lib/design";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://keio-ramen-guide.example.com"),
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
    card: "summary",
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
        <PageProgress />
        <Header />
        <main className={`${container} flex-1 pb-20 pt-6`}>{children}</main>
        <footer className="border-t border-border">
          <div className={`${container} py-10 text-xs leading-relaxed text-muted`}>{copy.footer}</div>
        </footer>
      </body>
    </html>
  );
}
