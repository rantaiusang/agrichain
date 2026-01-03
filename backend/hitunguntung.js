// --- backend/hitungUntung.js ---
// Import fungsi dari file CRUD lain
const { ambilPanen } = require('./crudPanen');
const { ambilHargaPasar } = require('./hargaPasar');

/**
 * 1. FUNGSI HITUNG UNTUNG PER PRODUK (LABA RUGI)
 * Fungsi ini mencocokan data panen user dengan harga pasar saat ini.
 * 
 * @param {string} userId - ID User dari Supabase Auth
 * @returns {Array} - Array objek { id, nama_produk, jumlah, harga_satuan, total }
 */
async function hitungUntung(userId) {
    try {
        // 1. Ambil Data Panen User (Biaya Produksi/Jual)
        const panenData = await ambilPanen(userId);
        
        // Validasi: Jika user belum ada panen
        if (!panenData || panenData.length === 0) {
            return [];
        }

        // 2. Ambil Data Harga Pasar (Harga Referensi)
        const hargaPasars = await ambilHargaPasar();

        // Validasi: Jika tabel harga kosong
        if (!hargaPasars || hargaPasars.length === 0) {
            console.warn("Tabel market_prices kosong. Menggunakan harga 0.");
            return panenData.map(p => ({
                id: p.id,
                nama_produk: p.nama_komoditas,
                jumlah: p.quantity,
                harga_satuan: 0,
                total: 0
            }));
        }

        // 3. Proses Mapping Data (Join Manual)
        const hasil = panenData.map(p => {
            // Cari harga pasar yang cocok dengan nama komoditas panen
            // Menggunakan .toLowerCase() agar "PADI" cocok dengan "padi"
            const matchedHarga = hargaPasars.find(h => 
                h.nama_komoditas.toLowerCase() === p.nama_komoditas.toLowerCase()
            );

            // Gunakan harga pasar jika ada, jika tidak gunakan 0
            const hargaSatuan = matchedHarga ? matchedHarga.current_price : 0;
            
            // Hitung Total Estimasi Pendapatan
            const totalPendapatan = parseFloat(p.quantity) * parseFloat(hargaSatuan);

            return {
                id: p.id,
                nama_produk: p.nama_komoditas,
                jumlah: p.quantity,
                unit: p.unit,
                harga_satuan: hargaSatuan,
                total_pendapatan: totalPendapatan
            };
        });

        return hasil;

    } catch (error) {
        console.error("Gagal melakukan perhitungan Laba Rugi:", error);
        return []; // Return array kosong agar frontend tidak crash
    }
}

/**
 * 2. FUNGSI HITUNG TOTAL PENDAPATAN
 * Menjumlahkan total pendapatan dari semua item panen
 * 
 * @param {string} userId - ID User
 * @returns {number} - Total angka (integer)
 */
async function totalPendapatan(userId) {
    try {
        // Panggil fungsi hitung per produk
        const listLabaRugi = await hitungUntung(userId);

        // Sum array (reduce)
        const grandTotal = listLabaRugi.reduce((total, item) => {
            return total + (item.total_pendapatan || 0);
        }, 0);

        return grandTotal;

    } catch (error) {
        console.error("Gagal menghitung total pendapatan:", error);
        return 0;
    }
}

// EXPORT FUNGSI
module.exports = {
    hitungUntung,
    totalPendapatan
};
