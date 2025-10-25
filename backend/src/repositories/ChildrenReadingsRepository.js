/**
 * Repository para Lecturas Infantiles
 * Maneja el acceso a datos de libros infantiles
 */

const { query } = require('../../config/database');

class ChildrenReadingsRepository {
  constructor() {
    this.tableName = 'biblioteca_item';
  }

  /**
   * Obtener todos los libros infantiles con filtros
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Promise<Array>}
   */
  async findAll(filters = {}) {
    let whereClause = 'WHERE b.activo = TRUE AND b.nivel_educativo IN ("preescolar", "primaria")';
    let params = [];

    if (filters.categoria) {
      whereClause += ' AND b.categoria = ?';
      params.push(filters.categoria);
    }

    if (filters.search) {
      whereClause += ' AND (b.titulo LIKE ? OR b.descripcion LIKE ? OR b.autor LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const sql = `
      SELECT 
        b.id, b.titulo, b.descripcion, b.nivel_educativo, b.categoria,
        b.url_recurso as archivo_url, b.autor, b.tipo, b.edad_recomendada,
        b.idioma, b.visualizaciones, b.activo, b.created_at, b.updated_at
      FROM ${this.tableName} b
      ${whereClause}
      ORDER BY b.nivel_educativo ASC, b.categoria ASC, b.titulo ASC
    `;

    const results = await query(sql, params);
    return results.map(row => ({
      id: row.id,
      titulo: row.titulo,
      descripcion: row.descripcion,
      nivelEducativo: row.nivel_educativo,
      categoria: row.categoria,
      archivoUrl: row.archivo_url,
      autor: row.autor,
      tipo: row.tipo,
      edadRecomendada: row.edad_recomendada,
      idioma: row.idioma,
      visualizaciones: row.visualizaciones,
      activo: row.activo,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  }

  /**
   * Obtener libro infantil por ID
   * @param {number} id 
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    const sql = `
      SELECT 
        b.id, b.titulo, b.descripcion, b.nivel_educativo, b.categoria,
        b.url_recurso as archivo_url, b.autor, b.tipo, b.edad_recomendada,
        b.idioma, b.visualizaciones, b.activo, b.created_at, b.updated_at
      FROM ${this.tableName} b
      WHERE b.id = ? AND b.activo = TRUE 
      AND b.nivel_educativo IN ("preescolar", "primaria")
    `;

    const results = await query(sql, [id]);
    
    if (results.length === 0) {
      return null;
    }

    const row = results[0];
    return {
      id: row.id,
      titulo: row.titulo,
      descripcion: row.descripcion,
      nivelEducativo: row.nivel_educativo,
      categoria: row.categoria,
      archivoUrl: row.archivo_url,
      autor: row.autor,
      tipo: row.tipo,
      edadRecomendada: row.edad_recomendada,
      idioma: row.idioma,
      visualizaciones: row.visualizaciones,
      activo: row.activo,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  /**
   * Obtener categorías de libros infantiles
   * @returns {Promise<Array>}
   */
  async getCategories() {
    const sql = `
      SELECT DISTINCT 
        b.categoria,
        COUNT(*) as total_libros,
        MIN(b.nivel_educativo) as nivel_minimo,
        MAX(b.nivel_educativo) as nivel_maximo
      FROM ${this.tableName} b
      WHERE b.activo = TRUE 
      AND b.nivel_educativo IN ("preescolar", "primaria")
      GROUP BY b.categoria
      ORDER BY total_libros DESC, b.categoria ASC
    `;

    const results = await query(sql);
    return results.map(row => ({
      categoria: row.categoria,
      totalLibros: row.total_libros,
      nivelMinimo: row.nivel_minimo,
      nivelMaximo: row.nivel_maximo
    }));
  }

  /**
   * Obtener estadísticas de libros infantiles
   * @returns {Promise<Object>}
   */
  async getStatistics() {
    const sql = `
      SELECT 
        COUNT(*) as total_libros,
        COUNT(DISTINCT categoria) as total_categorias,
        COUNT(CASE WHEN nivel_educativo = 'preescolar' THEN 1 END) as libros_preescolar,
        COUNT(CASE WHEN nivel_educativo = 'primaria' THEN 1 END) as libros_primaria,
        SUM(visualizaciones) as total_visualizaciones
      FROM ${this.tableName}
      WHERE activo = TRUE 
      AND nivel_educativo IN ("preescolar", "primaria")
    `;

    const [stats] = await query(sql);

    // Estadísticas por categoría
    const statsByCategory = await query(`
      SELECT 
        categoria,
        COUNT(*) as total_libros,
        AVG(visualizaciones) as promedio_visualizaciones
      FROM ${this.tableName}
      WHERE activo = TRUE 
      AND nivel_educativo IN ("preescolar", "primaria")
      GROUP BY categoria
      ORDER BY total_libros DESC
    `);

    return {
      ...stats,
      por_categoria: statsByCategory
    };
  }
}

module.exports = ChildrenReadingsRepository;
