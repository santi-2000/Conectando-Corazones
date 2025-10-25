/**
 * Routes para Lecturas Infantiles
 * Define los endpoints del módulo
 */

const express = require('express');
const ChildrenReadingsController = require('../controllers/ChildrenReadingsController');
const { optionalAuth } = require('../../middleware/auth');
const { validatePagination, handleValidationErrors } = require('../../middleware/validation');
const { param, query } = require('express-validator');

const router = express.Router();
const controller = new ChildrenReadingsController();

// Validaciones específicas para las rutas de lecturas infantiles
const validateBookId = [
  param('id').isInt({ min: 1 }).withMessage('El ID del libro debe ser un número entero positivo.'),
  handleValidationErrors
];

const validateGetBooks = [
  query('categoria')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('La categoría no puede estar vacía.'),
  query('search')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('El término de búsqueda no puede estar vacío.'),
  validatePagination,
  handleValidationErrors
];

/**
 * GET /children-readings/virtual-library
 * Obtener información de la biblioteca virtual
 */
router.get('/virtual-library', optionalAuth, async (req, res) => {
  await controller.getVirtualLibrary(req, res);
});

/**
 * GET /children-readings/recommended
 * Obtener libros infantiles recomendados
 * Query params: categoria, search, page, limit
 */
router.get('/recommended', optionalAuth, validateGetBooks, async (req, res) => {
  await controller.getRecommendedBooks(req, res);
});

/**
 * GET /children-readings/categories
 * Obtener categorías de libros infantiles
 */
router.get('/categories', optionalAuth, async (req, res) => {
  await controller.getCategories(req, res);
});

/**
 * GET /children-readings/stats
 * Obtener estadísticas de libros infantiles
 */
router.get('/stats', optionalAuth, async (req, res) => {
  await controller.getStatistics(req, res);
});

/**
 * GET /children-readings/:id
 * Obtener libro infantil específico por ID
 */
router.get('/:id', optionalAuth, validateBookId, async (req, res) => {
  await controller.getBookById(req, res);
});

module.exports = router;
