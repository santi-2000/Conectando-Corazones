const express = require('express');
const router = express.Router();
const networkController = require('../controllers/NetworkController');

// =============================================
// RUTAS DE RED
// =============================================

/**
 * @route   GET /api/v1/network-info
 * @desc    Obtener información de red del servidor
 * @access  Public
 */
router.get('/network-info', networkController.getNetworkInfo);

/**
 * @route   GET /api/v1/health
 * @desc    Health check con información de red
 * @access  Public
 */
router.get('/health', networkController.healthCheck);

module.exports = router;
