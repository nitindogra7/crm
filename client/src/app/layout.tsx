import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import type { Metadata } from "next";
import { Figtree, Inter } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Salenova | Effortless form backend without the setup",
  description:
    "Skip the backend setup, server maintenance, and spam headaches. Collect, protect, and manage website form submissions with a single endpoint.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Inter:ital,opsz,wght@0,14..32,400..700;1,14..32,400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-[#121212] text-[#f2f2f2] font-sans selection:bg-white selection:text-black">
        <ClerkProvider
          appearance={{
            theme: dark,
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}