ALTER TABLE products ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
ALTER TABLE services ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- Backfill: populate images from image_url for existing rows
UPDATE products SET images = CASE WHEN image_url IS NOT NULL AND image_url != '' THEN jsonb_build_array(image_url) ELSE '[]'::jsonb END WHERE images IS NULL OR images = '[]'::jsonb;
UPDATE listings SET images = CASE WHEN image_url IS NOT NULL AND image_url != '' THEN jsonb_build_array(image_url) ELSE '[]'::jsonb END WHERE images IS NULL OR images = '[]'::jsonb;
