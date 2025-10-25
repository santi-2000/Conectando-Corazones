const DiaryService = require('../services/DiaryService');

/**
 * Controlador para manejar las peticiones HTTP del diario
 * pantalla de diario diario con diseño colorido y emotivo
 */
class DiaryController {
  constructor() {
    this.diaryService = new DiaryService();
  }

  /**
   * Obtener entrada del día
   * GET /api/v1/diary/:userId/daily/:date
   */
  async getDailyEntry(req, res) {
    try {
      const { userId, date } = req.params;

      if (!userId || !date) {
        return res.status(400).json({
          success: false,
          error: 'Parámetros requeridos',
          message: 'userId y date son requeridos'
        });
      }

      const result = await this.diaryService.getDailyEntry(userId, date);
      
      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error('Error en getDailyEntry:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Crear o actualizar entrada del día
   * POST /api/v1/diary/:userId/daily-entry
   */
  async saveDailyEntry(req, res) {
    try {
      const { userId } = req.params;
      const { fecha, titulo, contenido, fotos, emocion, emocion_emoji, tags } = req.body;

      if (!userId || !fecha || !contenido) {
        return res.status(400).json({
          success: false,
          error: 'Datos requeridos',
          message: 'userId, fecha y contenido son requeridos'
        });
      }

      const entryData = {
        fecha,
        titulo,
        contenido,
        fotos: fotos || [],
        emocion,
        emocion_emoji,
        tags: tags || []
      };

      const result = await this.diaryService.saveDailyEntry(userId, entryData);
      
      if (!result.success) {
        return res.status(400).json(result);
      }

      res.status(201).json(result);
    } catch (error) {
      console.error('Error en saveDailyEntry:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtener entradas de una semana
   * GET /api/v1/diary/:userId/weekly
   */
  async getWeeklyEntries(req, res) {
    try {
      const { userId } = req.params;
      const { fechaInicio, fechaFin } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'Parámetros requeridos',
          message: 'userId es requerido'
        });
      }

      // Si no se proporcionan fechas, usar la semana actual
      let startDate = fechaInicio;
      let endDate = fechaFin;

      if (!startDate || !endDate) {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Lunes
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Domingo

        startDate = startOfWeek.toISOString().split('T')[0];
        endDate = endOfWeek.toISOString().split('T')[0];
      }

      const result = await this.diaryService.getWeeklyEntries(userId, startDate, endDate);
      res.json(result);
    } catch (error) {
      console.error('Error en getWeeklyEntries:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtener historial de entradas
   * GET /api/v1/diary/:userId/history
   */
  async getDiaryHistory(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'Parámetros requeridos',
          message: 'userId es requerido'
        });
      }

      const pagination = { page: parseInt(page), limit: parseInt(limit) };
      const result = await this.diaryService.getDiaryHistory(userId, pagination);
      res.json(result);
    } catch (error) {
      console.error('Error en getDiaryHistory:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Eliminar entrada del día
   * DELETE /api/v1/diary/:userId/daily/:date
   */
  async deleteDailyEntry(req, res) {
    try {
      const { userId, date } = req.params;

      if (!userId || !date) {
        return res.status(400).json({
          success: false,
          error: 'Parámetros requeridos',
          message: 'userId y date son requeridos'
        });
      }

      const result = await this.diaryService.deleteDailyEntry(userId, date);
      
      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error('Error en deleteDailyEntry:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtener estadísticas del usuario
   * GET /api/v1/diary/:userId/stats
   */
  async getUserStats(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'Parámetros requeridos',
          message: 'userId es requerido'
        });
      }

      const result = await this.diaryService.getUserStats(userId);
      res.json(result);
    } catch (error) {
      console.error('Error en getUserStats:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }
}

module.exports = DiaryController;
