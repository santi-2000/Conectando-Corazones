import apiClient, { API_ENDPOINTS } from '../apiClient';

/**
 * Servicio para manejar información de FAFORE
 */
class FaforeService {
  /**
   * Obtener información de FAFORE
   */
  async getInfo() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.FAFORE.INFO);
      return response.data;
    } catch (error) {
      console.error('Error al obtener información de FAFORE:', error);
      throw error;
    }
  }

  /**
   * Obtener servicios de FAFORE
   */
  async getServices() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.FAFORE.SERVICES);
      return response.data;
    } catch (error) {
      console.error('Error al obtener servicios de FAFORE:', error);
      throw error;
    }
  }
}

export default new FaforeService();
