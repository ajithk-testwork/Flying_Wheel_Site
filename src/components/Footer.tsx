
import Image from "next/image";
import Link from "next/link";

const footerGroups = [
  {
    title: "EXPLORE",
    links: [
      { name: "Home", href: "/" },
      { name: "All Bicycles", href: "/shop" },
      { name: "Collections", href: "/collections" },
    ],
  },
  {
    title: "COMPANY",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "CUSTOMER SUPPORT",
    links: [
      { name: "Search Products", href: "/search" },
      { name: "Shopping Cart", href: "/cart" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Use", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full overflow-hidden border-t border-[#171717]/10 bg-[#F7F6F1] text-[#171717]">

      {/* MAIN FOOTER */}
      <div className="mx-auto w-full max-w-[1600px] px-5 pb-12 pt-14 sm:px-8 md:px-12 lg:px-[6.5%] lg:pb-16 lg:pt-16">

        {/* TOP BRAND DIVIDER */}
        <div className="mb-12 h-px w-full bg-[#171717]/15 md:mb-16" />

        {/* FOOTER GRID */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-3 lg:grid-cols-[1.5fr_0.8fr_0.8fr_1fr] lg:gap-12">

          {/* BRAND INFORMATION */}
          <div className="col-span-2 min-w-0 md:col-span-1">

            {/* LOGO */}
            <Link
              href="/"
              aria-label="Flying Wheel Home"
              className="inline-flex items-center"
            >
              <span className="relative block h-[68px] w-[105px] overflow-hidden rounded-xl bg-black">
                <Image
                  src="/logo/logo.png"
                  alt="Flying Wheel Logo"
                  fill
                  priority
                  sizes="105px"
                  className="object-contain"
                />
              </span>
            </Link>

            <h3 className="mt-6 font-[var(--font-oswald)] text-xl font-semibold uppercase tracking-[1px]">
              FLYING WHEEL
            </h3>

            <p className="mt-3 max-w-[330px] text-[13px] leading-[1.9] text-[#171717]/65">
              More than just bicycles, we create experiences.
              Discover premium bicycles designed for performance,
              comfort and adventure. Find the perfect ride and
              experience the freedom of cycling.
            </p>

            <p className="mt-5 font-[var(--font-oswald)] text-xs font-bold uppercase tracking-[3px] text-[#B78A00]">
              RIDE BEYOND LIMITS.
            </p>

            {/* BRAND ACCENT */}
            <span className="mt-4 block h-[3px] w-12 rounded-full bg-[#F6BD12]" />

          </div>

          {/* FOOTER NAVIGATION */}
          {footerGroups.map((group) => (
            <div key={group.title} className="min-w-0">

              <h3 className="font-[var(--font-oswald)] text-[14px] font-bold uppercase tracking-[2px] text-[#171717]">
                {group.title}
              </h3>

              <span className="mb-6 mt-3 block h-[3px] w-9 rounded-full bg-[#F6BD12]" />

              <ul className="flex flex-col gap-[17px]">

                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.5px] text-[#171717]/60 transition-all duration-300 hover:translate-x-1 hover:text-[#B78A00]"
                    >
                      <span className="h-[5px] w-[5px] rounded-full bg-[#F6BD12] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      {link.name}
                    </Link>
                  </li>
                ))}

              </ul>

            </div>
          ))}

        </div>
      </div>

      {/* BOTTOM COPYRIGHT BAR */}
      <div className="border-t border-[#171717]/10 bg-white">

        <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center justify-between gap-5 px-5 py-5 sm:px-8 md:px-12 lg:flex-row lg:px-[6.5%]">

          {/* COPYRIGHT */}
          <p className="text-center text-[10px] font-medium uppercase tracking-[1px] text-[#777] lg:text-left">
            © 2026 FLYING WHEEL. ALL RIGHTS RESERVED.
          </p>

          {/* LEGAL LINKS */}
          <div className="flex flex-wrap items-center justify-center gap-5">

            <Link
              href="/privacy"
              className="text-[10px] font-semibold uppercase tracking-[0.8px] text-[#777] transition-colors hover:text-[#B78A00]"
            >
              Privacy Policy
            </Link>

            <span className="h-3 w-px bg-black/20" />

            <Link
              href="/terms"
              className="text-[10px] font-semibold uppercase tracking-[0.8px] text-[#777] transition-colors hover:text-[#B78A00]"
            >
              Terms of Use
            </Link>

          </div>

          {/* DEVELOPED BY ZOIDICS */}
          <div className="flex items-center justify-center gap-3">

            <span className="whitespace-nowrap text-[12px] font-medium text-[#777]">
              Developed by
            </span>

            <a
              href="https://zoidics.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Zoidics Software Solutions"
              className="group flex items-center gap-2 transition-transform duration-300 hover:-translate-y-0.5"
            >

              <Image
                src="/logo/zoidics.png"
                alt="Zoidics Software Solutions"
                width={42}
                height={42}
                className="h-[40px] w-[40px] object-contain"
              />

              <span className="flex flex-col gap-[4px] leading-none">

                <strong className="text-[16px] font-extrabold tracking-[1px] text-[#171717] transition-colors group-hover:text-[#B78A00]">
                  ZOIDICS
                </strong>

                <span className="whitespace-nowrap text-[8px] font-semibold tracking-[1.5px] text-[#777]">
                  SOFTWARE SOLUTIONS
                </span>

              </span>

            </a>

          </div>

        </div>
      </div>

    </footer>
  );
}
