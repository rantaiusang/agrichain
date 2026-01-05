// pages/api/login.js
import { supabase } from '../../src/api/supabase.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email & password wajib' })
    }

    // Login menggunakan Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('Login API error:', error)
      return res.status(401).json({ error: error.message })
    }

    return res.status(200).json({
      message: 'Login berhasil',
      user: data.user,
      session: data.session
    })
  } catch (err) {
    console.error('Login API exception:', err)
    return res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
}
