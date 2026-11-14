"use client";

/**
 * Needs: npm i framer-motion gsap
 *
 * BRAND PALETTE (same as About page)
 *  Golden Yellow  #F6BD12  accent / CTA
 *  Dark gold      #C58C00  small labels + numbers on light backgrounds
 *  Charcoal       #171717  headings / dark sections
 *  Warm White     #FAFAF8  page background
 *  Pure White     #FFFFFF  alternate sections / cards
 *  Muted Grey     #777777  body text
 *  Soft Grey      #E8E6DF  borders / dividers
 *
 * LAYOUT (same as About page)
 *  px-5 sm:px-10 lg:px-[7%], max-w-[1450px], extrabold uppercase headings
 *  with tight tracking, gold section labels, outline pill buttons.
 *
 * ANIMATION
 *  Framer Motion -> hero landing (all 4 sides), entrances, tilt cards, filter pill
 *  GSAP          -> progress bar, scroll-velocity marquee, scrubbed intro lines,
 *                   character reveals, pinned editorial scene, benefit cards, CTA
 */

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ------------------------------------------------------------------ */
/* DATA                                                                */
/* ------------------------------------------------------------------ */

const bicycleCategories = [
  {
    id: "mountain",
    number: "01",
    name: "MOUNTAIN BIKES",
    description: "Take on challenging trails, rough terrain and unforgettable adventures.",
    tagline: "BUILT FOR THE WILD",
    image: "https://images.unsplash.com/photo-1544191696-15693072e0b8?auto=format&fit=crop&w=1100&q=85",
    count: "TRAIL / OFF-ROAD",
  },
  {
    id: "road",
    number: "02",
    name: "ROAD BIKES",
    description: "Experience speed, smooth performance and the freedom of open roads.",
    tagline: "MADE FOR SPEED",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1100&q=85",
    count: "SPEED / PERFORMANCE",
  },
  {
    id: "hybrid",
    number: "03",
    name: "HYBRID BIKES",
    description: "The perfect balance of comfort and performance for everyday riding.",
    tagline: "BEST OF BOTH WORLDS",
    image: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=1100&q=85",
    count: "COMFORT / VERSATILITY",
  },
  {
    id: "city",
    number: "04",
    name: "CITY BIKES",
    description: "Move through your everyday world with effortless style and comfort.",
    tagline: "OWN THE STREETS",
    image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=1100&q=85",
    count: "URBAN / COMMUTING",
  },
  {
    id: "electric",
    number: "05",
    name: "ELECTRIC BIKES",
    description: "Discover a new level of freedom with power-assisted cycling.",
    tagline: "POWER YOUR RIDE",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1100&q=85",
    count: "E-POWER / ADVENTURE",
  },
  {
    id: "kids",
    number: "06",
    name: "KIDS BIKES",
    description: "Make their first cycling memories exciting, confident and fun.",
    tagline: "LITTLE RIDERS. BIG DREAMS.",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1100&q=85",
    count: "BEGINNERS / FAMILY",
  },
];

const filters = [
  { id: "all", name: "ALL BIKES" },
  ...bicycleCategories.map((c) => ({ id: c.id, name: c.name.replace(" BIKES", "") })),
];

const benefits = [
  { title: "QUALITY FIRST", description: "Bicycles selected with quality and performance in mind.", x: -160, y: 0 },
  { title: "FIND YOUR FIT", description: "Discover a bicycle that suits your riding style.", x: 0, y: 140 },
  { title: "RIDE WITH CONFIDENCE", description: "Enjoy every journey with the right bicycle.", x: 160, y: 0 },
];

const marqueeWords = ["MOUNTAIN", "ROAD", "HYBRID", "CITY", "ELECTRIC", "KIDS"];

/* ------------------------------------------------------------------ */
/* SHARED PIECES                                                       */
/* ------------------------------------------------------------------ */

type Dir = "left" | "right" | "top" | "bottom";
const EASE = [0.22, 1, 0.36, 1] as const;

const offset = (d: Dir, n = 140) =>
  ({
    left: { x: -n, y: 0 },
    right: { x: n, y: 0 },
    top: { x: 0, y: -n },
    bottom: { x: 0, y: n },
  })[d];

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
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
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

/** Same label style as the About page. */
function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`mb-4 text-[10px] font-bold uppercase tracking-[0.28em] sm:text-[11px] ${light ? "text-[#F6BD12]" : "text-[#C58C00]"}`}>
      {children}
    </p>
  );
}

/** Masked characters that GSAP animates (class "gchar"). */
function Chars({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, wi) => (
        <span key={wi} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          {word.split("").map((c, ci) => (
            <span key={ci} className="gchar inline-block">
              {c}
            </span>
          ))}
          {"\u00A0"}
        </span>
      ))}
    </>
  );
}

function Wheel({ className = "", duration = 16 }: { className?: string; duration?: number }) {
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
        <line key={i} x1="100" y1="109" x2="100" y2="16" strokeWidth="0.9" transform={`rotate(${i * 15} 100 100)`} />
      ))}
    </motion.svg>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* CARD: tilt, cut corner, angled image                                */
/* ------------------------------------------------------------------ */

function BikeCard({ category, index }: { category: (typeof bicycleCategories)[number]; index: number }) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 150, damping: 18 });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), { stiffness: 150, damping: 18 });
  const imgX = useTransform(mx, [-0.5, 0.5], [18, -18]);

  const from: Dir = (["left", "bottom", "right"] as Dir[])[index % 3];
  const o = reduce ? { x: 0, y: 0 } : offset(from, 120);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, ...o }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, ease: EASE, delay: (index % 3) * 0.08 }}
      className="min-w-0 [perspective:1100px]"
    >
      <motion.div
        onMouseMove={(e) => {
          if (reduce) return;
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onMouseLeave={() => {
          mx.set(0);
          my.set(0);
        }}
        style={{ rotateX: reduce ? 0 : rotateX, rotateY: reduce ? 0 : rotateY, transformStyle: "preserve-3d" }}
        className="group"
      >
        <Link
          href={`/contact?interest=${category.id}`}
          aria-label={`Explore ${category.name}`}
          className="relative block overflow-hidden bg-[#171717] text-white outline-none focus-visible:ring-2 focus-visible:ring-[#F6BD12]"
          style={{ clipPath: "polygon(0 0, calc(100% - 56px) 0, 100% 56px, 100% 100%, 0 100%)" }}
        >
          <span className="pointer-events-none absolute -right-2 top-20 z-0 text-[190px] font-extrabold leading-none tracking-[-0.08em] text-white/[0.05]">
            {category.number}
          </span>

          <div className="relative z-10 aspect-[4/3.6] overflow-hidden" style={{ clipPath: "polygon(0 0, 100% 0, 100% 84%, 0 100%)" }}>
            <motion.div style={{ x: reduce ? 0 : imgX }} className="absolute -inset-x-6 inset-y-0">
              <Image
                src={category.image}
                alt={category.name}
                fill
                unoptimized
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-transparent to-black/20" />
            <span className="absolute left-5 top-5 bg-[#F6BD12] px-3 py-2 text-[9px] font-extrabold tracking-widest text-black">
              {category.count}
            </span>
          </div>

          <Wheel
            duration={9}
            className="pointer-events-none absolute -bottom-14 -right-14 z-0 h-40 w-40 text-white/10 transition-all duration-700 group-hover:-bottom-8 group-hover:-right-8 group-hover:text-[#F6BD12]/60"
          />

          <div className="relative z-20 -mt-6 px-6 pb-7 sm:px-7" style={{ transform: "translateZ(40px)" }}>
            <p className="mb-2 text-[9px] font-extrabold tracking-[0.22em] text-[#F6BD12]">{category.tagline}</p>
            <h3 className="text-2xl font-extrabold uppercase leading-none tracking-[-0.05em] sm:text-[32px]">{category.name}</h3>
            <p className="mt-4 min-h-[56px] max-w-[300px] text-[13px] leading-7 text-white/60">{category.description}</p>

            <div className="mt-5 flex items-center justify-between border-t border-white/15 pt-5">
              <span className="text-[10px] font-extrabold tracking-[0.15em] text-white/85">EXPLORE THIS TYPE</span>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-all duration-500 group-hover:rotate-[-45deg] group-hover:bg-[#F6BD12] group-hover:text-black">
                <ArrowIcon />
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/* PAGE                                                                */
/* ------------------------------------------------------------------ */

export default function ShopPageClient() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const reduce = useReducedMotion();

  const rootRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroImgY = useTransform(heroP, [0, 1], ["0%", "22%"]);
  const heroTextY = useTransform(heroP, [0, 1], ["0%", "-18%"]);

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
          scrollTrigger: { trigger: rootRef.current, start: "top top", end: "bottom bottom", scrub: 0.3 },
        });

        // 2. marquee that speeds up with scroll velocity
        const track = gsap.to("[data-marquee]", { xPercent: -50, duration: 30, ease: "none", repeat: -1 });
        ScrollTrigger.create({
          onUpdate: (self) => {
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 250, 7);
            gsap.to(track, { timeScale: boost, duration: 0.2, overwrite: true });
            gsap.to(track, { timeScale: 1, duration: 1.2, delay: 0.2, overwrite: "auto" });
          },
        });

        // 3. intro lines slide in opposite directions while scrolling
        const introTrigger = { trigger: "[data-intro]", start: "top bottom", end: "bottom top", scrub: true };
        gsap.fromTo("[data-intro-a]", { xPercent: 14 }, { xPercent: -14, ease: "none", scrollTrigger: introTrigger });
        gsap.fromTo("[data-intro-b]", { xPercent: -14 }, { xPercent: 14, ease: "none", scrollTrigger: introTrigger });

        // 4. character reveals on section headings
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

        // 5. pinned editorial scene
        const tl = gsap.timeline({
          scrollTrigger: { trigger: "[data-editorial]", start: "top top", end: "+=130%", pin: true, scrub: 0.6 },
        });
        tl.fromTo("[data-ed-img]", { scale: 1.3 }, { scale: 1, ease: "none" }, 0)
          .fromTo("[data-ed-wheel]", { rotate: 0 }, { rotate: 540, ease: "none" }, 0)
          .fromTo(".ed-word", { opacity: 0.12, yPercent: 40 }, { opacity: 1, yPercent: 0, stagger: 0.3, ease: "none" }, 0.1)
          .fromTo("[data-ed-copy]", { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: "none" }, 0.9);

        // 6. benefit cards fly in from different sides
        gsap.utils.toArray<HTMLElement>(".benefit").forEach((el, i) => {
          gsap.from(el, {
            x: Number(el.dataset.x),
            y: Number(el.dataset.y),
            opacity: 0,
            duration: 1.2,
            delay: i * 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });

        // 7. closing CTA lines converge from both sides
        const ctaTrigger = { trigger: "[data-cta]", start: "top bottom", end: "top 35%", scrub: true };
        gsap.fromTo("[data-cta-a]", { xPercent: -35 }, { xPercent: 0, ease: "none", scrollTrigger: ctaTrigger });
        gsap.fromTo("[data-cta-b]", { xPercent: 35 }, { xPercent: 0, ease: "none", scrollTrigger: ctaTrigger });
      },
      rootRef.current,
    );

    return () => mm.revert();
  }, []);

  const filteredCategories = useMemo(
    () =>
      bicycleCategories.filter((c) => {
        const q = search.toLowerCase();
        return (
          (activeCategory === "all" || c.id === activeCategory) &&
          (c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
        );
      }),
    [activeCategory, search],
  );

  const T = reduce ? 0 : 1;

  return (
    <main ref={rootRef} className="overflow-x-clip bg-[#FAFAF8] font-[var(--font-inter)] text-[#171717]">
      {/* scroll progress (GSAP) */}
      <div data-progress className="fixed left-0 top-0 z-50 h-[3px] w-full origin-left scale-x-0 bg-[#F6BD12]" />

      {/* ============================ HERO (Framer Motion landing) ============================ */}
      <section ref={heroRef} className="relative flex min-h-[680px] items-center overflow-hidden bg-[#171717] pt-24 sm:min-h-[760px] lg:min-h-[880px]">
        {/* centre -> all four edges */}
        <motion.div
          className="absolute inset-0"
          initial={{ clipPath: reduce ? "inset(0% 0% 0% 0%)" : "inset(42% 42% 42% 42%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 1.5 * T, ease: EASE }}
        >
          <motion.div className="absolute inset-0 scale-110" style={{ y: heroImgY }}>
            <motion.div
              className="absolute inset-0"
              initial={{ scale: reduce ? 1 : 1.35 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.4, ease: "easeOut" }}
            >
              <Image
                src="https://images.unsplash.com/photo-1544191696-15693072e0b8?auto=format&fit=crop&w=2200&q=90"
                alt="Cyclist exploring an outdoor mountain trail"
                fill
                priority
                unoptimized
                sizes="100vw"
                className="object-cover object-center"
              />
            </motion.div>
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </motion.div>

        {/* wheel from the RIGHT */}
        <motion.div
          className="pointer-events-none absolute -right-[18vw] top-1/2 hidden -translate-y-1/2 text-white/25 lg:block"
          initial={{ x: reduce ? 0 : 500, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.6, ease: EASE, delay: 1.1 * T }}
        >
          <Wheel className="h-[52vw] max-h-[780px] w-[52vw] max-w-[780px]" duration={30} />
        </motion.div>

        {/* ghost word from the BOTTOM */}
        <motion.div
          className="pointer-events-none absolute bottom-0 left-[38%] hidden select-none text-[22vw] font-extrabold leading-[0.8] tracking-[-0.08em] text-white/[0.07] lg:block"
          initial={{ y: reduce ? 0 : "100%" }}
          animate={{ y: "8%" }}
          transition={{ duration: 1.6, ease: EASE, delay: 1 * T }}
        >
          RIDE
        </motion.div>

        <div className="relative z-10 mx-auto w-full max-w-[1450px] px-5 pb-28 sm:px-10 lg:px-[7%]">
          <motion.div style={{ y: reduce ? 0 : heroTextY }} className="max-w-[980px]">
            {/* TOP */}
            <motion.p
              initial={{ opacity: 0, y: reduce ? 0 : -60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 1.0 * T }}
              className="mb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#F6BD12] sm:text-[11px]"
            >
              FLYING WHEEL / BICYCLE COLLECTION
            </motion.p>

            {/* LEFT and RIGHT */}
            <h1 className="text-[clamp(52px,10vw,148px)] font-extrabold uppercase leading-[0.92] tracking-[-0.075em] text-white">
              <span className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block"
                  initial={{ x: reduce ? 0 : "-110%" }}
                  animate={{ x: 0 }}
                  transition={{ duration: 1.2, ease: EASE, delay: 1.1 * T }}
                >
                  FIND YOUR
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block"
                  style={{ WebkitTextStroke: "2px #fff", color: "transparent" }}
                  initial={{ x: reduce ? 0 : "110%" }}
                  animate={{ x: 0 }}
                  transition={{ duration: 1.2, ease: EASE, delay: 1.25 * T }}
                >
                  PERFECT RIDE.
                </motion.span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, x: reduce ? 0 : -80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 1.5 * T }}
              className="mt-8 max-w-[500px] text-sm leading-7 text-white/75 sm:text-base sm:leading-8"
            >
              From mountain adventures to everyday city rides. Discover bicycles that match your lifestyle, passion and the road ahead.
            </motion.p>

            {/* BOTTOM */}
            <motion.div
              initial={{ opacity: 0, y: reduce ? 0 : 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 1.65 * T }}
              className="mt-10 flex flex-wrap items-center gap-6"
            >
              <a
                href="#bicycle-categories"
                className="inline-flex h-[52px] items-center gap-5 rounded-full bg-[#F6BD12] px-9 text-[10px] font-extrabold tracking-[0.15em] text-black transition-colors duration-300 hover:bg-white"
              >
                EXPLORE BICYCLES
                <span className="text-base">↗</span>
              </a>
              <Link href="/contact" className="text-[10px] font-extrabold tracking-[0.15em] text-white transition-opacity hover:opacity-70">
                NEED HELP? ↗
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* bottom bar */}
        <div className="absolute bottom-7 left-5 right-5 z-10 sm:left-10 sm:right-10 lg:left-[7%] lg:right-[7%]">
          <motion.div
            className="h-px origin-left bg-white/30"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, ease: EASE, delay: 1.8 * T }}
          />
          <div className="flex items-center justify-between pt-5">
            <motion.span
              initial={{ opacity: 0, x: reduce ? 0 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 2 * T }}
              className="text-[9px] font-bold tracking-[0.25em] text-white/60"
            >
              DESIGNED FOR EVERY JOURNEY
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: reduce ? 0 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 2 * T }}
              className="text-[9px] font-bold tracking-[0.25em] text-white/60"
            >
              SCROLL TO EXPLORE ↓
            </motion.span>
          </div>
        </div>
      </section>

      {/* ============================ MARQUEE (GSAP, same strip style as About brands) ============================ */}
      <div className="overflow-hidden border-b border-[#E8E6DF] bg-white py-5" aria-hidden="true">
        <div data-marquee className="flex w-max gap-12 whitespace-nowrap">
          {Array.from({ length: 8 }).flatMap((_, r) =>
            marqueeWords.map((w) => (
              <span key={`${r}-${w}`} className="flex items-center gap-12 text-3xl font-extrabold leading-none tracking-[-0.06em] text-[#171717] sm:text-4xl">
                {w}
                <Wheel className="h-7 w-7 text-[#C58C00] sm:h-8 sm:w-8" duration={6} />
              </span>
            )),
          )}
        </div>
      </div>

      {/* ============================ INTRO (GSAP scrub) ============================ */}
      <section data-intro className="px-5 py-20 sm:px-10 lg:px-[7%] lg:py-28">
        <div className="mx-auto max-w-[1450px]">
          <Enter from="top" distance={60}>
            <SectionLabel>THE RIGHT BIKE CHANGES EVERYTHING</SectionLabel>
          </Enter>

          <div className="text-[clamp(56px,12vw,180px)] font-extrabold uppercase leading-[0.92] tracking-[-0.075em]">
            <div data-intro-a className="whitespace-nowrap">
              EVERY RIDER.
            </div>
            <div data-intro-b className="whitespace-nowrap text-transparent" style={{ WebkitTextStroke: "2px #171717" }}>
              EVERY JOURNEY.
            </div>
          </div>

          <Enter from="right" className="mt-8 flex flex-col justify-between gap-6 border-t border-black/15 pt-6 md:flex-row md:items-end">
            <p className="max-w-[580px] text-sm leading-7 text-[#777] sm:text-base sm:leading-8">
              Whether you love the thrill of off-road trails, the speed of open roads or the comfort of everyday cycling, there is a bicycle for your next adventure. Explore our bicycle categories and find your ride.
            </p>
            <a
              href="#bicycle-categories"
              className="inline-flex h-[48px] w-fit shrink-0 items-center justify-center gap-5 rounded-full border border-[#D7A600] px-7 text-[10px] font-extrabold tracking-[0.13em] transition-all duration-300 hover:bg-[#F6BD12]"
            >
              BROWSE CATEGORIES
              <span className="text-base">↓</span>
            </a>
          </Enter>
        </div>
      </section>

      {/* ============================ CATEGORIES ============================ */}
      <section id="bicycle-categories" className="scroll-mt-10 bg-white px-5 py-20 sm:px-10 lg:px-[7%] lg:py-28">
        <div className="mx-auto max-w-[1450px]">
          <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <Enter from="left">
                <SectionLabel>EXPLORE OUR COLLECTION</SectionLabel>
              </Enter>
              <h2 data-chars className="text-[clamp(44px,7vw,100px)] font-extrabold uppercase leading-[0.92] tracking-[-0.075em]">
                <Chars text="CHOOSE YOUR" />
                <br />
                <Chars text="RIDE." />
              </h2>
            </div>
            <Enter from="right">
              <p className="max-w-[370px] text-sm leading-7 text-[#777]">
                Six different ways to ride. Find the bicycle that fits your personality and your journey.
              </p>
            </Enter>
          </div>

          <Enter from="top" distance={50}>
            <div className="mb-12 flex flex-col gap-5 border-y border-black/15 py-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {filters.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActiveCategory(f.id)}
                    aria-pressed={activeCategory === f.id}
                    className={`relative rounded-full border px-5 py-3 text-[10px] font-extrabold tracking-[0.13em] transition-colors duration-300 ${
                      activeCategory === f.id
                        ? "border-[#F6BD12] text-black"
                        : "border-[#E8E6DF] text-[#777] hover:border-[#D7A600] hover:text-black"
                    }`}
                  >
                    {activeCategory === f.id && (
                      <motion.span
                        layoutId="filter-pill"
                        className="absolute -inset-px rounded-full bg-[#F6BD12]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">{f.name}</span>
                  </button>
                ))}
              </div>

              <div className="relative w-full lg:max-w-[260px]">
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search bicycle..."
                  aria-label="Search bicycle categories"
                  className="h-12 w-full rounded-full border border-[#E8E6DF] bg-[#FAFAF8] px-5 pr-12 text-sm text-[#171717] outline-none transition-colors placeholder:text-[#777]/70 focus:border-[#D7A600]"
                />
                <svg className="absolute right-5 top-1/2 -translate-y-1/2 text-[#777]" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m16 16 4 4" />
                </svg>
              </div>
            </div>
          </Enter>

          <motion.div layout className="grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredCategories.map((category, i) => (
                <BikeCard key={category.id} category={category} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredCategories.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-2xl font-extrabold uppercase tracking-[-0.05em]">No bicycles found.</p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("all");
                }}
                className="mt-5 rounded-full bg-[#F6BD12] px-7 py-3 text-[10px] font-extrabold tracking-[0.13em] text-black"
              >
                CLEAR FILTERS
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ============================ PINNED EDITORIAL (GSAP) ============================ */}
      <section data-editorial className="relative flex h-screen min-h-[620px] items-center overflow-hidden bg-[#171717]">
        <div data-ed-img className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=2200&q=85"
            alt="Cycling adventure and mountain riding"
            fill
            unoptimized
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/60" />

        <div data-ed-wheel className="pointer-events-none absolute -left-24 bottom-[-120px] text-white/20">
          <svg viewBox="0 0 200 200" className="h-[420px] w-[420px]" fill="none" stroke="currentColor" aria-hidden="true">
            <circle cx="100" cy="100" r="95" strokeWidth="6" />
            <circle cx="100" cy="100" r="9" strokeWidth="4" />
            {Array.from({ length: 24 }).map((_, i) => (
              <line key={i} x1="100" y1="109" x2="100" y2="16" strokeWidth="0.9" transform={`rotate(${i * 15} 100 100)`} />
            ))}
          </svg>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1450px] px-5 sm:px-10 lg:px-[7%]">
          <SectionLabel light>THE WORLD IS YOUR PLAYGROUND</SectionLabel>
          <h2 className="text-[clamp(52px,10vw,148px)] font-extrabold uppercase leading-[0.92] tracking-[-0.075em] text-white">
            <span className="ed-word inline-block">RIDE</span> <span className="ed-word inline-block">BEYOND</span>
            <br />
            <span className="ed-word inline-block">LIMITS.</span>
          </h2>
          <div data-ed-copy>
            <p className="mt-8 max-w-[480px] text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
              The road ends. The adventure doesn&apos;t. Find the freedom to explore more, go further and make every ride count.
            </p>
            <Link
              href="/contact"
              className="mt-9 inline-flex h-[52px] items-center gap-5 rounded-full bg-[#F6BD12] px-9 text-[10px] font-extrabold tracking-[0.15em] text-black transition-colors duration-300 hover:bg-white"
            >
              TALK TO OUR TEAM
              <span className="text-base">↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================ WHY FLYING WHEEL ============================ */}
      <section className="px-5 py-20 sm:px-10 lg:px-[7%] lg:py-28">
        <div className="mx-auto max-w-[1450px]">
          <div className="mx-auto mb-14 max-w-[760px] text-center">
            <Enter from="top" distance={50}>
              <SectionLabel>THE FLYING WHEEL DIFFERENCE</SectionLabel>
            </Enter>
            <h2 data-chars className="text-[clamp(40px,6vw,84px)] font-extrabold uppercase leading-[0.92] tracking-[-0.075em]">
              <Chars text="MORE THAN JUST BICYCLES." />
            </h2>
            <Enter from="bottom" distance={40} delay={0.2}>
              <p className="mt-5 text-sm text-[#777]">
                It is about finding the right ride, enjoying the journey and making every moment count.
              </p>
            </Enter>
          </div>

          <div className="grid gap-6 border-t border-black/15 pt-10 md:grid-cols-3">
            {benefits.map((b, i) => (
              <div key={b.title} data-x={b.x} data-y={b.y} className="benefit">
                <div className="group relative h-full overflow-hidden border border-[#E8E6DF] bg-white p-8 transition-all duration-500 hover:-translate-y-2 hover:border-[#D7A600] sm:p-10">
                  <Wheel
                    duration={12}
                    className="absolute -right-12 -top-12 h-40 w-40 text-[#E8E6DF] transition-colors duration-500 group-hover:text-[#F6BD12]"
                  />
                  <span className="text-[10px] font-bold tracking-widest text-[#C58C00]">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-20 text-lg font-extrabold uppercase tracking-[-0.04em]">{b.title}</h3>
                  <div className="my-4 h-[2px] w-9 bg-[#F6BD12] transition-all duration-500 group-hover:w-16" />
                  <p className="max-w-[300px] text-[13px] leading-7 text-[#777]">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ FINAL CTA (GSAP converge) ============================ */}
      <section data-cta className="relative overflow-hidden bg-[#171717] px-5 py-20 text-white sm:px-10 lg:px-[7%] lg:py-28">
        <div className="mx-auto flex max-w-[1450px] flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <Enter from="top" distance={50}>
              <SectionLabel light>YOUR NEXT ADVENTURE STARTS HERE</SectionLabel>
            </Enter>
            <h2 className="text-[clamp(52px,9vw,128px)] font-extrabold uppercase leading-[0.92] tracking-[-0.075em]">
              <div data-cta-a>LET&apos;S FIND</div>
              <div data-cta-b>YOUR RIDE.</div>
            </h2>
          </div>

          <Enter from="bottom" delay={0.2}>
            <p className="mb-7 max-w-[360px] text-sm leading-7 text-white/70">
              Not sure which bicycle is right for you? Talk to our team and discover the right ride for your next journey.
            </p>
            <Link
              href="/contact"
              className="inline-flex h-[52px] items-center gap-5 rounded-full bg-[#F6BD12] px-9 text-[10px] font-extrabold tracking-[0.15em] text-black transition-colors duration-300 hover:bg-white"
            >
              CONTACT US
              <span className="text-base">↗</span>
            </Link>
          </Enter>
        </div>
      </section>
    </main>
  );
}