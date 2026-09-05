"use client";

import Link from "next/link";
import { Star, MapPin, ArrowUpRight } from "lucide-react";
import { TiltCard } from "@/components/ui/tilt-card";
import { Badge } from "@/components/ui/badge";
import { TrackImage } from "@/components/tracks/track-image";
import type { Track } from "@/types";
import {
  DIFFICULTY_COLORS,
  DIFFICULTY_LABELS,
  SOIL_COLORS,
  SOIL_LABELS,
  formatLocation,
  formatPrice,
} from "@/lib/format";

interface TrackCardProps {
  track: Track;
  glow?: "ktm" | "yamaha" | "kawasaki";
}

export function TrackCard({ track, glow = "ktm" }: TrackCardProps) {
  return (
    <Link href={`/tracks/${track.id}`} className="block h-full">
      <TiltCard accent={glow} max={6} className="h-full">
        <div className="glass glass-edge group/card flex h-full flex-col overflow-hidden rounded-2xl">
          <div className="relative aspect-[16/10] overflow-hidden">
            <TrackImage
              src={track.images[0]}
              alt={track.name}
              className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/card:scale-[1.06]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

            {/* Affordance that this opens: appears only where hover exists. */}
            <div className="absolute right-3 top-3 flex size-8 translate-y-1 items-center justify-center rounded-full bg-black/40 opacity-0 backdrop-blur-sm transition-all duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/card:translate-y-0 group-hover/card:opacity-100">
              <ArrowUpRight className="size-4 text-white" />
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
              <Badge
                variant="outline"
                className={DIFFICULTY_COLORS[track.difficulty]}
              >
                {DIFFICULTY_LABELS[track.difficulty]}
              </Badge>
              <span
                className={`text-xs font-semibold ${SOIL_COLORS[track.soilCondition]}`}
              >
                {SOIL_LABELS[track.soilCondition]}
              </span>
            </div>
          </div>

          <div className="flex flex-1 flex-col p-5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-heading text-lg font-semibold leading-tight transition-colors duration-200 group-hover/card:text-primary">
                {track.name}
              </h3>
              <div className="flex shrink-0 items-center gap-1 text-sm">
                <Star className="size-4 fill-dirt text-dirt" />
                <span className="font-medium tabular-nums">{track.rating}</span>
                <span className="text-muted-foreground tabular-nums">
                  ({track.reviewCount})
                </span>
              </div>
            </div>

            <p className="mt-1.5 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-3.5 shrink-0" />
              {formatLocation(track.location.city, track.location.county)}
            </p>

            <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
              <span className="font-heading text-xl font-bold tabular-nums text-primary">
                {formatPrice(track.pricePerSession)}
                <span className="text-sm font-normal text-muted-foreground">
                  /sesiune
                </span>
              </span>
              <span className="truncate text-sm text-muted-foreground">
                de {track.hostName}
              </span>
            </div>
          </div>
        </div>
      </TiltCard>
    </Link>
  );
}
