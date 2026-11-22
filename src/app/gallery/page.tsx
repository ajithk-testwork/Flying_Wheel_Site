
import type { Metadata } from "next";
import GalleryPageClient from "@/components/gallery/GalleryPageClient";

export const metadata: Metadata = {
  title: "Bicycle Gallery & Cycling Adventures | Flying Wheel",

  description:
    "Explore the Flying Wheel bicycle gallery featuring mountain bikes, road cycling, cycling adventures, lifestyle photography and community moments.",

  keywords    : [
    "Flying Wheel Gallery",
    "Bicycle Gallery",
    "Mountain Bike Photos",
    "Cycling Photography",
    "Road Cycling Gallery",
    "Bicycle Collection",
    "Cycling Community",
  ],

  openGraph: {
    title: "Bicycle Gallery | Flying Wheel",
    description:
      "Explore bicycle photography, cycling adventures and unforgettable moments from Flying Wheel.",
    type: "website",
    images: [
      {
        url: "/images/gallery/gallery-og.webp",
        width: 1200,
        height: 630,
        alt: "Flying Wheel Bicycle Gallery",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Gallery | Flying Wheel",
    description:
      "Discover cycling adventures and bicycle photography.",
    images: ["/images/gallery/gallery-og.webp"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function GalleryPage() {
  return <GalleryPageClient />;
}
