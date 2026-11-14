
import type { Metadata } from "next";
import ShopPageClient from "@/components/ShopPageClient";

export const metadata: Metadata = {
  title: "Explore Bicycles | Flying Wheel",
  description:
    "Explore mountain bikes, road bikes, hybrid bicycles, city bikes, kids bikes and electric bicycles at Flying Wheel. Find your perfect ride.",
  keywords: [
    "Flying Wheel Bicycles",
    "Mountain Bikes",
    "Road Bikes",
    "Hybrid Bicycles",
    "Electric Bikes",
    "City Bikes",
    "Kids Bicycles",
    "Premium Bicycles",
  ],
  openGraph: {
    title: "Explore Bicycles | Flying Wheel",
    description:
      "Discover your perfect bicycle. Explore every ride with Flying Wheel.",
    type: "website",
  },
};

export default function ShopPage() {
  return <ShopPageClient />;
}
