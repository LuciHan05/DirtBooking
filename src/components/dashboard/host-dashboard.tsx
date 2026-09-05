"use client";

import { useMemo } from "react";
import Link from "next/link";
import { DollarSign, Calendar, Users, TrendingUp, ArrowRight } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { useAuthStore } from "@/stores/auth-store";
import { useTracksStore } from "@/stores/tracks-store";
import { useBookingsStore } from "@/stores/bookings-store";
import { useFleetStore } from "@/stores/fleet-store";
import { getWeeklyBuckets } from "@/lib/analytics";
import { formatPrice, BOOKING_STATUS_LABELS } from "@/lib/format";

export function HostDashboard() {
  const user = useAuthStore((s) => s.user);
  const records = useTracksStore((s) => s.tracks);
  const hostTracks = useMemo(
    () => (user ? records.filter((t) => t.hostId === user.id) : []),
    [records, user]
  );
  const bookingsRecords = useBookingsStore((s) => s.bookings);
  const bookings = useMemo(
    () => bookingsRecords.filter((b) => hostTracks.some((t) => t.id === b.trackId)),
    [bookingsRecords, hostTracks]
  );
  const fleetRecords = useFleetStore((s) => s.fleet);
  const fleet = fleetRecords.filter((b) => b.hostId === user?.id);

  const weeklyBuckets = useMemo(() => getWeeklyBuckets(bookings, 4), [bookings]);
  const monthlyRevenue = weeklyBuckets.reduce((sum, w) => sum + w.revenue, 0);
  const prevMonthlyRevenue = useMemo(() => {
    const eightWeeksAgo = getWeeklyBuckets(bookings, 8);
    return eightWeeksAgo.slice(0, 4).reduce((sum, w) => sum + w.revenue, 0);
  }, [bookings]);
  const revenueChange =
    prevMonthlyRevenue > 0
      ? Math.round(((monthlyRevenue - prevMonthlyRevenue) / prevMonthlyRevenue) * 100)
      : null;
  const upcomingSessions = bookings.filter(
    (b) =>
      b.status !== "cancelled" &&
      new Date(b.slotDate + "T12:00:00") >= new Date(new Date().toDateString())
  );
  const todaySessions = upcomingSessions.filter(
    (b) => b.slotDate === new Date().toISOString().slice(0, 10)
  );
  const uniqueRiders = new Set(bookings.map((b) => b.riderId)).size;

  const stats = [
    {
      label: "Venit lunar",
      value: formatPrice(monthlyRevenue),
      change:
        revenueChange === null
          ? "—"
          : `${revenueChange >= 0 ? "+" : ""}${revenueChange}%`,
      icon: DollarSign,
      accent: "text-ktm",
    },
    {
      label: "Sesiuni viitoare",
      value: String(upcomingSessions.length),
      change: todaySessions.length > 0 ? `${todaySessions.length} azi` : "Niciuna azi",
      icon: Calendar,
      accent: "text-yamaha",
    },
    {
      label: "Listări active",
      value: String(hostTracks.length),
      change: hostTracks.length > 0 ? "Toate live" : "Adaugă un traseu",
      icon: TrendingUp,
      accent: "text-kawasaki",
    },
    {
      label: "Rideri unici",
      value: String(uniqueRiders),
      change: `${bookings.length} rezervări total`,
      icon: Users,
      accent: "text-dirt",
    },
  ];

  return (
    <>
      <DashboardHeader
        title="Panou Proprietar"
        subtitle={`Bine ai revenit, ${user?.name ?? "Proprietar"}. Performanța traseelor tale.`}
      />

      <div className="flex-1 overflow-y-auto p-6">
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.05}>
          {stats.map((stat) => (
            <RevealItem key={stat.label}>
              <GlassCard className="glass-edge p-5 transition-transform duration-200 hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <stat.icon className={`size-5 ${stat.accent}`} />
                  <span className="text-xs text-kawasaki">{stat.change}</span>
                </div>
                <p className="mt-3 font-heading text-2xl font-bold tabular-nums">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </GlassCard>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className="mt-6 grid gap-6 lg:grid-cols-2" delay={0.1}>
          <GlassCard className="glass-edge p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold">
                Rezervări recente
              </h2>
              <Link href="/dashboard/bookings">
                <Button variant="ghost" size="sm" className="gap-1">
                  Vezi toate <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {bookings.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nicio rezervare încă.
                </p>
              ) : (
                bookings
                  .slice()
                  .sort((a, b) => (a.slotDate < b.slotDate ? 1 : -1))
                  .slice(0, 5)
                  .map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[3%] p-3 transition-colors duration-200 hover:bg-white/[5%]"
                  >
                    <div>
                      <p className="text-sm font-medium">{booking.trackName}</p>
                      <p className="text-xs text-muted-foreground">
                        {booking.slotDate} · {booking.timeSlot}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {BOOKING_STATUS_LABELS[booking.status]}
                      </Badge>
                      <p className="mt-1 text-sm font-medium">
                        {formatPrice(booking.totalPrice)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>

          <GlassCard className="glass-edge p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold">
                Stare flotă
              </h2>
              <Link href="/dashboard/fleet">
                <Button variant="outline" size="sm">
                  Gestionează flota
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {fleet.map((bike) => (
                <div
                  key={bike.id}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[3%] p-3"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {bike.make} {bike.model}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {bike.year} · {formatPrice(bike.hourlyRate)}/oră
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      bike.status === "available"
                        ? "border-kawasaki/30 text-kawasaki"
                        : bike.status === "rented"
                          ? "border-yamaha/30 text-yamaha"
                          : "border-ktm/30 text-ktm"
                    }
                  >
                    {bike.status === "available"
                      ? "Disponibil"
                      : bike.status === "rented"
                        ? "Închiriat"
                        : "Service"}
                  </Badge>
                </div>
              ))}
            </div>
          </GlassCard>
        </Reveal>
      </div>
    </>
  );
}
