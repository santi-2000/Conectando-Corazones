import apiClient, { API_ENDPOINTS } from '../apiClient';

/**
 * Servicio para manejar lecturas infantiles
 */
class ChildrenReadingsService {
  /**
   * Obtener lista de lecturas infantiles
   */
  async getReadings(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.ageGroup) queryParams.append('ageGroup', filters.ageGroup);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.search) queryParams.append('search', filters.search);

      const endpoint = `${API_ENDPOINTS.CHILDREN_READINGS.LIST}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error al obtener lecturas infantiles:', error);
      throw error;
    }
  }

  /**
   * Obtener lecturas recomendadas
   */
  async getRecommendedReadings(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.ageGroup) queryParams.append('ageGroup', filters.ageGroup);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.limit) queryParams.append('limit', filters.limit);

      const endpoint = `${API_ENDPOINTS.CHILDREN_READINGS.RECOMMENDED}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error al obtener lecturas recomendadas:', error);
      throw error;
    }
  }

  /**
   * Obtener lectura por ID
   */
  async getReadingById(readingId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CHILDREN_READINGS.LIST}/${readingId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener lectura:', error);
      throw error;
    }
  }

  /**
   * Obtener lecturas por grupo de edad
   */
  async getReadingsByAgeGroup(ageGroup, filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('ageGroup', ageGroup);
      
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);

      const endpoint = `${API_ENDPOINTS.CHILDREN_READINGS.LIST}?${queryParams.toString()}`;
      
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error al obtener lecturas por grupo de edad:', error);
      throw error;
    }
  }

  /**
   * Obtener categorías disponibles
   */
  async getCategories() {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CHILDREN_READINGS.LIST}/categories`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    }
  }
}

export default new ChildrenReadingsService();
