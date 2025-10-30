import apiClient from '../apiClient';

export const momsWeekService = {
  /**
   * Obtener semana actual
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>}
   */
  async getCurrentWeek(userId) {
    try {
      console.log('🔍 momsWeekService.getCurrentWeek: Iniciando petición...');
      const response = await apiClient.get(`/moms-week/${userId}/current-week`);
      console.log('✅ momsWeekService.getCurrentWeek: Respuesta recibida:', response);
      return response;
    } catch (error) {
      console.error('❌ momsWeekService.getCurrentWeek: Error:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener semana actual');
    }
  },

  /**
   * Obtener estadísticas de la semana
   * @param {string} userId - ID del usuario
   * @param {string} weekId - ID de la semana
   * @returns {Promise<Object>}
   */
  async getWeekStats(userId, weekId) {
    try {
      console.log('🔍 momsWeekService.getWeekStats: Iniciando petición...');
      const response = await apiClient.get(`/moms-week/${userId}/stats/${weekId}`);
      console.log('✅ momsWeekService.getWeekStats: Respuesta recibida:', response);
      return response;
    } catch (error) {
      console.error('❌ momsWeekService.getWeekStats: Error:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener estadísticas de la semana');
    }
  },

  /**
   * Obtener historial de semanas
   * @param {string} userId - ID del usuario
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Promise<Object>}
   */
  async getWeekHistory(userId, filters = {}) {
    try {
      console.log('🔍 momsWeekService.getWeekHistory: Iniciando petición...');
      const response = await apiClient.get(`/moms-week/${userId}/history`, { params: filters });
      console.log('✅ momsWeekService.getWeekHistory: Respuesta recibida:', response);
      return response;
    } catch (error) {
      console.error('❌ momsWeekService.getWeekHistory: Error:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener historial de semanas');
    }
  },

  /**
   * Crear nueva semana
   * @param {string} userId - ID del usuario
   * @param {Object} weekData - Datos de la semana
   * @returns {Promise<Object>}
   */
  async createWeek(userId, weekData) {
    try {
      console.log('🔍 momsWeekService.createWeek: Iniciando petición...');
      const response = await apiClient.post(`/moms-week/${userId}/create`, weekData);
      console.log('✅ momsWeekService.createWeek: Respuesta recibida:', response);
      return response;
    } catch (error) {
      console.error('❌ momsWeekService.createWeek: Error:', error);
      throw new Error(error.response?.data?.message || 'Error al crear nueva semana');
    }
  },

  /**
   * Generar libro semanal
   * @param {string} userId - ID del usuario
   * @param {string} weekId - ID de la semana
   * @returns {Promise<Object>}
   */
  async generateWeeklyBook(userId, weekId) {
    try {
      console.log('🔍 momsWeekService.generateWeeklyBook: Iniciando petición...');
      const response = await apiClient.post(`/moms-week/${userId}/generate-book/${weekId}`);
      console.log('✅ momsWeekService.generateWeeklyBook: Respuesta recibida:', response);
      return response;
    } catch (error) {
      console.error('❌ momsWeekService.generateWeeklyBook: Error:', error);
      throw new Error(error.response?.data?.message || 'Error al generar libro semanal');
    }
  }

  ,
  /**
   * Obtener el último PDF generado para el usuario
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getLatestPdf(userId) {
    try {
      console.log('🔍 momsWeekService.getLatestPdf: Iniciando petición...');
      const response = await apiClient.get(`/moms-week/${userId}/weekly-latest-pdf`);
      console.log('✅ momsWeekService.getLatestPdf: Respuesta recibida:', response);
      return response;
    } catch (error) {
      console.error('❌ momsWeekService.getLatestPdf: Error:', error);
      throw new Error(error.response?.data?.message || 'No hay PDFs generados aún');
    }
  }
};