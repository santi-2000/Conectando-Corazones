import apiClient, { API_ENDPOINTS } from '../apiClient';

/**
 * Servicio para manejar calendario
 */
class CalendarService {
  /**
   * Obtener eventos del calendario
   */
  async getEvents(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);

      const endpoint = `${API_ENDPOINTS.CALENDAR.EVENTS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error al obtener eventos del calendario:', error);
      throw error;
    }
  }

  /**
   * Crear nuevo evento
   */
  async createEvent(eventData) {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.CALENDAR.CREATE,
        eventData
      );
      return response.data;
    } catch (error) {
      console.error('Error al crear evento:', error);
      throw error;
    }
  }

  /**
   * Actualizar evento
   */
  async updateEvent(eventId, eventData) {
    try {
      const response = await apiClient.put(
        `${API_ENDPOINTS.CALENDAR.UPDATE}/${eventId}`,
        eventData
      );
      return response.data;
    } catch (error) {
      console.error('Error al actualizar evento:', error);
      throw error;
    }
  }

  /**
   * Eliminar evento
   */
  async deleteEvent(eventId) {
    try {
      const response = await apiClient.delete(
        `${API_ENDPOINTS.CALENDAR.DELETE}/${eventId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      throw error;
    }
  }

  /**
   * Obtener evento por ID
   */
  async getEventById(eventId) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CALENDAR.EVENTS}/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener evento:', error);
      throw error;
    }
  }

  /**
   * Obtener eventos por fecha
   */
  async getEventsByDate(date) {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.CALENDAR.EVENTS}/date/${date}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener eventos por fecha:', error);
      throw error;
    }
  }

  /**
   * Obtener eventos por tipo
   */
  async getEventsByType(type, filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('type', type);
      
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);

      const endpoint = `${API_ENDPOINTS.CALENDAR.EVENTS}/type/${type}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error al obtener eventos por tipo:', error);
      throw error;
    }
  }
}

export default new CalendarService();
