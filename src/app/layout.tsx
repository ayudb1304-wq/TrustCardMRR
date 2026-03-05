import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter, Playwrite_NZ } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playwriteNZ = Playwrite_NZ({
  variable: "--font-playwrite-nz",
  weight: ["100", "200", "300", "400"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
  ),
  title: "TrustCard — Verified MRR Badges for Founders",
  description:
    "Generate embeddable, Stripe-verified MRR cards for your landing page. Powered by TrustMRR.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playwriteNZ.variable} ${inter.variable} antialiased overflow-x-hidden`}
        suppressHydrationWarning
      >
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
