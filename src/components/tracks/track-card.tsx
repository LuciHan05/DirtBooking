import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
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
      <GlassCard
        glow={glow}
        className="group h-full overflow-hidden transition-transform duration-300 hover:-translate-y-1"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <TrackImage
            src={track.images[0]}
            alt={track.name}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
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

        <div className="p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
              {track.name}
            </h3>
            <div className="flex shrink-0 items-center gap-1 text-sm">
              <Star className="size-4 fill-dirt text-dirt" />
              <span className="font-medium">{track.rating}</span>
              <span className="text-muted-foreground">
                ({track.reviewCount})
              </span>
            </div>
          </div>

          <p className="mt-1.5 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" />
            {formatLocation(track.location.city, track.location.county)}
          </p>

          <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
            <span className="font-heading text-xl font-bold text-primary">
              {formatPrice(track.pricePerSession)}
              <span className="text-sm font-normal text-muted-foreground">
                /sesiune
              </span>
            </span>
            <span className="text-sm text-muted-foreground">
              de {track.hostName}
            </span>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}
