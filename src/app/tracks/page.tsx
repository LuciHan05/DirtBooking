"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { TrackCard } from "@/components/tracks/track-card";
import { TracksSearch } from "@/components/tracks/tracks-search";
import {
  TracksFilters,
  EMPTY_FILTERS,
  type TrackFiltersState,
} from "@/components/tracks/tracks-filters";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/reveal";
import { useTracksStore } from "@/stores/tracks-store";
import { filterTrackRecords, trackRecordToTrack } from "@/lib/db/mappers";
import { APP_COUNTRY } from "@/lib/constants";

const glows = ["ktm", "yamaha", "kawasaki"] as const;

function TracksList({
  location,
  filters,
}: {
  location: string;
  filters: TrackFiltersState;
}) {
  const records = useTracksStore((s) => s.tracks);
  const hasLoaded = useTracksStore((s) => s.hasLoaded);
  const tracks = useMemo(() => {
    let result = filterTrackRecords(records, location || undefined).map(
      trackRecordToTrack
    );
    if (filters.difficulties.length > 0) {
      result = result.filter((t) => filters.difficulties.includes(t.difficulty));
    }
    if (filters.soilCondition) {
      result = result.filter((t) => t.soilCondition === filters.soilCondition);
    }
    const maxPrice = Number(filters.maxPrice);
    if (filters.maxPrice !== "" && !Number.isNaN(maxPrice)) {
      result = result.filter((t) => t.pricePerSession <= maxPrice);
    }
    return result;
  }, [records, location, filters]);

  if (!hasLoaded) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white/[4%]"
          >
            <div
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[6%] to-transparent animate-shimmer"
              aria-hidden
            />
          </div>
        ))}
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <Reveal className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-muted-foreground">
        Niciun traseu găsit. Încearcă alt oraș, județ sau filtre diferite.
      </Reveal>
    );
  }

  return (
    <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
      {tracks.map((track, i) => (
        <RevealItem key={track.id} className="h-full">
          <TrackCard track={track} glow={glows[i % glows.length]} />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

function TracksPageContent() {
  const searchParams = useSearchParams();
  const location = searchParams.get("location") ?? "";
  const [filters, setFilters] = useState<TrackFiltersState>(EMPTY_FILTERS);

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <Reveal className="mb-10" distance={16}>
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-primary">
          {APP_COUNTRY}
        </p>
        <h1 className="mt-2 font-heading text-4xl font-bold">
          Explorează Trasee
        </h1>
        <p className="mt-2 flex items-center gap-2 text-muted-foreground">
          <MapPin className="size-4" />
          {location
            ? `Rezultate pentru „${location}"`
            : `Toate traseele enduro din ${APP_COUNTRY}`}
        </p>
      </Reveal>

      <Reveal delay={0.05} distance={16}>
        <TracksSearch initialLocation={location} className="mb-6" />
        <TracksFilters value={filters} onChange={setFilters} className="mb-8" />
      </Reveal>
      <TracksList location={location} filters={filters} />
    </div>
  );
}

export default function TracksPage() {
  return (
    <MainLayout>
      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-4 py-12 animate-pulse">
            <div className="h-10 w-64 rounded-lg bg-muted" />
          </div>
        }
      >
        <TracksPageContent />
      </Suspense>
    </MainLayout>
  );
}
