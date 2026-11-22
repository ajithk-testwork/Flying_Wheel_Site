
import type { Metadata } from "next";
import BlogPageClient from "@/components/blog/BlogPageClient";

export const metadata: Metadata = {
  title: "Cycling Blog & Guides | Flying Wheel",
  description:
    "Explore the Flying Wheel cycling blog for mountain bike guides, bicycle maintenance tips, cycling adventures and expert riding advice.",

  keywords: [
    "Flying Wheel Blog",
    "Cycling Blog",
    "Mountain Bike Guides",
    "Bicycle Maintenance Tips",
    "Cycling Tips",
    "Bike Riding Guides",
    "Cycling Adventures",
  ],

  openGraph: {
    title: "Cycling Blog & Guides | Flying Wheel",
    description:
      "Discover cycling tips, bicycle guides, maintenance advice and inspiring cycling stories with Flying Wheel.",
    type: "website",
    images: [
      {
        url: "/images/blog/blog-og.webp",
        width: 1200,
        height: 630,
        alt: "Flying Wheel Cycling Blog",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Cycling Blog | Flying Wheel",
    description:
      "Cycling tips, bicycle guides and adventures from Flying Wheel.",
    images: ["/images/blog/blog-og.webp"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function BlogPage() {
  return <BlogPageClient />
}
