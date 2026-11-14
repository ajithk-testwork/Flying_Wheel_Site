
import type { Metadata } from "next";
import {
  Bebas_Neue,
  Oswald,
  Inter,
} from "next/font/google";

import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yourdomain.com"),
  title: {
    default: "Flying Wheel | Ride Beyond Limits",
    template: "%s | Flying Wheel",
  },
  description:
    "Discover premium bicycles engineered for performance. Explore the Flying Wheel bicycle collection.",
  keywords: [
    "Flying Wheel",
    "Bicycles",
    "Mountain Bikes",
    "Electric Bikes",
    "Bicycle Shop",
  ],
  openGraph: {
    title: "Flying Wheel | Ride Beyond Limits",
    description:
      "Discover premium bicycles and find your perfect ride.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${oswald.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-white font-sans text-[#171717] antialiased">
        <Navbar />

        <main className="relative w-full">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
