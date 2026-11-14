
"use client";

import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

/* --------------------------------
   FLYING WHEEL CONTACT INFORMATION
--------------------------------- */

const CONTACT = {
  name: "Flying Wheels – The Cyclist Den",
  address: "Chennai, Tamil Nadu",
  phone: "+00 00000 00000",
  email: "hello@yourdomain.com",
  hours: "Mon – Sat: 10:00 AM – 7:00 PM",
};

const MAP_QUERY = encodeURIComponent(
  `${CONTACT.name}, ${CONTACT.address}`
);

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

/* --------------------------------
   TAILWIND STYLES
--------------------------------- */

const container =
  "mx-auto w-full max-w-[1450px] px-5 sm:px-8 lg:px-12";

const inputClass =
  "!h-[54px] !w-full !rounded-xl !border !border-[#171717]/15 !bg-white !px-4 !text-sm !text-[#171717] !shadow-none !outline-none placeholder:!text-[#888] transition-all duration-300 focus:!border-[#F6BD12] focus:!ring-2 focus:!ring-[#F6BD12]/20";

const labelClass =
  "mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#171717]/65";

/* --------------------------------
   CONTACT ICONS
--------------------------------- */

function ContactIcon({
  type,
}: {
  type: "location" | "phone" | "email" | "clock";
}) {
  const common =
    "h-5 w-5 fill-none stroke-current stroke-[1.7]";

  switch (type) {
    case "location":
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );

    case "phone":
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3 5.2 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.7l.5 2.7a2 2 0 0 1-.6 1.9L8 10.9a16 16 0 0 0 5.1 5.1l1.6-1.9a2 2 0 0 1 1.9-.6l2.7.5a2 2 0 0 1 1.7 1.9Z" />
        </svg>
      );

    case "email":
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );

    case "clock":
      return (
        <svg viewBox="0 0 24 24" className={common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
  }
}

/* --------------------------------
   DECORATIVE ROTATING BICYCLE WHEEL
--------------------------------- */

function Wheel({
  reducedMotion,
}: {
  reducedMotion: boolean | null;
}) {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      className="pointer-events-none absolute right-[-120px] top-[-20px] h-[290px] w-[290px] text-[#171717]/10 sm:right-[-70px] sm:h-[380px] sm:w-[380px] lg:right-[3%] lg:top-[-40px] lg:h-[470px] lg:w-[470px]"
      animate={reducedMotion ? undefined : { rotate: 360 }}
      transition={
        reducedMotion
          ? undefined
          : {
              duration: 55,
              repeat: Infinity,
              ease: "linear",
            }
      }
    >
      <circle cx="100" cy="100" r="96" strokeWidth="5" />
      <circle cx="100" cy="100" r="87" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="13" strokeWidth="3" />

      {Array.from({ length: 18 }).map((_, index) => {
        const angle = (index * 20 * Math.PI) / 180;

        return (
          <line
            key={index}
            x1={100 + Math.cos(angle) * 13}
            y1={100 + Math.sin(angle) * 13}
            x2={100 + Math.cos(angle) * 87}
            y2={100 + Math.sin(angle) * 87}
            strokeWidth="1"
          />
        );
      })}
    </motion.svg>
  );
}

/* --------------------------------
   CONTACT PAGE
--------------------------------- */

export default function ContactPageClient() {
  const reducedMotion = useReducedMotion();

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
    >
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    /*
      FRONTEND DEMO ONLY.

      Connect your backend or email API here
      to receive real enquiries.
    */

    console.log("Flying Wheel enquiry:", form);

    setSubmitted(true);
  };

  const contactCards = [
    {
      icon: "location" as const,
      title: "VISIT US",
      value: CONTACT.name,
      second: CONTACT.address,
      href: MAP_LINK,
    },
    {
      icon: "phone" as const,
      title: "CALL US",
      value: CONTACT.phone,
      href: `tel:${CONTACT.phone.replace(/\s/g, "")}`,
    },
    {
      icon: "email" as const,
      title: "EMAIL US",
      value: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
    },
    {
      icon: "clock" as const,
      title: "OPENING HOURS",
      value: CONTACT.hours,
    },
  ];

  return (
    <main className="w-full overflow-x-clip bg-[#F7F6F1] text-[#171717]">

      {/* =================================
          HERO SECTION
      ================================== */}

      <section className="relative isolate overflow-hidden bg-[#F7F6F1] pb-12 pt-[125px] sm:pb-16 sm:pt-[145px] lg:pb-16 lg:pt-[155px]">

        <Wheel reducedMotion={reducedMotion} />

        <div className={`${container} relative z-10`}>

          {/* EYEBROW */}

          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em] text-[#171717]/60 sm:text-sm"
          >
            CONTACT US
          </motion.p>

          {/* HEADING */}

          <h1 className="max-w-[950px] font-[var(--font-bebas)] text-[clamp(72px,10vw,145px)] uppercase leading-[0.82] tracking-tight">

            {["LET’S TALK", "BICYCLES."].map((line, index) => (
              <span
                key={line}
                className="block overflow-hidden pb-[0.07em]"
              >
                <motion.span
                  className="block"
                  initial={
                    reducedMotion ? false : { y: "110%" }
                  }
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.9,
                    delay: index * 0.15,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {line}
                </motion.span>
              </span>
            ))}

          </h1>

          {/* GOLDEN UNDERLINE */}

          <motion.div
            initial={reducedMotion ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-6 h-1 w-20 origin-left rounded-full bg-[#F6BD12]"
          />

          {/* DESCRIPTION */}

          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-5 max-w-[550px] text-sm leading-[1.9] text-[#171717]/70 sm:text-base"
          >
            Questions about a bike, a service or a test ride?
            Send us a message or visit the shop. We’ll get back
            to you as soon as we can.
          </motion.p>

        </div>
      </section>

      {/* =================================
          CONTACT INFORMATION + FORM
      ================================== */}

      <section className="relative z-10 bg-[#F7F6F1] pb-16 pt-4 sm:pt-6 lg:pb-24">

        <div className={`${container} grid items-start gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10`}>

          {/* LEFT CONTACT CARDS */}

          <div className="grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-1">

            {contactCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={
                  reducedMotion
                    ? false
                    : { opacity: 0, y: 30 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                className="group flex min-h-[100px] items-center gap-4 rounded-2xl border border-black/10 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] sm:p-6"
              >

                {/* ICON */}

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#171717] text-white transition-all duration-300 group-hover:bg-[#F6BD12] group-hover:text-[#171717]">
                  <ContactIcon type={card.icon} />
                </div>

                {/* DETAILS */}

                <div className="min-w-0">

                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#171717]/55">
                    {card.title}
                  </p>

                  {card.href ? (
                    <a
                      href={card.href}
                      target={
                        card.href.startsWith("http")
                          ? "_blank"
                          : undefined
                      }
                      rel="noopener noreferrer"
                      className="block break-words text-[14px] font-semibold leading-relaxed text-[#171717] transition-colors hover:text-[#B78A00] sm:text-[15px]"
                    >
                      {card.value}
                    </a>
                  ) : (
                    <p className="text-[14px] font-semibold leading-relaxed text-[#171717] sm:text-[15px]">
                      {card.value}
                    </p>
                  )}

                  {card.second && (
                    <p className="mt-1 text-[13px] text-[#64748B]">
                      {card.second}
                    </p>
                  )}

                </div>

              </motion.div>
            ))}

          </div>

          {/* RIGHT CONTACT FORM */}

          <motion.div
            initial={
              reducedMotion ? false : { opacity: 0, y: 35 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7 }}
            className="w-full rounded-[26px] border border-black/10 bg-white p-5 shadow-[0_15px_50px_rgba(0,0,0,0.045)] sm:p-8 lg:p-10"
          >

            {submitted ? (

              /* SUCCESS MESSAGE */

              <div className="flex min-h-[430px] flex-col items-center justify-center text-center">

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F6BD12] text-3xl font-bold">
                  ✓
                </div>

                <h2 className="mt-6 font-[var(--font-bebas)] text-5xl uppercase">
                  Thank You!
                </h2>

                <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#64748B]">
                  Your enquiry has been recorded in this
                  frontend demo. Connect an email service
                  to receive actual customer messages.
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
                  className="mt-8 rounded-full bg-[#171717] px-8 py-4 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-[#F6BD12] hover:text-black"
                >
                  SEND ANOTHER MESSAGE
                </button>

              </div>

            ) : (

              /* FORM */

              <>

                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#B78A00]">
                  GET IN TOUCH
                </p>

                <h2 className="font-[var(--font-bebas)] text-[42px] uppercase leading-none sm:text-5xl">
                  SEND US A MESSAGE
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-[#64748B]">
                  Fill in the form and we’ll reply by email or phone.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="mt-8 space-y-6"
                >

                  {/* NAME + EMAIL */}

                  <div className="grid gap-5 sm:grid-cols-2">

                    <div>
                      <label
                        htmlFor="contact-name"
                        className={labelClass}
                      >
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
                    </div>

                    <div>
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
                    </div>

                  </div>

                  {/* PHONE + SUBJECT */}

                  <div className="grid gap-5 sm:grid-cols-2">

                    <div>
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
                    </div>

                    <div>
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
                    </div>

                  </div>

                  {/* MESSAGE */}

                  <div>
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
                  </div>

                  {/* SUBMIT */}

                  <button
                    type="submit"
                    className="group flex h-[56px] w-full items-center justify-center gap-3 rounded-full bg-[#171717] px-8 text-xs font-extrabold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-[#F6BD12] hover:text-[#171717] sm:w-auto"
                  >
                    SEND MESSAGE

                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </button>

                </form>

              </>
            )}

          </motion.div>

        </div>
      </section>

      {/* =================================
          GOOGLE MAP SECTION
      ================================== */}

      <section className="bg-[#F7F6F1] pb-20 lg:pb-28">

        <div className={container}>

          {/* MAP HEADING */}

          <motion.div
            initial={
              reducedMotion ? false : { opacity: 0, y: 25 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-8"
          >

            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-[#171717]/55">
              FIND OUR STORE
            </p>

            <h2 className="font-[var(--font-bebas)] text-[clamp(48px,7vw,90px)] uppercase leading-[0.9]">
              COME SAY HELLO.
            </h2>

            <div className="mt-5 h-1 w-16 rounded-full bg-[#F6BD12]" />

          </motion.div>

          {/* MAP */}

          <motion.div
            initial={
              reducedMotion ? false : { opacity: 0, y: 30 }
            }
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative h-[350px] overflow-hidden rounded-[25px] border border-black/10 bg-white sm:h-[450px] lg:h-[520px]"
          >

            <iframe
              title="Flying Wheel store location"
              src={MAP_EMBED}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />

            {/* STORE INFORMATION OVERLAY */}

            <div className="absolute bottom-4 left-4 right-4 max-w-[350px] rounded-2xl bg-white p-5 shadow-xl sm:bottom-7 sm:left-7">

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B78A00]">
                OUR STORE
              </p>

              <h3 className="mt-2 text-base font-bold text-[#171717]">
                {CONTACT.name}
              </h3>

              <p className="mt-1 text-sm text-[#64748B]">
                {CONTACT.address}
              </p>

              <a
                href={MAP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-3 rounded-full bg-[#171717] px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#F6BD12] hover:text-black"
              >
                GET DIRECTIONS ↗
              </a>

            </div>

          </motion.div>

        </div>
      </section>

    </main>
  );
}
