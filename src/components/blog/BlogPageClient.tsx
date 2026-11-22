"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Search, MoveUpRight } from "lucide-react";

const image = (id: string, width = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=88`;

type Post = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  imageAlt: string;
};

const posts: Post[] = [
  {
    slug: "how-to-choose-your-first-mountain-bike",
    category: "BUYING GUIDE",
    title: "Find the mountain bike that feels made for you",
    excerpt:
      "A practical guide to frame size, suspension and gearing before you take your first trail ride.",
    date: "12 NOV 2026",
    readTime: "6 MIN READ",
    image: image("photo-1544191696-15693072e0b8"),
    imageAlt: "Mountain bike on a scenic outdoor trail",
  },
  {
    slug: "road-bike-vs-hybrid-which-is-right-for-you",
    category: "BUYING GUIDE",
    title: "Road bike or hybrid? Start with the way you ride",
    excerpt:
      "Two very different riding experiences, one simple way to decide what belongs in your garage.",
    date: "05 NOV 2026",
    readTime: "5 MIN READ",
    image: image("photo-1485965120184-e220f721d03e"),
    imageAlt: "Road bicycle photographed outdoors",
  },
  {
    slug: "5-minute-bike-check-before-every-ride",
    category: "MAINTENANCE",
    title: "Five minutes that make every ride better",
    excerpt:
      "The quick tyre, brake and chain check every cyclist should make part of their routine.",
    date: "29 OCT 2026",
    readTime: "4 MIN READ",
    image: image("photo-1507035895480-2b3156c31fc8"),
    imageAlt: "Bicycle detail ready for a pre-ride check",
  },
  {
    slug: "city-cycling-tips-for-busy-streets",
    category: "RIDES & ROUTES",
    title: "A calmer way to ride through the city",
    excerpt:
      "Build confidence on busy streets with visibility, awareness and a few smart habits.",
    date: "21 OCT 2026",
    readTime: "5 MIN READ",
    image: image("photo-1571068316344-75bc76f77890"),
    imageAlt: "City bicycle and urban cycling scene",
  },
  {
    slug: "are-electric-bikes-worth-it",
    category: "GEAR",
    title: "Electric bikes, without the guesswork",
    excerpt:
      "Understand range, battery care and everyday practicality before choosing an e-bike.",
    date: "14 OCT 2026",
    readTime: "7 MIN READ",
    image: image("photo-1558618666-fcd25c85cd64"),
    imageAlt: "Electric bicycle outdoors",
  },
  {
    slug: "teaching-your-child-to-ride-a-bicycle",
    category: "LIFESTYLE",
    title: "The little moments behind a first ride",
    excerpt:
      "A patient, encouraging approach to helping young riders find their balance.",
    date: "07 OCT 2026",
    readTime: "6 MIN READ",
    image: image("photo-1517649763962-0c623066013b"),
    imageAlt: "Family cycling and outdoor activity",
  },
];

const categories = [
  "ALL STORIES",
  ...Array.from(new Set(posts.map((post) => post.category))),
];
const ease = [0.22, 1, 0.36, 1] as const;

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function ArticleCard({ post, index }: { post: Post; index: number }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.45, ease }}
      className={index === 0 ? "md:col-span-2" : ""}
    >
      <Link href={`/blog/${post.slug}`} className="group block">
        <div
          className={`relative overflow-hidden bg-[#e9e7df] ${index === 0 ? "aspect-[16/8]" : "aspect-[5/4]"}`}
        >
          <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            unoptimized
            sizes={
              index === 0
                ? "(max-width: 768px) 100vw, 66vw"
                : "(max-width: 768px) 100vw, 33vw"
            }
            className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.045]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
          <span className="absolute bottom-5 left-5 text-[10px] font-semibold tracking-[0.2em] text-white">
            {post.category}
          </span>
          <span className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#171717] transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:bg-[#F6BD12]">
            <ArrowUpRight size={18} strokeWidth={1.7} />
          </span>
        </div>
        <div className="flex items-center gap-3 pt-5 text-[9px] font-semibold tracking-[0.18em] text-[#88877f]">
          <span>{post.date}</span>
          <span className="h-px w-5 bg-[#c7c4ba]" />
          <span>{post.readTime}</span>
        </div>
        <h3
          className={`mt-3 max-w-[760px] font-[var(--font-bebas)] uppercase leading-[0.98] tracking-[-0.015em] text-[#20211e] transition-colors duration-300 group-hover:text-[#9b7600] ${index === 0 ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl"}`}
        >
          {post.title}
        </h3>
        <p className="mt-3 max-w-[560px] text-sm leading-7 text-[#77766f]">
          {post.excerpt}
        </p>
      </Link>
    </motion.article>
  );
}

export default function BlogPageClient() {
  const [activeCategory, setActiveCategory] = useState("ALL STORIES");
  const [search, setSearch] = useState("");
  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return posts.filter((post) => {
      const categoryMatch =
        activeCategory === "ALL STORIES" || post.category === activeCategory;
      const searchMatch =
        !query ||
        `${post.title} ${post.excerpt} ${post.category}`
          .toLowerCase()
          .includes(query);
      return categoryMatch && searchMatch;
    });
  }, [activeCategory, search]);

  return (
    <main className="overflow-hidden bg-[#f5f4ef] text-[#20211e]">
      {/* Editorial hero */}
      <section className="relative min-h-[720px] overflow-hidden bg-[#171a17] text-white sm:min-h-[780px]">
        <Image
          src={image("photo-1541625602330-2277e4c46182", 2200)}
          alt="Cyclist riding along an open mountain road"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15" />
        <div className="relative mx-auto flex min-h-[720px] max-w-[1600px] flex-col justify-between px-5 pb-10 pt-36 sm:min-h-[780px] sm:px-10 sm:pb-14 lg:px-[7%]">
          <div className="flex items-center justify-between text-[9px] font-semibold uppercase tracking-[0.25em] text-white/75">
            <span>FLYING WHEEL — JOURNAL</span>
            <span className="hidden sm:block">
              FIELD NOTES FOR THE CURIOUS RIDER · VOL. 01
            </span>
          </div>
          <div className="max-w-[1050px] pb-8">
            <Reveal>
              <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#F6BD12]">
                THE ART OF THE RIDE
              </p>
              <h1 className="font-[var(--font-bebas)] text-[clamp(76px,13vw,190px)] uppercase leading-[0.78] tracking-[-0.025em]">
                Take the
                <br />
                <span className="text-[#F6BD12]">long way.</span>
              </h1>
              <div className="mt-9 flex flex-col gap-7 border-t border-white/35 pt-6 sm:flex-row sm:items-end sm:justify-between">
                <p className="max-w-[440px] text-sm leading-7 text-white/80 sm:text-base">
                  Stories, ideas and useful know-how for every kind of cyclist.
                  Find your next reason to get out and ride.
                </p>
                <Link
                  href="#latest-stories"
                  className="group inline-flex w-fit items-center gap-4 border-b border-[#F6BD12] pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white"
                >
                  EXPLORE THE JOURNAL{" "}
                  <MoveUpRight
                    size={16}
                    className="text-[#F6BD12] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 hidden h-24 w-24 bg-[#F6BD12] sm:block" />
      </section>

      {/* Intro strip */}
      <section className="px-5 py-16 sm:px-10 lg:px-[7%] lg:py-24">
        <div className="mx-auto grid max-w-[1400px] gap-8 border-b border-[#d9d7ce] pb-14 md:grid-cols-[0.7fr_1.3fr] md:items-end">
          <Reveal>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#9b7600]">
              A LITTLE INSPIRATION
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="max-w-[900px] font-[var(--font-bebas)] text-5xl uppercase leading-[0.95] sm:text-7xl lg:text-[92px]">
              Good rides start with{" "}
              <span className="text-[#a27b00]">good ideas.</span>
            </h2>
          </Reveal>
        </div>
      </section>

      {/* Featured story */}
      <section className="px-5 pb-20 sm:px-10 lg:px-[7%] lg:pb-28">
        <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14">
          <Reveal className="group relative min-h-[360px] overflow-hidden sm:min-h-[560px]">
            <Link
              href={`/blog/${posts[0].slug}`}
              aria-label={`Read ${posts[0].title}`}
              className="absolute inset-0"
            >
              <Image
                src={posts[0].image}
                alt={posts[0].imageAlt}
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-[1400ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <span className="absolute bottom-7 left-7 text-[10px] font-bold uppercase tracking-[0.22em] text-white">
                EDITOR'S PICK · {posts[0].readTime}
              </span>
              <span className="absolute right-7 top-7 flex h-12 w-12 items-center justify-center rounded-full bg-[#F6BD12] text-black">
                <ArrowUpRight />
              </span>
            </Link>
          </Reveal>
          <Reveal
            delay={0.12}
            className="flex flex-col justify-center py-2 lg:py-10"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#9b7600]">
              01 / THE STARTING POINT
            </p>
            <h2 className="mt-6 font-[var(--font-bebas)] text-5xl uppercase leading-[0.92] sm:text-6xl lg:text-[76px]">
              Your first trail bike. Chosen right.
            </h2>
            <p className="mt-6 max-w-[470px] text-sm leading-8 text-[#77766f]">
              Not sure where to begin? Get familiar with frame sizes, suspension
              and gearing before choosing a bike that matches your riding style.
            </p>
            <div className="mt-9 flex items-center gap-5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#88877f]">
              <span>{posts[0].date}</span>
              <span className="h-px w-8 bg-[#c7c4ba]" />
              <span>{posts[0].readTime}</span>
            </div>
            <Link
              href={`/blog/${posts[0].slug}`}
              className="group mt-9 inline-flex w-fit items-center gap-4 border-b border-[#20211e] pb-3 text-[10px] font-bold uppercase tracking-[0.2em]"
            >
              READ THE STORY{" "}
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Article index */}
      <section
        id="latest-stories"
        className="scroll-mt-20 bg-[#ebeae3] px-5 py-20 sm:px-10 lg:px-[7%] lg:py-28"
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col justify-between gap-8 border-b border-[#cfcdc3] pb-8 lg:flex-row lg:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#9b7600]">
                THE LATEST
              </p>
              <h2 className="mt-4 font-[var(--font-bebas)] text-6xl uppercase leading-none sm:text-8xl">
                Stories to move you.
              </h2>
            </div>
            <p className="max-w-[340px] text-sm leading-7 text-[#77766f]">
              From choosing your first bike to caring for the one you love.
              Explore the topics that keep you rolling.
            </p>
          </div>

          <div className="flex flex-col gap-6 border-b border-[#cfcdc3] py-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`relative pb-2 text-[9px] font-bold tracking-[0.17em] transition-colors ${activeCategory === category ? "text-[#20211e]" : "text-[#89877e] hover:text-[#20211e]"}`}
                >
                  {category}
                  {activeCategory === category && (
                    <motion.span
                      layoutId="active-blog-category"
                      className="absolute bottom-0 left-0 h-[2px] w-full bg-[#F6BD12]"
                    />
                  )}
                </button>
              ))}
            </div>
            <label className="flex h-11 w-full items-center gap-3 border-b border-[#aaa89f] lg:max-w-[250px]">
              <Search size={16} className="text-[#77766f]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search stories"
                aria-label="Search stories"
                className="w-full bg-transparent text-xs text-[#20211e] outline-none placeholder:text-[#99978e]"
              />
            </label>
          </div>

          <motion.div
            layout
            className="grid gap-x-8 gap-y-14 pt-10 md:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post, index) => (
                <ArticleCard key={post.slug} post={post} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
          {filteredPosts.length === 0 && (
            <div className="py-20 text-center">
              <p className="font-[var(--font-bebas)] text-4xl uppercase">
                No stories found
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("ALL STORIES");
                }}
                className="mt-4 border-b border-[#9b7600] pb-1 text-[10px] font-bold uppercase tracking-widest"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative overflow-hidden bg-[#191c19] px-5 py-24 text-white sm:px-10 lg:px-[7%] lg:py-32">
        <Image
          src={image("photo-1511994298241-608e28f14d4f", 1800)}
          alt="Cycling adventure in the outdoors"
          fill
          unoptimized
          sizes="100vw"
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-[#111510]/75" />
        <div className="relative mx-auto flex max-w-[1400px] flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#F6BD12]">
              YOUR NEXT RIDE STARTS HERE
            </p>
            <h2 className="mt-5 font-[var(--font-bebas)] text-6xl uppercase leading-[0.85] sm:text-8xl lg:text-[120px]">
              Make more
              <br />
              room for <span className="text-[#F6BD12]">the ride.</span>
            </h2>
          </div>
          <div className="max-w-[340px]">
            <p className="text-sm leading-7 text-white/65">
              Have a question about a bicycle, component or accessory? The
              Flying Wheel team is happy to help.
            </p>
            <Link
              href="/contact"
              className="group mt-7 inline-flex items-center gap-5 bg-[#F6BD12] px-7 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-black transition-colors hover:bg-white"
            >
              TALK TO OUR TEAM{" "}
              <ArrowUpRight
                size={17}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
