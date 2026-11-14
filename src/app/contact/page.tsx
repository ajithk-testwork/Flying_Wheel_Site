
import type { Metadata } from "next";
import ContactPageClient from "@/components/ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Flying Wheel | Bicycle Shop in Chennai",
  description:
    "Get in touch with Flying Wheel – The Cyclist Den in Chennai. Enquire about bicycles, book a test ride, ask about servicing and discover your next ride.",
  keywords: [
    "Flying Wheel",
    "Flying Wheel Chennai",
    "bicycle shop Chennai",
    "buy bicycles Chennai",
    "bike test ride",
    "bicycle service Chennai",
    "cycling shop",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Flying Wheel | Let's Talk Bicycles",
    description:
      "Questions about a bike, service or test ride? Contact Flying Wheel and find your next ride.",
    url: "/contact",
    siteName: "Flying Wheel",
    type: "website",
    images: [
      {
        url: "/images/contact-og.jpg",
        width: 1200,
        height: 630,
        alt: "Flying Wheel bicycle store",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
