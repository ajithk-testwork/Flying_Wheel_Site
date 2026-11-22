"use client";

/**
 * Needs: npm i framer-motion gsap
 *
 * Same animation system as the Shop page:
 *  Framer Motion -> hero landing (all 4 sides), directional entrances, clip-path
 *                   image reveals, image parallax
 *  GSAP          -> progress bar, scroll-velocity marquee, character reveals,
 *                   value cards flying in, converging lines, pinned finale scene
 */

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ------------------------------------------------------------------ */
/* DATA                                                                */
/* ------------------------------------------------------------------ */

const images = {
  hero: "https://images.unsplash.com/photo-1541625602330-2277e4c46182?auto=format&fit=crop&w=2000&q=90",

  mission:
    "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1400&q=85",

  story:
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1400&q=85",

  adventure:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1400&q=85",

  community:
    "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=2200&q=90",
};


const values = [
  {
    number: "01",
    title: "QUALITY YOU CAN TRUST",
    description:
      "We focus on dependable bicycles, carefully selected parts and useful accessories that make every ride more enjoyable.",
    icon: "✳",
    image:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=85",
    x: -160,
    y: 0,
  },
  {
    number: "02",
    title: "PASSION FOR CYCLING",
    description:
      "We believe every rider has a story. Our goal is to help beginners and experienced cyclists feel confident on every journey.",
    icon: "↗",
    image:
      "https://images.unsplash.com/photo-1541625602330-2277e4c46182?auto=format&fit=crop&w=800&q=85",
    x: 160,
    y: 0,
  },
  {
    number: "03",
    title: "EXPERT SUPPORT",
    description:
      "From choosing your first bicycle to finding the right upgrade, we want to make your cycling decisions easier.",
    icon: "◎",
    image:
      "https://images.unsplash.com/photo-1673870861528-ec5a1c6957fd?auto=format&fit=crop&w=800&q=85",
    x: -160,
    y: 100,
  },
  {
    number: "04",
    title: "COMMUNITY FOCUSED",
    description:
      "More than a place to shop, Flying Wheel is here to encourage connection, discovery and a shared love of cycling.",
    icon: "⌁",
    image:
      "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=800&q=85",
    x: 160,
    y: 100,
  },
];


const marqueeWords = [
  "QUALITY",
  "PASSION",
  "SUPPORT",
  "COMMUNITY",
  "MOUNTAIN",
  "ROAD",
  "EVERYDAY",
];

/* ------------------------------------------------------------------ */
/* SHARED PIECES                                                       */
/* ------------------------------------------------------------------ */

type Dir = "left" | "right" | "top" | "bottom";
type ClipFrom = Dir | "center";

const EASE = [0.22, 1, 0.36, 1] as const;

const offset = (d: Dir, n = 140) =>
  ({
    left: { x: -n, y: 0 },
    right: { x: n, y: 0 },
    top: { x: 0, y: -n },
    bottom: { x: 0, y: n },
  })[d];

const clipStart: Record<ClipFrom, string> = {
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
  top: "inset(0% 0% 100% 0%)",
  bottom: "inset(100% 0% 0% 0%)",
  center: "inset(35% 35% 35% 35%)",
};

function useHydratedReducedMotion() {
  const [hydrated, setHydrated] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated && prefersReducedMotion;
}

function Enter({
  from,
  delay = 0,
  distance = 140,
  className = "",
  children,
}: {
  from: Dir;
  delay?: number;
  distance?: number;
  className?: string;
  children: ReactNode;
}) {
  const reduce = useHydratedReducedMotion();
  const o = reduce ? { x: 0, y: 0 } : offset(from, distance);
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...o }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({
  children,
  light = false,
}: {
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <p
      className={`mb-4 text-[10px] font-bold uppercase tracking-[0.28em] sm:text-[11px] ${light ? "text-[#F6BD12]" : "text-[#C58C00]"}`}
    >
      {children}
    </p>
  );
}

/** Masked characters that GSAP animates (class "gchar"). A trailing "." turns gold. */
function Chars({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, wi) => (
        <span
          key={wi}
          className="inline-block overflow-hidden pb-[0.08em] align-bottom"
        >
          {word.split("").map((c, ci, arr) => (
            <span
              key={ci}
              className={`gchar inline-block ${
                c === "." && ci === arr.length - 1 ? "text-[#F6BD12]" : ""
              }`}
            >
              {c}
            </span>
          ))}
          {"\u00A0"}
        </span>
      ))}
    </>
  );
}

function Wheel({
  className = "",
  duration = 16,
}: {
  className?: string;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      animate={reduce ? undefined : { rotate: 360 }}
      transition={{ duration, ease: "linear", repeat: Infinity }}
    >
      <circle cx="100" cy="100" r="95" strokeWidth="7" />
      <circle cx="100" cy="100" r="84" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="9" strokeWidth="4" />
      {Array.from({ length: 24 }).map((_, i) => (
        <line
          key={i}
          x1="100"
          y1="109"
          x2="100"
          y2="16"
          strokeWidth="0.9"
          transform={`rotate(${i * 15} 100 100)`}
        />
      ))}
    </motion.svg>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

/** Photo that wipes in from a direction (clip-path) and drifts with scroll. */
function Photo({
  src,
  alt,
  className = "",
  priority = false,
  from = "left",
  parallax = true,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  from?: ClipFrom;
  parallax?: boolean;
}) {
  const reduce = useHydratedReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <motion.div
      ref={ref}
      className={`group relative overflow-hidden ${className}`}
      initial={{ clipPath: reduce ? "inset(0% 0% 0% 0%)" : clipStart[from] }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1.4, ease: EASE }}
    >
      <motion.div
        style={{ y: reduce || !parallax ? 0 : y }}
        className="absolute inset-x-0 -inset-y-[10%]"
      >
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
        />
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* PAGE                                                                */
/* ------------------------------------------------------------------ */

export default function AboutPageClient() {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress: heroP } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroTextY = useTransform(heroP, [0, 1], ["0%", "-14%"]);

  /* ---------------------------- GSAP ---------------------------- */
  useEffect(() => {
    if (!rootRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        // 1. scroll progress bar
        gsap.to("[data-progress]", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
          },
        });

        // 2. marquee that speeds up with scroll velocity
        const track = gsap.to("[data-marquee]", {
          xPercent: -50,
          duration: 30,
          ease: "none",
          repeat: -1,
        });
        ScrollTrigger.create({
          onUpdate: (self) => {
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 250, 7);
            gsap.to(track, {
              timeScale: boost,
              duration: 0.2,
              overwrite: true,
            });
            gsap.to(track, {
              timeScale: 1,
              duration: 1.2,
              delay: 0.2,
              overwrite: "auto",
            });
          },
        });

        // 3. character reveals on section headings
        gsap.utils.toArray<HTMLElement>("[data-chars]").forEach((el) => {
          gsap.from(el.querySelectorAll(".gchar"), {
            yPercent: 120,
            rotate: 8,
            duration: 1.1,
            ease: "power4.out",
            stagger: 0.03,
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        });

        // 4. value cards fly in from different sides
        gsap.utils.toArray<HTMLElement>(".benefit").forEach((el, i) => {
          gsap.from(el, {
            x: Number(el.dataset.x),
            y: Number(el.dataset.y),
            opacity: 0,
            duration: 1.2,
            delay: (i % 2) * 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

        // 5. "road ahead" lines converge from both sides
        const ctaTrigger = {
          trigger: "[data-cta]",
          start: "top bottom",
          end: "top 35%",
          scrub: true,
        };
        gsap.fromTo(
          "[data-cta-a]",
          { xPercent: -25 },
          { xPercent: 0, ease: "none", scrollTrigger: ctaTrigger },
        );
        gsap.fromTo(
          "[data-cta-b]",
          { xPercent: 25 },
          { xPercent: 0, ease: "none", scrollTrigger: ctaTrigger },
        );

        // 6. pinned finale scene
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: "[data-editorial]",
            start: "top top",
            end: "+=130%",
            pin: true,
            scrub: 0.6,
          },
        });
        tl.fromTo(
          "[data-ed-img]",
          { scale: 1.3 },
          { scale: 1, ease: "none" },
          0,
        )
          .fromTo(
            "[data-ed-wheel]",
            { rotate: 0 },
            { rotate: 540, ease: "none" },
            0,
          )
          .fromTo(
            ".ed-word",
            { opacity: 0.12, yPercent: 40 },
            { opacity: 1, yPercent: 0, stagger: 0.3, ease: "none" },
            0.1,
          )
          .fromTo(
            "[data-ed-copy]",
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, ease: "none" },
            0.9,
          );
      },
      rootRef.current,
    );

    const refreshFrame = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      mm.revert();
    };
  }, []);

  const T = 1;

  return (
    <main
      ref={rootRef}
      className="overflow-x-clip bg-[#FAFAF8] font-[var(--font-inter)] text-[#171717]"
    >
      {/* scroll progress (GSAP) */}
      <div
        data-progress
        className="fixed left-0 top-0 z-50 h-[3px] w-full origin-left scale-x-0 bg-[#F6BD12]"
      />

      {/* ============================ 01 HERO (Framer landing from all 4 sides) ============================ */}
      <section
        ref={heroRef}
        className="relative overflow-hidden px-5 pb-14 pt-32 sm:px-10 sm:pb-20 sm:pt-40 lg:px-[7%]"
      >
        {/* wheel from the RIGHT */}
        <motion.div
          className="pointer-events-none absolute -right-[16vw] top-1/2 hidden -translate-y-1/2 text-[#E8E6DF] lg:block"
          initial={{ x: reduce ? 0 : 500, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.6 * T }}
        >
          <Wheel
            className="h-[46vw] max-h-[700px] w-[46vw] max-w-[700px]"
            duration={30}
          />
        </motion.div>

        {/* ghost word from the BOTTOM */}
        <motion.div
          className="pointer-events-none absolute bottom-0 right-[6%] hidden select-none text-[20vw] font-extrabold leading-[0.8] tracking-[-0.08em] text-[#171717]/[0.04] lg:block"
          initial={{ y: reduce ? 0 : "100%" }}
          animate={{ y: "8%" }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.5 * T }}
        >
          RIDE
        </motion.div>

        <div className="relative z-10 mx-auto max-w-[1450px]">
          <motion.div style={{ y: reduce ? 0 : heroTextY }}>
            {/* TOP */}
            <motion.p
              initial={{ opacity: 0, y: reduce ? 0 : -60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.3 * T }}
              className="mb-4 text-[10px] font-bold uppercase tracking-[0.28em] text-[#C58C00] sm:text-[11px]"
            >
              ABOUT FLYING WHEEL
            </motion.p>

            {/* LEFT and RIGHT */}
            <h1 className="max-w-[1100px] text-[clamp(48px,8.5vw,116px)] font-extrabold uppercase leading-[0.92] tracking-[-0.075em]">
              <span className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block"
                  initial={{ x: reduce ? 0 : "-110%" }}
                  animate={{ x: 0 }}
                  transition={{ duration: 1.2, ease: EASE, delay: 0.4 * T }}
                >
                  MORE THAN
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block"
                  initial={{ x: reduce ? 0 : "110%" }}
                  animate={{ x: 0 }}
                  transition={{ duration: 1.2, ease: EASE, delay: 0.55 * T }}
                >
                  <span
                    style={{
                      WebkitTextStroke: "2px #171717",
                      color: "transparent",
                    }}
                  >
                    JUST A RIDE
                  </span>
                  <span className="text-[#F6BD12]">.</span>
                </motion.span>
              </span>
            </h1>

            <div className="relative mt-8 pt-6">
              <motion.div
                className="absolute left-0 right-0 top-0 h-px origin-left bg-black/15"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.4, ease: EASE, delay: 0.9 * T }}
              />
              <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
                <motion.p
                  initial={{ opacity: 0, x: reduce ? 0 : -80 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, ease: EASE, delay: 0.9 * T }}
                  className="max-w-[650px] text-sm leading-8 text-[#777] sm:text-base"
                >
                  At Flying Wheel, we believe cycling is more than a ride—it is
                  a lifestyle, a passion and a journey towards better health and
                  freedom. We bring together bicycles, parts and accessories to
                  help every rider explore, commute and enjoy the road with
                  confidence.
                </motion.p>

                {/* BOTTOM */}
                <motion.div
                  initial={{ opacity: 0, y: reduce ? 0 : 80 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: EASE, delay: 1.1 * T }}
                >
                  <Link
                    href="/shop"
                    className="inline-flex h-[50px] w-fit shrink-0 items-center justify-center gap-5 rounded-full border border-[#D7A600] px-7 text-[10px] font-extrabold tracking-[0.13em] transition-all duration-300 hover:bg-[#F6BD12]"
                  >
                    EXPLORE BICYCLES <span className="text-base">↗</span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================ MARQUEE (GSAP velocity) ============================ */}
      <div
        className="overflow-hidden border-y border-[#E8E6DF] bg-white py-5"
        aria-hidden="true"
      >
        <div data-marquee className="flex w-max gap-12 whitespace-nowrap">
          {Array.from({ length: 6 }).flatMap((_, r) =>
            marqueeWords.map((w) => (
              <span
                key={`${r}-${w}`}
                className="flex items-center gap-12 text-3xl font-extrabold leading-none tracking-[-0.06em] text-[#171717] sm:text-4xl"
              >
                {w}
                <Wheel
                  className="h-7 w-7 text-[#C58C00] sm:h-8 sm:w-8"
                  duration={6}
                />
              </span>
            )),
          )}
        </div>
      </div>

      {/* ============================ 02 CINEMATIC IMAGE ============================ */}
      <section className="px-5 pt-14 sm:px-10 sm:pt-20 lg:px-[7%]">
        <div className="mx-auto max-w-[1450px]">
          <div className="relative h-[300px] overflow-hidden bg-[#e9e8e2] sm:h-[460px] lg:h-[620px]">
            <Photo
              src={images.hero}
              alt="Cyclist riding along an outdoor road"
              className="h-full w-full"
              priority
              from="center"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
            <div className="pointer-events-none absolute bottom-7 left-6 text-white sm:bottom-12 sm:left-12">
              <Enter from="left" distance={80} delay={0.5}>
                <p className="mb-3 text-[10px] font-bold tracking-[0.3em] text-[#F6BD12]">
                  THE FLYING WHEEL SPIRIT
                </p>
              </Enter>
              <Enter from="bottom" distance={80} delay={0.65}>
                <h2 className="text-3xl font-extrabold uppercase tracking-[-0.055em] sm:text-6xl">
                  RIDE YOUR FREEDOM.
                </h2>
              </Enter>
            </div>
            <div className="pointer-events-none absolute right-6 top-6 hidden sm:block">
              <Enter from="right" distance={60} delay={0.8}>
                <p className="text-[9px] font-bold tracking-[0.25em] text-white">
                  FW / MADE FOR EVERY RIDE
                </p>
              </Enter>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ 03 MISSION ============================ */}
      <section className="px-5 py-20 sm:px-10 sm:py-28 lg:px-[7%]">
        <div className="mx-auto grid max-w-[1450px] items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Enter from="top" distance={50}>
              <SectionLabel>01 / OUR MISSION</SectionLabel>
            </Enter>
            <h2
              data-chars
              className="text-[clamp(42px,6.5vw,82px)] font-extrabold uppercase leading-[0.94] tracking-[-0.075em]"
            >
              <Chars text="MAKING EVERY" />
              <br />
              <Chars text="RIDE MATTER." />
            </h2>
            <Enter from="left" delay={0.1}>
              <p className="mt-7 max-w-[570px] text-sm leading-8 text-[#777] sm:text-base">
                Our mission is to inspire more people to embrace cycling as a
                way of life. We are dedicated to offering reliable bicycles,
                quality parts and modern accessories that support comfort,
                safety and performance. Every product is selected with the aim
                of making everyday journeys smoother, healthier and more
                enjoyable.
              </p>
            </Enter>
            <Enter from="bottom" distance={50} delay={0.2}>
              <div className="mt-9 flex items-center gap-4">
                <span className="h-[2px] w-12 bg-[#F6BD12]" />
                <span className="text-[10px] font-extrabold tracking-[0.2em]">
                  RIDE WITH PURPOSE
                </span>
              </div>
            </Enter>
          </div>
          <Photo
            src={images.mission}
            alt="Bicycle ready for an outdoor ride"
            className="h-[360px] w-full sm:h-[500px] lg:h-[590px]"
            from="right"
          />
        </div>
      </section>

      {/* ============================ 04 STORY ============================ */}
      <section className="bg-white px-5 py-20 sm:px-10 sm:py-28 lg:px-[7%]">
        <div className="mx-auto grid max-w-[1450px] items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <Photo
            src={images.story}
            alt="Cyclists enjoying a ride together"
            className="h-[350px] w-full sm:h-[500px] lg:h-[590px]"
            from="left"
          />
          <div>
            <Enter from="top" distance={50}>
              <SectionLabel>02 / OUR STORY</SectionLabel>
            </Enter>
            <h2
              data-chars
              className="text-[clamp(48px,7vw,92px)] font-extrabold uppercase leading-[0.92] tracking-[-0.075em]"
            >
              <Chars text="BUILT ON" />
              <br />
              <Chars text="TWO WHEELS." />
            </h2>
            <Enter from="right" delay={0.1}>
              <p className="mt-7 text-sm leading-8 text-[#777] sm:text-base">
                Flying Wheel began with a simple idea: make cycling accessible,
                exciting and rewarding for everyone. What started with a passion
                for bicycles continues to grow through a commitment to riders,
                thoughtful products and better cycling experiences.
              </p>
            </Enter>
            <Enter from="bottom" distance={60} delay={0.2}>
              <p className="mt-5 text-sm leading-8 text-[#777] sm:text-base">
                From everyday commuters to people looking for their next
                adventure, we want every rider to feel welcome, supported and
                inspired to keep moving forward.
              </p>
            </Enter>
          </div>
        </div>
      </section>

      {/* ============================ 05 WHY CHOOSE (GSAP cards) ============================ */}
      <section className="px-5 py-20 sm:px-10 sm:py-28 lg:px-[7%]">
        <div className="mx-auto max-w-[1450px]">
          <Enter from="left">
            <SectionLabel>03 / WHY CHOOSE FLYING WHEEL</SectionLabel>
          </Enter>
          <div className="mb-12 flex flex-col justify-between gap-6 border-b border-black/15 pb-8 md:flex-row md:items-end">
            <h2
              data-chars
              className="max-w-[850px] text-[clamp(42px,7vw,88px)] font-extrabold uppercase leading-[0.92] tracking-[-0.075em]"
            >
              <Chars text="YOUR RIDE." />
              <br />
              <Chars text="OUR COMMITMENT." />
            </h2>
            <Enter from="right">
              <p className="max-w-[330px] pb-2 text-sm leading-7 text-[#777]">
                The right support makes every journey better. Here is what we
                believe every rider deserves.
              </p>
            </Enter>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {values.map((item) => (
              <div
                key={item.number}
                data-x={item.x}
                data-y={item.y}
                className="benefit"
              >
                <div className="group relative h-full overflow-hidden border border-[#E8E6DF] bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:border-[#D7A600] sm:p-10">
                  <Wheel
                    duration={12}
                    className="absolute -right-12 -top-12 h-40 w-40 text-[#E8E6DF] transition-colors duration-500 group-hover:text-[#F6BD12]"
                  />
                  <div className="relative mb-16 flex items-center gap-4">
                    <span className="text-[10px] font-bold tracking-widest text-[#C58C00]">
                      {item.number}
                    </span>
                    <span className="text-3xl font-light text-[#C58C00] transition-transform duration-300 group-hover:-translate-y-1">
                      {item.icon}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold uppercase tracking-[-0.04em] sm:text-xl">
                    {item.title}
                  </h3>
                  <div className="my-4 h-[2px] w-9 bg-[#F6BD12] transition-all duration-500 group-hover:w-16" />
                  <p className="max-w-[420px] text-[13px] leading-7 text-[#777] sm:text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ 06 LOOKING AHEAD (GSAP converge) ============================ */}
      <section
        data-cta
        className="overflow-hidden bg-white px-5 py-20 sm:px-10 sm:py-28 lg:px-[7%]"
      >
        <div className="mx-auto grid max-w-[1450px] items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <Enter from="top" distance={50}>
              <SectionLabel>04 / LOOKING AHEAD</SectionLabel>
            </Enter>
            <h2 className="text-[clamp(48px,7vw,90px)] font-extrabold uppercase leading-[0.92] tracking-[-0.075em]">
              <div data-cta-a>THE ROAD</div>
              <div data-cta-b>AHEAD IS</div>
              <div data-cta-a>
                YOURS<span className="text-[#F6BD12]">.</span>
              </div>
            </h2>
            <Enter from="left" delay={0.1}>
              <p className="mt-7 max-w-[520px] text-sm leading-8 text-[#777] sm:text-base">
                At Flying Wheel, we keep looking towards the future of cycling.
                From eco-conscious options to performance-focused bicycles, we
                aim to support riders with products and experiences that move
                cycling forward. Wherever your journey takes you, we are here to
                help you enjoy the ride.
              </p>
            </Enter>
            <Enter from="bottom" distance={60} delay={0.2}>
              <Link
                href="/shop"
                className="group mt-8 inline-flex h-[50px] items-center gap-5 rounded-full bg-[#F6BD12] px-7 text-[10px] font-extrabold tracking-[0.14em] text-black transition-all duration-300 hover:bg-black hover:text-white"
              >
                FIND YOUR NEXT RIDE
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 transition-all duration-500 group-hover:rotate-[-45deg]">
                  <ArrowIcon className="h-4 w-4" />
                </span>
              </Link>
            </Enter>
          </div>
          <Photo
            src={images.adventure}
            alt="Mountain bicycle ready for an adventure"
            className="h-[350px] w-full sm:h-[500px] lg:h-[600px]"
            from="bottom"
          />
        </div>
      </section>

      {/* ============================ 07 JOIN THE RIDE (GSAP pinned scene) ============================ */}
      <section
        data-editorial
        className="relative flex h-screen min-h-[620px] items-center overflow-hidden bg-[#171717]"
      >
        <div data-ed-img className="absolute inset-0">
          <Image
            src={images.community}
            alt="Cycling community riding outdoors"
            fill
            unoptimized
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/60" />

        <div
          data-ed-wheel
          className="pointer-events-none absolute -left-24 bottom-[-120px] text-white/20"
        >
          <svg
            viewBox="0 0 200 200"
            className="h-[420px] w-[420px]"
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
          >
            <circle cx="100" cy="100" r="95" strokeWidth="6" />
            <circle cx="100" cy="100" r="9" strokeWidth="4" />
            {Array.from({ length: 24 }).map((_, i) => (
              <line
                key={i}
                x1="100"
                y1="109"
                x2="100"
                y2="16"
                strokeWidth="0.9"
                transform={`rotate(${i * 15} 100 100)`}
              />
            ))}
          </svg>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1450px] px-5 sm:px-10 lg:px-[7%]">
          <SectionLabel light>JOIN THE FLYING WHEEL COMMUNITY</SectionLabel>
          <h2 className="text-[clamp(38px,8vw,120px)] font-extrabold uppercase leading-[0.92] tracking-[-0.075em] text-white">
            <span className="ed-word inline-block">MTB.</span>{" "}
            <span className="ed-word inline-block">ROAD.</span>{" "}
            <span className="ed-word inline-block">EVERYDAY.</span>
            <br />
            <span className="ed-word inline-block">ONE</span>{" "}
            <span className="ed-word inline-block">
              COMMUNITY<span className="text-[#F6BD12]">.</span>
            </span>
          </h2>
          <div data-ed-copy>
            <p className="mt-8 max-w-[520px] text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
              Be part of our growing cycling family. Discover the thrill, style
              and freedom of every journey on two wheels.
            </p>
            <a
              href="https://wa.me/919789479615"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-9 inline-flex h-[52px] items-center gap-5 rounded-full bg-[#F6BD12] px-9 text-[10px] font-extrabold tracking-[0.15em] text-black transition-colors duration-300 hover:bg-white"
            >
              JOIN THE COMMUNITY <span className="text-base">↗</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
