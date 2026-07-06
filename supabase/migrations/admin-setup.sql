-- 1. Vue conversations avec profil client
CREATE OR REPLACE VIEW public.conversations_with_profile AS
SELECT
  c.*,
  p.nom_complet,
  p.email,
  p.telephone
FROM public.conversations c
LEFT JOIN public.profiles p ON p.id = c.client_id;

-- 2. Colonne status sur feedback
ALTER TABLE public.feedback
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'non_traite';

-- 3. Colonnes livraison sur orders
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS nom_complet TEXT,
ADD COLUMN IF NOT EXISTS telephone TEXT,
ADD COLUMN IF NOT EXISTS lieu_livraison TEXT;
