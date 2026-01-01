// --- backend/dokumen.js ---
const { supabase } = require('./supabase.js');

// Nama Tabel Supabase
const TABLE_NAME = 'agrichain_dokumen';
const STORAGE_BUCKET = 'dokumen'; // pastikan sudah buat bucket di Supabase Storage

// 1️⃣ FUNGSI AMBIL DOKUMEN MILIK USER
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

        return data; // array dokumen
    } catch (error) {
        console.error("Error ambilDokumen:", error);
        return [];
    }
}

// 2️⃣ FUNGSI UPLOAD DOKUMEN
async function uploadDokumen(userId, file, kategori) {
    try {
        if (!file) throw new Error("File tidak ditemukan.");

        const fileName = ${Date.now()}_${file.name};
        const path = ${userId}/${fileName};

        // Upload ke Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from(STORAGE_BUCKET)
            .upload(path, file);

        if (uploadError) {
            console.error("Gagal upload file:", uploadError);
            throw uploadError;
        }

        // Ambil public URL
        const { data: publicData } = supabase
            .storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(path);

        // Simpan metadata di tabel
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .insert([{
                user_id: userId,
                nama_file: file.name,
                kategori: kategori || 'Umum',
                url_file: publicData.publicUrl,
                created_at: new Date().toISOString()
            }])
            .select();

        if (error) {
            console.error("Gagal simpan metadata dokumen:", error);
            throw error;
        }

        console.log("Dokumen berhasil diupload:", data[0]);
        return data[0];

    } catch (error) {
        console.error("Error uploadDokumen:", error);
        throw error;
    }
}

// 3️⃣ FUNGSI HAPUS DOKUMEN
async function hapusDokumen(id, userId, fileName) {
    try {
        // Hapus dari tabel
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) {
            console.error("Gagal hapus metadata dokumen:", error);
            throw error;
        }

        // Hapus file dari storage
        const path = ${userId}/${fileName};
        const { error: storageError } = await supabase
            .storage
            .from(STORAGE_BUCKET)
            .remove([path]);

        if (storageError) {
            console.error("Gagal hapus file storage:", storageError);
            throw storageError;
        }

        console.log("Dokumen berhasil dihapus ID:", id);
        return { success: true };

    } catch (error) {
        console.error("Error hapusDokumen:", error);
        throw error;
    }
}

// EXPORT SEMUA FUNGSI
module.exports = {
    ambilDokumen,
    uploadDokumen,
    hapusDokumen
};
