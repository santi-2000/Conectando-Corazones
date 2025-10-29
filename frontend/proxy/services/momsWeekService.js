import apiClient, { API_ENDPOINTS } from '../apiClient';

/**
 * Servicio para manejar Moms Week
 */
class MomsWeekService {
  /**
   * Obtener semana actual del usuario
   */
  async getCurrentWeek(userId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.MOMS_WEEK.CURRENT_WEEK}/${userId}/current-week`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener semana actual:', error);
      throw error;
    }
  }

  /**
   * Generar libro semanal
   */
  async generateWeeklyBook(userId, bookData) {
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.MOMS_WEEK.GENERATE_BOOK}/${userId}/generate-book`,
        bookData
      );
      return response.data;
    } catch (error) {
      console.error('Error al generar libro semanal:', error);
      throw error;
    }
  }

  /**
   * Obtener historial de semanas
   */
  async getWeekHistory(userId, filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.year) queryParams.append('year', filters.year);

      const endpoint = `${API_ENDPOINTS.MOMS_WEEK.HISTORY}/${userId}/history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error al obtener historial de semanas:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de semanas
   */
  async getWeekStats(userId, filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.year) queryParams.append('year', filters.year);
      if (filters.month) queryParams.append('month', filters.month);

      const endpoint = `${API_ENDPOINTS.MOMS_WEEK.STATS}/${userId}/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de semanas:', error);
      throw error;
    }
  }

  /**
   * Obtener semana específica
   */
  async getWeekById(userId, weekId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.MOMS_WEEK.HISTORY}/${userId}/weeks/${weekId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener semana:', error);
      throw error;
    }
  }
}

export default new MomsWeekService();
