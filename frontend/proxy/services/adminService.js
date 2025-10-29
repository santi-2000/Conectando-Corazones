import apiClient, { API_ENDPOINTS } from '../apiClient';

/**
 * Servicio para manejar funcionalidades de administración
 */
class AdminService {
  /**
   * Obtener estadísticas de usuarios
   */
  async getUserStats() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.STATS_USERS);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de usuarios:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de eventos
   */
  async getEventStats() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.STATS_EVENTS);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de eventos:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de PDFs
   */
  async getPdfStats() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.STATS_PDFS);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de PDFs:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas semanales
   */
  async getWeeklyStats() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.STATS_WEEKLY);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas semanales:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas mensuales
   */
  async getMonthlyStats() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ADMIN.STATS_MONTHLY);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas mensuales:', error);
      throw error;
    }
  }

  /**
   * Obtener todas las estadísticas
   */
  async getAllStats() {
    try {
      const [users, events, pdfs, weekly, monthly] = await Promise.all([
        this.getUserStats(),
        this.getEventStats(),
        this.getPdfStats(),
        this.getWeeklyStats(),
        this.getMonthlyStats()
      ]);

      return {
        users,
        events,
        pdfs,
        weekly,
        monthly
      };
    } catch (error) {
      console.error('Error al obtener todas las estadísticas:', error);
      throw error;
    }
  }
}

export default new AdminService();
