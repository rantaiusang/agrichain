// --- backend/crudPanen.js ---
import { supa } from './supabase.js'

const TABLE_NAME = 'panen'

// Ambil semua panen milik user
export async function ambilPanen(userId) {
  const { data, error } = await supa
    .from(TABLE_NAME)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// Tambah panen baru
export async function tambahPanen(userId, lahanId, komoditas, jumlah) {
  const { data, error } = await supa
    .from(TABLE_NAME)
    .insert([{ user_id: userId, lahan_id: lahanId, komoditas, jumlah_kg: parseInt(jumlah), created_at: new Date().toISOString() }])
    .select()
    
  if (error) throw error
  return data[0]
}

// Edit panen
export async function editPanen(id, komoditas, jumlah, lahanId) {
  const { data, error } = await supa
    .from(TABLE_NAME)
    .update({ komoditas, jumlah_kg: parseInt(jumlah), lahan_id: lahanId })
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

// Hapus panen
export async function hapusPanen(id) {
  const { data, error } = await supa.from(TABLE_NAME).delete().eq('id', id)
  if (error) throw error
  return { success: true }
}
