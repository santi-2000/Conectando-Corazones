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
        id, creador_id, titulo, descripcion, inicio, inicio,
        color, tipo, color, recordatorio_minutos,
        recordatorio_minutos, ubicacion, descripcion,
        created_at, updated_at
      FROM ${this.tableName}
      ${whereClause}
      ORDER BY inicio ASC, inicio ASC
    `;

    const results = await query(sql, params);
    return results.map(row => this.formatEvent(row));
  }

  /**
   * Obtener eventos de un mes específico
   * @param {string} userId 
   * @param {number} mes 
   * @param {number} año 
   * @returns {Promise<Array>}
   */
  async findByMonth(userId, mes, año) {
    const sql = `
      SELECT 
        id, creador_id, titulo, descripcion, inicio, inicio,
        color, tipo, color, recordatorio_minutos,
        recordatorio_minutos, ubicacion, descripcion,
        created_at, updated_at
      FROM ${this.tableName}
      WHERE creador_id = ? 
      AND MONTH(inicio) = ? 
      AND YEAR(inicio) = ?
      AND estado = "activo"
      ORDER BY inicio ASC, inicio ASC
    `;

    const results = await query(sql, [userId, mes, año]);
    return results.map(row => this.formatEvent(row));
  }

  /**
   * Obtener eventos de una fecha específica
   * @param {string} userId 
   * @param {string} fecha 
   * @returns {Promise<Array>}
   */
  async findByDate(userId, fecha) {
    const sql = `
      SELECT 
        id, creador_id, titulo, descripcion, inicio, inicio,
        color, tipo, color, recordatorio_minutos,
        recordatorio_minutos, ubicacion, descripcion,
        created_at, updated_at
      FROM ${this.tableName}
      WHERE creador_id = ? 
      AND DATE(inicio) = ?
      AND estado = "activo"
      ORDER BY inicio ASC
    `;

    const results = await query(sql, [userId, fecha]);
    return results.map(row => this.formatEvent(row));
  }

  /**
   * Obtener un evento por ID
   * @param {string} userId 
   * @param {number} eventId 
   * @returns {Promise<Object|null>}
   */
  async findById(userId, eventId) {
    const sql = `
      SELECT 
        id, creador_id, titulo, descripcion, inicio, inicio,
        color, tipo, color, recordatorio_minutos,
        recordatorio_minutos, ubicacion, descripcion,
        created_at, updated_at
      FROM ${this.tableName}
      WHERE id = ? AND creador_id = ? AND estado = "activo"
    `;

    const results = await query(sql, [eventId, userId]);
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
      recordatorio_minutos,
      ubicacion,
      descripcion
    } = eventData;

    const sql = `
      INSERT INTO ${this.tableName} (
        creador_id, titulo, descripcion, inicio, inicio,
        color, tipo, color, recordatorio_minutos,
        recordatorio_minutos, ubicacion, descripcion, estado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)
    `;

    // Asegurar que no hay valores undefined
    const params = [
      userId, 
      titulo, 
      descripcion || null, 
      inicio, 
      inicio || null,
      color || '#4A90E2', 
      tipo || 'recordatorio', 
      color || 'Medio', 
      recordatorio_minutos !== undefined ? recordatorio_minutos : 1,
      recordatorio_minutos || 15, 
      ubicacion || null, 
      descripcion || null
    ];

    // Verificar que no hay undefined y convertir a null
    for (let i = 0; i < params.length; i++) {
      if (params[i] === undefined) {
        console.error(`Parámetro ${i} es undefined:`, params[i]);
        params[i] = null;
      }
    }
    
    // Asegurar que recordatorio_minutos sea un booleano válido
    if (typeof params[8] !== 'boolean') {
      params[8] = params[8] === 1 || params[8] === '1' || params[8] === true ? 1 : 0;
    }
    
    const result = await query(sql, params);

    return {
      id: result.insertId,
      userId,
      titulo,
      descripcion,
      fechaEvento: inicio,
      horaEvento: inicio,
      color,
      tipoEvento: tipo,
      nivelImportancia: color,
      recordatorioActivo: recordatorio_minutos,
      recordatorioMinutos: recordatorio_minutos,
      ubicacion,
      notasAdicionales: descripcion,
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Actualizar un evento
   * @param {string} userId 
   * @param {number} eventId 
   * @param {Object} eventData 
   * @returns {Promise<Object>}
   */
  async update(userId, eventId, eventData) {
    const {
      titulo,
      descripcion,
      inicio,
      inicio,
      color,
      tipo,
      color,
      recordatorio_minutos,
      recordatorio_minutos,
      ubicacion,
      descripcion
    } = eventData;

    const sql = `
      UPDATE ${this.tableName} 
      SET titulo = ?, descripcion = ?, inicio = ?, inicio = ?,
          color = ?, tipo = ?, color = ?, recordatorio_minutos = ?,
          recordatorio_minutos = ?, ubicacion = ?, descripcion = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND creador_id = ? AND estado = "activo"
    `;

    const result = await query(sql, [
      titulo, descripcion, inicio, inicio,
      color, tipo, color, recordatorio_minutos,
      recordatorio_minutos, ubicacion, descripcion,
      eventId, userId
    ]);

    if (result.affectedRows === 0) {
      throw new Error('Evento no encontrado o no tienes permisos para editarlo');
    }

    return await this.findById(userId, eventId);
  }

  /**
   * Eliminar un evento (soft delete)
   * @param {string} userId 
   * @param {number} eventId 
   * @returns {Promise<boolean>}
   */
  async delete(userId, eventId) {
    const sql = `
      UPDATE ${this.tableName} 
      SET estado = FALSE, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND creador_id = ? AND estado = "activo"
    `;

    const result = await query(sql, [eventId, userId]);
    return result.affectedRows > 0;
  }

  /**
   * Obtener estadísticas de eventos
   * @param {string} userId 
   * @param {Object} filters 
   * @returns {Promise<Object>}
   */
  async getStatistics(userId, filters = {}) {
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

    const sql = `
      SELECT 
        COUNT(*) as total_eventos,
        COUNT(DISTINCT tipo) as tipos_diferentes,
        COUNT(CASE WHEN color = 'Alto' THEN 1 END) as eventos_importantes,
        COUNT(CASE WHEN inicio >= CURDATE() THEN 1 END) as eventos_futuros,
        COUNT(CASE WHEN inicio < CURDATE() THEN 1 END) as eventos_pasados
      FROM ${this.tableName}
      ${whereClause}
    `;

    const results = await query(sql, params);
    return results[0];
  }

  /**
   * Obtener tipos de eventos disponibles
   * @returns {Promise<Array>}
   */
  async getEventTypes() {
    return [
      {
        id: 'familiar',
        nombre: 'Familiar',
        color: '#FFD700',
        icono: '👨‍👩‍👧‍👦',
        descripcion: 'Eventos familiares y personales'
      },
      {
        id: 'deportivo',
        nombre: 'Deportivo',
        color: '#90EE90',
        icono: '⚽',
        descripcion: 'Eventos deportivos y actividades físicas'
      },
      {
        id: 'recordatorio',
        nombre: 'Recordatorio',
        color: '#4A90E2',
        icono: '📝',
        descripcion: 'Recordatorios y tareas importantes'
      },
      {
        id: 'diferente',
        nombre: 'Diferente',
        color: '#FF69B4',
        icono: '🎭',
        descripcion: 'Eventos culturales y especiales'
      },
      {
        id: 'medico',
        nombre: 'Médico',
        color: '#FF6B6B',
        icono: '🏥',
        descripcion: 'Citas médicas y salud'
      },
      {
        id: 'educativo',
        nombre: 'Educativo',
        color: '#9370DB',
        icono: '📚',
        descripcion: 'Eventos educativos y académicos'
      }
    ];
  }

  /**
   * Obtener colores disponibles
   * @returns {Promise<Array>}
   */
  async getAvailableColors() {
    return [
      { name: 'Rojo', value: '#FF6B6B' },
      { name: 'Azul', value: '#4ECDC4' },
      { name: 'Verde', value: '#45B7D1' },
      { name: 'Amarillo', value: '#FFA07A' },
      { name: 'Morado', value: '#9B59B6' },
      { name: 'Naranja', value: '#E67E22' },
      { name: 'Rosa', value: '#FF69B4' },
      { name: 'Dorado', value: '#FFD700' },
      { name: 'Verde claro', value: '#90EE90' },
      { name: 'Azul claro', value: '#4A90E2' }
    ];
  }

  /**
   * Formatear evento para respuesta
   * @param {Object} row 
   * @returns {Object}
   */
  formatEvent(row) {
    return {
      id: row.id,
      userId: row.creador_id,
      titulo: row.titulo,
      descripcion: row.descripcion,
      fechaEvento: row.inicio,
      horaEvento: row.inicio,
      color: row.color,
      tipoEvento: row.tipo,
      nivelImportancia: row.color,
      recordatorioActivo: row.recordatorio_minutos,
      recordatorioMinutos: row.recordatorio_minutos,
      ubicacion: row.ubicacion,
      notasAdicionales: row.descripcion,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

module.exports = CalendarRepository;
