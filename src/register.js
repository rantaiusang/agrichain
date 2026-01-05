// pages/api/register.js
import { supabase } from '../../src/api/supabase.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password, fullName, role } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email & password wajib' })
    }

    // Register user dengan Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || '',
          role: role || 'PETANI'
        }
      }
    })

    if (error) throw error

    // Insert ke tabel users (jika perlu, optional)
    if (data.user) {
      const { error: insertError } = await supabase
        .from('users')
        .insert([{
          id: data.user.id,
          email: email,
          full_name: fullName || '',
          role: role || 'PETANI',
          created_at: new Date().toISOString()
        }])

      if (insertError) console.error('Gagal insert ke tabel users:', insertError.message)
    }

    return res.status(200).json({ message: 'Register berhasil', user: data.user })

  } catch (err) {
    console.error('Register API error:', err)
    return res.status(400).json({ error: err.message })
  }
}
