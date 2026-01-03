const express = require('express');
const cors = require('cors');

// JANGAN PAKAI require('dotenv').config() DI VERCEL
const app = express();

// Import Routes
// Pastikan path file ini sesuai dengan folder
const authRouter = require('./auth'); 
const resetRouter = require('./crud-panen'); // Sesuaikan nama file route Anda

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- INISIALISASI SUPABASE (WAJIB) ---
const { createClient } = require('@supabase/supabase-js');

// Mengambil data dari Environment Variables di Dashboard Vercel
const supabaseUrl = process.env.SUPABASE_URL; 
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ GAGAL: SUPABASE_URL atau SUPABASE_KEY belum diset di Environment Variables Vercel.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Inject supabase ke request (Agar routes bisa pakai req.supabase)
app.use((req, res, next) => {
    req.supabase = supabase;
    next();
});

// --- ROUTES ---
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend AgriChain Running' });
});

// Routes Auth & Reset
app.use('/api/auth', authRouter);
app.use('/api/reset', resetRouter);

module.exports = app;
