-- Renommer seller_id → client_id dans la table listings
ALTER TABLE public.listings RENAME COLUMN seller_id TO client_id;
