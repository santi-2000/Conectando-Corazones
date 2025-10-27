const { query } = require('../../config/database');

class CalendarRepository {
  constructor() {
    this.tableName = 'calendar_events';
  }

  /**
   * Obtener todos los eventos de un usuario
   * @param {string} userId 
   * @param {Object} filters 
   * @returns {Promise<Array>}
   */
  async findAll(userId, filters = {}) {
    let whereClause = 'WHERE user_id = ? AND activo = TRUE';
    let params = [userId];

    if (filters.mes) {
      whereClause += ' AND MONTH(fecha_evento) = ?';
      params.push(filters.mes);
    }

    if (filters.año) {
      whereClause += ' AND YEAR(fecha_evento) = ?';
      params.push(filters.año);
    }

    if (filters.tipo_evento) {
      whereClause += ' AND tipo_evento = ?';
      params.push(filters.tipo_evento);
    }

    if (filters.fecha_inicio && filters.fecha_fin) {
      whereClause += ' AND fecha_evento BETWEEN ? AND ?';
      params.push(filters.fecha_inicio, filters.fecha_fin);
    }

    const sql = `
      SELECT 
        id, user_id, titulo, descripcion, fecha_evento, hora_evento,
        color, tipo_evento, nivel_importancia, recordatorio_activo,
        recordatorio_minutos, ubicacion, notas_adicionales,
        created_at, updated_at
      FROM ${this.tableName}
      ${whereClause}
      ORDER BY fecha_evento ASC, hora_evento ASC
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
        id, user_id, titulo, descripcion, fecha_evento, hora_evento,
        color, tipo_evento, nivel_importancia, recordatorio_activo,
        recordatorio_minutos, ubicacion, notas_adicionales,
        created_at, updated_at
      FROM ${this.tableName}
      WHERE user_id = ? 
      AND MONTH(fecha_evento) = ? 
      AND YEAR(fecha_evento) = ?
      AND activo = TRUE
      ORDER BY fecha_evento ASC, hora_evento ASC
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
        id, user_id, titulo, descripcion, fecha_evento, hora_evento,
        color, tipo_evento, nivel_importancia, recordatorio_activo,
        recordatorio_minutos, ubicacion, notas_adicionales,
        created_at, updated_at
      FROM ${this.tableName}
      WHERE user_id = ? 
      AND DATE(fecha_evento) = ?
      AND activo = TRUE
      ORDER BY hora_evento ASC
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
        id, user_id, titulo, descripcion, fecha_evento, hora_evento,
        color, tipo_evento, nivel_importancia, recordatorio_activo,
        recordatorio_minutos, ubicacion, notas_adicionales,
        created_at, updated_at
      FROM ${this.tableName}
      WHERE id = ? AND user_id = ? AND activo = TRUE
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
      fecha_evento,
      hora_evento,
      color,
      tipo_evento,
      nivel_importancia,
      recordatorio_activo,
      recordatorio_minutos,
      ubicacion,
      notas_adicionales
    } = eventData;

    const sql = `
      INSERT INTO ${this.tableName} (
        user_id, titulo, descripcion, fecha_evento, hora_evento,
        color, tipo_evento, nivel_importancia, recordatorio_activo,
        recordatorio_minutos, ubicacion, notas_adicionales, activo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE)
    `;

    // Asegurar que no hay valores undefined
    const params = [
      userId, 
      titulo, 
      descripcion || null, 
      fecha_evento, 
      hora_evento || null,
      color || '#4A90E2', 
      tipo_evento || 'recordatorio', 
      nivel_importancia || 'Medio', 
      recordatorio_activo !== undefined ? recordatorio_activo : 1,
      recordatorio_minutos || 15, 
      ubicacion || null, 
      notas_adicionales || null
    ];

    // Verificar que no hay undefined
    for (let i = 0; i < params.length; i++) {
      if (params[i] === undefined) {
        console.error(`Parámetro ${i} es undefined:`, params[i]);
        params[i] = null;
      }
    }
    
    const result = await query(sql, params);

    return {
      id: result.insertId,
      userId,
      titulo,
      descripcion,
      fechaEvento: fecha_evento,
      horaEvento: hora_evento,
      color,
      tipoEvento: tipo_evento,
      nivelImportancia: nivel_importancia,
      recordatorioActivo: recordatorio_activo,
      recordatorioMinutos: recordatorio_minutos,
      ubicacion,
      notasAdicionales: notas_adicionales,
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
      fecha_evento,
      hora_evento,
      color,
      tipo_evento,
      nivel_importancia,
      recordatorio_activo,
      recordatorio_minutos,
      ubicacion,
      notas_adicionales
    } = eventData;

    const sql = `
      UPDATE ${this.tableName} 
      SET titulo = ?, descripcion = ?, fecha_evento = ?, hora_evento = ?,
          color = ?, tipo_evento = ?, nivel_importancia = ?, recordatorio_activo = ?,
          recordatorio_minutos = ?, ubicacion = ?, notas_adicionales = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ? AND activo = TRUE
    `;

    const result = await query(sql, [
      titulo, descripcion, fecha_evento, hora_evento,
      color, tipo_evento, nivel_importancia, recordatorio_activo,
      recordatorio_minutos, ubicacion, notas_adicionales,
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
      SET activo = FALSE, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ? AND activo = TRUE
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
    let whereClause = 'WHERE user_id = ? AND activo = TRUE';
    let params = [userId];

    if (filters.mes) {
      whereClause += ' AND MONTH(fecha_evento) = ?';
      params.push(filters.mes);
    }

    if (filters.año) {
      whereClause += ' AND YEAR(fecha_evento) = ?';
      params.push(filters.año);
    }

    const sql = `
      SELECT 
        COUNT(*) as total_eventos,
        COUNT(DISTINCT tipo_evento) as tipos_diferentes,
        COUNT(CASE WHEN nivel_importancia = 'Alto' THEN 1 END) as eventos_importantes,
        COUNT(CASE WHEN fecha_evento >= CURDATE() THEN 1 END) as eventos_futuros,
        COUNT(CASE WHEN fecha_evento < CURDATE() THEN 1 END) as eventos_pasados
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
      userId: row.user_id,
      titulo: row.titulo,
      descripcion: row.descripcion,
      fechaEvento: row.fecha_evento,
      horaEvento: row.hora_evento,
      color: row.color,
      tipoEvento: row.tipo_evento,
      nivelImportancia: row.nivel_importancia,
      recordatorioActivo: row.recordatorio_activo,
      recordatorioMinutos: row.recordatorio_minutos,
      ubicacion: row.ubicacion,
      notasAdicionales: row.notas_adicionales,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

module.exports = CalendarRepository;
