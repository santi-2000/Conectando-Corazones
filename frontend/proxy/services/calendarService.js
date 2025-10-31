import apiClient from '../apiClient';

export const calendarService = {
  /**
   * Obtener eventos del calendario
   * @param {string} userId - ID del usuario
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Promise<Object>}
   */
  async getEvents(userId, filters = {}) {
    try {
      console.log('🔍 calendarService.getEvents: Iniciando petición...');
      const response = await apiClient.get(`/calendar/${userId}/events`, { params: filters });
      console.log('✅ calendarService.getEvents: Respuesta recibida:', response);
      return response;
    } catch (error) {
      console.error('❌ calendarService.getEvents: Error:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener eventos del calendario');
    }
  },

  /**
   * Crear nuevo evento
   * @param {string} userId - ID del usuario
   * @param {Object} eventData - Datos del evento
   * @returns {Promise<Object>}
   */
  async createEvent(userId, eventData) {
    try {
      console.log('🔍 calendarService.createEvent: Iniciando petición...');
      const response = await apiClient.post(`/calendar/${userId}/events`, eventData);
      console.log('✅ calendarService.createEvent: Respuesta recibida:', response);
      return response;
    } catch (error) {
      console.error('❌ calendarService.createEvent: Error:', error);
      throw new Error(error.response?.data?.message || 'Error al crear evento');
    }
  },

  /**
   * Actualizar evento
   * @param {string} userId - ID del usuario
   * @param {string} eventId - ID del evento
   * @param {Object} eventData - Datos actualizados del evento
   * @returns {Promise<Object>}
   */
  async updateEvent(userId, eventId, eventData) {
    try {
      console.log('🔍 calendarService.updateEvent: Iniciando petición...');
      const response = await apiClient.put(`/calendar/${userId}/event/${eventId}`, eventData);
      console.log('✅ calendarService.updateEvent: Respuesta recibida:', response);
      return response;
    } catch (error) {
      console.error('❌ calendarService.updateEvent: Error:', error);
      throw new Error(error.response?.data?.message || 'Error al actualizar evento');
    }
  },

  /**
   * Eliminar evento
   * @param {string} userId - ID del usuario
   * @param {string} eventId - ID del evento
   * @returns {Promise<Object>}
   */
  async deleteEvent(userId, eventId) {
    try {
      console.log('🔍 calendarService.deleteEvent: Iniciando petición...');
      const response = await apiClient.delete(`/calendar/${userId}/event/${eventId}`);
      console.log('✅ calendarService.deleteEvent: Respuesta recibida:', response);
      return response;
    } catch (error) {
      console.error('❌ calendarService.deleteEvent: Error:', error);
      throw new Error(error.response?.data?.message || 'Error al eliminar evento');
    }
  },

  /**
   * Obtener evento por ID
   * @param {string} userId - ID del usuario
   * @param {string} eventId - ID del evento
   * @returns {Promise<Object>}
   */
  async getEventById(userId, eventId) {
    try {
      console.log('🔍 calendarService.getEventById: Iniciando petición...');
      const response = await apiClient.get(`/calendar/${userId}/event/${eventId}`);
      console.log('✅ calendarService.getEventById: Respuesta recibida:', response);
      return response;
    } catch (error) {
      console.error('❌ calendarService.getEventById: Error:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener evento');
    }
  },

  /**
   * Obtener eventos por fecha
   * @param {string} userId - ID del usuario
   * @param {string} date - Fecha en formato YYYY-MM-DD
   * @returns {Promise<Object>}
   */
  async getEventsByDate(userId, date) {
    try {
      console.log('🔍 calendarService.getEventsByDate: Iniciando petición...');
      const response = await apiClient.get(`/calendar/${userId}/date/${date}`);
      console.log('✅ calendarService.getEventsByDate: Respuesta recibida:', response);
      return response;
    } catch (error) {
      console.error('❌ calendarService.getEventsByDate: Error:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener eventos por fecha');
    }
  }
};