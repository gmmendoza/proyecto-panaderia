const { Cliente } = require('../models');
const { z } = require('zod');

// Validation schema
const clienteSchema = z.object({
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    telefono: z.string().min(8, "El teléfono debe tener al menos 8 caracteres")
});

const clienteController = {
    // Obtener todos los clientes
    getAll: async (req, res, next) => {
        try {
            const clientes = await Cliente.findAll();
            res.json(clientes);
        } catch (error) {
            next(error);
        }
    },

    // Crear un cliente nuevo
    create: async (req, res, next) => {
        try {
            const data = clienteSchema.parse(req.body);
            const nuevoCliente = await Cliente.create(data);
            res.status(201).json(nuevoCliente);
        } catch (error) {
            // Si es un error de Zod (validación), devolvemos 400
            if (error instanceof z.ZodError) {
                return res.status(400).json({ errores: error.errors });
            }
            next(error);
        }
    }
};

module.exports = clienteController;
