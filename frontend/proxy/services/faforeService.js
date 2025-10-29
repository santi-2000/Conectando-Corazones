import apiClient from '../apiClient';

export const faforeService = {
  /**
   * Obtener información de FAFORE
   * @returns {Promise<Object>}
   */
  async getInfo() {
    try {
      console.log('🔍 faforeService.getInfo: Iniciando petición...');
      const response = await apiClient.get('/fafore/info');
      console.log('✅ faforeService.getInfo: Respuesta recibida:', response);
      console.log('📊 faforeService.getInfo: response.data:', response.data);
      // La respuesta ya es el objeto completo, no necesita .data
      return response;
    } catch (error) {
      console.error('❌ faforeService.getInfo: Error:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener información de FAFORE');
    }
  },

  /**
   * Actualizar información de FAFORE
   * @param {Object} data - Datos a actualizar
   * @returns {Promise<Object>}
   */
  async updateInfo(data) {
    try {
      const response = await apiClient.put('/fafore/info', data);
      return response.data;
    } catch (error) {
      console.error('Error en faforeService.updateInfo:', error);
      throw new Error(error.response?.data?.message || 'Error al actualizar información de FAFORE');
    }
  },

  /**
   * Obtener estadísticas de FAFORE
   * @returns {Promise<Object>}
   */
  async getStats() {
    try {
      const response = await apiClient.get('/fafore/stats');
      return response.data;
    } catch (error) {
      console.error('Error en faforeService.getStats:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas de FAFORE');
    }
  },
};