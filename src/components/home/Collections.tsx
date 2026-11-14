"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/*
  BRAND PALETTE (same as Navbar, Hero, About, Banner)
  Golden Yellow  #F6BD12
  White          #FFFFFF
  Charcoal       #171717
  Warm White     #F7F6F1
  Gold text      #B38A00

  Spacing (margin / padding) uses inline style because Tailwind spacing
  classes (mx-auto, mt-*, p-*, px-*) do not apply in this project.
*/

const collections = [
  {
    name: "MOUNTAIN BIKES",
    subtitle: "Conquer every terrain",
    description:
      "Explore new trails with powerful performance, durable frames and superior control.",
    image: "/images/hero/hardtail-mtb.png",
    tag: "OFF ROAD",
  },
  {
    name: "FULL SUSPENSION",
    subtitle: "Ride with confidence",
    description:
      "Experience superior comfort, advanced suspension and ultimate riding stability.",
    image: "/images/hero/full-suspension-mtb.png",
    tag: "PRO SERIES",
  },
  {
    name: "ELECTRIC BIKES",
    subtitle: "Power your journey",
    description:
      "Discover a new way to ride with powerful electric assistance and modern design.",
    image: "/images/hero/electric-mtb.png",
    tag: "E-POWER",
  },
];

export default function Collections() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const q = gsap.utils.selector(section);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        scrollTrigger: { trigger: section, start: "top 78%", once: true },
      });

      tl.from(q(".col-head"), {
        autoAlpha: 0,
        y: 30,
        duration: 1,
        stagger: 0.1,
      })
        .from(
          q(".col-card"),
          { autoAlpha: 0, y: 70, duration: 1.1, stagger: 0.14 },
          0.25,
        )
        .from(
          q(".col-bike"),
          { x: 60, scale: 0.94, duration: 1.4, stagger: 0.14, ease: "power3.out" },
          0.35,
        )
        .from(q(".col-foot"), { autoAlpha: 0, y: 20, duration: 0.9 }, 0.9);
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="collections"
      className="relative w-full overflow-hidden bg-[#F7F6F1] text-[#171717]"
      style={{ padding: "clamp(56px, 8vw, 120px) 0" }}
    >
      <div
        style={{ width: "min(1250px, calc(100% - 40px))", margin: "0 auto" }}
      >
        {/* SECTION HEADER */}
        <div
          className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
          style={{ marginBottom: "clamp(32px, 5vw, 56px)" }}
        >
          <div>
            <p className="col-head text-[11px] font-bold uppercase tracking-[0.3em] text-[#B38A00]">
              Flying Wheel Collections
            </p>

            <h2
              style={{ marginTop: "12px" }}
              className="col-head font-[var(--font-bebas)] text-[clamp(48px,6vw,92px)] font-normal uppercase leading-[0.9] tracking-[-0.02em]"
            >
              Find your perfect ride.
            </h2>

            <p
              style={{ marginTop: "18px", maxWidth: "460px" }}
              className="col-head text-sm leading-relaxed text-[#171717]/60 sm:text-base"
            >
              From adventurous mountain trails to powerful electric rides,
              discover the bicycle that matches your lifestyle.
            </p>
          </div>

          <Link
            href="/shop"
            style={{ paddingBottom: "8px" }}
            className="col-head inline-flex w-fit items-center gap-3 border-b-2 border-[#F6BD12] text-xs font-extrabold uppercase tracking-widest hover:text-[#B38A00]"
          >
            View all bicycles
            <span className="text-lg">→</span>
          </Link>
        </div>

        {/* COLLECTION CARDS */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {collections.map((item, index) => (
            <article
              key={item.name}
              className={`col-card group flex flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:border-[#F6BD12] ${
                index === 2 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              {/* IMAGE AREA */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F2F1ED] md:aspect-[16/11] lg:aspect-[4/3]">
                {/* TAG */}
                <span
                  style={{ padding: "7px 14px" }}
                  className="absolute left-4 top-4 z-20 rounded-full bg-[#F6BD12] text-[10px] font-extrabold uppercase tracking-widest text-[#171717]"
                >
                  {item.tag}
                </span>

                {/* WATERMARK */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="select-none text-[clamp(110px,14vw,170px)] font-black leading-none tracking-tighter text-black/[0.04]">
                    FW
                  </span>
                </div>

                {/* BICYCLE */}
                <div className="col-bike absolute inset-5">
                  <div className="relative h-full w-full transition-transform duration-700 ease-out group-hover:scale-105">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* CONTENT */}
              <div
                className="flex flex-1 flex-col"
                style={{ padding: "clamp(20px, 2.4vw, 30px)" }}
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B38A00]">
                  {item.subtitle}
                </p>

                <h3
                  style={{ marginTop: "8px" }}
                  className="font-[var(--font-bebas)] text-[clamp(32px,3vw,42px)] font-normal uppercase leading-none tracking-wide"
                >
                  {item.name}
                </h3>

                <p
                  style={{ marginTop: "12px" }}
                  className="flex-1 text-sm leading-relaxed text-[#171717]/60"
                >
                  {item.description}
                </p>

                {/* ENQUIRY BUTTON: flat style, same as hero, instant color swap */}
                <Link
                  href={`/contact?bike=${encodeURIComponent(item.name)}`}
                  style={{
                    marginTop: "24px",
                    height: "54px",
                    padding: "0 28px",
                    whiteSpace: "nowrap",
                  }}
                  className="flex w-full items-center justify-between rounded-full bg-[#F6BD12] text-xs font-extrabold uppercase tracking-widest text-[#171717] hover:bg-[#171717] hover:text-[#F6BD12]"
                >
                  <span>Enquire now</span>
                  <span className="text-lg">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* BOTTOM MESSAGE */}
        <div
          className="col-foot flex flex-col items-center text-center"
          style={{
            marginTop: "clamp(40px, 6vw, 72px)",
            paddingTop: "clamp(28px, 4vw, 44px)",
            borderTop: "1px solid rgba(0,0,0,0.1)",
          }}
        >
          <h3 className="font-[var(--font-bebas)] text-[clamp(30px,3.6vw,48px)] font-normal uppercase leading-none tracking-wide">
            Every ride starts with a choice.
          </h3>
          <p
            style={{ marginTop: "10px" }}
            className="text-sm text-[#171717]/60"
          >
            Choose your ride. Discover your freedom.
          </p>
        </div>
      </div>
    </section>
  );
}