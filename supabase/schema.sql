-- DirtBooking — schema Supabase (rulează în SQL Editor)

-- Enum-uri
CREATE TYPE user_role AS ENUM ('rider', 'host');
CREATE TYPE track_difficulty AS ENUM ('beginner', 'intermediate', 'advanced', 'pro');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE soil_condition AS ENUM ('muddy', 'dusty', 'prime', 'wet', 'frozen');

-- Profiluri (extinde auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'rider',
  avatar_url TEXT,
  dirt_points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trasee
CREATE TABLE tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  city TEXT NOT NULL,
  county TEXT NOT NULL,
  address TEXT NOT NULL DEFAULT '',
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  price_per_session INTEGER NOT NULL,
  difficulty track_difficulty NOT NULL DEFAULT 'intermediate',
  images TEXT[] NOT NULL DEFAULT '{}',
  amenities TEXT[] NOT NULL DEFAULT '{}',
  soil_condition soil_condition NOT NULL DEFAULT 'prime',
  featured BOOLEAN NOT NULL DEFAULT false,
  rating NUMERIC(2,1) NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sloturi disponibile (dată + ore)
CREATE TABLE track_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  slot_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  is_booked BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(track_id, slot_date, time_slot)
);

-- Rezervări
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  rider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  slot_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  waiver_signed BOOLEAN NOT NULL DEFAULT false,
  signature_data TEXT,
  total_price INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mesaje (chat rider ↔ host)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID REFERENCES tracks(id) ON DELETE SET NULL,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexuri
CREATE INDEX idx_tracks_host ON tracks(host_id);
CREATE INDEX idx_tracks_county ON tracks(county);
CREATE INDEX idx_tracks_city ON tracks(city);
CREATE INDEX idx_bookings_rider ON bookings(rider_id);
CREATE INDEX idx_bookings_track ON bookings(track_id);
CREATE INDEX idx_messages_participants ON messages(sender_id, receiver_id);
CREATE INDEX idx_track_slots_track_date ON track_slots(track_id, slot_date);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE track_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiluri: citire publică, scriere proprie
CREATE POLICY "Profiluri vizibile tuturor" ON profiles FOR SELECT USING (true);
CREATE POLICY "Utilizator își actualizează profilul" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Utilizator își creează profilul" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Trasee: citire publică, CRUD doar host
CREATE POLICY "Trasee vizibile tuturor" ON tracks FOR SELECT USING (true);
CREATE POLICY "Host adaugă trasee" ON tracks FOR INSERT WITH CHECK (
  auth.uid() = host_id AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'host')
);
CREATE POLICY "Host editează traseele sale" ON tracks FOR UPDATE USING (auth.uid() = host_id);
CREATE POLICY "Host șterge traseele sale" ON tracks FOR DELETE USING (auth.uid() = host_id);

-- Sloturi
CREATE POLICY "Sloturi vizibile tuturor" ON track_slots FOR SELECT USING (true);
CREATE POLICY "Host gestionează sloturi" ON track_slots FOR ALL USING (
  EXISTS (SELECT 1 FROM tracks WHERE tracks.id = track_id AND tracks.host_id = auth.uid())
);

-- Rezervări
CREATE POLICY "Rider vede rezervările sale" ON bookings FOR SELECT USING (
  auth.uid() = rider_id OR EXISTS (SELECT 1 FROM tracks WHERE tracks.id = track_id AND tracks.host_id = auth.uid())
);
CREATE POLICY "Rider creează rezervări" ON bookings FOR INSERT WITH CHECK (auth.uid() = rider_id);
CREATE POLICY "Host actualizează rezervări pe traseele sale" ON bookings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM tracks WHERE tracks.id = track_id AND tracks.host_id = auth.uid())
);

-- Mesaje
CREATE POLICY "Participanții văd mesajele" ON messages FOR SELECT USING (
  auth.uid() = sender_id OR auth.uid() = receiver_id
);
CREATE POLICY "Utilizator trimite mesaje" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Trigger: profil la înregistrare
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'rider')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Storage bucket pentru imagini trasee (creează și din Dashboard: tracks-images, public)
-- Politici storage se configurează în Supabase Dashboard
