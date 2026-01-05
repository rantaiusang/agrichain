const express = require('express');
const cors = require('cors');

const app = express();

// 1. CONFIGURASI MIDDLEWARE (WAJIB PALING ATAS)
app.use(cors());
app.use(express.json()); // <--- WAJIB DI SINI
app.use(express.urlencoded({ extended: true }));

// 2. INISIALISASI SUPABASE
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; 
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Check Env Vars (Biar tidak blank)
const supabase = createClient(
    supabaseUrl || "https://nkcctncsjmcfsiguowms.supabase.co", 
    supabaseKey || "sb_publishable_CY2GLPbRJRDcRAyPXzOD4Q_63uR5W9X"
);

// Inject supabase
app.use((req, res, next) => {
    req.supabase = supabase;
    next();
});

// 3. ROUTES (API)
// Route Config
app.get('/api/config', (req, res) => {
    // HANYA res.json() DI SINI
    res.json({
        supabaseUrl: supabaseUrl,
        supabaseKey: supabaseKey
    });
});

// Import dan Gunakan Routes (jika Anda punya folder backend)
const authRouter = require('./backend/router');
app.use('/api', authRouter);

// JANGAN ADA app.get('/' ...) yang mengirim file HTML di sini

module.exports = app;
