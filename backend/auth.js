import { supa } from './supabase.js'

// REGISTER
export async function register(email, password) {
    const { error } = await supa.auth.signUp({ email, password })
    if (error) throw error
}

// LOGIN
export async function login(email, password) {
    const { error } = await supa.auth.signInWithPassword({ email, password })
    if (error) throw error
}

// GET CURRENT USER
export async function getUser() {
    const { data } = await supa.auth.getUser()
    return data.user
}
