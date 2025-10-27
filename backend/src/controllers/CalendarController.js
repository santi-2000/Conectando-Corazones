const CalendarService = require('../services/CalendarService');

class CalendarController {
  constructor() {
    this.service = new CalendarService();
  }

  /**
   * Obtener todos los eventos de un usuario
   * @param {Object} req 
   * @param {Object} res 
   */
  async getEvents(req, res) {
    try {
      const { userId } = req.params;
      const { mes, año, tipo_evento, fecha_inicio, fecha_fin } = req.query;

      const filters = {};
      if (mes) filters.mes = parseInt(mes);
      if (año) filters.año = parseInt(año);
      if (tipo_evento) filters.tipo_evento = tipo_evento;
      if (fecha_inicio) filters.fecha_inicio = fecha_inicio;
      if (fecha_fin) filters.fecha_fin = fecha_fin;

      const result = await this.service.getEvents(userId, filters);
      
      res.json({
        success: true,
        message: 'Eventos obtenidos exitosamente',
        data: result.data
      });
    } catch (error) {
      console.error('Error en getEvents:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtener eventos de un mes específico
   * @param {Object} req 
   * @param {Object} res 
   */
  async getMonthEvents(req, res) {
    try {
      const { userId } = req.params;
      const { mes, año } = req.query;

      if (!mes || !año) {
        return res.status(400).json({
          success: false,
          error: 'Parámetros requeridos',
          message: 'Mes y año son requeridos'
        });
      }

      const result = await this.service.getMonthEvents(userId, parseInt(mes), parseInt(año));
      
      res.json({
        success: true,
        message: 'Eventos del mes obtenidos exitosamente',
        data: result.data
      });
    } catch (error) {
      console.error('Error en getMonthEvents:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtener eventos de una fecha específica
   * @param {Object} req 
   * @param {Object} res 
   */
  async getDateEvents(req, res) {
    try {
      const { userId, fecha } = req.params;

      const result = await this.service.getDateEvents(userId, fecha);
      
      res.json({
        success: true,
        message: 'Eventos de la fecha obtenidos exitosamente',
        data: result.data
      });
    } catch (error) {
      console.error('Error en getDateEvents:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtener un evento específico
   * @param {Object} req 
   * @param {Object} res 
   */
  async getEvent(req, res) {
    try {
      const { userId, eventId } = req.params;

      const result = await this.service.getEvent(userId, parseInt(eventId));
      
      res.json({
        success: true,
        message: 'Evento obtenido exitosamente',
        data: result.data
      });
    } catch (error) {
      console.error('Error en getEvent:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Crear un nuevo evento
   * @param {Object} req 
   * @param {Object} res 
   */
  async createEvent(req, res) {
    try {
      const { userId } = req.params;
      const eventData = req.body;

      const result = await this.service.createEvent(userId, eventData);
      
      res.status(201).json({
        success: true,
        message: 'Evento creado exitosamente',
        data: result.data
      });
    } catch (error) {
      console.error('Error en createEvent:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Actualizar un evento
   * @param {Object} req 
   * @param {Object} res 
   */
  async updateEvent(req, res) {
    try {
      const { userId, eventId } = req.params;
      const eventData = req.body;

      const result = await this.service.updateEvent(userId, parseInt(eventId), eventData);
      
      res.json({
        success: true,
        message: 'Evento actualizado exitosamente',
        data: result.data
      });
    } catch (error) {
      console.error('Error en updateEvent:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Eliminar un evento
   * @param {Object} req 
   * @param {Object} res 
   */
  async deleteEvent(req, res) {
    try {
      const { userId, eventId } = req.params;

      const result = await this.service.deleteEvent(userId, parseInt(eventId));
      
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Error en deleteEvent:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtener estadísticas de eventos
   * @param {Object} req 
   * @param {Object} res 
   */
  async getStatistics(req, res) {
    try {
      const { userId } = req.params;
      const { mes, año } = req.query;

      const filters = {};
      if (mes) filters.mes = parseInt(mes);
      if (año) filters.año = parseInt(año);

      const result = await this.service.getStatistics(userId, filters);
      
      res.json({
        success: true,
        message: 'Estadísticas obtenidas exitosamente',
        data: result.data
      });
    } catch (error) {
      console.error('Error en getStatistics:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtener tipos de eventos disponibles
   * @param {Object} req 
   * @param {Object} res 
   */
  async getEventTypes(req, res) {
    try {
      const result = await this.service.getEventTypes();
      
      res.json({
        success: true,
        message: 'Tipos de eventos obtenidos exitosamente',
        data: result.data
      });
    } catch (error) {
      console.error('Error en getEventTypes:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtener colores disponibles
   * @param {Object} req 
   * @param {Object} res 
   */
  async getAvailableColors(req, res) {
    try {
      const result = await this.service.getAvailableColors();
      
      res.json({
        success: true,
        message: 'Colores obtenidos exitosamente',
        data: result.data
      });
    } catch (error) {
      console.error('Error en getAvailableColors:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtener eventos próximos
   * @param {Object} req 
   * @param {Object} res 
   */
  async getUpcomingEvents(req, res) {
    try {
      const { userId } = req.params;

      const result = await this.service.getUpcomingEvents(userId);
      
      res.json({
        success: true,
        message: 'Eventos próximos obtenidos exitosamente',
        data: result.data
      });
    } catch (error) {
      console.error('Error en getUpcomingEvents:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }

  /**
   * Obtener eventos de hoy
   * @param {Object} req 
   * @param {Object} res 
   */
  async getTodayEvents(req, res) {
    try {
      const { userId } = req.params;

      const result = await this.service.getTodayEvents(userId);
      
      res.json({
        success: true,
        message: 'Eventos de hoy obtenidos exitosamente',
        data: result.data
      });
    } catch (error) {
      console.error('Error en getTodayEvents:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
      });
    }
  }
}

module.exports = CalendarController;
