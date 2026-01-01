// --- src/api.js ---
import { createClient } from 'https://unpkg.com/@supabase/supabase-js@2'

const SUPABASE_URL = 'https://nkcctncsjmcfsiguowms.supabase.co'
const SUPABASE_KEY = 'sb_publishable_CY2GLPbRJRDcRAyPXzOD4Q_63uR5W9X'  // Publishable Key

export const supa = createClient(SUPABASE_URL, SUPABASE_KEY)

// Ambil data panen (frontend langsung ke supabase)
export async function getProducts() {
    try {
        const { data, error } = await supa
            .from('agrichain_panen')
            .select('*')
            .order('created_at', { ascending: false })
        if (error) throw error
        // Return array dengan properti standar
        return data.map(p => ({
            name: p.nama_produk,
            price: p.jumlah_kg,
            img: p.img || 'https://via.placeholder.com/200'
        }))
    } catch(e) {
        console.error("Gagal ambil produk:", e)
        return []
    }
}
