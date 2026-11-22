"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp, ArrowUpRight, MessageCircle } from "lucide-react";

type Category = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  iconImage: string;
  href: string;
};

const categories: Category[] = [
  {
    id: "bikes",
    label: "BIKES",
    eyebrow: "THE RIDE",
    title: "BUILT FOR EVERY RIDE.",
    description:
      "Find a bicycle that fits your pace, your path and the way you want to ride.",
    image: "/images/home/body.webp",
    iconImage: "/images/home/body1.png",
    href: "/shop?category=bikes",
  },
  {
    id: "components",
    label: "COMPONENTS",
    eyebrow: "THE DETAILS",
    title: "PERFORMANCE IN EVERY PART.",
    description:
      "Explore the components that bring control, confidence and precision to every journey.",
    image: "/images/home/chain.webp",
    iconImage: "/images/home/chain2.png",
    href: "/shop?category=components",
  },
  {
    id: "helmets",
    label: "HELMETS",
    eyebrow: "RIDE WITH CONFIDENCE",
    title: "PROTECTION THAT MOVES WITH YOU.",
    description:
      "Discover cycling essentials designed to help you ride with comfort and confidence.",
    image: "/images/home/gear.webp",
    iconImage: "/images/home/gear3.png",
    href: "/shop?category=helmets",
  },
  {
    id: "apparel",
    label: "APPAREL",
    eyebrow: "MADE TO MOVE",
    title: "COMFORT FOR THE LONG RIDE.",
    description:
      "Get ready for every mile with cycling wear and accessories made for the journey.",
    image: "/images/home/jersey.webp",
    iconImage: "/images/home/jersey4.png",
    href: "/shop?category=apparel",
  },
];

const heroImage = "/images/home/homeslider.webp";

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: reduceMotion ? 0 : 0.7,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export default function HomeRideShowcase() {
  const [activeCategory, setActiveCategory] = useState("bikes");
  const selected =
    categories.find((category) => category.id === activeCategory) ??
    categories[0];

  return (
    <main className="overflow-hidden bg-white text-[#111]">
      {/* HERO — split editorial layout */}
      <section className="grid min-h-[620px] grid-cols-1 border-b border-black/10 lg:min-h-[690px] lg:grid-cols-2">
        <div className="relative flex min-h-[490px] flex-col justify-between overflow-hidden px-6 pb-10 pt-14 sm:px-10 sm:pb-12 sm:pt-16 lg:min-h-[690px] lg:px-[9%] lg:pb-14 lg:pt-16">
          <div className="relative z-10">
            <p className="mb-4 text-[9px] font-bold uppercase tracking-[0.28em] text-[#8A8A8A]">
              FLYING WHEEL / RIDE YOUR WAY
            </p>
            <h1 className="max-w-[600px] text-[clamp(37px,5vw,70px)] font-black uppercase leading-[0.94] tracking-[-0.065em]">
              EVERYTHING
              <br />
              FOR YOUR RIDE
              <span className="text-[#F6BD12]">.</span>
            </h1>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-5 top-[28%] select-none text-[clamp(130px,24vw,300px)] font-black uppercase leading-none tracking-[-0.09em] text-[#F1F1EF] sm:left-8 lg:left-10"
          >
            RIDE
          </div>

          <div className="relative z-10 mt-16 flex flex-col items-start">
            <p className="mb-7 max-w-[380px] text-sm leading-7 text-[#777] sm:text-base">
              From your first ride to your next big adventure, discover bicycles
              and cycling essentials made for every journey.
            </p>
            <Link
              href="/shop"
              className="group inline-flex h-[48px] items-center gap-5 rounded-full border border-[#E2A900] px-7 text-[10px] font-extrabold tracking-[0.15em] transition-all duration-300 hover:bg-[#F6BD12]"
            >
              SHOP BICYCLES
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>

          <div className="relative z-10 mt-12 flex items-center gap-3 text-[9px] font-bold tracking-[0.2em] text-[#999]">
            <span className="h-px w-10 bg-[#F6BD12]" />
            DESIGNED AROUND THE RIDE
          </div>
        </div>

        <div className="group relative min-h-[430px] overflow-hidden bg-[#e7e6df] lg:min-h-[690px]">
          <Image
            src={heroImage}
            alt="Cyclist riding outdoors"
            fill
            priority
            unoptimized
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-[1.035]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/5" />

          <div className="absolute right-5 top-5 flex items-center gap-2 text-[9px] font-bold tracking-[0.2em] text-white sm:right-8 sm:top-8">
            <span className="h-2 w-2 rounded-full bg-[#F6BD12]" />
            FLYING WHEEL / EST. FOR EVERY RIDE
          </div>

          <div className="absolute bottom-6 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-9 sm:left-8 sm:right-8">
            <div className="text-white">
              <p className="mb-2 text-[9px] font-bold tracking-[0.25em] text-[#F6BD12]">
                FIND YOUR NEXT ADVENTURE
              </p>
              <p className="max-w-[390px] text-2xl font-black uppercase leading-tight tracking-[-0.04em] sm:text-4xl">
                ONE BIKE.
                <br />
                ENDLESS POSSIBILITIES.
              </p>
            </div>
            <Link
              href="/shop"
              aria-label="Explore bicycles"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F6BD12] text-black transition-transform duration-300 hover:scale-110"
            >
              <ArrowUpRight size={21} />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED COLLECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-2 items-stretch border-b border-black/10">
        {/* LEFT - IMAGE */}
        <div className="relative w-full min-h-[380px] sm:min-h-[500px] lg:min-h-[620px] overflow-hidden bg-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="absolute inset-0"
            >
              <Image
                src={selected.image}
                alt={`${selected.label.toLowerCase()} collection`}
                fill
                priority
                unoptimized
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </motion.div>
          </AnimatePresence>

          {/* COLLECTION LABEL */}
          <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 bg-white/95 px-5 py-3">
            <p className="text-[9px] font-bold tracking-[0.2em] text-[#A17A00]">
              FLYING WHEEL COLLECTION
            </p>
            <p className="mt-1 text-xs font-black uppercase tracking-wide text-black">
              {selected.label}
            </p>
          </div>
        </div>

        {/* RIGHT - CONTENT */}
        <div className="flex w-full min-h-[500px] lg:min-h-[620px] flex-col justify-between bg-white px-6 py-12 sm:px-10 sm:py-14 lg:px-[10%] lg:py-16">
          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#A17A00]">
              {selected.eyebrow}
            </p>

            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id + "-heading"}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                <h2 className="max-w-[600px] text-[clamp(34px,4.2vw,62px)] font-black uppercase leading-[1.02] tracking-[-0.055em] text-[#111]">
                  {selected.title}
                </h2>

                <p className="mt-6 max-w-[450px] text-sm leading-7 text-[#777]">
                  {selected.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* CATEGORY SELECTOR */}
          <div className="mt-12 lg:mt-0">
            <p className="mb-6 text-[9px] font-bold tracking-[0.23em] text-[#999]">
              EXPLORE BY CATEGORY
            </p>

            <div className="grid grid-cols-4 gap-3 sm:max-w-[440px] sm:gap-4">
              {categories.map((category) => {
                const isActive = activeCategory === category.id;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setActiveCategory(category.id)}
                    aria-pressed={isActive}
                    aria-label={`Show ${category.label} category`}
                    className="group flex min-w-0 flex-col items-center gap-3"
                  >
                    <span
                      className={`relative block aspect-square w-full overflow-hidden rounded-xl border-2 bg-white transition-all duration-300 ${
                        isActive
                          ? "border-[#F6BD12] shadow-[0_5px_20px_rgba(246,189,18,0.15)]"
                          : "border-[#E5E5E5] hover:border-[#F6BD12]"
                      }`}
                    >
                      <Image
                        src={category.iconImage}
                        alt={category.label}
                        fill
                        unoptimized
                        sizes="100px"
                        className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                      />
                    </span>

                    <span
                      className={`text-center text-[8px] font-extrabold tracking-[0.07em] sm:text-[9px] ${
                        isActive ? "text-[#A17A00]" : "text-[#333]"
                      }`}
                    >
                      {category.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* EXPLORE BUTTON */}
            <Link
              href={selected.href}
              className="group mt-8 inline-flex h-[50px] items-center gap-6 rounded-full bg-[#F6BD12] px-8 text-[10px] font-extrabold tracking-[0.14em] text-black transition-all duration-300 hover:bg-black hover:text-white"
            >
              EXPLORE {selected.label}
              <ArrowUpRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* PROMOTIONAL MARQUEE */}
      <section
        aria-label="Flying Wheel promotion"
        className="overflow-hidden border-b border-black/10 bg-[#F6BD12] py-5 sm:py-7"
      >
        <div className="fw-marquee-track flex w-max items-center">
          {[0, 1, 2, 3].map((item) => (
            <span
              key={item}
              className="flex items-center gap-7 px-4 text-[clamp(28px,5vw,66px)] font-black uppercase leading-none tracking-[-0.065em] text-black sm:gap-10 sm:px-7"
            >
              RIDE MORE. EXPLORE MORE.
              <span className="text-white">✳</span>
              FLYING WHEEL
              <span className="text-white">✳</span>
            </span>
          ))}
        </div>
      </section>

      <style jsx>{`
        .fw-marquee-track {
          animation: fw-marquee 28s linear infinite;
        }
        .fw-marquee-track:hover {
          animation-play-state: paused;
        }
        @keyframes fw-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .fw-marquee-track {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}
