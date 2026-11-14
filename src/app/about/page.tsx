
import type { Metadata } from "next";
import AboutPageClient from "@/components/AboutPageClient";

export const metadata: Metadata = {
  title: "About Flying Wheel | Our Cycling Story",
  description:
    "Discover Flying Wheel. Explore our passion for cycling, quality bicycles, our vision, and our commitment to every rider.",
  keywords: [
    "Flying Wheel",
    "About Flying Wheel",
    "Bicycles",
    "Mountain Bikes",
    "Cycling",
    "Premium Bicycles",
    "Cycling Community",
  ],
  openGraph: {
    title: "About Flying Wheel | Ride Beyond Limits",
    description:
      "Our passion is cycling. Discover the story, vision and people behind Flying Wheel.",
    type: "website",
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
