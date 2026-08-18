"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LocationSearch } from "@/components/landing/location-search";
import { APP_COUNTRY } from "@/lib/constants";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8">
      <div
        className="pointer-events-none absolute -left-32 top-20 size-96 rounded-full bg-ktm/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 top-40 size-80 rounded-full bg-yamaha/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge
            variant="outline"
            className="mb-6 gap-1.5 border-primary/30 bg-primary/10 text-primary"
          >
            <Zap className="size-3.5" />
            Platforma #1 de rezervări enduro din {APP_COUNTRY}
          </Badge>

          <h1 className="font-heading text-4xl font-bold leading-[1.15] tracking-tight sm:text-6xl lg:text-7xl">
            Găsește Traseul
            <br />
            <span className="text-gradient-brand">Perfect</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Descoperă piste de enduro, rezervă sesiuni și contactează
            proprietarii din toată România.
          </p>
        </motion.div>

        <div className="mt-10">
          <LocationSearch />
        </div>

        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link href="/tracks">
            <Button variant="outline" size="lg" className="gap-2">
              Toate Traseele
              <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link href="/register?role=host">
            <Button variant="ghost" size="lg">
              Listează Traseul Tău
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
