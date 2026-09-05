"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Check, X, CheckCheck } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useBookingsStore } from "@/stores/bookings-store";
import { useTracksStore } from "@/stores/tracks-store";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import {
  formatDate,
  formatPrice,
  BOOKING_STATUS_LABELS,
} from "@/lib/format";
import type { BookingRecord } from "@/lib/db/schema";

const STATUS_BADGE: Record<BookingRecord["status"], string> = {
  pending: "border-dirt/30 text-dirt",
  confirmed: "border-kawasaki/30 text-kawasaki",
  completed: "border-yamaha/30 text-yamaha",
  cancelled: "border-destructive/30 text-destructive",
};

function RiderBookings() {
  const user = useAuthStore((s) => s.user);
  const bookingRecords = useBookingsStore((s) => s.bookings);
  const updateStatus = useBookingsStore((s) => s.updateStatus);
  const bookings = useMemo(
    () =>
      user
        ? bookingRecords
            .filter((b) => b.riderId === user.id)
            .sort((a, b) => (a.slotDate < b.slotDate ? 1 : -1))
        : [],
    [bookingRecords, user]
  );

  if (bookings.length === 0) {
    return (
      <p className="text-muted-foreground">
        Nu ai rezervări încă.{" "}
        <Link href="/tracks" className="text-primary hover:underline">
          Explorează trasee
        </Link>
      </p>
    );
  }

  return (
    <RevealGroup className="space-y-4" stagger={0.04}>
      {bookings.map((booking) => (
        <RevealItem key={booking.id}>
        <GlassCard className="glass-edge p-5 transition-transform duration-200 hover:-translate-y-0.5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-heading font-semibold">
                {booking.trackName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {formatDate(booking.slotDate)} la {booking.timeSlot}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className={STATUS_BADGE[booking.status]}>
                {BOOKING_STATUS_LABELS[booking.status]}
              </Badge>
              <Badge
                variant="outline"
                className={
                  booking.waiverSigned
                    ? "border-kawasaki/30 text-kawasaki"
                    : "border-ktm/30 text-ktm"
                }
              >
                {booking.waiverSigned ? "Semnat" : "Declarație necesară"}
              </Badge>
              <span className="font-heading font-bold">
                {formatPrice(booking.totalPrice)}
              </span>
              {(booking.status === "pending" || booking.status === "confirmed") && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive"
                  onClick={() => updateStatus(booking.id, "cancelled")}
                >
                  Anulează
                </Button>
              )}
            </div>
          </div>
        </GlassCard>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

function HostBookings() {
  const user = useAuthStore((s) => s.user);
  const trackRecords = useTracksStore((s) => s.tracks);
  const bookingRecords = useBookingsStore((s) => s.bookings);
  const updateStatus = useBookingsStore((s) => s.updateStatus);

  const hostTrackIds = useMemo(
    () => (user ? trackRecords.filter((t) => t.hostId === user.id).map((t) => t.id) : []),
    [trackRecords, user]
  );
  const bookings = useMemo(
    () =>
      bookingRecords
        .filter((b) => hostTrackIds.includes(b.trackId))
        .sort((a, b) => (a.slotDate < b.slotDate ? 1 : -1)),
    [bookingRecords, hostTrackIds]
  );

  if (bookings.length === 0) {
    return (
      <p className="text-muted-foreground">
        Nicio rezervare pentru traseele tale încă.
      </p>
    );
  }

  return (
    <RevealGroup className="space-y-4" stagger={0.04}>
      {bookings.map((booking) => (
        <RevealItem key={booking.id}>
        <GlassCard className="glass-edge p-5 transition-transform duration-200 hover:-translate-y-0.5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-heading font-semibold">{booking.trackName}</h3>
              <p className="text-sm text-muted-foreground">
                {booking.riderName} · {formatDate(booking.slotDate)} la {booking.timeSlot}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={STATUS_BADGE[booking.status]}>
                {BOOKING_STATUS_LABELS[booking.status]}
              </Badge>
              <span className="font-heading font-bold">
                {formatPrice(booking.totalPrice)}
              </span>

              {booking.status === "pending" && (
                <>
                  <Button
                    size="sm"
                    className="gap-1 glow-ktm"
                    onClick={() => updateStatus(booking.id, "confirmed")}
                  >
                    <Check className="size-3.5" />
                    Confirmă
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-destructive"
                    onClick={() => updateStatus(booking.id, "cancelled")}
                  >
                    <X className="size-3.5" />
                    Refuză
                  </Button>
                </>
              )}
              {booking.status === "confirmed" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => updateStatus(booking.id, "completed")}
                  >
                    <CheckCheck className="size-3.5" />
                    Marchează finalizată
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-destructive"
                    onClick={() => updateStatus(booking.id, "cancelled")}
                  >
                    <X className="size-3.5" />
                    Anulează
                  </Button>
                </>
              )}
            </div>
          </div>
        </GlassCard>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

export default function BookingsPage() {
  const user = useAuthStore((s) => s.user);
  const isHost = user?.role === "host";

  return (
    <>
      <DashboardHeader
        title={isHost ? "Rezervări" : "Rezervările mele"}
        subtitle={
          isHost
            ? "Confirmă, refuză sau finalizează sesiunile rezervate"
            : "Toate sesiunile tale pe trasee"
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        {isHost ? <HostBookings /> : <RiderBookings />}
      </div>
    </>
  );
}
