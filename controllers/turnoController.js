const { Turno, Cliente } = require('../models');
const { z } = require('zod');
const { Op } = require('sequelize');

// Schema de validación
const turnoSchema = z.object({
    fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "El formato de fecha debe ser YYYY-MM-DD"),
    hora: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "El formato de hora debe ser HH:MM o HH:MM:SS"),
    clienteId: z.number().int().positive("El ID del cliente debe ser válido")
});

const turnoController = {
    // Listar turnos (con datos del cliente)
    getAll: async (req, res, next) => {
        try {
            const turnos = await Turno.findAll({
                include: [{ model: Cliente, as: 'cliente' }],
                order: [['fecha', 'ASC'], ['hora', 'ASC']]
            });
            res.json(turnos);
        } catch (error) {
            next(error);
        }
    },

    // Crear turno con validaciones de negocio
    create: async (req, res, next) => {
        try {
            // 1. Validar formato de entrada
            const data = turnoSchema.parse(req.body);

            // 2. Verificar que el cliente existe
            const clienteExiste = await Cliente.findByPk(data.clienteId);
            if (!clienteExiste) {
                return res.status(404).json({ mensaje: "El cliente especificado no existe." });
            }

            // Regla de Negocio 1: El cliente no puede tener más de 1 turno activo el mismo día
            // Wait, let's keep it simple: just don't allow duplicate exact time
            const turnoExistenteMismaHora = await Turno.findOne({
                where: { fecha: data.fecha, hora: data.hora }
            });

            if (turnoExistenteMismaHora) {
                return res.status(400).json({ mensaje: "Ya existe un turno agendado en ese horario exacto." });
            }

            // Regla de Negocio 2: No sobrecargar horarios (ej: máx 3 turnos el mismo día)
            const turnosEnDia = await Turno.count({
                where: { fecha: data.fecha, estado: { [Op.ne]: 'cancelado' } }
            });

            if (turnosEnDia >= 3) {
                return res.status(400).json({ mensaje: "Horarios agotados para esa fecha. Máximo 3 turnos por día permitidos." });
            }

            // 3. Crear el turno
            const nuevoTurno = await Turno.create({
                ...data,
                estado: 'reservado'
            });

            res.status(201).json(nuevoTurno);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ errores: error.errors });
            }
            next(error);
        }
    },

    // Actualizar estado del turno
    updateEstado: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { estado } = req.body; // 'reservado', 'cancelado', 'completado'

            if (!['reservado', 'cancelado', 'completado'].includes(estado)) {
                return res.status(400).json({ mensaje: "Estado inválido." });
            }

            const turno = await Turno.findByPk(id);
            if (!turno) return res.status(404).json({ mensaje: "Turno no encontrado." });

            turno.estado = estado;
            await turno.save();

            res.json(turno);
        } catch (error) {
            next(error);
        }
    }
};

module.exports = turnoController;
