// --- src/config.js ---

const isBrowser = typeof window !== 'undefined';

if (isBrowser) {
    // 1. CEK DARI INJECTOR (Vercel Env)
    // Injector akan mengisi window.__SUPABASE_URL__
    const injectedUrl = window.__SUPABASE_URL__;
    const injectedKey = window.__SUPABASE_KEY__;

    if (injectedUrl && injectedKey) {
        // MODE PRODUCTION (Vercel)
        window.appConfig = {
            supabaseUrl: injectedUrl,
            supabaseKey: injectedKey
        };
    } else {
        // MODE FALLBACK / LOCAL (Laptop)
        console.warn("Menggunakan Fallback Local (Hardcoded)");
        
        window.appConfig = {
            // ⚠️ ISI DENGAN URL & KEY ASLI KAMU DISINI UNTUK TES LOCAL
            supabaseUrl: "https://nkcctncsjmcfsiguowms.supabase.co", 
            supabaseKey: "sb_publishable_CY2GLPbRJRDcRAyPXzOD4Q_63uR5W9X" 
        };
    }
} else {
    // MODE NODEJS (Testing Server)
    module.exports = {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    };
}
