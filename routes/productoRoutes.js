const express = require('express');
const router = express.Router();
const { Producto } = require('../models');

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const productos = await Producto.findAll();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
    try {
        const producto = await Producto.create(req.body);
        res.status(201).json(producto);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Actualizar un producto
router.put('/:id', async (req, res) => {
    try {
        const [updated] = await Producto.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedProducto = await Producto.findByPk(req.params.id);
            return res.json(updatedProducto);
        }
        throw new Error('Producto no encontrado');
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Eliminar un producto
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Producto.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            return res.json({ message: "Producto eliminado" });
        }
        throw new Error('Producto no encontrado');
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
