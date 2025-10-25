const DiaryRepository = require('../repositories/DiaryRepository');

/**
 * Servicio para manejar la lógica de negocio del diario
 * pantalla de diario diario con diseño colorido y emotivo
 */
class DiaryService {
  constructor() {
    this.diaryRepository = new DiaryRepository();
  }

  /**
   * Obtener entrada del día
   * @param {string} userId 
   * @param {string} fecha 
   * @returns {Object}
   */
  async getDailyEntry(userId, fecha) {
    try {
      const entry = await this.diaryRepository.findByUserAndDate(userId, fecha);
      
      if (!entry) {
        return {
          success: false,
          message: 'No se encontró entrada para esta fecha',
          data: null
        };
      }

      return {
        success: true,
        message: 'Entrada del día obtenida exitosamente',
        data: entry
      };
    } catch (error) {
      console.error('Error en getDailyEntry:', error);
      throw new Error(`Error al obtener entrada del día: ${error.message}`);
    }
  }

  /**
   * Crear o actualizar entrada del día
   * @param {string} userId 
   * @param {Object} entryData 
   * @returns {Object}
   */
  async saveDailyEntry(userId, entryData) {
    try {
      const { fecha, titulo, contenido, fotos, emocion, emocion_emoji, tags } = entryData;

      // Validar datos requeridos
      if (!fecha || !contenido) {
        return {
          success: false,
          message: 'Fecha y contenido son requeridos',
          data: null
        };
      }

      // Preparar datos para guardar
      const diaryData = {
        user_id: userId,
        fecha: fecha,
        titulo: titulo || `Mi día ${new Date(fecha).toLocaleDateString('es-ES')}`,
        contenido: contenido,
        fotos: fotos || [],
        emocion: emocion,
        emocion_emoji: emocion_emoji,
        tags: tags || [],
        estado: 'completado'
      };

      // Verificar si ya existe una entrada para esta fecha
      const existingEntry = await this.diaryRepository.findByUserAndDate(userId, fecha);
      
      let result;
      if (existingEntry) {
        // Actualizar entrada existente
        result = await this.diaryRepository.update(existingEntry.id, diaryData);
      } else {
        // Crear nueva entrada
        result = await this.diaryRepository.create(diaryData);
      }

      return {
        success: true,
        message: existingEntry ? 'Entrada actualizada exitosamente' : 'Entrada creada exitosamente',
        data: result
      };
    } catch (error) {
      console.error('Error en saveDailyEntry:', error);
      throw new Error(`Error al guardar entrada: ${error.message}`);
    }
  }

  /**
   * Obtener entradas de una semana
   * @param {string} userId 
   * @param {string} fechaInicio 
   * @param {string} fechaFin 
   * @returns {Object}
   */
  async getWeeklyEntries(userId, fechaInicio, fechaFin) {
    try {
      const entries = await this.diaryRepository.findByUserAndDateRange(userId, fechaInicio, fechaFin);
      
      // Calcular estadísticas de la semana
      const stats = this.calculateWeeklyStats(entries);
      
      return {
        success: true,
        message: 'Entradas de la semana obtenidas exitosamente',
        data: {
          entries: entries,
          estadisticas: stats,
          fechaInicio: fechaInicio,
          fechaFin: fechaFin
        }
      };
    } catch (error) {
      console.error('Error en getWeeklyEntries:', error);
      throw new Error(`Error al obtener entradas de la semana: ${error.message}`);
    }
  }

  /**
   * Obtener historial de entradas
   * @param {string} userId 
   * @param {Object} pagination 
   * @returns {Object}
   */
  async getDiaryHistory(userId, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const offset = (page - 1) * limit;

      const entries = await this.diaryRepository.findByUserWithPagination(userId, limit, offset);
      const total = await this.diaryRepository.countByUser(userId);

      return {
        success: true,
        message: 'Historial obtenido exitosamente',
        data: {
          entries: entries,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: total,
            totalPages: Math.ceil(total / limit)
          }
        }
      };
    } catch (error) {
      console.error('Error en getDiaryHistory:', error);
      throw new Error(`Error al obtener historial: ${error.message}`);
    }
  }

  /**
   * Eliminar entrada del día
   * @param {string} userId 
   * @param {string} fecha 
   * @returns {Object}
   */
  async deleteDailyEntry(userId, fecha) {
    try {
      const entry = await this.diaryRepository.findByUserAndDate(userId, fecha);
      
      if (!entry) {
        return {
          success: false,
          message: 'No se encontró entrada para esta fecha',
          data: null
        };
      }

      await this.diaryRepository.delete(entry.id);

      return {
        success: true,
        message: 'Entrada eliminada exitosamente',
        data: null
      };
    } catch (error) {
      console.error('Error en deleteDailyEntry:', error);
      throw new Error(`Error al eliminar entrada: ${error.message}`);
    }
  }

  /**
   * Calcular estadísticas de la semana
   * @param {Array} entries 
   * @returns {Object}
   */
  calculateWeeklyStats(entries) {
    const totalEntradas = entries.length;
    const totalFotos = entries.reduce((acc, entry) => acc + (entry.fotos ? entry.fotos.length : 0), 0);
    const totalPalabras = entries.reduce((acc, entry) => acc + (entry.contenido ? entry.contenido.length : 0), 0);
    
    // Contar emociones
    const emociones = {};
    entries.forEach(entry => {
      if (entry.emocion) {
        emociones[entry.emocion] = (emociones[entry.emocion] || 0) + 1;
      }
    });

    // Encontrar emoción más común
    const emocionMasComun = Object.keys(emociones).reduce((a, b) => 
      emociones[a] > emociones[b] ? a : b, 'feliz'
    );

    return {
      totalEntradas,
      totalFotos,
      totalPalabras,
      emociones,
      emocionMasComun,
      diasCompletados: totalEntradas,
      porcentajeCompletado: Math.round((totalEntradas / 7) * 100)
    };
  }

  /**
   * Obtener estadísticas generales del usuario
   * @param {string} userId 
   * @returns {Object}
   */
  async getUserStats(userId) {
    try {
      const totalEntries = await this.diaryRepository.countByUser(userId);
      const recentEntries = await this.diaryRepository.findRecentByUser(userId, 7);
      
      const stats = this.calculateWeeklyStats(recentEntries);
      
      return {
        success: true,
        message: 'Estadísticas obtenidas exitosamente',
        data: {
          totalEntradas: totalEntries,
          ultimaSemana: stats,
          mensajeMotivacional: this.getMotivationalMessage(stats.porcentajeCompletado)
        }
      };
    } catch (error) {
      console.error('Error en getUserStats:', error);
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }

  /**
   * Obtener mensaje motivacional basado en el progreso
   * @param {number} porcentaje 
   * @returns {string}
   */
  getMotivationalMessage(porcentaje) {
    if (porcentaje >= 100) return "🎉 ¡Semana completa! ¡Eres increíble!";
    if (porcentaje >= 70) return "🌟 ¡Vas súper bien! ¡Sigue así!";
    if (porcentaje >= 40) return "💪 ¡Buen progreso! ¡Continúa!";
    return "✨ ¡Empieza tu semana con mamá!";
  }
}

module.exports = DiaryService;
