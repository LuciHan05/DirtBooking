-- DirtBooking — recenzii reale (Supabase), cu actualizare automată a
-- rating-ului mediu și a numărului de recenzii pe traseu.

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  rider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_track ON reviews(track_id);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recenzii vizibile tuturor" ON reviews FOR SELECT USING (true);
CREATE POLICY "Rider adaugă recenzie" ON reviews FOR INSERT WITH CHECK (auth.uid() = rider_id);

-- Trigger: actualizează rating-ul mediu + numărul de recenzii pe traseu
CREATE OR REPLACE FUNCTION handle_new_review()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.tracks
  SET review_count = review_count + 1,
      rating = ROUND((((rating * review_count) + NEW.rating) / (review_count + 1))::numeric, 1)
  WHERE id = NEW.track_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_review_created
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION handle_new_review();
