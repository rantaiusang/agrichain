// --- src/config.js ---

const isBrowser = typeof window !== 'undefined';

if (isBrowser) {
    // ⚠️ MODE SUPER ADMIN (RISKY MODE)
    // Kita memaksa menggunakan Service Role Key
    // Dengan ini, Kamu bisa INSERT, UPDATE, dan DELETE data di backend tanpa dicek oleh Policies.
    
    console.warn("⚠️ [SUPER ADMIN] Mode Service Role Key AKTIF. Hati-hati.");
    
    window.appConfig = {
        // ⚠️ GANTI DENGAN SERVICE ROLE KEY (SB_SECRET_...) ⚠️
        // Key ini ada di Supabase Dashboard -> Settings -> API -> Secret Keys
        supabaseUrl: "https://nkcctncsjmcfsiguowms.supabase.co", 
        supabaseKey: "sb_secret_j0KE8cBMHSxQ40MIg0tCNg_J2K_lACo" 
    };
} else {
    // MODE NODEJS
    module.exports = {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY // Di server juga pakai secret key
    };
}
