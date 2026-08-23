"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Star,
  Calendar,
  CloudSun,
  MessageSquare,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/components/booking/booking-modal";
import { TrackChat } from "@/components/chat/track-chat";
import { TrackReviews } from "@/components/tracks/track-reviews";
import { TrackLocationMap } from "@/components/tracks/track-location-map";
import { TrackImage } from "@/components/tracks/track-image";
import { Bike } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useFleetStore } from "@/stores/fleet-store";
import {
  DIFFICULTY_COLORS,
  DIFFICULTY_LABELS,
  SOIL_COLORS,
  SOIL_LABELS,
  formatLocation,
  formatPrice,
} from "@/lib/format";
import type { Track } from "@/types";

interface TrackDetailClientProps {
  track: Track;
}

export function TrackDetailClient({ track }: TrackDetailClientProps) {
  const { isAuthenticated } = useAuthStore();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const fleetRecords = useFleetStore((s) => s.fleet);
  const availableBikes = useMemo(
    () =>
      fleetRecords.filter(
        (b) => b.hostId === track.hostId && b.status === "available"
      ),
    [fleetRecords, track.hostId]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-[21/9] overflow-hidden rounded-2xl">
            <TrackImage
              src={track.images[0]}
              alt={track.name}
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <Badge
                variant="outline"
                className={DIFFICULTY_COLORS[track.difficulty]}
              >
                {DIFFICULTY_LABELS[track.difficulty]}
              </Badge>
            </div>
          </div>

          <div>
            <h1 className="font-heading text-3xl font-bold sm:text-4xl">
              {track.name}
            </h1>
            <p className="mt-2 flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4" />
              {formatLocation(track.location.city, track.location.county)}
            </p>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="size-5 fill-dirt text-dirt" />
                <span className="font-medium">{track.rating}</span>
                <span className="text-muted-foreground">
                  ({track.reviewCount} recenzii)
                </span>
              </div>
              <span className={`text-sm font-medium ${SOIL_COLORS[track.soilCondition]}`}>
                {SOIL_LABELS[track.soilCondition]}
              </span>
            </div>
          </div>

          <GlassCard className="p-6">
            <h2 className="font-heading text-lg font-semibold mb-3">
              Despre traseu
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {track.description}
            </p>
          </GlassCard>

          {track.amenities.length > 0 && (
            <GlassCard className="p-6">
              <h2 className="font-heading text-lg font-semibold mb-3">
                Facilități
              </h2>
              <div className="flex flex-wrap gap-2">
                {track.amenities.map((a) => (
                  <Badge key={a} variant="outline">
                    {a}
                  </Badge>
                ))}
              </div>
            </GlassCard>
          )}

          {availableBikes.length > 0 && (
            <GlassCard className="p-6">
              <h2 className="mb-3 flex items-center gap-2 font-heading text-lg font-semibold">
                <Bike className="size-5 text-yamaha" />
                Motociclete disponibile de închiriat
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {availableBikes.map((bike) => (
                  <div
                    key={bike.id}
                    className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[3%] p-3"
                  >
                    {bike.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={bike.imageUrl}
                        alt={`${bike.make} ${bike.model}`}
                        className="size-14 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-white/5">
                        <Bike className="size-5 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">
                        {bike.make} {bike.model}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {bike.year} · {formatPrice(bike.hourlyRate)}/oră
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          <GlassCard className="overflow-hidden p-0">
            <div className="h-64">
              <TrackLocationMap lat={track.location.lat} lng={track.location.lng} />
            </div>
          </GlassCard>

          {showChat && (
            <TrackChat
              trackId={track.id}
              hostId={track.hostId}
              hostName={track.hostName}
            />
          )}

          <TrackReviews trackId={track.id} />
        </div>

        <div className="space-y-4">
          <GlassCard glow="ktm" className="p-6 sticky top-24">
            <p className="font-heading text-3xl font-bold text-primary">
              {formatPrice(track.pricePerSession)}
              <span className="text-base font-normal text-muted-foreground">
                /sesiune
              </span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Proprietar: {track.hostName}
            </p>

            <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/5 p-3 text-sm">
              <CloudSun className="size-5 text-yamaha shrink-0" />
              <span>
                {track.weather.temp}°C — {track.weather.condition}
              </span>
            </div>

            {isAuthenticated ? (
              <div className="mt-6 space-y-3">
                <Button
                  className="w-full glow-ktm gap-2"
                  size="lg"
                  onClick={() => setBookingOpen(true)}
                >
                  <Calendar className="size-4" />
                  Rezervă
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => setShowChat(!showChat)}
                >
                  <MessageSquare className="size-4" />
                  Contactează Proprietarul
                </Button>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                <Link href={`/login?redirect=/tracks/${track.id}`}>
                  <Button className="w-full glow-ktm" size="lg">
                    Autentifică-te pentru a rezerva
                  </Button>
                </Link>
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      <BookingModal
        track={track}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
      />
    </div>
  );
}
