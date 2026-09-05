"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Calendar, MapPin, Bike, Star, ArrowRight } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Magnetic } from "@/components/ui/magnetic";
import { useAuthStore } from "@/stores/auth-store";
import { useBookingsStore } from "@/stores/bookings-store";
import { SEED_GARAGE } from "@/lib/db/seed";
import { formatDate, formatPrice } from "@/lib/format";

export function RiderDashboard() {
  const user = useAuthStore((s) => s.user);
  const bookingRecords = useBookingsStore((s) => s.bookings);
  const bookings = useMemo(
    () => (user ? bookingRecords.filter((b) => b.riderId === user.id) : []),
    [bookingRecords, user]
  );
  const upcoming = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "pending"
  );
  const garage = SEED_GARAGE.filter((b) => b.userId === user?.id);

  return (
    <>
      <DashboardHeader
        title={`Salut, ${user?.name?.split(" ")[0] ?? "Rider"}!`}
        subtitle="Iată ce urmează în calendarul tău."
      />

      <div className="flex-1 overflow-y-auto p-6">
        <RevealGroup className="grid gap-6 lg:grid-cols-3" stagger={0.06}>
          <RevealItem className="lg:col-span-2">
          <GlassCard className="glass-edge h-full p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold flex items-center gap-2">
                <Calendar className="size-5 text-primary" />
                Rezervări viitoare
              </h2>
              <Link href="/dashboard/bookings">
                <Button variant="ghost" size="sm" className="gap-1">
                  Vezi toate <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>

            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nicio rezervare viitoare.{" "}
                <Link href="/tracks" className="text-primary hover:underline">
                  Caută un traseu
                </Link>
              </p>
            ) : (
              <div className="space-y-3">
                {upcoming.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[3%] p-4 transition-colors duration-200 hover:bg-white/[5%]"
                  >
                    <div>
                      <p className="font-medium">{booking.trackName}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(booking.slotDate)} la {booking.timeSlot}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className={
                          booking.waiverSigned
                            ? "border-kawasaki/30 text-kawasaki"
                            : "border-ktm/30 text-ktm"
                        }
                      >
                        {booking.waiverSigned
                          ? "Declarație semnată"
                          : "Declarație necesară"}
                      </Badge>
                      <span className="font-heading font-bold">
                        {formatPrice(booking.totalPrice)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
          </RevealItem>

          <RevealItem>
          <GlassCard glow="ktm" className="glass-edge h-full p-6">
            <h2 className="font-heading text-lg font-semibold flex items-center gap-2">
              <Star className="size-5 text-dirt fill-dirt" />
              Puncte Dirt
            </h2>
            <p className="mt-4 font-heading text-5xl font-bold text-gradient-ktm">
              <AnimatedCounter value={user?.dirtPoints ?? 0} duration={1.2} />
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Câștigă puncte din ture și recenzii.
            </p>
          </GlassCard>
          </RevealItem>
        </RevealGroup>

        <Reveal delay={0.1}>
        <GlassCard className="glass-edge mt-6 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold flex items-center gap-2">
              <Bike className="size-5 text-yamaha" />
              Garaj Digital
            </h2>
            <Link href="/dashboard/garage">
              <Button variant="outline" size="sm">
                Gestionează
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {garage.map((bike) => (
              <div
                key={bike.id}
                className="rounded-xl border border-white/5 bg-white/[3%] p-4 transition-colors duration-200 hover:bg-white/[5%]"
              >
                <p className="font-heading font-semibold">
                  {bike.make} {bike.model}
                </p>
                <p className="text-sm text-muted-foreground">
                  {bike.year} · {bike.displacement}
                </p>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="glass-edge relative mt-6 flex items-center justify-between overflow-hidden rounded-2xl border border-white/5 bg-yamaha/5 p-6">
          <div
            className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-yamaha/15 blur-[80px] animate-aurora-slow"
            aria-hidden
          />
          <div className="relative flex items-center gap-3">
            <MapPin className="size-6 text-yamaha" />
            <div>
              <p className="font-heading font-semibold">Descoperă trasee noi</p>
              <p className="text-sm text-muted-foreground">
                Piste enduro din toată România
              </p>
            </div>
          </div>
          <Magnetic strength={8} className="relative">
            <Link href="/tracks">
              <Button className="press glow-yamaha">Explorează</Button>
            </Link>
          </Magnetic>
        </div>
        </Reveal>
      </div>
    </>
  );
}
