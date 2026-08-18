"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Calendar,
  Shield,
  MessageSquare,
  CloudSun,
  Trophy,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

const stats = [
  { value: "85+", label: "Trasee în România" },
  { value: "8k+", label: "Sesiuni rezervate" },
  { value: "4,8", label: "Rating mediu" },
  { value: "41", label: "Județe acoperite" },
];

const features = [
  {
    icon: MapPin,
    title: "Descoperă Trasee",
    description:
      "Hartă interactivă cu piste enduro din toată România și condiții live ale terenului.",
    accent: "ktm" as const,
  },
  {
    icon: Calendar,
    title: "Rezervări Inteligente",
    description:
      "Calendar cu disponibilitate în timp real și confirmare instantă a sesiunii.",
    accent: "yamaha" as const,
  },
  {
    icon: Shield,
    title: "Declarații Digitale",
    description:
      "Semnează declarația pe proprie răspundere direct pe platformă, înainte de tură.",
    accent: "kawasaki" as const,
  },
  {
    icon: MessageSquare,
    title: "Chat cu Proprietarul",
    description:
      "Scrie proprietarului despre condiții, închirieri moto sau rezervări de grup.",
    accent: "ktm" as const,
  },
  {
    icon: CloudSun,
    title: "Condiții Live",
    description:
      "Vreme și stare a terenului — știi dacă e noroi, praf sau pământ ideal.",
    accent: "yamaha" as const,
  },
  {
    icon: Trophy,
    title: "Puncte Dirt",
    description:
      "Câștigă puncte din recenzii și ture. Evoluează profilul tău de rider.",
    accent: "kawasaki" as const,
  },
];

const accentStyles = {
  ktm: "bg-ktm/15 text-ktm",
  yamaha: "bg-yamaha/15 text-yamaha",
  kawasaki: "bg-kawasaki/15 text-kawasaki",
};

export function FeaturesSection() {
  return (
    <>
      <section className="border-y border-white/5 bg-white/[2%] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="font-heading text-3xl font-bold text-gradient-ktm sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-medium uppercase tracking-widest text-primary">
              Platformă All-in-One
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
              Tot ce ai nevoie pentru o tură
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08 }}
              >
                <GlassCard
                  glow={feature.accent}
                  className="h-full p-6 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div
                    className={`mb-4 inline-flex rounded-xl p-3 ${accentStyles[feature.accent]}`}
                  >
                    <feature.icon className="size-6" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
