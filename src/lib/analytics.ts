import type { BookingRecord, TrackRecord } from "@/lib/db/schema";
import type { TrackDifficulty } from "@/types";

export interface WeekBucket {
  weekStart: string;
  label: string;
  revenue: number;
  bookings: number;
}

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Grupează rezervările pe ultimele `weeks` săptămâni (Luni-Duminică), încheind în săptămâna curentă. */
export function getWeeklyBuckets(
  bookings: BookingRecord[],
  weeks = 8,
  now: Date = new Date()
): WeekBucket[] {
  const currentWeekStart = startOfWeek(now);
  const buckets: WeekBucket[] = [];

  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = new Date(currentWeekStart);
    weekStart.setDate(weekStart.getDate() - i * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const inWeek = bookings.filter((b) => {
      const d = new Date(b.slotDate + "T12:00:00");
      return d >= weekStart && d < weekEnd && b.status !== "cancelled";
    });

    buckets.push({
      weekStart: weekStart.toISOString().slice(0, 10),
      label: weekStart.toLocaleDateString("ro-RO", {
        day: "numeric",
        month: "short",
      }),
      revenue: inWeek.reduce((sum, b) => sum + b.totalPrice, 0),
      bookings: inWeek.length,
    });
  }

  return buckets;
}

export interface DifficultyCount {
  difficulty: TrackDifficulty;
  count: number;
}

const DIFFICULTY_ORDER: TrackDifficulty[] = [
  "beginner",
  "intermediate",
  "advanced",
  "pro",
];

export function getDifficultyDistribution(
  tracks: TrackRecord[]
): DifficultyCount[] {
  return DIFFICULTY_ORDER.map((difficulty) => ({
    difficulty,
    count: tracks.filter((t) => t.difficulty === difficulty).length,
  }));
}

export function sumRevenue(bookings: BookingRecord[]): number {
  return bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + b.totalPrice, 0);
}
