//seguimiento semanal de mamás
/**
 * Service para Moms Week
 * Contiene la lógica de negocio para el seguimiento semanal de mamás
 */

const MomsWeekRepository = require('../repositories/MomsWeekRepository');
const PDFGeneratorService = require('./PDFGeneratorService');
const path = require('path');

class MomsWeekService {
  constructor() {
    this.repository = new MomsWeekRepository();
    this.pdfGenerator = new PDFGeneratorService();
  }

  /**
   * Obtener información de la semana actual
   * @param {string} userId 
   * @returns {Promise<Object>}
   */
  async getCurrentWeek(userId) {
    try {
      const currentDate = new Date();
      const weekInfo = this.calculateWeekInfo(currentDate);
      
      return {
        success: true,
        data: {
          semana: weekInfo.semana,
          rango: weekInfo.rango,
          fechaInicio: weekInfo.fechaInicio,
          fechaFin: weekInfo.fechaFin,
          año: weekInfo.año,
          mes: weekInfo.mes,
          diaActual: weekInfo.diaActual,
          diaSemana: weekInfo.diaSemana
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener semana actual: ${error.message}`);
    }
  }

  /**
   * Obtener progreso de días completados
   * @param {string} userId 
   * @returns {Promise<Object>}
   */
  async getWeekProgress(userId) {
    try {
      const currentDate = new Date();
      const weekInfo = this.calculateWeekInfo(currentDate);
      
      // Obtener días completados de la base de datos
      const completedDays = await this.repository.getCompletedDays(userId, weekInfo.fechaInicio, weekInfo.fechaFin);
      
      return {
        success: true,
        data: {
          diasCompletados: completedDays.length,
          totalDias: 7,
          porcentaje: Math.round((completedDays.length / 7) * 100),
          diasCompletadosList: completedDays,
          mensaje: this.getProgressMessage(completedDays.length)
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener progreso: ${error.message}`);
    }
  }

  /**
   * Obtener estadísticas de la semana
   * @param {string} userId 
   * @returns {Promise<Object>}
   */
  async getWeekStatistics(userId) {
    try {
      const currentDate = new Date();
      const weekInfo = this.calculateWeekInfo(currentDate);
      
      const stats = await this.repository.getWeekStatistics(userId, weekInfo.fechaInicio, weekInfo.fechaFin);
      
      return {
        success: true,
        data: {
          fotos: stats.fotos || 0,
          palabras: stats.palabras || 0,
          momentosFelices: stats.momentosFelices || 0,
          entradas: stats.entradas || 0,
          promedioPalabrasPorDia: stats.promedioPalabrasPorDia || 0
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }

  /**
   * Agregar entrada del día
   * @param {string} userId 
   * @param {Object} entryData 
   * @returns {Promise<Object>}
   */
  async addDailyEntry(userId, entryData) {
    try {
      const entry = await this.repository.addDailyEntry(userId, entryData);
      
      return {
        success: true,
        data: entry
      };
    } catch (error) {
      throw new Error(`Error al agregar entrada: ${error.message}`);
    }
  }

  /**
   * Generar libro semanal
   * @param {string} userId 
   * @param {Object} bookData - Datos del libro (opcional, si no se proporciona se obtienen del repositorio)
   * @returns {Promise<Object>}
   */
  async generateWeeklyBook(userId, bookData = null) {
    try {
      const currentDate = new Date();
      const weekInfo = this.calculateWeekInfo(currentDate);
      
      // Si no se proporcionan datos del libro, obtenerlos del repositorio
      if (!bookData) {
        bookData = await this.repository.generateWeeklyBook(userId, weekInfo.fechaInicio, weekInfo.fechaFin);
      }
      
      // Generar el PDF real
      const pdfPath = await this.pdfGenerator.generateWeeklyDiaryPDF({
        titulo: `Mi semana con mamá - Semana ${weekInfo.semana}`,
        fecha: weekInfo.rango,
        contenido: bookData,
        estadisticas: {
          totalEntradas: bookData.entradas.length,
          totalFotos: bookData.fotos,
          totalPalabras: bookData.palabras,
          momentosFelices: bookData.momentosFelices
        }
      }, userId);
      
      // Convertir ruta del archivo a URL accesible
      const pdfUrl = `/pdfs/${path.basename(pdfPath)}`;
      
      return {
        success: true,
        data: {
          titulo: `Mi semana con mamá - Semana ${weekInfo.semana}`,
          fecha: weekInfo.rango,
          contenido: bookData,
          estadisticas: {
            totalEntradas: bookData.entradas.length,
            totalFotos: bookData.fotos,
            totalPalabras: bookData.palabras,
            momentosFelices: bookData.momentosFelices
          },
          pdfUrl: pdfUrl
        }
      };
    } catch (error) {
      throw new Error(`Error al generar libro: ${error.message}`);
    }
  }

  /**
   * Obtener historial de semanas
   * @param {string} userId 
   * @param {Object} pagination 
   * @returns {Promise<Object>}
   */
  async getWeekHistory(userId, pagination = {}) {
    try {
      const history = await this.repository.getWeekHistory(userId, pagination);
      
      return {
        success: true,
        data: history.weeks,
        pagination: history.pagination
      };
    } catch (error) {
      throw new Error(`Error al obtener historial: ${error.message}`);
    }
  }

  /**
   * Calcular información de la semana
   * @param {Date} date 
   * @returns {Object}
   */
  calculateWeekInfo(date) {
    const year = date.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const dayOfYear = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000)) + 1;
    const weekNumber = Math.ceil(dayOfYear / 7);
    
    // Calcular inicio y fin de la semana (lunes a domingo)
    const dayOfWeek = date.getDay();
    const monday = new Date(date);
    monday.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    
    return {
      semana: weekNumber,
      rango: `${monday.getDate()}-${sunday.getDate()} de ${months[sunday.getMonth()]}`,
      fechaInicio: monday.toISOString().split('T')[0],
      fechaFin: sunday.toISOString().split('T')[0],
      año: year,
      mes: months[date.getMonth()],
      diaActual: date.getDate(),
      diaSemana: days[dayOfWeek]
    };
  }

  /**
   * Obtener mensaje de progreso
   * @param {number} completedDays 
   * @returns {string}
   */
  getProgressMessage(completedDays) {
    if (completedDays === 0) {
      return "¡Comienza tu semana!";
    } else if (completedDays < 3) {
      return "¡Buen inicio! ¡Continúa!";
    } else if (completedDays < 5) {
      return "¡Buen progreso! ¡Continúa!";
    } else if (completedDays < 7) {
      return "¡Excelente! ¡Casi terminas!";
    } else {
      return "¡Semana completada! ¡Felicidades!";
    }
  }

  // ===== NUEVOS MÉTODOS PARA PANTALLAS ESPECÍFICAS =====

  /**
   * Obtener estadísticas semanales (5 Fotos, 127 Palabras, 3 Feliz)
   * @param {string} userId 
   * @returns {Promise<Object>}
   */
  async getWeeklyStats(userId) {
    try {
      const currentDate = new Date();
      const weekInfo = this.calculateWeekInfo(currentDate);
      
      // Obtener estadísticas de la semana actual
      const stats = await this.repository.getWeeklyStats(userId, weekInfo.fechaInicio, weekInfo.fechaFin);
      
      return {
        success: true,
        data: {
          fotos: stats.fotos || 0,
          palabras: stats.palabras || 0,
          momentosFelices: stats.momentos_felices || 0,
          entradas: stats.entradas || 0,
          emociones: stats.emociones || {}
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener estadísticas semanales: ${error.message}`);
    }
  }

  /**
   * Obtener día actual de la semana (Día 3)
   * @param {string} userId 
   * @returns {Promise<Object>}
   */
  async getCurrentDay(userId) {
    try {
      const currentDate = new Date();
      const weekInfo = this.calculateWeekInfo(currentDate);
      
      // Calcular día de la semana (1-7)
      const dayOfWeek = currentDate.getDay();
      const dayNumber = dayOfWeek === 0 ? 7 : dayOfWeek; // Domingo = 7
      
      return {
        success: true,
        data: {
          dia: dayNumber,
          fecha: currentDate.toISOString().split('T')[0],
          diaSemana: weekInfo.diaSemana,
          semana: weekInfo.semana,
          rango: weekInfo.rango
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener día actual: ${error.message}`);
    }
  }

  /**
   * Obtener progreso semanal con estrellas (⭐/☆)
   * @param {string} userId 
   * @returns {Promise<Object>}
   */
  async getWeeklyProgressStars(userId) {
    try {
      const currentDate = new Date();
      const weekInfo = this.calculateWeekInfo(currentDate);
      
      // Obtener días completados de la semana
      const completedDays = await this.repository.getCompletedDays(userId, weekInfo.fechaInicio, weekInfo.fechaFin);
      
      // Crear array de días con estrellas
      const days = [];
      const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
      
      for (let i = 1; i <= 7; i++) {
        const isCompleted = completedDays.includes(i);
        days.push({
          day: dayNames[i - 1],
          completed: isCompleted,
          star: isCompleted ? '⭐' : '☆'
        });
      }
      
      return {
        success: true,
        data: {
          days,
          totalDays: 7,
          completedDays: completedDays.length,
          percentage: Math.round((completedDays.length / 7) * 100)
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener progreso con estrellas: ${error.message}`);
    }
  }

  /**
   * Obtener vista previa del libro semanal
   * @param {string} userId 
   * @returns {Promise<Object>}
   */
  async getWeeklyPreview(userId) {
    try {
      const currentDate = new Date();
      const weekInfo = this.calculateWeekInfo(currentDate);
      
      // Obtener datos de la semana
      const weekData = await this.repository.getWeeklyData(userId, weekInfo.fechaInicio, weekInfo.fechaFin);
      
      return {
        success: true,
        data: {
          weekNumber: weekInfo.semana,
          dateRange: weekInfo.rango,
          childName: 'Sofia', // Esto debería venir de la base de datos
          momName: 'Mamá',
          days: weekData.days,
          summary: {
            completedDays: weekData.completedDays,
            totalPhotos: weekData.totalPhotos,
            totalWords: weekData.totalWords,
            totalMoments: weekData.totalMoments
          }
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener vista previa: ${error.message}`);
    }
  }

  /**
   * Obtener días de la semana con estado (completado/pendiente)
   * @param {string} userId 
   * @returns {Promise<Object>}
   */
  async getWeeklyDays(userId) {
    try {
      const currentDate = new Date();
      const weekInfo = this.calculateWeekInfo(currentDate);
      
      // Obtener días de la semana
      const days = await this.repository.getWeeklyDays(userId, weekInfo.fechaInicio, weekInfo.fechaFin);
      
      return {
        success: true,
        data: {
          weekNumber: weekInfo.semana,
          dateRange: weekInfo.rango,
          days
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener días de la semana: ${error.message}`);
    }
  }

  /**
   * Generar PDF real del libro semanal con diseño bonito
   * @param {string} userId 
   * @returns {Promise<Object>}
   */
  async generatePDF(userId) {
    try {
      const currentDate = new Date();
      const weekInfo = this.calculateWeekInfo(currentDate);
      
      // Obtener datos para el PDF
      const weekData = await this.repository.getWeeklyData(userId, weekInfo.fechaInicio, weekInfo.fechaFin);
      
      // Preparar datos para el PDF
      const pdfData = {
        weekNumber: weekInfo.semana,
        dateRange: weekInfo.rango,
        childName: 'Sofia', // Esto debería venir de la base de datos
        momName: 'Mamá',
        days: weekData.days,
        summary: {
          completedDays: weekData.completedDays,
          totalPhotos: weekData.totalPhotos,
          totalWords: weekData.totalWords,
          totalMoments: weekData.totalMoments
        }
      };
      
      // Generar PDF con diseño bonito
      const pdfPath = await this.pdfGenerator.generateWeeklyDiaryPDF(pdfData, userId);
      const pdfUrl = this.pdfGenerator.getPublicURL(pdfPath);
      
      return {
        success: true,
        data: {
          pdfUrl,
          pdfPath,
          weekNumber: weekInfo.semana,
          dateRange: weekInfo.rango,
          generatedAt: new Date().toISOString(),
          fileSize: await this.getFileSize(pdfPath)
        }
      };
    } catch (error) {
      throw new Error(`Error al generar PDF: ${error.message}`);
    }
  }

  /**
   * Obtener tamaño del archivo PDF
   * @param {string} filePath 
   * @returns {Promise<string>}
   */
  async getFileSize(filePath) {
    try {
      const fs = require('fs').promises;
      const stats = await fs.stat(filePath);
      const bytes = stats.size;
      
      if (bytes === 0) return '0 Bytes';
      
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    } catch (error) {
      return 'Desconocido';
    }
  }

  /**
   * Obtener lista de días anteriores con estado
   * @param {string} userId 
   * @returns {Promise<Object>}
   */
  async getPreviousDays(userId) {
    try {
      const currentDate = new Date();
      const weekInfo = this.calculateWeekInfo(currentDate);
      
      // Obtener días anteriores
      const previousDays = await this.repository.getPreviousDays(userId, weekInfo.fechaInicio);
      
      return {
        success: true,
        data: {
          weekNumber: weekInfo.semana,
          dateRange: weekInfo.rango,
          days: previousDays
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener días anteriores: ${error.message}`);
    }
  }

  /**
   * Obtener día específico para editar
   * @param {string} userId 
   * @param {number} dayNumber 
   * @returns {Promise<Object>}
   */
  async getSpecificDay(userId, dayNumber) {
    try {
      const currentDate = new Date();
      const weekInfo = this.calculateWeekInfo(currentDate);
      
      // Calcular fecha del día específico
      const startDate = new Date(weekInfo.fechaInicio);
      const dayDate = new Date(startDate);
      dayDate.setDate(startDate.getDate() + (dayNumber - 1));
      
      // Obtener datos del día
      const dayData = await this.repository.getSpecificDay(userId, dayDate);
      
      return {
        success: true,
        data: {
          dayNumber: parseInt(dayNumber),
          date: dayDate.toISOString().split('T')[0],
          dayName: this.getDayName(dayNumber),
          data: dayData
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener día específico: ${error.message}`);
    }
  }

  /**
   * Obtener emociones disponibles (6 emociones con colores)
   * @returns {Promise<Object>}
   */
  async getAvailableEmotions() {
    try {
      const emotions = [
        { id: 'happy', emoji: '😊', color: '#FFD700', name: 'Feliz', sparkle: '✨' },
        { id: 'sad', emoji: '😢', color: '#87CEEB', name: 'Triste', sparkle: '💙' },
        { id: 'proud', emoji: '😌', color: '#98FB98', name: 'Orgulloso', sparkle: '🌟' },
        { id: 'excited', emoji: '🤩', color: '#FFB6C1', name: 'Emocionado', sparkle: '🎉' },
        { id: 'calm', emoji: '😌', color: '#DDA0DD', name: 'Tranquilo', sparkle: '🦋' },
        { id: 'grateful', emoji: '🙏', color: '#F0E68C', name: 'Agradecido', sparkle: '💝' }
      ];
      
      return {
        success: true,
        data: emotions
      };
    } catch (error) {
      throw new Error(`Error al obtener emociones: ${error.message}`);
    }
  }

  /**
   * Obtener nombre del día
   * @param {number} dayNumber 
   * @returns {string}
   */
  getDayName(dayNumber) {
    const dayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    return dayNames[dayNumber - 1] || 'Día';
  }

  /**
   * Obtener vista previa del PDF (HTML)
   * @param {string} userId 
   * @returns {Promise<Object>}
   */
  async getPDFPreview(userId) {
    try {
      const currentDate = new Date();
      const weekInfo = this.calculateWeekInfo(currentDate);
      
      // Obtener datos para el PDF
      const weekData = await this.repository.getWeeklyData(userId, weekInfo.fechaInicio, weekInfo.fechaFin);
      
      // Preparar datos para el HTML
      const pdfData = {
        weekNumber: weekInfo.semana,
        dateRange: weekInfo.rango,
        childName: 'Sofia', // Esto debería venir de la base de datos
        momName: 'Mamá',
        days: weekData.days,
        summary: {
          completedDays: weekData.completedDays,
          totalPhotos: weekData.totalPhotos,
          totalWords: weekData.totalWords,
          totalMoments: weekData.totalMoments
        }
      };
      
      // Generar HTML bonito
      const html = this.pdfGenerator.generateBeautifulHTML(pdfData);
      
      return {
        success: true,
        data: {
          html,
          weekNumber: weekInfo.semana,
          dateRange: weekInfo.rango,
          generatedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      throw new Error(`Error al obtener vista previa: ${error.message}`);
    }
  }
}

module.exports = MomsWeekService;
