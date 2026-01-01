// --- backend/crudPanen.js ---
const { supabase } = require('./supabase.js');
// Jika error, pastikan file supabase.js sudah dibuat sesuai instruksi sebelumnya

// Nama Tabel di Supabase
const TABLE_NAME = 'agrichain_panen';

// 1. FUNGSI AMBIL DATA PANEN
async function ambilPanen(userId) {
    try {
        // Query: Ambil semua panen milik user yang sedang login
        // Filter: user_id (UUID) dari tabel agrichain_panen
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false }); // Terbaru di atas

        if (error) {
            console.error("Gagal mengambil data panen:", error);
            throw error;
        }

        return data; // Return array produk
    } catch (error) {
        console.error("Error ambilPanen:", error);
        return []; // Return kosong agar frontend tidak crash
    }
}

// 2. FUNGSI TAMBAH PANEN BARU
async function tambahPanen(userId, nama, jumlah, kategori, catatan) {
    try {
        const newPanen = {
            user_id: userId,
            nama_produk: nama,
            jumlah_kg: parseInt(jumlah),
            kategori: kategori || 'Umum',
            catatan: catatan || '-',
            created_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert([newPanen])
            .select();

        if (error) {
            console.error("Gagal tambah panen:", error);
            throw new Error("Gagal menambahkan data panen.");
        }

        console.log("Panen baru berhasil:", data[0]);
        return data[0]; // Return data yang baru dibuat
    } catch (error) {
        console.error("Error tambahPanen:", error);
        throw error;
    }
}

// 3. FUNGSI EDIT PANEN
async function editPanen(id, nama, jumlah, kategori, catatan) {
    try {
        // Data yang mau di-update
        const updatedData = {
            nama_produk: nama,
            jumlah_kg: parseInt(jumlah),
            kategori: kategori || 'Umum',
            catatan: catatan || '-'
        };

        // Proses Update
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update(updatedData)
            .eq('id', id) // Filter berdasarkan ID Panen
            .select();

        if (error) {
            console.error("Gagal edit panen:", error);
            throw new Error("Gagal memperbarui data panen.");
        }

        console.log("Panen berhasil diupdate:", data[0]);
        return data[0];
    } catch (error) {
        console.error("Error editPanen:", error);
        throw error;
    }
}

// 4. FUNGSI HAPUS PANEN
async function hapusPanen(id) {
    try {
        // Proses Delete
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', id); // Filter berdasarkan ID Panen

        if (error) {
            console.error("Gagal hapus panen:", error);
            throw new Error("Gagal menghapus data panen.");
        }

        console.log("Panen berhasil dihapus ID:", id);
        return { success: true };
    } catch (error) {
        console.error("Error hapusPanen:", error);
        throw error;
    }
}

// EXPORT SEMUA FUNGSI AGAR BISA DIPANGGIL
module.exports = {
    ambilPanen,
    tambahPanen,
    editPanen,
    hapusPanen
};
