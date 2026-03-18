const express = require('express');
const router = express.Router();
const { Receta } = require('../models');

// Obtener todas las recetas
router.get('/', async (req, res) => {
  try {
    const recetas = await Receta.findAll();
    res.json(recetas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear una receta
router.post('/', async (req, res) => {
  try {
    const receta = await Receta.create(req.body);
    res.status(201).json(receta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Actualizar una receta
router.put('/:id', async (req, res) => {
  try {
    const receta = await Receta.findByPk(req.params.id);
    if (receta) {
      await receta.update(req.body);
      res.json(receta);
    } else {
      res.status(404).json({ error: 'Receta no encontrada' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar una receta
router.delete('/:id', async (req, res) => {
  try {
    const receta = await Receta.findByPk(req.params.id);
    if (receta) {
      await receta.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Receta no encontrada' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
