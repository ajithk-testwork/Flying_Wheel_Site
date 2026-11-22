"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { Syne } from "next/font/google";

/* ==========================================
   FONT
========================================== */

const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

/* ==========================================
   SETTINGS
========================================== */

const FONT_WEIGHT = 700;
const LETTER_SPACING = "-0.02em";
const AUTOPLAY_GAP_MS = 3000;
const SHOW_CAPTION = false;
const RESPECT_REDUCED_MOTION = false;

/* ==========================================
   SLIDER IMAGES
========================================== */

const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=1000&h=1400&q=90",
    title: "ROAD ADVENTURE",
    alt: "Cyclist riding on an open road",
  },
  {
    src: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1000&h=1400&q=90",
    title: "RIDE TOGETHER",
    alt: "Cyclists riding together",
  },
  {
    src: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1000&h=1400&q=90",
    title: "PURE FREEDOM",
    alt: "Premium bicycle",
  },
  {
    src: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1000&h=1400&q=90",
    title: "BEYOND LIMITS",
    alt: "Mountain bicycle",
  },
];

/* ==========================================
   BACKGROUND TYPOGRAPHY ROWS

   1 = RIGHT
  -1 = LEFT
========================================== */

const ROWS = [
  {
    text: "ELECTRIFY YOUR RIDE - BREAK THE LIMIT - POWER YOUR ADVENTURE - ",
    dir: 1,
    vw: 3.3,
  },
  {
    text: "BREAK THE LIMIT - ELECTRIFY YOUR RIDE - POWER YOUR ADVENTURE - ",
    dir: -1,
    vw: 3.6,
  },
  {
    text: "POWER YOUR ADVENTURE - ELECTRIFY YOUR RIDE - BREAK THE LIMIT - ",
    dir: 1,
    vw: 3.9,
  },
  {
    text: "ELECTRIFY YOUR RIDE - POWER YOUR ADVENTURE - BREAK THE LIMIT - ",
    dir: -1,
    vw: 3.4,
  },
] as const;

/* ==========================================
   CARD POSITIONS
========================================== */

type Pose = {
  x: number;
  rot: number;
  rotY: number;
  scale: number;
  opacity: number;
  z: number;
};

const poseFor = (offset: number): Pose => {
  switch (offset) {
    case 0:
      return {
        x: 0,
        rot: 0,
        rotY: 0,
        scale: 1,
        opacity: 1,
        z: 30,
      };

    case 1:
      return {
        x: 7.8,
        rot: 1.2,
        rotY: 12,
        scale: 0.97,
        opacity: 1,
        z: 20,
      };

    case -1:
      return {
        x: -7,
        rot: -1.5,
        rotY: -12,
        scale: 0.97,
        opacity: 1,
        z: 20,
      };

    case -2:
      return {
        x: -11.6,
        rot: -3,
        rotY: -14,
        scale: 0.95,
        opacity: 1,
        z: 10,
      };

    default:
      return {
        x: offset < 0 ? -11.6 : 7.8,
        rot: 0,
        rotY: 0,
        scale: 0.92,
        opacity: 0,
        z: 5,
      };
  }
};

const tf = (p: Pose) =>
  `perspective(1100px) translateX(${p.x}%) rotate(${p.rot}deg) rotateY(${p.rotY}deg) scale(${p.scale})`;

const styleOf = (p: Pose): CSSProperties => ({
  transform: tf(p),
  opacity: p.opacity,
  zIndex: p.z,
});

const offsetOf = (i: number, active: number, n: number) => {
  let off = (((i - active) % n) + n) % n;

  if (off > n / 2) off -= n;

  if (n % 2 === 0 && off === n / 2) {
    off = -off;
  }

  return off;
};

/* ==========================================
   MAIN COMPONENT
========================================== */

export default function HeroMarqueeSlider() {
  const rootRef = useRef<HTMLElement>(null);

  const goRef = useRef<((dir: 1 | -1) => void) | null>(null);

  const liveRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) return;

    const n = SLIDES.length;

    const reduce =
      RESPECT_REDUCED_MOTION &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-card]"));

    const tracks = Array.from(
      root.querySelectorAll<HTMLElement>("[data-track]"),
    );

    let active = 0;
    let busy = false;
    let paused = false;
    let alive = true;

    let timer: number | undefined;
    let transitionTimer: number | undefined;

    /* ======================================
       MARQUEE ANIMATION
       Four independent continuous tracks
    ====================================== */

    const marqueeAnimations: Animation[] = [];

    const syncSpeed = () => {
      if (!alive || reduce) return;

      // Cancel old animations before recalculating
      marqueeAnimations.forEach((animation) => {
        animation.cancel();
      });

      marqueeAnimations.length = 0;

      tracks.forEach((track, i) => {
        const row = ROWS[i];

        if (!row) return;

        const halfWidth = track.scrollWidth / 2;

        if (!halfWidth) return;

        // Individual speed for every row
        const speed = (row.vw * window.innerWidth) / 100;

        const duration = (halfWidth / speed) * 1000;

        const isRight = row.dir === 1;

        const animation = track.animate(
          isRight
            ? [
                {
                  transform: `translate3d(${-halfWidth}px, 0, 0)`,
                },
                {
                  transform: "translate3d(0, 0, 0)",
                },
              ]
            : [
                {
                  transform: "translate3d(0, 0, 0)",
                },
                {
                  transform: `translate3d(${-halfWidth}px, 0, 0)`,
                },
              ],
          {
            duration,
            iterations: Infinity,
            easing: "linear",
          },
        );

        marqueeAnimations.push(animation);
      });
    };

    // Start marquee
    syncSpeed();

    // Update marquee on resize
    window.addEventListener("resize", syncSpeed);

    // Recalculate after fonts finish loading
    document.fonts?.ready.then(() => {
      if (alive) {
        syncSpeed();
      }
    });

    /* ======================================
       CARD ANIMATION HELPERS
    ====================================== */

    const apply = (el: HTMLElement, p: Pose) => {
      el.style.transform = tf(p);
      el.style.opacity = String(p.opacity);
      el.style.zIndex = String(p.z);
    };

    const run = (
      el: HTMLElement,
      frames: {
        pose: Pose;
        offset: number;
        easing?: string;
      }[],
      duration: number,
      easing: string,
      finalPose: Pose,
    ) => {
      if (reduce || duration === 0) {
        apply(el, finalPose);
        return;
      }

      const anim = el.animate(
        frames.map((f) => ({
          transform: tf(f.pose),
          opacity: f.pose.opacity,
          offset: f.offset,
          ...(f.easing ? { easing: f.easing } : {}),
        })),
        {
          duration,
          easing,
          fill: "forwards",
        },
      );

      anim.onfinish = () => {
        apply(el, finalPose);
        anim.cancel();
      };
    };

    /* ======================================
       AUTOPLAY SCHEDULER
    ====================================== */

    const schedule = (delay = AUTOPLAY_GAP_MS) => {
      window.clearTimeout(timer);

      if (reduce || !alive) return;

      timer = window.setTimeout(() => {
        if (!alive) return;

        if (paused || document.hidden) {
          schedule(1000);
          return;
        }

        go(1);
      }, delay);
    };

    /* ======================================
       CENTER IMAGE SLIDE TRANSITION
    ====================================== */

    const go = (dir: 1 | -1) => {
      if (busy || !alive) return;

      busy = true;

      window.clearTimeout(timer);

      const from = active;
      const to = (active + dir + n) % n;

      const D = reduce ? 0 : 1100;

      const front = poseFor(0);
      const slot = poseFor(-dir);

      const incoming = cards[to];
      const outgoing = cards[from];

      if (!incoming || !outgoing) {
        busy = false;
        return;
      }

      // Incoming image
      incoming.style.zIndex = "40";

      run(
        incoming,
        [
          {
            pose: {
              x: dir * 58,
              rot: dir * 8,
              rotY: 0,
              scale: 0.98,
              opacity: 1,
              z: 40,
            },
            offset: 0,
          },
          {
            pose: front,
            offset: 1,
          },
        ],
        D,
        "cubic-bezier(0.16, 1, 0.3, 1)",
        front,
      );

      // Outgoing image
      outgoing.style.zIndex = "35";

      run(
        outgoing,
        [
          {
            pose: front,
            offset: 0,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          },
          {
            pose: {
              x: -dir * 60,
              rot: -dir * 9,
              rotY: 0,
              scale: 0.97,
              opacity: 1,
              z: 35,
            },
            offset: 0.4,
            easing: "ease-in-out",
          },
          {
            pose: slot,
            offset: 1,
          },
        ],
        D,
        "linear",
        slot,
      );

      // Rear cards rearrange
      cards.forEach((card, i) => {
        if (i === from || i === to) return;

        const before = poseFor(offsetOf(i, from, n));
        const after = poseFor(offsetOf(i, to, n));

        card.style.zIndex = String(after.z);

        run(
          card,
          [
            {
              pose: before,
              offset: 0,
            },
            {
              pose: after,
              offset: 1,
            },
          ],
          D * 0.9,
          "cubic-bezier(0.65, 0, 0.35, 1)",
          after,
        );
      });

      transitionTimer = window.setTimeout(() => {
        if (!alive) return;

        active = to;

        cards.forEach((card, i) => {
          card.style.zIndex = String(poseFor(offsetOf(i, to, n)).z);
        });

        if (liveRef.current) {
          liveRef.current.textContent = `Slide ${to + 1} of ${n}`;
        }

        busy = false;

        schedule();
      }, D + 50);
    };

    goRef.current = go;

    // Initial autoplay
    schedule(2500);

    /* ======================================
       PAUSE ON FOCUS
    ====================================== */

    const hold = () => {
      paused = true;
    };

    const release = () => {
      paused = false;
      schedule();
    };

    root.addEventListener("focusin", hold);
    root.addEventListener("focusout", release);

    /* ======================================
       PAUSE WHEN TAB IS HIDDEN
    ====================================== */

    const handleVisibility = () => {
      if (!document.hidden && !paused && !busy) {
        schedule(1000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    /* ======================================
       CLEANUP
    ====================================== */

    return () => {
      alive = false;

      window.clearTimeout(timer);
      window.clearTimeout(transitionTimer);

      window.removeEventListener("resize", syncSpeed);

      document.removeEventListener("visibilitychange", handleVisibility);

      root.removeEventListener("focusin", hold);
      root.removeEventListener("focusout", release);

      // Cancel all marquee animations
      marqueeAnimations.forEach((animation) => {
        animation.cancel();
      });

      marqueeAnimations.length = 0;

      // Cancel all card animations
      cards.forEach((card) => {
        card.getAnimations().forEach((animation) => {
          animation.cancel();
        });
      });

      goRef.current = null;
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="fw-showcase"
      style={
        {
          "--fw": FONT_WEIGHT,
          "--ls": LETTER_SPACING,
        } as CSSProperties
      }
      aria-roledescription="carousel"
      aria-label="Flying Wheel bicycle showcase"
    >
      {/* =====================================
          FOUR ROW MOVING TYPOGRAPHY
      ===================================== */}

      <div className="fw-marquee" aria-hidden="true">
        {ROWS.map((row, i) => (
          <div className="fw-row" key={i}>
            <div
              data-track
              className={`fw-track ${
                row.dir === 1 ? "fw-right" : "fw-left"
              } ${syne.className}`}
            >
              <span>{row.text}</span>
              <span>{row.text}</span>
            </div>
          </div>
        ))}
      </div>

      {/* =====================================
          CENTER IMAGE STACK
      ===================================== */}

      <div className="fw-stack-wrap">
        <div className="fw-stack">
          {SLIDES.map((slide, i) => (
            <div
              data-card
              className="fw-card"
              key={slide.src}
              style={styleOf(poseFor(offsetOf(i, 0, SLIDES.length)))}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${SLIDES.length}`}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className="fw-img"
                draggable={false}
                loading="eager"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />

              {SHOW_CAPTION && (
                <>
                  <div className="fw-shade" />

                  <div className="fw-caption">
                    <span>FLYING WHEEL</span>
                    <h2>{slide.title}</h2>
                    <div className="fw-gold-line" />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* =====================================
          PREVIOUS ARROW
      ===================================== */}

      <button
        type="button"
        className="fw-arrow fw-arrow-left"
        aria-label="Previous bicycle"
        onClick={() => goRef.current?.(-1)}
      >
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M19 12H5m0 0 6-6m-6 6 6 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* =====================================
          NEXT ARROW
      ===================================== */}

      <button
        type="button"
        className="fw-arrow fw-arrow-right"
        aria-label="Next bicycle"
        onClick={() => goRef.current?.(1)}
      >
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12h14m0 0-6-6m6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* ACCESSIBILITY */}

      <p ref={liveRef} className="fw-sr-only" aria-live="polite">
        Slide 1 of {SLIDES.length}
      </p>

      {/* =====================================
          COMPLETE STYLES
      ===================================== */}

      <style jsx>{`
        .fw-showcase {
          --fs: clamp(88px, 10vw, 190px);
          --card-w: clamp(220px, 27.1vw, 520px);

          position: relative;
          width: 100%;
          height: max(
            calc(var(--fs) * 4.2),
            calc(var(--card-w) * 1.316 + 90px)
          );

          overflow: hidden;
          isolation: isolate;
          background: #fff;
          color: #111;
        }

        /* BACKGROUND TYPOGRAPHY */

        .fw-marquee {
          position: absolute;
          inset: 0;
          z-index: 1;

          display: flex;
          flex-direction: column;
          justify-content: center;

          overflow: hidden;
          pointer-events: none;
        }

        .fw-row {
          position: relative;
          flex: 0 0 auto;

          width: 100%;
          height: calc(var(--fs) * 1.25);

          display: flex;
          align-items: center;

          overflow: hidden;
          white-space: nowrap;

          animation: fw-rise 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .fw-row:nth-child(2) {
          animation-delay: 0.1s;
        }

        .fw-row:nth-child(3) {
          animation-delay: 0.2s;
        }

        .fw-row:nth-child(4) {
          animation-delay: 0.3s;
        }

        /* TYPOGRAPHY TRACK */

        .fw-track {
          display: flex;
          align-items: center;

          width: max-content;
          flex-shrink: 0;

          white-space: nowrap;

          font-size: var(--fs);
          font-weight: var(--fw);
          line-height: 1.25;
          letter-spacing: var(--ls);

          text-transform: uppercase;
          will-change: transform;
        }

        .fw-track span {
          display: block;
          flex-shrink: 0;
        }

        /* ENTRANCE ANIMATION */

        @keyframes fw-rise {
          from {
            opacity: 0;
            transform: translateY(40px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fw-fade {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        /* CENTER IMAGE STACK */

        .fw-stack-wrap {
          position: absolute;
          z-index: 10;

          top: 50%;
          left: 50%;

          width: var(--card-w);
          aspect-ratio: 19 / 25;

          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .fw-stack {
          position: absolute;
          inset: 0;

          animation: fw-rise 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both;
        }

        .fw-card {
          position: absolute;
          inset: 0;

          overflow: hidden;
          border-radius: 2px;

          background: linear-gradient(to bottom, #171717, #3a3a3a);

          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.16);

          will-change: transform, opacity;
          backface-visibility: hidden;
        }

        .fw-img {
          position: absolute;
          inset: 0;

          display: block;
          width: 100%;
          height: 100%;
          max-width: none;

          object-fit: cover;
          object-position: center;

          user-select: none;
        }

        /* IMAGE CAPTION */

        .fw-shade {
          position: absolute;
          inset: 0;

          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.75) 0%,
            transparent 45%
          );
        }

        .fw-caption {
          position: absolute;
          left: 25px;
          right: 20px;
          bottom: 34px;

          display: flex;
          flex-direction: column;
          gap: 8px;

          color: #fff;
        }

        .fw-caption span {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 3px;
        }

        .fw-caption h2 {
          margin: 0;
          font-size: clamp(17px, 1.5vw, 23px);
          font-weight: 800;
          letter-spacing: 0.5px;
        }

        .fw-gold-line {
          width: 40px;
          height: 3px;
          margin-top: 5px;
          background: #f6bd12;
        }

        /* NAVIGATION ARROWS */

        .fw-arrow {
          position: absolute;
          z-index: 30;

          top: 50%;

          display: flex;
          align-items: center;
          justify-content: center;

          width: clamp(46px, 3.9vw, 75px);
          height: clamp(40px, 2.9vw, 55px);

          margin-top: calc(clamp(40px, 2.9vw, 55px) / -2);

          border: 1.5px solid #f6bd12;
          border-radius: 12px;

          background: #fff;
          color: #171717;

          cursor: pointer;

          animation: fw-fade 0.8s ease 0.9s both;

          transition:
            background 0.3s ease,
            color 0.3s ease,
            transform 0.3s ease;
        }

        .fw-arrow:hover {
          background: #f6bd12;
          color: #171717;
          transform: scale(1.06);
        }

        .fw-arrow svg {
          width: 22px;
          height: 22px;
        }

        .fw-arrow-left {
          left: 2.4vw;
        }

        .fw-arrow-right {
          right: 2.4vw;
        }

        /* ACCESSIBILITY */

        .fw-sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* TABLET */

        @media (max-width: 900px) {
          .fw-showcase {
            --fs: clamp(75px, 11vw, 120px);
            --card-w: clamp(220px, 40vw, 360px);
          }

          .fw-row {
            height: calc(var(--fs) * 1.25);
          }

          .fw-arrow-left {
            left: 15px;
          }

          .fw-arrow-right {
            right: 15px;
          }
        }

        /* MOBILE */

        @media (max-width: 600px) {
          .fw-showcase {
            --fs: clamp(58px, 13vw, 85px);
            --card-w: 62vw;

            height: max(
              calc(var(--fs) * 5.2),
              calc(var(--card-w) * 1.316 + 70px)
            );
          }

          .fw-row {
            height: calc(var(--fs) * 1.25);
          }

          .fw-arrow {
            width: 38px;
            height: 38px;
            margin-top: -19px;
            border-radius: 9px;
          }

          .fw-arrow-left {
            left: 8px;
          }

          .fw-arrow-right {
            right: 8px;
          }

          .fw-arrow svg {
            width: 18px;
            height: 18px;
          }

          .fw-caption {
            left: 14px;
            bottom: 22px;
          }
        }

        /* SMALL MOBILE */

        @media (max-width: 380px) {
          .fw-showcase {
            --fs: 55px;
            --card-w: 68vw;
          }

          .fw-caption {
            left: 10px;
            right: 10px;
            bottom: 16px;
          }
        }

        /* REDUCED MOTION */

        @media (prefers-reduced-motion: reduce) {
          .fw-row,
          .fw-stack,
          .fw-arrow {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
