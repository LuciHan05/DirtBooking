-- DirtBooking — flotă de motociclete de închiriat (per proprietar)

CREATE TYPE fleet_bike_status AS ENUM ('available', 'rented', 'maintenance');

CREATE TABLE fleet_bikes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  status fleet_bike_status NOT NULL DEFAULT 'available',
  hourly_rate INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fleet_bikes_host ON fleet_bikes(host_id);

ALTER TABLE fleet_bikes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Flotă vizibilă tuturor" ON fleet_bikes FOR SELECT USING (true);
CREATE POLICY "Host adaugă moto în flotă" ON fleet_bikes FOR INSERT WITH CHECK (
  auth.uid() = host_id AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'host')
);
CREATE POLICY "Host își editează flota" ON fleet_bikes FOR UPDATE USING (auth.uid() = host_id);
CREATE POLICY "Host își șterge flota" ON fleet_bikes FOR DELETE USING (auth.uid() = host_id);
