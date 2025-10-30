/**
 * Routes para Moms Week
 * Define los endpoints del módulo
 */

const express = require('express');
const MomsWeekController = require('../controllers/MomsWeekController');
const { optionalAuth } = require('../../middleware/auth');
const { handleValidationErrors } = require('../../middleware/validation');
const { param, body } = require('express-validator');

const router = express.Router();
const controller = new MomsWeekController();

// Validaciones específicas para las rutas de Moms Week
const validateUserId = [
  param('userId').isString().notEmpty().withMessage('El ID de usuario es requerido.'),
  handleValidationErrors
];

const validateDailyEntry = [
  body('titulo').optional().isString().trim().notEmpty().withMessage('El título no puede estar vacío.'),
  body('contenido').optional().isString().trim().notEmpty().withMessage('El contenido no puede estar vacío.'),
  body('fotos').optional().isArray().withMessage('Las fotos deben ser un array.'),
  body('comentarios').optional().isArray().withMessage('Los comentarios deben ser un array.'),
  body('palabras').optional().isInt({ min: 0 }).withMessage('Las palabras deben ser un número entero no negativo.'),
  body('momentos_felices').optional().isInt({ min: 0 }).withMessage('Los momentos felices deben ser un número entero no negativo.'),
  body('emociones').optional().isArray().withMessage('Las emociones deben ser un array.'),
  body('emocion').optional().isString().trim().notEmpty().withMessage('La emoción no puede estar vacía.'),
  body('tags').optional().isArray().withMessage('Los tags deben ser un array.'),
  handleValidationErrors
];

// ===== PANTALLA 12: Mi semana con mama =====
/**
 * GET /moms-week/:userId/current-week
 * Obtener información de la semana actual (Semana 42, 7-13 de octubre)
 */
router.get('/:userId/current-week', optionalAuth, validateUserId, async (req, res) => {
  await controller.getCurrentWeek(req, res);
});

/**
 * GET /moms-week/:userId/weekly-progress
 * Obtener progreso de días completados (3 de 7 días)
 */
router.get('/:userId/weekly-progress', optionalAuth, validateUserId, async (req, res) => {
  await controller.getWeekProgress(req, res);
});

/**
 * GET /moms-week/:userId/weekly-stats
 * Obtener estadísticas semanales (5 Fotos, 127 Palabras, 3 Feliz)
 */
router.get('/:userId/weekly-stats', optionalAuth, validateUserId, async (req, res) => {
  await controller.getWeeklyStats(req, res);
});

// ===== PANTALLA 13: Actividad de Hoy =====
/**
 * GET /moms-week/:userId/current-day
 * Obtener día actual de la semana (Día 3)
 */
router.get('/:userId/current-day', optionalAuth, validateUserId, async (req, res) => {
  await controller.getCurrentDay(req, res);
});

/**
 * GET /moms-week/:userId/weekly-progress-stars
 * Obtener progreso semanal con estrellas (⭐/☆)
 */
router.get('/:userId/weekly-progress-stars', optionalAuth, validateUserId, async (req, res) => {
  await controller.getWeeklyProgressStars(req, res);
});

/**
 * POST /moms-week/:userId/daily-entry
 * Agregar entrada del día (foto, texto, emoción)
 */
router.post('/:userId/daily-entry', optionalAuth, validateUserId, validateDailyEntry, async (req, res) => {
  await controller.addDailyEntry(req, res);
});

// ===== PANTALLA 14: Vista PDF =====
/**
 * GET /moms-week/:userId/weekly-preview
 * Obtener vista previa del libro semanal
 */
router.get('/:userId/weekly-preview', optionalAuth, validateUserId, async (req, res) => {
  await controller.getWeeklyPreview(req, res);
});

/**
 * GET /moms-week/:userId/weekly-days
 * Obtener días de la semana con estado (completado/pendiente)
 */
router.get('/:userId/weekly-days', optionalAuth, validateUserId, async (req, res) => {
  await controller.getWeeklyDays(req, res);
});

/**
 * POST /moms-week/:userId/generate-pdf
 * Generar PDF real del libro semanal
 */
router.post('/:userId/generate-pdf', optionalAuth, validateUserId, async (req, res) => {
  await controller.generatePDF(req, res);
});

/**
 * GET /moms-week/:userId/weekly-latest-pdf
 * Obtener el PDF más reciente del usuario
 */
router.get('/:userId/weekly-latest-pdf', optionalAuth, validateUserId, async (req, res) => {
  await controller.getLatestPDF(req, res);
});

/**
 * GET /moms-week/:userId/pdf-preview
 * Obtener vista previa del PDF (HTML)
 */
router.get('/:userId/pdf-preview', optionalAuth, validateUserId, async (req, res) => {
  await controller.getPDFPreview(req, res);
});

// ===== PANTALLA 15: Días Anteriores =====
/**
 * GET /moms-week/:userId/previous-days
 * Obtener lista de días anteriores con estado
 */
router.get('/:userId/previous-days', optionalAuth, validateUserId, async (req, res) => {
  await controller.getPreviousDays(req, res);
});

/**
 * GET /moms-week/:userId/day/:dayNumber
 * Obtener día específico para editar
 */
router.get('/:userId/day/:dayNumber', optionalAuth, validateUserId, async (req, res) => {
  await controller.getSpecificDay(req, res);
});

// ===== ENDPOINTS ADICIONALES =====
/**
 * GET /moms-week/:userId/emotions
 * Obtener emociones disponibles (6 emociones con colores)
 */
router.get('/:userId/emotions', optionalAuth, validateUserId, async (req, res) => {
  await controller.getAvailableEmotions(req, res);
});

/**
 * GET /moms-week/:userId/history
 * Obtener historial de semanas (mantener compatibilidad)
 */
router.get('/:userId/history', optionalAuth, validateUserId, async (req, res) => {
  await controller.getWeekHistory(req, res);
});

module.exports = router;
