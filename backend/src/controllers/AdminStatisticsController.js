const AdminStatisticsService = require('../services/AdminStatisticsService');

class AdminStatisticsController {
  constructor() {
    this.service = new AdminStatisticsService();
  }

  /**
   * Obtener estadísticas generales del sistema
   */
  async getGeneralStats(req, res) {
    try {
      const result = await this.service.getGeneralStats();
      res.json({
        success: true,
        message: 'Estadísticas generales obtenidas exitosamente',
        data: result
      });
    } catch (error) {
      console.error('Error en getGeneralStats:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtener estadísticas de usuarios
   */
  async getUserStats(req, res) {
    try {
      const result = await this.service.getUserStats();
      res.json({
        success: true,
        message: 'Estadísticas de usuarios obtenidas exitosamente',
        data: result
      });
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
   * Obtener estadísticas de eventos
   */
  async getEventStats(req, res) {
    try {
      const result = await this.service.getEventStats();
      res.json({
        success: true,
        message: 'Estadísticas de eventos obtenidas exitosamente',
        data: result
      });
    } catch (error) {
      console.error('Error en getEventStats:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtener estadísticas de PDFs
   */
  async getPDFStats(req, res) {
    try {
      const result = await this.service.getPDFStats();
      res.json({
        success: true,
        message: 'Estadísticas de PDFs obtenidas exitosamente',
        data: result
      });
    } catch (error) {
      console.error('Error en getPDFStats:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtener estadísticas de entradas semanales (moms week)
   */
  async getWeeklyEntryStats(req, res) {
    try {
      const result = await this.service.getWeeklyEntryStats();
      res.json({
        success: true,
        message: 'Estadísticas de entradas semanales obtenidas exitosamente',
        data: result
      });
    } catch (error) {
      console.error('Error en getWeeklyEntryStats:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtener actividad mensual (usuarios por mes)
   */
  async getMonthlyActivity(req, res) {
    try {
      const result = await this.service.getMonthlyActivity();
      res.json({
        success: true,
        message: 'Actividad mensual obtenida exitosamente',
        data: result
      });
    } catch (error) {
      console.error('Error en getMonthlyActivity:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtener estadísticas de PDFs por período
   */
  async getPDFPeriodStats(req, res) {
    try {
      const result = await this.service.getPDFPeriodStats();
      res.json({
        success: true,
        message: 'Estadísticas de PDFs por período obtenidas exitosamente',
        data: result
      });
    } catch (error) {
      console.error('Error en getPDFPeriodStats:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }
}

module.exports = AdminStatisticsController;
