"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const collections = [
  {
    name: "MOUNTAIN BIKES",
    subtitle: "Conquer every terrain",
    description:
      "Explore new trails with powerful performance, durable frames and superior control.",
    image: "/images/hero/hardtail-mtb.png",
    tag: "OFF ROAD",
    number: "01",
  },
  {
    name: "FULL SUSPENSION",
    subtitle: "Ride with confidence",
    description:
      "Experience superior comfort, advanced suspension and ultimate riding stability.",
    image: "/images/hero/full-suspension-mtb.png",
    tag: "PRO SERIES",
    number: "02",
  },
  {
    name: "ELECTRIC BIKES",
    subtitle: "Power your journey",
    description:
      "Discover a new way to ride with powerful electric assistance and modern design.",
    image: "/images/hero/electric-mtb.png",
    tag: "E-POWER",
    number: "03",
  },
];

export default function Collections() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            once: true,
          },
        });

        timeline
          .from(".col-head", {
            opacity: 0,
            y: 35,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
          })
          .from(
            ".col-card",
            {
              opacity: 0,
              y: 70,
              duration: 1,
              stagger: 0.18,
              ease: "power3.out",
            },
            "-=0.4",
          )
          .from(
            ".col-bike",
            {
              opacity: 0,
              scale: 0.85,
              duration: 1.2,
              stagger: 0.15,
              ease: "power3.out",
            },
            "-=0.6",
          )
          .from(
            ".col-foot",
            {
              opacity: 0,
              y: 25,
              duration: 0.8,
            },
            "-=0.3",
          );
      });

      return () => mm.revert();
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="collections"
      className="relative w-full overflow-hidden bg-[#F7F6F1] text-[#171717]"
      style={{ padding: "clamp(60px, 8vw, 120px) 0" }}
    >
      <div
        style={{
          width: "min(1250px, calc(100% - 40px))",
          margin: "0 auto",
        }}
      >
        {/* SECTION HEADER */}
        <div
          className="col-head flex flex-col justify-between gap-6 md:flex-row md:items-end"
          style={{ marginBottom: "clamp(35px, 5vw, 60px)" }}
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#B38A00]">
              FLYING WHEEL COLLECTIONS
            </p>

            <h2
              style={{ marginTop: "12px" }}
              className="font-[var(--font-bebas)] text-[clamp(48px,6vw,92px)] uppercase leading-[0.9]"
            >
              Find your perfect ride.
            </h2>

            <p
              style={{ marginTop: "18px", maxWidth: "460px" }}
              className="text-sm leading-relaxed text-[#171717]/60 sm:text-base"
            >
              From adventurous mountain trails to powerful electric rides,
              discover the bicycle that matches your lifestyle.
            </p>
          </div>

          <Link
            href="/shop"
            style={{ paddingBottom: "8px" }}
            className="inline-flex w-fit items-center gap-3 border-b-2 border-[#F6BD12] text-xs font-extrabold uppercase tracking-widest transition-colors duration-300 hover:text-[#B38A00]"
          >
            View all bicycles
            <span className="text-lg transition-transform duration-300 hover:translate-x-1">
              ↗
            </span>
          </Link>
        </div>

        {/* THREE COLLECTION CARDS */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {collections.map((item) => (
            <article
              key={item.name}
              className="col-card group relative flex flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
            >
              {/* IMAGE STAGE */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F7F6F1]">
                <span
                  style={{ padding: "8px 15px" }}
                  className="absolute left-5 top-5 z-20 rounded-full bg-[#F6BD12] text-[10px] font-extrabold uppercase tracking-widest text-[#171717]"
                >
                  {item.tag}
                </span>

                <span className="absolute right-5 top-5 z-20 text-xs font-bold tracking-widest text-black/30">
                  {item.number} / 03
                </span>

                {/* SUBTLE BRAND WATERMARK — no colored glow */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="select-none text-[150px] font-black leading-none tracking-tighter text-black/[0.035]">
                    FW
                  </span>
                </div>

                {/* BICYCLE IMAGE */}
                <div className="col-bike absolute inset-4 z-10 flex items-center justify-center">
                  <div className="bike-turntable relative h-full w-full">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="bike-image object-contain"
                    />
                  </div>
                </div>

                <div className="absolute bottom-4 left-5 z-20 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-black/40">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F6BD12]" />
                  FLYING WHEEL
                </div>

                <div className="card-indicator absolute bottom-4 right-5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-[#F6BD12] text-lg text-black">
                  ↗
                </div>
              </div>

              {/* CARD CONTENT */}
              <div
                className="flex flex-1 flex-col"
                style={{ padding: "clamp(22px, 2.4vw, 30px)" }}
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B38A00]">
                  {item.subtitle}
                </p>

                <h3
                  style={{ marginTop: "10px" }}
                  className="font-[var(--font-bebas)] text-[clamp(32px,3vw,42px)] uppercase leading-none tracking-wide"
                >
                  {item.name}
                </h3>

                <p
                  style={{ marginTop: "14px" }}
                  className="flex-1 text-sm leading-relaxed text-[#171717]/60"
                >
                  {item.description}
                </p>

                {/* ENQUIRE BUTTON */}
                <Link
                  href={`/contact?bike=${encodeURIComponent(item.name)}`}
                  style={{
                    marginTop: "25px",
                    height: "54px",
                    padding: "0 25px",
                  }}
                  className="enquire-button flex w-full items-center justify-between rounded-full bg-[#F6BD12] text-xs font-extrabold uppercase tracking-widest text-[#171717]"
                >
                  <span className="enquire-label">Enquire now</span>
                  <span className="enquire-arrow text-lg" aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* BOTTOM MESSAGE */}
        <div
          className="col-foot flex flex-col items-center text-center"
          style={{
            marginTop: "clamp(45px, 6vw, 75px)",
            paddingTop: "clamp(30px, 4vw, 45px)",
            borderTop: "1px solid rgba(0,0,0,0.1)",
          }}
        >
          <h3 className="font-[var(--font-bebas)] text-[clamp(30px,3.6vw,48px)] uppercase leading-none tracking-wide">
            Every ride starts with a choice.
          </h3>

          <p
            style={{ marginTop: "12px" }}
            className="text-sm text-[#171717]/60"
          >
            Choose your ride. Discover your freedom.
          </p>
        </div>
      </div>

      <style jsx global>{`
        .col-card {
          position: relative;
          transform: translateY(0);
          transition:
            transform 0.5s ease,
            box-shadow 0.5s ease,
            border-color 0.4s ease;
          will-change: transform;
        }

        .col-card:hover {
          transform: translateY(-12px);
          border-color: rgba(23, 23, 23, 0.18);
          box-shadow: 0 24px 50px rgba(0, 0, 0, 0.1);
        }

        .bike-turntable {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transform-origin: center center;
          will-change: transform;
        }

        .bike-image {
          object-fit: contain;
          transition:
            filter 0.5s ease,
            scale 0.5s ease;
          backface-visibility: visible;
        }

        /* Rotate the bicycle on card hover. No yellow background glow. */
        .col-card:hover .bike-turntable {
          animation: fw-bike-rotate 3s linear infinite;
        }

        @keyframes fw-bike-rotate {
          from {
            transform: perspective(1000px) rotateY(0deg);
          }
          to {
            transform: perspective(1000px) rotateY(360deg);
          }
        }

        .col-card:hover .bike-image {
          scale: 1.045;
          filter: drop-shadow(0 16px 16px rgba(0, 0, 0, 0.16));
        }

        .card-indicator {
          opacity: 0;
          transform: translateY(6px) rotate(-35deg);
          transition:
            opacity 0.3s ease,
            transform 0.3s ease;
        }

        .col-card:hover .card-indicator {
          opacity: 1;
          transform: translateY(0) rotate(0deg);
        }

        /* CTA: darkens on hover and animates the label and arrow. */
        .enquire-button {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          transition:
            background-color 0.35s ease,
            color 0.35s ease,
            transform 0.35s ease;
        }

        .enquire-button::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          background: #171717;
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          border-radius: inherit;
        }

        .enquire-button:hover::before,
        .enquire-button:focus-visible::before {
          transform: scaleX(1);
          transform-origin: left;
        }

        .enquire-button:hover,
        .enquire-button:focus-visible {
          color: #ffffff;
        }

        .enquire-label {
          display: inline-block;
          transition:
            transform 0.35s ease,
            letter-spacing 0.35s ease,
            color 0.35s ease;
        }

        .enquire-button:hover .enquire-label,
        .enquire-button:focus-visible .enquire-label {
          transform: translateX(4px);
          letter-spacing: 0.12em;
          color: #ffffff;
        }

        .enquire-arrow {
          display: inline-block;
          transition:
            transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
            color 0.35s ease;
        }

        .enquire-button:hover .enquire-arrow,
        .enquire-button:focus-visible .enquire-arrow {
          transform: translateX(7px);
          color: #ffffff;
        }

        .enquire-button:active {
          transform: scale(0.985);
        }

        .enquire-button:focus-visible {
          outline: 2px solid #171717;
          outline-offset: 4px;
        }

        @media (prefers-reduced-motion: reduce) {
          .col-card,
          .bike-turntable,
          .bike-image,
          .card-indicator,
          .enquire-button,
          .enquire-button::before,
          .enquire-label,
          .enquire-arrow {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
     