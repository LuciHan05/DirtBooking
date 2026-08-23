"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const ReadonlyMap = dynamic(() => import("@/components/tracks/track-location-map-inner"), {
  ssr: false,
  loading: () => (
    <div className="flex size-full items-center justify-center bg-white/[2%]">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </div>
  ),
});

export function TrackLocationMap({ lat, lng }: { lat: number; lng: number }) {
  return <ReadonlyMap lat={lat} lng={lng} />;
}
