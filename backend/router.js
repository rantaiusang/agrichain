// backend/router.js
const express = require('express');
const router = express.Router();

// Import logic dari folder backend juga (tidak pakai ./ karena sudah se-folder)
const authLogic = require('./auth'); 
const crudLogic = require('./crudpanen'); // Sesuaikan nama file logic Anda

// Contoh Route
router.post('/auth/register', async (req, res) => {
    try {
        const { email, password, full_name, role } = req.body;
        const result = await authLogic.register(email, password, full_name, role);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ... route lainnya

module.exports = router;
