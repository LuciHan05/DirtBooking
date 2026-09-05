"use client";

import {
  MapPin,
  Calendar,
  Shield,
  MessageSquare,
  CloudSun,
  Trophy,
} from "lucide-react";
import { TiltCard, type TiltAccent } from "@/components/ui/tilt-card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";

const stats = [
  { value: 85, suffix: "+", decimals: 0, label: "Trasee în România" },
  { value: 8000, suffix: "+", decimals: 0, label: "Sesiuni rezervate" },
  { value: 4.8, suffix: "", decimals: 1, label: "Rating mediu" },
  { value: 41, suffix: "", decimals: 0, label: "Județe acoperite" },
];

const features = [
  {
    icon: MapPin,
    title: "Descoperă Trasee",
    description:
      "Hartă interactivă cu piste enduro din toată România și condiții live ale terenului.",
    accent: "ktm" as TiltAccent,
  },
  {
    icon: Calendar,
    title: "Rezervări Inteligente",
    description:
      "Calendar cu disponibilitate în timp real și confirmare instantă a sesiunii.",
    accent: "yamaha" as TiltAccent,
  },
  {
    icon: Shield,
    title: "Declarații Digitale",
    description:
      "Semnează declarația pe proprie răspundere direct pe platformă, înainte de tură.",
    accent: "kawasaki" as TiltAccent,
  },
  {
    icon: MessageSquare,
    title: "Chat cu Proprietarul",
    description:
      "Scrie proprietarului despre condiții, închirieri moto sau rezervări de grup.",
    accent: "ktm" as TiltAccent,
  },
  {
    icon: CloudSun,
    title: "Condiții Live",
    description:
      "Vreme și stare a terenului — știi dacă e noroi, praf sau pământ ideal.",
    accent: "yamaha" as TiltAccent,
  },
  {
    icon: Trophy,
    title: "Puncte Dirt",
    description:
      "Câștigă puncte din recenzii și ture. Evoluează profilul tău de rider.",
    accent: "kawasaki" as TiltAccent,
  },
];

const accentStyles: Record<string, string> = {
  ktm: "bg-ktm/12 text-ktm ring-ktm/20",
  yamaha: "bg-yamaha/12 text-yamaha ring-yamaha/20",
  kawasaki: "bg-kawasaki/12 text-kawasaki ring-kawasaki/20",
};

export function FeaturesSection() {
  return (
    <>
      <section className="relative border-y border-white/5 bg-white/[2%] px-4 py-16 sm:px-6 lg:px-8">
        {/* Soft edges instead of hard rules meeting the sections above/below. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent"
          aria-hidden
        />
        <RevealGroup
          className="mx-auto grid max-w-5xl grid-cols-2 gap-8 sm:grid-cols-4"
          stagger={0.07}
        >
          {stats.map((stat) => (
            <RevealItem key={stat.label} className="text-center">
              <p className="font-heading text-3xl font-bold tabular-nums text-gradient-ktm sm:text-4xl">
                <AnimatedCounter
                  value={stat.value}
                  decimals={stat.decimals}
                  suffix={stat.suffix}
                />
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {stat.label}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <section className="relative px-4 py-24 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal className="mb-16 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
              Platformă All-in-One
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">
              Tot ce ai nevoie pentru o tură
            </h2>
          </Reveal>

          <RevealGroup
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            stagger={0.07}
          >
            {features.map((feature) => (
              <RevealItem key={feature.title} className="h-full">
                <TiltCard accent={feature.accent} className="h-full">
                  <div className="glass glass-edge group/card flex h-full flex-col rounded-2xl p-6">
                    <div
                      className={`mb-5 inline-flex w-fit rounded-xl p-3 ring-1 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/card:scale-105 ${accentStyles[feature.accent]}`}
                    >
                      <feature.icon className="size-6" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </TiltCard>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
