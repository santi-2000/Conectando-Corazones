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

      // Política Fase 2: impedir duplicados en misma fecha (pedir editar)
      if (existingEntry) {
        return {
          success: false,
          code: 'DUPLICATE_ENTRY',
          message: 'Ya existe una entrada para este día. Edita la existente.',
          data: existingEntry
        };
      }

      // Crear nueva entrada
      const result = await this.diaryRepository.create(diaryData);

      return {
        success: true,
        message: 'Entrada creada exitosamente',
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
   * Generar PDF del diario usando datos exactos de screen14
   * @param {string} userId 
   * @param {Object} pdfData - Datos exactos de screen14
   * @returns {Object}
   */
  async generatePDFFromData(userId, pdfData) {
    try {
      console.log('🔍 DiaryService.generatePDFFromData: Usando datos de screen14');
      
      const MomsWeekService = require('./MomsWeekService');
      const momsWeekService = new MomsWeekService();
      
      // Convertir datos de screen14 al formato que espera el generador
      // pdfData tiene: weekNumber, dateRange, childName, momName, days[]
      // days[] tiene: dayNumber, dayName, fecha, emotion, photos[], text, tags[]
      
      const fechaInicio = pdfData.days && pdfData.days.length > 0 
        ? pdfData.days[0].fecha 
        : null;
      
      // Convertir days al formato esperado por PDFGeneratorService
      const daysForPDF = pdfData.days.map(day => ({
        dia: day.dayNumber, // 1-7
        emociones: day.emotion ? [day.emotion] : [],
        tags: Array.isArray(day.tags) ? day.tags : [],
        fotos: Array.isArray(day.photos) && day.photos.length > 0 ? day.photos.map(p => {
          // Log para debugging
          console.log('🖼️ DiaryService: Procesando foto para PDF:', p);
          
          if (typeof p === 'string') {
            return p.startsWith('/') || p.startsWith('http') ? { url: p } : { caption: p };
          }
          if (typeof p === 'object') {
            // Si ya es un objeto con url, mantenerlo
            if (p.url) {
              return { url: p.url, caption: p.caption || '' };
            }
            // Si es objeto pero sin url, usar como caption
            return { caption: String(p) || '' };
          }
          return { caption: String(p) || '' };
        }).filter(f => f && (f.url || f.caption)) : [],
        comentarios: day.text && day.text !== 'Día pendiente' ? [day.text] : []
      }));
      
      const pdfDataForGenerator = {
        weekNumber: pdfData.weekNumber,
        dateRange: pdfData.dateRange,
        fechaInicio: fechaInicio,
        childName: pdfData.childName || 'Sofia',
        momName: pdfData.momName || 'Mamá',
        days: daysForPDF
      };
      
      console.log('📊 Datos convertidos para PDF:', {
        weekNumber: pdfDataForGenerator.weekNumber,
        daysCount: pdfDataForGenerator.days.length,
        fechaInicio: pdfDataForGenerator.fechaInicio
      });
      
      // Log detallado de fotos
      pdfDataForGenerator.days.forEach((day, idx) => {
        if (day.fotos && day.fotos.length > 0) {
          console.log(`📸 DiaryService: Día ${day.dia} tiene ${day.fotos.length} fotos:`, day.fotos.map(f => f.url || f));
        }
      });
      
      // Generar PDF directamente usando PDFGeneratorService
      const PDFGeneratorService = require('./PDFGeneratorService');
      const pdfGenerator = new PDFGeneratorService();
      const pdfPath = await pdfGenerator.generateWeeklyDiaryPDF(pdfDataForGenerator, userId);
      const pdfUrl = pdfGenerator.getPublicURL(pdfPath);
      
      return {
        success: true,
        message: 'PDF generado exitosamente',
        data: {
          titulo: `Mi semana con mamá - Semana ${pdfData.weekNumber}`,
          fecha: pdfData.dateRange,
          pdfUrl: pdfUrl,
          estadisticas: {
            totalEntradas: pdfData.days.filter(d => d.entry).length,
            totalFotos: pdfData.days.reduce((acc, d) => acc + (Array.isArray(d.photos) ? d.photos.length : 0), 0),
            totalPalabras: pdfData.days.reduce((acc, d) => acc + (d.text ? d.text.length : 0), 0)
          }
        }
      };
    } catch (error) {
      console.error('❌ Error en generatePDFFromData:', error);
      throw new Error(`Error al generar PDF: ${error.message}`);
    }
  }

  /**
   * Generar PDF del diario (método tradicional desde BD)
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
   * Eliminar entradas de la semana actual del usuario
   */
  async purgeWeeklyEntries(userId) {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Lunes
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Domingo

    const startDate = startOfWeek.toISOString().split('T')[0];
    const endDate = endOfWeek.toISOString().split('T')[0];
    const affected = await this.diaryRepository.deleteByUserAndDateRange(userId, startDate, endDate);
    return { success: true, data: { affectedRows: affected, startDate, endDate } };
  }

  /**
   * Eliminar todas las entradas del usuario
   */
  async purgeAllEntries(userId) {
    // Usar un rango amplio
    const affected = await this.diaryRepository.deleteByUserAndDateRange(userId, '1900-01-01', '2999-12-31');
    return { success: true, data: { affectedRows: affected } };
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
      console.log('🔍 DiaryService.updateEntry: Iniciando...', { userId, entryId, entryData });
      
      // Verificar que la entrada existe y pertenece al usuario
      const existingEntry = await this.diaryRepository.findById(entryId);

      if (!existingEntry) {
        console.log('❌ DiaryService.updateEntry: Entrada no encontrada');
        return {
          success: false,
          message: 'No se encontró la entrada',
          data: null
        };
      }

      if (existingEntry.user_id && existingEntry.user_id !== userId) {
        console.log('❌ DiaryService.updateEntry: Sin permisos');
        return {
          success: false,
          message: 'No tienes permisos para editar esta entrada',
          data: null
        };
      }

      // Preparar datos para actualizar (evitar undefined -> usar null/[])
      const updateData = {
        titulo: entryData.titulo !== undefined ? entryData.titulo : (existingEntry.titulo ?? null),
        contenido: entryData.contenido !== undefined ? entryData.contenido : (existingEntry.contenido ?? null),
        fotos: entryData.fotos !== undefined ? entryData.fotos : (existingEntry.fotos ?? []),
        emocion: entryData.emocion !== undefined ? entryData.emocion : (existingEntry.emocion ?? null),
        emocion_emoji: entryData.emocion_emoji !== undefined ? entryData.emocion_emoji : (existingEntry.emocion_emoji ?? null),
        tags: entryData.tags !== undefined ? entryData.tags : (existingEntry.tags ?? []),
        estado: 'completado'
      };

      console.log('📝 DiaryService.updateEntry: Datos a actualizar:', updateData);
      const result = await this.diaryRepository.update(entryId, updateData);
      console.log('✅ DiaryService.updateEntry: Entrada actualizada:', result);

      return {
        success: true,
        message: 'Entrada actualizada exitosamente',
        data: result
      };
    } catch (error) {
      console.error('❌ DiaryService.updateEntry: Error:', error);
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
