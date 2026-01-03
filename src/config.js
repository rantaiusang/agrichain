// --- src/config.js ---

// Kita membuat window.appConfig agar semua file HTML bisa membacanya
// Data ini diambil dari Environment Variables saat di-build di Vercel
// Jika lokal, ini diabaikan agar file HTML lokal tetap jalan (karena tidak ada process.env di browser)
const isBrowser = typeof window !== 'undefined';

if (isBrowser) {
    // BACA DATA DARI HTML SCRIPT INJECTOR (lihat langkah C)
    window.appConfig = {
        supabaseUrl: window.__SUPABASE_URL__,
        supabaseKey: window.__SUPABASE_KEY__
    };
} else {
    // Jika dijalankan di NodeJS (Untuk testing)
    module.exports = {
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseKey: process.env.SUPABASE_KEY // Bisa gunakan key service_role atau anon
    };
}
