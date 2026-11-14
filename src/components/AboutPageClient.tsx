
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

/* =========================================
   FLYING WHEEL - ABOUT PAGE
   Premium CycleCraft Inspired Design
========================================= */

const images = {
  explore1:
    "https://images.unsplash.com/photo-1541625602330-2277e4c46182?auto=format&fit=crop&w=1000&q=85",

  explore2:
    "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1000&q=85",

  explore3:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1000&q=85",

  newest:
    "https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=1400&q=90",

  limited1:
    "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=1200&q=85",

  limited2:
    "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=1200&q=85",

  history:
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1400&q=90",

  newsletter:
    "https://images.unsplash.com/photo-1544191696-15693072e0b8?auto=format&fit=crop&w=2000&q=90",

  story1:
    "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1000&q=85",

  story2:
    "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1000&q=85",

  story3:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1000&q=85",
};

/* =========================================
   ANIMATION VARIANTS
========================================= */

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
    },
  },
};

const features = [
  {
    number: "01",
    title: "OUR VISION",
    description:
      "To inspire more people to discover the freedom, confidence and excitement that cycling brings to everyday life.",
    icon: "↗",
  },
  {
    number: "02",
    title: "WHAT WE DO",
    description:
      "We bring riders quality bicycles, thoughtful collections and trusted guidance to help them find their perfect ride.",
    icon: "⌁",
  },
  {
    number: "03",
    title: "OUR HISTORY",
    description:
      "Built around a passion for two wheels, Flying Wheel celebrates every journey, from the first ride to the next adventure.",
    icon: "◎",
  },
];

const stories = [
  {
    category: "RIDE & EXPLORE",
    title: "WHEELS & WONDERS. DISCOVER HIDDEN GEMS ON YOUR RIDE.",
    image: images.story1,
  },
  {
    category: "BIKE CULTURE",
    title: "TWO WHEELS, ONE JOURNEY. EXPLORING NATURE'S WONDERS.",
    image: images.story2,
  },
  {
    category: "ADVENTURE",
    title: "RIDING THE WILD SIDE. CYCLING FOR ADVENTURE SEEKERS.",
    image: images.story3,
  },
];

const brandNames = [
  "SHIMANO",
  "SRAM",
  "TREK",
  "NEO",
  "PASSION",
  "SPECIALIZED",
];

/* =========================================
   REVEAL COMPONENT
========================================= */

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
      variants={fadeUp}
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.12,
      }}
      transition={{
        delay: reduceMotion ? 0 : delay,
      }}
    >
      {children}
    </motion.div>
  );
}

/* =========================================
   IMAGE COMPONENT
========================================= */

function Photo({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        priority={priority}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-[1400ms] ease-out hover:scale-[1.045]"
      />
    </div>
  );
}

/* =========================================
   SECTION LABEL
========================================= */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.28em] text-[#C58C00] sm:text-[11px]">
      {children}
    </p>
  );
}

/* =========================================
   MAIN ABOUT PAGE
========================================= */

export default function AboutPageClient() {
  const reduceMotion = useReducedMotion();

  return (
    <main className="overflow-hidden bg-[#FAFAF8] font-[var(--font-inter)] text-[#171717]">

      {/* =====================================
          01. ABOUT INTRO
      ===================================== */}

      <section className="relative px-5 pb-14 pt-36 sm:px-10 sm:pt-40 lg:px-[7%] lg:pb-20 lg:pt-44">

        <div className="mx-auto max-w-[1450px]">

          <Reveal>
            <SectionLabel>
              ABOUT FLYING WHEEL
            </SectionLabel>

            <h1 className="max-w-[1100px] text-[clamp(48px,8.5vw,116px)] font-extrabold uppercase leading-[0.92] tracking-[-0.075em]">
              MORE THAN
              <br />
              JUST A RIDE.
            </h1>

            <div className="mt-7 flex flex-col justify-between gap-6 border-t border-black/15 pt-6 md:flex-row md:items-end">

              <p className="max-w-[580px] text-sm leading-7 text-[#777] sm:text-base sm:leading-8">
                Every ride tells a story. Every road brings a new
                adventure. At Flying Wheel, we believe cycling is
                more than just getting from one place to another.
                It is freedom, passion and a way of life.
              </p>

              <Link
                href="/shop"
                className="inline-flex h-[48px] w-fit shrink-0 items-center justify-center gap-5 rounded-full border border-[#D7A600] px-7 text-[10px] font-extrabold tracking-[0.13em] transition-all duration-300 hover:bg-[#F6BD12]"
              >
                EXPLORE BICYCLES
                <span className="text-base">↗</span>
              </Link>

            </div>
          </Reveal>

        </div>
      </section>

      {/* =====================================
          02. BRAND IMAGE
      ===================================== */}

      <section className="px-5 sm:px-10 lg:px-[7%]">

        <Reveal className="mx-auto max-w-[1450px]">

          <div className="relative h-[280px] overflow-hidden bg-[#e9e8e2] sm:h-[430px] lg:h-[610px]">

            <Photo
               src={images.newest}
              alt="Cycling adventure"
              className="h-full w-full"
              priority
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

            <div className="absolute bottom-7 left-6 text-white sm:bottom-12 sm:left-12">

              <p className="mb-3 text-[9px] font-bold tracking-[0.3em] text-[#F6BD12]">
                FLYING WHEEL
              </p>

              <h2 className="text-3xl font-extrabold uppercase tracking-[-0.05em] sm:text-6xl">
                RIDE BEYOND LIMITS.
              </h2>

            </div>

            <div className="absolute right-6 top-6 hidden text-[9px] font-bold tracking-[0.25em] text-white sm:block">
              FW / EST. FOR EVERY RIDE
            </div>

          </div>

        </Reveal>

      </section>

      {/* =====================================
          03. BRAND PARTNERS
      ===================================== */}

      <section className="border-b border-black/10 bg-white py-9 sm:py-12">

        <div className="mx-auto grid max-w-[1450px] grid-cols-3 px-5 sm:grid-cols-6 sm:px-10 lg:px-[7%]">

          {brandNames.map((brand, index) => (
            <div
              key={brand}
              className="flex min-h-[65px] items-center justify-center border-r border-black/10 px-2 last:border-0 sm:min-h-[85px]"
            >
              <span className="text-center text-[10px] font-extrabold tracking-[0.12em] text-[#777] sm:text-xs">
                {brand}
              </span>
            </div>
          ))}

        </div>

      </section>

      {/* =====================================
          04. SIMPLY EXPLORE
      ===================================== */}

      <section className="px-5 py-20 sm:px-10 lg:px-[7%] lg:py-28">

        <div className="mx-auto max-w-[1450px]">

          <Reveal>
            <SectionLabel>
              DISCOVER FLYING WHEEL
            </SectionLabel>

            <h2 className="text-4xl font-extrabold uppercase tracking-[-0.06em] sm:text-6xl">
              SIMPLY EXPLORE.
            </h2>
          </Reveal>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="mt-12 grid gap-9 border-t border-black/15 pt-9 md:grid-cols-3 md:gap-8 lg:mt-16 lg:pt-12"
          >

            {features.map((feature, index) => (
              <motion.article
                variants={fadeUp}
                key={feature.number}
                className="group"
              >

                <div className="mb-7 flex items-center justify-between">

                  <span className="text-3xl font-light text-[#777] transition-colors duration-300 group-hover:text-[#C58C00]">
                    {feature.icon}
                  </span>

                  <span className="text-[10px] font-bold tracking-widest text-[#C58C00]">
                    {feature.number}
                  </span>

                </div>

                <h3 className="text-lg font-extrabold uppercase tracking-[-0.04em]">
                  {feature.title}
                </h3>

                <div className="my-4 h-[2px] w-9 bg-[#F6BD12] transition-all duration-500 group-hover:w-16" />

                <p className="max-w-[370px] text-[13px] leading-7 text-[#777]">
                  {feature.description}
                </p>

              </motion.article>
            ))}

          </motion.div>

          {/* THREE IMAGE ROW */}

          <div className="mt-14 grid gap-4 md:grid-cols-3 lg:mt-20">

            {[
              { image: images.explore1, title: "THE RIDER" },
              { image: images.explore2, title: "THE MACHINE" },
              { image: images.explore3, title: "THE ADVENTURE" },
            ].map((item, index) => (
              <Reveal key={item.title} delay={index * 0.12}>

                <div className="group relative h-[270px] overflow-hidden bg-[#e8e7e1] sm:h-[330px] lg:h-[390px]">

                  <Photo
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="absolute bottom-5 left-5 text-white">
                    <span className="text-[10px] font-bold tracking-[0.2em]">
                      0{index + 1}
                    </span>

                    <h3 className="mt-2 text-xl font-extrabold tracking-[-0.04em]">
                      {item.title}
                    </h3>
                  </div>

                </div>

              </Reveal>
            ))}

          </div>

        </div>
      </section>

      {/* =====================================
          05. NEWEST PRODUCTS
      ===================================== */}

      <section className="bg-white px-5 py-20 sm:px-10 lg:px-[7%] lg:py-28">

        <div className="mx-auto grid max-w-[1450px] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">

          <Reveal>

            <div className="relative h-[380px] overflow-hidden bg-[#e9e8e2] sm:h-[550px] lg:h-[680px]">

              <Photo
                src={images.newest}
                alt="Cyclist enjoying an outdoor ride"
                className="h-full w-full"
              />

              <div className="absolute bottom-6 left-6 bg-[#F6BD12] px-5 py-4">

                <p className="text-[9px] font-bold tracking-[0.2em]">
                  FLYING WHEEL
                </p>

                <p className="mt-1 text-lg font-extrabold uppercase tracking-tight">
                  RIDE YOUR WAY.
                </p>

              </div>

            </div>

          </Reveal>

          <Reveal delay={0.15} className="lg:pl-5">

            <SectionLabel>
              BUILT AROUND YOU
            </SectionLabel>

            <h2 className="text-[clamp(54px,7vw,100px)] font-extrabold uppercase leading-[0.9] tracking-[-0.075em]">
              THE
              <br />
              NEWEST
              <br />
              PRODUCTS.
            </h2>

            <p className="mt-7 max-w-[450px] text-sm leading-8 text-[#777] sm:text-base">
              The right bicycle makes every journey feel
              different. From everyday rides to challenging
              trails, discover bicycles designed to match
              your style, your personality and your ambition.
            </p>

            <Link
              href="/shop"
              className="mt-9 inline-flex h-[50px] items-center gap-6 rounded-full border border-[#D7A600] px-7 text-[10px] font-extrabold tracking-[0.13em] transition-all duration-300 hover:bg-[#F6BD12]"
            >
              EXPLORE BICYCLES
              <span className="text-base">↗</span>
            </Link>

          </Reveal>

        </div>

      </section>

      {/* =====================================
          06. NEW LIMITED EDITION
      ===================================== */}

      <section className="px-5 py-20 sm:px-10 lg:px-[7%] lg:py-28">

        <div className="mx-auto max-w-[1450px]">

          <Reveal className="mb-12 text-center">

            <SectionLabel>
              MADE FOR THE MOMENT
            </SectionLabel>

            <h2 className="text-[clamp(45px,7vw,90px)] font-extrabold uppercase leading-[0.9] tracking-[-0.075em]">
              NEW LIMITED EDITION.
            </h2>

            <p className="mt-5 text-sm text-[#888]">
              Discover a different side of every ride.
            </p>

          </Reveal>

          <div className="grid gap-4 md:grid-cols-2">

            <Reveal>

              <div className="relative h-[340px] overflow-hidden bg-[#e9e8e2] sm:h-[520px]">

                <Photo
                  src={images.limited1}
                  alt="Premium bicycle collection"
                  className="h-full w-full"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />

                <span className="absolute bottom-6 left-6 text-[11px] font-bold tracking-[0.2em] text-white">
                  FW / COLLECTION 01
                </span>

              </div>

            </Reveal>

            <div className="flex flex-col gap-4">

              <Reveal delay={0.12}>

                <div className="relative h-[220px] overflow-hidden bg-[#e9e8e2] sm:h-[310px]">

                  <Photo
                    src={images.limited2}
                    alt="Cycling lifestyle and adventure"
                    className="h-full w-full"
                  />

                </div>

              </Reveal>

              <Reveal delay={0.2} className="flex flex-1 flex-col items-start justify-center py-5 md:pl-8">

                <SectionLabel>
                  THE FLYING WHEEL EDITION
                </SectionLabel>

                <h3 className="max-w-[450px] text-[clamp(36px,5vw,65px)] font-extrabold uppercase leading-[0.95] tracking-[-0.065em]">
                  RIDE WITH
                  <br />
                  YOUR OWN STYLE.
                </h3>

                <p className="mt-5 max-w-[420px] text-sm leading-7 text-[#777]">
                  Every bicycle is an expression of personality.
                  Find the ride that feels uniquely yours and
                  make every journey count.
                </p>

                <Link
                  href="/collections"
                  className="mt-7 inline-flex h-[46px] items-center gap-5 rounded-full border border-[#D7A600] px-6 text-[10px] font-extrabold tracking-widest transition-colors hover:bg-[#F6BD12]"
                >
                  SHOP NOW
                  <span>↗</span>
                </Link>

              </Reveal>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================
          07. COMPANY HISTORY
      ===================================== */}

      <section className="bg-white px-5 py-20 sm:px-10 lg:px-[7%] lg:py-28">

        <div className="mx-auto grid max-w-[1450px] items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">

          <Reveal>

            <SectionLabel>
              OUR JOURNEY
            </SectionLabel>

            <h2 className="text-[clamp(58px,7vw,100px)] font-extrabold uppercase leading-[0.88] tracking-[-0.075em]">
              COMPANY
              <br />
              HISTORY.
            </h2>

            <p className="mt-7 max-w-[450px] text-sm leading-8 text-[#777] sm:text-base">
              Flying Wheel is driven by one simple belief:
              cycling should be enjoyed by everyone.
              We aim to make discovering, choosing and
              enjoying your bicycle an experience worth
              remembering.
            </p>

            <p className="mt-5 max-w-[450px] text-sm leading-8 text-[#777] sm:text-base">
              Whether you are starting your first ride or
              exploring new roads, we want to be part of
              your cycling journey.
            </p>

            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-4 border-b-2 border-[#F6BD12] pb-2 text-[10px] font-extrabold tracking-[0.15em] transition-colors hover:text-[#C58C00]"
            >
              GET TO KNOW US
              <span className="text-base">↗</span>
            </Link>

          </Reveal>

          <Reveal delay={0.15}>

            <div className="relative h-[350px] overflow-hidden bg-[#e9e8e2] sm:h-[500px] lg:h-[590px]">

              <Photo
                src={images.history}
                alt="Cyclist enjoying a journey"
                className="h-full w-full"
              />

              <div className="absolute bottom-5 right-5 bg-white px-5 py-4">

                <p className="text-[9px] font-bold tracking-[0.2em] text-[#C58C00]">
                  FLYING WHEEL
                </p>

                <p className="mt-1 text-sm font-extrabold uppercase">
                  BUILT FOR EVERY RIDE.
                </p>

              </div>

            </div>

          </Reveal>

        </div>

      </section>

      {/* =====================================
          08. NEWSLETTER / FULL WIDTH CTA
      ===================================== */}

      <section className="relative flex min-h-[430px] items-center justify-center overflow-hidden bg-[#171717] px-5 py-24 text-center sm:min-h-[550px]">

        <motion.div
          initial={{ scale: reduceMotion ? 1 : 1.08 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0"
        >

          <Photo
            src={images.newsletter}
            alt="Cycling through an outdoor trail"
            className="h-full w-full"
          />

        </motion.div>

        <div className="absolute inset-0 bg-black/60" />

        <Reveal className="relative z-10 mx-auto max-w-[850px]">

          <SectionLabel>
            JOIN THE FLYING WHEEL COMMUNITY
          </SectionLabel>

          <h2 className="text-[clamp(42px,7vw,90px)] font-extrabold uppercase leading-[0.92] tracking-[-0.07em] text-white">
            EVERY RIDE.
            <br />
            A NEW STORY.
          </h2>

          <p className="mx-auto mt-6 max-w-[510px] text-sm leading-7 text-white/75 sm:text-base">
            Find your bicycle. Discover your freedom.
            Make every moment on two wheels count.
          </p>

          <Link
            href="/shop"
            className="mt-9 inline-flex h-[52px] items-center gap-5 rounded-full bg-[#F6BD12] px-9 text-[10px] font-extrabold tracking-[0.15em] text-black transition-all duration-300 hover:bg-white"
          >
            FIND YOUR RIDE
            <span className="text-base">↗</span>
          </Link>

        </Reveal>

      </section>

      {/* =====================================
          09. BRAND VALUES
      ===================================== */}

      <section className="border-b border-black/10 bg-white px-5 py-10 sm:px-10 lg:px-[7%]">

        <Reveal>

          <div className="mx-auto grid max-w-[1450px] grid-cols-2 gap-y-7 md:grid-cols-4">

            {[
              "QUALITY FIRST",
              "RIDER FOCUSED",
              "BUILT FOR ADVENTURE",
              "RIDE WITH FREEDOM",
            ].map((item, index) => (
              <div
                key={item}
                className="flex min-h-[60px] items-center justify-center border-r border-black/10 px-2 text-center last:border-0"
              >

                <div>
                  <span className="mb-2 block text-[9px] font-bold tracking-widest text-[#C58C00]">
                    0{index + 1}
                  </span>

                  <span className="text-[10px] font-extrabold tracking-[0.1em] sm:text-xs">
                    {item}
                  </span>
                </div>

              </div>
            ))}

          </div>

        </Reveal>

      </section>

      {/* =====================================
          10. LATEST STORIES
      ===================================== */}

      <section className="px-5 py-20 sm:px-10 lg:px-[7%] lg:py-28">

        <div className="mx-auto max-w-[1450px]">

          <Reveal className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <SectionLabel>
                INSIDE THE WORLD OF CYCLING
              </SectionLabel>

              <h2 className="text-[clamp(42px,6vw,76px)] font-extrabold uppercase leading-[0.95] tracking-[-0.07em]">
                SIMPLY EXPLORE.
              </h2>

            </div>

            <Link
              href="/shop"
              className="inline-flex w-fit items-center gap-3 border-b border-[#F6BD12] pb-2 text-[10px] font-extrabold tracking-widest transition-colors hover:text-[#C58C00]"
            >
              EXPLORE MORE
              <span>↗</span>
            </Link>

          </Reveal>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid gap-8 md:grid-cols-3"
          >

            {stories.map((story, index) => (
              <motion.article
                variants={fadeUp}
                key={story.title}
                className="group"
              >

                <div className="relative h-[280px] overflow-hidden bg-[#e9e8e2] sm:h-[350px]">

                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                  />

                  <span className="absolute left-4 top-4 bg-[#F6BD12] px-3 py-2 text-[9px] font-extrabold tracking-widest">
                    0{index + 1}
                  </span>

                </div>

                <p className="mb-3 mt-6 text-[9px] font-extrabold tracking-[0.2em] text-[#C58C00]">
                  {story.category}
                </p>

                <h3 className="max-w-[370px] text-lg font-extrabold uppercase leading-snug tracking-[-0.035em]">
                  {story.title}
                </h3>

                <Link
                  href="/shop"
                  className="mt-5 inline-flex items-center gap-3 text-[10px] font-extrabold tracking-widest"
                >
                  DISCOVER MORE

                  <span className="transition-transform duration-300 group-hover:translate-x-2">
                    →
                  </span>

                </Link>

              </motion.article>
            ))}

          </motion.div>

        </div>

      </section>

    </main>
  );
}
