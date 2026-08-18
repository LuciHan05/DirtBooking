"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatPrice } from "@/lib/format";
import type { Track, TrackDifficulty } from "@/types";

const MARKER_COLOR: Record<TrackDifficulty, string> = {
  beginner: "bg-kawasaki",
  intermediate: "bg-yamaha",
  advanced: "bg-ktm",
  pro: "bg-destructive",
};

function createIcon(difficulty: TrackDifficulty, active: boolean) {
  const color = MARKER_COLOR[difficulty];
  return L.divIcon({
    className: "",
    html: `<div class="relative flex ${active ? "size-6" : "size-4"} items-center justify-center transition-all">
      <span class="absolute inline-flex size-full rounded-full ${color} opacity-40 ${active ? "animate-ping" : ""}"></span>
      <span class="relative inline-flex ${active ? "size-4" : "size-3"} rounded-full ${color} ring-2 ring-white/90 shadow-lg"></span>
    </div>`,
    iconSize: active ? [24, 24] : [16, 16],
    iconAnchor: active ? [12, 12] : [8, 8],
    popupAnchor: [0, -8],
  });
}

function FlyToSelected({ track }: { track: Track | null }) {
  const map = useMap();
  useEffect(() => {
    if (track) {
      map.flyTo([track.location.lat, track.location.lng], 10, { duration: 0.8 });
    }
  }, [track, map]);
  return null;
}

interface TracksMapProps {
  tracks: Track[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function TracksMap({ tracks, selectedId, onSelect }: TracksMapProps) {
  const selected = tracks.find((t) => t.id === selectedId) ?? null;

  return (
    <MapContainer
      center={[45.9432, 24.9668]}
      zoom={7}
      scrollWheelZoom
      className="size-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {tracks.map((track) => (
        <Marker
          key={track.id}
          position={[track.location.lat, track.location.lng]}
          icon={createIcon(track.difficulty, track.id === selectedId)}
          eventHandlers={{ click: () => onSelect(track.id) }}
        >
          <Popup>
            <div className="min-w-[180px] space-y-1.5">
              <p className="text-sm font-semibold">{track.name}</p>
              <p className="text-xs text-muted-foreground">
                {track.location.city}, {track.location.county}
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-medium">
                  {formatPrice(track.pricePerSession)}
                </span>
                <Link
                  href={`/tracks/${track.id}`}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Vezi traseul →
                </Link>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
      <FlyToSelected track={selected} />
    </MapContainer>
  );
}
