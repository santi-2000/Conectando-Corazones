const express = require('express');
const router = express.Router();
const CalendarController = require('../controllers/CalendarController');
const { optionalAuth } = require('../../middleware/auth');
const { body, validationResult } = require('express-validator');

const controller = new CalendarController();

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Datos de entrada inválidos',
      details: errors.array()
    });
  }
  next();
};

// Middleware simple para validar userId
const validateUserId = (req, res, next) => {
  const { userId } = req.params;
  if (!userId || userId.trim() === '') {
    return res.status(400).json({
      success: false,
      error: 'ID de usuario requerido',
      message: 'El userId es requerido'
    });
  }
  next();
};

// Validaciones para crear/actualizar eventos
const validateEvent = [
  body('titulo')
    .notEmpty()
    .withMessage('El título es requerido')
    .isLength({ min: 1, max: 255 })
    .withMessage('El título debe tener entre 1 y 255 caracteres'),
  
  body('descripcion')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('La descripción no puede exceder 1000 caracteres'),
  
  body('fecha_evento')
    .notEmpty()
    .withMessage('La fecha del evento es requerida')
    .isISO8601()
    .withMessage('La fecha debe tener formato ISO 8601 (YYYY-MM-DD)'),
  
  body('hora_evento')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('La hora debe tener formato HH:MM'),
  
  body('color')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('El color debe ser un código hexadecimal válido (#RRGGBB)'),
  
  body('tipo_evento')
    .optional()
    .isIn(['familiar', 'deportivo', 'recordatorio', 'diferente', 'medico', 'educativo'])
    .withMessage('Tipo de evento inválido'),
  
  body('nivel_importancia')
    .optional()
    .isIn(['Alto', 'Medio', 'Bajo'])
    .withMessage('Nivel de importancia inválido'),
  
  body('recordatorio_activo')
    .optional()
    .isBoolean()
    .withMessage('Recordatorio activo debe ser true o false'),
  
  body('recordatorio_minutos')
    .optional()
    .isInt({ min: 0, max: 1440 })
    .withMessage('Recordatorio en minutos debe ser un número entre 0 y 1440'),
  
  body('ubicacion')
    .optional()
    .isLength({ max: 255 })
    .withMessage('La ubicación no puede exceder 255 caracteres'),
  
  body('notas_adicionales')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Las notas adicionales no pueden exceder 1000 caracteres'),
  
  handleValidationErrors
];

// ===== PANTALLA 4: CALENDARIO =====

/**
 * GET /calendar/events
 * Obtener todos los eventos (sin userId)
 */
router.get('/events', optionalAuth, async (req, res) => {
  await controller.getEvents(req, res);
});

/**
 * GET /calendar/:userId/events
 * Obtener todos los eventos de un usuario con filtros opcionales
 */
router.get('/:userId/events', optionalAuth, validateUserId, async (req, res) => {
  await controller.getEvents(req, res);
});

/**
 * GET /calendar/:userId/month
 * Obtener eventos de un mes específico
 */
router.get('/:userId/month', optionalAuth, validateUserId, async (req, res) => {
  await controller.getMonthEvents(req, res);
});

/**
 * GET /calendar/:userId/date/:fecha
 * Obtener eventos de una fecha específica
 */
router.get('/:userId/date/:fecha', optionalAuth, validateUserId, async (req, res) => {
  await controller.getDateEvents(req, res);
});

/**
 * GET /calendar/:userId/today
 * Obtener eventos de hoy
 */
router.get('/:userId/today', optionalAuth, validateUserId, async (req, res) => {
  await controller.getTodayEvents(req, res);
});

/**
 * GET /calendar/:userId/upcoming
 * Obtener eventos próximos (próximos 7 días)
 */
router.get('/:userId/upcoming', optionalAuth, validateUserId, async (req, res) => {
  await controller.getUpcomingEvents(req, res);
});

/**
 * GET /calendar/:userId/statistics
 * Obtener estadísticas de eventos
 */
router.get('/:userId/statistics', optionalAuth, validateUserId, async (req, res) => {
  await controller.getStatistics(req, res);
});

// ===== PANTALLA 5: AGREGAR FECHA =====

/**
 * POST /calendar/:userId/events
 * Crear un nuevo evento
 */
router.post('/:userId/events', optionalAuth, validateUserId, validateEvent, async (req, res) => {
  await controller.createEvent(req, res);
});

/**
 * GET /calendar/:userId/event/:eventId
 * Obtener un evento específico
 */
router.get('/:userId/event/:eventId', optionalAuth, validateUserId, async (req, res) => {
  await controller.getEvent(req, res);
});

/**
 * PUT /calendar/:userId/event/:eventId
 * Actualizar un evento
 */
router.put('/:userId/event/:eventId', optionalAuth, validateUserId, validateEvent, async (req, res) => {
  await controller.updateEvent(req, res);
});

/**
 * DELETE /calendar/:userId/event/:eventId
 * Eliminar un evento
 */
router.delete('/:userId/event/:eventId', optionalAuth, validateUserId, async (req, res) => {
  await controller.deleteEvent(req, res);
});

// ===== ENDPOINTS AUXILIARES =====

/**
 * GET /calendar/event-types
 * Obtener tipos de eventos disponibles
 */
router.get('/event-types', async (req, res) => {
  await controller.getEventTypes(req, res);
});

/**
 * GET /calendar/colors
 * Obtener colores disponibles
 */
router.get('/colors', async (req, res) => {
  await controller.getAvailableColors(req, res);
});

module.exports = router;
