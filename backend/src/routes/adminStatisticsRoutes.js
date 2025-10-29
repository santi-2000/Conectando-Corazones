const express = require('express');
const AdminStatisticsController = require('../controllers/AdminStatisticsController');
const { optionalAuth, requireAdmin } = require('../../middleware/auth');

const router = express.Router();
const controller = new AdminStatisticsController();

// Middleware personalizado para verificar administrador (ya importado desde auth.js)

// Rutas para estadísticas de administración
router.get('/admin/statistics/general', optionalAuth, requireAdmin, async (req, res) => {
  await controller.getGeneralStats(req, res);
});

router.get('/admin/statistics/users', optionalAuth, requireAdmin, async (req, res) => {
  await controller.getUserStats(req, res);
});

router.get('/admin/statistics/events', optionalAuth, requireAdmin, async (req, res) => {
  await controller.getEventStats(req, res);
});

router.get('/admin/statistics/pdfs', optionalAuth, requireAdmin, async (req, res) => {
  await controller.getPDFStats(req, res);
});

router.get('/admin/statistics/weekly-entries', optionalAuth, requireAdmin, async (req, res) => {
  await controller.getWeeklyEntryStats(req, res);
});

router.get('/admin/statistics/monthly-activity', optionalAuth, requireAdmin, async (req, res) => {
  await controller.getMonthlyActivity(req, res);
});

router.get('/admin/statistics/pdf-periods', optionalAuth, requireAdmin, async (req, res) => {
  await controller.getPDFPeriodStats(req, res);
});

module.exports = router;
