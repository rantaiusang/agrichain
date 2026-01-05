// backend/auth.router.js
const express = require('express');
const router = express.Router();

// Import fungsi logic dari file auth.js
const authLogic = require('./auth'); // Pastikan nama file logic-nya auth.js

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { email, password, full_name, role } = req.body;
        
        const result = await authLogic.register(email, password, full_name, role);
        
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const result = await authLogic.login(email, password);
        
        res.status(200).json(result);
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
    try {
        // Ambil token dari header: "Bearer <token>"
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        
        const result = await authLogic.getUser(token);
        
        res.status(200).json(result);
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
});

module.exports = router;
