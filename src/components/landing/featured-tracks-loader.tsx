"use client";

import { useMemo } from "react";
import { useTracksStore } from "@/stores/tracks-store";
import { FeaturedTracksSection } from "@/components/landing/featured-tracks";
import {
  filterTrackRecords,
  trackRecordToTrack,
} from "@/lib/db/mappers";

export function FeaturedTracksLoader() {
  const tracks = useTracksStore((s) => s.tracks);
  const hasLoaded = useTracksStore((s) => s.hasLoaded);
  const derived = useMemo(
    () => filterTrackRecords(tracks).map(trackRecordToTrack),
    [tracks]
  );
  return <FeaturedTracksSection tracks={derived} isLoading={!hasLoaded} />;
}
