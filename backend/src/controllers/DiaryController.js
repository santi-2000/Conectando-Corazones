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
        // Manejar duplicado explícitamente con 409
        const status = result.code === 'DUPLICATE_ENTRY' ? 409 : 400;
        return res.status(status).json(result);
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
        // Calcular lunes de la semana actual
        const dayOfWeek = today.getDay(); // 0 = Domingo, 1 = Lunes, etc.
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Si es domingo, retroceder 6 días
        startOfWeek.setDate(today.getDate() + mondayOffset);
        
        // Expandir el rango para incluir días anteriores si hay entradas
        // Retroceder 1 día adicional para incluir el domingo anterior si es necesario
        startOfWeek.setDate(startOfWeek.getDate() - 1);
        
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7); // Incluir 8 días total (del domingo anterior al domingo actual)

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

  /**
   * Generar PDF del diario
   * POST /api/v1/diary/:userId/generate-pdf
   */
  async generatePDF(req, res) {
    try {
      console.log('🔍 DiaryController.generatePDF llamada con:', req.params, req.body);
      const { userId } = req.params;
      const { weekId, pdfData } = req.body;

      if (!userId) {
        console.log('❌ userId no proporcionado');
        return res.status(400).json({
          success: false,
          error: 'Parámetros requeridos',
          message: 'userId es requerido'
        });
      }

      console.log('📄 Generando PDF para usuario:', userId);
      // Si viene pdfData desde screen14, usarlo directamente; si no, usar método tradicional
      const result = pdfData 
        ? await this.diaryService.generatePDFFromData(userId, pdfData)
        : await this.diaryService.generatePDF(userId, weekId);
      console.log('✅ PDF generado:', result.success);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error('❌ Error en generatePDF:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtener entrada específica por ID para editar
   * GET /api/v1/diary/:userId/entries/:entryId
   */
  async getEntryById(req, res) {
    try {
      const { userId, entryId } = req.params;

      if (!userId || !entryId) {
        return res.status(400).json({
          success: false,
          error: 'Parámetros requeridos',
          message: 'userId y entryId son requeridos'
        });
      }

      const result = await this.diaryService.getEntryById(userId, entryId);

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error('Error en getEntryById:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Actualizar entrada específica por ID
   * PUT /api/v1/diary/:userId/entries/:entryId
   */
  async updateEntry(req, res) {
    try {
      const { userId, entryId } = req.params;
      const { titulo, contenido, fotos, emocion, emocion_emoji, tags } = req.body;

      if (!userId || !entryId) {
        return res.status(400).json({
          success: false,
          error: 'Parámetros requeridos',
          message: 'userId y entryId son requeridos'
        });
      }

      const entryData = {
        titulo,
        contenido,
        fotos: fotos || [],
        emocion,
        emocion_emoji,
        tags: tags || []
      };

      const result = await this.diaryService.updateEntry(userId, entryId, entryData);

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error('Error en updateEntry:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Eliminar entrada específica por ID
   * DELETE /api/v1/diary/:userId/entries/:entryId
   */
  async deleteEntry(req, res) {
    try {
      const { userId, entryId } = req.params;

      if (!userId || !entryId) {
        return res.status(400).json({
          success: false,
          error: 'Parámetros requeridos',
          message: 'userId y entryId son requeridos'
        });
      }

      const result = await this.diaryService.deleteEntry(userId, entryId);

      if (!result.success) {
        return res.status(404).json(result);
      }

      res.json(result);
    } catch (error) {
      console.error('Error en deleteEntry:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtener días de la semana con estado (completado/pendiente)
   * GET /api/v1/diary/:userId/weekly-days
   */
  async getWeeklyDays(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'Parámetros requeridos',
          message: 'userId es requerido'
        });
      }

      const result = await this.diaryService.getWeeklyDays(userId);
      res.json(result);
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
   * DELETE /api/v1/diary/:userId/weekly
   * Eliminar entradas de la semana actual
   */
  async purgeWeekly(req, res) {
    try {
      const { userId } = req.params;
      const result = await this.diaryService.purgeWeeklyEntries(userId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
    }
  }

  /**
   * DELETE /api/v1/diary/:userId/all
   * Eliminar todas las entradas del usuario
   */
  async purgeAll(req, res) {
    try {
      const { userId } = req.params;
      const result = await this.diaryService.purgeAllEntries(userId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: 'Error interno del servidor', message: error.message });
    }
  }
}

module.exports = DiaryController;
