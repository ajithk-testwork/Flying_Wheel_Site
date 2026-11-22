"use client";

/**
 * Needs: npm i framer-motion gsap
 *
 * Same animation system as the Shop and About pages:
 *  Framer Motion -> hero landing (all 4 sides), directional entrances,
 *                   clip-path map reveal, form/success swap
 *  GSAP          -> progress bar, scroll-velocity marquee, character reveal,
 *                   contact cards flying in
 */

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
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

const CONTACT = {
  name: "Flying Wheels – The Cyclist Den",
  address: "Chennai, Tamil Nadu",
  phone: "+00 00000 00000",
  email: "hello@yourdomain.com",
  hours: "Mon – Sat: 10:00 AM – 7:00 PM",
};

const MAP_QUERY = encodeURIComponent(`${CONTACT.name}, ${CONTACT.address}`);
const MAP_EMBED = `https://www.google.com/maps?q=${MAP_QUERY}&output=embed`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`;

const subjects = [
  "Buying a bike",
  "Book a test ride",
  "Service and repairs",
  "Product enquiry",
  "Cycling accessories",
  "Other enquiry",
];

const marqueeWords = [
  "BUY A BIKE",
  "TEST RIDE",
  "SERVICE",
  "REPAIRS",
  "ACCESSORIES",
  "ENQUIRIES",
];

const container = "mx-auto w-full max-w-[1450px] px-5 sm:px-10 lg:px-[7%]";

const inputClass =
  "!h-[54px] !w-full !rounded-xl !border !border-[#171717]/15 !bg-white !px-4 !text-sm !text-[#171717] !shadow-none !outline-none placeholder:!text-[#888] transition-all duration-300 focus:!border-[#F6BD12] focus:!ring-2 focus:!ring-[#F6BD12]/20";

const labelClass =
  "mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#171717]/65";

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

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.28em] text-[#C58C00] sm:text-[11px]">
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

function ContactIcon({
  type,
}: {
  type: "location" | "phone" | "email" | "clock";
}) {
  const common = "h-5 w-5 fill-none stroke-current stroke-[1.7]";

  switch (type) {
    case "location":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
          <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );
    case "phone":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
          <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3 5.2 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.7l.5 2.7a2 2 0 0 1-.6 1.9L8 10.9a16 16 0 0 0 5.1 5.1l1.6-1.9a2 2 0 0 1 1.9-.6l2.7.5a2 2 0 0 1 1.7 1.9Z" />
        </svg>
      );
    case "email":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );
    case "clock":
      return (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
  }
}

/* ------------------------------------------------------------------ */
/* PAGE                                                                */
/* ------------------------------------------------------------------ */

export default function ContactPageClient() {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress: heroP } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroTextY = useTransform(heroP, [0, 1], ["0%", "-14%"]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: subjects[0],
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    /*
      FRONTEND DEMO ONLY.
      Connect your backend or email API here to receive real enquiries.
    */
    console.log("Flying Wheel enquiry:", form);
    setSubmitted(true);
  };

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

        // 4. contact cards fly in from the left, staggered
        gsap.utils.toArray<HTMLElement>(".benefit").forEach((el, i) => {
          gsap.from(el, {
            x: Number(el.dataset.x),
            y: Number(el.dataset.y),
            opacity: 0,
            duration: 1.2,
            delay: i * 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });
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

  const contactCards = [
    {
      icon: "location" as const,
      title: "VISIT US",
      value: CONTACT.name,
      second: CONTACT.address,
      href: MAP_LINK,
      x: -160,
      y: 0,
    },
    {
      icon: "phone" as const,
      title: "CALL US",
      value: CONTACT.phone,
      href: `tel:${CONTACT.phone.replace(/\s/g, "")}`,
      x: -160,
      y: 0,
    },
    {
      icon: "email" as const,
      title: "EMAIL US",
      value: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
      x: -160,
      y: 0,
    },
    {
      icon: "clock" as const,
      title: "OPENING HOURS",
      value: CONTACT.hours,
      x: -160,
      y: 0,
    },
  ];

  const T = 1;

  return (
    <main
      ref={rootRef}
      className="w-full overflow-x-clip bg-[#FAFAF8] font-[var(--font-inter)] text-[#171717]"
    >
      {/* scroll progress (GSAP) */}
      <div
        data-progress
        className="fixed left-0 top-0 z-50 h-[3px] w-full origin-left scale-x-0 bg-[#F6BD12]"
      />

      {/* ============================ HERO (Framer landing from all 4 sides) ============================ */}
      <section
        ref={heroRef}
        className="relative isolate overflow-hidden pb-14 pt-[125px] sm:pb-20 sm:pt-[145px]"
      >
        {/* wheel from the RIGHT */}
        <motion.div
          className="pointer-events-none absolute -right-[22vw] top-1/2 -z-10 -translate-y-1/2 text-[#E8E6DF] sm:-right-[12vw]"
          initial={{ x: reduce ? 0 : 500, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.6 * T }}
        >
          <Wheel
            className="h-[70vw] max-h-[620px] w-[70vw] max-w-[620px]"
            duration={40}
          />
        </motion.div>

        {/* ghost word from the BOTTOM */}
        <motion.div
          className="pointer-events-none absolute bottom-0 right-[6%] -z-10 hidden select-none text-[20vw] font-extrabold leading-[0.8] tracking-[-0.08em] text-[#171717]/[0.04] lg:block"
          initial={{ y: reduce ? 0 : "100%" }}
          animate={{ y: "8%" }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.5 * T }}
        >
          HELLO
        </motion.div>

        <div className={`${container} relative z-10`}>
          <motion.div style={{ y: reduce ? 0 : heroTextY }}>
            {/* TOP */}
            <motion.p
              initial={{ opacity: 0, y: reduce ? 0 : -60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.3 * T }}
              className="mb-4 text-[10px] font-bold uppercase tracking-[0.28em] text-[#C58C00] sm:text-[11px]"
            >
              CONTACT US
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
                  LET’S TALK
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
                    BICYCLES
                  </span>
                  <span className="text-[#F6BD12]">.</span>
                </motion.span>
              </span>
            </h1>

            {/* golden underline draws out */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease: EASE, delay: 0.9 * T }}
              className="mt-7 h-[3px] w-20 origin-left rounded-full bg-[#F6BD12]"
            />

            <div className="mt-6 flex flex-col justify-between gap-7 md:flex-row md:items-end">
              <motion.p
                initial={{ opacity: 0, x: reduce ? 0 : -80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: EASE, delay: 0.9 * T }}
                className="max-w-[550px] text-sm leading-8 text-[#777] sm:text-base"
              >
                Questions about a bike, a service or a test ride? Send us a
                message or visit the shop. We’ll get back to you as soon as we
                can.
              </motion.p>

              {/* BOTTOM */}
              <motion.div
                initial={{ opacity: 0, y: reduce ? 0 : 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: EASE, delay: 1.1 * T }}
              >
                <a
                  href="#contact-form"
                  className="inline-flex h-[50px] w-fit shrink-0 items-center justify-center gap-5 rounded-full border border-[#D7A600] px-7 text-[10px] font-extrabold tracking-[0.13em] transition-all duration-300 hover:bg-[#F6BD12]"
                >
                  SEND A MESSAGE <span className="text-base">↓</span>
                </a>
              </motion.div>
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

      {/* ============================ CONTACT CARDS + FORM ============================ */}
      <section
        id="contact-form"
        className="scroll-mt-10 py-16 sm:py-20 lg:py-28"
      >
        <div
          className={`${container} grid items-start gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10`}
        >
          {/* LEFT: cards fly in from the left (GSAP) */}
          <div className="grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {contactCards.map((card, index) => (
              <div
                key={card.title}
                data-x={card.x}
                data-y={card.y}
                className="benefit"
              >
                <div className="group relative flex min-h-[100px] items-center gap-4 overflow-hidden border border-[#E8E6DF] bg-white p-5 transition-all duration-500 hover:-translate-y-2 hover:border-[#D7A600] sm:p-6">
                  <Wheel
                    duration={12}
                    className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 text-[#E8E6DF] transition-colors duration-500 group-hover:text-[#F6BD12]"
                  />

                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#171717] text-white transition-all duration-500 group-hover:rotate-[-12deg] group-hover:bg-[#F6BD12] group-hover:text-[#171717]">
                    <ContactIcon type={card.icon} />
                  </div>

                  <div className="relative min-w-0">
                    <p className="mb-1 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#C58C00]">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {card.title}
                    </p>

                    {card.href ? (
                      <a
                        href={card.href}
                        target={
                          card.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel="noopener noreferrer"
                        className="block break-words text-[14px] font-semibold leading-relaxed text-[#171717] transition-colors hover:text-[#C58C00] sm:text-[15px]"
                      >
                        {card.value}
                      </a>
                    ) : (
                      <p className="text-[14px] font-semibold leading-relaxed text-[#171717] sm:text-[15px]">
                        {card.value}
                      </p>
                    )}

                    {card.second && (
                      <p className="mt-1 text-[13px] text-[#777]">
                        {card.second}
                      </p>
                    )}

                    <div className="mt-3 h-[2px] w-9 bg-[#F6BD12] transition-all duration-500 group-hover:w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: form enters from the right */}
          <Enter from="right" distance={120} className="w-full">
            <div className="relative w-full overflow-hidden rounded-[26px] border border-[#E8E6DF] bg-white p-5 shadow-[0_15px_50px_rgba(0,0,0,0.045)] sm:p-8 lg:p-10">
              <AnimatePresence mode="wait" initial={false}>
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: reduce ? 0 : 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reduce ? 0 : -40 }}
                    transition={{ duration: 0.7, ease: EASE }}
                    className="flex min-h-[430px] flex-col items-center justify-center text-center"
                  >
                    <motion.div
                      initial={{ scale: reduce ? 1 : 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 220,
                        damping: 16,
                        delay: 0.2,
                      }}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F6BD12] text-3xl font-bold"
                    >
                      ✓
                    </motion.div>

                    <h2 className="mt-6 text-4xl font-extrabold uppercase leading-none tracking-[-0.06em] sm:text-5xl">
                      THANK YOU<span className="text-[#F6BD12]">.</span>
                    </h2>

                    <p className="mt-3 max-w-sm text-sm leading-7 text-[#777]">
                      Your enquiry has been recorded in this frontend demo.
                      Connect an email service to receive actual customer
                      messages.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setForm({
                          name: "",
                          email: "",
                          phone: "",
                          subject: subjects[0],
                          message: "",
                        });
                        setSubmitted(false);
                      }}
                      className="mt-8 inline-flex h-[52px] items-center rounded-full bg-[#171717] px-8 text-[10px] font-extrabold tracking-[0.15em] text-white transition-colors duration-300 hover:bg-[#F6BD12] hover:text-black"
                    >
                      SEND ANOTHER MESSAGE
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: reduce ? 0 : 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reduce ? 0 : -40 }}
                    transition={{ duration: 0.6, ease: EASE }}
                  >
                    <SectionLabel>GET IN TOUCH</SectionLabel>

                    <h2 className="text-[clamp(34px,4.5vw,56px)] font-extrabold uppercase leading-[0.95] tracking-[-0.07em]">
                      SEND US A MESSAGE
                      <span className="text-[#F6BD12]">.</span>
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-[#777]">
                      Fill in the form and we’ll reply by email or phone.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Enter from="left" distance={60}>
                          <label htmlFor="contact-name" className={labelClass}>
                            FULL NAME
                          </label>
                          <input
                            id="contact-name"
                            name="name"
                            type="text"
                            required
                            autoComplete="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            className={inputClass}
                          />
                        </Enter>

                        <Enter from="right" distance={60}>
                          <label
                            htmlFor="contact-email"
                            className={labelClass}
                          >
                            EMAIL ADDRESS
                          </label>
                          <input
                            id="contact-email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className={inputClass}
                          />
                        </Enter>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <Enter from="left" distance={60} delay={0.08}>
                          <label
                            htmlFor="contact-phone"
                            className={labelClass}
                          >
                            PHONE NUMBER
                          </label>
                          <input
                            id="contact-phone"
                            name="phone"
                            type="tel"
                            autoComplete="tel"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="Your phone number"
                            className={inputClass}
                          />
                        </Enter>

                        <Enter from="right" distance={60} delay={0.08}>
                          <label
                            htmlFor="contact-subject"
                            className={labelClass}
                          >
                            SUBJECT
                          </label>
                          <select
                            id="contact-subject"
                            name="subject"
                            value={form.subject}
                            onChange={handleChange}
                            className={`${inputClass} cursor-pointer`}
                          >
                            {subjects.map((subject) => (
                              <option key={subject} value={subject}>
                                {subject}
                              </option>
                            ))}
                          </select>
                        </Enter>
                      </div>

                      <Enter from="bottom" distance={60} delay={0.12}>
                        <label
                          htmlFor="contact-message"
                          className={labelClass}
                        >
                          YOUR MESSAGE
                        </label>
                        <textarea
                          id="contact-message"
                          name="message"
                          required
                          rows={6}
                          value={form.message}
                          onChange={handleChange}
                          placeholder="Tell us how we can help..."
                          className={`${inputClass} !h-auto min-h-[155px] resize-y !py-4`}
                        />
                      </Enter>

                      <Enter from="bottom" distance={80} delay={0.18}>
                        <button
                          type="submit"
                          className="group inline-flex h-[52px] w-full items-center justify-center gap-5 rounded-full bg-[#F6BD12] px-9 text-[10px] font-extrabold tracking-[0.15em] text-black transition-colors duration-300 hover:bg-[#171717] hover:text-white sm:w-auto"
                        >
                          SEND MESSAGE
                          <span className="text-base transition-transform duration-500 group-hover:translate-x-1">
                            ↗
                          </span>
                        </button>
                      </Enter>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Enter>
        </div>
      </section>

      {/* ============================ MAP ============================ */}
      <section className="bg-white py-16 sm:py-20 lg:py-28">
        <div className={container}>
          <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <Enter from="left">
                <SectionLabel>FIND OUR STORE</SectionLabel>
              </Enter>
              <h2
                data-chars
                className="text-[clamp(44px,7vw,100px)] font-extrabold uppercase leading-[0.92] tracking-[-0.075em]"
              >
                <Chars text="COME SAY" />
                <br />
                <Chars text="HELLO." />
              </h2>
            </div>
            <Enter from="right">
              <p className="max-w-[370px] text-sm leading-7 text-[#777]">
                Drop by the shop, see the bikes in person and talk to the team
                about your next ride.
              </p>
            </Enter>
          </div>

          {/* map opens from the centre to all four edges */}
          <motion.div
            initial={{
              clipPath: reduce
                ? "inset(0% 0% 0% 0%)"
                : "inset(35% 35% 35% 35%)",
            }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 1.4, ease: EASE }}
            className="relative h-[350px] overflow-hidden rounded-[25px] border border-[#E8E6DF] bg-[#FAFAF8] sm:h-[450px] lg:h-[520px]"
          >
            <iframe
              title="Flying Wheel store location"
              src={MAP_EMBED}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />

            {/* store card slides in from the left */}
            <Enter
              from="left"
              distance={80}
              delay={0.6}
              className="absolute bottom-4 left-4 right-4 max-w-[350px] sm:bottom-7 sm:left-7"
            >
              <div className="rounded-2xl bg-white p-5 shadow-xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C58C00]">
                  OUR STORE
                </p>
                <h3 className="mt-2 text-base font-bold text-[#171717]">
                  {CONTACT.name}
                </h3>
                <p className="mt-1 text-sm text-[#777]">{CONTACT.address}</p>
                <a
                  href={MAP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex h-[44px] items-center gap-4 rounded-full bg-[#F6BD12] px-6 text-[10px] font-extrabold tracking-[0.14em] text-black transition-colors duration-300 hover:bg-[#171717] hover:text-white"
                >
                  GET DIRECTIONS <span className="text-base">↗</span>
                </a>
              </div>
            </Enter>
          </motion.div>
        </div>
      </section>
    </main>
  );
}