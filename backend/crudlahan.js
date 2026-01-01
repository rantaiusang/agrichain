import { supa } from './supabase.js'
import { getUser } from './auth.js'

// Tambah Lahan
export async function tambahLahan(nama, luas, lokasi, komoditas) {
    const user = await getUser()
    const { data, error } = await supa.from('lahan').insert([{
        user_id: user.id,
        nama_lahan: nama,
        luas: luas,
        lokasi: lokasi,
        komoditas: komoditas
    }])
    return { data, error }
}

// Ambil Lahan User
export async function listLahan() {
    const { data, error } = await supa.from('lahan').select('*')
    return { data, error }
}
