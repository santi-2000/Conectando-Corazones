/**
 * Routes para Libros Educativos
 * Define los endpoints del módulo
 */

const express = require('express');
const EducationalBookController = require('../controllers/EducationalBookController');
const { authenticateToken, optionalAuth } = require('../../middleware/auth');
const { validatePagination, handleValidationErrors } = require('../../middleware/validation');
const { param, query } = require('express-validator');

const router = express.Router();
const controller = new EducationalBookController();

// Validaciones específicas para las rutas de libros educativos
const validateBookId = [
  param('id').isInt({ min: 1 }).withMessage('El ID del libro debe ser un número entero positivo.'),
  handleValidationErrors
];

const validateLevel = [
  param('nivel').isIn(['primaria', 'secundaria']).withMessage('El nivel debe ser "primaria" o "secundaria".'),
  handleValidationErrors
];

const validateGetBooks = [
  query('nivel_educativo')
    .optional()
    .isIn(['primaria', 'secundaria'])
    .withMessage('El nivel educativo debe ser "primaria" o "secundaria".'),
  query('materia')
    .optional()
    .isString()
    .trim()
    .notEmpty()
    .withMessage('La materia no puede estar vacía.'),
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
 * GET /educational-books
 * Obtener lista de libros educativos
 * Query params: nivel_educativo, materia, search, page, limit
 */
router.get('/', optionalAuth, validateGetBooks, async (req, res) => {
  await controller.getBooks(req, res);
});

/**
 * GET /educational-books/stats
 * Obtener estadísticas de libros
 */
router.get('/stats', optionalAuth, async (req, res) => {
  await controller.getStatistics(req, res);
});

/**
 * GET /educational-books/level/:nivel
 * Obtener libros por nivel educativo
 */
router.get('/level/:nivel', optionalAuth, validateLevel, async (req, res) => {
  await controller.getBooksByLevel(req, res);
});

/**
 * GET /educational-books/level/:nivel/subjects
 * Obtener materias disponibles por nivel
 */
router.get('/level/:nivel/subjects', optionalAuth, validateLevel, async (req, res) => {
  await controller.getSubjectsByLevel(req, res);
});

/**
 * GET /educational-books/:id
 * Obtener libro específico por ID
 */
router.get('/:id', optionalAuth, validateBookId, async (req, res) => {
  await controller.getBookById(req, res);
});

/**
 * POST /educational-books/:id/download
 * Registrar descarga de libro (requiere autenticación)
 */
router.post('/:id/download', authenticateToken, validateBookId, async (req, res) => {
  await controller.logDownload(req, res);
});

module.exports = router;
