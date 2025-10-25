const express = require('express');
const DiaryController = require('../controllers/DiaryController');
const { handleValidationErrors } = require('../../middleware/validation');

const router = express.Router();
const diaryController = new DiaryController();

/**
 * Rutas del diario diario
 * pantalla de diario diario con diseño colorido y emotivo
 */

// Obtener entrada del día
router.get('/:userId/daily/:date', 
  handleValidationErrors,
  diaryController.getDailyEntry.bind(diaryController)
);

// Crear o actualizar entrada del día
router.post('/:userId/daily-entry',
  handleValidationErrors,
  diaryController.saveDailyEntry.bind(diaryController)
);

// Obtener entradas de una semana
router.get('/:userId/weekly',
  handleValidationErrors,
  diaryController.getWeeklyEntries.bind(diaryController)
);

// Obtener historial de entradas
router.get('/:userId/history',
  handleValidationErrors,
  diaryController.getDiaryHistory.bind(diaryController)
);

// Eliminar entrada del día
router.delete('/:userId/daily/:date',
  handleValidationErrors,
  diaryController.deleteDailyEntry.bind(diaryController)
);

// Obtener estadísticas del usuario
router.get('/:userId/stats',
  handleValidationErrors,
  diaryController.getUserStats.bind(diaryController)
);

module.exports = router;
