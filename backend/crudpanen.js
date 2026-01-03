// --- backend/crudPanen.js ---
import { supa } from './supabase.js';

const TABLE_NAME = 'panen';

/**
 * 1. AMBIL SEMUA PANEN (READ)
 * Hanya mengambil data panen milik user yang sedang login (Security Filter)
 * @param {string} userId - ID User dari Supabase Auth
 * @returns {Array} List data panen
 */
export async function ambilPanen(userId) {
    if (!userId) {
        throw new Error("User ID wajib disertakan untuk mengambil data.");
    }

    const { data, error } = await supa
        .from(TABLE_NAME)
        .select('*')
        .eq('user_id', userId) // SECURITY: Filter hanya milik user ini
        .order('created_at', { ascending: false }); // Terbaru di atas

    if (error) {
        console.error("Gagal mengambil data panen:", error);
        throw error;
    }

    return data;
}

/**
 * 2. TAMBAH PANEN BARU (CREATE)
 * @param {string} userId 
 * @param {string} namaKomoditas - Contoh: Padi Cianjur
 * @param {number} quantity - Berat dalam kg
 * @param {string} unit - Contoh: Kg, Ton
 * @param {string} kualitas - Contoh: standar, premium, minus
 * @returns {Object} Data panen yang baru dibuat
 */
export async function tambahPanen(userId, namaKomoditas, quantity, unit, kualitas) {
    try {
        // Hitung Estimasi Harga (Logic Sederhana)
        // Di sistem nyata, ini mungkin mengambil dari tabel 'market_prices'
        // Untuk demo, kita set harga dasar standar dulu
        let hargaPerUnit = 5000; 
        if (kualitas === 'premium') hargaPerUnit = 6500;
        if (kualitas === 'minus') hargaPerUnit = 4000;

        const estimatedTotal = quantity * hargaPerUnit;

        const { data, error } = await supa
            .from(TABLE_NAME)
            .insert([{
                user_id: userId,
                nama_komoditas: namaKomoditas,
                quantity: parseFloat(quantity),
                unit: unit || 'Kg',
                kualitas: kualitas || 'standar',
                harga_per_unit: hargaPerUnit,
                estimated_total: parseFloat(estimatedTotal),
                status: 'pending', // Default status: Menunggu
                created_at: new Date().toISOString()
            }])
            .select() // Ambil data yang baru dimasukkan

        if (error) throw error;

        return data[0];

    } catch (err) {
        console.error("Gagal menambah panen:", err);
        throw err;
    }
}

/**
 * 3. EDIT PANEN (UPDATE)
 * @param {string} id - ID Record Panen
 * @param {string} namaKomoditas 
 * @param {number} quantity
 * @param {string} kualitas
 * @returns {Object} Data panen yang sudah diupdate
 */
export async function editPanen(id, namaKomoditas, quantity, kualitas) {
    try {
        // Hitung ulang estimasi total berdasarkan update
        let hargaPerUnit = 5000;
        if (kualitas === 'premium') hargaPerUnit = 6500;
        if (kualitas === 'minus') hargaPerUnit = 4000;
        
        const estimatedTotal = quantity * hargaPerUnit;

        const { data, error } = await supa
            .from(TABLE_NAME)
            .update({
                nama_komoditas: namaKomoditas,
                quantity: parseFloat(quantity),
                kualitas: kualitas,
                harga_per_unit: hargaPerUnit,
                estimated_total: parseFloat(estimatedTotal)
            })
            .eq('id', id) // Keamanan: Pastikan hanya mengupdate ID yang spesifik
            .select()

        if (error) throw error;

        return data[0];

    } catch (err) {
        console.error("Gagal edit panen:", err);
        throw err;
    }
}

/**
 * 4. HAPUS PANEN (DELETE)
 * @param {string} id - ID Record Panen
 * @returns {Object} Status berhasil/gagal
 */
export async function hapusPanen(id) {
    try {
        const { error } = await supa
            .from(TABLE_NAME)
            .delete()
            .eq('id', id);

        if (error) throw error;

        return { success: true, message: "Data panen berhasil dihapus." };

    } catch (err) {
        console.error("Gagal hapus panen:", err);
        throw err;
    }
}
