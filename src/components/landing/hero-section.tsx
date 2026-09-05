"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { ScrambleText } from "@/components/ui/scramble-text";
import { Aurora } from "@/components/landing/aurora";
import { LocationSearch } from "@/components/landing/location-search";
import { APP_COUNTRY } from "@/lib/constants";
import { EASE_OUT, wordReveal } from "@/lib/animations";

const HEADLINE = ["Găsește", "Traseul"];

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // Scroll-linked parallax: the hero settles back and dims as the page moves
  // past it, so the section below arrives on top of it rather than after it.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden px-4 pb-24 pt-20 sm:px-6 sm:pb-28 sm:pt-28 lg:px-8"
    >
      <Aurora />
      <div
        className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid-fade"
        aria-hidden
      />

      <motion.div
        className="relative mx-auto max-w-5xl text-center"
        style={
          reduced
            ? undefined
            : { y: contentY, opacity: contentOpacity, scale: contentScale }
        }
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="mb-7 inline-flex"
        >
          <span className="glass relative inline-flex items-center gap-2 overflow-hidden rounded-full px-4 py-1.5 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-primary">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full rounded-full bg-primary/70 animate-glow-pulse" />
              <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
            </span>
            <ScrambleText
              text={`Enduro · ${APP_COUNTRY}`}
              delay={0.35}
              className="tracking-[0.18em]"
            />
            {/* Light sweeping across the chip — decorative, seen once. */}
            <span
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"
              aria-hidden
            />
          </span>
        </motion.div>

        <h1 className="font-heading text-[clamp(2.6rem,9vw,5.5rem)] font-bold leading-[1.02]">
          <motion.span
            className="block"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.07, delayChildren: 0.08 },
              },
            }}
          >
            {HEADLINE.map((word) => (
              <motion.span
                key={word}
                variants={wordReveal}
                className="mr-[0.25em] inline-block"
              >
                {word}
              </motion.span>
            ))}
          </motion.span>

          <motion.span
            className="text-gradient-brand block"
            initial={{ opacity: 0, y: "0.35em" }}
            animate={{ opacity: 1, y: "0em" }}
            transition={{ duration: 0.7, delay: 0.24, ease: EASE_OUT }}
          >
            Perfect
          </motion.span>
        </h1>

        <motion.p
          className="mx-auto mt-7 max-w-xl text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: EASE_OUT }}
        >
          Descoperă piste de enduro, rezervă sesiuni și contactează
          proprietarii din toată România.
        </motion.p>

        <div className="mt-10">
          <LocationSearch />
        </div>

        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Magnetic>
            <Link href="/tracks">
              <Button variant="outline" size="lg" className="press group gap-2">
                Toate Traseele
                <ArrowRight className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </Magnetic>
          <Magnetic>
            <Link href="/register?role=host">
              <Button variant="ghost" size="lg" className="press">
                Listează Traseul Tău
              </Button>
            </Link>
          </Magnetic>
        </motion.div>
      </motion.div>

      <motion.div
        className="relative mx-auto mt-16 flex w-fit flex-col items-center gap-1.5 text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        aria-hidden
      >
        <span className="text-[0.65rem] uppercase tracking-[0.22em]">
          Derulează
        </span>
        <motion.span
          animate={reduced ? undefined : { y: [0, 5, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="size-4" />
        </motion.span>
      </motion.div>
    </section>
  );
}
