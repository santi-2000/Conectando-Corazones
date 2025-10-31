const { query } = require('../../config/database');

class CalendarRepository {
  constructor() {
    this.tableName = 'eventos';
  }

  /**
   * Obtener todos los eventos de un usuario
   * @param {string} userId 
   * @param {Object} filters 
   * @returns {Promise<Array>}
   */
  async findAll(userId, filters = {}) {
    let whereClause = 'WHERE creador_id = ? AND estado = "activo"';
    let params = [userId];

    if (filters.mes) {
      whereClause += ' AND MONTH(inicio) = ?';
      params.push(filters.mes);
    }

    if (filters.año) {
      whereClause += ' AND YEAR(inicio) = ?';
      params.push(filters.año);
    }

    if (filters.tipo) {
      whereClause += ' AND tipo = ?';
      params.push(filters.tipo);
    }

    if (filters.fecha_inicio && filters.fecha_fin) {
      whereClause += ' AND inicio BETWEEN ? AND ?';
      params.push(filters.fecha_inicio, filters.fecha_fin);
    }

    const sql = `
      SELECT 
        id, creador_id, titulo, descripcion, inicio, fin,
        color, tipo, recordatorio_minutos,
        ubicacion, estado, created_at, updated_at
      FROM ${this.tableName}
      ${whereClause}
      ORDER BY inicio ASC
    `;

    const results = await query(sql, params);
    return results.map(row => this.formatEvent(row));
  }

  /**
   * Obtener un evento por ID
   * @param {string} eventId 
   * @returns {Promise<Object|null>}
   */
  async findById(eventId) {
    const sql = `
      SELECT 
        id, creador_id, titulo, descripcion, inicio, fin,
        color, tipo, recordatorio_minutos,
        ubicacion, estado, created_at, updated_at
      FROM ${this.tableName}
      WHERE id = ? AND estado = "activo"
    `;

    const results = await query(sql, [eventId]);
    return results.length > 0 ? this.formatEvent(results[0]) : null;
  }

  /**
   * Crear un nuevo evento
   * @param {string} userId 
   * @param {Object} eventData 
   * @returns {Promise<Object>}
   */
  async create(userId, eventData) {
    const {
      titulo,
      descripcion,
      inicio,
      fin,
      color,
      tipo,
      recordatorio_minutos,
      ubicacion
    } = eventData;

    const sql = `
      INSERT INTO ${this.tableName} (
        creador_id, titulo, descripcion, inicio, fin,
        color, tipo, recordatorio_minutos, ubicacion, estado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, "activo")
    `;

    // Validar que userId no sea undefined o null
    if (!userId || (typeof userId === 'string' && userId.trim() === '')) {
      throw new Error('userId es requerido y no puede estar vacío');
    }

    const params = [
      String(userId), // Asegurar que sea string
      titulo || null, 
      descripcion || null, 
      inicio || null, 
      fin || null,
      color || null, 
      tipo || null, 
      recordatorio_minutos || 0, 
      ubicacion || null
    ];

    console.log('📅 CalendarRepository.create: userId:', userId, 'params:', params);

    const result = await query(sql, params);
    return this.findById(result.insertId);
  }

  /**
   * Actualizar un evento
   * @param {string} eventId 
   * @param {Object} eventData 
   * @returns {Promise<Object|null>}
   */
  async update(eventId, eventData) {
    const {
      titulo,
      descripcion,
      inicio,
      fin,
      color,
      tipo,
      recordatorio_minutos,
      ubicacion
    } = eventData;

    const sql = `
      UPDATE ${this.tableName} 
      SET titulo = ?, descripcion = ?, inicio = ?, fin = ?,
          color = ?, tipo = ?, recordatorio_minutos = ?, ubicacion = ?,
          updated_at = NOW()
      WHERE id = ? AND estado = "activo"
    `;

    const params = [
      titulo || null,
      descripcion || null,
      inicio || null,
      fin || null,
      color || null,
      tipo || null,
      recordatorio_minutos || 0,
      ubicacion || null,
      eventId
    ];

    await query(sql, params);
    return this.findById(eventId);
  }

  /**
   * Eliminar un evento (soft delete)
   * @param {string} eventId 
   * @returns {Promise<boolean>}
   */
  async delete(eventId) {
    const sql = `
      UPDATE ${this.tableName} 
      SET estado = "cancelado", updated_at = NOW()
      WHERE id = ? AND estado = "activo"
    `;

    const result = await query(sql, [eventId]);
    return result.affectedRows > 0;
  }

  /**
   * Obtener eventos por rango de fechas
   * @param {string} userId 
   * @param {string} startDate 
   * @param {string} endDate 
   * @returns {Promise<Array>}
   */
  async findByDateRange(userId, startDate, endDate) {
    const sql = `
      SELECT 
        id, creador_id, titulo, descripcion, inicio, fin,
        color, tipo, recordatorio_minutos,
        ubicacion, estado, created_at, updated_at
      FROM ${this.tableName}
      WHERE creador_id = ? AND estado = "activo"
      AND inicio BETWEEN ? AND ?
      ORDER BY inicio ASC
    `;

    const results = await query(sql, [userId, startDate, endDate]);
    return results.map(row => this.formatEvent(row));
  }

  /**
   * Obtener eventos por tipo
   * @param {string} userId 
   * @param {string} tipo 
   * @returns {Promise<Array>}
   */
  async findByType(userId, tipo) {
    const sql = `
      SELECT 
        id, creador_id, titulo, descripcion, inicio, fin,
        color, tipo, recordatorio_minutos,
        ubicacion, estado, created_at, updated_at
      FROM ${this.tableName}
      WHERE creador_id = ? AND tipo = ? AND estado = "activo"
      ORDER BY inicio ASC
    `;

    const results = await query(sql, [userId, tipo]);
    return results.map(row => this.formatEvent(row));
  }

  /**
   * Obtener estadísticas de eventos
   * @param {string} userId 
   * @returns {Promise<Object>}
   */
  async getStats(userId) {
    const totalQuery = `
      SELECT COUNT(*) as total 
      FROM ${this.tableName} 
      WHERE creador_id = ? AND estado = "activo"
    `;
    const [totalResult] = await query(totalQuery, [userId]);
    const total = totalResult.total;

    const thisMonthQuery = `
      SELECT COUNT(*) as esteMes 
      FROM ${this.tableName} 
      WHERE creador_id = ? AND estado = "activo" 
      AND MONTH(inicio) = MONTH(CURRENT_DATE()) 
      AND YEAR(inicio) = YEAR(CURRENT_DATE())
    `;
    const [thisMonthResult] = await query(thisMonthQuery, [userId]);
    const esteMes = thisMonthResult.esteMes;

    const byTypeQuery = `
      SELECT tipo, COUNT(*) as cantidad 
      FROM ${this.tableName} 
      WHERE creador_id = ? AND estado = "activo" 
      GROUP BY tipo
    `;
    const byTypeResults = await query(byTypeQuery, [userId]);
    const porTipo = byTypeResults.reduce((acc, row) => {
      acc[row.tipo] = row.cantidad;
      return acc;
    }, {});

    return {
      total,
      esteMes,
      porTipo
    };
  }

  /**
   * Formatear evento para respuesta
   * @param {Object} row 
   * @returns {Object}
   */
  formatEvent(row) {
    return {
      id: row.id,
      creador_id: row.creador_id,
      titulo: row.titulo,
      descripcion: row.descripcion,
      inicio: row.inicio,
      fin: row.fin,
      color: row.color,
      tipo: row.tipo,
      recordatorio_minutos: row.recordatorio_minutos,
      ubicacion: row.ubicacion,
      estado: row.estado,
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }
}

module.exports = CalendarRepository;
