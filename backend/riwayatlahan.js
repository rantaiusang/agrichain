// --- backend/riwayatLahan.js ---
const { supabase } = require('./supabase.js');

// 1. KONFIGURASI TABEL
// Pastikan Anda sudah membuat tabel 'farmlands' dan 'farm_history' di Supabase
// Struktur tabel 'farm_history' yang diharapkan:
// { id, user_id, farmland_name, activity_type, note, created_at }

const TABLE_NAME = 'farm_history';

/**
 * 2. AMBIL RIWAYAT (READ)
 * Mengambil semua riwayat aktivitas lahan milik user.
 * @param {string} userId - UID dari Supabase Auth
 * @returns {Array} List riwayat
 */
async function ambilRiwayat(userId) {
    if (!userId) {
        throw new Error("User ID wajib disertakan.");
    }

    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('user_id', userId) // SECURITY: Filter hanya milik user ini
            .order('created_at', { ascending: false }); // Terbaru di atas

        if (error) {
            console.error("Gagal mengambil riwayat lahan:", error);
            throw error;
        }

        return data;

    } catch (err) {
        console.error("Error ambilRiwayat:", err);
        return [];
    }
}

/**
 * 3. TAMBAH RIWAYAT (CREATE)
 * Mencatat aktivitas baru (Tanam, Panen, Pupuk, dll) ke riwayat lahan.
 * @param {string} userId 
 * @param {string} namaLahan - Nama lahan (contoh: Sawah Bakti)
 * @param {string} aktivitas - Jenis aktivitas (Tanam, Panen, Pupuk, dll)
 * @param {string} catatan - Catatan tambahan
 * @returns {Object} Data riwayat yang baru dibuat
 */
async function tambahRiwayat(userId, namaLahan, aktivitas, catatan) {
    try {
        if (!userId || !namaLahan || !aktivitas) {
            throw new Error("User ID, Nama Lahan, dan Aktivitas wajib diisi.");
        }

        const newHistory = {
            user_id: userId,
            farmland_name: namaLahan,
            activity_type: aktivitas,
            note: catatan || '',
            created_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert([newHistory])
            .select(); // Mengambil data yang baru dimasukkan

        if (error) {
            console.error("Gagal menambahkan riwayat lahan:", error);
            throw error;
        }

        console.log("Riwayat lahan berhasil ditambahkan:", data[0]);
        return data[0];

    } catch (err) {
        console.error("Error tambahRiwayat:", err);
        throw err;
    }
}

/**
 * 4. HAPUS RIWAYAT (DELETE)
 * Menghapus catatan riwayat aktivitas.
 * @param {string} id - ID Record Riwayat
 * @param {string} userId - UID User (Security Check)
 * @returns {Object} Status berhasil/gagal
 */
async function hapusRiwayat(id, userId) {
    try {
        if (!id || !userId) {
            throw new Error("ID Riwayat dan User ID wajib disertakan.");
        }

        // SECURITY: Double Filter
        // Memastikan user hanya menghapus ID yang punya DAN milik user tersebut
        const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) {
            console.error("Gagal menghapus riwayat lahan:", error);
            throw error;
        }

        console.log("Riwayat lahan berhasil dihapus ID:", id);
        return { success: true, message: "Riwayat berhasil dihapus." };

    } catch (err) {
        console.error("Error hapusRiwayat:", err);
        throw err;
    }
}

// EXPORT FUNGSI
module.exports = {
    ambilRiwayat,
    tambahRiwayat,
    hapusRiwayat
};
