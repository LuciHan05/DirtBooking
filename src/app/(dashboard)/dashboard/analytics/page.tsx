"use client";

import { useMemo } from "react";
import { DollarSign, Calendar, MapPinned, Star } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { GlassCard } from "@/components/ui/glass-card";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { RevenueChart } from "@/components/dashboard/charts/revenue-chart";
import { BookingsBarChart } from "@/components/dashboard/charts/bookings-bar-chart";
import { DifficultyBarList } from "@/components/dashboard/charts/difficulty-bar-list";
import { useAuthStore } from "@/stores/auth-store";
import { useTracksStore } from "@/stores/tracks-store";
import { useBookingsStore } from "@/stores/bookings-store";
import {
  getWeeklyBuckets,
  getDifficultyDistribution,
  sumRevenue,
} from "@/lib/analytics";
import { formatPrice } from "@/lib/format";

export default function AnalyticsPage() {
  const user = useAuthStore((s) => s.user);
  const trackRecords = useTracksStore((s) => s.tracks);
  const bookingRecords = useBookingsStore((s) => s.bookings);

  const hostTracks = useMemo(
    () => (user ? trackRecords.filter((t) => t.hostId === user.id) : []),
    [trackRecords, user]
  );
  const hostTrackIds = useMemo(() => hostTracks.map((t) => t.id), [hostTracks]);
  const hostBookings = useMemo(
    () => bookingRecords.filter((b) => hostTrackIds.includes(b.trackId)),
    [bookingRecords, hostTrackIds]
  );

  const weeklyBuckets = useMemo(() => getWeeklyBuckets(hostBookings, 8), [hostBookings]);
  const difficultyData = useMemo(() => getDifficultyDistribution(hostTracks), [hostTracks]);
  const totalRevenue = useMemo(() => sumRevenue(hostBookings), [hostBookings]);

  const avgRating = hostTracks.length
    ? hostTracks.reduce((sum, t) => sum + t.rating, 0) / hostTracks.length
    : 0;

  const topTracks = useMemo(
    () =>
      [...hostTracks]
        .map((t) => ({
          ...t,
          revenue: sumRevenue(hostBookings.filter((b) => b.trackId === t.id)),
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5),
    [hostTracks, hostBookings]
  );

  const stats = [
    {
      label: "Venit total",
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      accent: "text-ktm",
    },
    {
      label: "Rezervări totale",
      value: String(hostBookings.length),
      icon: Calendar,
      accent: "text-yamaha",
    },
    {
      label: "Trasee active",
      value: String(hostTracks.length),
      icon: MapPinned,
      accent: "text-kawasaki",
    },
    {
      label: "Rating mediu",
      value: hostTracks.length ? avgRating.toFixed(1) : "—",
      icon: Star,
      accent: "text-dirt",
    },
  ];

  return (
    <>
      <DashboardHeader
        title="Statistici"
        subtitle="Performanța traseelor tale, la zi"
      />
      <div className="flex-1 overflow-y-auto p-6">
        <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.05}>
          {stats.map((stat) => (
            <RevealItem key={stat.label}>
              <GlassCard className="glass-edge p-5">
                <stat.icon className={`size-5 ${stat.accent}`} />
                <p className="mt-3 font-heading text-2xl font-bold tabular-nums">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </GlassCard>
            </RevealItem>
          ))}
        </RevealGroup>

        {hostTracks.length === 0 ? (
          <GlassCard className="glass-edge mt-6 p-12 text-center text-muted-foreground">
            Adaugă un traseu pentru a vedea statistici aici.
          </GlassCard>
        ) : (
          <>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <GlassCard className="glass-edge p-6">
                <RevenueChart data={weeklyBuckets} />
              </GlassCard>
              <GlassCard className="glass-edge p-6">
                <BookingsBarChart data={weeklyBuckets} />
              </GlassCard>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <GlassCard className="glass-edge p-6">
                <DifficultyBarList data={difficultyData} />
              </GlassCard>

              <GlassCard className="glass-edge p-6">
                <p className="mb-4 text-sm text-muted-foreground">
                  Top trasee după venit
                </p>
                {topTracks.every((t) => t.revenue === 0) ? (
                  <p className="text-sm text-muted-foreground">
                    Niciun venit înregistrat încă.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {topTracks.map((track, i) => (
                      <div
                        key={track.id}
                        className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[3%] p-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-heading text-sm font-bold text-muted-foreground">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <p className="text-sm font-medium">{track.title}</p>
                        </div>
                        <span className="text-sm font-semibold text-primary">
                          {formatPrice(track.revenue)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </div>
          </>
        )}
      </div>
    </>
  );
}
