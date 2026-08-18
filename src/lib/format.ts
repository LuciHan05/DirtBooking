import type { SoilCondition, TrackDifficulty } from "@/types";

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
    minimumFractionDigits: 0,
  }).format(amount);
}

export const DIFFICULTY_LABELS: Record<TrackDifficulty, string> = {
  beginner: "Începător",
  intermediate: "Intermediar",
  advanced: "Avansat",
  pro: "Pro",
};

export const DIFFICULTY_COLORS: Record<TrackDifficulty, string> = {
  beginner: "bg-kawasaki/15 text-kawasaki border-kawasaki/30",
  intermediate: "bg-yamaha/15 text-yamaha border-yamaha/30",
  advanced: "bg-ktm/15 text-ktm border-ktm/30",
  pro: "bg-destructive/15 text-destructive border-destructive/30",
};

export const SOIL_LABELS: Record<SoilCondition, string> = {
  muddy: "Noroi",
  dusty: "Praf",
  prime: "Pământ ideal",
  wet: "Umed",
  frozen: "Înghețat",
};

export const SOIL_COLORS: Record<SoilCondition, string> = {
  muddy: "text-amber-600",
  dusty: "text-yellow-500",
  prime: "text-kawasaki",
  wet: "text-yamaha",
  frozen: "text-blue-400",
};

export const BOOKING_STATUS_LABELS: Record<
  "pending" | "confirmed" | "completed" | "cancelled",
  string
> = {
  pending: "În așteptare",
  confirmed: "Confirmată",
  completed: "Finalizată",
  cancelled: "Anulată",
};

export function formatDate(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("ro-RO", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function formatLocation(city: string, county: string): string {
  return `${city}, Județul ${county}`;
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("ro-RO", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
