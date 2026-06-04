import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { environment } from '../../environments/environment';

let client: SupabaseClient;

export function getSupabase(): SupabaseClient {
  if (!client) {
    client = createClient(
      environment.supabaseUrl,
      environment.supabasePublishableKey,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
        },
      }
    );
  }

  return client;
}
