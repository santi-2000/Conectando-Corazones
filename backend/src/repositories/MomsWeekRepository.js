/**
 * Repository para Moms Week
 * Maneja el acceso a datos del seguimiento semanal de mamás
 */

const { query } = require('../../config/database');

class MomsWeekRepository {
  constructor() {
    this.tableName = 'moms_week_entries';
  }

  /**
   * Verificar si existe entrada para una fecha (por día)
   * @param {string} userId
   * @param {string} fechaISO - 'YYYY-MM-DD'
   * @returns {Promise<boolean>}
   */
  async hasEntryForDate(userId, fechaISO) {
    const sql = `
      SELECT id FROM ${this.tableName}
      WHERE user_id = ? AND DATE(fecha_entrada) = DATE(?) AND activo = TRUE
      LIMIT 1
    `;
    const results = await query(sql, [userId, fechaISO]);
    return results.length > 0;
  }

  /**
   * Verificar si ya existe entrada hoy
   * @param {string} userId
   * @returns {Promise<boolean>}
   */
  async hasEntryToday(userId) {
    const sql = `
      SELECT id FROM ${this.tableName}
      WHERE user_id = ? AND DATE(fecha_entrada) = CURDATE() AND activo = TRUE
      LIMIT 1
    `;
    const results = await query(sql, [userId]);
    return results.length > 0;
  }

  /**
   * Obtener estadísticas de la semana
   * @param {string} userId 
   * @param {string} fechaInicio 
   * @param {string} fechaFin 
   * @returns {Promise<Object>}
   */
  async getWeekStatistics(userId, fechaInicio, fechaFin) {
    const sql = `
      SELECT 
        COUNT(*) as entradas,
        SUM(fotos) as fotos,
        SUM(palabras) as palabras,
        SUM(momentos_felices) as momentos_felices,
        AVG(palabras) as promedio_palabras_por_dia
      FROM ${this.tableName}
      WHERE user_id = ? 
      AND DATE(fecha_entrada) BETWEEN ? AND ?
      AND activo = TRUE
    `;

    const [stats] = await query(sql, [userId, fechaInicio, fechaFin]);
    
    return {
      entradas: stats.entradas || 0,
      fotos: stats.fotos || 0,
      palabras: stats.palabras || 0,
      momentosFelices: stats.momentos_felices || 0,
      promedioPalabrasPorDia: Math.round(stats.promedio_palabras_por_dia || 0)
    };
  }

  /**
   * Agregar entrada del día
   * @param {string} userId 
   * @param {Object} entryData 
   * @returns {Promise<Object>}
   */
  async addDailyEntry(userId, entryData) {
    const {
      titulo,
      contenido,
      fotos = [],
      comentarios = [],
      palabras = 0,
      momentos_felices = 0,
      emociones = [],
      emocion,
      tags = []
    } = entryData;

    // Calcular el número de fotos
    const numFotos = Array.isArray(fotos) ? fotos.length : 0;
    
    // Calcular el número de palabras de los comentarios
    const numPalabras = Array.isArray(comentarios) ? 
      comentarios.reduce((total, comentario) => total + (comentario.split(' ').length || 0), 0) : 0;

    const sql = `
      INSERT INTO ${this.tableName} (
        user_id, titulo, contenido, fotos, palabras, 
        momentos_felices, emocion, tags, fecha_entrada, activo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), TRUE)
    `;

    const result = await query(sql, [
      userId, 
      titulo || null, 
      contenido || null, 
      numFotos, 
      numPalabras,
      momentos_felices, 
      emocion || null, 
      JSON.stringify(tags)
    ]);

    return {
      id: result.insertId,
      userId,
      titulo,
      contenido,
      fotos,
      palabras,
      momentosFelices: momentos_felices,
      emocion,
      tags,
      fechaEntrada: new Date().toISOString()
    };
  }

  /**
   * Generar libro semanal
   * @param {string} userId 
   * @param {string} fechaInicio 
   * @param {string} fechaFin 
   * @returns {Promise<Object>}
   */
  async generateWeeklyBook(userId, fechaInicio, fechaFin) {
    const sql = `
      SELECT 
        titulo,
        contenido,
        fotos,
        palabras,
        momentos_felices,
        emocion,
        tags,
        fecha_entrada
      FROM ${this.tableName}
      WHERE user_id = ? 
      AND DATE(fecha_entrada) BETWEEN ? AND ?
      AND activo = TRUE
      ORDER BY fecha_entrada ASC
    `;

    const entries = await query(sql, [userId, fechaInicio, fechaFin]);
    
    const totalStats = await this.getWeekStatistics(userId, fechaInicio, fechaFin);
    
    return {
      entradas: entries.map(entry => ({
        titulo: entry.titulo,
        contenido: entry.contenido,
        fotos: entry.fotos,
        palabras: entry.palabras,
        momentosFelices: entry.momentos_felices,
        emocion: entry.emocion,
        tags: this.parseTags(entry.tags),
        fecha: entry.fecha_entrada
      })),
      fotos: totalStats.fotos,
      palabras: totalStats.palabras,
      momentosFelices: totalStats.momentosFelices,
      totalEntradas: totalStats.entradas
    };
  }

  /**
   * Obtener historial de semanas
   * @param {string} userId 
   * @param {Object} pagination 
   * @returns {Promise<Object>}
   */
  async getWeekHistory(userId, pagination = {}) {
    const { page = 1, limit = 10 } = pagination;
    const offset = (page - 1) * limit;

    // Obtener semanas con estadísticas
    const sql = `
      SELECT 
        YEAR(fecha_entrada) as año,
        WEEK(fecha_entrada) as semana,
        MIN(DATE(fecha_entrada)) as fecha_inicio,
        MAX(DATE(fecha_entrada)) as fecha_fin,
        COUNT(*) as entradas,
        SUM(fotos) as fotos,
        SUM(palabras) as palabras,
        SUM(momentos_felices) as momentos_felices
      FROM ${this.tableName}
      WHERE user_id = ? AND activo = TRUE
      GROUP BY YEAR(fecha_entrada), WEEK(fecha_entrada)
      ORDER BY año DESC, semana DESC
    `;

    const weeks = await query(sql, [userId]);

    // Contar total de semanas
    const countSql = `
      SELECT COUNT(DISTINCT YEAR(fecha_entrada), WEEK(fecha_entrada)) as total
      FROM ${this.tableName}
      WHERE user_id = ? AND activo = TRUE
    `;

    const [countResult] = await query(countSql, [userId]);
    const totalWeeks = countResult.total;

    return {
      weeks: weeks.map(week => ({
        año: week.año,
        semana: week.semana,
        fechaInicio: week.fecha_inicio,
        fechaFin: week.fecha_fin,
        entradas: week.entradas,
        fotos: week.fotos,
        palabras: week.palabras,
        momentosFelices: week.momentos_felices
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalWeeks,
        totalPages: Math.ceil(totalWeeks / limit)
      }
    };
  }

  /**
   * Parsear tags de JSON de forma segura
   * @param {string} tagsJson 
   * @returns {Array}
   */
  parseTags(tagsJson) {
    try {
      if (!tagsJson) return [];
      
      // Si ya es un array, devolverlo
      if (Array.isArray(tagsJson)) return tagsJson;
      
      // Si es string, intentar parsearlo
      if (typeof tagsJson === 'string') {
        const parsed = JSON.parse(tagsJson);
        return Array.isArray(parsed) ? parsed : [];
      }
      
      return [];
    } catch (error) {
      console.warn('Error parsing tags JSON:', error.message);
      return [];
    }
  }

  // ===== NUEVOS MÉTODOS PARA PANTALLAS ESPECÍFICAS =====

  /**
   * Obtener estadísticas semanales (fotos, palabras, momentos felices)
   * @param {string} userId 
   * @param {string} fechaInicio 
   * @param {string} fechaFin 
   * @returns {Promise<Object>}
   */
  async getWeeklyStats(userId, fechaInicio, fechaFin) {
    const sql = `
      SELECT 
        COUNT(*) as entradas,
        SUM(fotos) as fotos,
        SUM(palabras) as palabras,
        SUM(momentos_felices) as momentos_felices,
        GROUP_CONCAT(DISTINCT emocion) as emociones
      FROM ${this.tableName}
      WHERE user_id = ? 
      AND DATE(fecha_entrada) BETWEEN ? AND ?
      AND activo = TRUE
    `;

    const [result] = await query(sql, [userId, fechaInicio, fechaFin]);
    
    return {
      entradas: result.entradas || 0,
      fotos: result.fotos || 0,
      palabras: result.palabras || 0,
      momentos_felices: result.momentos_felices || 0,
      emociones: result.emociones ? result.emociones.split(',') : []
    };
  }

  /**
   * Obtener días completados de la semana (para estrellas)
   * @param {string} userId 
   * @param {string} fechaInicio 
   * @param {string} fechaFin 
   * @returns {Promise<Array>}
   */
  async getCompletedDays(userId, fechaInicio, fechaFin) {
    const sql = `
      SELECT 
        DAYOFWEEK(fecha_entrada) as dia_semana
      FROM ${this.tableName}
      WHERE user_id = ? 
      AND DATE(fecha_entrada) BETWEEN ? AND ?
      AND activo = TRUE
      GROUP BY DATE(fecha_entrada), DAYOFWEEK(fecha_entrada)
    `;

    const results = await query(sql, [userId, fechaInicio, fechaFin]);
    
    // Convertir días de la semana (1=domingo, 2=lunes, etc.) a (1=lunes, 7=domingo)
    return results.map(row => {
      const dayOfWeek = row.dia_semana;
      return dayOfWeek === 1 ? 7 : dayOfWeek - 1; // Domingo=7, Lunes=1, etc.
    });
  }

  /**
   * Obtener datos completos de la semana para vista previa
   * @param {string} userId 
   * @param {string} fechaInicio 
   * @param {string} fechaFin 
   * @returns {Promise<Object>}
   */
  async getWeeklyData(userId, fechaInicio, fechaFin) {
    const sql = `
      SELECT 
        DATE(fecha_entrada) as fecha,
        DAYOFWEEK(fecha_entrada) as dia_semana,
        COUNT(*) as entradas,
        SUM(fotos) as fotos,
        SUM(palabras) as palabras,
        SUM(momentos_felices) as momentos_felices,
        GROUP_CONCAT(DISTINCT emocion) as emociones,
        GROUP_CONCAT(DISTINCT tags) as tags
      FROM ${this.tableName}
      WHERE user_id = ? 
      AND DATE(fecha_entrada) BETWEEN ? AND ?
      AND activo = TRUE
      GROUP BY DATE(fecha_entrada), DAYOFWEEK(fecha_entrada)
      ORDER BY DATE(fecha_entrada)
    `;

    const results = await query(sql, [userId, fechaInicio, fechaFin]);
    
    const days = results.map(row => {
      const dayOfWeek = row.dia_semana;
      const dayNumber = dayOfWeek === 1 ? 7 : dayOfWeek - 1; // Convertir a formato 1-7 (lunes-domingo)
      
      return {
        fecha: row.fecha,
        dia: dayNumber,
        entradas: row.entradas,
        fotos: row.fotos || 0,
        palabras: row.palabras || 0,
        momentosFelices: row.momentos_felices || 0,
        emociones: row.emociones ? row.emociones.split(',') : [],
        tags: this.parseTags(row.tags)
      };
    });

    const totalPhotos = results.reduce((sum, row) => sum + (row.fotos || 0), 0);
    const totalWords = results.reduce((sum, row) => sum + (row.palabras || 0), 0);
    const totalMoments = results.reduce((sum, row) => sum + (row.momentos_felices || 0), 0);

    return {
      days,
      completedDays: results.length,
      totalPhotos,
      totalWords,
      totalMoments
    };
  }

  /**
   * Obtener días de la semana con estado
   * @param {string} userId 
   * @param {string} fechaInicio 
   * @param {string} fechaFin 
   * @returns {Promise<Array>}
   */
  async getWeeklyDays(userId, fechaInicio, fechaFin) {
    const sql = `
      SELECT 
        DATE(fecha_entrada) as fecha,
        DAYOFWEEK(fecha_entrada) as dia_semana,
        COUNT(*) as entradas,
        SUM(fotos) as fotos,
        SUM(palabras) as palabras,
        SUM(momentos_felices) as momentos_felices,
        GROUP_CONCAT(DISTINCT emocion) as emociones
      FROM ${this.tableName}
      WHERE user_id = ? 
      AND DATE(fecha_entrada) BETWEEN ? AND ?
      AND activo = TRUE
      GROUP BY DATE(fecha_entrada), DAYOFWEEK(fecha_entrada)
      ORDER BY DATE(fecha_entrada)
    `;

    const results = await query(sql, [userId, fechaInicio, fechaFin]);
    
    return results.map(row => {
      const dayOfWeek = row.dia_semana;
      const dayNumber = dayOfWeek === 1 ? 7 : dayOfWeek - 1;
      
      return {
        fecha: row.fecha,
        dia: dayNumber,
        diaNombre: this.getDayName(dayNumber),
        completado: true,
        entradas: row.entradas,
        fotos: row.fotos || 0,
        palabras: row.palabras || 0,
        momentosFelices: row.momentos_felices || 0,
        emociones: row.emociones ? row.emociones.split(',') : []
      };
    });
  }

  /**
   * Obtener días anteriores con estado
   * @param {string} userId 
   * @param {string} fechaInicio 
   * @returns {Promise<Array>}
   */
  async getPreviousDays(userId, fechaInicio) {
    const sql = `
      SELECT 
        DATE(fecha_entrada) as fecha,
        DAYOFWEEK(fecha_entrada) as dia_semana,
        COUNT(*) as entradas,
        SUM(fotos) as fotos,
        SUM(palabras) as palabras,
        SUM(momentos_felices) as momentos_felices,
        GROUP_CONCAT(DISTINCT emocion) as emociones
      FROM ${this.tableName}
      WHERE user_id = ? 
      AND DATE(fecha_entrada) < ?
      AND activo = TRUE
      GROUP BY DATE(fecha_entrada), DAYOFWEEK(fecha_entrada)
      ORDER BY DATE(fecha_entrada) DESC
      LIMIT 7
    `;

    const results = await query(sql, [userId, fechaInicio]);
    
    return results.map(row => {
      const dayOfWeek = row.dia_semana;
      const dayNumber = dayOfWeek === 1 ? 7 : dayOfWeek - 1;
      
      return {
        fecha: row.fecha,
        dia: dayNumber,
        diaNombre: this.getDayName(dayNumber),
        completado: true,
        entradas: row.entradas,
        fotos: row.fotos || 0,
        palabras: row.palabras || 0,
        momentosFelices: row.momentos_felices || 0,
        emociones: row.emociones ? row.emociones.split(',') : []
      };
    });
  }

  /**
   * Obtener día específico para editar
   * @param {string} userId 
   * @param {Date} fecha 
   * @returns {Promise<Object>}
   */
  async getSpecificDay(userId, fecha) {
    const fechaStr = fecha.toISOString().split('T')[0];
    
    const sql = `
      SELECT 
        id,
        user_id,
        fecha_entrada,
        fotos,
        palabras,
        momentos_felices,
        emocion,
        tags,
        activo,
        created_at,
        updated_at
      FROM ${this.tableName}
      WHERE user_id = ? 
      AND DATE(fecha_entrada) = ?
      AND activo = TRUE
      ORDER BY fecha_entrada DESC
    `;

    const results = await query(sql, [userId, fechaStr]);
    
    if (results.length === 0) {
      return null;
    }

    // Combinar todas las entradas del día
    const combined = results.reduce((acc, row) => {
      return {
        fecha: row.fecha_entrada,
        fotos: (acc.fotos || 0) + (row.fotos || 0),
        palabras: (acc.palabras || 0) + (row.palabras || 0),
        momentosFelices: (acc.momentosFelices || 0) + (row.momentos_felices || 0),
        emocion: row.emocion || acc.emocion,
        tags: [...(acc.tags || []), ...this.parseTags(row.tags)],
        entradas: (acc.entradas || 0) + 1
      };
    }, {});

    return combined;
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
}

module.exports = MomsWeekRepository;
