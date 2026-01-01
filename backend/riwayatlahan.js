// --- backend/riwayatLahan.js ---
const { supabase } = require('./supabase.js');

// Nama tabel riwayat lahan
const TABLE_NAME = 'agrichain_riwayat';

/**
 * 1️⃣ Ambil semua riwayat lahan untuk user tertentu
 * @param {string} userId - UID dari Supabase Auth
 * @returns {Array} - array riwayat {id, nama_lahan, aktivitas, tanggal, catatan}
 */
async function ambilRiwayat(userId) {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('user_id', userId)
            .order('tanggal', { ascending: false }); // terbaru di atas

        if (error) {
            console.error("Gagal mengambil riwayat lahan:", error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Error ambilRiwayat:", error);
        return [];
    }
}

/**
 * 2️⃣ Tambah riwayat aktivitas lahan
 * @param {string} userId - UID user
 * @param {string} namaLahan - Nama lahan
 * @param {string} aktivitas - Aktivitas (tanam, panen, pupuk, dll)
 * @param {string} catatan - Catatan tambahan
 */
async function tambahRiwayat(userId, namaLahan, aktivitas, catatan) {
    try {
        const newRiwayat = {
            user_id: userId,
            nama_lahan: namaLahan,
            aktivitas: aktivitas,
            catatan: catatan || '-',
            tanggal: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert([newRiwayat])
            .select();

        if (error) {
            console.error("Gagal menambahkan riwayat:", error);
            throw error;
        }

        console.log("Riwayat berhasil ditambahkan:", data[0]);
        return data[0];
    } catch (error) {
        console.error("Error tambahRiwayat:", error);
        throw error;
    }
}

/**
 * 3️⃣ Hapus riwayat
 * @param {string} id - ID riwayat
 * @param {string} userId - UID user
 */
async function hapusRiwayat(id, userId) {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) {
            console.error("Gagal hapus riwayat:", error);
            throw error;
        }

        console.log("Riwayat berhasil dihapus ID:", id);
        return { success: true };
    } catch (error) {
        console.error("Error hapusRiwayat:", error);
        throw error;
    }
}

// EXPORT SEMUA FUNGSI
module.exports = {
    ambilRiwayat,
    tambahRiwayat,
    hapusRiwayat
};
