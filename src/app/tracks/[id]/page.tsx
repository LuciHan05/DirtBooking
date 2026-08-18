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
  const track = useMemo(
    () => (record ? trackRecordToTrack(record) : undefined),
    [record]
  );

  if (!track) notFound();

  return (
    <MainLayout>
      <TrackDetailClient track={track} />
    </MainLayout>
  );
}
