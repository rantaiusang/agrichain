// --- backend/hargaPasar.js ---
const { supabase } = require('./supabase.js');

// Nama tabel harga pasar
const TABLE_NAME = 'agrichain_harga_pasar';

/**
 * 1️⃣ Ambil harga pasar semua produk
 */
async function ambilHargaPasar() {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .order('updated_at', { ascending: false }); // Terbaru di atas

        if (error) {
            console.error("Gagal mengambil harga pasar:", error);
            throw error;
        }

        return data; // Array harga pasar
    } catch (error) {
        console.error("Error ambilHargaPasar:", error);
        return [];
    }
}

/**
 * 2️⃣ Tambah harga pasar (opsional, admin)
 */
async function tambahHargaPasar(namaProduk, harga, satuan) {
    try {
        const newData = {
            nama_produk: namaProduk,
            harga: parseFloat(harga),
            satuan: satuan || 'kg',
            updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert([newData])
            .select();

        if (error) {
            console.error("Gagal menambahkan harga pasar:", error);
            throw error;
        }

        console.log("Harga pasar berhasil ditambahkan:", data[0]);
        return data[0];
    } catch (error) {
        console.error("Error tambahHargaPasar:", error);
        throw error;
    }
}

/**
 * 3️⃣ Update harga pasar (opsional, admin)
 */
async function editHargaPasar(id, harga) {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update({ harga: parseFloat(harga), updated_at: new Date().toISOString() })
            .eq('id', id)
            .select();

        if (error) {
            console.error("Gagal update harga pasar:", error);
            throw error;
        }

        console.log("Harga pasar berhasil diupdate:", data[0]);
        return data[0];
    } catch (error) {
        console.error("Error editHargaPasar:", error);
        throw error;
    }
}

/**
 * 4️⃣ Hapus harga pasar (opsional, admin)
 */
async function hapusHargaPasar(id) {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Gagal hapus harga pasar:", error);
            throw error;
        }

        console.log("Harga pasar berhasil dihapus ID:", id);
        return { success: true };
    } catch (error) {
        console.error("Error hapusHargaPasar:", error);
        throw error;
    }
}

// EXPORT SEMUA FUNGSI
module.exports = {
    ambilHargaPasar,
    tambahHargaPasar,
    editHargaPasar,
    hapusHargaPasar
};
