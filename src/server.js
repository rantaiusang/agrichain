const express = require('express');
const cors = require('cors');
// JANGAN pakai require('dotenv').config() jika di Vercel
// Vercel otomatis menyuntikkan .env ke process.env

const app = express();
const PORT = process.env.PORT || 5000;

// Import Routes
const authRouter = require('./routes/auth');
const resetRouter = require('./routes/request-reset');

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- SUPABASE CLIENT ---
const { createClient } = require('@supabase/supabase-js');

// Menggunakan process.env (Vercel akan menggantinya dengan data dari Settings)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("FATAL: Environment Variables SUPABASE_URL atau SUPABASE_KEY tidak ditemukan!");
}

const supabase = createClient(supabaseUrl, supabaseKey);
app.set('supabase', supabase);

// --- ROUTING ---
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'AgriChain Backend running on Vercel' });
});

app.use('/api/auth', authRouter);
app.use('/api', resetRouter); // Routes reset password

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
