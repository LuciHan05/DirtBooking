/**
 * Schema de date DirtBooking — contract pentru store local și viitor Supabase.
 * Păstrează aceste forme la migrarea către backend live.
 */

export type { User, UserRole, Track, Booking, TrackDifficulty, SoilCondition } from "@/types";

export interface Profile {
  id: string;
  email: string;
  name: string;
  role: "rider" | "host";
  avatarUrl?: string;
  dirtPoints: number;
  createdAt: string;
}

export interface TrackRecord {
  id: string;
  hostId: string;
  hostName: string;
  title: string;
  description: string;
  city: string;
  county: string;
  address: string;
  lat: number;
  lng: number;
  pricePerSession: number;
  difficulty: "beginner" | "intermediate" | "advanced" | "pro";
  images: string[];
  amenities: string[];
  soilCondition: "muddy" | "dusty" | "prime" | "wet" | "frozen";
  featured: boolean;
  rating: number;
  reviewCount: number;
  availableSlots: Record<string, string[]>;
  createdAt: string;
}

export interface TrackSlot {
  trackId: string;
  slotDate: string;
  timeSlot: string;
  isBooked: boolean;
}

export interface BookingRecord {
  id: string;
  trackId: string;
  trackName: string;
  riderId: string;
  riderName: string;
  slotDate: string;
  timeSlot: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  waiverSigned: boolean;
  signatureData?: string;
  totalPrice: number;
  createdAt: string;
}

export interface MessageRecord {
  id: string;
  trackId: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface LocalUserCredential {
  email: string;
  password: string;
  profile: Profile;
}

export interface GarageBikeRecord {
  id: string;
  userId: string;
  make: string;
  model: string;
  year: number;
  displacement: string;
}

export interface FleetBikeRecord {
  id: string;
  hostId: string;
  make: string;
  model: string;
  year: number;
  status: "available" | "rented" | "maintenance";
  hourlyRate: number;
}

export interface ReviewRecord {
  id: string;
  trackId: string;
  bookingId: string;
  riderId: string;
  riderName: string;
  rating: number;
  comment: string;
  createdAt: string;
}
