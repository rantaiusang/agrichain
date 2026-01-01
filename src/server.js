// --- API REQUEST RESET PASSWORD ---

// 1. API: User Request Reset (Lupa Password)
app.post('/api/request-reset', async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({ success: false, message: "Nomor HP wajib diisi." });
    }

    try {
        // Cek apakah nomor HP ada di database
        const { data: user, error } = await supabase
            .from('agrichain_users')
            .select('*')
            .eq('phone_number', phone)
            .single();

        if (error || !user) {
            // TIPS KEAMANAN: Jangan beritahu user bahwa nomor HP TIDAK ada.
            // Bilang saja "Pesan terkirim" agar hacker tidak menebak akun.
            // Tapi untuk demo, kita bilang "Nomor HP tidak ditemukan".
            return res.status(404).json({ success: false, message: "Nomor HP tidak ditemukan di sistem." });
        }

        // 2. Generate Token Unik (Berlaku 1 Jam)
        const resetToken = Math.random().toString(36).substr(2, 8).toUpperCase();
        
        // 3. Simpan Token ke tabel user (Opsional, lebih aman)
        // Pastikan tabel `agrichain_users` ada kolom `reset_token` (text).
        await supabase
            .from('agrichain_users')
            .update({ reset_token: resetToken })
            .eq('id', user.id);

        // 4. Buat Link Reset (URL Reset Password)
        const resetLink = `http://localhost:5500/frontend/src/reset-password.html?token=${resetToken}`;
        
        // 5. Format Pesan WhatsApp
        const waMessage = `Halo ${user.full_name},\n\nAnda meminta reset kata sandi.\nToken Anda: *${resetToken}*\n\nAtau klik link ini:\n${resetLink}`;

        // 6. Simpan Link/Token ke Array Sementara (Untuk Bot API WA - Simulasi)
        // Di produksi nyata, Anda akan mengirim pesan ini ke WhatsApp API Bot.
        // Untuk demo saat ini, kita print ke console backend.
        console.log("--- PESAN WHATSAPP ---");
        console.log("Target:", phone);
        console.log("Pesan:", waMessage);
        console.log("Link Reset:", resetLink);
        
        res.status(200).json({ 
            success: true, 
            message: "Pesan instruksi reset telah dikirim ke WhatsApp Anda." 
        });

    } catch (err) {
        console.error("Error request reset:", err);
        res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
    }
});

// 2. API: Reset Password (Saat klik link token di email/wa)
app.post('/api/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ success: false, message: "Token dan Password baru wajib diisi." });
    }

    try {
        // Cari user berdasarkan Token Reset
        const { data: user, error } = await supabase
            .from('agrichain_users')
            .select('*')
            .eq('reset_token', token) // Cari yang token-nya sama
            .single();

        if (error || !user) {
            return res.status(400).json({ success: false, message: "Token Reset tidak valid atau sudah kadaluarsa." });
        }

        // Update Password Baru
        const { error: updateError } = await supabase
            .from('agrichain_users')
            .update({ password: newPassword, reset_token: null }) // Kosongkan token setelah dipakai
            .eq('id', user.id);

        if (updateError) throw updateError;

        res.status(200).json({ success: true, message: "Password berhasil diubah! Silakan login." });

    } catch (err) {
        console.error("Error reset password:", err);
        res.status(500).json({ success: false, message: "Gagal mereset password." });
    }
});
