import { supabase } from "./supabase.js"

export async function getMe() {
  const { data } = await supabase.auth.getUser()
  return data?.user
}
