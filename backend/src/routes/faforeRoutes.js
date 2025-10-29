const express = require('express');
const FaforeController = require('../controllers/FaforeController');
const { optionalAuth } = require('../../middleware/auth');

const router = express.Router();
const controller = new FaforeController();

// ===== ENDPOINTS DE INFORMACIÓN DE FAFORE =====

/**
 * @route GET /fafore/info
 * @desc Obtener información completa de FAfore
 * @access Public
 */
router.get('/info', optionalAuth, async (req, res) => {
  await controller.getInfo(req, res);
});

/**
 * @route GET /fafore/basic
 * @desc Obtener información básica de FAfore
 * @access Public
 */
router.get('/basic', optionalAuth, async (req, res) => {
  await controller.getBasicInfo(req, res);
});

/**
 * @route GET /fafore/contact
 * @desc Obtener información de contacto
 * @access Public
 */
router.get('/contact', optionalAuth, async (req, res) => {
  await controller.getContactInfo(req, res);
});

/**
 * @route GET /fafore/services
 * @desc Obtener servicios de FAfore
 * @access Public
 */
router.get('/services', optionalAuth, async (req, res) => {
  await controller.getServices(req, res);
});

/**
 * @route GET /fafore/schedule
 * @desc Obtener horarios de atención
 * @access Public
 */
router.get('/schedule', optionalAuth, async (req, res) => {
  await controller.getSchedule(req, res);
});

/**
 * @route GET /fafore/legal
 * @desc Obtener información legal
 * @access Public
 */
router.get('/legal', optionalAuth, async (req, res) => {
  await controller.getLegalInfo(req, res);
});

/**
 * @route GET /fafore/values
 * @desc Obtener valores de la organización
 * @access Public
 */
router.get('/values', optionalAuth, async (req, res) => {
  await controller.getValues(req, res);
});

/**
 * @route GET /fafore/colors
 * @desc Obtener colores de la marca
 * @access Public
 */
router.get('/colors', optionalAuth, async (req, res) => {
  await controller.getBrandColors(req, res);
});

module.exports = router;
