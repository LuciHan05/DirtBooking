import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ReviewRecord } from "@/lib/db/schema";
import { SEED_REVIEWS } from "@/lib/db/seed";
import { generateId } from "@/lib/db/mappers";
import { useTracksStore } from "@/stores/tracks-store";

interface CreateReviewInput {
  trackId: string;
  bookingId: string;
  riderId: string;
  riderName: string;
  rating: number;
  comment: string;
}

interface ReviewsState {
  reviews: ReviewRecord[];
  getForTrack: (trackId: string) => ReviewRecord[];
  hasReviewed: (bookingId: string) => boolean;
  add: (input: CreateReviewInput) => { success: boolean; error?: string };
}

export const useReviewsStore = create<ReviewsState>()(
  persist(
    (set, get) => ({
      reviews: SEED_REVIEWS,

      getForTrack: (trackId) =>
        get()
          .reviews.filter((r) => r.trackId === trackId)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ),

      hasReviewed: (bookingId) =>
        get().reviews.some((r) => r.bookingId === bookingId),

      add: (input) => {
        if (get().hasReviewed(input.bookingId)) {
          return { success: false, error: "Ai lăsat deja o recenzie pentru această rezervare." };
        }
        const review: ReviewRecord = {
          id: generateId("review"),
          trackId: input.trackId,
          bookingId: input.bookingId,
          riderId: input.riderId,
          riderName: input.riderName,
          rating: input.rating,
          comment: input.comment.trim(),
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ reviews: [review, ...s.reviews] }));
        useTracksStore.getState().applyReview(input.trackId, input.rating);
        return { success: true };
      },
    }),
    { name: "dirtbooking-reviews" }
  )
);
