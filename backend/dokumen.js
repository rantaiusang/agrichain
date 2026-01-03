// --- backend/dokumen.js ---
const { supabase } = require('./supabase.js');

// 1. CONFIG TABLE & STORAGE
// PASTIKAN: Bucket ini sudah dibuat di Supabase Storage
const STORAGE_BUCKET = 'farmer-docs'; 
const TABLE_NAME = 'farmer_documents'; // Atau 'user_documents'

/**
 * 2. AMBIL DOKUMEN MILIK USER (READ)
 * @param {string} userId - ID dari Supabase Auth
 * @returns {Array} List dokumen
 */
async function ambilDokumen(userId) {
    try {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Gagal mengambil dokumen:", error);
            throw error;
        }

        return data;

    } catch (err) {
        console.error("Error ambilDokumen:", err);
        throw err;
    }
}

/**
 * 3. UPLOAD DOKUMEN (CREATE)
 * @param {string} userId 
 * @param {Object} file - File object dari input form HTML
 * @param {string} kategori - Kategori dokumen (Sertifikat, Pupuk, dll)
 * @returns {Object} Data dokumen yang baru
 */
async function uploadDokumen(userId, file, kategori) {
    try {
        if (!file || !userId) {
            throw new Error("File dan User ID wajib disertakan.");
        }

        // A. Generate Nama File Unik (User/Timestamp/OriginalName)
        // Mengganti spasi dengan underscore agar URL aman
        const safeName = file.name.replace(/\s+/g, '_');
        const fileName = `${userId}/${Date.now()}_${safeName}`;
        const filePath = `${userId}/${fileName}`; // Path folder user

        // B. Upload File ke Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from(STORAGE_BUCKET)
            .upload(filePath, file);

        if (uploadError) {
            console.error("Gagal upload storage:", uploadError);
            throw uploadError;
        }

        // C. Dapatkan Public URL (Agar bisa dibuka/dili user)
        const { data: { publicUrl } } = supabase
            .storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(filePath);

        // D. Simpan Metadata ke Tabel Database
        const { data, error: insertError } = await supabase
            .from(TABLE_NAME)
            .insert([{
                user_id: userId,
                nama_file: file.name,
                path_file: filePath,
                kategori: kategori || 'Umum',
                url_file: publicUrl,
                ukuran_file: file.size,
                mime_type: file.type,
                created_at: new Date().toISOString()
            }])
            .select(); // Ambil data yang baru dimasukkan (fresh data)

        if (insertError) {
            // Rollback: Jika database gagal, sebaiknya file dihapus juga
            await supabase.storage.from(STORAGE_BUCKET).remove([filePath]);
            console.error("Gagal simpan metadata (Database):", insertError);
            throw insertError;
        }

        console.log("Dokumen berhasil diupload:", data[0]);
        return data[0];

    } catch (err) {
        console.error("Error uploadDokumen:", err);
        throw err;
    }
}

/**
 * 4. HAPUS DOKUMEN (DELETE)
 * @param {string} id - ID Record Database
 * @param {string} userId - ID User (Security Check)
 * @param {string} filePath - Path file di storage (untuk hapus fisik)
 * @returns {Object} Status berhasil/gagal
 */
async function hapusDokumen(id, userId, filePath) {
    try {
        // Validasi ID
        if (!id || !userId) {
            throw new Error("ID Dokumen dan User ID wajib disertakan.");
        }

        // A. Hapus Metadata dari Tabel
        // SECURITY: Pastikan hanya menghapus milik user sendiri
        const { error: dbError } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (dbError) {
            console.error("Gagal hapus metadata database:", dbError);
            throw dbError;
        }

        // B. Hapus File Fisik dari Supabase Storage
        if (filePath) {
            const { error: storageError } = await supabase
                .storage
                .from(STORAGE_BUCKET)
                .remove([filePath]);

            if (storageError) {
                console.error("Gagal hapus file storage:", storageError);
                // Kita lanjutkan proses seolah berhasil karena DB sudah terhapus
                // Tapi log error ini penting untuk debugging
            } else {
                console.log("File fisik berhasil dihapus:", filePath);
            }
        }

        return { success: true, message: "Dokumen berhasil dihapus." };

    } catch (err) {
        console.error("Error hapusDokumen:", err);
        throw err;
    }
}

// EXPORT FUNGSI
module.exports = {
    ambilDokumen,
    uploadDokumen,
    hapusDokumen
};
