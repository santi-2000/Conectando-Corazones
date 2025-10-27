const CalendarRepository = require('../repositories/CalendarRepository');

class CalendarService {
  constructor() {
    this.repository = new CalendarRepository();
  }

  /**
   * Obtener eventos de un usuario con filtros
   * @param {string} userId 
   * @param {Object} filters 
   * @returns {Promise<Object>}
   */
  async getEvents(userId, filters = {}) {
    try {
      const events = await this.repository.findAll(userId, filters);
      
      return {
        success: true,
        data: {
          eventos: events,
          total: events.length,
          filtros: filters
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener eventos: ${error.message}`);
    }
  }

  /**
   * Obtener eventos de un mes específico
   * @param {string} userId 
   * @param {number} mes 
   * @param {number} año 
   * @returns {Promise<Object>}
   */
  async getMonthEvents(userId, mes, año) {
    try {
      const events = await this.repository.findByMonth(userId, mes, año);
      
      // Agrupar eventos por día
      const eventsByDay = {};
      events.forEach(event => {
        const fecha = event.fechaEvento;
        if (!eventsByDay[fecha]) {
          eventsByDay[fecha] = [];
        }
        eventsByDay[fecha].push(event);
      });

      return {
        success: true,
        data: {
          mes,
          año,
          eventos: events,
          eventosPorDia: eventsByDay,
          total: events.length
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener eventos del mes: ${error.message}`);
    }
  }

  /**
   * Obtener eventos de una fecha específica
   * @param {string} userId 
   * @param {string} fecha 
   * @returns {Promise<Object>}
   */
  async getDateEvents(userId, fecha) {
    try {
      const events = await this.repository.findByDate(userId, fecha);
      
      return {
        success: true,
        data: {
          fecha,
          eventos: events,
          total: events.length
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener eventos de la fecha: ${error.message}`);
    }
  }

  /**
   * Obtener un evento específico
   * @param {string} userId 
   * @param {number} eventId 
   * @returns {Promise<Object>}
   */
  async getEvent(userId, eventId) {
    try {
      const event = await this.repository.findById(userId, eventId);
      
      if (!event) {
        throw new Error('Evento no encontrado');
      }

      return {
        success: true,
        data: event
      };
    } catch (error) {
      throw new Error(`Error al obtener evento: ${error.message}`);
    }
  }

  /**
   * Crear un nuevo evento
   * @param {string} userId 
   * @param {Object} eventData 
   * @returns {Promise<Object>}
   */
  async createEvent(userId, eventData) {
    try {
      // Validar datos requeridos
      if (!eventData.titulo || !eventData.fecha_evento) {
        throw new Error('Título y fecha son requeridos');
      }

      // Validar formato de fecha
      const fechaEvento = new Date(eventData.fecha_evento);
      if (isNaN(fechaEvento.getTime())) {
        throw new Error('Formato de fecha inválido');
      }

      // Validar tipo de evento
      const tiposValidos = ['familiar', 'deportivo', 'recordatorio', 'diferente', 'medico', 'educativo'];
      if (eventData.tipo_evento && !tiposValidos.includes(eventData.tipo_evento)) {
        throw new Error('Tipo de evento inválido');
      }

      // Validar nivel de importancia
      const nivelesValidos = ['Alto', 'Medio', 'Bajo'];
      if (eventData.nivel_importancia && !nivelesValidos.includes(eventData.nivel_importancia)) {
        throw new Error('Nivel de importancia inválido');
      }

      // Preparar datos para el repository
      const eventDataForRepository = {
        titulo: eventData.titulo,
        descripcion: eventData.descripcion || null,
        fecha_evento: eventData.fecha_evento,
        hora_evento: eventData.hora_evento || null,
        color: eventData.color || '#4A90E2',
        tipo_evento: eventData.tipo_evento || 'recordatorio',
        nivel_importancia: eventData.nivel_importancia || 'Medio',
        recordatorio_activo: eventData.recordatorio_activo !== undefined ? eventData.recordatorio_activo : true,
        recordatorio_minutos: eventData.recordatorio_minutos || 15,
        ubicacion: eventData.ubicacion || null,
        notas_adicionales: eventData.notas_adicionales || null
      };

      const event = await this.repository.create(userId, eventDataForRepository);
      
      return {
        success: true,
        data: event
      };
    } catch (error) {
      throw new Error(`Error al crear evento: ${error.message}`);
    }
  }

  /**
   * Actualizar un evento
   * @param {string} userId 
   * @param {number} eventId 
   * @param {Object} eventData 
   * @returns {Promise<Object>}
   */
  async updateEvent(userId, eventId, eventData) {
    try {
      // Validar que el evento existe
      const existingEvent = await this.repository.findById(userId, eventId);
      if (!existingEvent) {
        throw new Error('Evento no encontrado');
      }

      // Validar formato de fecha si se proporciona
      if (eventData.fecha_evento) {
        const fechaEvento = new Date(eventData.fecha_evento);
        if (isNaN(fechaEvento.getTime())) {
          throw new Error('Formato de fecha inválido');
        }
      }

      const event = await this.repository.update(userId, eventId, eventData);
      
      return {
        success: true,
        data: event
      };
    } catch (error) {
      throw new Error(`Error al actualizar evento: ${error.message}`);
    }
  }

  /**
   * Eliminar un evento
   * @param {string} userId 
   * @param {number} eventId 
   * @returns {Promise<Object>}
   */
  async deleteEvent(userId, eventId) {
    try {
      const deleted = await this.repository.delete(userId, eventId);
      
      if (!deleted) {
        throw new Error('Evento no encontrado o no tienes permisos para eliminarlo');
      }

      return {
        success: true,
        message: 'Evento eliminado exitosamente'
      };
    } catch (error) {
      throw new Error(`Error al eliminar evento: ${error.message}`);
    }
  }

  /**
   * Obtener estadísticas de eventos
   * @param {string} userId 
   * @param {Object} filters 
   * @returns {Promise<Object>}
   */
  async getStatistics(userId, filters = {}) {
    try {
      const stats = await this.repository.getStatistics(userId, filters);
      
      return {
        success: true,
        data: {
          totalEventos: parseInt(stats.total_eventos),
          tiposDiferentes: parseInt(stats.tipos_diferentes),
          eventosImportantes: parseInt(stats.eventos_importantes),
          eventosFuturos: parseInt(stats.eventos_futuros),
          eventosPasados: parseInt(stats.eventos_pasados),
          porcentajeImportantes: stats.total_eventos > 0 ? 
            Math.round((stats.eventos_importantes / stats.total_eventos) * 100) : 0
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }

  /**
   * Obtener tipos de eventos disponibles
   * @returns {Promise<Object>}
   */
  async getEventTypes() {
    try {
      const types = await this.repository.getEventTypes();
      
      return {
        success: true,
        data: types
      };
    } catch (error) {
      throw new Error(`Error al obtener tipos de eventos: ${error.message}`);
    }
  }

  /**
   * Obtener colores disponibles
   * @returns {Promise<Object>}
   */
  async getAvailableColors() {
    try {
      const colors = await this.repository.getAvailableColors();
      
      return {
        success: true,
        data: colors
      };
    } catch (error) {
      throw new Error(`Error al obtener colores: ${error.message}`);
    }
  }

  /**
   * Obtener eventos próximos (próximos 7 días)
   * @param {string} userId 
   * @returns {Promise<Object>}
   */
  async getUpcomingEvents(userId) {
    try {
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      const filters = {
        fecha_inicio: today.toISOString().split('T')[0],
        fecha_fin: nextWeek.toISOString().split('T')[0]
      };

      const events = await this.repository.findAll(userId, filters);
      
      return {
        success: true,
        data: {
          eventos: events,
          total: events.length,
          rango: `${today.toISOString().split('T')[0]} a ${nextWeek.toISOString().split('T')[0]}`
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener eventos próximos: ${error.message}`);
    }
  }

  /**
   * Obtener eventos de hoy
   * @param {string} userId 
   * @returns {Promise<Object>}
   */
  async getTodayEvents(userId) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const events = await this.repository.findByDate(userId, today);
      
      return {
        success: true,
        data: {
          fecha: today,
          eventos: events,
          total: events.length
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener eventos de hoy: ${error.message}`);
    }
  }
}

module.exports = CalendarService;
