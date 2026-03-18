const express = require('express');
const router = express.Router();
const { Venta } = require('../models');

// Obtener todas las ventas
router.get('/', async (req, res) => {
    try {
        const ventas = await Venta.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(ventas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Registrar una nueva venta
router.post('/', async (req, res) => {
    try {
        const venta = await Venta.create(req.body);
        res.status(201).json(venta);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
