//pantalla de seguimiento semanal de mamás
/**
 * Controller para Moms Week
 * Maneja las peticiones HTTP para el seguimiento semanal de mamás
 */

const MomsWeekService = require('../services/MomsWeekService');

class MomsWeekController {
  constructor() {
    this.service = new MomsWeekService();
  }

  /**
   * GET /moms-week/current
   * Obtener información de la semana actual
   */
  async getCurrentWeek(req, res) {
    try {
      const { userId } = req.params;
      const result = await this.service.getCurrentWeek(userId);
      
      res.json({
        success: true,
        message: 'Información de la semana actual obtenida exitosamente',
        data: result.data
      });
    } catch (error) {
      console.error('Error en getCurrentWeek:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * GET /moms-week/progress
   * Obtener progreso de días completados
   */
  async getWeekProgress(req, res) {
    try {
      const { userId } = req.params;
      const result = await this.service.getWeekProgress(userId);
      
      res.json({
        success: true,
        message: 'Progreso de la semana obtenido exitosamente',
        data: result.data
      });
    } catch (error) {
      console.error('Error en getWeekProgress:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * GET /moms-week/statistics
   * Obtener estadísticas de la semana
   */
  async getWeekStatistics(req, res) {
    try {
      const { userId } = req.params;
      const result = await this.service.getWeekStatistics(userId);
      
      res.json({
        success: true,
        message: 'Estadísticas de la semana obtenidas exitosamente',
        data: result.data
      });
    } catch (error) {
      console.error('Error en getWeekStatistics:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * POST /moms-week/entry
   * Agregar entrada del día
   */
  async addDailyEntry(req, res) {
    try {
      const { userId } = req.params;
      const entryData = req.body;
      
      const result = await this.service.addDailyEntry(userId, entryData);

      if (!result.success) {
        const status = result.code === 'DUPLICATE_ENTRY' ? 409 : 400;
        return res.status(status).json(result);
      }

      res.json({
        success: true,
        message: 'Entrada del día agregada exitosamente',
        data: result.data
      });
    } catch (error) {
      console.error('Error en addDailyEntry:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * GET /moms-week/generate-book
   * Generar libro semanal
   */
  async generateWeeklyBook(req, res) {
    try {
      const { userId } = req.params;
      const result = await this.service.generateWeeklyBook(userId);
      
      res.json({
        success: true,
        message: 'Libro semanal generado exitosamente',
        data: result.data
      });
    } catch (error) {
      console.error('Error en generateWeeklyBook:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * GET /moms-week/:userId/weekly-latest-pdf
   * Obtener el PDF más reciente del usuario
   */
  async getLatestPDF(req, res) {
    try {
      const { userId } = req.params;
      const result = await this.service.getLatestPDF(userId);
      if (!result.success) {
        return res.status(404).json(result);
      }
      res.json(result);
    } catch (error) {
      console.error('Error en getLatestPDF:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * GET /moms-week/history
   * Obtener historial de semanas
   */
  async getWeekHistory(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      
      const result = await this.service.getWeekHistory(userId, { page, limit });
      
      res.json({
        success: true,
        message: 'Historial de semanas obtenido exitosamente',
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error en getWeekHistory:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  // ===== NUEVOS MÉTODOS PARA PANTALLAS ESPECÍFICAS =====

  /**
   * GET /moms-week/:userId/weekly-stats
   * Obtener estadísticas semanales (5 Fotos, 127 Palabras, 3 Feliz)
   */
  async getWeeklyStats(req, res) {
    try {
      const { userId } = req.params;
      const result = await this.service.getWeeklyStats(userId);
      
      res.json({
        success: true,
        message: 'Estadísticas semanales obtenidas exitosamente',
        data: result.data
      });
    } catch (error) {
      console.error('Error en getWeeklyStats:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * GET /moms-week/:userId/current-day
   * Obtener día actual de la semana (Día 3)
   */
  async getCurrentDay(req, res) {
    try {
      const { userId } = req.params;
      const result = await this.service.getCurrentDay(userId);
      
      res.json({
        success: true,
        message: 'Día actual obtenido exitosamente',
        data: result.data
      });
    } catch (error) {
      console.error('Error en getCurrentDay:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * GET /moms-week/:userId/weekly-progress-stars
   * Obtener progreso semanal con estrellas (⭐/☆)
   */
  async getWeeklyProgressStars(req, res) {
    try {
      const { userId } = req.params;
      const result = await this.service.getWeeklyProgressStars(userId);
      
      res.json({
        success: true,
        message: 'Progreso semanal con estrellas obtenido exitosamente',
        data: result.data
      });
    } catch (error) {
      console.error('Error en getWeeklyProgressStars:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * GET /moms-week/:userId/weekly-preview
   * Obtener vista previa del libro semanal
   */
  async getWeeklyPreview(req, res) {
    try {
      const { userId } = req.params;
      const result = await this.service.getWeeklyPreview(userId);
      
      res.json({
        success: true,
        message: 'Vista previa del libro semanal obtenida exitosamente',
        data: result.data
      });
    } catch (error) {
      console.error('Error en getWeeklyPreview:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * GET /moms-week/:userId/weekly-days
   * Obtener días de la semana con estado (completado/pendiente)
   */
  async getWeeklyDays(req, res) {
    try {
      const { userId } = req.params;
      const result = await this.service.getWeeklyDays(userId);
      
      res.json({
        success: true,
        message: 'Días de la semana obtenidos exitosamente',
        data: result.data
      });
    } catch (error) {
      console.error('Error en getWeeklyDays:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * POST /moms-week/:userId/generate-pdf
   * Generar PDF real del libro semanal
   */
  async generatePDF(req, res) {
    try {
      const { userId } = req.params;
      const result = await this.service.generatePDF(userId);
      
      res.json({
        success: true,
        message: 'PDF generado exitosamente',
        data: result.data
      });
    } catch (error) {
      console.error('Error en generatePDF:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * GET /moms-week/:userId/previous-days
   * Obtener lista de días anteriores con estado
   */
  async getPreviousDays(req, res) {
    try {
      const { userId } = req.params;
      const result = await this.service.getPreviousDays(userId);
      
      res.json({
        success: true,
        message: 'Días anteriores obtenidos exitosamente',
        data: result.data
      });
    } catch (error) {
      console.error('Error en getPreviousDays:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * GET /moms-week/:userId/day/:dayNumber
   * Obtener día específico para editar
   */
  async getSpecificDay(req, res) {
    try {
      const { userId, dayNumber } = req.params;
      const result = await this.service.getSpecificDay(userId, dayNumber);
      
      res.json({
        success: true,
        message: 'Día específico obtenido exitosamente',
        data: result.data
      });
    } catch (error) {
      console.error('Error en getSpecificDay:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * GET /moms-week/:userId/emotions
   * Obtener emociones disponibles (6 emociones con colores)
   */
  async getAvailableEmotions(req, res) {
    try {
      const result = await this.service.getAvailableEmotions();
      
      res.json({
        success: true,
        message: 'Emociones disponibles obtenidas exitosamente',
        data: result.data
      });
    } catch (error) {
      console.error('Error en getAvailableEmotions:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * GET /moms-week/:userId/pdf-preview
   * Obtener vista previa del PDF (HTML)
   */
  async getPDFPreview(req, res) {
    try {
      const { userId } = req.params;
      const result = await this.service.getPDFPreview(userId);
      
      res.setHeader('Content-Type', 'text/html');
      res.send(result.data.html);
    } catch (error) {
      console.error('Error en getPDFPreview:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * DELETE /moms-week/:userId/pdfs
   * Eliminar PDFs del usuario (opcionalmente por semana ?week=NN)
   */
  async purgePDFs(req, res) {
    try {
      const { userId } = req.params;
      const week = req.query.week ? parseInt(req.query.week, 10) : null;
      const w = Number.isNaN(week) ? null : week;
      const files = await this.service.purgePDFs(userId, w);
      let db = { data: { affectedRows: 0 } };
      if (req.query.db === 'true') {
        db = await this.service.purgePDFRecords(userId, w);
      }
      res.json({ success: true, message: 'PDFs eliminados', data: { files: files.data, db: db.data } });
    } catch (error) {
      console.error('Error en purgePDFs:', error);
      res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
    }
  }
}

module.exports = MomsWeekController;
