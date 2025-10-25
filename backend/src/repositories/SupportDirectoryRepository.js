/**
 * Repository para Directorio de Apoyos
 * Maneja el acceso a datos de la base de datos
 */

const { query } = require('../../config/database');
const SupportDirectory = require('../valueObjects/SupportDirectory');

class SupportDirectoryRepository {
  /**
   * Obtener todos los directorios de apoyo
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Promise<Array>}
   */
  async findAll(filters = {}) {
    let whereClause = 'WHERE a.activo = TRUE';
    let params = [];

    if (filters.categoria) {
      whereClause += ' AND a.categoria_id = ?';
      params.push(filters.categoria);
    }

    // Municipio no disponible en la tabla actual
    // if (filters.municipio) {
    //   whereClause += ' AND a.municipio = ?';
    //   params.push(filters.municipio);
    // }

    if (filters.search) {
      whereClause += ' AND (a.nombre LIKE ? OR a.descripcion LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    const sql = `
      SELECT 
        a.id, a.nombre, a.descripcion, a.telefono, a.email,
        a.direccion, a.latitud, a.longitud, a.horario_atencion,
        c.nombre as categoria_nombre, c.icono as categoria_icono, c.color as categoria_color
      FROM apoyos a
      JOIN apoyo_categoria c ON c.id = a.categoria_id
      ${whereClause}
      ORDER BY a.nombre ASC
    `;

    const results = await query(sql, params);
    return results.map(row => new SupportDirectory({
      id: row.id,
      nombre: row.nombre,
      categoria: row.categoria_nombre,
      descripcion: row.descripcion,
      contacto: row.telefono,
      horario: row.horario_atencion,
      ubicacion: row.direccion,
      latitud: row.latitud,
      longitud: row.longitud,
      activo: true
    }));
  }

  /**
   * Obtener directorio por ID
   * @param {number} id 
   * @returns {Promise<SupportDirectory|null>}
   */
  async findById(id) {
    const sql = `
      SELECT 
        a.id, a.nombre, a.descripcion, a.telefono, a.email,
        a.direccion, a.latitud, a.longitud, a.horario_atencion,
        c.nombre as categoria_nombre, c.icono as categoria_icono, c.color as categoria_color
      FROM apoyos a
      JOIN apoyo_categoria c ON c.id = a.categoria_id
      WHERE a.id = ? AND a.activo = TRUE
    `;

    const results = await query(sql, [id]);
    
    if (results.length === 0) {
      return null;
    }

    const row = results[0];
    return new SupportDirectory({
      id: row.id,
      nombre: row.nombre,
      categoria: row.categoria_nombre,
      descripcion: row.descripcion,
      contacto: row.telefono,
      horario: row.horario_atencion,
      ubicacion: row.direccion,
      latitud: row.latitud,
      longitud: row.longitud,
      activo: true
    });
  }

  /**
   * Buscar directorios cercanos por coordenadas
   * @param {number} lat 
   * @param {number} lng 
   * @param {number} radius 
   * @returns {Promise<Array>}
   */
  async findNearby(lat, lng, radius = 10) {
    const sql = `
      SELECT 
        a.id, a.nombre, a.descripcion, a.telefono, a.email,
        a.direccion, a.latitud, a.longitud, a.horario_atencion,
        c.nombre as categoria_nombre, c.icono as categoria_icono, c.color as categoria_color,
        (6371 * acos(cos(radians(?)) * cos(radians(a.latitud)) * 
         cos(radians(a.longitud) - radians(?)) + sin(radians(?)) * 
         sin(radians(a.latitud)))) AS distancia
      FROM apoyos a
      JOIN apoyo_categoria c ON c.id = a.categoria_id
      WHERE a.activo = TRUE 
      AND a.latitud IS NOT NULL 
      AND a.longitud IS NOT NULL
      HAVING distancia <= ?
      ORDER BY distancia ASC
    `;

    const results = await query(sql, [lat, lng, lat, radius]);
    return results.map(row => new SupportDirectory({
      id: row.id,
      nombre: row.nombre,
      categoria: row.categoria_nombre,
      descripcion: row.descripcion,
      contacto: row.telefono,
      horario: row.horario_atencion,
      ubicacion: row.direccion,
      latitud: row.latitud,
      longitud: row.longitud,
      activo: true
    }));
  }

  /**
   * Registrar llamada a directorio
   * @param {number} directorioId 
   * @param {number} usuarioId 
   * @param {string} notas 
   * @returns {Promise<Object>}
   */
  async logCall(directorioId, usuarioId, notas = '') {
    // Obtener datos del directorio
    const directorio = await this.findById(directorioId);
    if (!directorio) {
      throw new Error('Directorio no encontrado');
    }

    const sql = `
      INSERT INTO historial_llamadas (
        usuario_id, numero_telefono, nombre_contacto, tipo_llamada, notas, relacion_tabla, relacion_id
      ) VALUES (?, ?, ?, 'saliente', ?, 'apoyos', ?)
    `;

    const result = await query(sql, [
      usuarioId,
      directorio.contacto,
      directorio.nombre,
      notas,
      directorioId
    ]);

    return {
      id: result.insertId,
      directorio_id: directorioId,
      numero_telefono: directorio.contacto,
      nombre_contacto: directorio.nombre,
      notas
    };
  }
}

module.exports = SupportDirectoryRepository;
