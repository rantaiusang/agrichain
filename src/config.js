// --- src/config.js ---

const isBrowser = typeof window !== 'undefined';

if (isBrowser) {
    // 1. CEK DARI INJECTOR (Vercel Env)
    const injectedUrl = window.__SUPABASE_URL__;
    const injectedKey = window.__SUPABASE_KEY__;

    if (injectedUrl && injectedKey) {
        // MODE PRODUCTION (Vercel)
        window.appConfig = {
            supabaseUrl: injectedUrl,
            supabaseKey: injectedKey
        };
    } else {
        // MODE FALLBACK / DEVELOPMENT (Laptop)
        console.warn("⚠️ [Config] Tidak menemukan Env Injector. Menggunakan Fallback Local.");
        
        window.appConfig = {
            // ⚠️⚠️ PASTIKAN ISI DUA BARIS DI BAWAH INI DENGAN URL & KEY ASLI ⚠️⚠️
            // 1. Buka Supabase Dashboard -> Settings -> API
            // 2. Copy "Project URL" dan paste di bawah ini:
            supabaseUrl: "https://nkcctncsjmcfsiguowms.supabase.co", 
            
            // 3. Copy "Publishable key" (yang diawali sb_publishable) dan paste di bawah ini:
            // JANGAN COPY YANG KATA SB_SECRET
            supabaseKey: "sb_publishable_CY2GLPbRJRDcRAyPXzOD4Q_63uR5W9X" 
        };
    }
} else {
    // MODE NODEJS (Testing / Server-side Script)
    module.exports = {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    };
}
