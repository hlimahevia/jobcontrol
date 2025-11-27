const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Shift = require('../models/Shift');

// POST /api/shifts
router.post('/', authMiddleware, async (req, res) => {
  const {
    date,
    shiftNumber,
    area,
    task,
    startTime,
    endTime,
    hasIncident,
    incidentDescription
  } = req.body;

  try {
    const newShift = new Shift({
      user: req.user.id,
      date,
      shiftNumber,
      area,
      task,
      startTime,
      endTime,
      hasIncident,
      incidentDescription
    });

    await newShift.save();
    res.status(201).json({ message: 'Turno guardado exitosamente' });
  } catch (err) {
    console.error('Error al guardar turno:', err);
    res.status(500).json({ message: 'Error al guardar el turno' });
  }
});

// GET /api/shifts - Obtener todos los turnos del usuario autenticado
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Si quieres más adelante puedes usar req.query para filtrar por fecha, área, etc.

    const shifts = await Shift.find({ user: req.user.id }).sort({ date: -1 });

    res.json(shifts);
  } catch (err) {
    console.error('Error al obtener turnos:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// GET /api/shifts/filter?
router.get('/filter', authMiddleware, async (req, res) => {
  const { from, to } = req.query;

  const filter = {
    user: req.user.id,
  };

  if (from && to) {
    filter.date = { $gte: from, $lte: to };
  } else if (from) {
    filter.date = { $gte: from };
  } else if (to) {
    filter.date = { $lte: to };
  }

  try {
    const shifts = await Shift.find(filter).sort({ date: -1 });
    res.json(shifts);
  } catch (err) {
    console.error('Error al filtrar turnos:', err);
    res.status(500).json({ message: 'Error al filtrar turnos' });
  }
});

// DELETE /api/shifts/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const shift = await Shift.findById(id);
    if (!shift) return res.status(404).json({ message: 'Turno no encontrado' });

    // Verificar que el turno sea del usuario
    if (shift.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    await shift.deleteOne();

    res.json({ message: 'Turno eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar turno:', err);
    res.status(500).json({ message: 'Error al eliminar turno' });
  }
});

module.exports = router;
