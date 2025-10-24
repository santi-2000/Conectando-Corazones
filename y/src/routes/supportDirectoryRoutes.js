/**
 * Routes para Directorio de Apoyos
 * Define los endpoints del módulo
 */

const express = require('express');
const SupportDirectoryController = require('../controllers/SupportDirectoryController');
const { authenticateToken, optionalAuth } = require('../../middleware/auth');
const { validatePagination } = require('../../middleware/validation');

const router = express.Router();
const controller = new SupportDirectoryController();

/**
 * GET /support-directories
 * Obtener lista de directorios de apoyo
 * Query params: categoria, municipio, search, page, limit
 */
router.get('/', optionalAuth, validatePagination, async (req, res) => {
  await controller.getDirectories(req, res);
});

/**
 * GET /support-directories/stats
 * Obtener estadísticas de directorios
 */
router.get('/stats', optionalAuth, async (req, res) => {
  await controller.getStatistics(req, res);
});

/**
 * GET /support-directories/categories
 * Obtener categorías de directorios
 */
router.get('/categories', optionalAuth, async (req, res) => {
  await controller.getCategories(req, res);
});

/**
 * GET /support-directories/nearby
 * Buscar directorios cercanos por coordenadas
 * Query params: lat, lng, radius
 */
router.get('/nearby', optionalAuth, async (req, res) => {
  await controller.getNearbyDirectories(req, res);
});

/**
 * GET /support-directories/:id
 * Obtener directorio específico por ID
 */
router.get('/:id', optionalAuth, async (req, res) => {
  await controller.getDirectoryById(req, res);
});

/**
 * POST /support-directories/:id/call
 * Registrar llamada a directorio (requiere autenticación)
 */
router.post('/:id/call', authenticateToken, async (req, res) => {
  await controller.logCall(req, res);
});

module.exports = router;
