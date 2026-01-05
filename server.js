const express = require('express');
const cors = require('cors');

// Tidak perlu require('dotenv').config() karena Vercel otomatis membaca Environment Variables
const app = express();

// Import Routes
const authRouter = require('./auth'); 
const resetRouter = require('./crud-panen'); 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- INISIALISASI SUPABASE (Sesuaikan nama Env Vars) ---
const { createClient } = require('@supabase/supabase-js');

// Mengambil data dari Environment Variables di Dashboard Vercel
// PASTIKAN NAMA INI SAMA PERSIS DENGAN YANG ADA DI DASHBOARD VERCEL
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ GAGAL: NEXT_PUBLIC_SUPABASE_URL atau NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY belum diset di Environment Variables Vercel.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Inject supabase ke request (Middleware)
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
