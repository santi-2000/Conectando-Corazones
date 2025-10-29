const express = require('express');
const router = express.Router();
const diagnosticController = require('../controllers/DiagnosticController');

// =============================================
// RUTAS DE DIAGNÓSTICO
// =============================================

/**
 * @route   GET /api/v1/diagnostic/system
 * @desc    Diagnóstico completo del sistema
 * @access  Public
 */
router.get('/system', diagnosticController.getSystemDiagnostic);

/**
 * @route   GET /api/v1/diagnostic/network
 * @desc    Diagnóstico de red
 * @access  Public
 */
router.get('/network', diagnosticController.getNetworkDiagnostic);

module.exports = router;
