// --- src/appchat.js (MODIFIKASI PENTING) ---
const { createClient } = require('@supabase/supabase-js');

// 1. AMBIL CONFIG DARI CONFIG.JS
if (typeof window.appConfig === 'undefined') {
    console.error("FATAL: config.js belum diload atau salah path.");
    alert("Gagal memuat konfigurasi sistem.");
}

// 2. INISIALISASI SUPABASE DENGAN CONFIG
const supabase = createClient(window.appConfig.supabaseUrl, window.appConfig.supabaseKey);

// 3. Sisanya kode logic chat Anda...
// ... (kode handleChat, getChatHistory, dll tetap sama)
