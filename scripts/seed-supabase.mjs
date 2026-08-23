// Populează proiectul Supabase cu conturile demo + traseele + rezervările
// folosite deja în platformă. Rulare: npm run seed
// Necesită NEXT_PUBLIC_SUPABASE_URL și NEXT_PUBLIC_SUPABASE_ANON_KEY în .env.local

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  const content = readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match) process.env[match[1]] = match[2].trim();
  }
}
loadEnvLocal();

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !KEY) {
  console.error("Lipsesc NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY din .env.local");
  process.exit(1);
}
if (!SERVICE_KEY) {
  console.error("Lipsește SUPABASE_SERVICE_ROLE_KEY din .env.local (necesar pentru crearea conturilor demo prin admin API)");
  process.exit(1);
}

const adminClient = createClient(URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const IMG = {
  forest: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
  trail: "https://images.unsplash.com/photo-1622185131049-4755b415bb02?w=800&q=80",
  mx: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=800&q=80",
  mountains: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
};

const HOSTS = [
  { key: "host-1", email: "proprietar@dirtbooking.ro", password: "demo1234", name: "Andrei Mureșan" },
  { key: "host-2", email: "buzau@dirtbooking.ro", password: "demo1234", name: "Buzău Dirt Trails" },
];

const RIDER = {
  key: "rider-demo",
  email: "rider@exemplu.ro",
  password: "demo1234",
  name: "Alex Popescu",
  dirtPoints: 340,
};

const TRACKS = [
  {
    hostKey: "host-1",
    title: "Pista Enduro Iacobeni",
    description: "Traseu enduro de 15 km prin pădurile din nordul Moldovei, Suceava. Secțiuni tehnice, urcușuri abrupte și priveliști către Obcinele Bucovinei.",
    city: "Iacobeni", county: "Suceava", address: "DJ177, Iacobeni",
    lat: 47.5333, lng: 25.3167, price_per_session: 220, difficulty: "advanced",
    images: [IMG.forest], amenities: ["Parcare", "Spălătorie moto", "Închiriere motoare"],
    soil_condition: "prime", featured: true, rating: 4.8, review_count: 64,
    slots: { "2026-09-05": ["09:00", "11:00", "14:00"], "2026-09-06": ["10:00", "15:00"], "2026-09-12": ["09:00", "13:00"] },
  },
  {
    hostKey: "host-1",
    title: "Prolog Hard Enduro Sibiu",
    description: "Prolog tehnic în zona Munților Cibin. Bolovani, rădăcini și coborâri stâncoase — doar pentru rideri experimentați.",
    city: "Sibiu", county: "Sibiu", address: "Șoseaua Alba Iulia 88",
    lat: 45.7983, lng: 24.1253, price_per_session: 300, difficulty: "pro",
    images: [IMG.trail], amenities: ["Parcare", "Ghid", "Punct medical"],
    soil_condition: "muddy", featured: true, rating: 4.9, review_count: 91,
    slots: { "2026-09-05": ["08:00", "13:00"], "2026-09-08": ["09:00", "16:00"] },
  },
  {
    hostKey: "host-2",
    title: "Circuit Enduro Buzău",
    description: "18 km de single-track prin dealurile Buzăului. Unul dintre cele mai cunoscute trasee enduro din România.",
    city: "Buzău", county: "Buzău", address: "DJ203, km 4",
    lat: 45.1517, lng: 26.8175, price_per_session: 200, difficulty: "intermediate",
    images: [IMG.mx], amenities: ["Parcare", "Camping", "Atelier reparații"],
    soil_condition: "dusty", featured: true, rating: 4.7, review_count: 178,
    slots: { "2026-09-05": ["09:00", "12:00", "16:00"], "2026-09-07": ["10:00", "14:00"] },
  },
  {
    hostKey: "host-1",
    title: "Prologul Pădurii Brașov",
    description: "Prolog tehnic de 2,5 km prin pădurea de brad din Poiana Brașov. Ideal pentru enduro în inima Carpaților.",
    city: "Brașov", county: "Brașov", address: "Str. Poiana Sofiei 12",
    lat: 45.6427, lng: 25.5887, price_per_session: 280, difficulty: "advanced",
    images: [IMG.forest], amenities: ["Parcare", "Dușuri", "Snack bar"],
    soil_condition: "prime", featured: true, rating: 4.9, review_count: 127,
    slots: { "2026-09-05": ["10:00", "14:00"], "2026-09-09": ["09:00", "11:00"] },
  },
  {
    hostKey: "host-2",
    title: "Hard Enduro Maramureș",
    description: "Enduro extrem în Munții Maramureșului. Coborâri stâncoase și pâraie de munte — doar pentru experți.",
    city: "Baia Mare", county: "Maramureș", address: "DJ186, Borșa",
    lat: 47.6567, lng: 23.584, price_per_session: 400, difficulty: "pro",
    images: [IMG.mountains], amenities: ["Parcare", "Ghid obligatoriu", "Punct medical"],
    soil_condition: "prime", featured: true, rating: 5.0, review_count: 42,
    slots: { "2026-09-06": ["07:00"], "2026-09-10": ["06:00", "09:00"] },
  },
  {
    hostKey: "host-2",
    title: "Școala Enduro Cluj",
    description: "Facilitate de antrenament cu mini-loopuri enduro. Perfect pentru începători.",
    city: "Cluj-Napoca", county: "Cluj", address: "Str. Făgetului 45",
    lat: 46.7712, lng: 23.6236, price_per_session: 150, difficulty: "beginner",
    images: [IMG.trail], amenities: ["Parcare", "Coaching", "Închiriere echipament"],
    soil_condition: "wet", featured: false, rating: 4.6, review_count: 56,
    slots: { "2026-09-05": ["09:00", "14:00"], "2026-09-08": ["10:00"] },
  },
];

// [trackIndex, slotDate, timeSlot, status, waiverSigned]
const BOOKINGS = [
  { trackIndex: 3, slotDate: "2026-09-05", timeSlot: "10:00", status: "confirmed", waiverSigned: true },
  { trackIndex: 2, slotDate: "2026-09-12", timeSlot: "09:00", status: "pending", waiverSigned: false },
];

async function findExistingUserId(email) {
  // listUsers nu suportă filtrare după email direct în această versiune a SDK-ului,
  // așa că paginăm (suficient pentru un set mic de conturi demo).
  let page = 1;
  while (true) {
    const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const found = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (found) return found.id;
    if (data.users.length < 200) return null;
    page += 1;
  }
}

async function signUpOrSignIn(email, password, name, role) {
  let userId = await findExistingUserId(email);
  let created = false;

  if (!userId) {
    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role },
    });
    if (error) throw new Error(`Nu am putut crea contul ${email}: ${error.message}`);
    userId = data.user.id;
    created = true;
  }

  const supabase = createClient(URL, KEY, { auth: { persistSession: false } });
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (signInError || !signInData.session) {
    throw new Error(`Nu m-am putut autentifica ca ${email}: ${signInError?.message}`);
  }
  return { supabase, userId, created };
}

async function main() {
  console.log("Seed DirtBooking → Supabase\n");

  const hostSessions = {};
  for (const host of HOSTS) {
    const { supabase, userId, created } = await signUpOrSignIn(
      host.email,
      host.password,
      host.name,
      "host"
    );
    hostSessions[host.key] = { supabase, userId };
    console.log(`${created ? "Creat" : "Existent"}: ${host.name} <${host.email}> (${userId})`);
  }

  const riderSession = await signUpOrSignIn(RIDER.email, RIDER.password, RIDER.name, "rider");
  console.log(`${riderSession.created ? "Creat" : "Existent"}: ${RIDER.name} <${RIDER.email}> (${riderSession.userId})`);

  if (riderSession.created) {
    await riderSession.supabase
      .from("profiles")
      .update({ dirt_points: RIDER.dirtPoints })
      .eq("id", riderSession.userId);
  }

  console.log("\nVerific trasee existente...");
  const { data: existingTracks } = await hostSessions["host-1"].supabase
    .from("tracks")
    .select("id, title");

  const existingTitles = new Set((existingTracks ?? []).map((t) => t.title));
  const insertedTrackIds = [];

  for (const track of TRACKS) {
    if (existingTitles.has(track.title)) {
      console.log(`Sărit (există deja): ${track.title}`);
      const { data } = await hostSessions[track.hostKey].supabase
        .from("tracks")
        .select("id")
        .eq("title", track.title)
        .single();
      insertedTrackIds.push(data?.id);
      continue;
    }

    const { supabase, userId } = hostSessions[track.hostKey];
    const { slots, hostKey, ...trackFields } = track;
    const { data, error } = await supabase
      .from("tracks")
      .insert({ ...trackFields, host_id: userId })
      .select()
      .single();

    if (error || !data) {
      console.error(`Eroare la ${track.title}:`, error?.message);
      insertedTrackIds.push(null);
      continue;
    }

    const slotRows = Object.entries(slots).flatMap(([date, times]) =>
      times.map((time) => ({ track_id: data.id, slot_date: date, time_slot: time }))
    );
    await supabase.from("track_slots").insert(slotRows);

    console.log(`Creat: ${track.title}`);
    insertedTrackIds.push(data.id);
  }

  console.log("\nCreez rezervările demo...");
  const { data: existingBookings } = await riderSession.supabase
    .from("bookings")
    .select("id, track_id, slot_date");

  for (const booking of BOOKINGS) {
    const trackId = insertedTrackIds[booking.trackIndex];
    if (!trackId) continue;

    const alreadyExists = (existingBookings ?? []).some(
      (b) => b.track_id === trackId && b.slot_date === booking.slotDate
    );
    if (alreadyExists) {
      console.log(`Sărit (există deja): rezervare ${booking.slotDate}`);
      continue;
    }

    const { error } = await riderSession.supabase.from("bookings").insert({
      track_id: trackId,
      rider_id: riderSession.userId,
      slot_date: booking.slotDate,
      time_slot: booking.timeSlot,
      status: booking.status,
      waiver_signed: booking.waiverSigned,
      total_price: TRACKS[booking.trackIndex].price_per_session,
    });

    if (error) console.error("Eroare rezervare:", error.message);
    else console.log(`Creată rezervare pentru ${booking.slotDate}`);
  }

  console.log("\nGata! Conturi demo (parolă: demo1234):");
  console.log(`  Rider:      ${RIDER.email}`);
  for (const h of HOSTS) console.log(`  Proprietar: ${h.email}`);
}

main().catch((err) => {
  console.error("\nEroare seed:", err);
  process.exit(1);
});
