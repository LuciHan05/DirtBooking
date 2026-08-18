import type {
  BookingRecord,
  FleetBikeRecord,
  GarageBikeRecord,
  LocalUserCredential,
  MessageRecord,
  Profile,
  ReviewRecord,
  TrackRecord,
} from "@/lib/db/schema";

const IMG = {
  forest:
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
  trail:
    "https://images.unsplash.com/photo-1622185131049-4755b415bb02?w=800&q=80",
  mx: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=800&q=80",
  mountains:
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
};

export const SEED_PROFILES: Profile[] = [
  {
    id: "host-1",
    email: "proprietar@dirtbooking.ro",
    name: "Andrei Mureșan",
    role: "host",
    dirtPoints: 0,
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "host-2",
    email: "buzau@dirtbooking.ro",
    name: "Buzău Dirt Trails",
    role: "host",
    dirtPoints: 0,
    createdAt: "2026-01-20T10:00:00Z",
  },
  {
    id: "rider-demo",
    email: "rider@exemplu.ro",
    name: "Alex Popescu",
    role: "rider",
    dirtPoints: 340,
    createdAt: "2026-02-01T10:00:00Z",
  },
];

/** Conturi demo pentru localhost — parola: demo1234 */
export const SEED_CREDENTIALS: LocalUserCredential[] = [
  {
    email: "rider@exemplu.ro",
    password: "demo1234",
    profile: SEED_PROFILES[2],
  },
  {
    email: "proprietar@dirtbooking.ro",
    password: "demo1234",
    profile: SEED_PROFILES[0],
  },
];

export const SEED_TRACKS: TrackRecord[] = [
  {
    id: "track-1",
    hostId: "host-1",
    hostName: "Enduro Transilvania",
    title: "Pista Enduro Iacobeni",
    description:
      "Traseu enduro de 15 km prin pădurile din nordul Moldovei, Suceava. Secțiuni tehnice, urcușuri abrupte și priveliști către Obcinele Bucovinei.",
    city: "Iacobeni",
    county: "Suceava",
    address: "DJ177, Iacobeni",
    lat: 47.5333,
    lng: 25.3167,
    pricePerSession: 220,
    difficulty: "advanced",
    images: [IMG.forest],
    amenities: ["Parcare", "Spălătorie moto", "Închiriere motoare"],
    soilCondition: "prime",
    featured: true,
    rating: 4.8,
    reviewCount: 64,
    availableSlots: {
      "2026-07-05": ["09:00", "11:00", "14:00"],
      "2026-07-06": ["10:00", "15:00"],
      "2026-07-12": ["09:00", "13:00"],
    },
    createdAt: "2026-03-01T10:00:00Z",
  },
  {
    id: "track-2",
    hostId: "host-1",
    hostName: "Enduro Transilvania",
    title: "Prolog Hard Enduro Sibiu",
    description:
      "Prolog tehnic în zona Munților Cibin. Bolovani, rădăcini și coborâri stâncoase — doar pentru rideri experimentați.",
    city: "Sibiu",
    county: "Sibiu",
    address: "Șoseaua Alba Iulia 88",
    lat: 45.7983,
    lng: 24.1253,
    pricePerSession: 300,
    difficulty: "pro",
    images: [IMG.trail],
    amenities: ["Parcare", "Ghid", "Punct medical"],
    soilCondition: "muddy",
    featured: true,
    rating: 4.9,
    reviewCount: 91,
    availableSlots: {
      "2026-07-05": ["08:00", "13:00"],
      "2026-07-08": ["09:00", "16:00"],
    },
    createdAt: "2026-03-05T10:00:00Z",
  },
  {
    id: "track-3",
    hostId: "host-2",
    hostName: "Buzău Dirt Trails",
    title: "Circuit Enduro Buzău",
    description:
      "18 km de single-track prin dealurile Buzăului. Unul dintre cele mai cunoscute trasee enduro din România.",
    city: "Buzău",
    county: "Buzău",
    address: "DJ203, km 4",
    lat: 45.1517,
    lng: 26.8175,
    pricePerSession: 200,
    difficulty: "intermediate",
    images: [IMG.mx],
    amenities: ["Parcare", "Camping", "Atelier reparații"],
    soilCondition: "dusty",
    featured: true,
    rating: 4.7,
    reviewCount: 178,
    availableSlots: {
      "2026-07-05": ["09:00", "12:00", "16:00"],
      "2026-07-07": ["10:00", "14:00"],
    },
    createdAt: "2026-03-10T10:00:00Z",
  },
  {
    id: "track-4",
    hostId: "host-1",
    hostName: "Enduro Transilvania",
    title: "Prologul Pădurii Brașov",
    description:
      "Prolog tehnic de 2,5 km prin pădurea de brad din Poiana Brașov. Ideal pentru enduro în inima Carpaților.",
    city: "Brașov",
    county: "Brașov",
    address: "Str. Poiana Sofiei 12",
    lat: 45.6427,
    lng: 25.5887,
    pricePerSession: 280,
    difficulty: "advanced",
    images: [IMG.forest],
    amenities: ["Parcare", "Dușuri", "Snack bar"],
    soilCondition: "prime",
    featured: true,
    rating: 4.9,
    reviewCount: 127,
    availableSlots: {
      "2026-07-05": ["10:00", "14:00"],
      "2026-07-09": ["09:00", "11:00"],
    },
    createdAt: "2026-03-12T10:00:00Z",
  },
  {
    id: "track-5",
    hostId: "host-2",
    hostName: "Buzău Dirt Trails",
    title: "Hard Enduro Maramureș",
    description:
      "Enduro extrem în Munții Maramureșului. Cobraji stâncoși și pâraie de munte — doar pentru experți.",
    city: "Baia Mare",
    county: "Maramureș",
    address: "DJ186, Borșa",
    lat: 47.6567,
    lng: 23.584,
    pricePerSession: 400,
    difficulty: "pro",
    images: [IMG.mountains],
    amenities: ["Parcare", "Ghid obligatoriu", "Punct medical"],
    soilCondition: "prime",
    featured: true,
    rating: 5.0,
    reviewCount: 42,
    availableSlots: {
      "2026-07-06": ["07:00"],
      "2026-07-10": ["06:00", "09:00"],
    },
    createdAt: "2026-03-15T10:00:00Z",
  },
  {
    id: "track-6",
    hostId: "host-2",
    hostName: "Buzău Dirt Trails",
    title: "Școala Enduro Cluj",
    description:
      "Facilitate de antrenament cu mini-loopuri enduro. Perfect pentru începători.",
    city: "Cluj-Napoca",
    county: "Cluj",
    address: "Str. Făgetului 45",
    lat: 46.7712,
    lng: 23.6236,
    pricePerSession: 150,
    difficulty: "beginner",
    images: [IMG.trail],
    amenities: ["Parcare", "Coaching", "Închiriere echipament"],
    soilCondition: "wet",
    featured: false,
    rating: 4.6,
    reviewCount: 56,
    availableSlots: {
      "2026-07-05": ["09:00", "14:00"],
      "2026-07-08": ["10:00"],
    },
    createdAt: "2026-03-18T10:00:00Z",
  },
];

export const SEED_BOOKINGS: BookingRecord[] = [
  {
    id: "book-1",
    trackId: "track-4",
    trackName: "Prologul Pădurii Brașov",
    riderId: "rider-demo",
    riderName: "Alex Popescu",
    slotDate: "2026-07-05",
    timeSlot: "10:00",
    status: "confirmed",
    waiverSigned: true,
    totalPrice: 280,
    createdAt: "2026-06-20T10:00:00Z",
  },
  {
    id: "book-2",
    trackId: "track-3",
    trackName: "Circuit Enduro Buzău",
    riderId: "rider-demo",
    riderName: "Alex Popescu",
    slotDate: "2026-07-12",
    timeSlot: "09:00",
    status: "pending",
    waiverSigned: false,
    totalPrice: 200,
    createdAt: "2026-06-22T10:00:00Z",
  },
];

export const SEED_MESSAGES: MessageRecord[] = [
  {
    id: "msg-1",
    trackId: "track-1",
    senderId: "rider-demo",
    receiverId: "host-1",
    content:
      "Salut! Aveți disponibil un KTM EXC 250 sau un Yamaha YZ125 pentru închiriere duminică?",
    read: true,
    createdAt: "2026-06-25T14:30:00Z",
  },
  {
    id: "msg-2",
    trackId: "track-1",
    senderId: "host-1",
    receiverId: "rider-demo",
    content:
      "Bună! Da, avem un KTM EXC 250 disponibil duminică. Yamaha YZ125 e în service până luni.",
    read: true,
    createdAt: "2026-06-25T15:10:00Z",
  },
];

export const SEED_GARAGE: GarageBikeRecord[] = [
  {
    id: "bike-1",
    userId: "rider-demo",
    make: "Yamaha",
    model: "YZ125",
    year: 2024,
    displacement: "125cc",
  },
  {
    id: "bike-2",
    userId: "rider-demo",
    make: "KTM",
    model: "EXC 250",
    year: 2023,
    displacement: "250cc",
  },
];

export const SEED_REVIEWS: ReviewRecord[] = [
  {
    id: "review-1",
    trackId: "track-1",
    bookingId: "book-1",
    riderId: "rider-demo",
    riderName: "Alex Popescu",
    rating: 5,
    comment:
      "Traseu superb, secțiunile tehnice sunt bine marcate. Recomand ghidul local pentru primul tur.",
    createdAt: "2026-06-10T18:00:00Z",
  },
  {
    id: "review-2",
    trackId: "track-3",
    bookingId: "book-2",
    riderId: "rider-demo",
    riderName: "Alex Popescu",
    rating: 4,
    comment:
      "Praf mult vara, dar traseul e variat și distractiv. Parcarea e generoasă.",
    createdAt: "2026-06-15T09:30:00Z",
  },
  {
    id: "review-3",
    trackId: "track-4",
    bookingId: "book-seed-3",
    riderId: "rider-demo",
    riderName: "Alex Popescu",
    rating: 5,
    comment:
      "Cel mai frumos prolog din zona Brașov. Dușurile la final sunt un plus mare.",
    createdAt: "2026-05-28T16:45:00Z",
  },
];

export const SEED_FLEET: FleetBikeRecord[] = [
  {
    id: "fleet-1",
    hostId: "host-1",
    make: "KTM",
    model: "EXC 250",
    year: 2024,
    status: "available",
    hourlyRate: 120,
  },
  {
    id: "fleet-2",
    hostId: "host-1",
    make: "Yamaha",
    model: "YZ125",
    year: 2023,
    status: "maintenance",
    hourlyRate: 100,
  },
  {
    id: "fleet-3",
    hostId: "host-2",
    make: "Honda",
    model: "CRF250R",
    year: 2022,
    status: "rented",
    hourlyRate: 150,
  },
];
