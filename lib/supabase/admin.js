/**
 * Client Supabase avec service_role (bypass RLS).
 *
 * ATTENTION — CONTRAINTES DE SÉCURITÉ :
 * - Ce fichier utilise le service_role de Supabase qui contourne TOUTES les RLS.
 * - Il NE DOIT JAMAIS être importé dans un composant 'use client'.
 * - Il est réservé aux Server Components (app/admin/*), Route Handlers
 *   et Server Actions uniquement.
 * - Ne jamais exposer ce client côté navigateur pour éviter les fuites de clé.
 */

import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

function createAdminClient() {
  if (!url || !serviceKey) {
    throw new Error(
      'Supabase admin client non configuré. ' +
      'Ajoutez SUPABASE_SERVICE_ROLE_KEY dans .env.local'
    )
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

let adminClient = null
export function getAdminClient() {
  if (!adminClient) adminClient = createAdminClient()
  return adminClient
}
