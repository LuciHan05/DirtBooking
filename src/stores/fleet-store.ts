import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type { FleetBikeRecord } from "@/lib/db/schema";
import type { DbFleetBike } from "@/types/database";

interface CreateFleetBikeInput {
  hostId: string;
  make: string;
  model: string;
  year: number;
  hourlyRate: number;
  status: FleetBikeRecord["status"];
}

type UpdateFleetBikeInput = Omit<CreateFleetBikeInput, "hostId">;

interface FleetState {
  fleet: FleetBikeRecord[];
  isLoading: boolean;
  hasLoaded: boolean;
  fetchFleet: () => Promise<void>;
  getForHost: (hostId: string) => FleetBikeRecord[];
  addBike: (input: CreateFleetBikeInput) => Promise<{ error?: string }>;
  updateBike: (
    id: string,
    input: UpdateFleetBikeInput
  ) => Promise<{ error?: string }>;
  deleteBike: (id: string) => Promise<{ error?: string }>;
}

function recordFromDb(b: DbFleetBike): FleetBikeRecord {
  return {
    id: b.id,
    hostId: b.host_id,
    make: b.make,
    model: b.model,
    year: b.year,
    status: b.status,
    hourlyRate: b.hourly_rate,
  };
}

export const useFleetStore = create<FleetState>()((set, get) => ({
  fleet: [],
  isLoading: false,
  hasLoaded: false,

  fetchFleet: async () => {
    set({ isLoading: true });
    const supabase = createClient();
    const { data, error } = await supabase
      .from("fleet_bikes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) {
      set({ isLoading: false, hasLoaded: true });
      return;
    }
    set({
      fleet: (data as DbFleetBike[]).map(recordFromDb),
      isLoading: false,
      hasLoaded: true,
    });
  },

  getForHost: (hostId) => get().fleet.filter((b) => b.hostId === hostId),

  addBike: async (input) => {
    const supabase = createClient();
    const { error } = await supabase.from("fleet_bikes").insert({
      host_id: input.hostId,
      make: input.make,
      model: input.model,
      year: input.year,
      hourly_rate: input.hourlyRate,
      status: input.status,
    });
    if (error) return { error: error.message };
    await get().fetchFleet();
    return {};
  },

  updateBike: async (id, input) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("fleet_bikes")
      .update({
        make: input.make,
        model: input.model,
        year: input.year,
        hourly_rate: input.hourlyRate,
        status: input.status,
      })
      .eq("id", id);
    if (error) return { error: error.message };
    await get().fetchFleet();
    return {};
  },

  deleteBike: async (id) => {
    const supabase = createClient();
    const { error } = await supabase.from("fleet_bikes").delete().eq("id", id);
    if (error) return { error: error.message };
    set((s) => ({ fleet: s.fleet.filter((b) => b.id !== id) }));
    return {};
  },
}));
