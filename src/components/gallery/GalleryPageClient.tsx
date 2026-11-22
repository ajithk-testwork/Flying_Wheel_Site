"use client";

/**
 * Needs: npm i framer-motion gsap
 *
 * Same animation system and palette as the Shop / About / Contact / Blog pages.
 *  Framer Motion -> hero landing, directional clip-path wipes, filter pill,
 *                   grid add/remove, lightbox
 *  GSAP          -> progress bar, scroll-velocity marquee, character reveals,
 *                   pinned editorial scene, converging CTA lines
 *
 * Only 7 verified Unsplash photos are used; a few repeat with a different
 * crop (objectPosition). Swap any URL in IMAGES for your own shop photos.
 */

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
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

const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

const IMAGES = {
  mountain: img("photo-1544191696-15693072e0b8"),
  road: img("photo-1485965120184-e220f721d03e"),
  hybrid: img("photo-1507035895480-2b3156c31fc8"),
  city: img("photo-1571068316344-75bc76f77890"),
  electric: img("photo-1558618666-fcd25c85cd64"),
  kids: img("photo-1517649763962-0c623066013b"),
  ride: img("photo-1541625602330-2277e4c46182"),
};

interface Shot {
  id: string;
  number: string;
  category: string;
  title: string;
  caption: string;
  src: string;
  position?: string; // CSS object-position for repeated photos
  span: string; // grid span classes
}

const shots: Shot[] = [
  {
    id: "trail-rider",
    number: "01",
    category: "MOUNTAIN",
    title: "TRAIL RIDER",
    caption: "Rough terrain, steady grip and a long way down the hill.",
    src: IMAGES.mountain,
    span: "col-span-2 row-span-2",
  },
  {
    id: "open-road",
    number: "02",
    category: "ROAD",
    title: "OPEN ROAD",
    caption: "Smooth tarmac and a fast bike. Nothing else needed.",
    src: IMAGES.road,
    span: "row-span-2",
  },
  {
    id: "daily-commute",
    number: "03",
    category: "COMMUTE",
    title: "DAILY COMMUTE",
    caption: "The easiest way to beat the morning traffic.",
    src: IMAGES.hybrid,
    span: "",
  },
  {
    id: "power-assist",
    number: "04",
    category: "ELECTRIC",
    title: "POWER ASSIST",
    caption: "Go further with a little help from the motor.",
    src: IMAGES.electric,
    span: "col-span-2",
  },
  {
    id: "little-riders",
    number: "05",
    category: "FAMILY",
    title: "LITTLE RIDERS",
    caption: "First rides that turn into lifelong habits.",
    src: IMAGES.kids,
    span: "",
  },
  {
    id: "city-style",
    number: "06",
    category: "COMMUTE",
    title: "CITY STYLE",
    caption: "Comfort, clean lines and everyday confidence.",
    src: IMAGES.city,
    span: "row-span-2",
  },
  {
    id: "golden-hour",
    number: "07",
    category: "ROAD",
    title: "GOLDEN HOUR",
    caption: "Early starts, quiet roads and the best light of the day.",
    src: IMAGES.ride,
    span: "col-span-2",
  },
  {
    id: "dirt-and-dust",
    number: "08",
    category: "MOUNTAIN",
    title: "DIRT & DUST",
    caption: "Come home muddy. That is how you know it was good.",
    src: IMAGES.electric,
    position: "20% 60%",
    span: "",
  },
];

const categories = ["ALL", ...Array.from(new Set(shots.map((s) => s.category)))];

const marqueeWords = ["TRAIL", "ROAD", "CITY", "ELECTRIC", "FAMILY", "ADVENTURE"];

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

const clipStart: Record<Dir, string> = {
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
  top: "inset(0% 0% 100% 0%)",
  bottom: "inset(100% 0% 0% 0%)",
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

/* ------------------------------------------------------------------ */
/* GALLERY TILE                                                        */
/* ------------------------------------------------------------------ */

function Tile({
  shot,
  index,
  onOpen,
}: {
  shot: Shot;
  index: number;
  onOpen: () => void;
}) {
  const reduce = useHydratedReducedMotion();
  const from: Dir = (["left", "bottom", "right", "top"] as Dir[])[index % 4];

  return (
    <motion.button
      layout
      type="button"
      onClick={onOpen}
      aria-label={`Open photo: ${shot.title}`}
      initial={{
        opacity: 0,
        clipPath: reduce ? "inset(0% 0% 0% 0%)" : clipStart[from],
      }}
      whileInView={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
      exit={{ opacity: 0, scale: 0.9 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1.1, ease: EASE, delay: (index % 4) * 0.07 }}
      className={`group relative block overflow-hidden bg-[#171717] text-left outline-none focus-visible:ring-2 focus-visible:ring-[#F6BD12] ${shot.span}`}
    >
      <Image
        src={shot.src}
        alt={shot.title}
        fill
        unoptimized
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
        style={{ objectPosition: shot.position }}
        className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/20 opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

      <span className="absolute left-4 top-4 bg-[#F6BD12] px-3 py-2 text-[9px] font-extrabold tracking-widest text-black">
        {shot.category}
      </span>

      <span className="pointer-events-none absolute right-3 top-0 text-[84px] font-extrabold leading-none tracking-[-0.08em] text-white/10 sm:text-[110px]">
        {shot.number}
      </span>

      <Wheel
        duration={9}
        className="pointer-events-none absolute -bottom-12 -right-12 h-32 w-32 text-white/10 transition-all duration-700 group-hover:-bottom-6 group-hover:-right-6 group-hover:text-[#F6BD12]/70"
      />

      <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-6">
        <h3 className="text-lg font-extrabold uppercase leading-none tracking-[-0.05em] transition-colors duration-500 group-hover:text-[#F6BD12] sm:text-2xl">
          {shot.title}
        </h3>
        <p className="mt-0 max-h-0 max-w-[300px] overflow-hidden text-[12px] leading-6 text-white/70 opacity-0 transition-all duration-500 group-hover:mt-3 group-hover:max-h-24 group-hover:opacity-100">
          {shot.caption}
        </p>
      </div>

      <span className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-xl text-white transition-all duration-500 group-hover:rotate-90 group-hover:bg-[#F6BD12] group-hover:text-black sm:bottom-6 sm:right-6">
        +
      </span>
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/* PAGE                                                                */
/* ------------------------------------------------------------------ */

export default function GalleryPageClient() {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  const [activeCategory, setActiveCategory] = useState("ALL");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const { scrollYProgress: heroP } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroTextY = useTransform(heroP, [0, 1], ["0%", "-14%"]);

  const filteredShots = useMemo(
    () =>
      shots.filter((s) => activeCategory === "ALL" || s.category === activeCategory),
    [activeCategory],
  );

  /* ---------- lightbox controls ---------- */
  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setOpenIndex((i) =>
        i === null
          ? i
          : (i + dir + filteredShots.length) % filteredShots.length,
      ),
    [filteredShots.length],
  );

  useEffect(() => {
    if (openIndex === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [openIndex, close, step]);

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

        // 4. pinned editorial scene
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: "[data-editorial]",
            start: "top top",
            end: "+=130%",
            pin: true,
            scrub: 0.6,
          },
        });
        tl.fromTo("[data-ed-img]", { scale: 1.3 }, { scale: 1, ease: "none" }, 0)
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

        // 5. closing CTA lines converge from both sides
        const ctaTrigger = {
          trigger: "[data-cta]",
          start: "top bottom",
          end: "top 35%",
          scrub: true,
        };
        gsap.fromTo(
          "[data-cta-a]",
          { xPercent: -35 },
          { xPercent: 0, ease: "none", scrollTrigger: ctaTrigger },
        );
        gsap.fromTo(
          "[data-cta-b]",
          { xPercent: 35 },
          { xPercent: 0, ease: "none", scrollTrigger: ctaTrigger },
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

  // grid height changes when filtering, so re-measure the pinned scene
  useEffect(() => {
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 700);
    return () => window.clearTimeout(t);
  }, [activeCategory]);

  const T = 1;
  const current = openIndex !== null ? filteredShots[openIndex] : null;

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

      {/* ============================ HERO (Framer landing from all 4 sides) ============================ */}
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
          SNAP
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
              FLYING WHEEL / GALLERY
            </motion.p>

            {/* LEFT and RIGHT */}
            <h1 className="max-w-[1100px] text-[clamp(52px,9vw,128px)] font-extrabold uppercase leading-[0.92] tracking-[-0.075em]">
              <span className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block"
                  initial={{ x: reduce ? 0 : "-110%" }}
                  animate={{ x: 0 }}
                  transition={{ duration: 1.2, ease: EASE, delay: 0.4 * T }}
                >
                  EVERY RIDE
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
                    TELLS A STORY
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
                  className="max-w-[560px] text-sm leading-8 text-[#777] sm:text-base"
                >
                  Trails, roads, city streets and family rides. A look at the
                  bicycles and the riders that make the Flying Wheel community.
                </motion.p>

                {/* BOTTOM */}
                <motion.div
                  initial={{ opacity: 0, y: reduce ? 0 : 80 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: EASE, delay: 1.1 * T }}
                >
                  <a
                    href="#photos"
                    className="inline-flex h-[50px] w-fit shrink-0 items-center justify-center gap-5 rounded-full border border-[#D7A600] px-7 text-[10px] font-extrabold tracking-[0.13em] transition-all duration-300 hover:bg-[#F6BD12]"
                  >
                    VIEW PHOTOS <span className="text-base">↓</span>
                  </a>
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

      {/* ============================ PHOTO GRID ============================ */}
      <section
        id="photos"
        className="scroll-mt-10 bg-white px-5 py-20 sm:px-10 lg:px-[7%] lg:py-28"
      >
        <div className="mx-auto max-w-[1450px]">
          <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <Enter from="left">
                <SectionLabel>THE FLYING WHEEL ARCHIVE</SectionLabel>
              </Enter>
              <h2
                data-chars
                className="text-[clamp(44px,7vw,100px)] font-extrabold uppercase leading-[0.92] tracking-[-0.075em]"
              >
                <Chars text="MOMENTS" />
                <br />
                <Chars text="ON TWO WHEELS." />
              </h2>
            </div>
            <Enter from="right">
              <p className="max-w-[370px] text-sm leading-7 text-[#777]">
                Tap any photo to view it full screen. Use the filters to jump
                to the kind of ride you love.
              </p>
            </Enter>
          </div>

          <Enter from="top" distance={50}>
            <div className="mb-10 flex flex-wrap gap-2 border-y border-black/15 py-5">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActiveCategory(c)}
                  aria-pressed={activeCategory === c}
                  className={`relative rounded-full border px-5 py-3 text-[10px] font-extrabold tracking-[0.13em] transition-colors duration-300 ${
                    activeCategory === c
                      ? "border-[#F6BD12] text-black"
                      : "border-[#E8E6DF] text-[#777] hover:border-[#D7A600] hover:text-black"
                  }`}
                >
                  {activeCategory === c && (
                    <motion.span
                      layoutId="gallery-filter-pill"
                      className="absolute -inset-px rounded-full bg-[#F6BD12]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10">{c}</span>
                </button>
              ))}
            </div>
          </Enter>

          <motion.div
            layout
            className="grid auto-rows-[190px] grid-flow-dense grid-cols-2 gap-3 sm:auto-rows-[240px] sm:gap-4 lg:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredShots.map((shot, i) => (
                <Tile
                  key={shot.id}
                  shot={shot}
                  index={i}
                  onOpen={() => setOpenIndex(i)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ============================ PINNED EDITORIAL (GSAP) ============================ */}
      <section
        data-editorial
        className="relative flex h-screen min-h-[620px] items-center overflow-hidden bg-[#171717]"
      >
        <div data-ed-img className="absolute inset-0">
          <Image
            src={img("photo-1541625602330-2277e4c46182", 2200)}
            alt="Cyclist riding along an outdoor road"
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
          <SectionLabel light>THE ROAD IS WAITING</SectionLabel>
          <h2 className="text-[clamp(52px,10vw,148px)] font-extrabold uppercase leading-[0.92] tracking-[-0.075em] text-white">
            <span className="ed-word inline-block">RIDE.</span>{" "}
            <span className="ed-word inline-block">SHARE.</span>
            <br />
            <span className="ed-word inline-block">REPEAT.</span>
          </h2>
          <div data-ed-copy>
            <p className="mt-8 max-w-[480px] text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
              Every photo here started with someone choosing to go out and ride.
              Find the bicycle that gets you moving.
            </p>
            <Link
              href="/shop"
              className="mt-9 inline-flex h-[52px] items-center gap-5 rounded-full bg-[#F6BD12] px-9 text-[10px] font-extrabold tracking-[0.15em] text-black transition-colors duration-300 hover:bg-white"
            >
              EXPLORE BICYCLES
              <span className="text-base">↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================ FINAL CTA (GSAP converge) ============================ */}
      <section
        data-cta
        className="relative overflow-hidden bg-[#FAFAF8] px-5 py-20 sm:px-10 lg:px-[7%] lg:py-28"
      >
        <div className="mx-auto flex max-w-[1450px] flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <Enter from="top" distance={50}>
              <SectionLabel>BE PART OF THE STORY</SectionLabel>
            </Enter>
            <h2 className="text-[clamp(52px,9vw,128px)] font-extrabold uppercase leading-[0.92] tracking-[-0.075em]">
              <div data-cta-a>JOIN THE</div>
              <div data-cta-b>
                RIDE<span className="text-[#F6BD12]">.</span>
              </div>
            </h2>
          </div>

          <Enter from="bottom" delay={0.2}>
            <p className="mb-7 max-w-[360px] text-sm leading-7 text-[#777]">
              Visit the shop, take a test ride and become part of the Flying
              Wheel cycling community.
            </p>
            <Link
              href="/contact"
              className="inline-flex h-[52px] items-center gap-5 rounded-full bg-[#F6BD12] px-9 text-[10px] font-extrabold tracking-[0.15em] text-black transition-colors duration-300 hover:bg-[#171717] hover:text-white"
            >
              CONTACT US
              <span className="text-base">↗</span>
            </Link>
          </Enter>
        </div>
      </section>

      {/* ============================ LIGHTBOX ============================ */}
      <AnimatePresence>
        {current && (
          <motion.div
            key="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={current.title}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#171717]/95 p-4 sm:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={close}
          >
            <motion.div
              key={current.id}
              initial={{
                opacity: 0,
                x: reduce ? 0 : 80,
                clipPath: reduce ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 0% 100%)",
              }}
              animate={{ opacity: 1, x: 0, clipPath: "inset(0% 0% 0% 0%)" }}
              transition={{ duration: 0.8, ease: EASE }}
              className="relative h-[70vh] w-full max-w-[1200px]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={current.src}
                alt={current.title}
                fill
                unoptimized
                sizes="90vw"
                style={{ objectPosition: current.position }}
                className="object-contain"
              />
            </motion.div>

            {/* caption */}
            <div
              className="pointer-events-none absolute bottom-6 left-5 right-5 text-white sm:bottom-10 sm:left-10"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="mb-2 text-[10px] font-bold tracking-[0.28em] text-[#F6BD12]">
                {current.number} / {String(filteredShots.length).padStart(2, "0")} · {current.category}
              </p>
              <h3 className="text-2xl font-extrabold uppercase tracking-[-0.05em] sm:text-4xl">
                {current.title}
              </h3>
              <p className="mt-2 max-w-[460px] text-sm leading-7 text-white/70">
                {current.caption}
              </p>
            </div>

            {/* controls */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              aria-label="Close"
              className="group absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/25 text-xl text-white transition-colors duration-300 hover:bg-[#F6BD12] hover:text-black sm:right-10 sm:top-8"
            >
              <span className="transition-transform duration-500 group-hover:rotate-90">
                ✕
              </span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 text-xl text-white transition-colors duration-300 hover:bg-[#F6BD12] hover:text-black sm:left-8"
            >
              ←
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 text-xl text-white transition-colors duration-300 hover:bg-[#F6BD12] hover:text-black sm:right-8"
            >
              →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}