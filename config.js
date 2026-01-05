// public/config.js (ATAU src/config.js)
// Aman di-upload ke GitHub

window.appConfig = {
    supabaseUrl: null,
    supabaseKey: null,
    isLoading: true,
    error: null,
    source: 'init' // 'init', 'server', 'fallback'
};

console.log("[Config JS] Memulai pengambilan konfigurasi...");

fetch('/api/config')
    .then(async response => {
        // CEK 1: Status HTTP
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[Config JS] Server Error (${response.status}):`, errorText);
            throw new Error(`Server Error (${response.status})`);
        }

        // CEK 2: Tipe Konten (Mencegah error JSON.parse tadi)
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            console.warn(`[Config JS] Server TIDAK mengembalikan JSON. Menerima HTML/Text:`, text.substring(0, 150));
            throw new Error("Server Error: Response is not JSON (Isi: HTML Error Page?).");
        }

        return response.json();
    })
    .then(data => {
        window.appConfig.supabaseUrl = data.supabaseUrl;
        window.appConfig.supabaseKey = data.supabaseKey;
        window.appConfig.isLoading = false;
        window.appConfig.source = 'server';
        console.log("✅ [Config JS] SUKSES mengambil dari Vercel:", data.supabaseUrl);
    })
    .catch(err => {
        console.error("❌ [Config JS] Gagal ambil config:", err);
        window.appConfig.error = err.message;
        window.appConfig.isLoading = false;

        // ⚠️ FALLBACK LOGIC (BENTUK DARURAT)
        // Hanya aktif jika API GAGAL TOTAL
        if (window.appConfig.supabaseKey === null) {
            console.warn("⚠️ [Config JS] Menggunakan FALLBACK (Hardcoded) agar web tetap jalan...");
            window.appConfig.source = 'fallback';
            
            // PASTIKAN DATA INI SAMA DENGAN DASHBOARD SUPABASE
            window.appConfig.supabaseUrl = "https://nkcctncsjmcfsiguowms.supabase.co";
            window.appConfig.supabaseKey = "sb_publishable_CY2GLPbRJRDcRAyPXzOD4Q_63uR5W9X"; // Gunakan Key Publishable Pendek Jika JWT Error 403
            
            console.log("🔧 [Config JS] Fallback aktif. URL:", window.appConfig.supabaseUrl);
        }
    });
