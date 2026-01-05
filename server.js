const express = require('express');
const cors = require('cors');

const app = express();

// --- PERBAIKAN 1: Import Router dari dalam folder backend ---
// Titik dua (./) artinya folder sekarang, 'backend/' artinya masuk ke folder backend
const authRouter = require('./backend/router'); 

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- INISIALISASI SUPABASE ---
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ GAGAL: Environment Variables Vercel belum diset.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Inject supabase ke request (Agar bisa dipakai di file backend/auth.js)
app.use((req, res, next) => {
    req.supabase = supabase;
    next();
});

// --- ROUTE CONFIG KHUSUS ---
// Frontend (config.js) memanggil '/api/config', jadi kita buat di sini
app.get('/api/config', (req, res) => {
    res.json({
        supabaseUrl: supabaseUrl,
        supabaseKey: supabaseKey
    });
});

// --- ROUTE UTAMA ---
app.use('/api', authRouter);

app.get('/', (req, res) => {
    res.json({ status: 'OK', message: 'Backend AgriChain Running' });
});

// --- EXPORTS ---
module.exports = app;

// --- EXPORT HANDLER UNTUK VERCEL ---
export default async function handler(req, res) {
    console.log(`[Vercel Handler] ${req.method} ${req.url}`);
    return app(req, res);
}
