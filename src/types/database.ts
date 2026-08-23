import type { TrackDifficulty, SoilCondition, UserRole } from "@/types";

export interface DbProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url: string | null;
  dirt_points: number;
  created_at: string;
}

export interface DbTrack {
  id: string;
  host_id: string;
  title: string;
  description: string;
  city: string;
  county: string;
  address: string;
  lat: number | null;
  lng: number | null;
  price_per_session: number;
  difficulty: TrackDifficulty;
  images: string[];
  amenities: string[];
  soil_condition: SoilCondition;
  featured: boolean;
  rating: number;
  review_count: number;
  created_at: string;
  profiles?: { name: string } | null;
}

export interface DbTrackSlot {
  id: string;
  track_id: string;
  slot_date: string;
  time_slot: string;
  is_booked: boolean;
}

export interface DbBooking {
  id: string;
  track_id: string;
  rider_id: string;
  slot_date: string;
  time_slot: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  waiver_signed: boolean;
  signature_data: string | null;
  total_price: number;
  created_at: string;
  tracks?: { title: string } | null;
  profiles?: { name: string } | null;
}

export interface DbFleetBike {
  id: string;
  host_id: string;
  make: string;
  model: string;
  year: number;
  status: "available" | "rented" | "maintenance";
  hourly_rate: number;
  image_url: string | null;
  created_at: string;
}

export interface DbMessage {
  id: string;
  track_id: string | null;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender?: { name: string } | null;
  receiver?: { name: string } | null;
}
