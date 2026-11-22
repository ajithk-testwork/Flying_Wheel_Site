"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import LoadingScreen from "../ui/LoadingScreen";
import BicycleCanvas from "./BicycleCanvas";
import { preloadBicycleFrames } from "./preloadSequence";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/*
  BRAND PALETTE (matches the logo, navbar and hero)
  Golden Yellow  #F6BD12
  White          #FFFFFF
  Charcoal       #171717
  Warm White     #F7F6F1
*/

const TOTAL_FRAMES = 100;

const chapters = [
  {
    number: "01",
    short: "HERO",
    label: "FLYING WHEEL / MOUNTAIN BIKES",
    headline: "RIDE BEYOND LIMITS.",
    description:
      "Welcome to Flying Wheel. Take a closer look at a mountain bike built for real trails, and see what makes every ride feel confident.",
    align: "center",
  },
  {
    number: "02",
    short: "FRAME",
    label: "01 / THE FRAME",
    headline: "ENGINEERED TO PERFORM.",
    description:
      "The frame is the backbone of every bike. Its shape and stiffness decide how strong, light and responsive your ride feels on climbs and descents.",
    align: "left",
  },
  {
    number: "03",
    short: "SUSPENSION",
    label: "02 / SUSPENSION",
    headline: "OWN EVERY TERRAIN.",
    description:
      "Suspension absorbs bumps, roots and rocks so the wheels stay in contact with the trail. The result is more grip, less fatigue and smoother control.",
    align: "right",
  },
  {
    number: "04",
    short: "DRIVETRAIN",
    label: "03 / DRIVETRAIN",
    headline: "POWER IN EVERY PEDAL.",
    description:
      "The chain, cassette and gears turn your pedalling into speed. A well-tuned drivetrain shifts cleanly under load, so you always find the right gear.",
    align: "left",
  },
  {
    number: "05",
    short: "CONTROL",
    label: "04 / BRAKES & CONTROL",
    headline: "STOP WITH CONFIDENCE.",
    description:
      "Good brakes give strong, predictable stopping in dry and wet conditions, so you can ride faster knowing you can slow down when it matters.",
    align: "right",
  },
  {
    number: "06",
    short: "FINALE",
    label: "FLYING WHEEL / YOUR NEXT RIDE",
    headline: "BUILT FOR YOUR NEXT ADVENTURE.",
    description:
      "From hardtail and full suspension to electric mountain bikes, find the ride that fits you. Browse the collection, or get in touch and we will help you choose.",
    align: "center",
  },
] as const;

const primaryButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "14px 28px",
  whiteSpace: "nowrap",
} as const;

export default function BicycleScrollExperience() {
  const wrapperRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const targetProgressRef = useRef(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [frames, setFrames] = useState<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeChapter, setActiveChapter] = useState(0);

  const current = chapters[activeChapter];

  const goToChapter = useCallback((index: number) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const chapterIndex = Math.max(0, Math.min(chapters.length - 1, index));
    const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: wrapperTop + window.innerHeight * chapterIndex,
      behavior: "smooth",
    });
  }, []);

  // Preload all 50 frames once. Fail clearly if any expected frame is missing.
  useEffect(() => {
    let cancelled = false;

    preloadBicycleFrames(TOTAL_FRAMES, (loaded) => {
      if (!cancelled) setLoadedCount(loaded);
    })
      .then((images) => {
        if (cancelled) return;

        const validImages = images.filter(
          (image) => image.complete && image.naturalWidth > 0,
        );

        if (validImages.length !== TOTAL_FRAMES) {
          setLoadError(
            `Only ${validImages.length}/${TOTAL_FRAMES} bicycle frames loaded. Check the filenames in public/sequences/bicycle/.`,
          );
          return;
        }

        setFrames(images);
        setIsReady(true);
      })
      .catch((error) => {
        console.error("Bicycle sequence preload failed:", error);
        if (!cancelled) {
          setLoadError(
            "Bicycle frames could not be loaded. Check that all 50 JPG files exist.",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // ScrollTrigger writes to refs. It does NOT re-render React on every wheel tick.
  useEffect(() => {
    if (!isReady || !wrapperRef.current || !stageRef.current) return;

    const wrapper = wrapperRef.current;

    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapper,
        pin: stageRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * (chapters.length - 1)}`,
        scrub: 1.15,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const nextProgress = Math.max(0, Math.min(1, self.progress));

          targetProgressRef.current = nextProgress;
          window.dispatchEvent(new Event("bicycle:progress"));

          if (progressBarRef.current) {
            progressBarRef.current.style.transform = `scaleX(${nextProgress})`;
          }

          const nextChapter = Math.min(
            chapters.length - 1,
            Math.floor(nextProgress * chapters.length),
          );

          setActiveChapter((previous) =>
            previous === nextChapter ? previous : nextChapter,
          );
        },
      });
    }, wrapper);

    const refreshFrame = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      cancelAnimationFrame(refreshFrame);
      context.revert();
    };
  }, [isReady]);

  // Animate only when the active chapter changes.
  useEffect(() => {
    const story = storyRef.current;
    if (!story || !isReady) return;

    const fromX = current.align === "right" ? 90 : -90;

    const animation = gsap.fromTo(
      story,
      {
        x: fromX,
        y: 20,
        opacity: 0,
        filter: "blur(7px)",
      },
      {
        x: 0,
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power3.out",
        clearProps: "transform,filter",
      },
    );

    return () => {
      animation.kill();
    };
  }, [activeChapter, isReady, current.align]);

  if (!isReady && !loadError) {
    return (
      <LoadingScreen totalFrames={TOTAL_FRAMES} loadedFrames={loadedCount} />
    );
  }

  if (loadError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#171717] px-6 text-center text-white">
        <div className="max-w-xl">
          <p className="mb-3 text-xs font-bold tracking-[0.3em] text-[#F6BD12]">
            FLYING WHEEL / SEQUENCE ERROR
          </p>
          <h1 className="mb-4 text-3xl font-bold">
            Bicycle frames could not load
          </h1>
          <p className="text-sm leading-7 text-white/60">{loadError}</p>
        </div>
      </main>
    );
  }

  const textPosition =
    current.align === "left"
      ? "left-6 text-left sm:left-12 lg:left-[8%]"
      : current.align === "right"
        ? "right-6 text-right sm:right-12 lg:right-[8%]"
        : "left-1/2 -translate-x-1/2 text-center";

  // Dynamic vertical position for each chapter
  const textTop =
    activeChapter === chapters.length - 1
      ? "top-[10%] sm:top-[12%]"
      : "top-[20%] sm:top-[26%]";

  const textWidth = current.align === "center" ? "max-w-4xl" : "max-w-[520px]";

  const descriptionAlign =
    current.align === "center"
      ? "mx-auto"
      : current.align === "right"
        ? "ml-auto"
        : "";

  return (
    <section
      ref={wrapperRef}
      aria-label="Flying Wheel cinematic bicycle experience"
      className="relative w-full bg-[#171717] text-white"
      style={{ height: `${chapters.length * 100}svh` }}
    >
      <div
        ref={stageRef}
        className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-[#171717]"
      >
        {/* Full-viewport bicycle image sequence */}
        <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
          <BicycleCanvas
            frames={frames}
            targetProgressRef={targetProgressRef}
          />
        </div>

        {/* Small brand marker, placed below the floating site navbar */}
        <div className="absolute right-6 top-[112px] z-30 flex items-center gap-2 text-[9px] font-semibold tracking-[0.22em] text-white/60 sm:right-10">
          <span className="h-1.5 w-1.5 rounded-full bg-[#F6BD12]" />
          FW / 360° VIEW
        </div>

        {/* Alternating chapter text */}
        <div
          key={activeChapter}
          ref={storyRef}
          className={`absolute ${textTop} z-20 w-[min(92%,900px)] ${textPosition} ${textWidth}`}
        >
          <p className="mb-4 text-[9px] font-bold uppercase tracking-[0.32em] text-[#F6BD12] sm:text-[11px]">
            {current.label}
          </p>

          <h1
            className={`
    font-[var(--font-bebas)]
    ${
      activeChapter === chapters.length - 1
        ? "text-[clamp(2.8rem,5.5vw,5.5rem)]"
        : "text-[clamp(2.8rem,7.2vw,7rem)]"
    }
    leading-[0.95]
    tracking-[-0.025em]
    text-white
    [text-shadow:0_2px_12px_rgba(0,0,0,0.55)]
  `}
          >
            {current.headline}
          </h1>

          <p
            style={{ marginTop: "20px" }}
            className={`max-w-[440px] text-xs leading-6 text-white/80 sm:text-sm sm:leading-7 ${descriptionAlign}`}
          >
            {current.description}
          </p>


          {activeChapter === chapters.length - 1 && (
            <div
              style={{ marginTop: "28px" }}
              className="flex flex-wrap justify-center gap-3"
            >
              <Link
                href="/shop"
                style={primaryButtonStyle}
                className="rounded-full bg-[#F6BD12] text-[11px] font-extrabold tracking-[0.14em] text-[#171717] hover:bg-white"
              >
                SHOP THE COLLECTION
              </Link>
              <button
                type="button"
                onClick={() => goToChapter(0)}
                style={primaryButtonStyle}
                className="rounded-full border border-white/50 text-[11px] font-extrabold tracking-[0.14em] text-white hover:border-[#F6BD12] hover:text-[#F6BD12]"
              >
                REPLAY EXPERIENCE
              </button>
            </div>
          )}
        </div>

        {/* Bottom chapter navigation */}
        <div className="absolute bottom-5 left-1/2 z-40 w-[calc(100%-28px)] max-w-[760px] -translate-x-1/2 sm:bottom-8">
          <div
            style={{ marginBottom: "12px" }}
            className="h-[2px] w-full overflow-hidden bg-white/25"
          >
            <div
              ref={progressBarRef}
              className="h-full origin-left scale-x-0 bg-[#F6BD12]"
            />
          </div>
        </div>

        <span className="absolute bottom-[105px] right-6 z-20 hidden text-[9px] tracking-[0.25em] text-white/60 lg:block">
          SCROLL TO EXPLORE
        </span>
      </div>
    </section>
  );
}
