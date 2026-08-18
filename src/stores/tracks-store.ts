import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TrackRecord } from "@/lib/db/schema";
import { SEED_TRACKS } from "@/lib/db/seed";
import {
  filterTrackRecords,
  generateId,
  trackRecordToTrack,
} from "@/lib/db/mappers";
import type { Track, TrackDifficulty, SoilCondition } from "@/types";

export interface CreateTrackInput {
  title: string;
  description: string;
  city: string;
  county: string;
  address: string;
  pricePerSession: number;
  difficulty: TrackDifficulty;
  amenities: string[];
  soilCondition: SoilCondition;
  images: string[];
  hostId: string;
  hostName: string;
  slots: { date: string; times: string[] }[];
}

export type UpdateTrackInput = Omit<
  CreateTrackInput,
  "hostId" | "hostName" | "slots"
>;

interface TracksState {
  tracks: TrackRecord[];
  getAll: (location?: string) => Track[];
  getById: (id: string) => Track | undefined;
  addTrack: (input: CreateTrackInput) => string;
  updateTrack: (id: string, input: UpdateTrackInput) => void;
  deleteTrack: (id: string) => void;
  bookSlot: (trackId: string, date: string, time: string) => boolean;
  applyReview: (trackId: string, rating: number) => void;
}

function buildSlots(
  slots: { date: string; times: string[] }[]
): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const { date, times } of slots) {
    map[date] = times;
  }
  return map;
}

export const useTracksStore = create<TracksState>()(
  persist(
    (set, get) => ({
      tracks: SEED_TRACKS,

      getAll: (location) =>
        filterTrackRecords(get().tracks, location).map(trackRecordToTrack),

      getById: (id) => {
        const record = get().tracks.find((t) => t.id === id);
        return record ? trackRecordToTrack(record) : undefined;
      },

      addTrack: (input) => {
        const id = generateId("track");
        const record: TrackRecord = {
          id,
          hostId: input.hostId,
          hostName: input.hostName,
          title: input.title,
          description: input.description,
          city: input.city,
          county: input.county,
          address: input.address,
          lat: 45.9432,
          lng: 24.9668,
          pricePerSession: input.pricePerSession,
          difficulty: input.difficulty,
          images:
            input.images.length > 0
              ? input.images
              : [SEED_TRACKS[0].images[0]],
          amenities: input.amenities,
          soilCondition: input.soilCondition,
          featured: false,
          rating: 0,
          reviewCount: 0,
          availableSlots: buildSlots(input.slots),
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ tracks: [record, ...s.tracks] }));
        return id;
      },

      updateTrack: (id, input) => {
        set((s) => ({
          tracks: s.tracks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  title: input.title,
                  description: input.description,
                  city: input.city,
                  county: input.county,
                  address: input.address,
                  pricePerSession: input.pricePerSession,
                  difficulty: input.difficulty,
                  amenities: input.amenities,
                  soilCondition: input.soilCondition,
                  images: input.images.length > 0 ? input.images : t.images,
                }
              : t
          ),
        }));
      },

      deleteTrack: (id) => {
        set((s) => ({ tracks: s.tracks.filter((t) => t.id !== id) }));
      },

      applyReview: (trackId, rating) => {
        set((s) => ({
          tracks: s.tracks.map((t) => {
            if (t.id !== trackId) return t;
            const newCount = t.reviewCount + 1;
            const newRating =
              (t.rating * t.reviewCount + rating) / newCount;
            return {
              ...t,
              rating: Math.round(newRating * 10) / 10,
              reviewCount: newCount,
            };
          }),
        }));
      },

      bookSlot: (trackId, date, time) => {
        const tracks = get().tracks;
        const idx = tracks.findIndex((t) => t.id === trackId);
        if (idx === -1) return false;
        const slots = tracks[idx].availableSlots[date];
        if (!slots?.includes(time)) return false;

        const updated = [...tracks];
        updated[idx] = {
          ...updated[idx],
          availableSlots: {
            ...updated[idx].availableSlots,
            [date]: slots.filter((t) => t !== time),
          },
        };
        set({ tracks: updated });
        return true;
      },
    }),
    { name: "dirtbooking-tracks" }
  )
);
