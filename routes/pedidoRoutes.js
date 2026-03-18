const express = require('express');
const router = express.Router();
const { Pedido } = require('../models');

// Obtener todos los pedidos
router.get('/', async (req, res) => {
    try {
        const pedidos = await Pedido.findAll({
            order: [['fechaEntrega', 'ASC']]
        });
        res.json(pedidos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear un nuevo pedido
router.post('/', async (req, res) => {
    try {
        const { total, senia } = req.body;
        const saldo = total - senia;
        const pedido = await Pedido.create({ ...req.body, saldo });
        res.status(201).json(pedido);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Actualizar un pedido (ej. cambiar estado o saldo)
router.put('/:id', async (req, res) => {
    try {
        const { total, senia } = req.body;
        let updateData = { ...req.body };
        if (total !== undefined && senia !== undefined) {
            updateData.saldo = total - senia;
        }
        
        const [updated] = await Pedido.update(updateData, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedPedido = await Pedido.findByPk(req.params.id);
            return res.json(updatedPedido);
        }
        throw new Error('Pedido no encontrado');
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
        throw new Error('Pedido no encontrado');
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
