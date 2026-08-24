"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { FileSignature } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/auth-store";
import { useBookingsStore } from "@/stores/bookings-store";
import { formatDate } from "@/lib/format";

export function MyWaivers() {
  const user = useAuthStore((s) => s.user);
  const _hasHydrated = useAuthStore((s) => s._hasHydrated);
  const bookingRecords = useBookingsStore((s) => s.bookings);
  const bookingsHasLoaded = useBookingsStore((s) => s.hasLoaded);
  const fetchBookings = useBookingsStore((s) => s.fetchBookings);
  useEffect(() => {
    if (user && !bookingsHasLoaded) fetchBookings();
  }, [user, bookingsHasLoaded, fetchBookings]);

  const signed = useMemo(
    () =>
      user
        ? bookingRecords.filter(
            (b) => b.riderId === user.id && b.waiverSigned
          )
        : [],
    [bookingRecords, user]
  );

  if (!_hasHydrated) return null;

  if (!user) {
    return (
      <GlassCard className="p-8 text-center">
        <FileSignature className="mx-auto mb-3 size-8 text-muted-foreground" />
        <p className="text-muted-foreground">
          <Link href="/login?redirect=/waivers" className="text-primary hover:underline">
            Autentifică-te
          </Link>{" "}
          pentru a vedea declarațiile tale semnate.
        </p>
      </GlassCard>
    );
  }

  if (signed.length === 0) {
    return (
      <GlassCard className="p-8 text-center text-muted-foreground">
        Nu ai semnat încă nicio declarație. Acestea apar automat la
        rezervarea unei sesiuni.
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      {signed.map((booking) => (
        <GlassCard
          key={booking.id}
          className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-heading font-semibold">{booking.trackName}</p>
            <p className="text-sm text-muted-foreground">
              Sesiune: {formatDate(booking.slotDate)} la {booking.timeSlot}
            </p>
            <Badge variant="outline" className="mt-2 border-kawasaki/30 text-kawasaki">
              Declarație semnată
            </Badge>
          </div>
          {booking.signatureData && (
            <div className="overflow-hidden rounded-lg border border-white/10 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={booking.signatureData}
                alt={`Semnătură pentru ${booking.trackName}`}
                className="h-16 w-40 object-contain"
              />
            </div>
          )}
        </GlassCard>
      ))}
    </div>
  );
}
