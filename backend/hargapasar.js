// --- backend/hargaPasar.js ---
const { supabase } = require('./supabase.js');

// 1. KONFIGURASI TABEL
// Pastikan nama tabel ini ada di Supabase Anda
const TABLE_NAME = 'market_prices';

/**
 * 2. FUNGSI AMBIL SEMUA HARGA (READ)
 * @returns {Array} List harga pasar terbaru
 */
async function ambilHargaPasar() {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .order('created_at', { ascending: false }); // Terbaru di atas

        if (error) {
            console.error("Gagal mengambil harga pasar:", error);
            throw error;
        }

        return data;

    } catch (error) {
        console.error("Error ambilHargaPasar:", error);
        return []; // Return array kosong agar frontend tidak error
    }
}

/**
 * 3. FUNGSI TAMBAH HARGA (CREATE - Admin Only)
 * @param {string} namaKomoditas - Contoh: Padi Cianjur
 * @param {number} currentPrice - Harga dalam angka (contoh: 6500)
 * @param {string} unit - Contoh: Kg, Ton
 * @returns {Object} Data harga yang baru ditambahkan
 */
async function tambahHargaPasar(namaKomoditas, currentPrice, unit) {
    try {
        // Validasi Input Sederhana
        if (!namaKomoditas || !currentPrice) {
            throw new Error("Nama Komoditas dan Harga wajib diisi.");
        }

        const newData = {
            nama_komoditas: namaKomoditas.toString(), // String
            current_price: parseFloat(currentPrice),    // Number
            unit: unit ? unit.toString() : 'Kg',        // String default Kg
            updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert([newData])
            .select(); // Mengambil data yang baru dimasukkan agar bisa direturn

        if (error) {
            console.error("Gagal menambahkan harga pasar:", error);
            throw error;
        }

        console.log("Harga pasar baru ditambahkan:", data[0]);
        return data[0];

    } catch (error) {
        console.error("Error tambahHargaPasar:", error);
        throw error;
    }
}

/**
 * 4. FUNGSI UPDATE HARGA (UPDATE - Admin Only)
 * @param {number} id - ID record harga
 * @param {number} newPrice - Harga baru
 * @returns {Object} Data harga yang sudah diupdate
 */
async function editHargaPasar(id, newPrice) {
    try {
        if (!id || !newPrice) {
            throw new Error("ID dan Harga Baru wajib diisi.");
        }

        const { data, error } = await supabase
            .from(TABLE_NAME)
            .update({ 
                current_price: parseFloat(newPrice),
                updated_at: new Date().toISOString() 
            })
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
 * 5. FUNGSI HAPUS HARGA (DELETE - Admin Only)
 * @param {number} id - ID record harga
 * @returns {Object} Status sukses
 */
async function hapusHargaPasar(id) {
    try {
        if (!id) {
            throw new Error("ID Harga wajib diisi.");
        }

        const { error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Gagal menghapus harga pasar:", error);
            throw error;
        }

        console.log("Harga pasar berhasil dihapus ID:", id);
        return { success: true, message: "Data harga berhasil dihapus." };

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
