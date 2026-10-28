import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ui } from "@clerk/ui";
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
      <body className="min-h-full bg-[#121212] text-[#f2f2f2] font-sans selection:bg-white selection:text-black">
        <ClerkProvider
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ui={ui as any}
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
