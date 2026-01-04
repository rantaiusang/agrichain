// --- src/config.js ---

const isBrowser = typeof window !== 'undefined';

if (isBrowser) {
    // 1. Coba ambil dari Script Injector (Production/Server Side)
    // Biasanya di-set oleh script async di head HTML: window.__SUPABASE_URL__ = ...
    const injectedUrl = window.__SUPABASE_URL__;
    const injectedKey = window.__SUPABASE_KEY__;

    if (injectedUrl && injectedKey) {
        // MODE PRODUCTION: Data dari server (Vercel Env)
        window.appConfig = {
            supabaseUrl: injectedUrl,
            supabaseKey: injectedKey
        };
    } else {
        // MODE FALLBACK / DEVELOPMENT:
        // Jika data injector kosong (misalnya buka file HTML langsung),
        // Kita gunakan data manual di sini.
        console.warn("⚠️ [Config] Tidak menemukan Env Injector. Menggunakan Fallback Local.");
        
        window.appConfig = {
            // ⚠️ PENTING: Isi URL & Key Supabase Kamu di sini sebagai cadangan
            // Agar HTML bisa berjalan meskipun fetch('/api/config') gagal.
            supabaseUrl: "https://nkcctncsjmcfsiguowms.supabase.co", 
            supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // GANTI DENGAN ANON KEY KAMU
        };
    }
} else {
    // MODE NODEJS (Testing / Server-side Script)
    module.exports = {
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseKey: process.env.SUPABASE_KEY
    };
}
