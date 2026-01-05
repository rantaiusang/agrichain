window.appConfig = {
    supabaseUrl: null,
    supabaseKey: null,
    isLoading: true,
    source: 'init' // 'init', 'server', 'fallback'
};

console.log("[Config JS] Memulai pengambilan konfigurasi...");

fetch('/api/config')
    .then(async response => {
        // 检查状态
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[Config JS] Server Error (${response.status}):`, errorText);
            throw new Error(`Server Error (${response.status})`);
        }
        
        // 检查 Content-Type (防止 HTML 错误)
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            console.warn(`[Config JS] Server TIDAK mengembalikan JSON. Isi:`, text.substring(0, 150));
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

        // ⚠️ Fallback Logic (本地调试或 API 彻底失败时使用)
        if (window.appConfig.supabaseKey === null) {
            console.warn("⚠️ [Config JS] Menggunakan FALLBACK (Hardcoded) agar web tetap jalan...");
            window.appConfig.source = 'fallback';
            
            // 硬编码配置 (确保与 Dashboard Supabase 一致)
            window.appConfig.supabaseUrl = "https://nkcctncsjmcfsiguowms.supabase.co";
            window.appConfig.supabaseKey = "sb_publishable_CY2GLPbRJRDcRAyPXzOD4Q_63uR5W9X";
            
            console.log("🔧 [Config JS] Fallback aktif. URL:", window.appConfig.supabaseUrl);
        }
    });
