// --- src/config.js (VERSI AMAN) ---
const isBrowser = typeof window !== 'undefined';

if (isBrowser) {
    // 🔒 MODE CLIENT (AMAN)
    // Gunakan Anon Key / Public Key.
    // Key ini ada di Supabase Dashboard -> Settings -> API -> Project API Keys (anon/public)
    
    window.appConfig = {
        supabaseUrl: "https://nkcctncsjmcfsiguowms.supabase.co", 
        // PASTIKAN INI ADALAH 'anon' KEY, BUKAN 'service_role' SECRET!
        supabaseKey: "sb_publishable_CY2GLPbRJRDcRAyPXzOD4Q_63uR5W9X" // <--- GANTI DENGAN ANON KEY
    };
} else {
    // MODE SERVER / NODEJS
    // Kalau ini jalan di server (Vercel/Node), boleh pakai Service Role lewat ENV Variable
    // JANGAN hardcode di sini!
    module.exports = {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY 
    };
}
