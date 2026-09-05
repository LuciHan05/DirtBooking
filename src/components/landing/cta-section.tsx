"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TiltCard } from "@/components/ui/tilt-card";
import { Magnetic } from "@/components/ui/magnetic";
import { Reveal } from "@/components/ui/reveal";

export function CtaSection() {
  return (
    <section className="px-4 py-24 sm:px-6 sm:py-28 lg:px-8">
      <Reveal className="mx-auto max-w-4xl" distance={28}>
        <TiltCard accent="ktm" max={4} lift={false}>
          <div className="glass-strong glass-edge relative overflow-hidden rounded-2xl p-10 sm:p-14">
            {/* Ambient light inside the panel, drifting slowly. */}
            <div
              className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-ktm/12 blur-[90px] animate-aurora"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-24 -right-16 size-64 rounded-full bg-yamaha/12 blur-[90px] animate-aurora-slow"
              aria-hidden
            />

            <div className="relative text-center">
              <h2 className="font-heading text-3xl font-bold sm:text-4xl">
                Gata de <span className="text-gradient-brand">off-road</span>?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-balance leading-relaxed text-muted-foreground">
                Alătură-te comunității de rideri și proprietari din România.
                Creează-ți contul gratuit și rezervă prima sesiune.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Magnetic strength={12}>
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="press px-8 shadow-[0_0_32px_oklch(0.78_0.13_202/26%)]"
                    >
                      Creează Cont Gratuit
                    </Button>
                  </Link>
                </Magnetic>
                <Magnetic strength={12}>
                  <Link href="/tracks">
                    <Button size="lg" variant="outline" className="press">
                      Explorează Trasee
                    </Button>
                  </Link>
                </Magnetic>
              </div>
            </div>
          </div>
        </TiltCard>
      </Reveal>
    </section>
  );
}
