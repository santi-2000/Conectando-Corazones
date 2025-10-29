import apiClient, { API_ENDPOINTS } from '../apiClient';

/**
 * Servicio para manejar diario
 */
class DiaryService {
  /**
   * Obtener entradas del diario
   */
  async getEntries(userId, filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.date) queryParams.append('date', filters.date);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);

      const endpoint = `${API_ENDPOINTS.DIARY.ENTRIES}/${userId}/entries${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error al obtener entradas del diario:', error);
      throw error;
    }
  }

  /**
   * Crear nueva entrada del diario
   */
  async createEntry(userId, entryData) {
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.DIARY.CREATE}/${userId}/entries`,
        entryData
      );
      return response.data;
    } catch (error) {
      console.error('Error al crear entrada del diario:', error);
      throw error;
    }
  }

  /**
   * Actualizar entrada del diario
   */
  async updateEntry(userId, entryId, entryData) {
    try {
      const response = await apiClient.put(
        `${API_ENDPOINTS.DIARY.UPDATE}/${userId}/entries/${entryId}`,
        entryData
      );
      return response.data;
    } catch (error) {
      console.error('Error al actualizar entrada del diario:', error);
      throw error;
    }
  }

  /**
   * Eliminar entrada del diario
   */
  async deleteEntry(userId, entryId) {
    try {
      const response = await apiClient.delete(
        `${API_ENDPOINTS.DIARY.DELETE}/${userId}/entries/${entryId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error al eliminar entrada del diario:', error);
      throw error;
    }
  }

  /**
   * Obtener entrada por ID
   */
  async getEntryById(userId, entryId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.DIARY.ENTRIES}/${userId}/entries/${entryId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener entrada del diario:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas del diario
   */
  async getDiaryStats(userId, filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.year) queryParams.append('year', filters.year);
      if (filters.month) queryParams.append('month', filters.month);

      const endpoint = `${API_ENDPOINTS.DIARY.STATS}/${userId}/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas del diario:', error);
      throw error;
    }
  }

  /**
   * Generar PDF del diario
   */
  async generateDiaryPDF(userId, filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      if (filters.weekId) queryParams.append('weekId', filters.weekId);

      const endpoint = `${API_ENDPOINTS.DIARY.ENTRIES}/${userId}/generate-pdf${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error al generar PDF del diario:', error);
      throw error;
    }
  }
}

export default new DiaryService();
