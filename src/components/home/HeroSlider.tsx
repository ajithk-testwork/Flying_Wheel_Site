"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";

/*
  BRAND PALETTE (matches the logo)
  Golden Yellow  #F6BD12
  White          #FFFFFF
  Charcoal       #171717
  Warm White     #F7F6F1
*/

const AUTOPLAY_DELAY = 5000; // milliseconds between automatic slides

interface Slide {
  id: number;
  brand: string;
  title: string;
  subtitle: string;
  model: string;
  backgroundText: string;
  image: string;
  preview: string;
  previewLabel: string;
  previewTitle: string;
  button: string;
}

const slides: Slide[] = [
  {
    id: 1,
    brand: "FLYING WHEEL",
    title: "NEW PRO\nBICYCLES",
    subtitle: "Shop for All Types of Bikes",
    model: "CARBON MTB",
    backgroundText: "CARBON",
    image: "/images/hero/hardtail-mtb.png",
    preview: "/images/hero/full-suspension-mtb.png",
    previewLabel: "BLAZE",
    previewTitle: "CARBON BRAKES",
    button: "SHOP NOW",
  },
  {
    id: 2,
    brand: "FLYING WHEEL",
    title: "RIDE\nBEYOND",
    subtitle: "Engineered for every adventure.",
    model: "FULL SUSPENSION",
    backgroundText: "TRAIL",
    image: "/images/hero/full-suspension-mtb.png",
    preview: "/images/hero/electric-mtb.png",
    previewLabel: "PERFORMANCE",
    previewTitle: "FULL SUSPENSION",
    button: "EXPLORE NOW",
  },
  {
    id: 3,
    brand: "FLYING WHEEL",
    title: "POWER YOUR\nJOURNEY",
    subtitle: "Experience the future of cycling.",
    model: "ELECTRIC MTB",
    backgroundText: "ELECTRIC",
    image: "/images/hero/electric-mtb.png",
    preview: "/images/hero/hardtail-mtb.png",
    previewLabel: "NEXT GENERATION",
    previewTitle: "ELECTRIC SERIES",
    button: "DISCOVER MORE",
  },
];

export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);

  const activeSlide = slides[activeIndex];

  const headingRef = useRef<HTMLDivElement>(null);
  const bikeRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const transitionRef = useRef<gsap.core.Timeline | null>(null);
  const entranceRef = useRef<gsap.core.Timeline | null>(null);

  // Change slide safely in both directions.
  const changeSlide = useCallback(
    (targetIndex: number) => {
      if (isAnimating || targetIndex === activeIndex) return;

      const nextDirection = targetIndex > activeIndex ? 1 : -1;

      setIsAnimating(true);

      transitionRef.current?.kill();
      entranceRef.current?.kill();

      const elements = [headingRef.current, previewRef.current].filter(Boolean);

      const timeline = gsap.timeline({
        onComplete: () => {
          setDirection(nextDirection);
          setActiveIndex(targetIndex);
        },
      });

      timeline.to(
        elements,
        {
          x: nextDirection > 0 ? -55 : 55,
          opacity: 0,
          duration: 0.3,
          stagger: 0.04,
          ease: "power2.in",
        },
        0,
      );

      timeline.to(
        bikeRef.current,
        {
          x: nextDirection > 0 ? 90 : -90,
          scale: 0.94,
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
        },
        0,
      );

      timeline.to(
        watermarkRef.current,
        {
          opacity: 0,
          duration: 0.25,
          ease: "power1.in",
        },
        0,
      );

      transitionRef.current = timeline;
    },
    [activeIndex, isAnimating],
  );

  // Entrance animation whenever the active slide changes.
  useEffect(() => {
    const heading = headingRef.current;
    const bike = bikeRef.current;
    const watermark = watermarkRef.current;
    const preview = previewRef.current;

    if (!heading || !bike || !watermark) return;

    entranceRef.current?.kill();

    const enterDirection = direction >= 0 ? 1 : -1;

    gsap.set(heading, { x: enterDirection * 45, opacity: 0 });
    gsap.set(bike, { x: enterDirection * 70, scale: 0.96, opacity: 0 });
    gsap.set(watermark, { scale: 0.97, opacity: 0 });

    if (preview) {
      gsap.set(preview, { x: enterDirection * 35, opacity: 0 });
    }

    const timeline = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        setIsAnimating(false);
      },
    });

    timeline
      .to(watermark, { scale: 1, opacity: 1, duration: 0.75 }, 0)
      .to(bike, { x: 0, scale: 1, opacity: 1, duration: 0.9 }, 0.05)
      .to(heading, { x: 0, opacity: 1, duration: 0.7 }, 0.15);

    if (preview) {
      timeline.to(preview, { x: 0, opacity: 1, duration: 0.65 }, 0.25);
    }

    entranceRef.current = timeline;

    return () => {
      timeline.kill();
    };
  }, [activeIndex, direction]);

  // AUTOPLAY: go to the next slide after a delay.
  // The timer restarts after every slide change (manual or automatic)
  // and pauses while the mouse is over the hero.
  useEffect(() => {
    if (isAnimating || isPaused) return;

    const timer = setTimeout(() => {
      changeSlide((activeIndex + 1) % slides.length);
    }, AUTOPLAY_DELAY);

    return () => clearTimeout(timer);
  }, [activeIndex, isAnimating, isPaused, changeSlide]);

  // Cleanup GSAP timelines.
  useEffect(() => {
    return () => {
      transitionRef.current?.kill();
      entranceRef.current?.kill();
    };
  }, []);

  const previousSlide = () => {
    changeSlide((activeIndex - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    changeSlide((activeIndex + 1) % slides.length);
  };

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative isolate flex min-h-[760px] h-[calc(100svh-86px)] w-full items-center overflow-hidden bg-[#F7F6F1] text-[#171717] sm:min-h-[780px] lg:min-h-[680px]"
    >
      {/* BACKGROUND WATERMARK */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden">
        <div
          ref={watermarkRef}
          className="select-none whitespace-nowrap text-[clamp(110px,22vw,360px)] font-black leading-none tracking-[-0.065em] text-[#171717]/[0.05]"
        >
          {activeSlide.backgroundText}
        </div>
      </div>

      {/* LEFT CONTENT */}
      <div
        ref={headingRef}
        className="absolute left-[8%] top-[10%] z-40 flex w-[84%] max-w-[480px] flex-col items-start sm:top-[11%] sm:w-[48%] lg:left-[8%] lg:top-[15%] lg:w-[35%] xl:w-[34%]"
      >
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C49300] sm:text-sm">
          {activeSlide.brand}
        </p>

        <h1 className="w-full whitespace-pre-line font-[var(--font-bebas)] text-[clamp(58px,6.4vw,108px)] font-normal uppercase leading-[0.86] tracking-[-0.025em] text-[#171717]">
          {activeSlide.title}
        </h1>

        <p className="mt-4 max-w-[370px] text-sm font-medium leading-relaxed text-[#171717]/60 sm:mt-5 sm:text-base lg:text-lg">
          {activeSlide.subtitle}
        </p>

        {/* CTA BUTTON: logo colors, no hover animation (instant color swap only) */}
        <Link
          href="/shop"
          style={{
            marginTop: "56px",
            height: "58px",
            minWidth: "190px",
            padding: "0 40px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            whiteSpace: "nowrap",
            borderRadius: "9999px",
            fontSize: "14px",
            fontWeight: 800,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
          className="relative z-[60] bg-[#F6BD12] text-[#171717] hover:bg-[#171717] hover:text-[#F6BD12]"
        >
          {activeSlide.button}
        </Link>
      </div>

      {/* MAIN BICYCLE IMAGE */}
      <div className="pointer-events-none absolute inset-x-0 top-[35%] bottom-[13%] z-20 sm:top-[25%] sm:bottom-[12%] lg:inset-0 lg:flex lg:items-center lg:justify-center">
        <div
          ref={bikeRef}
          className="relative mx-auto h-full w-full sm:w-[90%] lg:mt-8 lg:h-[76%] lg:w-[70%] lg:translate-x-[7%] xl:w-[68%]"
        >
          <Image
            key={activeSlide.image}
            src={activeSlide.image}
            alt={`${activeSlide.model} bicycle`}
            fill
            priority={activeIndex === 0}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 76vw"
            className="object-contain object-center mix-blend-multiply"
          />
        </div>
      </div>

      {/* RIGHT PREVIEW CARD */}
      <div
        ref={previewRef}
        className="absolute right-[4%] top-[10%] z-40 hidden w-[150px] md:block lg:right-[5%] lg:top-[12%] lg:w-[185px] xl:w-[210px]"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-white shadow-sm">
          <Image
            key={activeSlide.preview}
            src={activeSlide.preview}
            alt={activeSlide.previewTitle}
            fill
            sizes="(max-width: 1024px) 155px, 210px"
            className="object-contain object-center p-2"
          />
        </div>

        <p
          style={{ marginTop: "10px" }}
          className="text-[10px] font-semibold uppercase tracking-wider text-[#C49300] sm:text-xs"
        >
          {activeSlide.previewLabel}
        </p>

        <p
          style={{ marginTop: "4px" }}
          className="break-words text-sm font-bold uppercase leading-snug text-[#171717] lg:text-base"
        >
          {activeSlide.previewTitle}
        </p>
      </div>

      {/* PREVIOUS ARROW */}
      <button
        type="button"
        onClick={previousSlide}
        disabled={isAnimating}
        aria-label="Previous slide"
        className="absolute left-[2.5%] top-1/2 z-[70] hidden h-[58px] w-[70px] -translate-y-1/2 items-center justify-center rounded-xl border border-[#F6BD12] bg-white text-2xl text-[#171717] hover:bg-[#F6BD12] disabled:opacity-50 lg:flex"
      >
        ←
      </button>

      {/* NEXT ARROW */}
      <button
        type="button"
        onClick={nextSlide}
        disabled={isAnimating}
        aria-label="Next slide"
        className="absolute right-[2.5%] top-1/2 z-[70] hidden h-[58px] w-[70px] -translate-y-1/2 items-center justify-center rounded-xl border border-[#F6BD12] bg-white text-2xl text-[#171717] hover:bg-[#F6BD12] disabled:opacity-50 lg:flex"
      >
        →
      </button>

      {/* SLIDE INDICATORS */}
      <div className="absolute bottom-[4%] left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 sm:bottom-[5%] sm:gap-3">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => changeSlide(index)}
            disabled={isAnimating}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={activeIndex === index ? "true" : undefined}
            style={{ padding: "0 12px" }}
            className={`flex h-9 min-w-10 items-center justify-center rounded-xl border text-sm font-semibold sm:h-11 sm:min-w-12 ${
              activeIndex === index
                ? "border-[#F6BD12] bg-[#F6BD12] text-[#171717]"
                : "border-transparent text-[#171717]/45 hover:text-[#171717]"
            }`}
          >
            {String(index + 1).padStart(2, "0")}
          </button>
        ))}
      </div>

      {/* MODEL LABEL */}
      <p className="absolute bottom-[7%] right-[5%] z-30 hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-[#171717]/50 md:block">
        {activeSlide.model}
      </p>
    </section>
  );
}