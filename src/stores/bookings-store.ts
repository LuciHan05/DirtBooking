import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BookingRecord } from "@/lib/db/schema";
import { SEED_BOOKINGS } from "@/lib/db/seed";
import { generateId } from "@/lib/db/mappers";

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
  create: (input: CreateBookingInput) => { success: boolean; error?: string };
  getForRider: (riderId: string) => BookingRecord[];
  getForHost: (hostId: string, trackIds: string[]) => BookingRecord[];
  updateStatus: (bookingId: string, status: BookingRecord["status"]) => void;
}

export const useBookingsStore = create<BookingsState>()(
  persist(
    (set, get) => ({
      bookings: SEED_BOOKINGS,

      create: (input) => {
        const booking: BookingRecord = {
          id: generateId("book"),
          trackId: input.trackId,
          trackName: input.trackName,
          riderId: input.riderId,
          riderName: input.riderName,
          slotDate: input.slotDate,
          timeSlot: input.timeSlot,
          status: "confirmed",
          waiverSigned: true,
          signatureData: input.signatureData,
          totalPrice: input.totalPrice,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ bookings: [...s.bookings, booking] }));
        return { success: true };
      },

      getForRider: (riderId) =>
        get().bookings.filter((b) => b.riderId === riderId),

      getForHost: (hostId, trackIds) =>
        get().bookings.filter((b) => trackIds.includes(b.trackId)),

      updateStatus: (bookingId, status) => {
        set((s) => ({
          bookings: s.bookings.map((b) =>
            b.id === bookingId ? { ...b, status } : b
          ),
        }));
      },
    }),
    { name: "dirtbooking-bookings" }
  )
);
