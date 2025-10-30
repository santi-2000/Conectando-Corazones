const { query } = require('../../config/database');

/**
 * Repositorio para manejar el acceso a datos del diario
 * pantalla de diario diario con diseño colorido y emotivo
 */
class DiaryRepository {
  constructor() {
    this.tableName = 'diary_entries';
  }

  /**
   * Crear nueva entrada del diario
   * @param {Object} diaryData 
   * @returns {Object}
   */
  async create(diaryData) {
    const sql = `
      INSERT INTO ${this.tableName} (
        user_id, fecha, titulo, contenido, fotos, 
        emocion, emocion_emoji, tags, estado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      diaryData.user_id ?? null,
      diaryData.fecha ?? null,
      diaryData.titulo ?? null,
      diaryData.contenido ?? null,
      JSON.stringify(diaryData.fotos ?? []),
      diaryData.emocion ?? null,
      diaryData.emocion_emoji ?? null,
      JSON.stringify(diaryData.tags ?? []),
      diaryData.estado ?? null
    ];

    const result = await query(sql, params);
    return await this.findById(result.insertId);
  }

  /**
   * Actualizar entrada del diario
   * @param {number} id 
   * @param {Object} diaryData 
   * @returns {Object}
   */
  async update(id, diaryData) {
    const sql = `
      UPDATE ${this.tableName} SET
        titulo = ?, contenido = ?, fotos = ?, 
        emocion = ?, emocion_emoji = ?, tags = ?, 
        estado = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const params = [
      diaryData.titulo,
      diaryData.contenido,
      JSON.stringify(diaryData.fotos),
      diaryData.emocion,
      diaryData.emocion_emoji,
      JSON.stringify(diaryData.tags),
      diaryData.estado,
      id
    ];

    await query(sql, params);
    return await this.findById(id);
  }

  /**
   * Eliminar entrada del diario
   * @param {number} id 
   * @returns {boolean}
   */
  async delete(id) {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    await query(sql, [id]);
    return true;
  }

  /**
   * Buscar entrada por ID
   * @param {number} id 
   * @returns {Object}
   */
  async findById(id) {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const results = await query(sql, [id]);
    return results.length > 0 ? this.formatEntry(results[0]) : null;
  }

  /**
   * Buscar entrada por usuario y fecha
   * @param {string} userId 
   * @param {string} fecha 
   * @returns {Object}
   */
  async findByUserAndDate(userId, fecha) {
    const sql = `
      SELECT * FROM ${this.tableName} 
      WHERE user_id = ? AND fecha = ?
      ORDER BY created_at DESC
      LIMIT 1
    `;
    
    const results = await query(sql, [userId, fecha]);
    return results.length > 0 ? this.formatEntry(results[0]) : null;
  }

  /**
   * Buscar entradas por usuario y rango de fechas
   * @param {string} userId 
   * @param {string} fechaInicio 
   * @param {string} fechaFin 
   * @returns {Array}
   */
  async findByUserAndDateRange(userId, fechaInicio, fechaFin) {
    const sql = `
      SELECT * FROM ${this.tableName} 
      WHERE user_id = ? AND fecha BETWEEN ? AND ?
      ORDER BY fecha ASC
    `;
    
    const results = await query(sql, [userId, fechaInicio, fechaFin]);
    return results.map(entry => this.formatEntry(entry));
  }

  /**
   * Buscar entradas por usuario con paginación
   * @param {string} userId 
   * @param {number} limit 
   * @param {number} offset 
   * @returns {Array}
   */
  async findByUserWithPagination(userId, limit, offset) {
    const sql = `
      SELECT * FROM ${this.tableName} 
      WHERE user_id = ?
      ORDER BY fecha DESC
    `;
    
    const results = await query(sql, [userId]);
    return results.map(entry => this.formatEntry(entry));
  }

  /**
   * Buscar entradas recientes por usuario
   * @param {string} userId 
   * @param {number} limit 
   * @returns {Array}
   */
  async findRecentByUser(userId, limit = 7) {
    const sql = `
      SELECT * FROM ${this.tableName} 
      WHERE user_id = ?
      ORDER BY fecha DESC
    `;
    
    const results = await query(sql, [userId]);
    return results.map(entry => this.formatEntry(entry));
  }

  /**
   * Contar entradas por usuario
   * @param {string} userId 
   * @returns {number}
   */
  async countByUser(userId) {
    const sql = `SELECT COUNT(*) as total FROM ${this.tableName} WHERE user_id = ?`;
    const results = await query(sql, [userId]);
    return results[0].total;
  }

  /**
   * Obtener estadísticas por usuario
   * @param {string} userId 
   * @returns {Object}
   */
  async getStatsByUser(userId) {
    const sql = `
      SELECT 
        COUNT(*) as total_entradas,
        COUNT(CASE WHEN fotos IS NOT NULL AND JSON_LENGTH(fotos) > 0 THEN 1 END) as entradas_con_fotos,
        SUM(JSON_LENGTH(fotos)) as total_fotos,
        AVG(LENGTH(contenido)) as promedio_palabras,
        COUNT(DISTINCT emocion) as emociones_diferentes
      FROM ${this.tableName} 
      WHERE user_id = ?
    `;
    
    const results = await query(sql, [userId]);
    return results[0];
  }

  /**
   * Obtener emociones más comunes por usuario
   * @param {string} userId 
   * @param {number} limit 
   * @returns {Array}
   */
  async getTopEmotionsByUser(userId, limit = 5) {
    const sql = `
      SELECT 
        emocion,
        emocion_emoji,
        COUNT(*) as frecuencia
      FROM ${this.tableName} 
      WHERE user_id = ? AND emocion IS NOT NULL
      GROUP BY emocion, emocion_emoji
      ORDER BY frecuencia DESC
      LIMIT ?
    `;
    
    const results = await query(sql, [userId, limit]);
    return results;
  }

  /**
   * Formatear entrada del diario
   * @param {Object} entry 
   * @returns {Object}
   */
  formatEntry(entry) {
    return {
      id: entry.id,
      userId: entry.user_id,
      fecha: entry.fecha,
      titulo: entry.titulo,
      contenido: entry.contenido,
      fotos: this.parseJson(entry.fotos),
      emocion: entry.emocion,
      emocionEmoji: entry.emocion_emoji,
      tags: this.parseJson(entry.tags),
      estado: entry.estado,
      createdAt: entry.created_at,
      updatedAt: entry.updated_at
    };
  }

  /**
   * Parsear JSON de forma segura
   * @param {string} jsonString 
   * @returns {Array|Object}
   */
  parseJson(jsonString) {
    try {
      if (!jsonString) return [];
      
      // Si ya es un array u objeto, devolverlo
      if (Array.isArray(jsonString) || typeof jsonString === 'object') {
        return jsonString;
      }
      
      // Si es string, intentar parsearlo
      if (typeof jsonString === 'string') {
        // Si parece ser una URL o texto plano, devolverlo como array
        if (jsonString.startsWith('http') || jsonString.includes(',')) {
          return jsonString.split(',').map(item => item.trim());
        }
        return JSON.parse(jsonString);
      }
      
      return [];
    } catch (error) {
      console.warn('Error parsing JSON:', error.message);
      return [];
    }
  }
}

module.exports = DiaryRepository;
