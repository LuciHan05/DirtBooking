"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { MainLayout } from "@/components/layout/main-layout";
import { TrackDetailClient } from "@/components/tracks/track-detail-client";
import { useTracksStore } from "@/stores/tracks-store";
import { trackRecordToTrack } from "@/lib/db/mappers";

export default function TrackDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const record = useTracksStore((s) => s.tracks.find((t) => t.id === id));
  const hasLoaded = useTracksStore((s) => s.hasLoaded);
  const track = useMemo(
    () => (record ? trackRecordToTrack(record) : undefined),
    [record]
  );

  if (!track) {
    if (hasLoaded) notFound();
    return (
      <MainLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <TrackDetailClient track={track} />
    </MainLayout>
  );
}
