const express = require('express');
const cors = require('cors');

const app = express();

// Import Routes
const authRouter = require('./auth.router'); 
// const crudRouter = require('./crud-panen.router'); // Jika nanti ada file route lain

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- INISIALISASI SUPABASE ---
const { createClient } = require('@supabase/supabase-js');

// Mengambil Environment Variables (Sesuaikan nama dengan yang ada di Vercel)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Validasi agar mudah mengetahui jika Env Vars belum diset
if (!supabaseUrl || !supabaseKey) {
    console.error("❌ FATAL: Environment Variables (NEXT_PUBLIC_SUPABASE_URL / KEY) belum diset di Vercel.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Inject supabase ke setiap request (Middleware)
app.use((req, res, next) => {
    req.supabase = supabase;
    next();
});

// --- ROUTES UTAMA ---
app.get('/', (req, res) => {
    res.json({ status: 'OK', message: 'Backend AgriChain Running' });
});

// Menghubungkan router auth ke path /api/auth
app.use('/api/auth', authRouter);

// --- EXPORTS ---
// 1. Export app (Untuk kebutuhan internal / testing local dengan 'node index.js')
module.exports = app;

// 2. Export default handler (WAJIB UNTUK VERCEL SERVERLESS)
// Fungsi ini bertindak sebagai jembatan agar Vercel bisa menjalankan Express App
export default async function handler(req, res) {
    console.log(`[Vercel Handler] ${req.method} ${req.url}`);
    return app(req, res);
}
