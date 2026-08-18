-- Date inițiale pentru testare (rulează DUPĂ ce ai cel puțin un user host în profiles)
-- Înlocuiește HOST_UUID cu id-ul real al unui utilizator host din auth.users

-- Exemplu (decomentează și adaptează):
/*
INSERT INTO tracks (host_id, title, description, city, county, address, price_per_session, difficulty, images, amenities, soil_condition, featured, rating, review_count)
VALUES
  (
    'HOST_UUID',
    'Pista Enduro Iacobeni',
    'Traseu enduro de 15 km prin pădurile din nordul Moldovei. Secțiuni tehnice, urcușuri abrupte și priveliști către Obcinele Bucovinei.',
    'Iacobeni',
    'Suceava',
    'DJ177, Iacobeni',
    220,
    'advanced',
    ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80'],
    ARRAY['Parcare', 'Spălătorie moto', 'Închiriere motoare'],
    'prime',
    true,
    4.8,
    64
  ),
  (
    'HOST_UUID',
    'Prolog Hard Enduro Sibiu',
    'Prolog tehnic în zona Munților Cibin. Bolovani, rădăcini și coborâri stâncoase — doar pentru rideri experimentați.',
    'Sibiu',
    'Sibiu',
    'Șoseaua Alba Iulia 88',
    300,
    'pro',
    ARRAY['https://images.unsplash.com/photo-1622185131049-4755b415bb02?w=800&q=80'],
    ARRAY['Parcare', 'Ghid', 'Punct medical'],
    'muddy',
    true,
    4.9,
    91
  );
*/
