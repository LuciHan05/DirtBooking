-- DirtBooking — patch permisiuni rezervări (rulează în SQL Editor, după schema.sql)

-- Riderul poate anula (doar anula) propriile rezervări
CREATE POLICY "Rider își anulează rezervările" ON bookings FOR UPDATE
  USING (auth.uid() = rider_id)
  WITH CHECK (auth.uid() = rider_id AND status = 'cancelled');

-- Rezervare atomică a unui slot — evită dublarea rezervărilor la request-uri simultane
CREATE OR REPLACE FUNCTION book_track_slot(
  p_track_id UUID,
  p_slot_date DATE,
  p_time_slot TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  updated_id UUID;
BEGIN
  UPDATE track_slots
  SET is_booked = true
  WHERE track_id = p_track_id
    AND slot_date = p_slot_date
    AND time_slot = p_time_slot
    AND is_booked = false
  RETURNING id INTO updated_id;

  RETURN updated_id IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION book_track_slot(UUID, DATE, TEXT) TO authenticated;
