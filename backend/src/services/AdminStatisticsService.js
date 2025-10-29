const AdminStatisticsRepository = require('../repositories/AdminStatisticsRepository');

class AdminStatisticsService {
  constructor() {
    this.repository = new AdminStatisticsRepository();
  }

  /**
   * Obtener estadísticas generales del sistema
   */
  async getGeneralStats() {
    try {
      const [
        userStats,
        eventStats,
        pdfStats,
        weeklyEntryStats
      ] = await Promise.all([
        this.repository.getUserStats(),
        this.repository.getEventStats(),
        this.repository.getPDFStats(),
        this.repository.getWeeklyEntryStats()
      ]);

      return {
        usuarios: userStats.total,
        eventos: eventStats.total,
        pdfs: pdfStats.total,
        entradasSemanales: weeklyEntryStats.total,
        resumen: {
          totalUsuarios: userStats.total,
          totalEventos: eventStats.total,
          totalPDFs: pdfStats.total,
          totalEntradasSemanales: weeklyEntryStats.total
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas generales: ${error.message}`);
    }
  }

  /**
   * Obtener estadísticas de usuarios
   */
  async getUserStats() {
    try {
      const stats = await this.repository.getUserStats();
      return {
        total: stats.total,
        esteMes: stats.esteMes,
        estaSemana: stats.estaSemana,
        hoy: stats.hoy,
        crecimiento: stats.crecimiento
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas de usuarios: ${error.message}`);
    }
  }

  /**
   * Obtener estadísticas de eventos
   */
  async getEventStats() {
    try {
      const stats = await this.repository.getEventStats();
      return {
        total: stats.total,
        esteMes: stats.esteMes,
        estaSemana: stats.estaSemana,
        hoy: stats.hoy,
        porTipo: stats.porTipo
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas de eventos: ${error.message}`);
    }
  }

  /**
   * Obtener estadísticas de PDFs
   */
  async getPDFStats() {
    try {
      const stats = await this.repository.getPDFStats();
      return {
        total: stats.total,
        esteMes: stats.esteMes,
        estaSemana: stats.estaSemana,
        hoy: stats.hoy,
        promedioDiario: stats.promedioDiario
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas de PDFs: ${error.message}`);
    }
  }

  /**
   * Obtener estadísticas de entradas semanales
   */
  async getWeeklyEntryStats() {
    try {
      const stats = await this.repository.getWeeklyEntryStats();
      return {
        total: stats.total,
        esteMes: stats.esteMes,
        estaSemana: stats.estaSemana,
        hoy: stats.hoy,
        promedioDiario: stats.promedioDiario
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas de entradas semanales: ${error.message}`);
    }
  }

  /**
   * Obtener actividad mensual (usuarios por mes)
   */
  async getMonthlyActivity() {
    try {
      const activity = await this.repository.getMonthlyActivity();
      return {
        meses: activity.meses,
        usuarios: activity.usuarios,
        total: activity.total,
        crecimiento: activity.crecimiento
      };
    } catch (error) {
      throw new Error(`Error al obtener actividad mensual: ${error.message}`);
    }
  }

  /**
   * Obtener estadísticas de PDFs por período
   */
  async getPDFPeriodStats() {
    try {
      const stats = await this.repository.getPDFPeriodStats();
      return {
        estaSemana: stats.estaSemana,
        esteMes: stats.esteMes,
        totalAcumulado: stats.totalAcumulado,
        promedioDiario: stats.promedioDiario,
        tendencia: stats.tendencia
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas de PDFs por período: ${error.message}`);
    }
  }
}

module.exports = AdminStatisticsService;
