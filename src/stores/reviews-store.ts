import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type { ReviewRecord } from "@/lib/db/schema";
import type { DbReview } from "@/types/database";
import { useTracksStore } from "@/stores/tracks-store";

interface CreateReviewInput {
  trackId: string;
  bookingId: string;
  riderId: string;
  rating: number;
  comment: string;
}

interface ReviewsState {
  reviews: ReviewRecord[];
  isLoading: boolean;
  hasLoaded: boolean;
  fetchReviews: () => Promise<void>;
  getForTrack: (trackId: string) => ReviewRecord[];
  hasReviewed: (bookingId: string) => boolean;
  add: (input: CreateReviewInput) => Promise<{ success: boolean; error?: string }>;
}

function recordFromDb(r: DbReview): ReviewRecord {
  return {
    id: r.id,
    trackId: r.track_id,
    bookingId: r.booking_id,
    riderId: r.rider_id,
    riderName: r.profiles?.name ?? "Rider",
    rating: r.rating,
    comment: r.comment,
    createdAt: r.created_at,
  };
}

export const useReviewsStore = create<ReviewsState>()((set, get) => ({
  reviews: [],
  isLoading: false,
  hasLoaded: false,

  fetchReviews: async () => {
    set({ isLoading: true });
    const supabase = createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("*, profiles(name)")
      .order("created_at", { ascending: false });

    if (error || !data) {
      set({ isLoading: false, hasLoaded: true });
      return;
    }
    set({
      reviews: (data as unknown as DbReview[]).map(recordFromDb),
      isLoading: false,
      hasLoaded: true,
    });
  },

  getForTrack: (trackId) => get().reviews.filter((r) => r.trackId === trackId),

  hasReviewed: (bookingId) =>
    get().reviews.some((r) => r.bookingId === bookingId),

  add: async (input) => {
    if (get().hasReviewed(input.bookingId)) {
      return { success: false, error: "Ai lăsat deja o recenzie pentru această rezervare." };
    }
    const supabase = createClient();
    const { error } = await supabase.from("reviews").insert({
      track_id: input.trackId,
      booking_id: input.bookingId,
      rider_id: input.riderId,
      rating: input.rating,
      comment: input.comment.trim(),
    });
    if (error) {
      const msg = error.message.toLowerCase().includes("duplicate")
        ? "Ai lăsat deja o recenzie pentru această rezervare."
        : error.message;
      return { success: false, error: msg };
    }
    await Promise.all([get().fetchReviews(), useTracksStore.getState().fetchTracks()]);
    return { success: true };
  },
}));
