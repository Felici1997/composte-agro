-- Ajout des colonnes localisation pour la table services
ALTER TABLE services ADD COLUMN IF NOT EXISTS localite TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS departement TEXT;

-- Rendre les colonnes obligatoires pour les nouvelles entrées
UPDATE services SET localite = '' WHERE localite IS NULL;
UPDATE services SET departement = '' WHERE departement IS NULL;
ALTER TABLE services ALTER COLUMN localite SET NOT NULL;
ALTER TABLE services ALTER COLUMN departement SET NOT NULL;
