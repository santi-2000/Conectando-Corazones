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

// Ruta de prueba simple
router.get('/:userId/test-pdf', (req, res) => {
  console.log('🔍 Ruta test-pdf llamada:', req.params);
  res.json({ success: true, message: 'Ruta test-pdf funciona', params: req.params });
});

// Generar PDF del diario
router.post('/:userId/generate-pdf', (req, res) => {
  console.log('🔍 Ruta generate-pdf llamada:', req.params);
  diaryController.generatePDF(req, res);
});

// Obtener entrada específica por ID para editar
router.get('/:userId/entries/:entryId',
  diaryController.getEntryById.bind(diaryController)
);

// Actualizar entrada específica por ID
router.put('/:userId/entries/:entryId',
  diaryController.updateEntry.bind(diaryController)
);

// Eliminar entrada específica por ID
router.delete('/:userId/entries/:entryId',
  diaryController.deleteEntry.bind(diaryController)
);

// Obtener días de la semana con estado (completado/pendiente)
router.get('/:userId/weekly-days',
  diaryController.getWeeklyDays.bind(diaryController)
);

// Purga de entradas
router.delete('/:userId/weekly',
  diaryController.purgeWeekly.bind(diaryController)
);

router.delete('/:userId/all',
  diaryController.purgeAll.bind(diaryController)
);

module.exports = router;
