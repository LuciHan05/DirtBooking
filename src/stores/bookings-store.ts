import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type { BookingRecord } from "@/lib/db/schema";
import type { DbBooking } from "@/types/database";

interface CreateBookingInput {
  trackId: string;
  trackName: string;
  riderId: string;
  riderName: string;
  slotDate: string;
  timeSlot: string;
  totalPrice: number;
  signatureData: string;
}

interface BookingsState {
  bookings: BookingRecord[];
  isLoading: boolean;
  hasLoaded: boolean;
  fetchBookings: () => Promise<void>;
  create: (input: CreateBookingInput) => Promise<{ success: boolean; error?: string }>;
  getForRider: (riderId: string) => BookingRecord[];
  getForHost: (hostId: string, trackIds: string[]) => BookingRecord[];
  updateStatus: (
    bookingId: string,
    status: BookingRecord["status"]
  ) => Promise<{ error?: string }>;
}

function recordFromDb(b: DbBooking): BookingRecord {
  return {
    id: b.id,
    trackId: b.track_id,
    trackName: b.tracks?.title ?? "Traseu",
    riderId: b.rider_id,
    riderName: b.profiles?.name ?? "Rider",
    slotDate: b.slot_date,
    timeSlot: b.time_slot,
    status: b.status,
    waiverSigned: b.waiver_signed,
    signatureData: b.signature_data ?? undefined,
    totalPrice: b.total_price,
    createdAt: b.created_at,
  };
}

export const useBookingsStore = create<BookingsState>()((set, get) => ({
  bookings: [],
  isLoading: false,
  hasLoaded: false,

  fetchBookings: async () => {
    set({ isLoading: true });
    const supabase = createClient();
    const { data, error } = await supabase
      .from("bookings")
      .select("*, tracks(title), profiles(name)")
      .order("created_at", { ascending: false });

    if (error || !data) {
      set({ isLoading: false, hasLoaded: true });
      return;
    }

    const bookings = (data as unknown as DbBooking[]).map(recordFromDb);
    set({ bookings, isLoading: false, hasLoaded: true });
  },

  create: async (input) => {
    const supabase = createClient();
    const { error } = await supabase.from("bookings").insert({
      track_id: input.trackId,
      rider_id: input.riderId,
      slot_date: input.slotDate,
      time_slot: input.timeSlot,
      status: "confirmed",
      waiver_signed: true,
      signature_data: input.signatureData,
      total_price: input.totalPrice,
    });
    if (error) return { success: false, error: error.message };
    await get().fetchBookings();
    return { success: true };
  },

  getForRider: (riderId) =>
    get().bookings.filter((b) => b.riderId === riderId),

  getForHost: (hostId, trackIds) =>
    get().bookings.filter((b) => trackIds.includes(b.trackId)),

  updateStatus: async (bookingId, status) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", bookingId);
    if (error) return { error: error.message };
    set((s) => ({
      bookings: s.bookings.map((b) =>
        b.id === bookingId ? { ...b, status } : b
      ),
    }));
    return {};
  },
}));
