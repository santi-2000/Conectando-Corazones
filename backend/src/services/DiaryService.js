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
   * Generar PDF del diario
   * @param {string} userId 
   * @param {string} weekId 
   * @returns {Object}
   */
  async generatePDF(userId, weekId = null) {
    try {
      console.log('🔍 DiaryService.generatePDF: Iniciando para usuario:', userId);
      
      // Obtener entradas de la semana actual
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Lunes
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Domingo

      const startDate = startOfWeek.toISOString().split('T')[0];
      const endDate = endOfWeek.toISOString().split('T')[0];

      console.log('📅 Rango de fechas:', startDate, 'a', endDate);
      
      const entries = await this.diaryRepository.findByUserAndDateRange(userId, startDate, endDate);
      console.log('📝 Entradas encontradas:', entries.length);
      
      // Calcular estadísticas de las entradas del diary
      const stats = this.calculateWeeklyStats(entries);
      console.log('📊 Estadísticas calculadas:', stats);
      
      // Generar PDF usando el servicio de Moms Week
      const MomsWeekService = require('./MomsWeekService');
      const momsWeekService = new MomsWeekService();
      
      // Obtener información de la semana
      const weekInfo = await momsWeekService.getCurrentWeek(userId);
      
      // Crear datos del libro con las entradas del diary
      const bookData = {
        entradas: entries.map(entry => ({
          titulo: entry.titulo,
          contenido: entry.contenido,
          fotos: entry.fotos || [],
          palabras: entry.contenido ? entry.contenido.length : 0,
          momentosFelices: entry.emocion === 'Feliz' ? 1 : 0,
          emocion: entry.emocion,
          emocionEmoji: entry.emocion_emoji,
          tags: entry.tags || [],
          fecha: entry.fecha
        })),
        fotos: stats.totalFotos,
        palabras: stats.totalPalabras,
        momentosFelices: stats.momentosFelices
      };
      
      console.log('📚 Datos del libro generados:', {
        entradas: bookData.entradas.length,
        fotos: bookData.fotos,
        palabras: bookData.palabras
      });
      
      // Generar el PDF real usando MomsWeekService
      const pdfResult = await momsWeekService.generateWeeklyBook(userId, bookData);
      
      return {
        success: true,
        message: 'PDF generado exitosamente',
        data: {
          titulo: `Mi semana con mamá - Semana ${weekInfo.data.semana}`,
          fecha: weekInfo.data.rango,
          contenido: bookData,
          estadisticas: {
            totalEntradas: bookData.entradas.length,
            totalFotos: bookData.fotos,
            totalPalabras: bookData.palabras,
            momentosFelices: bookData.momentosFelices
          },
          pdfUrl: pdfResult.data?.pdfUrl || null
        }
      };
    } catch (error) {
      console.error('❌ Error en generatePDF:', error);
      throw new Error(`Error al generar PDF: ${error.message}`);
    }
  }

  /**
   * Obtener entrada específica por ID
   * @param {string} userId
   * @param {string} entryId
   * @returns {Object}
   */
  async getEntryById(userId, entryId) {
    try {
      const entry = await this.diaryRepository.findById(entryId);

      if (!entry) {
        return {
          success: false,
          message: 'No se encontró la entrada',
          data: null
        };
      }

      // Verificar que la entrada pertenece al usuario (manejar user_id null)
      if (entry.user_id && entry.user_id !== userId) {
        return {
          success: false,
          message: 'No tienes permisos para ver esta entrada',
          data: null
        };
      }

      return {
        success: true,
        message: 'Entrada obtenida exitosamente',
        data: entry
      };
    } catch (error) {
      console.error('Error en getEntryById:', error);
      throw new Error(`Error al obtener entrada: ${error.message}`);
    }
  }

  /**
   * Actualizar entrada específica por ID
   * @param {string} userId
   * @param {string} entryId
   * @param {Object} entryData
   * @returns {Object}
   */
  async updateEntry(userId, entryId, entryData) {
    try {
      // Verificar que la entrada existe y pertenece al usuario
      const existingEntry = await this.diaryRepository.findById(entryId);

      if (!existingEntry) {
        return {
          success: false,
          message: 'No se encontró la entrada',
          data: null
        };
      }

      if (existingEntry.user_id && existingEntry.user_id !== userId) {
        return {
          success: false,
          message: 'No tienes permisos para editar esta entrada',
          data: null
        };
      }

      // Preparar datos para actualizar
      const updateData = {
        titulo: entryData.titulo || existingEntry.titulo,
        contenido: entryData.contenido || existingEntry.contenido,
        fotos: entryData.fotos || existingEntry.fotos || [],
        emocion: entryData.emocion || existingEntry.emocion,
        emocion_emoji: entryData.emocion_emoji || existingEntry.emocion_emoji,
        tags: entryData.tags || existingEntry.tags || [],
        estado: 'completado'
      };

      const result = await this.diaryRepository.update(entryId, updateData);

      return {
        success: true,
        message: 'Entrada actualizada exitosamente',
        data: result
      };
    } catch (error) {
      console.error('Error en updateEntry:', error);
      throw new Error(`Error al actualizar entrada: ${error.message}`);
    }
  }

  /**
   * Eliminar entrada específica por ID
   * @param {string} userId
   * @param {string} entryId
   * @returns {Object}
   */
  async deleteEntry(userId, entryId) {
    try {
      // Verificar que la entrada existe y pertenece al usuario
      const existingEntry = await this.diaryRepository.findById(entryId);

      if (!existingEntry) {
        return {
          success: false,
          message: 'No se encontró la entrada',
          data: null
        };
      }

      if (existingEntry.user_id && existingEntry.user_id !== userId) {
        return {
          success: false,
          message: 'No tienes permisos para eliminar esta entrada',
          data: null
        };
      }

      await this.diaryRepository.delete(entryId);

      return {
        success: true,
        message: 'Entrada eliminada exitosamente',
        data: null
      };
    } catch (error) {
      console.error('Error en deleteEntry:', error);
      throw new Error(`Error al eliminar entrada: ${error.message}`);
    }
  }

  /**
   * Obtener días de la semana con estado (completado/pendiente)
   * @param {string} userId
   * @returns {Object}
   */
  async getWeeklyDays(userId) {
    try {
      // Obtener rango de la semana actual
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Lunes
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Domingo

      const startDate = startOfWeek.toISOString().split('T')[0];
      const endDate = endOfWeek.toISOString().split('T')[0];

      // Obtener entradas de la semana
      const entries = await this.diaryRepository.findByUserAndDateRange(userId, startDate, endDate);

      // Crear mapa de días con entradas
      const entriesMap = {};
      entries.forEach(entry => {
        // Manejar diferentes formatos de fecha
        let date;
        if (typeof entry.fecha === 'string') {
          date = entry.fecha.split('T')[0];
        } else if (entry.fecha instanceof Date) {
          date = entry.fecha.toISOString().split('T')[0];
        } else {
          // Si es un objeto Date de MySQL
          date = new Date(entry.fecha).toISOString().split('T')[0];
        }
        entriesMap[date] = entry;
      });

      // Generar días de la semana
      const days = [];
      const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
      
      for (let i = 0; i < 7; i++) {
        const dayDate = new Date(startOfWeek);
        dayDate.setDate(startOfWeek.getDate() + i);
        const dateString = dayDate.toISOString().split('T')[0];
        
        const entry = entriesMap[dateString];
        
        days.push({
          dia: i + 1,
          nombre: dayNames[i],
          fecha: dateString,
          completado: !!entry,
          entrada: entry ? {
            id: entry.id,
            titulo: entry.titulo,
            emocion: entry.emocion,
            emocion_emoji: entry.emocion_emoji,
            fotos: entry.fotos ? entry.fotos.length : 0
          } : null
        });
      }

      return {
        success: true,
        message: 'Días de la semana obtenidos exitosamente',
        data: {
          semana: this.getWeekNumber(today),
          fechaInicio: startDate,
          fechaFin: endDate,
          dias: days,
          totalCompletados: days.filter(day => day.completado).length,
          totalDias: 7
        }
      };
    } catch (error) {
      console.error('Error en getWeeklyDays:', error);
      throw new Error(`Error al obtener días de la semana: ${error.message}`);
    }
  }

  /**
   * Obtener número de semana del año
   * @param {Date} date
   * @returns {number}
   */
  getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
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
