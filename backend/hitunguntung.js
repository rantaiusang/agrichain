// --- backend/hitungUntung.js ---
const { ambilPanen } = require('./crudPanen.js');
const { ambilHargaPasar } = require('./hargaPasar.js');

/**
 * 1️⃣ Hitung untung/rugi per produk panen user
 * @param {string} userId - UID user
 * @returns {Array} - array objek {nama_produk, jumlah_kg, harga_satuan, total_harga}
 */
async function hitungUntung(userId) {
    try {
        // Ambil data panen user
        const panen = await ambilPanen(userId);
        if (!panen || panen.length === 0) return [];

        // Ambil harga pasar
        const hargaPasar = await ambilHargaPasar();

        // Hitung total per produk
        const hasil = panen.map(p => {
            // Cari harga pasar produk
            const harga = hargaPasar.find(h => h.nama_produk.toLowerCase() === p.nama_produk.toLowerCase());
            const hargaSatuan = harga ? parseFloat(harga.harga) : 0;
            const totalHarga = hargaSatuan * p.jumlah_kg;

            return {
                id: p.id,
                nama_produk: p.nama_produk,
                jumlah_kg: p.jumlah_kg,
                harga_satuan: hargaSatuan,
                total_harga: totalHarga
            };
        });

        return hasil;

    } catch (error) {
        console.error("Error hitungUntung:", error);
        return [];
    }
}

/**
 * 2️⃣ Hitung total keuntungan seluruh panen
 * @param {string} userId - UID user
 * @returns {number} - total keuntungan
 */
async function totalUntung(userId) {
    try {
        const perProduk = await hitungUntung(userId);
        const total = perProduk.reduce((sum, item) => sum + item.total_harga, 0);
        return total;
    } catch (error) {
        console.error("Error totalUntung:", error);
        return 0;
    }
}

// EXPORT
module.exports = {
    hitungUntung,
    totalUntung
};
