import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type { TrackRecord } from "@/lib/db/schema";
import { filterTrackRecords, trackRecordToTrack } from "@/lib/db/mappers";
import type { Track, TrackDifficulty, SoilCondition } from "@/types";
import type { DbTrack, DbTrackSlot } from "@/types/database";

export interface CreateTrackInput {
  title: string;
  description: string;
  city: string;
  county: string;
  address: string;
  lat: number;
  lng: number;
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
  isLoading: boolean;
  hasLoaded: boolean;
  fetchTracks: () => Promise<void>;
  getAll: (location?: string) => Track[];
  getById: (id: string) => Track | undefined;
  addTrack: (
    input: CreateTrackInput
  ) => Promise<{ id?: string; error?: string }>;
  updateTrack: (
    id: string,
    input: UpdateTrackInput
  ) => Promise<{ error?: string }>;
  deleteTrack: (id: string) => Promise<{ error?: string }>;
  bookSlot: (trackId: string, date: string, time: string) => Promise<boolean>;
  addSlots: (
    trackId: string,
    slots: { date: string; times: string[] }[]
  ) => Promise<{ error?: string }>;
  removeSlot: (
    trackId: string,
    date: string,
    time: string
  ) => Promise<{ error?: string }>;
  applyReview: (trackId: string, rating: number) => void;
}

function recordFromDb(
  t: DbTrack,
  slotsByTrack: Map<string, Record<string, string[]>>
): TrackRecord {
  return {
    id: t.id,
    hostId: t.host_id,
    hostName: t.profiles?.name ?? "Proprietar",
    title: t.title,
    description: t.description,
    city: t.city,
    county: t.county,
    address: t.address,
    lat: t.lat ?? 45.9432,
    lng: t.lng ?? 24.9668,
    pricePerSession: t.price_per_session,
    difficulty: t.difficulty,
    images: t.images,
    amenities: t.amenities,
    soilCondition: t.soil_condition,
    featured: t.featured,
    rating: t.rating,
    reviewCount: t.review_count,
    availableSlots: slotsByTrack.get(t.id) ?? {},
    createdAt: t.created_at,
  };
}

export const useTracksStore = create<TracksState>()((set, get) => ({
  tracks: [],
  isLoading: false,
  hasLoaded: false,

  fetchTracks: async () => {
    set({ isLoading: true });
    const supabase = createClient();

    const [{ data: tracksData, error }, { data: slotsData }] =
      await Promise.all([
        supabase
          .from("tracks")
          .select("*, profiles(name)")
          .order("created_at", { ascending: false }),
        supabase.from("track_slots").select("*").eq("is_booked", false),
      ]);

    if (error || !tracksData) {
      set({ isLoading: false, hasLoaded: true });
      return;
    }

    const slotsByTrack = new Map<string, Record<string, string[]>>();
    for (const slot of (slotsData ?? []) as DbTrackSlot[]) {
      const map = slotsByTrack.get(slot.track_id) ?? {};
      map[slot.slot_date] = [...(map[slot.slot_date] ?? []), slot.time_slot];
      slotsByTrack.set(slot.track_id, map);
    }

    const tracks = (tracksData as unknown as DbTrack[]).map((t) =>
      recordFromDb(t, slotsByTrack)
    );
    set({ tracks, isLoading: false, hasLoaded: true });
  },

  getAll: (location) =>
    filterTrackRecords(get().tracks, location).map(trackRecordToTrack),

  getById: (id) => {
    const record = get().tracks.find((t) => t.id === id);
    return record ? trackRecordToTrack(record) : undefined;
  },

  addTrack: async (input) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("tracks")
      .insert({
        host_id: input.hostId,
        title: input.title,
        description: input.description,
        city: input.city,
        county: input.county,
        address: input.address,
        lat: input.lat,
        lng: input.lng,
        price_per_session: input.pricePerSession,
        difficulty: input.difficulty,
        images: input.images,
        amenities: input.amenities,
        soil_condition: input.soilCondition,
      })
      .select()
      .single();

    if (error || !data) {
      return { error: error?.message ?? "Eroare la salvarea traseului." };
    }

    if (input.slots.length > 0) {
      const rows = input.slots.flatMap((s) =>
        s.times.map((time) => ({
          track_id: data.id,
          slot_date: s.date,
          time_slot: time,
        }))
      );
      await supabase.from("track_slots").insert(rows);
    }

    await get().fetchTracks();
    return { id: data.id };
  },

  updateTrack: async (id, input) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("tracks")
      .update({
        title: input.title,
        description: input.description,
        city: input.city,
        county: input.county,
        address: input.address,
        lat: input.lat,
        lng: input.lng,
        price_per_session: input.pricePerSession,
        difficulty: input.difficulty,
        amenities: input.amenities,
        soil_condition: input.soilCondition,
        ...(input.images.length > 0 ? { images: input.images } : {}),
      })
      .eq("id", id);

    if (error) return { error: error.message };
    await get().fetchTracks();
    return {};
  },

  deleteTrack: async (id) => {
    const supabase = createClient();
    const { error } = await supabase.from("tracks").delete().eq("id", id);
    if (error) return { error: error.message };
    set((s) => ({ tracks: s.tracks.filter((t) => t.id !== id) }));
    return {};
  },

  bookSlot: async (trackId, date, time) => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("book_track_slot", {
      p_track_id: trackId,
      p_slot_date: date,
      p_time_slot: time,
    });
    if (error) return false;
    if (data) {
      set((s) => ({
        tracks: s.tracks.map((t) => {
          if (t.id !== trackId) return t;
          const remaining = (t.availableSlots[date] ?? []).filter(
            (slot) => slot !== time
          );
          const nextSlots = { ...t.availableSlots };
          if (remaining.length > 0) nextSlots[date] = remaining;
          else delete nextSlots[date];
          return { ...t, availableSlots: nextSlots };
        }),
      }));
    }
    return Boolean(data);
  },

  addSlots: async (trackId, slots) => {
    const supabase = createClient();
    const rows = slots.flatMap((s) =>
      s.times.map((time) => ({
        track_id: trackId,
        slot_date: s.date,
        time_slot: time,
      }))
    );
    const { error } = await supabase.from("track_slots").insert(rows);
    if (error) return { error: error.message };
    await get().fetchTracks();
    return {};
  },

  removeSlot: async (trackId, date, time) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("track_slots")
      .delete()
      .eq("track_id", trackId)
      .eq("slot_date", date)
      .eq("time_slot", time)
      .eq("is_booked", false);
    if (error) return { error: error.message };
    await get().fetchTracks();
    return {};
  },

  applyReview: (trackId, rating) => {
    set((s) => ({
      tracks: s.tracks.map((t) => {
        if (t.id !== trackId) return t;
        const newCount = t.reviewCount + 1;
        const newRating = (t.rating * t.reviewCount + rating) / newCount;
        return {
          ...t,
          rating: Math.round(newRating * 10) / 10,
          reviewCount: newCount,
        };
      }),
    }));
  },
}));
