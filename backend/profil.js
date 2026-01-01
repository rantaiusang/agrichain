// --- backend/profil.js ---
const { supabase } = require('./supabase.js');

// Nama tabel profil
const TABLE_NAME = 'agrichain_profiles';

/**
 * 1️⃣ Ambil data profil user
 * @param {string} userId - UID dari Supabase Auth
 */
async function ambilProfil(userId) {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('user_id', userId)
            .single(); // Ambil satu data saja

        if (error) {
            console.error("Gagal mengambil profil:", error);
            throw error;
        }

        return data; // objek profil
    } catch (error) {
        console.error("Error ambilProfil:", error);
        return null;
    }
}

/**
 * 2️⃣ Update data profil user
 * @param {string} userId - UID dari Supabase Auth
 * @param {object} dataUpdate - Objek data yang ingin diupdate, misal {nama, alamat, kontak, foto}
 */
async function updateProfil(userId, dataUpdate) {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update(dataUpdate)
            .eq('user_id', userId)
            .select();

        if (error) {
            console.error("Gagal update profil:", error);
            throw error;
        }

        console.log("Profil berhasil diperbarui:", data[0]);
        return data[0];
    } catch (error) {
        console.error("Error updateProfil:", error);
        throw error;
    }
}

/**
 * 3️⃣ Tambah profil baru (opsional, biasanya saat register)
 */
async function tambahProfil(userId, nama, alamat, kontak, fotoUrl) {
    try {
        const newProfil = {
            user_id: userId,
            nama: nama || '-',
            alamat: alamat || '-',
            kontak: kontak || '-',
            foto: fotoUrl || '',
            created_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert([newProfil])
            .select();

        if (error) {
            console.error("Gagal menambahkan profil:", error);
            throw error;
        }

        console.log("Profil baru berhasil dibuat:", data[0]);
        return data[0];
    } catch (error) {
        console.error("Error tambahProfil:", error);
        throw error;
    }
}

// EXPORT SEMUA FUNGSI
module.exports = {
    ambilProfil,
    updateProfil,
    tambahProfil
};
