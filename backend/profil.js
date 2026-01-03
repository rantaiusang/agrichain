// --- backend/profil.js ---
const { supabase } = require('./supabase.js');

// 1. KONFIGURASI TABEL
const TABLE_NAME = 'profiles';

/**
 * 2. FUNGSI AMBIL PROFIL (READ)
 * Mengambil data profil user berdasarkan ID Auth
 * @param {string} userId - ID dari Supabase Auth (email hash / UID)
 * @returns {Object} Data user (full_name, phone_number, avatar_url, dll)
 */
async function ambilProfil(userId) {
    try {
        if (!userId) {
            throw new Error("User ID wajib disertakan.");
        }

        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('id', userId) // Join ID profile dengan ID Auth
            .single();

        if (error) {
            console.error("Gagal mengambil profil:", error);
            throw error;
        }

        return data;

    } catch (err) {
        console.error("Error ambilProfil:", err);
        return null; // Return null agar frontend mudah handle (cek if profile)
    }
}

/**
 * 3. FUNGSI UPDATE PROFIL (UPDATE)
 * Mengedit data nama, alamat, kontak, foto, dll
 * @param {string} userId - ID dari Supabase Auth
 * @param {object} dataUpdate - Objek data baru { full_name, phone_number, avatar_url, ... }
 * @returns {Object} Data profil yang sudah diupdate
 */
async function updateProfil(userId, dataUpdate) {
    try {
        // Filter kolom yang boleh di-update (jangan update ID atau Created At)
        const allowedUpdates = ['full_name', 'phone_number', 'avatar_url', 'address', 'wallet_address'];
        const finalData = {};

        for (const key in dataUpdate) {
            if (allowedUpdates.includes(key)) {
                finalData[key] = dataUpdate[key];
            }
        }

        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update(finalData)
            .eq('id', userId)
            .select(); // Ambil data terbaru

        if (error) {
            console.error("Gagal update profil:", error);
            throw error;
        }

        return data[0];

    } catch (err) {
        console.error("Error updateProfil:", err);
        throw err;
    }
}

// EXPORT FUNGSI
module.exports = {
    ambilProfil,
    updateProfil
};
