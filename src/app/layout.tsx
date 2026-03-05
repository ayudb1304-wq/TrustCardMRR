import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter, Playwrite_NZ } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { OrganizationAndAppJsonLd } from "@/components/JsonLd";
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
  title: "TrustCard | Verified MRR Widget & Revenue Badge",
  description:
    "Free trust badge for your landing page. Verified MRR widget. Works with Stripe, LemonSqueezy, DodoPayment, Polar, RevenueCat. Get your embed code.",
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
        <OrganizationAndAppJsonLd />
        <Navbar />
        <div className="flex min-h-screen flex-col">
          {children}
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
