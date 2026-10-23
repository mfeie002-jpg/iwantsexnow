// Softgen integration, reconciled to initialize only when browser auth is used.
// Server draft storage uses its own per-request verified-user adapter.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

let browserClient: SupabaseClient<Database> | undefined;

export function getSupabaseClient(): SupabaseClient<Database> {
  if (typeof window === 'undefined') throw new Error('BROWSER_AUTH_ONLY');
  if (browserClient) return browserClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publicKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !publicKey) throw new Error('SUPABASE_CONFIG_MISSING');
  browserClient = createClient<Database>(url, publicKey);
  return browserClient;
}
