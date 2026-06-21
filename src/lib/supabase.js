import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://eacmzeutargytddclrqo.supabase.co',
  'sb_publishable_5sxNy4gPOEkozKDx9mutGA_jYiI1LrR'
);

export async function getUserId() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id ?? null;
}
