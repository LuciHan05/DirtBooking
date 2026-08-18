import type { TrackRecord } from "@/lib/db/schema";
import type { Track } from "@/types";

export function trackRecordToTrack(record: TrackRecord): Track {
  return {
    id: record.id,
    name: record.title,
    description: record.description,
    hostId: record.hostId,
    hostName: record.hostName,
    location: {
      lat: record.lat,
      lng: record.lng,
      address: record.address,
      city: record.city,
      county: record.county,
      country: "RO",
    },
    difficulty: record.difficulty,
    pricePerSession: record.pricePerSession,
    images: record.images,
    rating: record.rating,
    reviewCount: record.reviewCount,
    featured: record.featured,
    amenities: record.amenities,
    soilCondition: record.soilCondition,
    weather: { temp: 22, condition: "Senin", windSpeed: 5 },
    availableSlots: { ...record.availableSlots },
  };
}

export function filterTrackRecords(
  tracks: TrackRecord[],
  location?: string
): TrackRecord[] {
  if (!location?.trim()) return tracks;
  const q = location.toLowerCase();
  return tracks.filter(
    (t) =>
      t.city.toLowerCase().includes(q) ||
      t.county.toLowerCase().includes(q) ||
      t.title.toLowerCase().includes(q)
  );
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
