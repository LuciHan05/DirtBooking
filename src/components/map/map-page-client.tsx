"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, Star, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { MapLoader } from "@/components/map/map-loader";
import { useTracksStore } from "@/stores/tracks-store";
import { trackRecordToTrack } from "@/lib/db/mappers";
import {
  DIFFICULTY_COLORS,
  DIFFICULTY_LABELS,
  formatLocation,
  formatPrice,
} from "@/lib/format";
import { cn } from "@/lib/utils";

export function MapPageClient() {
  const records = useTracksStore((s) => s.tracks);
  const tracks = useMemo(() => records.map(trackRecordToTrack), [records]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:h-[calc(100vh-4rem)] lg:flex-row lg:px-8 lg:py-6">
      <div className="order-2 flex flex-1 flex-col gap-3 overflow-y-auto lg:order-1 lg:w-80 lg:flex-none">
        <p className="text-sm text-muted-foreground">
          {tracks.length} trasee pe hartă
        </p>
        {tracks.map((track) => (
          <button
            key={track.id}
            onClick={() => setSelectedId(track.id)}
            className="block w-full text-left"
          >
            <GlassCard
              className={cn(
                "p-4 transition-colors",
                selectedId === track.id
                  ? "border-primary/40 bg-primary/5"
                  : "hover:border-white/20"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-heading text-sm font-semibold leading-tight">
                  {track.name}
                </h3>
                <div className="flex shrink-0 items-center gap-1 text-xs">
                  <Star className="size-3.5 fill-dirt text-dirt" />
                  {track.rating}
                </div>
              </div>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3 shrink-0" />
                {formatLocation(track.location.city, track.location.county)}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <Badge
                  variant="outline"
                  className={cn("text-[10px]", DIFFICULTY_COLORS[track.difficulty])}
                >
                  {DIFFICULTY_LABELS[track.difficulty]}
                </Badge>
                <span className="text-xs font-semibold text-primary">
                  {formatPrice(track.pricePerSession)}
                </span>
              </div>
              <Link
                href={`/tracks/${track.id}`}
                className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                onClick={(e) => e.stopPropagation()}
              >
                Vezi detalii <ArrowRight className="size-3" />
              </Link>
            </GlassCard>
          </button>
        ))}
      </div>

      <div className="order-1 h-[45vh] flex-1 overflow-hidden rounded-2xl border border-white/10 lg:order-2 lg:h-full">
        <MapLoader
          tracks={tracks}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>
    </div>
  );
}
