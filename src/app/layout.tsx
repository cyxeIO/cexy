import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PiSDKLoader from "@/components/PiSDKLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "cexy.ai - The Future of Memory",
    template: "%s | cexy.ai"
  },
  description: "AI-powered memory curation meets blockchain security. Record, relive, and own your memories on the Pi Network.",
  keywords: ["CEXY", "memory", "AI", "blockchain", "Pi Network", "NFT", "decentralized", "beta"],
  authors: [{ name: "cexy.ai" }],
  creator: "cexy.ai",
  publisher: "cexy.ai",
  applicationName: "cexy.ai",
  icons: {
    icon: [
      { url: '/CEXY_logo_animated.gif', type: 'image/gif' },
      { url: '/cexy_logo_transparent.gif', type: 'image/gif' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/cexy_logo_transparent.gif', sizes: '180x180', type: 'image/gif' }
    ],
    shortcut: '/CEXY_logo_animated.gif'
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cexy.ai',
    title: 'cexy.ai - The Future of Memory',
    description: 'AI-powered memory curation meets blockchain security',
    siteName: 'cexy.ai'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'cexy.ai - The Future of Memory',
    description: 'AI-powered memory curation meets blockchain security',
    creator: '@cexyai'
  },
  robots: {
    index: true,
    follow: true
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        
        <PiSDKLoader />
      </body>
    </html>
  );
}
