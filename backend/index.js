const express = require('express');
const cors = require('cors');

const app = express();

// Import Routes
const authRouter = require('./auth.router'); 
// const crudRouter = require('./crud-panen.router'); // Jika nanti ada

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- INISIALISASI SUPABASE ---
const { createClient } = require('@supabase/supabase-js');

// Gunakan variabel lingkungan (dari Vercel atau .env lokal)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ FATAL: Environment Variables (NEXT_PUBLIC_SUPABASE_URL / KEY) belum diset.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Inject supabase ke setiap request (Middleware)
app.use((req, res, next) => {
    req.supabase = supabase;
    next();
});

// --- ROUTES ---
app.get('/', (req, res) => {
    res.json({ status: 'OK', message: 'Backend AgriChain Running' });
});

// Menghubungkan router auth
app.use('/api/auth', authRouter);

// Export untuk Vercel
module.exports = app;
