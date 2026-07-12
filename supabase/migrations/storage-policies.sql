-- ============================================================
-- Configuration du bucket 'listing' pour les images d'annonces
-- ============================================================

-- Création du bucket s'il n'existe pas
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES ('listing', 'listing', true, false, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Suppression des anciennes policies (pour reset)
DROP POLICY IF EXISTS "Public SELECT listing" ON storage.objects;
DROP POLICY IF EXISTS "Auth INSERT listing" ON storage.objects;
DROP POLICY IF EXISTS "Auth UPDATE listing" ON storage.objects;
DROP POLICY IF EXISTS "Auth DELETE own listing" ON storage.objects;

-- Policy : tout le monde peut lire les images
CREATE POLICY "Public SELECT listing"
ON storage.objects FOR SELECT
USING (bucket_id = 'listing');

-- Policy : utilisateurs authentifiés peuvent uploader
CREATE POLICY "Auth INSERT listing"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'listing');

-- Policy : utilisateurs authentifiés peuvent modifier leurs fichiers
CREATE POLICY "Auth UPDATE listing"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'listing' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy : utilisateurs peuvent supprimer leurs propres fichiers
CREATE POLICY "Auth DELETE own listing"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'listing' AND auth.uid()::text = (storage.foldername(name))[1]);
