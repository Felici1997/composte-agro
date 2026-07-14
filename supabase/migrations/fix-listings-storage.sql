-- ============================================================
-- Ajout des colonnes localisation à la table listings
-- ============================================================
ALTER TABLE listings ADD COLUMN IF NOT EXISTS localite TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS departement TEXT;

-- ============================================================
-- Correction RLS du bucket storage 'listing'
-- ============================================================

-- Suppression des anciennes policies
DROP POLICY IF EXISTS "Public SELECT listing" ON storage.objects;
DROP POLICY IF EXISTS "Auth INSERT listing" ON storage.objects;
DROP POLICY IF EXISTS "Auth UPDATE listing" ON storage.objects;
DROP POLICY IF EXISTS "Auth DELETE own listing" ON storage.objects;

-- Policy : lecture publique
CREATE POLICY "Public SELECT listing"
ON storage.objects FOR SELECT
USING (bucket_id = 'listing');

-- Policy : insertion pour utilisateurs authentifiés
CREATE POLICY "Auth INSERT listing"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'listing');

-- Policy : modification de ses propres fichiers
CREATE POLICY "Auth UPDATE listing"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'listing' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy : suppression de ses propres fichiers
CREATE POLICY "Auth DELETE own listing"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'listing' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================
-- Forcer RLS sur le bucket (au cas où)
-- ============================================================
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
