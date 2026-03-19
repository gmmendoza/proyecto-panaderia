const express = require('express');
const router = express.Router();
const { Pedido } = require('../models');

// Obtener todos los pedidos
router.get('/', async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear un nuevo pedido
router.post('/', async (req, res) => {
    try {
        const pedido = await Pedido.create(req.body);
        res.status(201).json(pedido);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Actualizar un pedido
router.put('/:id', async (req, res) => {
    try {
        const [updated] = await Pedido.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedPedido = await Pedido.findByPk(req.params.id);
            return res.json(updatedPedido);
        }
        res.status(404).json({ message: 'Pedido no encontrado' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Eliminar un pedido
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Pedido.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            return res.json({ message: "Pedido eliminado" });
        }
        res.status(404).json({ message: 'Pedido no encontrado' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
