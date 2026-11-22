"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";



const navLinks = [
  { name: "HOME", href: "/" },
   { name: "ABOUT US", href: "/about" },
  { name: "BICYCLES", href: "/shop" },
  { name: "BLOG", href: "/blog" },
  { name: "GALLERY", href: "/gallery" },
  { name: "CONTACT", href: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="absolute left-1/2 top-4 z-[100] w-[calc(100%-32px)] max-w-[1250px] -translate-x-1/2 sm:top-5 sm:w-[calc(100%-64px)]">
      {/* FLOATING GLASS NAVBAR */}
      <nav
        style={{
          paddingLeft: "clamp(12px, 1.6vw, 20px)",
          paddingRight: "clamp(12px, 1.6vw, 24px)",
        }}
        className="relative flex h-[76px] w-full items-center justify-between rounded-2xl border border-white/90 bg-white/80 shadow-[0_10px_35px_rgba(0,0,0,0.09),inset_0_1px_1px_rgba(255,255,255,1),inset_0_-1px_0_rgba(246,189,18,0.22)] backdrop-blur-2xl"
      >
        {/* GOLDEN GLASS REFLECTION */}
        <div className="pointer-events-none absolute left-[8%] right-[8%] top-0 h-[1px] bg-gradient-to-r from-transparent via-[#F6BD12]/70 to-transparent" />

        {/* LOGO: rounded tile so the logo's black background looks intentional */}
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="relative z-10 flex shrink-0 items-center"
        >
          <span className="relative block h-[56px] w-[88px] overflow-hidden rounded-xl bg-black sm:h-[58px] sm:w-[92px]">
            <Image
              src="/logo/logo.png"
              alt="Flying Wheel"
              fill
              priority
              sizes="92px"
              className="object-contain"
            />
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden items-center gap-6 lg:flex xl:gap-9">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              style={{ paddingTop: "12px", paddingBottom: "12px" }}
              className="group relative whitespace-nowrap text-[11px] font-extrabold tracking-[1.3px] text-[#171717] hover:text-[#B78A00]"
            >
              {link.name}

              {/* underline appears instantly on hover (no animation) */}
              <span className="absolute bottom-0 left-0 hidden h-[2px] w-full rounded-full bg-[#F6BD12] group-hover:block" />
            </Link>
          ))}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* SEARCH */}
          <Link
            href="/search"
            aria-label="Search"
            className="hidden text-[#171717] hover:text-[#B78A00] sm:block"
          >
            <svg
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>
          </Link>

          {/* CART */}
          <Link
            href="/cart"
            aria-label="Shopping cart"
            className="text-[#171717] hover:text-[#B78A00]"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 7H6" />
              <circle cx="10" cy="21" r="1" />
              <circle cx="18" cy="21" r="1" />
            </svg>
          </Link>

          {/* SHOP BUTTON: same flat style as the hero button */}
          <Link
            href="/shop"
            style={{ padding: "0 26px", whiteSpace: "nowrap" }}
            className="hidden h-[44px] items-center justify-center gap-2 rounded-full bg-[#F6BD12] text-[11px] font-extrabold tracking-wider text-[#171717] hover:bg-[#171717] hover:text-[#F6BD12] md:flex"
          >
            SHOP NOW
            <span className="text-sm">↗</span>
          </Link>

          {/* MOBILE MENU */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[6px] rounded-full border border-[#F6BD12] bg-white lg:hidden"
          >
            <span
              className={`h-[2px] w-5 bg-[#171717] transition-all duration-300 ${
                menuOpen ? "translate-y-[4px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-[2px] w-5 bg-[#171717] transition-all duration-300 ${
                menuOpen ? "-translate-y-[4px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* MOBILE DROPDOWN */}
      <div
        className={`mx-auto overflow-hidden rounded-2xl border border-white/90 bg-white/95 shadow-[0_12px_35px_rgba(0,0,0,0.12)] backdrop-blur-2xl transition-all duration-300 lg:hidden ${
          menuOpen
            ? "max-h-[450px] opacity-100"
            : "pointer-events-none max-h-0 border-transparent opacity-0"
        }`}
        style={{ marginTop: "12px" }}
      >
        <div style={{ padding: "20px" }}>
          {navLinks.map((link, index) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{ paddingTop: "16px", paddingBottom: "16px" }}
              className="flex items-center justify-between border-b border-black/5 text-xs font-bold tracking-widest text-[#171717] hover:text-[#B78A00]"
            >
              {link.name}
              <span className="text-[#C49300]">0{index + 1} ↗</span>
            </Link>
          ))}

          <Link
            href="/shop"
            onClick={() => setMenuOpen(false)}
            style={{ marginTop: "20px" }}
            className="flex h-12 items-center justify-center rounded-full bg-[#F6BD12] text-xs font-extrabold tracking-widest text-[#171717] hover:bg-[#171717] hover:text-[#F6BD12]"
          >
            SHOP NOW ↗
          </Link>
        </div>
      </div>
    </header>
  );
}