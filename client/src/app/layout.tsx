import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Figtree, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { site, SITE_DESCRIPTION } from "@/shared/lib/site-config";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  themeColor: "#24bce8",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: site.origin ? new URL(site.origin) : undefined,
  title: "Infraly | Form backend and lead management",
  description: SITE_DESCRIPTION,
  robots: { index: false, follow: true },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/logo.svg", sizes: "any", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider appearance={{ variables: { colorPrimary: "#303236", colorForeground: "#303236", colorMutedForeground: "#6d7888", borderRadius: "0.875rem", fontFamily: "var(--font-inter), Arial, sans-serif" } }}>
      <html
        lang="en"
        className={`${figtree.variable} ${inter.variable} h-full antialiased`}
      >
        <body className="min-h-full bg-white text-slate-900 font-sans selection:bg-blue-500/20 selection:text-blue-900">
          {children}
          <Analytics />
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-NT8ZP868HF"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-NT8ZP868HF');
            `}
          </Script>
        </body>
      </html>
    </ClerkProvider>
  );
}