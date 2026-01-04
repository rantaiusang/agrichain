const { createClient } = supabase;

export const supabaseClient = createClient(
  window.appConfig.supabaseUrl,
  window.appConfig.supabaseKey
);
