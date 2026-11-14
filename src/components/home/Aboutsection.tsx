"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/*
  BRAND PALETTE
  Golden Yellow  #F6BD12
  White          #FFFFFF
  Charcoal       #171717
  Warm White     #F7F6F1

  The bike photo has a solid orange background, so the panel uses that same
  orange. The photo edge is feathered with a mask so no seam is visible.
  If you still see a faint edge, tweak IMAGE_BG to match your photo exactly.

  Spacing (margin / padding) uses inline style because Tailwind spacing
  classes (mx-auto, mt-*, p-*) do not apply in this project.
*/
const BANNER_IMAGE = "/images/about-home.webp";
const IMAGE_BG = "#FF5200";

const HEADING_LINES = ["BICYCLE", "TOURS &", "TRIALS"];

// Feather the photo edge: top fade on mobile, left fade on desktop.
const FADE =
  "[-webkit-mask-image:linear-gradient(to_bottom,transparent,#000_28%)] [mask-image:linear-gradient(to_bottom,transparent,#000_28%)] " +
  "lg:[-webkit-mask-image:linear-gradient(to_right,transparent,#000_26%)] lg:[mask-image:linear-gradient(to_right,transparent,#000_26%)]";

export default function BicycleBanner() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const q = gsap.utils.selector(section);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // LANDING ANIMATION (plays once when the banner enters the screen)
      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        scrollTrigger: { trigger: section, start: "top 75%", once: true },
      });

      tl.from(q(".banner-panel"), {
        autoAlpha: 0,
        y: 70,
        scale: 0.96,
        duration: 1.2,
      })
        .from(
          q(".banner-bike"),
          { autoAlpha: 0, scale: 1.12, duration: 1.8, ease: "power3.out" },
          0.1,
        )
        .from(q(".banner-label"), { autoAlpha: 0, y: 18, duration: 0.8 }, 0.35)
        .from(
          q(".banner-line"),
          { yPercent: 115, duration: 1.1, stagger: 0.1 },
          0.45,
        )
        .from(q(".banner-cta"), { autoAlpha: 0, y: 22, duration: 0.9 }, 0.95);

      // SMOOTH PARALLAX (photo drifts slowly while scrolling past)
      gsap.fromTo(
        q(".banner-parallax"),
        { yPercent: -3 },
        {
          yPercent: 3,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Bicycle tours and trials"
      className="w-full overflow-hidden bg-[#F7F6F1]"
      style={{ padding: "clamp(32px, 6vw, 96px) 0" }}
    >
      <div
        className="banner-panel relative flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl lg:min-h-[640px] lg:justify-center xl:min-h-[700px]"
        style={{
          width: "min(1300px, calc(100% - 32px))",
          margin: "0 auto",
          backgroundColor: IMAGE_BG,
        }}
      >
        {/* TEXT */}
        <div
          className="relative z-20"
          style={{
            padding:
              "clamp(32px, 6vw, 72px) clamp(24px, 5vw, 72px) clamp(8px, 2vw, 24px)",
          }}
        >
          <p className="banner-label text-[11px] font-bold uppercase tracking-[0.24em] text-white sm:text-xs">
            Your ride starts here
          </p>

          <h2
            style={{ marginTop: "14px" }}
            className="font-[var(--font-bebas)] text-[clamp(64px,9vw,148px)] font-normal uppercase leading-[0.88] tracking-[-0.01em] text-white"
          >
            {HEADING_LINES.map((line) => (
              <span
                key={line}
                className="block overflow-hidden"
                style={{ paddingBottom: "0.05em" }}
              >
                <span className="banner-line block">{line}</span>
              </span>
            ))}
          </h2>

          <Link
            href="/shop"
            style={{
              marginTop: "clamp(20px, 3vw, 32px)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 34px",
              height: "54px",
              whiteSpace: "nowrap",
            }}
            className="banner-cta rounded-full bg-[#F6BD12] text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#171717] hover:bg-white"
          >
            View Bikes
          </Link>
        </div>

        {/* IMAGE: below the text on phones/tablets, behind the text on desktop */}
        <div
          className={`banner-bike pointer-events-none relative z-10 h-[clamp(240px,58vw,460px)] w-full overflow-hidden lg:absolute lg:inset-y-0 lg:right-0 lg:h-full lg:w-[68%] ${FADE}`}
        >
          <div
            className="banner-parallax absolute inset-x-0"
            style={{ top: "-6%", height: "112%" }}
          >
            <Image
              src={BANNER_IMAGE}
              alt="Flying Wheel mountain bike handlebar"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 68vw"
              className="object-cover object-[62%_center]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}