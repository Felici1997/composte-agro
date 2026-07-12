-- Ajout colonne views (compteur de vues) sur listings, products, services
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Fonction pour incrémenter atomiquement les vues
CREATE OR REPLACE FUNCTION public.increment_views(tbl TEXT, row_id TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF tbl = 'listings' THEN
    UPDATE public.listings SET views = COALESCE(views, 0) + 1 WHERE id::text = row_id;
  ELSIF tbl = 'products' THEN
    UPDATE public.products SET views = COALESCE(views, 0) + 1 WHERE id::text = row_id;
  ELSIF tbl = 'services' THEN
    UPDATE public.services SET views = COALESCE(views, 0) + 1 WHERE id::text = row_id;
  END IF;
END;
$$;
