-- DirtBooking — storage pentru imagini trasee
-- ÎNAINTE de a rula acest SQL: creează bucket-ul din Dashboard → Storage →
-- New bucket → nume "track-images" → Public bucket = ON.

CREATE POLICY "Imagini trasee vizibile tuturor" ON storage.objects FOR SELECT
  USING (bucket_id = 'track-images');

CREATE POLICY "Utilizatori autentificați încarcă imagini" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'track-images' AND auth.role() = 'authenticated');

CREATE POLICY "Utilizatori își șterg propriile imagini" ON storage.objects FOR DELETE
  USING (bucket_id = 'track-images' AND owner_id = auth.uid()::text);
