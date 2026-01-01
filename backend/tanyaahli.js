// --- backend/tanyaAhli.js ---
const { supabase } = require('./supabase.js');

// Nama tabel pertanyaan
const TABLE_NAME = 'agrichain_tanya_ahli';

/**
 * 1️⃣ Ambil semua pertanyaan user
 * @param {string} userId - UID user
 * @returns {Array} - array pertanyaan {id, pertanyaan, jawaban, kategori, tanggal}
 */
async function ambilPertanyaan(userId) {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('user_id', userId)
            .order('tanggal', { ascending: false }); // terbaru di atas

        if (error) {
            console.error("Gagal mengambil pertanyaan:", error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Error ambilPertanyaan:", error);
        return [];
    }
}

/**
 * 2️⃣ Tambah pertanyaan baru
 * @param {string} userId - UID user
 * @param {string} pertanyaan - Pertanyaan petani
 * @param {string} kategori - Kategori pertanyaan, misal: Tanaman, Pupuk, Hama
 * @param {string} jawaban - Jawaban dari ahli atau AI (opsional bisa kosong dulu)
 */
async function tambahPertanyaan(userId, pertanyaan, kategori, jawaban) {
    try {
        const newQuestion = {
            user_id: userId,
            pertanyaan: pertanyaan,
            kategori: kategori || 'Umum',
            jawaban: jawaban || '',
            tanggal: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert([newQuestion])
            .select();

        if (error) {
            console.error("Gagal menambahkan pertanyaan:", error);
            throw error;
        }

        console.log("Pertanyaan berhasil ditambahkan:", data[0]);
        return data[0];
    } catch (error) {
        console.error("Error tambahPertanyaan:", error);
        throw error;
    }
}

/**
 * 3️⃣ Update jawaban pertanyaan (oleh admin/ahli)
 * @param {string} id - ID pertanyaan
 * @param {string} jawaban - Jawaban dari ahli
 */
async function updateJawaban(id, jawaban) {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update({ jawaban: jawaban, tanggal: new Date().toISOString() })
            .eq('id', id)
            .select();

        if (error) {
            console.error("Gagal update jawaban:", error);
            throw error;
        }

        console.log("Jawaban berhasil diupdate:", data[0]);
        return data[0];
    } catch (error) {
        console.error("Error updateJawaban:", error);
        throw error;
    }
}

/**
 * 4️⃣ Hapus pertanyaan (oleh user sendiri)
 * @param {string} id - ID pertanyaan
 * @param {string} userId - UID user
 */
async function hapusPertanyaan(id, userId) {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) {
            console.error("Gagal hapus pertanyaan:", error);
            throw error;
        }

        console.log("Pertanyaan berhasil dihapus ID:", id);
        return { success: true };
    } catch (error) {
        console.error("Error hapusPertanyaan:", error);
        throw error;
    }
}

// EXPORT SEMUA FUNGSI
module.exports = {
    ambilPertanyaan,
    tambahPertanyaan,
    updateJawaban,
    hapusPertanyaan
};
