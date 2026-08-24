"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { Star, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/stores/auth-store";
import { useBookingsStore } from "@/stores/bookings-store";
import { useReviewsStore } from "@/stores/reviews-store";
import { formatDate } from "@/lib/format";

interface TrackReviewsProps {
  trackId: string;
}

function StarRating({
  value,
  onChange,
  readOnly = false,
  size = "size-5",
}: {
  value: number;
  onChange?: (v: number) => void;
  readOnly?: boolean;
  size?: string;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(star)}
          className={readOnly ? "cursor-default" : "cursor-pointer"}
          aria-label={`${star} stele`}
        >
          <Star
            className={`${size} ${
              star <= value ? "fill-dirt text-dirt" : "text-muted-foreground/40"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export function TrackReviews({ trackId }: TrackReviewsProps) {
  const user = useAuthStore((s) => s.user);
  const bookingRecords = useBookingsStore((s) => s.bookings);
  const bookingsHasLoaded = useBookingsStore((s) => s.hasLoaded);
  const fetchBookings = useBookingsStore((s) => s.fetchBookings);
  useEffect(() => {
    if (user && !bookingsHasLoaded) fetchBookings();
  }, [user, bookingsHasLoaded, fetchBookings]);
  const allReviews = useReviewsStore((s) => s.reviews);
  const reviews = useMemo(
    () =>
      allReviews
        .filter((r) => r.trackId === trackId)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
    [allReviews, trackId]
  );
  const hasReviewed = useReviewsStore((s) => s.hasReviewed);
  const addReview = useReviewsStore((s) => s.add);
  const [pending, startTransition] = useTransition();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const eligibleBooking = useMemo(() => {
    if (!user) return undefined;
    return bookingRecords.find(
      (b) =>
        b.trackId === trackId &&
        b.riderId === user.id &&
        (b.status === "confirmed" || b.status === "completed") &&
        !hasReviewed(b.id)
    );
  }, [bookingRecords, trackId, user, hasReviewed, reviews.length]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !eligibleBooking) return;
    setError("");
    startTransition(async () => {
      const result = await addReview({
        trackId,
        bookingId: eligibleBooking.id,
        riderId: user.id,
        rating,
        comment,
      });
      if (result.error) {
        setError(result.error);
      } else {
        setSubmitted(true);
      }
    });
  }

  return (
    <GlassCard className="p-6">
      <h2 className="mb-4 font-heading text-lg font-semibold">
        Recenzii ({reviews.length})
      </h2>

      {eligibleBooking && !submitted && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 space-y-3 rounded-xl border border-white/10 bg-white/[3%] p-4"
        >
          <p className="text-sm font-medium">
            Lasă o recenzie pentru sesiunea din{" "}
            {formatDate(eligibleBooking.slotDate)}
          </p>
          <StarRating value={rating} onChange={setRating} />
          <Textarea
            placeholder="Cum a fost traseul? Condiții, dificultate, facilități..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            required
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" size="sm" disabled={pending} className="glow-ktm">
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Se trimite...
              </>
            ) : (
              "Trimite recenzia"
            )}
          </Button>
        </form>
      )}

      {submitted && (
        <p className="mb-6 rounded-xl border border-kawasaki/30 bg-kawasaki/5 p-4 text-sm text-kawasaki">
          Mulțumim pentru recenzie!
        </p>
      )}

      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Niciun rider nu a lăsat încă o recenzie pentru acest traseu.
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-white/5 pb-4 last:border-0 last:pb-0"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{review.riderName}</p>
                <StarRating value={review.rating} readOnly size="size-3.5" />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatDate(review.createdAt.slice(0, 10))}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
