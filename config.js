// public/config.js (ATAU src/config.js)
// Aman di-upload ke GitHub

window.appConfig = {
    supabaseUrl: null,
    supabaseKey: null,
    isLoading: true
};

fetch('/api/config')
    .then(async response => {
        // CEK 1: Pastikan status OK (200)
        if (!response.ok) {
            // Ambil text error untuk dilihat di console
            const errorText = await response.text();
            throw new Error(`Server Error (${response.status}): ${errorText}`);
        }
        
        // CEK 2: Pastikan tipenya JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            throw new Error(`Server tidak mengembalikan JSON. Isi: ${text.substring(0, 100)}...`);
        }

        return response.json();
    })
    .then(data => {
        window.appConfig.supabaseUrl = data.supabaseUrl;
        window.appConfig.supabaseKey = data.supabaseKey;
        window.appConfig.isLoading = false;
        console.log("✅ Config berhasil dimuat:", data.supabaseUrl);
    })
    .catch(err => {
        console.error("❌ Gagal ambil config:", err.message);
        window.appConfig.isLoading = false;
        
        // ❌ JANGAN LUPA HAPUS BAGIAN INI SAAT PRODUCTION NANTI ❌
        // Fallback Hardcoded (Darurat agar web jalan sekarang)
        if (window.appConfig.supabaseKey === null) {
            console.warn("🔧 Menggunakan Fallback Config (Hardcoded) untuk Debugging...");
            window.appConfig.supabaseUrl = "https://nkcctncsjmcfsiguowms.supabase.co";
            window.appConfig.supabaseKey = "sb_publishable_CY2GLPbRJRDcRAyPXzOD4Q_63uR5W9X";
        }
    });
