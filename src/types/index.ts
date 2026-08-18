export type SoilCondition = "muddy" | "dusty" | "prime" | "wet" | "frozen";

export type UserRole = "rider" | "host";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  dirtPoints?: number;
}

export type TrackDifficulty = "beginner" | "intermediate" | "advanced" | "pro";

export interface Track {
  id: string;
  name: string;
  description: string;
  hostId: string;
  hostName: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    county: string;
    country: "RO";
  };
  difficulty: TrackDifficulty;
  pricePerSession: number;
  images: string[];
  rating: number;
  reviewCount: number;
  featured?: boolean;
  amenities: string[];
  soilCondition: SoilCondition;
  weather: {
    temp: number;
    condition: string;
    windSpeed: number;
  };
  availableSlots: Record<string, string[]>;
}

export interface Booking {
  id: string;
  trackId: string;
  trackName: string;
  riderId: string;
  date: string;
  timeSlot: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  waiverSigned: boolean;
  totalPrice: number;
}

export interface GarageBike {
  id: string;
  make: string;
  model: string;
  year: number;
  displacement: string;
}

export interface FleetBike {
  id: string;
  make: string;
  model: string;
  year: number;
  status: "available" | "rented" | "maintenance";
  hourlyRate: number;
}
