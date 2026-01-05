import { supabase } from "./supabase.js"

export async function register(email, password) {
  return await supabase.auth.signUp({ email, password })
}

export async function login(email, password) {
  return await supabase.auth.signInWithPassword({ email, password })
}
