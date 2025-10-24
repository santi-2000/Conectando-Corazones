/**
 * Repository para Libros Educativos
 * Maneja el acceso a datos de la base de datos
 */

const { query } = require('../../config/database');
const EducationalBook = require('../valueObjects/EducationalBook');

class EducationalBookRepository {
  constructor() {
    this.tableName = 'biblioteca_item';
  }

  /**
   * Obtener todos los libros educativos con filtros
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Promise<Array>}
   */
  async findAll(filters = {}) {
    let whereClause = 'WHERE b.activo = TRUE';
    let params = [];

    if (filters.nivel_educativo) {
      whereClause += ' AND b.nivel_educativo = ?';
      params.push(filters.nivel_educativo);
    }

    if (filters.materia) {
      whereClause += ' AND b.materia = ?';
      params.push(filters.materia);
    }

    if (filters.search) {
      whereClause += ' AND (b.titulo LIKE ? OR b.descripcion LIKE ? OR b.autor LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const sql = `
      SELECT 
        b.id, b.titulo, b.descripcion, b.nivel_educativo, b.categoria as materia,
        b.url_recurso as archivo_url, b.autor, b.tipo, b.edad_recomendada,
        b.idioma, b.visualizaciones, b.activo, b.created_at, b.updated_at
      FROM ${this.tableName} b
      ${whereClause}
      ORDER BY b.nivel_educativo ASC, b.categoria ASC, b.titulo ASC
    `;

    const results = await query(sql, params);
    return results.map(row => new EducationalBook(row));
  }

  /**
   * Obtener libro por ID
   * @param {number} id 
   * @returns {Promise<EducationalBook|null>}
   */
  async findById(id) {
    const sql = `
      SELECT 
        b.id, b.titulo, b.descripcion, b.nivel_educativo, b.categoria as materia,
        b.url_recurso as archivo_url, b.autor, b.tipo, b.edad_recomendada,
        b.idioma, b.visualizaciones, b.activo, b.created_at, b.updated_at
      FROM ${this.tableName} b
      WHERE b.id = ? AND b.activo = TRUE
    `;

    const results = await query(sql, [id]);
    
    if (results.length === 0) {
      return null;
    }

    return new EducationalBook(results[0]);
  }

  /**
   * Obtener libros por nivel educativo
   * @param {string} nivel 
   * @returns {Promise<Array>}
   */
  async findByLevel(nivel) {
    const sql = `
      SELECT 
        b.id, b.titulo, b.descripcion, b.nivel_educativo, b.categoria as materia,
        b.url_recurso as archivo_url, b.autor, b.tipo, b.edad_recomendada,
        b.idioma, b.visualizaciones, b.activo, b.created_at, b.updated_at
      FROM ${this.tableName} b
      WHERE b.nivel_educativo = ? AND b.activo = TRUE
      ORDER BY b.categoria ASC, b.titulo ASC
    `;

    const results = await query(sql, [nivel]);
    return results.map(row => new EducationalBook(row));
  }

  /**
   * Obtener materias disponibles por nivel
   * @param {string} nivel 
   * @returns {Promise<Array>}
   */
  async getSubjectsByLevel(nivel) {
    const sql = `
      SELECT DISTINCT categoria as materia, COUNT(*) as total_libros
      FROM ${this.tableName}
      WHERE nivel_educativo = ? AND activo = TRUE
      GROUP BY categoria
      ORDER BY categoria ASC
    `;

    const results = await query(sql, [nivel]);
    return results;
  }

  /**
   * Registrar descarga de libro
   * @param {number} libroId 
   * @param {number} usuarioId 
   * @returns {Promise<Object>}
   */
  async logDownload(libroId, usuarioId) {
    const sql = `
      INSERT INTO metricas_event (
        evento, usuario_id, datos_adicionales, created_at
      ) VALUES (?, ?, ?, NOW())
    `;

    const datosAdicionales = JSON.stringify({
      tipo: 'descarga_libro',
      libro_id: libroId,
      timestamp: new Date().toISOString()
    });

    const result = await query(sql, [
      'descarga_libro_educativo',
      usuarioId,
      datosAdicionales
    ]);

    return {
      id: result.insertId,
      libro_id: libroId,
      usuario_id: usuarioId,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Obtener estadísticas de libros
   * @returns {Promise<Object>}
   */
  async getStatistics() {
    const sql = `
      SELECT 
        COUNT(*) as total_libros,
        COUNT(DISTINCT nivel_educativo) as total_niveles,
        COUNT(DISTINCT categoria) as total_materias,
        SUM(visualizaciones) as total_visualizaciones
      FROM ${this.tableName}
      WHERE activo = TRUE
    `;

    const [stats] = await query(sql);

    // Estadísticas por nivel
    const statsByLevel = await query(`
      SELECT 
        nivel_educativo,
        COUNT(*) as total_libros,
        COUNT(DISTINCT categoria) as total_materias
      FROM ${this.tableName}
      WHERE activo = TRUE
      GROUP BY nivel_educativo
      ORDER BY nivel_educativo ASC
    `);

    return {
      ...stats,
      por_nivel: statsByLevel
    };
  }
}

module.exports = new EducationalBookRepository();
