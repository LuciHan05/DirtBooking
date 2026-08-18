import type { UserRole } from "@/types";

export const APP_NAME = "DirtBooking";
export const APP_TAGLINE = "Caută. Rezervă. Condu.";
export const APP_COUNTRY = "România";
export const APP_COUNTRY_CODE = "RO";

export const NAV_LINKS = {
  public: [
    { href: "/tracks", label: "Explorează Trasee" },
    { href: "/map", label: "Hartă" },
    { href: "/how-it-works", label: "Cum funcționează" },
    { href: "/pricing", label: "Pentru Proprietari" },
  ],
  rider: [
    { href: "/dashboard", label: "Panou" },
    { href: "/dashboard/bookings", label: "Rezervările mele" },
    { href: "/dashboard/garage", label: "Garaj Digital" },
    { href: "/dashboard/messages", label: "Mesaje" },
  ],
  host: [
    { href: "/dashboard", label: "Prezentare generală" },
    { href: "/dashboard/listings", label: "Traseele mele" },
    { href: "/dashboard/listings/new", label: "Adaugă Traseu" },
    { href: "/dashboard/bookings", label: "Rezervări" },
    { href: "/dashboard/fleet", label: "Flotă" },
    { href: "/dashboard/analytics", label: "Statistici" },
    { href: "/dashboard/messages", label: "Mesaje" },
  ],
} as const;

export const ROLE_LABELS: Record<UserRole, string> = {
  rider: "Rider",
  host: "Proprietar",
};

export const AMENITY_OPTIONS = [
  "Parcare",
  "Dușuri",
  "Spălătorie moto",
  "Închiriere motoare",
  "Camping",
  "Ghid",
  "Punct medical",
  "Snack bar",
  "Atelier reparații",
  "Coaching",
] as const;

export const POPULAR_LOCATIONS = [
  "Brașov",
  "Cluj-Napoca",
  "Buzău",
  "Sibiu",
  "Suceava",
  "Constanța",
];

export const BOOKING_TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
] as const;
